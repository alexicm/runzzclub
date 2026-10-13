"use client";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { paybackCurve, fmtBRL2 } from "@/lib/finance";
import { ChartTooltip } from "./ChartTooltip";

/** Recuperação do CAC por coorte: contribuição acumulada (com retenção) menos CAC. */
export function PaybackCurve({ contribution, cac, churn, compare, height = 240 }: { contribution: number; cac: number; churn: number; compare?: { contribution: number; cac: number; churn: number; label: string }; height?: number }) {
  const a = paybackCurve(contribution, cac, churn, 12).rows;
  const b = compare ? paybackCurve(compare.contribution, compare.cac, compare.churn, 12).rows : null;
  const data = a.map((r, i) => ({ cycle: r.cycle, net: Number(r.net.toFixed(2)), ref: b ? Number(b[i].net.toFixed(2)) : undefined }));
  return (
    <div style={{ width: "100%", height }} role="img" aria-label="Curva de recuperação do CAC por ciclo pago">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="cycle" tickLine={false} axisLine={false} tickFormatter={(v) => `C${v}`} />
          <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={(v) => fmtBRL2(v)} />
          <Tooltip content={<ChartTooltip labelPrefix="Ciclo " fmt={(v: number) => fmtBRL2(v)} />} cursor={{ stroke: "rgba(239,232,218,0.25)" }} />
          <ReferenceLine y={0} stroke="rgba(239,232,218,0.5)" strokeDasharray="4 4" />
          {compare && <Line type="monotone" dataKey="ref" name={compare.label} stroke="rgba(239,232,218,0.45)" strokeWidth={2} strokeDasharray="5 4" dot={false} animationDuration={700} />}
          <Line type="monotone" dataKey="net" name="Acumulado − CAC" stroke="var(--runz-pink)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--runz-pink)", strokeWidth: 0 }} activeDot={{ r: 6 }} animationDuration={700} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
