"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { Gantt30 } from "@/components/roadmap/Gantt30";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch15TrintaDias({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="15" eyebrow="Plano operacional de 30 dias" title={<>o que entregaremos nas <span className="text-lime">próximas quatro semanas?</span></>} titleClassName="md:text-4xl xl:text-5xl">
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><Gantt30 yanView /></div>
    </SlideFrame>
  );
}
