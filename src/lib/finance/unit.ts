import type { SimParams } from "./types";

/** Contribuição unitária por pagante/mês antes de clubes gratuitos, aquisição e estrutura. */
export function unitContribution(p: Pick<SimParams, "price" | "taxRate" | "paymentRate" | "lossReserveRate" | "variableServiceCost">): number {
  const deductions = p.price * (p.taxRate + p.paymentRate + p.lossReserveRate);
  return p.price - deductions - p.variableServiceCost;
}

export function unitBreakdown(p: Pick<SimParams, "price" | "taxRate" | "paymentRate" | "lossReserveRate" | "variableServiceCost">) {
  return {
    price: p.price,
    taxes: p.price * p.taxRate,
    payments: p.price * p.paymentRate,
    lossReserve: p.price * p.lossReserveRate,
    variableService: p.variableServiceCost,
    contribution: unitContribution(p),
  };
}

/**
 * Payback por coorte: contribuição acumulada esperada de um cliente, considerando retenção,
 * menos o CAC. Retorna a curva por ciclo e o primeiro ciclo em que o acumulado é >= 0.
 */
export function paybackCurve(contribution: number, cac: number, churn: number, cycles = 12) {
  const rows: { cycle: number; retained: number; contributionCum: number; net: number }[] = [];
  let cum = 0;
  let cycle: number | null = null;
  for (let c = 1; c <= cycles; c++) {
    const retained = Math.pow(1 - churn, c - 1);
    cum += contribution * retained;
    const net = cum - cac;
    if (cycle === null && net >= 0) cycle = c;
    rows.push({ cycle: c, retained, contributionCum: cum, net });
  }
  return { rows, paybackCycle: cycle };
}

/**
 * Pagantes de equilíbrio (plano 10.4):
 * (estrutura fixa + operação gratuita dos clubes) / (contribuição - churn × CAC de reposição)
 */
export function breakEvenPayers(fixed: number, contribution: number, churn: number, replacementCac = 50, clubOps = 5000): number {
  const denom = contribution - churn * replacementCac;
  if (denom <= 0) return Infinity;
  return Math.ceil((fixed + clubOps) / denom);
}
