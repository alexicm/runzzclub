"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { MVPJourney } from "@/components/product-demo/MVPJourney";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch06Mvp({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="06" eyebrow="Como funciona o MVP?" title={<>do primeiro acesso ao <span className="text-pink">primeiro treino.</span></>}
      headerRight={<EvidenceTag kind="simulacao" label="Protótipo conceitual · dados fictícios" />}>
      <MVPJourney active={active} />
    </SlideFrame>
  );
}
