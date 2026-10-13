"use client";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const base = "ui w-full rounded-xl border border-line-strong bg-deep/60 px-3.5 py-2.5 text-sm text-offwhite placeholder:text-faint focus:border-lime/70 outline-none";

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("eyebrow mb-1.5", className)}>{children}</div>;
}
export function Input(p: InputHTMLAttributes<HTMLInputElement>) { return <input {...p} className={cn(base, p.className)} />; }
export function Textarea(p: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...p} className={cn(base, "min-h-[84px] resize-y", p.className)} />; }
export function Select(p: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...p} className={cn(base, "appearance-none", p.className)} />; }
