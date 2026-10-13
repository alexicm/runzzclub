"use client";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { simulateClubs, unitContribution, fmtBRL, fmtInt, fmtPct, fmtBRL2 } from "@/lib/finance";
import { useRunz } from "@/lib/store";
import { Slider } from "@/components/ui/Slider";
import { AnimatedNumber } from "@/components/ui/Stat";
import { Note } from "@/components/ui/Note";
import { cn } from "@/lib/cn";

export function RunClubSimulator() {
  const p = useRunz((s) => s.params);
  const [clubs, setClubs] = useState(5);
  const [eligible, setEligible] = useState(80);
  const [adoption, setAdoption] = useState(p.clubTrialAdoption);
  const [conv, setConv] = useState(p.trialConversion);
  const [horizon, setHorizon] = useState(6);
  const unit = unitContribution(p);
  const r = useMemo(() => simulateClubs({ clubs, eligiblePerClub: eligible, trialAdoption: adoption, trialConversion: conv, price: p.price, unitContribution: unit, commission: p.clubCommission, activationCost: p.clubActivationCost, opsCostPerClub: p.clubOpsCostPerClub, trialCost: p.trialCost, churn: p.churn, horizonMonths: horizon }), [clubs, eligible, adoption, conv, horizon, p, unit]);

  const flow = [
    { l: "Clube", v: clubs, f: fmtInt }, { l: "Evento", v: clubs * 2, f: (v: number) => `${fmtInt(v)} enc.` }, { l: "Participante", v: r.eligible, f: fmtInt },
    { l: "RUNZ (teste)", v: r.trials, f: fmtInt }, { l: "Assinatura", v: r.payers, f: fmtInt }, { l: "Comissão", v: r.commissions, f: fmtBRL },
  ];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="flex flex-col gap-3" data-noswipe>
        <div className="grid gap-2.5 rounded-2xl border border-line p-4">
          <Slider label="Clubes ativos" value={clubs} min={1} max={300} step={1} onChange={setClubs} format={fmtInt} />
          <Slider label="Participantes únicos elegíveis por clube" value={eligible} min={20} max={200} step={5} onChange={setEligible} format={fmtInt} />
          <Slider label="Iniciam teste" value={adoption} min={0.05} max={0.8} step={0.01} onChange={setAdoption} format={fmtPct} />
          <Slider label="Teste → assinatura" value={conv} min={0.05} max={0.8} step={0.01} onChange={setConv} format={fmtPct} />
          <Slider label="Horizonte de contribuição (meses)" value={horizon} min={1} max={12} step={1} onChange={setHorizon} format={(v) => `${v} m`} hint={`Churn de ${fmtPct(p.churn)} e contribuição de ${fmtBRL2(unit)}/mês vêm do simulador financeiro.`} />
        </div>
        <div className="ui grid grid-cols-2 gap-3 text-[12.5px]">
          <div className="rounded-2xl border border-lime/40 p-3"><div className="eyebrow text-lime">O clube recebe</div><ul className="mt-1 list-disc pl-4 text-offwhite/85"><li>Ferramenta gratuita de organização</li><li>Agenda, inscrições e check-in</li><li>Painel de participantes</li><li>Link de indicação</li></ul></div>
          <div className="rounded-2xl border border-pink/40 p-3"><div className="eyebrow text-pink">A RUNZ recebe</div><ul className="mt-1 list-disc pl-4 text-offwhite/85"><li>Visibilidade contextual</li><li>Interessados em treinamento</li><li>Aquisição rastreável</li><li>Conversão para assinatura</li></ul></div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-line bg-ink/40 p-3 no-scrollbar" data-noswipe>
          {flow.map((s, i) => (
            <div key={s.l} className="flex items-center gap-1">
              <div className={cn("ui flex min-w-[86px] flex-col rounded-xl px-2.5 py-2", i === flow.length - 1 ? "bg-pink/15" : i === 4 ? "bg-lime/15" : "bg-offwhite/6")}>
                <span className="text-[10px] uppercase tracking-[0.12em] text-faint">{s.l}</span>
                <span className="num text-[15px] text-offwhite"><AnimatedNumber value={s.v} format={s.f} /></span>
              </div>
              {i < flow.length - 1 && <ArrowRight size={14} className="shrink-0 text-faint" />}
            </div>
          ))}
        </div>
        <div className="ui grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-line p-4 text-[13px] md:grid-cols-3">
          <div><div className="eyebrow">Receita 1ª mensalidade</div><div className="num text-xl text-offwhite"><AnimatedNumber value={r.firstMonthRevenue} format={fmtBRL} /></div></div>
          <div><div className="eyebrow">Comissões (única)</div><div className="num text-xl text-pink"><AnimatedNumber value={r.commissions} format={fmtBRL} /></div></div>
          <div><div className="eyebrow">1ª mensalidade − comissão</div><div className={cn("num text-xl", r.firstMonthNet < 0 ? "text-bad" : "text-lime")}><AnimatedNumber value={r.firstMonthNet} format={fmtBRL} /></div><div className="text-[11px] text-faint">em contribuição, antes dos demais custos</div></div>
          <div><div className="eyebrow">Ativação + testes</div><div className="num text-xl text-offwhite"><AnimatedNumber value={r.activation + r.trialCosts} format={fmtBRL} /></div></div>
          <div><div className="eyebrow">Operação dos clubes ({horizon} m)</div><div className="num text-xl text-offwhite"><AnimatedNumber value={r.ops} format={fmtBRL} /></div></div>
          <div><div className="eyebrow">CAC variável do canal</div><div className="num text-xl text-offwhite"><AnimatedNumber value={r.cacVariable} format={fmtBRL2} /></div></div>
          <div className="col-span-2 md:col-span-3 grid grid-cols-2 gap-6 border-t border-line pt-3">
            <div><div className="eyebrow">Contribuição em {horizon} meses</div><div className="num text-2xl text-lime"><AnimatedNumber value={r.contributionHorizon} format={fmtBRL} /></div></div>
            <div><div className="eyebrow">Resultado de contribuição</div><div className={cn("num text-2xl", r.net < 0 ? "text-bad" : "text-lime")}><AnimatedNumber value={r.net} format={fmtBRL} /></div><div className="text-[11px] text-faint">contribuição − comissões − ativação − operação − testes</div></div>
          </div>
        </div>
        <Note tone="pink">A comissão única de {fmtBRL2(p.clubCommission)} consome toda a primeira mensalidade bruta de uma assinatura originada pelo clube, antes de tributos, taxas e serviço. Proposta a aprovar: sem comissão recorrente; sem comissão por teste, duplicidade, autorreferência ou cobrança cancelada ou estornada.</Note>
      </div>
    </div>
  );
}
