"use client";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  className?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, format = (v) => String(v), hint, className }: Props) {
  const id = useId();
  const p = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("ui", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-offwhite/85 leading-tight">{label}</label>
        <output htmlFor={id} className="num text-sm text-offwhite tabular-nums">{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        className="rz-range"
        min={min} max={max} step={step} value={value}
        style={{ ["--p" as string]: `${p}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
      />
      {hint && <p className="-mt-1 text-[11px] text-faint leading-snug">{hint}</p>}
    </div>
  );
}
