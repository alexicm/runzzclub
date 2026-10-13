/**
 * Planejamento reverso (capítulo 12): dada uma meta de pagantes no ciclo T,
 * quantos novos pagantes, testes e contatos qualificados são necessários.
 */
export type Curve = "linear" | "flat" | "frontloaded";

export interface ReverseParams {
  target: number;
  cycles: number;
  churn: number;
  trialConversion: number;
  trialAdoption: number; // % dos contatos qualificados que iniciam teste
  curve: Curve;
  share: { clubs: number; races: number; social: number };
}

export interface ReverseResult {
  weights: number[];
  newPayersByMonth: number[];
  baseByMonth: number[];
  newPayersTotal: number;
  replacement: number; // novos pagantes que apenas repõem cancelamentos
  trialsTotal: number;
  contactsTotal: number;
  byChannel: { clubs: number; races: number; social: number };
  peakMonthlyNew: number;
  peakMonthlyTrials: number;
}

function weights(curve: Curve, T: number): number[] {
  const w: number[] = [];
  for (let k = 1; k <= T; k++) {
    if (curve === "linear") w.push(k);
    else if (curve === "flat") w.push(1);
    else w.push(T - k + 1);
  }
  return w;
}

export function reversePlan(p: ReverseParams): ReverseResult {
  const T = Math.max(1, Math.round(p.cycles));
  const w = weights(p.curve, T);
  // base_T = Σ s·w_k·(1−churn)^(T−k)  →  s = target / Σ w_k (1−churn)^(T−k)
  let denom = 0;
  for (let k = 1; k <= T; k++) denom += w[k - 1] * Math.pow(1 - p.churn, T - k);
  const s = denom > 0 ? p.target / denom : 0;
  const newPayersByMonth = w.map((x) => s * x);
  const baseByMonth: number[] = [];
  let base = 0;
  for (let k = 0; k < T; k++) { base = base * (1 - p.churn) + newPayersByMonth[k]; baseByMonth.push(base); }
  const newPayersTotal = newPayersByMonth.reduce((a, b) => a + b, 0);
  const trialsTotal = p.trialConversion > 0 ? newPayersTotal / p.trialConversion : Infinity;
  const contactsTotal = p.trialAdoption > 0 ? trialsTotal / p.trialAdoption : Infinity;
  const peakMonthlyNew = Math.max(...newPayersByMonth);
  return {
    weights: w,
    newPayersByMonth,
    baseByMonth,
    newPayersTotal,
    replacement: newPayersTotal - p.target,
    trialsTotal,
    contactsTotal,
    byChannel: { clubs: newPayersTotal * p.share.clubs, races: newPayersTotal * p.share.races, social: newPayersTotal * p.share.social },
    peakMonthlyNew,
    peakMonthlyTrials: p.trialConversion > 0 ? peakMonthlyNew / p.trialConversion : Infinity,
  };
}
