"use client";
import { useMemo, useState } from "react";
import { DECISIONS, type DecisionStatus } from "@/data/decisions";
import { ALL_TASKS } from "@/data/tasks";
import { PEOPLE } from "@/data/people";
import { useRunz } from "@/lib/store";
import { Drawer } from "@/components/ui/Drawer";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { StatusPill, DECISION_STATUS_LABEL } from "@/components/ui/StatusPill";
import { fmtDateLong } from "@/lib/finance";
import { cn } from "@/lib/cn";

const joinNames = (n: string[]) => (n.length <= 1 ? n.join("") : `${n.slice(0, -1).join(", ")} e ${n[n.length - 1]}`);
const iso = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).getTime(); };

export function useNextDelivery() {
  const states = useRunz((s) => s.tasks);
  return useMemo(() => ALL_TASKS.filter((t) => states[t.id]?.status !== "concluida").sort((a, b) => iso(a.due) - iso(b.due))[0] ?? null, [states]);
}

export function DecisionPanel({ showClosing = true }: { showClosing?: boolean }) {
  const decisions = useRunz((s) => s.decisions);
  const setDecision = useRunz((s) => s.setDecision);
  const [openId, setOpenId] = useState<string | null>(null);
  const next = useNextDelivery();
  const d = DECISIONS.find((x) => x.id === openId) ?? null;
  const st = d ? decisions[d.id] : undefined;
  const counts = useMemo(() => {
    const c: Record<DecisionStatus, number> = { pendente: 0, "em-discussao": 0, aprovada: 0, bloqueada: 0 };
    DECISIONS.forEach((x) => { c[decisions[x.id]?.status ?? "pendente"]++; });
    return c;
  }, [decisions]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="ui flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-muted">
        <span><span className="num text-lime">{counts.aprovada}</span> aprovadas</span><span><span className="num text-warn">{counts["em-discussao"]}</span> em discussão</span><span><span className="num text-bad">{counts.bloqueada}</span> bloqueadas</span><span><span className="num text-offwhite">{counts.pendente}</span> pendentes</span>
        <span className="ml-auto hidden md:inline">Nenhuma decisão é aprovada sem ação explícita. Registro salvo neste navegador.</span>
      </div>
      <div className="scroll-thin grid flex-1 content-start gap-2 lg:min-h-0 lg:overflow-y-auto md:grid-cols-2 xl:grid-cols-4" data-noswipe>
        {DECISIONS.map((x) => { const s = decisions[x.id]?.status ?? "pendente"; return (
          <button key={x.id} onClick={() => setOpenId(x.id)} className={cn("flex flex-col gap-2 rounded-2xl border p-3.5 text-left transition-colors hover:bg-offwhite/6", s === "aprovada" ? "border-lime/60" : s === "bloqueada" ? "border-bad/60" : s === "em-discussao" ? "border-warn/60" : "border-line")}>
            <div className="flex items-center justify-between"><span className="num text-[12px] text-pink">{x.n}</span><StatusPill status={s} label={DECISION_STATUS_LABEL[s]} /></div>
            <span className="display text-lg leading-tight text-offwhite">{x.title.toLowerCase()}</span>
            <span className="ui text-[11.5px] leading-snug text-muted">{x.summary}</span>
            {decisions[x.id]?.owner && <span className="ui text-[11px] text-faint">Responsável: {decisions[x.id].owner}</span>}
          </button>
        ); })}
      </div>

      {showClosing && (
        <div className="grid gap-3 rounded-[24px] border border-pink/50 bg-pink/8 p-4 md:grid-cols-3 md:p-5">
          <div><div className="eyebrow text-pink">Próxima entrega</div><div className="display text-xl text-offwhite md:text-2xl">{next ? next.title.toLowerCase() : "todas as entregas concluídas"}</div></div>
          <div><div className="eyebrow text-pink">Próximo responsável</div><div className="display text-xl text-offwhite md:text-2xl">{next ? joinNames(next.owners.map((o) => PEOPLE.find((p) => p.id === o)!.name)).toLowerCase() : "—"}</div></div>
          <div><div className="eyebrow text-pink">Próxima data</div><div className="display text-xl text-offwhite md:text-2xl">{next ? fmtDateLong(next.due) : "—"}</div></div>
        </div>
      )}

      <Drawer open={!!d} onClose={() => setOpenId(null)} title={d?.title ?? ""} eyebrow={d ? `Decisão ${d.n}` : undefined}>
        {d && (
          <div className="flex flex-col gap-4">
            <p className="body text-[15px] text-offwhite/85">{d.summary}</p>
            <div><Label>Recomendação deste plano</Label><p className="body text-sm text-offwhite/85">{d.recommendation}</p></div>
            <div><Label>Desbloqueia</Label><ul className="ui list-disc pl-4 text-sm text-offwhite/85">{d.unlocks.map((u) => <li key={u}>{u}</li>)}</ul></div>
            <div className="grid gap-4 border-t border-line pt-4">
              <div><Label>Estado</Label><Select value={st?.status ?? "pendente"} onChange={(e) => setDecision(d.id, { status: e.target.value as DecisionStatus })}>{(Object.keys(DECISION_STATUS_LABEL) as DecisionStatus[]).map((k) => <option key={k} value={k}>{DECISION_STATUS_LABEL[k]}</option>)}</Select></div>
              <div><Label>Responsável pela decisão</Label><Input placeholder="Ex.: Yan" value={st?.owner ?? ""} onChange={(e) => setDecision(d.id, { owner: e.target.value })} /></div>
              <div><Label>Observações</Label><Textarea placeholder="Condições, ressalvas, prazo para retorno" value={st?.notes ?? ""} onChange={(e) => setDecision(d.id, { notes: e.target.value })} /></div>
              {st?.updatedAt && <p className="ui text-[11px] text-faint">Registrado em {new Date(st.updatedAt).toLocaleString("pt-BR")}</p>}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
