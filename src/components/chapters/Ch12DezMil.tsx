"use client";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { ReverseGoalPlanner } from "@/components/simulator/ReverseGoalPlanner";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch12DezMil({ active }: ChapterProps) {
  return (
    <SlideFrame active={active} n="12" eyebrow="Meta de 10 mil assinantes" title={<>temos capacidade real de gerar <span className="text-pink">esse volume de demanda?</span></>} titleClassName="md:text-4xl xl:text-5xl"
      headerRight={<div className="flex flex-col items-end gap-1"><EvidenceTag kind="simulacao" label="Planejamento reverso" /><span className="ui max-w-[36ch] text-right text-[11px] text-faint">Ordem de grandeza do plano: ~10,8 mil novos pagos, ~30,8 mil testes e ~103 mil contatos em 6 ciclos. Depende da curva escolhida.</span></div>}>
      <div data-reveal className="flex min-h-0 flex-1 flex-col"><ReverseGoalPlanner /></div>
    </SlideFrame>
  );
}
