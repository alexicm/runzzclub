/** Simulador de clubes (capítulo 08). Resultado de contribuição de um ciclo de aquisição. */
export interface ClubSimParams {
  clubs: number;
  eligiblePerClub: number;
  trialAdoption: number;
  trialConversion: number;
  price: number;
  unitContribution: number;
  commission: number;
  activationCost: number;
  opsCostPerClub: number;
  trialCost: number;
  churn: number;
  horizonMonths: number; // meses de contribuição considerados por coorte
}

export function simulateClubs(p: ClubSimParams) {
  const eligible = p.clubs * p.eligiblePerClub;
  const trials = eligible * p.trialAdoption;
  const payers = trials * p.trialConversion;
  const firstMonthRevenue = payers * p.price;
  const commissions = payers * p.commission;
  const activation = p.clubs * p.activationCost;
  const ops = p.clubs * p.opsCostPerClub * p.horizonMonths;
  const trialCosts = trials * p.trialCost;
  // contribuição esperada da coorte ao longo do horizonte, com retenção
  let retainedSum = 0;
  for (let c = 0; c < p.horizonMonths; c++) retainedSum += Math.pow(1 - p.churn, c);
  const contributionHorizon = payers * p.unitContribution * retainedSum;
  const costs = commissions + activation + ops + trialCosts;
  return {
    eligible, trials, payers, firstMonthRevenue, commissions, activation, ops, trialCosts,
    contributionHorizon, costs, net: contributionHorizon - costs,
    firstMonthNet: payers * p.unitContribution - commissions, // primeira mensalidade vs comissão
    cacVariable: payers > 0 ? (commissions + activation + trialCosts) / payers : 0,
  };
}
