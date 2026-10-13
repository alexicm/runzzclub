"use client";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { cn } from "@/lib/cn";

/**
 * Logotipo oficial RUNZ (PNG do acervo) separado em duas camadas sem alteração de
 * proporção: as duas estrelas acima do "ü" e o wordmark. O arquivo original tem
 * 1406 × 595 px; a camada de estrelas ocupa as linhas 0 a 180 e o wordmark de 180 a 595.
 * A animação move as camadas, nunca redesenha a marca.
 */
export function LogoMotion({ variant = "white", className, play = true, loop = true }: { variant?: "white" | "black"; className?: string; play?: boolean; loop?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = root.current; if (!el) return;
    const word = el.querySelector<HTMLElement>("[data-word]");
    const stars = el.querySelectorAll<HTMLElement>("[data-star]");
    const wrap = el.querySelector<HTMLElement>("[data-wrap]");
    if (!word || !wrap) return;
    if (!play) { gsap.set([word, stars], { opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, clipPath: "inset(0 0% 0 0)" }); return; }
    if (prefersReducedMotion()) { gsap.set([word, stars], { opacity: 1, clipPath: "inset(0 0% 0 0)" }); return; }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.set(word, { clipPath: "inset(0 100% 0 0)", opacity: 1, y: 10 })
      .set(stars, { opacity: 0, scale: 0, rotate: -90, transformOrigin: "50% 50%" })
      .to(word, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 1.1, ease: "power4.inOut" }, 0.1)
      .to(stars, { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.2)", stagger: 0.12 }, 0.75);
    if (loop) {
      // movimento contínuo e sutil: as estrelas "pulsam" e o conjunto respira
      tl.add(() => {
        gsap.to(stars[0], { y: -6, rotate: 8, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(stars[1], { y: -8, rotate: -8, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.3 });
        gsap.to(wrap, { y: -4, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(stars, { scale: 1.08, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4 });
      });
    }
  }, { scope: root, dependencies: [play, loop] });

  const starSrc = `/brand/logo-${variant}-stars.png`;
  const wordSrc = `/brand/logo-${variant}-word.png`;
  // posições das estrelas no arquivo original: bbox x 403..786, divisão entre 556 e 631 (gap central)
  return (
    <div ref={root} className={cn("relative select-none", className)} role="img" aria-label="RUNZ">
      <div data-wrap className="relative w-full" style={{ aspectRatio: "1406 / 595" }}>
        {/* camada das estrelas: duas metades do mesmo PNG para animar individualmente */}
        <div data-star className="absolute left-0 top-0 w-full overflow-hidden" style={{ height: `${(180 / 595) * 100}%`, clipPath: "inset(0 57.6% 0 0)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={starSrc} alt="" className="block w-full h-auto" draggable={false} />
        </div>
        <div data-star className="absolute left-0 top-0 w-full overflow-hidden" style={{ height: `${(180 / 595) * 100}%`, clipPath: "inset(0 0 0 42.4%)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={starSrc} alt="" className="block w-full h-auto" draggable={false} />
        </div>
        <div data-word className="absolute left-0 w-full" style={{ top: `${(180 / 595) * 100}%` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordSrc} alt="" className="block w-full h-auto" draggable={false} />
        </div>
      </div>
    </div>
  );
}
