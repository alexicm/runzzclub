"use client";
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useRunz } from "@/lib/store";
import { useSim } from "@/lib/useSim";
import { simulate, paybackCurve, breakEvenPayers, unitContribution, fmtBRL, fmtBRL2, fmtInt, fmtPct, fmtPct1, type ScenarioId } from "@/lib/finance";
import { SCENARIO_LABEL, SCENARIO_INPUTS, SCENARIO_PARAMS, DEFAULT_PARAMS, REFERENCE_SUMMARY } from "@/data/finance-defaults";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { AnimatedNumber } from "@/components/ui/Stat";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { SubscriberGrowthChart } from "@/components/charts/SubscriberGrowthChart";
import { MrrChart } from "@/components/charts/MrrChart";
import { CostComposition } from "@/components/charts/CostComposition";
import { PaybackCurve } from "@/components/charts/PaybackCurve";
import { CashFlowChart } from "@/components/charts/CashFlowChart";
import { SensitivityGrid } from "@/components/charts/SensitivityGrid";
import { cn } from "@/lib/cn";
import { scaledInputs } from "@/lib/useSim";

type View = "assinantes" | "mrr" | "custos" | "payback" | "caixa" | "sens-churn" | "sens-preco" | "comparar";
const VIEWS: { value: View; label: string }[] = [
  { value: "assinantes", label: "Assinantes" }, { value: "mrr", label: "MRR" }, { value: "custos", label: "Custos" }, { value: "payback", label: "Payback" },
  { value: "caixa", label: "Caixa" }, { value: "sens-churn", label: "Churn × CAC" }, { value: "sens-preco", label: "Preço × conversão" }, { value: "comparar", label: "Cenários" },
];

function Kpi({ label, value, format, tone, note, small }: { label: string; value: number; format: (v: number) => string; tone?: "lime" | "pink" | "bad" | "default"; note?: string; small?: boolean }) {
  const c = tone === "lime" ? "text-lime" : tone === "pink" ? "text-pink" : tone === "bad" ? "text-bad" : "text-offwhite";
  return (
    <div className="min-w-0">
      <div className="eyebrow !text-[10px] leading-tight">{label}</div>
      <div className={cn("num leading-tight", c, small ? "text-base xl:text-lg" : "text-lg xl:text-xl")}><AnimatedNumber value={value} format={format} /></div>
      {note && <div className="ui truncate text-[10.5px] text-faint">{note}</div>}
    </div>
  );
}

