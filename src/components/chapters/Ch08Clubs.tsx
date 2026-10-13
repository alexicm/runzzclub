"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { RunClubSimulator } from "@/components/simulator/RunClubSimulator";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch08Clubs({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="08" eyebrow="RUNZ Clubs" title={<>transformar comunidades <span className="text-lime">em distribuição.</span></>} headerRight={<EvidenceTag kind="proposta" label="Comissão de R$ 39,90 a aprovar" />}>
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><RunClubSimulator /></div>
    </SlideFrame>
  );
}
