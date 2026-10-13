"use client";
import { useMemo, useState } from "react";
import { ALL_TASKS, WEEKS, type Task } from "@/data/tasks";
import { PEOPLE, type PersonId } from "@/data/people";
import { useRunz } from "@/lib/store";
import { TaskDrawer } from "@/components/operations/TaskDrawer";
import { Segmented } from "@/components/ui/Segmented";
import { fmtDate, fmtPct } from "@/lib/finance";
import { AnimatedNumber } from "@/components/ui/Stat";
import { cn } from "@/lib/cn";

const W0 = new Date(2026, 9, 13).getTime();
const day = 86400000;
const iso = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).getTime(); };
const WEEK_START = ["2026-10-13", "2026-10-19", "2026-10-26", "2026-11-02"];
type OwnerFilter = PersonId | "todos";

export function Gantt30({ yanView = false }: { yanView?: boolean }) {
  const states = useRunz((s) => s.tasks);
  const [week, setWeek] = useState<0 | 1 | 2 | 3 | 4>(0); // 0 = todas
  const [owner, setOwner] = useState<OwnerFilter>("todos");
  const [open, setOpen] = useState<Task | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });
  const [today] = useState(() => Date.now());

  const rows = useMemo(() => ALL_TASKS.filter((t) => (week === 0 || t.week === week) && (owner === "todos" || t.owners.includes(owner))), [week, owner]);
  const stats = useMemo(() => {
    const total = rows.length;
    const done = rows.filter((t) => states[t.id]?.status === "concluida").length;
    const blocked = rows.filter((t) => states[t.id]?.status === "bloqueada").length;
    const late = rows.filter((t) => states[t.id]?.status !== "concluida" && iso(t.due) + day < today).length;
    const withEvidence = rows.filter((t) => (states[t.id]?.evidence ?? "").trim().length > 0).length;
    const next = ALL_TASKS.filter((t) => states[t.id]?.status !== "concluida").sort((a, b) => iso(a.due) - iso(b.due)).slice(0, 3);
    return { total, done, blocked, late, withEvidence, pct: total ? done / total : 0, next };
  }, [rows, states, today]);
  const total = 27; // 13/10 a 08/11
  const x = (s: string) => ((iso(s) - W0) / (total * day)) * 100;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" data-noswipe>
        <Segmented<"0" | "1" | "2" | "3" | "4"> size="sm" options={[{ value: "0", label: "4 semanas" }, ...WEEKS.map((w) => ({ value: String(w.n) as "1", label: `S${w.n}` }))]} value={String(week) as "0"} onChange={(v) => setWeek(Number(v) as 0)} />
        <select value={owner} onChange={(e) => setOwner(e.target.value as OwnerFilter)} className="ui h-8 rounded-full border border-line-strong bg-ink/60 px-3 text-[12px] text-offwhite outline-none" aria-label="Filtrar por responsável">
          <option value="todos">Todos os responsáveis</option>{PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div className="ui ml-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
          <span><span className="num text-base text-offwhite"><AnimatedNumber value={stats.pct} format={fmtPct} /></span> concluído</span>
          <span><span className="num text-offwhite">{stats.done}</span>/{stats.total}</span>
          <span><span className="num text-bad">{stats.blocked}</span> bloqueadas</span>
          <span><span className={cn("num", stats.late ? "text-warn" : "text-offwhite")}>{stats.late}</span> atrasadas</span>
          <span><span className="num text-offwhite">{stats.withEvidence}</span> com evidência</span>
        </div>
      </div>

      {yanView && (
        <div className="ui grid gap-2 rounded-2xl border border-lime/40 bg-lime/5 p-3 text-[12.5px] md:grid-cols-3">
          <div className="md:col-span-3 eyebrow text-lime">Visão de acompanhamento para Yan · próximas entregas não concluídas</div>
          {stats.next.map((t) => <button key={t.id} onClick={() => setOpen(t)} className="flex items-start gap-2 rounded-xl bg-ink/60 px-3 py-2 text-left hover:bg-ink"><span className="num shrink-0 text-lime">{fmtDate(t.due)}</span><span className="min-w-0"><span className="block truncate font-semibold text-offwhite">{t.title}</span><span className="text-faint">{t.owners.map((o) => PEOPLE.find((p) => p.id === o)!.name).join(", ")}</span></span></button>)}
        </div>
      )}

      <div className="scroll-thin min-h-0 flex-1 overflow-auto rounded-2xl border border-line" data-noswipe>
        <div className="min-w-[760px]">
          {/* cabeçalho semanas */}
          <div className="sticky top-0 z-10 grid grid-cols-[260px_1fr] border-b border-line bg-ink">
            <div className="ui px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-faint">Entrega</div>
            <div className="relative h-9">{WEEKS.map((w, i) => <div key={w.n} className="absolute top-0 flex h-full flex-col justify-center border-l border-line px-2" style={{ left: `${x(WEEK_START[i])}%`, width: "25%" }}><span className="ui text-[11px] font-semibold text-offwhite">{w.label}</span><span className="ui text-[10px] text-faint">{w.range}</span></div>)}
              {today >= W0 && today <= W0 + total * day && <div className="absolute top-0 h-full w-px bg-pink" style={{ left: `${((today - W0) / (total * day)) * 100}%` }} title="Hoje" />}
            </div>
          </div>
          {WEEKS.filter((w) => week === 0 || w.n === week).map((w) => {
            const items = rows.filter((t) => t.week === w.n);
            if (!items.length) return null;
            return (
              <div key={w.n}>
                <button onClick={() => setExpanded((e) => ({ ...e, [w.n]: !e[w.n] }))} className="ui flex w-full items-center gap-2 border-b border-line bg-ink/40 px-3 py-1.5 text-left text-[11.5px] text-muted hover:text-offwhite"><span className={cn("transition-transform", expanded[w.n] ? "rotate-90" : "")}>▸</span>{w.label} · {w.theme}</button>
                {expanded[w.n] && items.map((t) => {
                  const st = states[t.id]?.status ?? "pendente";
                  const late = st !== "concluida" && iso(t.due) + day < today;
                  const start = WEEK_START[t.week - 1];
                  const left = x(start), width = Math.max(2, x(t.due) - left + (1 / total) * 100);
                  const deps = t.dependencies.filter((d) => states[d]?.status !== "concluida");
                  return (
                    <div key={t.id} className="grid grid-cols-[260px_1fr] border-b border-line/60 hover:bg-offwhite/4">
                      <button onClick={() => setOpen(t)} className="flex min-w-0 items-center gap-2 px-3 py-2 text-left">
                        <span className={cn("h-2 w-2 shrink-0 rounded-full", st === "concluida" ? "bg-lime" : st === "bloqueada" ? "bg-bad" : st === "em-andamento" ? "bg-warn" : "bg-offwhite/30")} />
                        <span className="min-w-0"><span className="ui block truncate text-[12.5px] text-offwhite">{t.title}</span><span className="ui block truncate text-[10.5px] text-faint">{t.owners.map((o) => PEOPLE.find((p) => p.id === o)!.name).join(", ")}{t.critical ? " · crítico" : ""}</span></span>
                      </button>
                      <div className="relative h-11">
                        {WEEK_START.map((s) => <span key={s} className="absolute top-0 h-full w-px bg-offwhite/6" style={{ left: `${x(s)}%` }} />)}
                        <button onClick={() => setOpen(t)} className={cn("absolute top-1/2 flex h-6 -translate-y-1/2 items-center gap-1 overflow-hidden rounded-md border px-2 text-[10.5px]", st === "concluida" ? "border-lime/60 bg-lime/20 text-lime" : st === "bloqueada" ? "border-bad/60 bg-bad/15 text-bad" : late ? "border-warn/70 bg-warn/15 text-warn" : st === "em-andamento" ? "border-warn/50 bg-warn/10 text-offwhite" : "border-line-strong bg-offwhite/8 text-offwhite/85")} style={{ left: `${left}%`, width: `${width}%` }} title={`${t.title} · prazo ${fmtDate(t.due)}`}>
                          <span className="ui truncate">{late ? "atrasada · " : ""}{fmtDate(t.due)}{deps.length ? ` · depende de ${deps.length}` : ""}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <p className="ui text-[11px] text-faint">Status reais são os que você altera aqui (salvos neste navegador). Nenhuma entrega, contato ou resultado comercial começa como concluído.</p>
      <TaskDrawer task={open} onClose={() => setOpen(null)} />
    </div>
  );
}
