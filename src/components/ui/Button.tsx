"use client";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "lime" | "ghost" | "outline" | "subtle";
type Size = "sm" | "md" | "lg";

const V: Record<Variant, string> = {
  primary: "bg-pink text-offwhite hover:brightness-110 active:brightness-95",
  lime: "bg-lime text-ink hover:brightness-105 active:brightness-95",
  ghost: "bg-transparent text-offwhite hover:bg-offwhite/8",
  outline: "bg-transparent text-offwhite border border-line-strong hover:border-offwhite/60",
  subtle: "bg-offwhite/8 text-offwhite hover:bg-offwhite/14",
};
const S: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button
      className={cn("ui inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-[background,filter,border-color,transform] duration-200 disabled:opacity-40 disabled:pointer-events-none select-none", V[variant], S[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
