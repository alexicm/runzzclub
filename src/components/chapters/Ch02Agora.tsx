"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { ExecutionBoard } from "@/components/operations/ExecutionBoard";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch02Agora({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="02" eyebrow="O que vamos fazer agora?" title={<>a RUNZ começa <span className="text-pink">pela execução.</span></>}
      headerRight={<div className="flex flex-col items-end gap-2"><EvidenceTag kind="proposta" label="Prazos propostos, a aprovar" /><span className="ui text-[12px] text-muted">Semana de 13 a 18 de outubro de 2026</span></div>}>
      <ExecutionBoard active={active} />
    </SlideFrame>
  );
}
