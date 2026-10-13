"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { AcquisitionFunnel } from "@/components/simulator/AcquisitionFunnel";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch07Canais({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="07" eyebrow="Nossos três canais de aquisição" title={<>três canais. <span className="text-lime">um funil</span> de crescimento.</>} headerRight={<EvidenceTag kind="simulacao" label="Volumes são hipóteses editáveis" />}>
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><AcquisitionFunnel /></div>
    </SlideFrame>
  );
}