export function FinancialSimulator({ compact = false }: { compact?: boolean }) {
  const { out, params: p } = useSim();
  const scenario = useRunz((s) => s.scenario);
  const base = useRunz((s) => s.baseScenario);
  const scale = useRunz((s) => s.channelScale);
  const setScenario = useRunz((s) => s.setScenario);
  const setParam = useRunz((s) => s.setParam);
  const setScale = useRunz((s) => s.setChannelScale);
  const [view, setView] = useState<View>("assinantes");
  const s = out.summary;
  const unit = unitContribution(p);
  const pb = paybackCurve(unit, p.referenceCac, p.churn, 24).paybackCycle;

  const sensChurn = useMemo(() => {
    const churns = [0.04, 0.05, 0.07, 0.09, 0.12, 0.15], cacs = [40, 60, 80, 100, 130, 160];
    return { churns, cacs, values: churns.map((c) => cacs.map((cac) => paybackCurve(unit, cac, c, 36).paybackCycle ?? 99)) };
  }, [unit]);
  const sensPrice = useMemo(() => {
    const prices = [29.9, 34.9, 39.9, 49.9, 59.9, 89.9], convs = [0.2, 0.25, 0.3, 0.35, 0.4, 0.5];
    const inputs = scaledInputs(SCENARIO_INPUTS[base], scale);
    return { prices, convs, values: prices.map((pr) => convs.map((cv) => simulate({ ...p, price: pr, trialConversion: cv }, inputs).summary.resultCum)) };
  }, [p, base, scale]);
  const compare = useMemo(() => (["conservador", "referencia", "expansao"] as const).map((id) => ({ id, out: simulate({ ...DEFAULT_PARAMS, ...SCENARIO_PARAMS[id] }, SCENARIO_INPUTS[id]) })), []);

  const ctrl = (
    <div className="grid gap-2 md:gap-2.5" data-noswipe>
      <Slider label="Mensalidade" value={p.price} min={19.9} max={129.9} step={1} onChange={(v) => setParam("price", Number(v.toFixed(2)))} format={fmtBRL2} />
      <Slider label="Churn mensal" value={p.churn} min={0.01} max={0.25} step={0.005} onChange={(v) => setParam("churn", v)} format={fmtPct1} />
      <Slider label="Conversão de teste em pagante" value={p.trialConversion} min={0.05} max={0.7} step={0.01} onChange={(v) => setParam("trialConversion", v)} format={fmtPct} />
      <Slider label="CAC de referência (payback)" value={p.referenceCac} min={20} max={250} step={5} onChange={(v) => setParam("referenceCac", v)} format={fmtBRL} />
      <Slider label="Custo fixo mensal do 1º trimestre" value={p.fixedCostQ1} min={10000} max={120000} step={1000} onChange={(v) => { setParam("fixedCostQ1", v); setParam("fixedCostGrowth", [v, v + 10000, v + 20000, v + 30000]); }} format={fmtBRL} hint="Trimestres seguintes: +R$ 10 mil cada (hipótese)." />
      <div className="grid grid-cols-2 gap-x-4">
        <Slider label="Tributos sobre receita" value={p.taxRate} min={0} max={0.2} step={0.005} onChange={(v) => setParam("taxRate", v)} format={fmtPct1} />
        <Slider label="Pagamentos e plataformas" value={p.paymentRate} min={0} max={0.35} step={0.005} onChange={(v) => setParam("paymentRate", v)} format={fmtPct1} />
        <Slider label="Reserva de perdas" value={p.lossReserveRate} min={0} max={0.08} step={0.005} onChange={(v) => setParam("lossReserveRate", v)} format={fmtPct1} />
        <Slider label="Tecnologia e suporte / pagante" value={p.variableServiceCost} min={0} max={15} step={0.25} onChange={(v) => setParam("variableServiceCost", v)} format={fmtBRL2} />
      </div>
      <Slider label="Comissão única por conversão de clube" value={p.clubCommission} min={0} max={89.9} step={0.1} onChange={(v) => setParam("clubCommission", Number(v.toFixed(2)))} format={fmtBRL2} />
      <div className="mt-1 border-t border-line pt-2"><div className="eyebrow mb-1">Evolução mensal da aquisição por canal (× base {SCENARIO_LABEL[base]})</div>
        <div className="grid grid-cols-3 gap-x-3">
          <Slider label="Clubes" value={scale.clubs} min={0} max={3} step={0.1} onChange={(v) => setScale({ clubs: v })} format={(v) => `${v.toFixed(1)}×`} />
          <Slider label="Redes" value={scale.social} min={0} max={3} step={0.1} onChange={(v) => setScale({ social: v })} format={(v) => `${v.toFixed(1)}×`} />
          <Slider label="Provas" value={scale.races} min={0} max={3} step={0.1} onChange={(v) => setScale({ races: v })} format={(v) => `${v.toFixed(1)}×`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("grid h-full gap-4", compact ? "lg:grid-cols-[320px_1fr]" : "lg:grid-cols-[340px_1fr]")}>
      <div className="scroll-thin flex flex-col gap-3 lg:min-h-0 lg:overflow-y-auto pr-1">
        <div className="flex flex-wrap items-center gap-2">
          <Segmented<ScenarioId> size="sm" options={(["conservador", "referencia", "expansao", "personalizado"] as ScenarioId[]).map((v) => ({ value: v, label: SCENARIO_LABEL[v] }))} value={scenario} onChange={setScenario} />
          <button onClick={() => setScenario("referencia")} className="ui flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-muted hover:text-offwhite" title="Restaurar referência"><RotateCcw size={12} /> restaurar</button>
        </div>
        {ctrl}
        <p className="ui text-[11px] leading-snug text-faint">Hipóteses do plano (11/10/2026), não custos contratados. Parâmetros comerciais já definidos: mensalidade e comissão. Alterações aqui valem para todos os capítulos.</p>
      </div>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="grid grid-cols-3 gap-x-3 gap-y-3 rounded-2xl border border-line p-3 md:grid-cols-4 md:p-4 xl:grid-cols-6">
          <Kpi label="Pagantes M12" value={s.payersEnd} format={fmtInt} tone="lime" />
          <Kpi label="MRR bruto M12" value={s.mrrEnd} format={fmtBRL} />
          <Kpi label="Receita bruta 12m" value={s.revenueCum} format={fmtBRL} />
          <Kpi label="Contribuição/pagante" value={unit} format={fmtBRL2} note={`plano: ${fmtBRL2(REFERENCE_SUMMARY.contributionPerPayer)}`} />
          <Kpi label="CAC variável médio" value={s.cacVariableAvg} format={fmtBRL2} note={`completo ${fmtBRL2(s.cacCompleteAvg)}`} />
          <Kpi label="Payback do CAC" value={pb ?? 99} format={(v) => (v >= 99 ? "não ocorre" : `${v}º ciclo`)} tone={pb && pb <= 4 ? "lime" : "pink"} note={`CAC ${fmtBRL(p.referenceCac)} · churn ${fmtPct1(p.churn)}`} />
          <Kpi label="Churn" value={p.churn} format={fmtPct1} small />
          <Kpi label="Resultado 12m" value={s.resultCum} format={fmtBRL} tone={s.resultCum < 0 ? "bad" : "lime"} small />
          <Kpi label="1º mês positivo" value={s.firstPositiveMonth ?? 99} format={(v) => (v >= 99 ? "não ocorre" : `M${v}`)} small />
          <Kpi label="Necessidade de caixa" value={s.cashNeedWithReserve} format={fmtBRL} note={`déficit máx. ${fmtBRL(s.maxDeficit)} em M${s.maxDeficitMonth} + 20%`} small />
          <Kpi label="Ponto de equilíbrio" value={breakEvenPayers(p.fixedCostQ1, unit, p.churn)} format={(v) => (Number.isFinite(v) ? `${fmtInt(v)} pag.` : "inviável")} note="estrutura T1 + R$ 5 mil clubes" small />
          <Kpi label="Aquisição por canal" value={s.acqShare.clubs} format={(v) => `${fmtPct(v)} clubes`} note={`${fmtPct(s.acqShare.social)} redes · ${fmtPct(s.acqShare.races)} provas`} small />
        </div>

        <div className="scroll-thin -mx-1 flex gap-1 overflow-x-auto px-1 no-scrollbar" data-noswipe>
          {VIEWS.map((v) => <button key={v.value} onClick={() => setView(v.value)} className={cn("ui shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold", view === v.value ? "bg-offwhite text-ink" : "text-offwhite/70 hover:text-offwhite")}>{v.label}</button>)}
        </div>

        <div className="min-h-0 flex-1 rounded-2xl border border-line bg-ink/30 p-3 md:p-4">
          {view === "assinantes" && <SubscriberGrowthChart months={out.months} height={compact ? 220 : 280} />}
          {view === "mrr" && <MrrChart months={out.months} height={compact ? 220 : 280} />}
          {view === "custos" && <CostComposition months={out.months} height={compact ? 220 : 280} />}
          {view === "payback" && <PaybackCurve contribution={unit} cac={p.referenceCac} churn={p.churn} compare={{ contribution: 27.42, cac: 80, churn: 0.07, label: "Plano (R$ 27,42 · R$ 80 · 7%)" }} height={compact ? 220 : 280} />}
          {view === "caixa" && <CashFlowChart months={out.months} height={compact ? 220 : 280} />}
          {view === "sens-churn" && <SensitivityGrid rows={sensChurn.churns} cols={sensChurn.cacs} values={sensChurn.values} rowLabel="Churn" colLabel="CAC" rowFormat={fmtPct} colFormat={fmtBRL} format={(v) => (v >= 99 ? "—" : `${v}º`)} good="low" highlight={{ row: sensChurn.churns.findIndex((c) => Math.abs(c - p.churn) < 0.006), col: sensChurn.cacs.findIndex((c) => c === p.referenceCac) }} />}
          {view === "sens-preco" && <SensitivityGrid rows={sensPrice.prices} cols={sensPrice.convs} values={sensPrice.values} rowLabel="Preço" colLabel="Conversão" rowFormat={fmtBRL2} colFormat={fmtPct} format={(v) => fmtBRL(v / 1000).replace("R$", "") + " mil"} good="high" highlight={{ row: sensPrice.prices.findIndex((x) => Math.abs(x - p.price) < 0.5), col: sensPrice.convs.findIndex((x) => Math.abs(x - p.trialConversion) < 0.006) }} />}
          {view === "comparar" && (
            <div className="ui grid grid-cols-[1.2fr_repeat(4,1fr)] gap-x-3 gap-y-1.5 text-[12px]">
              <div /> {compare.map((c) => <div key={c.id} className="eyebrow">{SCENARIO_LABEL[c.id]}</div>)} <div className="eyebrow text-lime">Atual</div>
              {([
                ["Pagantes M12", (o: typeof out) => fmtInt(o.summary.payersEnd)],
                ["MRR M12", (o: typeof out) => fmtBRL(o.summary.mrrEnd)],
                ["Receita 12m", (o: typeof out) => fmtBRL(o.summary.revenueCum)],
                ["Resultado 12m", (o: typeof out) => fmtBRL(o.summary.resultCum)],
                ["1º mês positivo", (o: typeof out) => (o.summary.firstPositiveMonth ? `M${o.summary.firstPositiveMonth}` : "não ocorre")],
                ["Déficit máximo", (o: typeof out) => fmtBRL(o.summary.maxDeficit)],
                ["CAC variável", (o: typeof out) => fmtBRL2(o.summary.cacVariableAvg)],
                ["CAC completo", (o: typeof out) => fmtBRL2(o.summary.cacCompleteAvg)],
              ] as [string, (o: typeof out) => string][]).map(([l, f]) => (
                <div key={l} className="contents">
                  <div className="border-t border-line py-1.5 text-muted">{l}</div>
                  {compare.map((c) => <div key={c.id} className="num border-t border-line py-1.5 text-offwhite/85">{f(c.out)}</div>)}
                  <div className="num border-t border-line py-1.5 text-lime">{f(out)}</div>
                </div>
              ))}
              <p className="col-span-5 mt-2 text-[11px] text-faint">Cenários documentais recalculados pelo mesmo motor (plano 11.3: referência fecha M12 com 5.827 pagantes e −R$ 286 mil acumulados). Não forçar equivalência entre modelos com premissas diferentes.</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2"><EvidenceTag kind="simulacao" /><EvidenceTag kind="hipotese" label="Custos não contratados" /><span className="ui text-[11px] text-faint">Base paga = base retida + novos pagantes · MRR = base × mensalidade · payback por coorte com retenção · comissão contada uma vez.</span></div>
      </div>
    </div>
  );
}
