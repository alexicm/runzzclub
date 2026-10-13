"use client";
import { Area, Bar, ComposedChart, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthResult } from "@/lib/finance";
import { fmtBRL, fmtBRLk } from "@/lib/finance";
import { ChartTooltip } from "./ChartTooltip";

export function CashFlowChart({ months, height = 260 }: { months: MonthResult[]; height?: number }) {
  const data = months.map((m) => ({ m: m.m, resultado: Math.round(m.result), caixa: Math.round(m.cash) }));
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Resultado operacional mensal e evolução do caixa simplificado">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tickFormatter={(v) => `M${v}`} />
          <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={(v) => fmtBRLk(v)} />
          <Tooltip content={<ChartTooltip fmt={(v: number) => fmtBRL(v)} />} cursor={{ stroke: "rgba(239,232,218,0.25)" }} />
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--runz-muted)" }} />
          <ReferenceLine y={0} stroke="rgba(239,232,218,0.5)" />
          <Bar dataKey="resultado" name="Resultado do mês" fill="var(--runz-lime)" radius={[3, 3, 3, 3]} maxBarSize={22} animationDuration={600} />
          <Area type="monotone" dataKey="caixa" name="Caixa acumulado (com desembolso inicial)" stroke="var(--runz-pink)" strokeWidth={2} fill="var(--runz-pink)" fillOpacity={0.1} dot={false} animationDuration={800} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
