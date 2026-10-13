import type { MonthlyInputs, MonthResult, SimOutput, SimParams } from "./types";
import { breakEvenPayers, paybackCurve, unitContribution } from "./unit";

/**
 * Simulação mensal. Fórmulas centrais (plano 11.2):
 * clubes ativos = clubes anteriores × (1 − perda) + ativações brutas
 * novos pagantes = testes por canal × conversão
 * base paga = base anterior × (1 − churn) + novos pagantes
 * MRR = base paga × preço
 * resultado = contribuição − clubes gratuitos − aquisição variável − estrutura fixa
 * Comissão de clube contada uma única vez por aquisição originada no clube.
 */
export function simulate(p: SimParams, inputs: MonthlyInputs[]): SimOutput {
  const unit = unitContribution(p);
  const months: MonthResult[] = [];
  let prevClubs = 0;
  let prevBase = 0;
  let revenueCum = 0;
  let resultCum = 0;
  let acqCostCum = 0;
  let newPayersCum = 0;
  let fixedCum = 0;
  let maxDeficit = 0;
  let maxDeficitMonth = 0;
  let firstPositive: number | null = null;
  const acq = { clubs: 0, races: 0, social: 0 };
  const n = Math.min(p.months, inputs.length);

  for (let i = 0; i < n; i++) {
    const m = i + 1;
    const inp = inputs[i];
    const retainedClubs = prevClubs * (1 - p.clubLossRate);
    const activeClubs = retainedClubs + inp.newClubs;
    const eligible = inp.newClubs * p.eligiblePerNewClub + retainedClubs * p.eligiblePerRetainedClub;
    const trialsClubs = eligible * p.clubTrialAdoption;
    const trialsSocial = inp.socialTrials;
    const trialsRaces = inp.raceTrials;
    const trials = trialsClubs + trialsSocial + trialsRaces;

    const newClubsPayers = trialsClubs * p.trialConversion;
    const newSocial = trialsSocial * p.trialConversion;
    const newRaces = trialsRaces * p.trialConversion;
    const newPayers = newClubsPayers + newSocial + newRaces;

    const churned = prevBase * p.churn;
    const base = prevBase - churned + newPayers;
    const mrr = base * p.price;
    revenueCum += mrr;

    const taxes = mrr * p.taxRate;
    const payments = mrr * p.paymentRate;
    const lossReserve = mrr * p.lossReserveRate;
    const variableService = base * p.variableServiceCost;
    const variableCosts = taxes + payments + lossReserve + variableService;
    const contribution = base * unit;

    const clubOps = activeClubs * p.clubOpsCostPerClub;
    const commissions = newClubsPayers * p.clubCommission;
    const activation = inp.newClubs * p.clubActivationCost;
    const trialCosts = trials * p.trialCost;
    const socialAcq = newSocial * p.socialCostPerPayer;
    const raceAcq = newRaces * p.raceCostPerPayer;
    const acquisition = commissions + activation + trialCosts + socialAcq + raceAcq;

    const q = Math.min(3, Math.floor(i / 3));
    const fixed = p.fixedCostGrowth[q];

    const result = contribution - clubOps - acquisition - fixed;
    resultCum += result;
    const cash = -p.initialInvestment + resultCum;
    if (cash < maxDeficit) { maxDeficit = cash; maxDeficitMonth = m; }
    if (firstPositive === null && result > 0) firstPositive = m;

    acqCostCum += acquisition;
    newPayersCum += newPayers;
    fixedCum += fixed;
    acq.clubs += newClubsPayers; acq.races += newRaces; acq.social += newSocial;

    const cacVariable = newPayers > 0 ? acquisition / newPayers : 0;
    const cacComplete = newPayers > 0 ? (acquisition + fixed * p.fixedAllocationToCac) / newPayers : 0;

    months.push({
      m, activeClubs, eligible, trialsClubs, trialsSocial, trialsRaces, trials,
      newClubs: newClubsPayers, newSocial, newRaces, newPayers, churned, base, mrr, revenueCum,
      taxes, payments, lossReserve, variableService, variableCosts, contribution,
      clubOps, commissions, activation, trialCosts, socialAcq, raceAcq, acquisition, fixed,
      result, resultCum, cash, cacVariable, cacComplete,
    });
    prevClubs = activeClubs;
    prevBase = base;
  }

  const last = months[months.length - 1];
  const cacVariableAvg = newPayersCum > 0 ? acqCostCum / newPayersCum : 0;
  const cacCompleteAvg = newPayersCum > 0 ? (acqCostCum + fixedCum * p.fixedAllocationToCac) / newPayersCum : 0;
  const { paybackCycle } = paybackCurve(unit, p.referenceCac, p.churn, 24);
  const total = acq.clubs + acq.races + acq.social || 1;

  return {
    months,
    summary: {
      payersEnd: last?.base ?? 0,
      mrrEnd: last?.mrr ?? 0,
      revenueCum,
      resultCum,
      resultEnd: last?.result ?? 0,
      firstPositiveMonth: firstPositive,
      maxDeficit: Math.abs(maxDeficit),
      maxDeficitMonth,
      cacVariableAvg,
      cacCompleteAvg,
      newPayersTotal: newPayersCum,
      contributionUnit: unit,
      paybackCycle,
      breakEvenPayers: breakEvenPayers(p.fixedCostQ1, unit, p.churn),
      cashNeedWithReserve: Math.abs(maxDeficit) * 1.2,
      acqShare: { clubs: acq.clubs / total, races: acq.races / total, social: acq.social / total },
    },
  };
}

/** Sensibilidade: grade de resultado acumulado ou payback para duas variáveis. */
export function sensitivityGrid<T>(
  rowsValues: number[],
  colsValues: number[],
  fn: (row: number, col: number) => T,
): T[][] {
  return rowsValues.map((r) => colsValues.map((c) => fn(r, c)));
}
