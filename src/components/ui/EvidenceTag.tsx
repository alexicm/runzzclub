import { EVIDENCE_LABEL, EVIDENCE_HINT, type Evidence } from "@/data/provenance";
import { cn } from "@/lib/cn";

const STYLE: Record<Evidence, string> = {
  decisao: "border-lime/60 text-lime",
  documento: "border-offwhite/50 text-offwhite",
  proposta: "border-pink/70 text-pink",
  hipotese: "border-warn/60 text-warn",
  simulacao: "border-offwhite/30 text-muted",
  concorrente: "border-offwhite/30 text-muted",
  real: "border-dashed border-offwhite/40 text-faint",
};

export function EvidenceTag({ kind, className, label }: { kind: Evidence; className?: string; label?: string }) {
  return (
    <span title={EVIDENCE_HINT[kind]} className={cn("ui inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap", STYLE[kind], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label ?? EVIDENCE_LABEL[kind]}
    </span>
  );
}
