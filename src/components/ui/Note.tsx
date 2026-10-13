import { Info } from "lucide-react";
import { cn } from "@/lib/cn";

/** Nota de contexto curta. Usar apenas onde necessário. */
export function Note({ children, className, tone = "muted" }: { children: React.ReactNode; className?: string; tone?: "muted" | "warn" | "pink" }) {
  const c = { muted: "text-muted border-line", warn: "text-warn border-warn/40", pink: "text-pink border-pink/40" }[tone];
  return (
    <p className={cn("ui flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px] leading-snug", c, className)}>
      <Info size={14} className="mt-[1px] shrink-0" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
