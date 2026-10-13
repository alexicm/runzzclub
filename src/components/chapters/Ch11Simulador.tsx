"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { FinancialSimulator } from "@/components/simulator/FinancialSimulator";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch11Simulador({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="11" eyebrow="Simulador financeiro" title={<>e se mudarmos <span className="text-pink">a estratégia?</span></>} titleClassName="md:text-4xl xl:text-5xl">
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><FinancialSimulator /></div>
    </SlideFrame>
  );
}
