"use client";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MonthResult } from "@/lib/finance";
import { fmtBRL, fmtBRLk } from "@/lib/finance";
import { ChartTooltip } from "./ChartTooltip";

export function CostComposition({ months, height = 240 }: { months: MonthResult[]; height?: number }) {
  const data = months.map((m) => ({ m: m.m, variaveis: Math.round(m.variableCosts), aquisicao: Math.round(m.acquisition), clubes: Math.round(m.clubOps), fixos: Math.round(m.fixed) }));
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Composição de custos por mês: variáveis, aquisição, clubes e estrutura fixa">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="m" tickLine={false} axisLine={false} tickFormatter={(v) => `M${v}`} />
          <YAxis tickLine={false} axisLine={false} width={60} tickFormatter={(v) => fmtBRLk(v)} />
          <Tooltip content={<ChartTooltip fmt={(v: number) => fmtBRL(v)} />} cursor={{ fill: "rgba(239,232,218,0.06)" }} />
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--runz-muted)" }} />
          <Bar dataKey="fixos" name="Estrutura fixa" stackId="c" fill="rgba(239,232,218,0.28)" maxBarSize={26} animationDuration={600} />
          <Bar dataKey="aquisicao" name="Aquisição" stackId="c" fill="var(--runz-pink)" maxBarSize={26} animationDuration={600} />
          <Bar dataKey="variaveis" name="Custos variáveis" stackId="c" fill="var(--runz-lime)" maxBarSize={26} animationDuration={600} />
          <Bar dataKey="clubes" name="Operação dos clubes" stackId="c" fill="rgba(239,232,218,0.6)" radius={[3, 3, 0, 0]} maxBarSize={26} animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
