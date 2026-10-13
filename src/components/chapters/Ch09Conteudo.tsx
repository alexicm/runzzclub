"use client";
import { useState } from "react";
import { Camera, Play, Film } from "lucide-react";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { CONTENT_WEEK, DAYS, PILLARS, type ContentItem } from "@/data/content";
import { cn } from "@/lib/cn";
import type { ChapterProps } from "@/components/presentation/Deck";

const PILLAR_CLASS = { comunidade: "bg-pink", educacao: "bg-lime", cultura: "bg-offwhite", produto: "bg-offwhite/45" } as const;
const PILLAR_TEXT = { comunidade: "text-pink", educacao: "text-lime", cultura: "text-offwhite", produto: "text-offwhite/70" } as const;

function Preview({ item, big }: { item: ContentItem; big?: boolean }) {
  const isVertical = item.format.toLowerCase().includes("reel") || item.format.toLowerCase().includes("tiktok") || item.channel === "Stories" || item.format.includes("Demonstração") || item.format.includes("Cobertura");
  return (
    <div className={cn("relative w-full overflow-hidden rounded-2xl border border-line bg-ink", big ? (isVertical ? "aspect-[9/16]" : "aspect-square") : "aspect-[3/4]")}>
      <div className={cn("absolute inset-0 opacity-90", item.pillar === "comunidade" ? "bg-[radial-gradient(circle_at_30%_20%,rgba(255,2,90,.55),transparent_60%),#1d1d1d]" : item.pillar === "educacao" ? "bg-[radial-gradient(circle_at_70%_30%,rgba(184,247,5,.35),transparent_60%),#1d1d1d]" : item.pillar === "cultura" ? "bg-[radial-gradient(circle_at_50%_80%,rgba(239,232,218,.25),transparent_60%),#1d1d1d]" : "bg-[linear-gradient(160deg,#262626,#0f0f0f)]")} />
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <div className="flex items-center justify-between">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-3 w-auto" />
          <span className="ui rounded-full bg-black/50 px-2 py-[2px] text-[9px] uppercase tracking-[0.12em] text-offwhite/80">exemplo</span>
        </div>
        <div>
          <p className={cn("display leading-[0.95] text-offwhite", big ? "text-xl" : "line-clamp-3 text-[12px]")}>{big ? item.theme.toLowerCase() : item.theme.split(":")[0].toLowerCase()}</p>
          <div className={cn("ui mt-1.5 flex items-center gap-1.5 text-[9.5px] text-offwhite/70", !big && "hidden xl:flex")}>{item.channel.includes("TikTok") || item.format.includes("TikTok") ? <Play size={10} /> : item.channel === "Stories" ? <Film size={10} /> : <Camera size={10} />}{item.format}</div>
        </div>
      </div>
    </div>
  );
}

export function Ch09Conteudo({ active }: ChapterProps) {
  const [day, setDay] = useState(0);
  const item = CONTENT_WEEK.find((c) => c.day === day)!;
  return (
    <SlideFrame active={active} n="09" eyebrow="Máquina de conteúdo" title={<>construir audiência <span className="text-pink">antes</span> de vender assinatura.</>} headerRight={<EvidenceTag kind="proposta" label="Exemplos de peças · nada publicado" />}>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex min-h-0 flex-col gap-4">
          <div data-reveal>
            <div className="mb-1.5 flex items-center justify-between"><span className="eyebrow">Divisão editorial proposta</span><span className="ui text-[11px] text-faint">5 vídeos curtos por semana + stories e educativos</span></div>
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">{PILLARS.map((p) => <div key={p.id} className={cn("h-full", PILLAR_CLASS[p.id])} style={{ width: `${p.share * 100}%` }} title={`${p.label} ${p.share * 100}%`} />)}</div>
            <div className="ui mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px]">{PILLARS.map((p) => <span key={p.id} className="flex items-center gap-1.5 text-muted"><span className={cn("h-2 w-2 rounded-full", PILLAR_CLASS[p.id])} />{p.label} <span className="num text-offwhite">{Math.round(p.share * 100)}%</span></span>)}</div>
          </div>
          <div data-reveal className="grid grid-cols-7 gap-1.5 md:gap-2" data-noswipe>
            {DAYS.map((d, i) => { const it = CONTENT_WEEK.find((c) => c.day === i)!; const on = i === day; return (
              <button key={d} onClick={() => setDay(i)} className={cn("flex flex-col gap-1.5 rounded-xl border p-1.5 text-left transition-colors md:p-2", on ? "border-offwhite/80 bg-offwhite/8" : "border-line hover:border-offwhite/40")}>
                <span className="ui flex items-center justify-between text-[11px] text-muted"><span>{d}</span><span className={cn("h-1.5 w-1.5 rounded-full", PILLAR_CLASS[it.pillar])} /></span>
                <Preview item={it} />
              </button>
            ); })}
          </div>
        </div>
        <div data-reveal className="scroll-thin grid grid-cols-[1fr] gap-4 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4 md:grid-cols-[150px_1fr]">
          <div className="hidden md:block"><Preview item={item} big /></div>
          <div className="flex flex-col gap-3 ui text-[12.5px]">
            <div><div className={cn("eyebrow", PILLAR_TEXT[item.pillar])}>{PILLARS.find((p) => p.id === item.pillar)!.label} · {DAYS[item.day]}</div><h3 className="display mt-1 text-xl text-offwhite md:text-2xl">{item.theme.toLowerCase()}</h3></div>
            <div><div className="eyebrow mb-0.5">Roteiro resumido</div><p className="body text-[13.5px] text-offwhite/85">{item.script}</p></div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div><div className="eyebrow">Formato</div>{item.format}</div>
              <div><div className="eyebrow">Canal</div>{item.channel}</div>
              <div><div className="eyebrow">Objetivo</div>{item.objective}</div>
              <div><div className="eyebrow">Responsável</div>{item.owner}</div>
              <div><div className="eyebrow">CTA</div>{item.cta}</div>
              <div><div className="eyebrow">Status</div><span className="rounded-full border border-warn/60 px-2 py-[1px] text-[11px] text-warn">Proposta</span></div>
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
