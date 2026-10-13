import { cn } from "@/lib/cn";
import type { TaskStatus } from "@/data/tasks";
import type { DecisionStatus } from "@/data/decisions";
import { Check, Circle, Loader, OctagonAlert, MessageSquare } from "lucide-react";

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = { pendente: "Pendente", "em-andamento": "Em andamento", bloqueada: "Bloqueada", concluida: "Concluída" };
export const DECISION_STATUS_LABEL: Record<DecisionStatus, string> = { pendente: "Pendente", "em-discussao": "Em discussão", aprovada: "Aprovada", bloqueada: "Bloqueada" };

const STYLE: Record<string, string> = {
  pendente: "text-offwhite/70 border-offwhite/25",
  "em-andamento": "text-warn border-warn/60",
  "em-discussao": "text-warn border-warn/60",
  bloqueada: "text-bad border-bad/60",
  concluida: "text-lime border-lime/60",
  aprovada: "text-lime border-lime/60",
};
const ICON: Record<string, React.ReactNode> = {
  pendente: <Circle size={11} />, "em-andamento": <Loader size={11} />, "em-discussao": <MessageSquare size={11} />,
  bloqueada: <OctagonAlert size={11} />, concluida: <Check size={12} />, aprovada: <Check size={12} />,
};

export function StatusPill({ status, label, className }: { status: TaskStatus | DecisionStatus; label: string; className?: string }) {
  return (
    <span className={cn("ui inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold whitespace-nowrap", STYLE[status], className)}>
      {ICON[status]} {label}
    </span>
  );
}
