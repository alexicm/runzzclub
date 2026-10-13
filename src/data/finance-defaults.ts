import type { SimParams, MonthlyInputs, ScenarioId } from "@/lib/finance/types";

/** Parâmetros editáveis (seção 11 do briefing). Hipóteses do plano, não custos contratados. */
export const DEFAULT_PARAMS: SimParams = {
  price: 39.9,
  taxRate: 0.08,
  paymentRate: 0.10,
  lossReserveRate: 0.02,
  variableServiceCost: 4.5,
  churn: 0.07,
  trialConversion: 0.35,
  referenceCac: 80,
  fixedCostQ1: 35000,
  clubCommission: 39.9,
  // custos de aquisição por canal (plano, 10.2)
  clubActivationCost: 100,
  trialCost: 1.2,
  socialCostPerPayer: 45,
  raceCostPerPayer: 55,
  clubOpsCostPerClub: 22,
  clubLossRate: 0.03,
  eligiblePerNewClub: 80,
  eligiblePerRetainedClub: 15,
  clubTrialAdoption: 0.30,
  fixedCostGrowth: [35000, 45000, 55000, 65000],
  initialInvestment: 120000,
  fixedAllocationToCac: 0.25,
  months: 12,
};

/** Anexo A do plano: entradas mensais reproduzíveis por cenário. */
export const SCENARIO_INPUTS: Record<Exclude<ScenarioId, "personalizado">, MonthlyInputs[]> = {
  conservador: [
    { newClubs: 3, socialTrials: 60, raceTrials: 0 }, { newClubs: 2, socialTrials: 80, raceTrials: 0 }, { newClubs: 3, socialTrials: 100, raceTrials: 30 },
    { newClubs: 4, socialTrials: 120, raceTrials: 0 }, { newClubs: 4, socialTrials: 140, raceTrials: 50 }, { newClubs: 4, socialTrials: 160, raceTrials: 50 },
    { newClubs: 4, socialTrials: 180, raceTrials: 60 }, { newClubs: 4, socialTrials: 200, raceTrials: 60 }, { newClubs: 4, socialTrials: 220, raceTrials: 70 },
    { newClubs: 4, socialTrials: 240, raceTrials: 80 }, { newClubs: 4, socialTrials: 260, raceTrials: 90 }, { newClubs: 5, socialTrials: 300, raceTrials: 100 },
  ],
  referencia: [
    { newClubs: 5, socialTrials: 100, raceTrials: 0 }, { newClubs: 5, socialTrials: 150, raceTrials: 0 }, { newClubs: 10, socialTrials: 220, raceTrials: 100 },
    { newClubs: 15, socialTrials: 300, raceTrials: 0 }, { newClubs: 15, socialTrials: 400, raceTrials: 150 }, { newClubs: 20, socialTrials: 500, raceTrials: 200 },
    { newClubs: 25, socialTrials: 650, raceTrials: 250 }, { newClubs: 25, socialTrials: 800, raceTrials: 300 }, { newClubs: 30, socialTrials: 950, raceTrials: 350 },
    { newClubs: 30, socialTrials: 1100, raceTrials: 400 }, { newClubs: 40, socialTrials: 1250, raceTrials: 450 }, { newClubs: 40, socialTrials: 1400, raceTrials: 500 },
  ],
  expansao: [
    { newClubs: 10, socialTrials: 200, raceTrials: 0 }, { newClubs: 10, socialTrials: 300, raceTrials: 100 }, { newClubs: 15, socialTrials: 450, raceTrials: 150 },
    { newClubs: 20, socialTrials: 600, raceTrials: 200 }, { newClubs: 25, socialTrials: 800, raceTrials: 300 }, { newClubs: 30, socialTrials: 1000, raceTrials: 400 },
    { newClubs: 40, socialTrials: 1250, raceTrials: 500 }, { newClubs: 50, socialTrials: 1500, raceTrials: 650 }, { newClubs: 60, socialTrials: 1800, raceTrials: 800 },
    { newClubs: 70, socialTrials: 2100, raceTrials: 1000 }, { newClubs: 80, socialTrials: 2400, raceTrials: 1200 }, { newClubs: 90, socialTrials: 2800, raceTrials: 1500 },
  ],
};

/** Ajustes de parâmetros por cenário (plano, 11.2). */
export const SCENARIO_PARAMS: Record<Exclude<ScenarioId, "personalizado">, Partial<SimParams>> = {
  conservador: { clubLossRate: 0.05, eligiblePerNewClub: 60, eligiblePerRetainedClub: 10, clubTrialAdoption: 0.25, trialConversion: 0.25, churn: 0.12, fixedCostGrowth: [25000, 30000, 35000, 40000], fixedCostQ1: 25000 },
  referencia: { clubLossRate: 0.03, eligiblePerNewClub: 80, eligiblePerRetainedClub: 15, clubTrialAdoption: 0.30, trialConversion: 0.35, churn: 0.07, fixedCostGrowth: [35000, 45000, 55000, 65000], fixedCostQ1: 35000 },
  expansao: { clubLossRate: 0.02, eligiblePerNewClub: 100, eligiblePerRetainedClub: 20, clubTrialAdoption: 0.35, trialConversion: 0.40, churn: 0.04, fixedCostGrowth: [50000, 70000, 95000, 125000], fixedCostQ1: 50000 },
};

export const SCENARIO_LABEL: Record<ScenarioId, string> = {
  conservador: "Conservador", referencia: "Referência", expansao: "Expansão", personalizado: "Personalizado",
};

/** Tabela documental (plano 11.4). Referência, não operação realizada. */
export const REFERENCE_TABLE = [
  { m: 1, clubs: 5, newPayers: 77, base: 77, revenue: 3072, result: -37013 },
  { m: 2, clubs: 10, newPayers: 102, base: 174, revenue: 6933, result: -35646 },
  { m: 3, clubs: 20, newPayers: 211, base: 373, revenue: 14868, result: -36278 },
  { m: 4, clubs: 34, newPayers: 261, base: 607, revenue: 24236, result: -42431 },
  { m: 5, clubs: 48, newPayers: 370, base: 935, revenue: 37318, result: -39464 },
  { m: 6, clubs: 67, newPayers: 486, base: 1356, revenue: 54108, result: -34298 },
  { m: 7, clubs: 90, newPayers: 627, base: 1888, revenue: 75322, result: -37338 },
  { m: 8, clubs: 112, newPayers: 732, base: 2487, revenue: 99246, result: -26476 },
  { m: 9, clubs: 138, newPayers: 878, base: 3191, revenue: 127325, result: -15128 },
  { m: 10, clubs: 164, newPayers: 989, base: 3956, revenue: 157856, result: -10044 },
  { m: 11, clubs: 199, newPayers: 1182, base: 4861, revenue: 193969, result: 4087 },
  { m: 12, clubs: 233, newPayers: 1306, base: 5827, revenue: 232486, result: 23921 },
];

export const REFERENCE_SUMMARY = {
  contributionPerPayer: 27.42,
  paybackCycle: 4,
  cumulativeResult12m: -286107,
  maxDeficit: 434115,
  firstPositiveMonth: 11,
  breakEven35k: 1673,
};
