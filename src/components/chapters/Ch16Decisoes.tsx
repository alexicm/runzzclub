"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { DecisionPanel } from "@/components/operations/DecisionPanel";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch16Decisoes({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="16" eyebrow="Decisões executivas" title={<>o que precisa ser decidido para a RUNZ <span className="text-lime">avançar?</span></>} titleClassName="md:text-4xl xl:text-5xl">
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><DecisionPanel /></div>
    </SlideFrame>
  );
}
