"use client";
import { useState } from "react";
import { SlideFrame } from "@/components/presentation/SlideFrame";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { useRunz } from "@/lib/store";
import { fmtBRL2 } from "@/lib/finance";
import { cn } from "@/lib/cn";
import type { ChapterProps } from "@/components/presentation/Deck";

const FLOW = ["Landing page", "Cadastro", "Teste", "Ativação", "Cobrança", "Renovação"];
const DAYS14 = [
  { d: 1, t: "Início do teste", x: "Data final e próxima cobrança visíveis. Autorização de pagamento quando exigida. Plano entregue no mesmo dia." },
  { d: 7, t: "Primeira semana", x: "Primeiro uso acompanhado. Suporte para falhas e dúvidas. Registro de ao menos um treino (meta de 60% dos elegíveis)." },
  { d: 10, t: "Resumo de uso", x: "Resumo de utilização e aviso da cobrança, sem pressão indevida." },
  { d: 12, t: "Aviso final", x: "Lembrete de cobrança em 48 horas, com cancelamento acessível em um toque." },
  { d: 14, t: "Cobrança", x: "Cobrança apenas com autorização válida e assinatura não cancelada. Conciliação financeira e rotina de renovação." },
];

export function Ch10Modelo({ active }: ChapterProps) {
  const price = useRunz((s) => s.params.price);
  const [day, setDay] = useState(1);
  const cur = DAYS14.find((x) => x.d === day)!;
  return (
    <SlideFrame active={active} n="10" eyebrow="Modelo de negócio" title={<>receita recorrente começa com uma <span className="text-lime">oferta simples.</span></>} headerRight={<EvidenceTag kind="decisao" label="Preço final definido · condições a aprovar" />}>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div data-reveal className="flex flex-col justify-between gap-4 rounded-[28px] border border-line bg-ink/50 p-6">
          <div className="flex items-center justify-between"><span className="eyebrow">Um único produto inicial</span><span className="ui rounded-full bg-lime px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink">Lista VIP</span></div>
          <div>
            <div className="ui text-[13px] text-muted">Plano mensal de referência</div>
            <div className="num text-2xl text-offwhite/60 line-through decoration-pink decoration-2">R$ 89,90</div>
            <div className="ui mt-2 text-[13px] text-muted">Desconto VIP fixo de <span className="text-offwhite">R$ 50,00</span> <span className="text-pink">(não é desconto de 50%)</span></div>
            <div className="display mt-1 text-6xl text-lime md:text-7xl">{fmtBRL2(price)}</div>
            <div className="ui text-[13px] text-muted">por mês · <span className="text-offwhite">14 dias de teste gratuito</span></div>
          </div>
          <ul className="ui grid gap-1.5 text-[12.5px]">
            <li className="flex items-center justify-between border-t border-line pt-2"><span className="text-muted">Duração do desconto</span><span className="text-warn">A aprovar (proposta: 12 ciclos)</span></li>
            <li className="flex items-center justify-between border-t border-line pt-2"><span className="text-muted">Cobrança após o teste</span><span className="text-warn">A aprovar</span></li>
            <li className="flex items-center justify-between border-t border-line pt-2"><span className="text-muted">Condições de cancelamento</span><span className="text-warn">A aprovar</span></li>
            <li className="flex items-center justify-between border-t border-line pt-2"><span className="text-muted">Anual</span><span className="text-offwhite/80">R$ 478,80 proposto</span></li>
          </ul>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div data-reveal>
            <div className="eyebrow mb-2">Jornada de contratação</div>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar" data-noswipe>
              {FLOW.map((f, i) => (
                <div key={f} className="flex items-center gap-1">
                  <span className={cn("ui whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold", i === 2 ? "border-lime text-lime" : i === 4 ? "border-pink text-pink" : "border-line-strong text-offwhite/85")}>{f}</span>
                  {i < FLOW.length - 1 && <span className="h-px w-3 bg-offwhite/30 md:w-5" />}
                </div>
              ))}
            </div>
          </div>
          <div data-reveal className="rounded-2xl border border-line p-4" data-noswipe>
            <div className="mb-3 flex items-center justify-between"><span className="eyebrow">Os 14 dias do teste</span><span className="ui text-[11px] text-faint">Clique em um dia</span></div>
            <div className="relative mb-4 h-10">
              <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-offwhite/12" />
              <div className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-lime transition-[width] duration-500" style={{ width: `${((day - 1) / 13) * 100}%` }} />
              {DAYS14.map((x) => (
                <button key={x.d} onClick={() => setDay(x.d)} aria-label={`Dia ${x.d}: ${x.t}`} className={cn("num absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[12px] transition-all", day === x.d ? "border-offwhite bg-offwhite text-ink scale-110" : x.d === 14 ? "border-pink bg-deep text-pink" : "border-line-strong bg-deep text-offwhite/85")} style={{ left: `${((x.d - 1) / 13) * 100}%` }}>{x.d}</button>
              ))}
            </div>
            <div className="ui"><div className="eyebrow">Dia {cur.d}</div><h3 className="display text-2xl text-offwhite">{cur.t.toLowerCase()}</h3><p className="body mt-1 text-[14px] text-offwhite/85">{cur.x}</p></div>
          </div>
          <Note tone="warn">O valor de R$ 89,90 só pode ser comunicado como preço praticado quando houver uma oferta real e verificável que sustente essa referência. A comunicação deve dizer quem recebe o desconto, por quanto tempo, quando será cobrado e como cancelar.</Note>
        </div>
      </div>
    </SlideFrame>
  );
}
