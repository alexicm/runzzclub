"use client";
import { useRef, useState } from "react";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { COMPETITORS, MARKET_CONTEXT, type Competitor } from "@/data/competitors";
import { cn } from "@/lib/cn";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import type { ChapterProps } from "@/components/presentation/Deck";

const CONF = { alta: "Confiabilidade alta", media: "Confiabilidade média", baixa: "Hipótese / baixa" } as const;

export function Ch04Mercado({ active }: ChapterProps) {
  const [sel, setSel] = useState<Competitor>(COMPETITORS[0]);
  const svg = useRef<SVGSVGElement>(null);
  const W = 640, H = 420, P = 44;
  const px = (x: number) => P + x * (W - P * 2);
  const py = (y: number) => H - P - y * (H - P * 2);

  useGSAP(() => {
    if (!active || !svg.current) return;
    const dots = svg.current.querySelectorAll("[data-dot]");
    if (prefersReducedMotion()) { gsap.set(dots, { scale: 1, opacity: 1 }); return; }
    gsap.fromTo(dots, { scale: 0, opacity: 0, transformOrigin: "center" }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.8)", delay: 0.4 });
  }, { scope: svg, dependencies: [active] });

  return (
    <SlideFrame active={active} n="04" eyebrow="A oportunidade" title={<>o mercado já corre. a RUNZ precisa conquistar <span className="text-pink">a recorrência.</span></>}
      headerRight={<EvidenceTag kind="concorrente" label="Fontes públicas, não auditadas" />}>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div data-reveal className="rounded-2xl border border-line bg-ink/40 p-3 md:p-4">
          <div className="mb-1 flex items-center justify-between"><span className="eyebrow">Matriz competitiva</span><span className="ui text-[11px] text-faint">Clique em um ponto</span></div>
          <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Matriz competitiva: profundidade do treinamento no eixo horizontal, força de distribuição e comunidade no eixo vertical">
            {[0.25, 0.5, 0.75].map((f) => (<g key={f}><line x1={px(f)} x2={px(f)} y1={py(0)} y2={py(1)} stroke="rgba(239,232,218,0.08)" /><line y1={py(f)} y2={py(f)} x1={px(0)} x2={px(1)} stroke="rgba(239,232,218,0.08)" /></g>))}
            <line x1={px(0)} x2={px(1)} y1={py(0)} y2={py(0)} stroke="rgba(239,232,218,0.3)" />
            <line x1={px(0)} x2={px(0)} y1={py(0)} y2={py(1)} stroke="rgba(239,232,218,0.3)" />
            <text x={px(1)} y={H - 12} textAnchor="end" fill="rgba(239,232,218,0.6)" fontSize="11" fontFamily="var(--font-ui)" letterSpacing="1.5">PROFUNDIDADE DO TREINAMENTO →</text>
            <text x={14} y={py(1) - 8} fill="rgba(239,232,218,0.6)" fontSize="11" fontFamily="var(--font-ui)" letterSpacing="1.5">↑ DISTRIBUIÇÃO E COMUNIDADE</text>
            {COMPETITORS.map((c) => {
              const isR = c.id === "runz", isS = sel.id === c.id;
              return (
                <g key={c.id} data-dot className="cursor-pointer" onClick={() => setSel(c)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setSel(c); }} aria-label={c.name}>
                  <circle cx={px(c.x)} cy={py(c.y)} r={isS ? 22 : 16} fill={isR ? "var(--runz-lime)" : isS ? "var(--runz-pink)" : "rgba(239,232,218,0.14)"} stroke={isS ? "var(--runz-offwhite)" : isR ? "var(--runz-lime)" : "rgba(239,232,218,0.5)"} strokeWidth={isS ? 3 : 1.5} style={{ transition: "r .25s, fill .25s" }} />
                  <text x={px(c.x)} y={py(c.y) + (c.y > 0.6 ? 38 : -26)} textAnchor="middle" fill={isR ? "var(--runz-lime)" : "var(--runz-offwhite)"} fontSize="13" fontWeight="700" fontFamily="var(--font-ui)" fontStyle="italic">{c.name.replace(" (posição pretendida)", "")}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <div data-reveal className="scroll-thin flex-1 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><div className="eyebrow">{sel.type}</div><h3 className="display text-2xl text-offwhite md:text-3xl">{sel.name}</h3></div>
              <EvidenceTag kind={sel.id === "runz" ? "proposta" : "concorrente"} />
            </div>
            <p className={cn("body mt-2 text-sm", sel.id === "runy" ? "text-pink" : "text-offwhite/80")}>{sel.relation}</p>
            {(sel.monthly || sel.annual) && (
              <div className="ui mt-3 grid grid-cols-2 gap-3 text-[13px]">
                {sel.monthly && <div><div className="eyebrow">Mensal</div><div className="num text-base text-offwhite">{sel.monthly}</div></div>}
                {sel.annual && <div><div className="eyebrow">Anual</div><div className="num text-base text-offwhite">{sel.annual}</div></div>}
              </div>
            )}
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div><div className="eyebrow mb-1">Onde é forte</div><ul className="body list-disc pl-4 text-[13px] text-offwhite/85">{sel.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div><div className="eyebrow mb-1">O que aprendemos para o MVP</div><ul className="body list-disc pl-4 text-[13px] text-offwhite/85">{sel.learnings.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
            <div className="mt-3">
              <div className="eyebrow mb-1">Dados e fontes</div>
              <ul className="flex flex-col gap-1.5">
                {sel.facts.map((f) => (
                  <li key={f.text} className="ui rounded-lg border border-line px-3 py-2 text-[12.5px]">
                    <div className="text-offwhite/90">{f.text}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-faint"><span>{f.source}</span><span>{f.date}</span><span className={cn(f.confidence === "alta" ? "text-lime" : f.confidence === "media" ? "text-warn" : "text-pink")}>{CONF[f.confidence]}</span></div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div data-reveal className="ui grid gap-1.5 text-[12px]">
            {MARKET_CONTEXT.map((m) => (
              <div key={m.text} className="flex items-start gap-2 text-muted"><span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /><span><span className="text-offwhite/90">{m.text}</span> · {m.source}. <span className="text-faint">{m.note}</span></span></div>
            ))}
          </div>
          <Note tone="pink">Usuários registrados não são assinantes pagantes. Sem fonte confirmada, o dado aparece como hipótese. Nenhuma afirmação sobre faturamento ou lucro de concorrentes é tratada como verificada.</Note>
        </div>
      </div>
    </SlideFrame>
  );
}
