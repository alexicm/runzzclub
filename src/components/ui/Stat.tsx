"use client";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { cn } from "@/lib/cn";

/** Número com contagem animada e atualização fluida. */
export function AnimatedNumber({ value, format, className, duration = 0.8 }: { value: number; format: (v: number) => string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const state = useRef({ v: value });
  const first = useRef(true);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (prefersReducedMotion() || !Number.isFinite(value)) { state.current.v = value; el.textContent = format(value); return; }
    const from = first.current ? 0 : state.current.v;
    first.current = false;
    const tween = gsap.to(state.current, { v: value, duration, ease: "power2.out", overwrite: true, onUpdate: () => { el.textContent = format(state.current.v); }, onStart: () => { state.current.v = from; } });
    return () => { tween.kill(); };
  }, [value, format, duration]);
  return <span ref={ref} className={cn("num", className)}>{format(value)}</span>;
}

export function Stat({ label, value, format, note, size = "md", tone = "default", className }: { label: string; value: number; format: (v: number) => string; note?: string; size?: "sm" | "md" | "lg" | "xl"; tone?: "default" | "pink" | "lime" | "muted"; className?: string }) {
  const sz = { sm: "text-xl", md: "text-3xl", lg: "text-4xl md:text-5xl", xl: "text-5xl md:text-7xl" }[size];
  const tn = { default: "text-offwhite", pink: "text-pink", lime: "text-lime", muted: "text-muted" }[tone];
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="eyebrow">{label}</span>
      <AnimatedNumber value={value} format={format} className={cn(sz, tn, "leading-none")} />
      {note && <span className="text-[12px] text-faint leading-snug">{note}</span>}
    </div>
  );
}
