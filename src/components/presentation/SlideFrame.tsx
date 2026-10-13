"use client";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReveal } from "@/lib/animations/useReveal";

/**
 * Moldura de capítulo: numeração, eyebrow e título. O conteúdo é livre para que
 * cada capítulo tenha composição própria.
 */
export function SlideFrame({ active, n, eyebrow, title, children, className, titleClassName, headerRight, deps }: {
  active: boolean; n: string; eyebrow: string; title: ReactNode; children: ReactNode; className?: string; titleClassName?: string; headerRight?: ReactNode; deps?: unknown[];
}) {
  const ref = useReveal<HTMLDivElement>(active, deps);
  return (
    <div ref={ref} className={cn("flex h-full w-full flex-col", className)}>
      <header className="mb-5 flex items-end justify-between gap-6 md:mb-7">
        <div className="min-w-0">
          <div data-reveal className="mb-2 flex items-center gap-3">
            <span className="num text-[12px] text-pink">{n}</span>
            <span className="h-px w-8 bg-pink/60" aria-hidden />
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 data-reveal className={cn("display text-3xl md:text-5xl xl:text-[3.6rem] text-offwhite max-w-[22ch]", titleClassName)}>{title}</h2>
        </div>
        {headerRight && <div data-reveal className="hidden shrink-0 md:block">{headerRight}</div>}
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
