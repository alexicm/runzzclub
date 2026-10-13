"use client";
import { useRef } from "react";
import { gsap, useGSAP, MOTION, prefersReducedMotion } from "./gsap";

/**
 * Revela filhos marcados com [data-reveal] quando o slide se torna ativo.
 * Reexecuta quando `active` muda para true.
 */
export function useReveal<T extends HTMLElement>(active: boolean, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items.length) return;
      if (!active) { gsap.set(items, { opacity: 0, y: 24 }); return; }
      if (prefersReducedMotion()) { gsap.set(items, { opacity: 1, y: 0 }); return; }
      gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: MOTION.slow, ease: MOTION.ease, stagger: MOTION.stagger, overwrite: "auto", delay: 0.15 });
    },
    { scope: ref, dependencies: [active, ...deps] },
  );
  return ref;
}
