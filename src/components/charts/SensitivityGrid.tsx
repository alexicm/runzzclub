"use client";
import { cn } from "@/lib/cn";

/** Mapa de sensibilidade (duas variáveis). Cor sequencial de uma só matiz + rótulo em cada célula. */
export function SensitivityGrid({ rows, cols, values, rowLabel, colLabel, format, rowFormat, colFormat, highlight, good = "high" }: {
  rows: number[]; cols: number[]; values: number[][]; rowLabel: string; colLabel: string;
  format: (v: number) => string; rowFormat: (v: number) => string; colFormat: (v: number) => string;
  highlight?: { row: number; col: number }; good?: "high" | "low";
}) {
  const flat = values.flat().filter(Number.isFinite);
  const min = Math.min(...flat), max = Math.max(...flat);
  const t = (v: number) => (max === min ? 0.5 : (v - min) / (max - min));
  return (
    <div className="ui text-[11px]" role="table" aria-label={`Sensibilidade: ${rowLabel} versus ${colLabel}`}>
      <div className="mb-1 flex items-center gap-2 text-faint"><span>↓ {rowLabel}</span><span className="ml-auto">{colLabel} →</span></div>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `72px repeat(${cols.length}, minmax(0, 1fr))` }}>
        <div />
        {cols.map((c) => <div key={c} className="num py-1 text-center text-muted">{colFormat(c)}</div>)}
        {rows.map((r, i) => (
          <>
            <div key={`r${r}`} className="num flex items-center pr-2 text-right text-muted justify-end">{rowFormat(r)}</div>
            {cols.map((c, j) => {
              const v = values[i][j];
              const k = good === "high" ? t(v) : 1 - t(v);
              const isH = highlight && highlight.row === i && highlight.col === j;
              return (
                <div key={`${r}-${c}`} title={`${rowLabel} ${rowFormat(r)} · ${colLabel} ${colFormat(c)}: ${format(v)}`}
                  className={cn("num flex h-9 items-center justify-center rounded-[4px] tabular-nums transition-colors", isH && "ring-2 ring-offwhite")}
                  style={{ background: `rgba(184,247,5,${0.08 + k * 0.6})`, color: k > 0.55 ? "#1d1d1d" : "var(--runz-offwhite)" }}>
                  {format(v)}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
