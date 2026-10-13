"use client";
import type { TooltipContentProps } from "recharts";

export function ChartTooltip({ active, payload, label, fmt, labelPrefix = "M" }: Partial<TooltipContentProps<number, string>> & { fmt: (v: number, key?: string) => string; labelPrefix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ui rounded-xl border border-line-strong bg-ink px-3 py-2 text-[12px] shadow-xl">
      <div className="mb-1 text-faint">{labelPrefix}{label}</div>
      {payload.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted"><span className="h-2 w-2 rounded-full" style={{ background: p.color as string }} />{p.name}</span>
          <span className="num text-offwhite">{fmt(Number(p.value ?? 0), String(p.dataKey))}</span>
        </div>
      ))}
    </div>
  );
}
