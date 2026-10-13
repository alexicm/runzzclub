"use client";
import { useMemo, useRef, useState } from "react";
import { PHASES, CRITICAL_PATHS } from "@/data/roadmap";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { Slider } from "@/components/ui/Slider";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { fmtDate } from "@/lib/finance";
import { cn } from "@/lib/cn";

const T0 = new Date(2026, 9, 13).getTime(); // 13/10/2026
const T1 = new Date(2027, 2, 31).getTime(); // 31/03/2027
const day = 86400000;
const toX = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return ((new Date(y, m - 1, d).getTime() - T0) / (T1 - T0)) * 100; };
const shift = (iso: string, days: number) => { const [y, m, d] = iso.split("-").map(Number); const t = new Date(y, m - 1, d).getTime() + days * day; const n = new Date(t); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`; };
const MONTHS = [{ l: "out", iso: "2026-10-13" }, { l: "nov", iso: "2026-11-01" }, { l: "dez", iso: "2026-12-01" }, { l: "jan", iso: "2027-01-01" }, { l: "fev", iso: "2027-02-01" }, { l: "mar", iso: "2027-03-01" }];

export function InteractiveRoadmap({ active }: { active: boolean }) {
  const [sel, setSel] = useState(0);
  const [delayNode, setDelayNode] = useState<string | null>(null);
  const [delayDays, setDelayDays] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  // o atraso em um nó do caminho crítico desloca as fases a partir da fase 03 (homologação) ou 04 (piloto)
  const affected = useMemo(() => {
    if (!delayNode || delayDays === 0) return new Set<string>();
    const path = CRITICAL_PATHS.find((c) => c.nodes.some((n) => n.id === delayNode))!;
    const idx = path.nodes.findIndex((n) => n.id === delayNode);
    return new Set(path.nodes.slice(idx).map((n) => n.id));
  }, [delayNode, delayDays]);
  const phaseShift = (i: number) => (delayNode && delayDays > 0 && i >= 2 ? delayDays : 0);

  useGSAP(() => {
    if (!active || !root.current) return;
    const bars = root.current.querySelectorAll("[data-bar]");
    if (prefersReducedMotion()) { gsap.set(bars, { scaleX: 1, opacity: 1 }); return; }
    gsap.fromTo(bars, { scaleX: 0, opacity: 0, transformOrigin: "left center" }, { scaleX: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", delay: 0.3 });
  }, { scope: root, dependencies: [active] });

  const ph = PHASES[sel];
  return (
    <div ref={root} className="flex min-h-0 flex-1 flex-col gap-4">
      {/* linha do tempo */}
      <div className="rounded-2xl border border-line bg-ink/30 p-3 md:p-4" data-noswipe>
        <div className="relative mb-1 h-5">{MONTHS.map((m) => <span key={m.l} className="ui absolute text-[11px] uppercase tracking-[0.12em] text-faint" style={{ left: `${toX(m.iso)}%` }}>{m.l}</span>)}</div>
        <div className="relative h-[150px] md:h-[164px]">
          {MONTHS.map((m) => <span key={m.l} className="absolute top-0 h-full w-px bg-offwhite/8" style={{ left: `${toX(m.iso)}%` }} />)}
          {PHASES.map((p, i) => {
            const s = shift(p.start, phaseShift(i)), e = shift(p.end, phaseShift(i));
            const x = toX(s), w = Math.max(3, toX(e) - x);
            const on = i === sel;
            return (
              <button key={p.id} data-bar onClick={() => setSel(i)} aria-pressed={on} className="absolute flex h-[22px] items-center text-left" style={{ left: `${x}%`, width: `${w}%`, top: i * 26 }} title={`${p.title}: ${fmtDate(s)} a ${fmtDate(e)}`}>
                <span className={cn("block h-full w-full rounded-md border transition-colors", on ? "border-offwhite bg-offwhite" : phaseShift(i) ? "border-warn/70 bg-warn/30" : i >= 3 ? "border-dashed border-pink/60 bg-pink/15" : "border-lime/60 bg-lime/25")} />
                <span className={cn("ui absolute whitespace-nowrap text-[11px] font-semibold", w > 22 ? "left-2 text-ink" : "left-[calc(100%+8px)]", w > 22 && !on && "text-offwhite", on && w <= 22 && "text-offwhite", !on && w <= 22 && (phaseShift(i) ? "text-warn" : "text-offwhite/85"))}><span className="num mr-1 opacity-70">{p.n}</span>{p.title}<span className="ml-1.5 font-normal opacity-60">{fmtDate(s)}</span></span>
              </button>
            );
          })}
        </div>
        <div className="ui mt-1 flex flex-wrap gap-x-4 text-[11px] text-faint"><span><span className="mr-1 inline-block h-2 w-3 rounded-sm bg-lime/40 align-middle" />Planejado</span><span><span className="mr-1 inline-block h-2 w-3 rounded-sm border border-dashed border-pink/60 align-middle" />Condicionado à homologação</span><span><span className="mr-1 inline-block h-2 w-3 rounded-sm bg-warn/40 align-middle" />Deslocado por atraso simulado</span></div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_1fr]">
        {/* detalhe da fase */}
        <div className="scroll-thin lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4">
          <div className="flex items-start justify-between gap-2">
            <div><div className="eyebrow">Fase {ph.n} · {ph.window}</div><h3 className="display text-2xl text-offwhite">{ph.title.toLowerCase()}</h3></div>
            <EvidenceTag kind="proposta" label={sel >= 3 ? "Condicionada" : "Proposta"} />
          </div>
          {ph.conditional && <p className="ui mt-2 text-[12px] text-warn">{ph.conditional}</p>}
          {phaseShift(sel) > 0 && <p className="ui mt-1 text-[12px] text-warn">Com o atraso simulado: {fmtDate(shift(ph.start, phaseShift(sel)))} a {fmtDate(shift(ph.end, phaseShift(sel)))}.</p>}
          <div className="mt-3 grid gap-3 ui text-[12.5px] md:grid-cols-2">
            <div><div className="eyebrow mb-1">Entregáveis</div><ul className="list-disc pl-4 text-offwhite/85">{ph.deliverables.map((d) => <li key={d}>{d}</li>)}</ul></div>
            <div><div className="eyebrow mb-1">Responsáveis</div><ul className="flex flex-wrap gap-1.5">{ph.owners.map((d) => <li key={d} className="rounded-full bg-offwhite/8 px-2.5 py-1">{d}</li>)}</ul>
              <div className="eyebrow mb-1 mt-3">Métricas</div><ul className="list-disc pl-4 text-offwhite/85">{ph.metrics.map((d) => <li key={d}>{d}</li>)}</ul></div>
          </div>
        </div>

        {/* caminho crítico */}
        <div className="scroll-thin flex flex-col gap-3 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4" data-noswipe>
          <div className="flex items-center justify-between"><span className="eyebrow">Caminho crítico · clique em um nó para simular atraso</span>{delayNode && <button onClick={() => { setDelayNode(null); setDelayDays(0); }} className="ui text-[11px] text-muted hover:text-offwhite">limpar</button>}</div>
          {CRITICAL_PATHS.map((cp) => (
            <div key={cp.id}>
              <div className="ui mb-1 text-[11px] text-faint">{cp.title}</div>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {cp.nodes.map((n, i) => { const hit = affected.has(n.id); const isSrc = delayNode === n.id; return (
                  <div key={n.id} className="flex items-center gap-1">
                    <button onClick={() => { setDelayNode(n.id); if (delayDays === 0) setDelayDays(7); }} className={cn("ui flex min-w-[96px] flex-col rounded-xl border px-2.5 py-1.5 text-left", isSrc ? "border-warn bg-warn/20" : hit ? "border-warn/60 bg-warn/8" : "border-line hover:border-offwhite/50")}>
                      <span className="text-[11.5px] font-semibold text-offwhite">{n.label}</span><span className="text-[10px] text-faint">{n.owner}</span>
                    </button>
                    {i < cp.nodes.length - 1 && <span className={cn("h-px w-3 shrink-0", hit ? "bg-warn" : "bg-offwhite/30")} />}
                  </div>
                ); })}
              </div>
            </div>
          ))}
          {delayNode && <Slider label="Atraso simulado no nó selecionado" value={delayDays} min={0} max={45} step={1} onChange={setDelayDays} format={(v) => `${v} dias`} hint={delayDays > 0 ? `Piloto passaria de 23/11 para ${fmtDate(shift("2026-11-23", delayDays))}; primeira cobrança de 07/12 para ${fmtDate(shift("2026-12-07", delayDays))}.` : "Arraste para ver as etapas afetadas."} />}
          <Note tone="warn">A janela de 30 a 45 dias citada em reunião (08/11 a 23/11, se contada desde 09/10) depende de confirmação técnica e não é promessa contratual.</Note>
        </div>
      </div>
    </div>
  );
}
