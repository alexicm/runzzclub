"use client";
import { useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { reversePlan, fmtInt, fmtPct, type Curve } from "@/lib/finance";
import { useRunz } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { AnimatedNumber } from "@/components/ui/Stat";
import { Note } from "@/components/ui/Note";
import { cn } from "@/lib/cn";

export function ReverseGoalPlanner() {
  const p = useRunz((s) => s.params);
  const [target, setTarget] = useState(10000);
  const [cycles, setCycles] = useState(6);
  const [churn, setChurn] = useState(p.churn);
  const [conv, setConv] = useState(p.trialConversion);
  const [adoption, setAdoption] = useState(0.3);
  const [curve, setCurve] = useState<Curve>("linear");
  const [clubs, setClubs] = useState(0.4);
  const [races, setRaces] = useState(0.2);
  const social = Math.max(0, 1 - clubs - races);
  const r = useMemo(() => reversePlan({ target, cycles, churn, trialConversion: conv, trialAdoption: adoption, curve, share: { clubs, races, social } }), [target, cycles, churn, conv, adoption, curve, clubs, races, social]);
  const maxNew = Math.max(...r.newPayersByMonth);
  const warnings: string[] = [];
  if (r.peakMonthlyTrials > 2800) warnings.push(`Pico de ${fmtInt(r.peakMonthlyTrials)} testes em um mês: acima do máximo do cenário de expansão do plano (2.800 testes de redes no M12).`);
  if (r.contactsTotal > 50000) warnings.push(`${fmtInt(r.contactsTotal)} contatos qualificados não têm comprovação comercial. A audiência de 397 mil seguidores não converte automaticamente.`);
  if (r.byChannel.clubs / (80 * 0.3 * conv * cycles) > 100) warnings.push(`Clubes: seriam necessários mais de ${fmtInt(r.byChannel.clubs / (80 * 0.3 * conv))} clubes-mês equivalentes (80 elegíveis e 30% de adesão por clube).`);
  if (churn >= 0.1) warnings.push("Churn de dois dígitos exige reposição constante; o plano considera 7% como referência.");

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[320px_1fr]">
      <div className="scroll-thin flex flex-col gap-2 pr-1 lg:min-h-0 lg:overflow-y-auto" data-noswipe>
        <Slider label="Meta de assinantes pagantes" value={target} min={500} max={20000} step={100} onChange={setTarget} format={fmtInt} />
        <Slider label="Prazo (ciclos pagos)" value={cycles} min={3} max={12} step={1} onChange={setCycles} format={(v) => `${v} ciclos`} />
        <Slider label="Churn mensal" value={churn} min={0.02} max={0.2} step={0.005} onChange={setChurn} format={fmtPct} />
        <Slider label="Conversão teste → pagante" value={conv} min={0.1} max={0.6} step={0.01} onChange={setConv} format={fmtPct} />
        <Slider label="Contatos qualificados → teste" value={adoption} min={0.05} max={0.6} step={0.01} onChange={setAdoption} format={fmtPct} />
        <div className="mt-1"><div className="eyebrow mb-1.5">Curva mensal de aquisição</div><Segmented<Curve> size="sm" options={[{ value: "linear", label: "Rampa" }, { value: "flat", label: "Constante" }, { value: "frontloaded", label: "Frente" }]} value={curve} onChange={setCurve} /></div>
        <div className="mt-1 border-t border-line pt-2"><div className="eyebrow mb-1">Participação de cada canal</div>
          <Slider label="Clubes" value={clubs} min={0} max={1 - races} step={0.05} onChange={setClubs} format={fmtPct} />
          <Slider label="Provas" value={races} min={0} max={1 - clubs} step={0.05} onChange={setRaces} format={fmtPct} />
          <div className="ui flex justify-between text-[12px]"><span className="text-muted">Redes</span><span className="num">{fmtPct(social)}</span></div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-line p-3"><div className="eyebrow">Novos pagantes acumulados</div><div className="num text-2xl text-lime md:text-3xl"><AnimatedNumber value={r.newPayersTotal} format={fmtInt} /></div><div className="ui text-[11px] text-faint">inclui <span className="num text-offwhite/80">{fmtInt(r.replacement)}</span> de reposição de cancelamentos</div></div>
          <div className="rounded-2xl border border-line p-3"><div className="eyebrow">Testes necessários</div><div className="num text-2xl text-offwhite md:text-3xl"><AnimatedNumber value={r.trialsTotal} format={fmtInt} /></div><div className="ui text-[11px] text-faint">÷ {fmtPct(conv)} de conversão</div></div>
          <div className="rounded-2xl border border-line p-3"><div className="eyebrow">Contatos qualificados</div><div className="num text-2xl text-pink md:text-3xl"><AnimatedNumber value={r.contactsTotal} format={fmtInt} /></div><div className="ui text-[11px] text-faint">÷ {fmtPct(adoption)} que iniciam teste</div></div>
          <div className="rounded-2xl border border-line p-3"><div className="eyebrow">Pico mensal</div><div className="num text-2xl text-offwhite md:text-3xl"><AnimatedNumber value={r.peakMonthlyNew} format={fmtInt} /></div><div className="ui text-[11px] text-faint">novos pagantes · {fmtInt(r.peakMonthlyTrials)} testes</div></div>
        </div>
        <div className="rounded-2xl border border-line bg-ink/30 p-3 md:p-4">
          <div className="mb-2 flex items-center justify-between"><span className="eyebrow">Novos pagantes por ciclo e base resultante</span><span className="ui text-[11px] text-faint">base no ciclo {cycles}: {fmtInt(r.baseByMonth[cycles - 1])}</span></div>
          <div className="flex h-40 items-end gap-1.5 pt-5 md:h-48">
            {r.newPayersByMonth.map((v, i) => (
              <div key={i} className="group flex h-full flex-1 flex-col items-center gap-1">
                <div className="relative w-full flex-1"><div className="absolute bottom-0 w-full rounded-t-[4px] bg-lime transition-[height] duration-500" style={{ height: `${(v / maxNew) * 100}%` }} title={`Ciclo ${i + 1}: ${fmtInt(v)} novos · base ${fmtInt(r.baseByMonth[i])}`} /><span className="num absolute inset-x-0 text-center text-[10px] text-muted" style={{ bottom: `calc(${(v / maxNew) * 100}% + 2px)` }}>{fmtInt(v)}</span></div>
                <span className="ui text-[10px] text-faint">C{i + 1} · {fmtInt(r.baseByMonth[i])}</span>
              </div>
            ))}
          </div>
          <div className="ui mt-2 grid grid-cols-3 gap-2 text-[12px]">
            <div className="rounded-lg bg-offwhite/6 px-2.5 py-1.5"><span className="text-muted">Clubes</span> <span className="num text-offwhite">{fmtInt(r.byChannel.clubs)}</span></div>
            <div className="rounded-lg bg-offwhite/6 px-2.5 py-1.5"><span className="text-muted">Provas</span> <span className="num text-offwhite">{fmtInt(r.byChannel.races)}</span></div>
            <div className="rounded-lg bg-offwhite/6 px-2.5 py-1.5"><span className="text-muted">Redes</span> <span className="num text-offwhite">{fmtInt(r.byChannel.social)}</span></div>
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-1.5">
          {warnings.length === 0 ? <Note>Nenhum alerta para este cenário. Ainda assim, os volumes são hipóteses até existirem contratos e coortes observadas.</Note> :
            warnings.map((w) => <p key={w} className={cn("ui flex items-start gap-2 rounded-lg border border-warn/50 px-3 py-2 text-[12px] text-warn")}><TriangleAlert size={14} className="mt-[1px] shrink-0" />{w}</p>)}
        </div>
      </div>
    </div>
  );
}
