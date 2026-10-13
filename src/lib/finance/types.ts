export type ScenarioId = "conservador" | "referencia" | "expansao" | "personalizado";

export interface SimParams {
  price: number;
  taxRate: number;
  paymentRate: number;
  lossReserveRate: number;
  variableServiceCost: number;
  churn: number;
  trialConversion: number;
  referenceCac: number;
  fixedCostQ1: number;
  clubCommission: number;
  clubActivationCost: number;
  trialCost: number;
  socialCostPerPayer: number;
  raceCostPerPayer: number;
  clubOpsCostPerClub: number;
  clubLossRate: number;
  eligiblePerNewClub: number;
  eligiblePerRetainedClub: number;
  clubTrialAdoption: number;
  fixedCostGrowth: [number, number, number, number];
  initialInvestment: number;
  fixedAllocationToCac: number;
  months: number;
}

export interface MonthlyInputs {
  newClubs: number;
  socialTrials: number;
  raceTrials: number;
}

export interface MonthResult {
  m: number;
  activeClubs: number;
  eligible: number;
  trialsClubs: number;
  trialsSocial: number;
  trialsRaces: number;
  trials: number;
  newClubs: number;
  newSocial: number;
  newRaces: number;
  newPayers: number;
  churned: number;
  base: number;
  mrr: number;
  revenueCum: number;
  taxes: number;
  payments: number;
  lossReserve: number;
  variableService: number;
  variableCosts: number;
  contribution: number;
  clubOps: number;
  commissions: number;
  activation: number;
  trialCosts: number;
  socialAcq: number;
  raceAcq: number;
  acquisition: number;
  fixed: number;
  result: number;
  resultCum: number;
  cash: number;
  cacVariable: number;
  cacComplete: number;
}

export interface SimSummary {
  payersEnd: number;
  mrrEnd: number;
  revenueCum: number;
  resultCum: number;
  resultEnd: number;
  firstPositiveMonth: number | null;
  maxDeficit: number;
  maxDeficitMonth: number;
  cacVariableAvg: number;
  cacCompleteAvg: number;
  newPayersTotal: number;
  contributionUnit: number;
  paybackCycle: number | null;
  breakEvenPayers: number;
  cashNeedWithReserve: number;
  acqShare: { clubs: number; races: number; social: number };
}

export interface SimOutput {
  months: MonthResult[];
  summary: SimSummary;
}
