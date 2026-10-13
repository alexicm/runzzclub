"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthResult } from "@/lib/finance";
import { fmtBRL, fmtBRLk } from "@/lib/finance";
import { ChartTooltip } from "./ChartTooltip";

export function MrrChart({ months, height = 240 }: { months: MonthResult[]; height?: number }) {
  const data = months.map((m) => ({ m: m.m, mrr: Math.round(m.mrr) }));
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Gráfico de MRR bruto por mês">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tickFormatter={(v) => `M${v}`} />
          <YAxis tickLine={false} axisLine={false} width={60} tickFormatter={(v) => fmtBRLk(v)} />
          <Tooltip content={<ChartTooltip fmt={(v: number) => fmtBRL(v)} />} cursor={{ stroke: "rgba(239,232,218,0.25)" }} />
          <Area type="monotone" dataKey="mrr" name="MRR bruto" stroke="var(--runz-lime)" strokeWidth={2} fill="var(--runz-lime)" fillOpacity={0.12} dot={false} activeDot={{ r: 5 }} animationDuration={800} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
