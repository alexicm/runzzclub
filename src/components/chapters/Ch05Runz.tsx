"use client";
import { useState } from "react";
import { Activity, Users, ArrowRight } from "lucide-react";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { cn } from "@/lib/cn";
import type { ChapterProps } from "@/components/presentation/Deck";

type Mod = "training" | "clubs";
const MODULES: Record<Mod, { title: string; role: string; icon: React.ReactNode; features: string[]; goals: string[]; money: string; color: string }> = {
  training: {
    title: "RUNZ Training", role: "Produto de treinamento por assinatura. Principal fonte inicial de receita.", icon: <Activity size={22} />,
    features: ["Cadastro e avaliação inicial", "Plano de treinamento conforme objetivo", "Calendário", "Registro de treinos", "Feedback", "Evolução", "Assinatura e cobrança", "Supervisão e metodologia definida por profissional habilitado"],
    goals: ["Ativação ≥ 80% dos testes elegíveis", "Conversão paga ≥ 30%", "Terceiro ciclo ≥ 80% da coorte"],
    money: "Assinatura mensal de R$ 39,90 (R$ 89,90 com R$ 50 de desconto), 14 dias de teste. Anual proposto de R$ 478,80, a aprovar.", color: "pink",
  },
  clubs: {
    title: "RUNZ Clubs", role: "Ferramenta de relacionamento e aquisição por comunidades. Infraestrutura de distribuição, não receita.", icon: <Users size={22} />,
    features: ["Cadastro dos clubes", "Agenda de encontros", "Inscrições", "Check-in", "Participantes", "Links de indicação", "Origem das conversões"],
    goals: ["5 clubes no piloto", "60% dos clubes com dois encontros em 30 dias", "Atribuição única por novo assinante"],
    money: "Gratuito para o clube. Comissão única de R$ 39,90 por novo assinante com primeira cobrança válida (proposta). O piloto não depende das funcionalidades avançadas.", color: "lime",
  },
};

export function Ch05Runz({ active }: ChapterProps) {
  const [sel, setSel] = useState<Mod>("training");
  const m = MODULES[sel];
  return (
    <SlideFrame active={active} n="05" eyebrow="O que é a RUNZ?" title={<>uma marca. <span className="text-lime">dois motores</span> complementares.</>}>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* diagrama */}
        <div data-reveal className="relative flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-ink/30 p-5">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-8 w-auto" />
            <span className="eyebrow">uma marca</span>
          </div>
          <div className="flex w-full items-stretch justify-center gap-3 md:gap-5">
            {(Object.keys(MODULES) as Mod[]).map((k) => {
              const mod = MODULES[k]; const on = sel === k;
              return (
                <button key={k} onClick={() => setSel(k)} aria-pressed={on} className={cn("group flex flex-1 flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all md:p-5", on ? (k === "training" ? "border-pink bg-pink/10" : "border-lime bg-lime/10") : "border-line hover:border-offwhite/50")}>
                  <span className={cn("rounded-full p-2", k === "training" ? "bg-pink text-offwhite" : "bg-lime text-ink")}>{mod.icon}</span>
                  <span className="display text-xl text-offwhite md:text-2xl">{mod.title.toLowerCase()}</span>
                  <span className="ui text-[12px] text-muted">{k === "training" ? "Receita" : "Distribuição"}</span>
                </button>
              );
            })}
          </div>
          <div className="ui flex items-center gap-2 text-[12px] text-muted"><span className="text-lime">Clubs</span> <ArrowRight size={14} /> participantes elegíveis <ArrowRight size={14} /> teste <ArrowRight size={14} /> <span className="text-pink">Training</span></div>
        </div>

        <div data-reveal className="scroll-thin flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-5">
          <div className="flex items-start justify-between gap-3">
            <div><div className="eyebrow">{sel === "training" ? "Motor 01" : "Motor 02"}</div><h3 className={cn("display text-3xl", sel === "training" ? "text-pink" : "text-lime")}>{m.title.toLowerCase()}</h3></div>
            <EvidenceTag kind={sel === "training" ? "decisao" : "proposta"} label={sel === "training" ? "Escopo a aprovar (decisão 01)" : "Estratégia a aprovar (decisão 02)"} />
          </div>
          <p className="body text-[15px] text-offwhite/85">{m.role}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div><div className="eyebrow mb-1.5">Funcionalidades</div><ul className="flex flex-col gap-1">{m.features.map((f) => <li key={f} className="ui flex items-start gap-2 text-[13px]"><span className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", sel === "training" ? "bg-pink" : "bg-lime")} />{f}</li>)}</ul></div>
            <div className="flex flex-col gap-4">
              <div><div className="eyebrow mb-1.5">Objetivos do piloto</div><ul className="flex flex-col gap-1">{m.goals.map((f) => <li key={f} className="ui text-[13px] text-offwhite/85">{f}</li>)}</ul></div>
              <div><div className="eyebrow mb-1.5">Monetização</div><p className="body text-[13px] text-offwhite/85">{m.money}</p></div>
            </div>
          </div>
          <Note>RUNZ Training é a principal fonte inicial de receita. RUNZ Clubs atua inicialmente como infraestrutura de distribuição e não precisa das funcionalidades avançadas antes do piloto.</Note>
        </div>
      </div>
    </SlideFrame>
  );
}
