"use client";
import { Area, Bar, ComposedChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import type { MonthResult } from "@/lib/finance";
import { fmtInt } from "@/lib/finance";
import { ChartTooltip } from "./ChartTooltip";

/** Base ativa, novos pagantes e cancelamentos por mês. */
export function SubscriberGrowthChart({ months, target, height = 260 }: { months: MonthResult[]; target?: number; height?: number }) {
  const data = months.map((m) => ({ m: m.m, base: Math.round(m.base), novos: Math.round(m.newPayers), cancelados: -Math.round(m.churned) }));
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Gráfico de assinantes por mês: base ativa, novos pagantes e cancelamentos">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tickFormatter={(v) => `M${v}`} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => fmtInt(v)} />
          <Tooltip content={<ChartTooltip fmt={(v: number) => fmtInt(Math.abs(v))} />} cursor={{ stroke: "rgba(239,232,218,0.25)" }} />
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--runz-muted)" }} />
          <Bar dataKey="novos" name="Novos pagantes" fill="var(--runz-lime)" radius={[3, 3, 0, 0]} maxBarSize={22} isAnimationActive animationDuration={600} />
          <Bar dataKey="cancelados" name="Cancelamentos" fill="rgba(239,232,218,0.35)" radius={[0, 0, 3, 3]} maxBarSize={22} isAnimationActive animationDuration={600} />
          <Area type="monotone" dataKey="base" name="Base ativa" stroke="var(--runz-pink)" strokeWidth={2} fill="var(--runz-pink)" fillOpacity={0.12} dot={false} activeDot={{ r: 5 }} isAnimationActive animationDuration={800} />
          {target && <ReferenceLine y={target} stroke="var(--runz-offwhite)" strokeDasharray="4 4" label={{ value: `Meta ${fmtInt(target)}`, position: "insideTopLeft", fill: "var(--runz-offwhite)", fontSize: 11, fontFamily: "var(--font-ui)" }} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
