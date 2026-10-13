"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { cn } from "@/lib/cn";

export function Drawer({ open, onClose, title, eyebrow, children, width = "max-w-xl" }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode; width?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const p = panel.current, b = backdrop.current; if (!p || !b) return;
    const reduced = prefersReducedMotion();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (open) {
      gsap.set(b, { display: "block" }); gsap.set(p, { display: "flex" });
      gsap.to(b, { opacity: 1, duration: reduced ? 0 : 0.25 });
      gsap.fromTo(p, mobile ? { y: "100%" } : { x: "100%" }, { x: 0, y: 0, duration: reduced ? 0 : 0.45, ease: "power3.out" });
      const first = p.querySelector<HTMLElement>("button, input, select, textarea"); first?.focus();
    } else {
      gsap.to(b, { opacity: 0, duration: reduced ? 0 : 0.2, onComplete: () => gsap.set(b, { display: "none" }) });
      gsap.to(p, { ...(mobile ? { y: "100%" } : { x: "100%" }), duration: reduced ? 0 : 0.3, ease: "power2.in", onComplete: () => gsap.set(p, { display: "none" }) });
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);
  return (
    <>
      <div ref={backdrop} onClick={onClose} className="fixed inset-0 z-[60] hidden bg-black/60 opacity-0 backdrop-blur-[2px]" aria-hidden />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title}
        className={cn("fixed z-[70] hidden flex-col bg-ink text-offwhite shadow-2xl border-line-strong",
          "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[28px] border-t",
          "md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:max-h-none md:w-full md:rounded-none md:rounded-l-[28px] md:border-l md:border-t-0", width)}
        style={{ paddingBottom: "var(--safe-bottom)" }}>
        <div className="md:hidden mx-auto mt-2 h-1.5 w-10 rounded-full bg-offwhite/25" aria-hidden />
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-line">
          <div>
            {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
            <h3 className="display text-2xl md:text-3xl text-offwhite">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="shrink-0 rounded-full p-2 hover:bg-offwhite/10"><X size={20} /></button>
        </div>
        <div className="scroll-thin flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </>
  );
}
