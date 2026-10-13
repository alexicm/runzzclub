"use client";
import { Drawer } from "@/components/ui/Drawer";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { StatusPill, TASK_STATUS_LABEL } from "@/components/ui/StatusPill";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { TASK_BY_ID, type Task, type TaskStatus } from "@/data/tasks";
import { ownerNames } from "@/data/people";
import { fmtDateLong } from "@/lib/finance";
import { useRunz } from "@/lib/store";

export function TaskDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const state = useRunz((s) => (task ? s.tasks[task.id] : undefined));
  const setTask = useRunz((s) => s.setTask);
  const tasks = useRunz((s) => s.tasks);
  const status: TaskStatus = state?.status ?? "pendente";
  return (
    <Drawer open={!!task} onClose={onClose} title={task?.title ?? ""} eyebrow={task ? `Entrega · prazo ${fmtDateLong(task.due)}` : undefined}>
      {task && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} label={TASK_STATUS_LABEL[status]} />
            <EvidenceTag kind="proposta" label="Prazo proposto" />
            {task.critical && <EvidenceTag kind="hipotese" label="Caminho crítico" />}
          </div>
          <p className="body text-[15px] leading-relaxed text-offwhite/85">{task.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Responsável</Label><p className="ui text-sm">{ownerNames(task.owners)}</p></div>
            <div><Label>Prazo</Label><p className="ui text-sm">{fmtDateLong(task.due)}</p></div>
          </div>
          <div><Label>Critério de conclusão</Label><p className="body text-sm text-offwhite/85">{task.doneCriteria}</p></div>
          <div>
            <Label>Dependências</Label>
            {task.dependencies.length === 0 ? <p className="ui text-sm text-faint">Nenhuma</p> : (
              <ul className="flex flex-col gap-1.5">
                {task.dependencies.map((d) => { const t = TASK_BY_ID[d]; const st = tasks[d]?.status ?? "pendente"; return (
                  <li key={d} className="ui flex items-center justify-between gap-2 text-sm"><span>{t?.title ?? d}</span><StatusPill status={st} label={TASK_STATUS_LABEL[st]} /></li>
                ); })}
              </ul>
            )}
          </div>
          <div className="grid gap-4 border-t border-line pt-5">
            <div>
              <Label>Status (editável, salvo apenas neste navegador)</Label>
              <Select value={status} onChange={(e) => setTask(task.id, { status: e.target.value as TaskStatus })}>
                {(Object.keys(TASK_STATUS_LABEL) as TaskStatus[]).map((k) => <option key={k} value={k}>{TASK_STATUS_LABEL[k]}</option>)}
              </Select>
            </div>
            <div><Label>Evidência ou link</Label><Input placeholder="Cole o link do documento, planilha ou print" value={state?.evidence ?? ""} onChange={(e) => setTask(task.id, { evidence: e.target.value })} /></div>
            <div><Label>Próxima ação</Label><Textarea placeholder="O que acontece a seguir e quem faz" value={state?.nextAction ?? ""} onChange={(e) => setTask(task.id, { nextAction: e.target.value })} /></div>
            {state?.updatedAt && <p className="ui text-[11px] text-faint">Atualizado em {new Date(state.updatedAt).toLocaleString("pt-BR")}</p>}
          </div>
        </div>
      )}
    </Drawer>
  );
}
