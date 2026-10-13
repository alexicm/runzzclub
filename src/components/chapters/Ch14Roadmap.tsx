"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { InteractiveRoadmap } from "@/components/roadmap/InteractiveRoadmap";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch14Roadmap({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="14" eyebrow="Roadmap do MVP" title={<>do planejamento ao <span className="text-pink">primeiro assinante.</span></>} titleClassName="md:text-4xl xl:text-5xl">
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><InteractiveRoadmap active={active} /></div>
    </SlideFrame>
  );
}
