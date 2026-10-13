"use client";
import { useMemo, useRef, useState } from "react";
import { Check, Circle, Loader, OctagonAlert } from "lucide-react";
import { WEEK1_TASKS, type Task, type TaskStatus } from "@/data/tasks";
import { PERSON_BY_ID } from "@/data/people";
import { useRunz } from "@/lib/store";
import { cn } from "@/lib/cn";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { TaskDrawer } from "./TaskDrawer";
import { AnimatedNumber } from "@/components/ui/Stat";
import { fmtPct } from "@/lib/finance";

const DAYS = [
  { iso: "2026-10-13", label: "Seg", d: "13" }, { iso: "2026-10-14", label: "Ter", d: "14" }, { iso: "2026-10-15", label: "Qua", d: "15" },
  { iso: "2026-10-16", label: "Qui", d: "16" }, { iso: "2026-10-17", label: "Sex", d: "17" }, { iso: "2026-10-18", label: "Sáb", d: "18" },
];

const ICON: Record<TaskStatus, React.ReactNode> = { pendente: <Circle size={12} />, "em-andamento": <Loader size={12} />, bloqueada: <OctagonAlert size={12} />, concluida: <Check size={12} /> };

export function useWeekProgress(tasks: Task[]) {
  const states = useRunz((s) => s.tasks);
  return useMemo(() => {
    const done = tasks.filter((t) => states[t.id]?.status === "concluida").length;
    const running = tasks.filter((t) => states[t.id]?.status === "em-andamento").length;
    const blocked = tasks.filter((t) => states[t.id]?.status === "bloqueada").length;
    return { done, running, blocked, total: tasks.length, pct: tasks.length ? done / tasks.length : 0 };
  }, [tasks, states]);
}

/** Calendário executivo da semana 01 com tarefas por dia. Nenhum item começa concluído. */
export function ExecutionBoard({ active = true, compact = false }: { active?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState<Task | null>(null);
  const states = useRunz((s) => s.tasks);
  const prog = useWeekProgress(WEEK1_TASKS);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!active || !root.current) return;
    const cards = root.current.querySelectorAll("[data-card]");
    if (prefersReducedMotion()) { gsap.set(cards, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(cards, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.35 });
  }, { scope: root, dependencies: [active] });

  return (
    <div ref={root} className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="ui flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-muted">
        <span className="flex items-center gap-2"><span className="num text-base text-offwhite"><AnimatedNumber value={prog.pct} format={fmtPct} /></span> concluído</span>
        <span><span className="num text-offwhite">{prog.done}</span> de {prog.total} entregas</span>
        <span><span className="num text-warn">{prog.running}</span> em andamento</span>
        <span><span className="num text-bad">{prog.blocked}</span> bloqueadas</span>
        <span className="ml-auto hidden md:inline">Clique em uma entrega para editar status, evidência e próxima ação</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-offwhite/10"><div className="h-full bg-lime transition-[width] duration-700" style={{ width: `${prog.pct * 100}%` }} /></div>

      <div className="scroll-thin -mx-1 flex min-h-0 flex-1 gap-2 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-6 md:overflow-visible" data-noswipe>
        {DAYS.map((day) => {
          const items = WEEK1_TASKS.filter((t) => t.due === day.iso);
          return (
            <div key={day.iso} className={cn("flex w-[74vw] shrink-0 flex-col rounded-2xl border border-line bg-ink/40 md:w-auto", items.length === 0 && "opacity-60")}>
              <div className="flex items-baseline justify-between border-b border-line px-3 py-2.5">
                <span className="eyebrow">{day.label}</span>
                <span className="num text-lg text-offwhite">{day.d}<span className="text-[11px] text-faint">/10</span></span>
              </div>
              <div className="flex flex-col gap-1.5 p-2">
                {items.length === 0 && <p className="ui px-1 py-2 text-[12px] text-faint">{day.label === "Sex" ? "Reserva para correções" : "Sem entregas previstas"}</p>}
                {items.map((t) => {
                  const st = states[t.id]?.status ?? "pendente";
                  return (
                    <button key={t.id} data-card onClick={() => setOpen(t)} className={cn("group flex w-full flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors hover:bg-offwhite/8", st === "concluida" ? "border-lime/50" : st === "bloqueada" ? "border-bad/50" : st === "em-andamento" ? "border-warn/50" : "border-line", "opacity-0")}>
                      <span className={cn("ui flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em]", st === "concluida" ? "text-lime" : st === "bloqueada" ? "text-bad" : st === "em-andamento" ? "text-warn" : "text-faint")}>{ICON[st]} {st === "pendente" ? "A aprovar" : st.replace("-", " ")}</span>
                      <span className={cn("ui text-[13px] font-semibold leading-snug text-offwhite", compact && "text-[12px]")}>{t.title}</span>
                      <span className="flex flex-wrap gap-1">{t.owners.map((o) => <span key={o} className="ui rounded-full bg-offwhite/10 px-1.5 py-[1px] text-[10px] text-offwhite/80">{PERSON_BY_ID[o].name}</span>)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <TaskDrawer task={open} onClose={() => setOpen(null)} />
    </div>
  );
}
