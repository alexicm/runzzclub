"use client";
import { useState } from "react";
import { PEOPLE, type Person, type PersonId } from "@/data/people";
import { ALL_TASKS } from "@/data/tasks";
import { useRunz } from "@/lib/store";
import { StatusPill, TASK_STATUS_LABEL } from "@/components/ui/StatusPill";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { fmtDate } from "@/lib/finance";
import { cn } from "@/lib/cn";

const STATUS_LABEL: Record<Person["status"], string> = { idealizador: "Idealizador", lideranca: "Liderança", "em-avaliacao": "Em avaliação", "a-contratar": "A contratar", "nao-definido": "Não definido" };
const STATUS_STYLE: Record<Person["status"], string> = { idealizador: "border-pink/70 text-pink", lideranca: "border-lime/60 text-lime", "em-avaliacao": "border-warn/60 text-warn", "a-contratar": "border-pink/60 text-pink", "nao-definido": "border-offwhite/40 text-faint" };

function Card({ p, on, onClick }: { p: Person; on: boolean; onClick: () => void }) {
  const confirmed = p.status === "idealizador" || p.status === "lideranca";
  return (
    <button onClick={onClick} aria-pressed={on} className={cn("flex w-full flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all md:p-4", on ? "border-offwhite bg-offwhite/10" : "border-line hover:border-offwhite/50", !confirmed && "border-dashed")}>
      <div className="flex w-full items-center justify-between gap-2">
        <span className={cn("num flex h-9 w-9 items-center justify-center rounded-full text-[12px]", confirmed ? "bg-pink text-offwhite" : "border border-line-strong text-muted")}>{p.initials}</span>
        <span className={cn("ui rounded-full border px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.1em]", STATUS_STYLE[p.status])}>{STATUS_LABEL[p.status]}</span>
      </div>
      <span className="display text-lg leading-tight text-offwhite md:text-xl">{p.name.toLowerCase()}</span>
      <span className="ui text-[11.5px] leading-snug text-muted">{p.role}</span>
    </button>
  );
}

export function TeamResponsibilityMap() {
  const [sel, setSel] = useState<PersonId>("alex");
  const p = PEOPLE.find((x) => x.id === sel)!;
  const states = useRunz((s) => s.tasks);
  const tasks = ALL_TASKS.filter((t) => t.owners.includes(sel));
  const partners = PEOPLE.filter((x) => x.status === "idealizador" || x.status === "lideranca");
  const roles = PEOPLE.filter((x) => x.status !== "idealizador" && x.status !== "lideranca");
  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative flex flex-col gap-3">
        <div className="eyebrow">Idealizador e liderança · aprovações e coordenação</div>
        <div className="grid grid-cols-3 gap-2 md:gap-3">{partners.map((x) => <Card key={x.id} p={x} on={sel === x.id} onClick={() => setSel(x.id)} />)}</div>
        <div className="relative my-1 flex items-center justify-center" aria-hidden>
          <svg viewBox="0 0 600 40" className="h-8 w-full"><path d="M100 0 V20 H500 V0 M300 20 V40" fill="none" stroke="rgba(239,232,218,0.3)" strokeWidth="1.5" /></svg>
        </div>
        <div className="eyebrow">Funções a confirmar · execução</div>
        <div className="grid grid-cols-3 gap-2 md:gap-3">{roles.map((x) => <Card key={x.id} p={x} on={sel === x.id} onClick={() => setSel(x.id)} />)}</div>
        <p className="ui text-[11px] text-faint">Contratações sugeridas não estão confirmadas. Cartões tracejados indicam função ainda não preenchida.</p>
      </div>

      <div className="scroll-thin flex flex-col gap-4 lg:min-h-0 lg:overflow-y-auto rounded-2xl border border-line p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div><div className="eyebrow">{p.role}</div><h3 className="display text-2xl text-offwhite md:text-3xl">{p.name.toLowerCase()}</h3></div>
          <EvidenceTag kind={p.status === "idealizador" || p.status === "lideranca" ? "decisao" : "proposta"} label={STATUS_LABEL[p.status]} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 ui text-[12.5px]">
          <div><div className="eyebrow mb-1">Responsabilidades</div><ul className="flex flex-wrap gap-1.5">{p.responsibilities.map((r) => <li key={r} className="rounded-full bg-offwhite/8 px-2.5 py-1 text-offwhite/90">{r}</li>)}</ul></div>
          <div><div className="eyebrow mb-1">Entregáveis</div><ul className="list-disc pl-4 text-offwhite/85">{p.deliverables.map((r) => <li key={r}>{r}</li>)}</ul></div>
          <div><div className="eyebrow mb-1">Dependências</div><ul className="list-disc pl-4 text-offwhite/85">{p.dependencies.map((r) => <li key={r}>{r}</li>)}</ul></div>
          <div><div className="eyebrow mb-1">Decisões pendentes</div><ul className="list-disc pl-4 text-warn">{p.pendingDecisions.map((r) => <li key={r}>{r}</li>)}</ul></div>
        </div>
        <div>
          <div className="eyebrow mb-1.5">Tarefas atribuídas ({tasks.length})</div>
          <ul className="flex flex-col gap-1">
            {tasks.map((t) => { const st = states[t.id]?.status ?? "pendente"; return (
              <li key={t.id} className="ui flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-1.5 text-[12.5px]"><span className="min-w-0 truncate"><span className="num mr-2 text-faint">{fmtDate(t.due)}</span>{t.title}</span><StatusPill status={st} label={TASK_STATUS_LABEL[st]} /></li>
            ); })}
          </ul>
        </div>
      </div>
    </div>
  );
}
