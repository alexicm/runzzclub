"use client";
import { useMemo, useState } from "react";
import { CHANNELS, FUNNEL_STAGES, type ChannelId } from "@/data/channels";
import { useRunz } from "@/lib/store";
import { fmtInt, fmtPct, fmtBRL } from "@/lib/finance";
import { Slider } from "@/components/ui/Slider";
import { Segmented } from "@/components/ui/Segmented";
import { AnimatedNumber } from "@/components/ui/Stat";
import { cn } from "@/lib/cn";

type Sel = ChannelId | "todos";
interface ChState { leads: number; toSignup: number; toTrial: number; toPaid: number; }
const COLOR: Record<ChannelId, string> = { clubs: "var(--runz-lime)", races: "var(--runz-offwhite)", social: "var(--runz-pink)" };

function stages(c: ChState, churn: number) {
  const interesse = c.leads;
  const cadastro = interesse * c.toSignup;
  const vip = cadastro; // lista VIP = cadastro no MVP
  const teste = vip * c.toTrial;
  const cobranca = teste * c.toPaid;
  const ativa = cobranca;
  const renovacao = ativa * (1 - churn);
  return [interesse, cadastro, vip, teste, cobranca, ativa, renovacao];
}

export function AcquisitionFunnel() {
  const churn = useRunz((s) => s.params.churn);
  const trialConv = useRunz((s) => s.params.trialConversion);
  const [sel, setSel] = useState<Sel>("todos");
  const [st, setSt] = useState<Record<ChannelId, ChState>>(() => Object.fromEntries(CHANNELS.map((c) => [c.id, { ...c.defaults, toPaid: trialConv }])) as Record<ChannelId, ChState>);
  const per = useMemo(() => Object.fromEntries(CHANNELS.map((c) => [c.id, stages(st[c.id], churn)])) as Record<ChannelId, number[]>, [st, churn]);
  const totals = useMemo(() => FUNNEL_STAGES.map((_, i) => CHANNELS.reduce((a, c) => a + per[c.id][i], 0)), [per]);
  const shown = sel === "todos" ? totals : per[sel];
  const max = shown[0] || 1;
  const chan = sel === "todos" ? null : CHANNELS.find((c) => c.id === sel)!;
  const cost = sel === "todos" ? CHANNELS.reduce((a, c) => a + per[c.id][4] * c.costPerPayer, 0) : per[sel][4] * chan!.costPerPayer;
  const upd = (id: ChannelId, k: keyof ChState, v: number) => setSt((s) => ({ ...s, [id]: { ...s[id], [k]: v } }));

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Segmented<Sel> size="sm" options={[{ value: "todos", label: "Todos os canais" }, ...CHANNELS.map((c) => ({ value: c.id, label: c.short }))]} value={sel} onChange={setSel} />
          <span className="ui text-[11px] text-faint">Pessoas contadas uma única vez por canal; sem dupla contagem entre canais.</span>
        </div>
        {/* fluxo */}
        <div className="relative grid grid-cols-[88px_1fr] gap-3 md:grid-cols-[120px_1fr]">
          <div className="flex flex-col justify-around gap-2 py-1">
            {CHANNELS.map((c) => (
              <button key={c.id} onClick={() => setSel(sel === c.id ? "todos" : c.id)} className={cn("ui flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[12px] transition-opacity", sel !== "todos" && sel !== c.id ? "opacity-35" : "opacity-100", sel === c.id ? "border-offwhite/70" : "border-line")}>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLOR[c.id] }} />
                <span className="min-w-0"><span className="block truncate font-semibold text-offwhite">{c.short}</span><span className="num block text-[11px] text-muted">{fmtInt(per[c.id][4])} pag.</span></span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {FUNNEL_STAGES.map((s, i) => {
              const v = shown[i];
              const w = Math.max(6, (v / max) * 100);
              const prev = i > 0 ? shown[i - 1] : null;
              return (
                <div key={s.id} className="grid grid-cols-[110px_1fr_64px] items-center gap-2 md:grid-cols-[150px_1fr_80px]">
                  <span className="ui text-[12px] text-offwhite/85">{s.label}</span>
                  <div className="relative h-7 overflow-hidden rounded-md bg-offwhite/6">
                    {sel === "todos" ? (
                      <div className="flex h-full" style={{ width: `${w}%`, transition: "width .5s cubic-bezier(.22,1,.36,1)" }}>
                        {CHANNELS.map((c) => <div key={c.id} className="h-full" style={{ width: `${(per[c.id][i] / (v || 1)) * 100}%`, background: COLOR[c.id], marginRight: 2 }} />)}
                      </div>
                    ) : (
                      <div className="h-full rounded-md" style={{ width: `${w}%`, background: COLOR[sel], transition: "width .5s cubic-bezier(.22,1,.36,1)" }} />
                    )}
                  </div>
                  <span className="num text-right text-[13px] text-offwhite"><AnimatedNumber value={v} format={fmtInt} />{prev ? <span className="ml-1 text-[10px] text-faint">{fmtPct(v / (prev || 1))}</span> : null}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="ui mt-1 grid grid-cols-3 gap-3 rounded-2xl border border-line p-3 text-[12px]">
          <div><div className="eyebrow">Assinantes estimados</div><div className="num text-2xl text-lime"><AnimatedNumber value={shown[5]} format={fmtInt} /></div></div>
          <div><div className="eyebrow">Custo variável estimado</div><div className="num text-2xl text-offwhite"><AnimatedNumber value={cost} format={fmtBRL} /></div></div>
          <div><div className="eyebrow">Renovam após 1 ciclo</div><div className="num text-2xl text-offwhite"><AnimatedNumber value={shown[6]} format={fmtInt} /></div><div className="text-faint">churn {fmtPct(churn)} do simulador</div></div>
        </div>
      </div>

      <div className="scroll-thin flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4" data-noswipe>
        {chan ? (
          <>
            <div><div className="eyebrow">{chan.name}</div><div className="ui text-[12px] text-muted">Responsáveis: {chan.owners.join(" e ")}</div></div>
            <div className="grid gap-3">
              <Slider label="Volume de interessados por ciclo" value={st[chan.id].leads} min={0} max={5000} step={50} onChange={(v) => upd(chan.id, "leads", v)} format={fmtInt} />
              <Slider label="Interesse → cadastro" value={st[chan.id].toSignup} min={0.02} max={1} step={0.01} onChange={(v) => upd(chan.id, "toSignup", v)} format={fmtPct} />
              <Slider label="Cadastro → teste" value={st[chan.id].toTrial} min={0.05} max={1} step={0.01} onChange={(v) => upd(chan.id, "toTrial", v)} format={fmtPct} />
              <Slider label="Teste → primeira cobrança" value={st[chan.id].toPaid} min={0.05} max={0.8} step={0.01} onChange={(v) => upd(chan.id, "toPaid", v)} format={fmtPct} hint={`Simulador financeiro usa ${fmtPct(trialConv)} como referência.`} />
            </div>
            <div className="grid gap-3 ui text-[12.5px] md:grid-cols-2">
              <div><div className="eyebrow mb-1">Etapas</div><ol className="list-decimal pl-4 text-offwhite/85">{chan.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
              <div><div className="eyebrow mb-1">Metas</div><ul className="list-disc pl-4 text-offwhite/85">{chan.goals.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div><div className="eyebrow mb-1">Custos (hipótese)</div><p className="text-offwhite/85">{chan.costs}</p></div>
              <div><div className="eyebrow mb-1">Gargalos</div><ul className="list-disc pl-4 text-offwhite/85">{chan.bottlenecks.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
          </>
        ) : (
          <>
            <div className="eyebrow">Três canais, três contas</div>
            <p className="body text-[14px] text-offwhite/85">Cada canal tem experimento, metas e custo próprios. Selecione um canal para ajustar volumes e conversões e ver o impacto no número de assinantes.</p>
            <ul className="ui flex flex-col gap-2 text-[12.5px]">
              {CHANNELS.map((c) => (
                <li key={c.id} className="flex items-start gap-2 rounded-xl border border-line p-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLOR[c.id] }} />
                  <span><span className="font-semibold text-offwhite">{c.name}</span> · {c.owners.join(" e ")}<br /><span className="text-muted">{c.goals[0]} · custo {fmtBRL(c.costPerPayer)}/pagante além do teste</span></span>
                </li>
              ))}
            </ul>
            <p className="ui text-[11.5px] text-faint">Volumes iniciais são hipóteses de planejamento (plano, seção 11.2), não contatos realizados.</p>
          </>
        )}
      </div>
    </div>
  );
}
