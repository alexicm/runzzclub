"use client";
import { useMemo, useRef } from "react";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { Segmented } from "@/components/ui/Segmented";
import { Slider } from "@/components/ui/Slider";
import { Stat } from "@/components/ui/Stat";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { useRunz } from "@/lib/store";
import { fmtBRL, fmtBRL2, fmtInt } from "@/lib/finance";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import type { ChapterProps } from "@/components/presentation/Deck";

type Mode = "operacional" | "agressivo" | "personalizado";
const CYCLES = ["dez/26", "jan/27", "fev/27", "mar/27", "abr/27", "mai/27"];

export function Ch03Meta({ active }: ChapterProps) {
  const target = useRunz((s) => s.targetSubscribers);
  const setTarget = useRunz((s) => s.setTarget);
  const price = useRunz((s) => s.params.price);
  const mode: Mode = target === 1500 ? "operacional" : target === 10000 ? "agressivo" : "personalizado";
  const mrr = target * price;
  const svg = useRef<SVGSVGElement>(null);

  // curva ilustrativa: base cresce até a meta no 6º ciclo (forma de rampa, não previsão)
  const pts = useMemo(() => CYCLES.map((_, i) => { const t = (i + 1) / 6; return Math.round(target * (t * t * 0.55 + t * 0.45)); }), [target]);
  const W = 720, H = 250, padL = 14, padB = 28, padT = 34;
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${padL + (i / 5) * (W - padL * 2)} ${H - padB - (v / target) * (H - padB - padT)}`).join(" ");

  useGSAP(() => {
    const el = svg.current; if (!el || !active) return;
    const p = el.querySelector<SVGPathElement>("[data-line]"); if (!p) return;
    const len = p.getTotalLength();
    if (prefersReducedMotion()) { gsap.set(p, { strokeDasharray: len, strokeDashoffset: 0 }); return; }
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.out", delay: 0.3 });
    gsap.fromTo(el.querySelectorAll("[data-dot]"), { scale: 0, transformOrigin: "center" }, { scale: 1, duration: 0.4, stagger: 0.12, delay: 0.6, ease: "back.out(2)" });
  }, { scope: svg, dependencies: [active, target] });

  return (
    <SlideFrame active={active} n="03" eyebrow="Onde queremos chegar?" title={<>180 dias para validar um <span className="text-lime">negócio escalável.</span></>}
      headerRight={<Segmented<Mode> options={[{ value: "operacional", label: "Meta operacional" }, { value: "agressivo", label: "Cenário agressivo" }, { value: "personalizado", label: "Personalizado" }]} value={mode} onChange={(m) => setTarget(m === "operacional" ? 1500 : m === "agressivo" ? 10000 : 3000)} />}>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="md:hidden"><Segmented<Mode> size="sm" options={[{ value: "operacional", label: "1.500" }, { value: "agressivo", label: "10.000" }, { value: "personalizado", label: "Outro" }]} value={mode} onChange={(m) => setTarget(m === "operacional" ? 1500 : m === "agressivo" ? 10000 : 3000)} /></div>
          <div data-reveal className="grid gap-5 sm:grid-cols-2">
            <Stat label="Assinantes pagantes no 6º ciclo" value={target} format={fmtInt} size="xl" tone={mode === "agressivo" ? "pink" : "lime"} />
            <Stat label="MRR bruto equivalente" value={mrr} format={fmtBRL} size="md" className="md:[&_.num]:text-5xl" note={`${fmtInt(target)} × ${fmtBRL2(price)} por mês. Receita mensal bruta, não lucro.`} />
          </div>
          <div data-reveal>
            <Slider label="Meta de assinantes pagantes" value={target} min={100} max={12000} step={100} onChange={setTarget} format={fmtInt} hint="Arraste para ver a implicação financeira. O valor é uma meta, não uma projeção realizada." />
          </div>
          <div data-reveal className="grid grid-cols-2 gap-3 ui text-[13px]">
            <div className="rounded-2xl border border-line p-4">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-1"><span className="eyebrow">Meta operacional</span><EvidenceTag kind="proposta" /></div>
              <p className="num text-2xl text-lime">1.500</p>
              <p className="text-muted">pagantes no sexto ciclo de cobrança. MRR de R$ 59.850.</p>
            </div>
            <div className="rounded-2xl border border-line p-4">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-1"><span className="eyebrow">Cenário agressivo</span><EvidenceTag kind="hipotese" /></div>
              <p className="num text-2xl text-pink">10.000</p>
              <p className="text-muted">condicionado à demonstração de capacidade de aquisição e retenção. MRR de R$ 399.000.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div data-reveal className="rounded-2xl border border-line bg-ink/40 p-4">
            <div className="mb-2 flex items-center justify-between"><span className="eyebrow">Evolução ilustrativa da base até a meta</span><EvidenceTag kind="simulacao" /></div>
            <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Curva ilustrativa da base de assinantes crescendo até ${fmtInt(target)} no sexto ciclo`}>
              <defs><linearGradient id="g3" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--runz-pink)" stopOpacity="0.35" /><stop offset="1" stopColor="var(--runz-pink)" stopOpacity="0" /></linearGradient></defs>
              {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={padL} x2={W - padL} y1={H - padB - f * (H - padB - padT)} y2={H - padB - f * (H - padB - padT)} stroke="rgba(239,232,218,0.12)" />)}
              <path d={`${path} L ${W - padL} ${H - padB} L ${padL} ${H - padB} Z`} fill="url(#g3)" />
              <path data-line d={path} fill="none" stroke="var(--runz-pink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((v, i) => { const x = padL + (i / 5) * (W - padL * 2), y = H - padB - (v / target) * (H - padB - padT); return (
                <g key={i}>
                  <circle data-dot cx={x} cy={y} r="6" fill="var(--runz-deep)" stroke="var(--runz-pink)" strokeWidth="3" />
                  <text x={x} y={y - 14} textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"} fill="var(--runz-offwhite)" fontSize="13" fontFamily="var(--font-ui)" fontWeight="700">{fmtInt(v)}</text>
                  <text x={x} y={H - 8} textAnchor={i === 0 ? "start" : i === 5 ? "end" : "middle"} fill="rgba(239,232,218,0.55)" fontSize="11" fontFamily="var(--font-ui)">C{i + 1} · {CYCLES[i]}</text>
                </g>
              ); })}
            </svg>
          </div>
          <div data-reveal className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 ui text-[12.5px]">
            <span className="eyebrow self-center">Execução</span>
            <div className="flex overflow-hidden rounded-lg border border-line">{["out", "nov", "dez", "jan", "fev", "mar"].map((m) => <span key={m} className="flex-1 border-r border-line py-1.5 text-center text-offwhite/85 last:border-0">{m}</span>)}</div>
            <span className="eyebrow self-center">Cobrança</span>
            <div className="flex overflow-hidden rounded-lg border border-pink/50">{["", "", "C1 dez", "C2 jan", "C3 fev", "C4 mar", "C5 abr", "C6 mai"].slice(2).map((m) => <span key={m} className="flex-1 border-r border-pink/30 bg-pink/10 py-1.5 text-center text-pink last:border-0">{m}</span>)}</div>
          </div>
          <Note>O calendário de execução vai de outubro de 2026 a março de 2027. Um primeiro ciclo de cobrança em dezembro leva o sexto ciclo até maio de 2027.</Note>
        </div>
      </div>
    </SlideFrame>
  );
}
