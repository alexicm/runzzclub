"use client";
import { cn } from "@/lib/cn";

export function Segmented<T extends string>({ options, value, onChange, className, size = "md" }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string; size?: "sm" | "md" }) {
  return (
    <div role="tablist" className={cn("ui inline-flex rounded-full border border-line-strong p-1 bg-ink/60", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn("rounded-full font-semibold transition-colors whitespace-nowrap", size === "sm" ? "px-3 h-8 text-[12px]" : "px-4 h-9 text-[13px]", o.value === value ? "bg-offwhite text-ink" : "text-offwhite/75 hover:text-offwhite")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
