"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { TeamResponsibilityMap } from "@/components/operations/TeamResponsibilityMap";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch13Equipe({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="13" eyebrow="Quem faz o quê?" title={<>uma operação enxuta com <span className="text-lime">responsabilidades claras.</span></>} titleClassName="md:text-4xl xl:text-5xl">
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><TeamResponsibilityMap /></div>
    </SlideFrame>
  );
}
