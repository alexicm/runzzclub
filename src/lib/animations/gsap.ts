"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Linguagem de movimento RUNZ (valores neutros desta apresentação). */
export const MOTION = {
  ease: "power3.out",
  easeInOut: "power2.inOut",
  fast: 0.18,
  base: 0.42,
  slow: 0.8,
  stagger: 0.06,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, useGSAP };
