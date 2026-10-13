"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Minimize2, X, Home } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { cn } from "@/lib/cn";
import { CHAPTERS } from "./chapters";

export interface ChapterProps { active: boolean; goTo: (id: string) => void; }
export type ChapterComponent = ComponentType<ChapterProps>;

function isEditable(t: EventTarget | null) {
  const el = t as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function Deck({ components }: { components: Record<string, ChapterComponent> }) {
  const total = CHAPTERS.length;
  const [current, setCurrent] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const dir = useRef(1);
  const [menu, setMenu] = useState(false);
  const [fs, setFs] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // hash inicial (#c05)
  useEffect(() => {
    const m = window.location.hash.match(/^#c(\d{2})$/);
    if (!m) return;
    const i = Number(m[1]) - 1;
    if (i < 0 || i >= total) return;
    const id = requestAnimationFrame(() => setCurrent(i));
    return () => cancelAnimationFrame(id);
  }, [total]);

  const go = useCallback((n: number) => {
    const i = Math.max(0, Math.min(total - 1, n));
    if (i === current) return;
    dir.current = i > current ? 1 : -1;
    setLeaving(current);
    setCurrent(i);
    history.replaceState(null, "", `#c${String(i + 1).padStart(2, "0")}`);
  }, [current, total]);
  const next = useCallback(() => go(current + 1), [go, current]);
  const prev = useCallback(() => go(current - 1), [go, current]);
  const goTo = useCallback((id: string) => { const i = CHAPTERS.findIndex((c) => c.id === id); if (i >= 0) go(i); }, [go]);

  // transição GSAP
  useGSAP(() => {
    const root = stage.current; if (!root) return;
    const inc = root.querySelector<HTMLElement>(`[data-slide="${current}"]`);
    const out = leaving !== null ? root.querySelector<HTMLElement>(`[data-slide="${leaving}"]`) : null;
    if (!inc) return;
    // garante que qualquer outro slide montado fique oculto
    root.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => { if (el !== inc && el !== out) gsap.set(el, { visibility: "hidden", opacity: 0 }); });
    const reduced = prefersReducedMotion();
    const d = dir.current;
    const tl = gsap.timeline({ onComplete: () => setLeaving(null) });
    gsap.set(inc, { visibility: "visible" });
    if (reduced || !out) {
      gsap.set(inc, { opacity: 1, xPercent: 0, scale: 1, clipPath: "inset(0 0 0 0)" });
      if (out) gsap.set(out, { opacity: 0, visibility: "hidden" });
      tl.to({}, { duration: 0.01 });
      return;
    }
    tl.to(out, { opacity: 0, xPercent: -8 * d, scale: 0.985, duration: 0.42, ease: "power2.in", overwrite: "auto" }, 0)
      .set(out, { visibility: "hidden" })
      .fromTo(inc, { opacity: 0, xPercent: 6 * d, scale: 1.01, clipPath: d > 0 ? "inset(0 0 0 12%)" : "inset(0 12% 0 0)" }, { opacity: 1, xPercent: 0, scale: 1, clipPath: "inset(0 0% 0 0%)", duration: 0.7, ease: "power3.out" }, 0.22);
  }, { scope: stage, dependencies: [current] });

  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.();
  }, []);

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (menu) { if (e.key === "Escape") setMenu(false); return; }
      switch (e.key) {
        case "ArrowRight": case "PageDown": case " ": case "Enter": e.preventDefault(); next(); break;
        case "ArrowLeft": case "PageUp": case "Backspace": e.preventDefault(); prev(); break;
        case "Home": e.preventDefault(); go(0); break;
        case "End": e.preventDefault(); go(total - 1); break;
        case "f": case "F": toggleFs(); break;
        case "m": case "M": setMenu(true); break;
        case "Escape": if (document.fullscreenElement) document.exitFullscreen(); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, menu, total, toggleFs]);

  // swipe (mobile)
  useEffect(() => {
    const el = stage.current; if (!el) return;
    let sx = 0, sy = 0, t0 = 0, skip = false;
    const start = (e: TouchEvent) => {
      const t = e.touches[0]; sx = t.clientX; sy = t.clientY; t0 = Date.now();
      const target = e.target as HTMLElement;
      skip = !!target.closest("input[type=range], [data-noswipe]");
    };
    const end = (e: TouchEvent) => {
      if (skip) return;
      const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - t0 < 700) { if (dx < 0) next(); else prev(); }
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => { el.removeEventListener("touchstart", start); el.removeEventListener("touchend", end); };
  }, [next, prev]);

  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const mounted = useMemo(() => {
    const s = new Set<number>([current]);
    if (leaving !== null) s.add(leaving);
    if (current + 1 < total) s.add(current + 1);
    if (current - 1 >= 0) s.add(current - 1);
    return s;
  }, [current, leaving, total]);

  const progress = ((current + 1) / total) * 100;
  const chapter = CHAPTERS[current];

  return (
    <div className="deck-stage bg-deep text-offwhite" ref={stage}>
      {/* slides */}
      {CHAPTERS.map((c, i) => {
        if (!mounted.has(i)) return null;
        const C = components[c.id];
        const active = i === current;
        return (
          <section key={c.id} data-slide={i} aria-hidden={!active} className={cn("slide scroll-thin", !active && leaving !== i && "invisible")} style={{ zIndex: active ? 2 : 1 }}>
            {C ? <C active={active} goTo={goTo} /> : null}
          </section>
        );
      })}

      {/* barra superior */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 md:px-7" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        <button onClick={() => go(0)} className="pointer-events-auto flex items-center gap-2 rounded-full px-2 py-1 hover:bg-offwhite/8" aria-label="Voltar ao início">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-4 w-auto md:h-5" />
        </button>
        <div className="pointer-events-auto flex items-center gap-1 md:gap-2">
          <span className="ui hidden text-[12px] text-muted md:inline">{chapter.n} / {String(total).padStart(2, "0")} · {chapter.short}</span>
          <button onClick={() => setMenu(true)} className="rounded-full p-2 hover:bg-offwhite/10" aria-label="Capítulos (M)"><LayoutGrid size={18} /></button>
          <button onClick={toggleFs} className="hidden rounded-full p-2 hover:bg-offwhite/10 md:block" aria-label="Tela cheia (F)">{fs ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
        </div>
      </div>

      {/* progresso */}
      <div className="fixed inset-x-0 z-30 h-[3px] bg-offwhite/10" style={{ bottom: "calc(var(--safe-bottom) + 56px)" }} aria-hidden>
        <div className="h-full bg-pink transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* barra inferior: desktop discreta / mobile estilo app */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between border-t border-line bg-deep/85 px-3 backdrop-blur-md md:border-0 md:bg-transparent md:backdrop-blur-0 md:px-7" style={{ paddingBottom: "var(--safe-bottom)", height: "calc(56px + var(--safe-bottom))" }} aria-label="Navegação da apresentação">
        <div className="ui flex items-center gap-3 text-[12px] text-muted">
          <span className="md:hidden">{chapter.n}/{String(total).padStart(2, "0")}</span>
          <span className="hidden md:inline">← → navegar · F tela cheia · M capítulos</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => go(0)} className="rounded-full p-2.5 hover:bg-offwhite/10 md:hidden" aria-label="Início"><Home size={20} /></button>
          <button onClick={prev} disabled={current === 0} className="rounded-full p-2.5 hover:bg-offwhite/10 disabled:opacity-30" aria-label="Anterior"><ChevronLeft size={22} /></button>
          <button onClick={next} disabled={current === total - 1} className="rounded-full bg-offwhite p-2.5 text-ink hover:brightness-95 disabled:opacity-30" aria-label="Próximo"><ChevronRight size={22} /></button>
        </div>
      </nav>

      {/* menu de capítulos */}
      {menu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-deep/95 backdrop-blur-md" role="dialog" aria-label="Capítulos" style={{ paddingTop: "var(--safe-top)", paddingBottom: "var(--safe-bottom)" }}>
          <div className="flex items-center justify-between px-5 py-4 md:px-10">
            <span className="display text-2xl text-offwhite">capítulos</span>
            <button onClick={() => setMenu(false)} className="rounded-full p-2 hover:bg-offwhite/10" aria-label="Fechar"><X size={22} /></button>
          </div>
          <div className="scroll-thin grid flex-1 content-start gap-1 overflow-y-auto px-5 pb-6 md:grid-cols-2 md:gap-2 md:px-10 xl:grid-cols-4">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} onClick={() => { setMenu(false); go(i); }} className={cn("group flex items-start gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-offwhite/8", i === current && "bg-offwhite/10")}>
                <span className={cn("num mt-0.5 text-[12px]", i === current ? "text-pink" : "text-muted")}>{c.n}</span>
                <span>
                  <span className="ui block text-[11px] uppercase tracking-[0.16em] text-faint">{c.short}</span>
                  <span className="display block text-lg leading-tight text-offwhite md:text-xl">{c.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
