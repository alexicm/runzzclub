import { describe, expect, it } from "vitest";
import { unitContribution, paybackCurve, breakEvenPayers, simulate, reversePlan, simulateClubs } from "@/lib/finance";
import { DEFAULT_PARAMS, SCENARIO_INPUTS, SCENARIO_PARAMS, REFERENCE_TABLE } from "@/data/finance-defaults";

describe("economia unitária (plano 10.1)", () => {
  it("contribuição de R$ 27,42 por pagante/mês", () => {
    expect(unitContribution(DEFAULT_PARAMS)).toBeCloseTo(27.42, 2);
  });
  it("sensibilidade à taxa de pagamentos", () => {
    expect(unitContribution({ ...DEFAULT_PARAMS, paymentRate: 0.05 })).toBeCloseTo(29.42, 1);
    expect(unitContribution({ ...DEFAULT_PARAMS, paymentRate: 0.30 })).toBeCloseTo(19.44, 1);
  });
});

describe("payback por coorte (plano 10.3)", () => {
  it("recupera CAC de R$ 80 no quarto ciclo com churn de 7%", () => {
    const { rows, paybackCycle } = paybackCurve(27.42, 80, 0.07, 12);
    expect(paybackCycle).toBe(4);
    expect(rows[0].net).toBeCloseTo(-52.58, 2);
    expect(rows[1].net).toBeCloseTo(-27.08, 2);
    expect(rows[2].net).toBeCloseTo(-3.36, 2);
    expect(rows[3].net).toBeCloseTo(18.69, 2);
    expect(rows[5].net).toBeCloseTo(58.28, 2);
    expect(rows[11].net).toBeCloseTo(147.74, 2);
  });
});

describe("ponto de equilíbrio (plano 10.4)", () => {
  it("1.673 pagantes com R$ 35 mil de estrutura", () => {
    expect(breakEvenPayers(35000, 27.42, 0.07)).toBe(1673);
    expect(breakEvenPayers(50000, 27.42, 0.07)).toBe(2300);
    expect(breakEvenPayers(65000, 27.42, 0.07)).toBe(2927);
  });
});

describe("cenário de referência (plano 11.3 e 11.4)", () => {
  const p = { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.referencia };
  const out = simulate(p, SCENARIO_INPUTS.referencia);
  it("reproduz a base paga mensal com tolerância de arredondamento", () => {
    for (const row of REFERENCE_TABLE) {
      const m = out.months[row.m - 1];
      expect(Math.abs(m.base - row.base)).toBeLessThanOrEqual(1.5);
    }
  });
  it("reproduz receita e resultado do M1", () => {
    expect(out.months[0].mrr).toBeCloseTo(3072, 0);
    expect(out.months[0].result).toBeCloseTo(-37013, 0);
  });
  it("resultado acumulado de 12 meses próximo de −R$ 286 mil e M11 positivo", () => {
    expect(Math.abs(out.summary.resultCum - -286107)).toBeLessThan(600);
    expect(out.summary.firstPositiveMonth).toBe(11);
    expect(Math.abs(out.summary.maxDeficit - 434115)).toBeLessThan(600);
    expect(Math.abs(out.summary.mrrEnd - 232486)).toBeLessThan(100);
  });
  it("cenário conservador não alcança resultado positivo", () => {
    const c = simulate({ ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.conservador }, SCENARIO_INPUTS.conservador);
    expect(c.summary.firstPositiveMonth).toBeNull();
    expect(Math.abs(c.summary.payersEnd - 610)).toBeLessThan(2);
  });
  it("cenário de expansão fica positivo no M9", () => {
    const e = simulate({ ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.expansao }, SCENARIO_INPUTS.expansao);
    expect(e.summary.firstPositiveMonth).toBe(9);
  });
});

describe("consistência das regras", () => {
  it("aumentar churn reduz a base final", () => {
    const p = { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.referencia };
    const a = simulate(p, SCENARIO_INPUTS.referencia).summary.payersEnd;
    const b = simulate({ ...p, churn: 0.12 }, SCENARIO_INPUTS.referencia).summary.payersEnd;
    expect(b).toBeLessThan(a);
  });
  it("comissão contada uma vez por aquisição de clube", () => {
    const p = { ...DEFAULT_PARAMS, ...SCENARIO_PARAMS.referencia };
    const out = simulate(p, SCENARIO_INPUTS.referencia);
    const m = out.months[0];
    expect(m.commissions).toBeCloseTo(m.newClubs * p.clubCommission, 6);
  });
});

describe("planejamento reverso (capítulo 12)", () => {
  it("atinge a meta no último ciclo e exige mais novos pagantes que a meta", () => {
    const r = reversePlan({ target: 10000, cycles: 6, churn: 0.07, trialConversion: 0.35, trialAdoption: 0.3, curve: "linear", share: { clubs: 0.4, races: 0.2, social: 0.4 } });
    expect(r.baseByMonth[5]).toBeCloseTo(10000, 3);
    expect(r.newPayersTotal).toBeGreaterThan(10000);
    expect(r.trialsTotal).toBeCloseTo(r.newPayersTotal / 0.35, 6);
    expect(r.contactsTotal).toBeCloseTo(r.trialsTotal / 0.3, 6);
  });
});

describe("clubes (capítulo 08)", () => {
  it("comissão consome a primeira mensalidade bruta", () => {
    const r = simulateClubs({ clubs: 1, eligiblePerClub: 100, trialAdoption: 0.3, trialConversion: 0.35, price: 39.9, unitContribution: 27.42, commission: 39.9, activationCost: 100, opsCostPerClub: 22, trialCost: 1.2, churn: 0.07, horizonMonths: 6 });
    expect(r.commissions).toBeCloseTo(r.firstMonthRevenue, 6);
    expect(r.firstMonthNet).toBeLessThan(0);
  });
});
