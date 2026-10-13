"use client";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { LogoMotion } from "@/components/ui/LogoMotion";
import { Button } from "@/components/ui/Button";
import type { ChapterProps } from "@/components/presentation/Deck";

export function Ch01Hero({ active, goTo }: ChapterProps) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = root.current; if (!el) return;
    const q = gsap.utils.selector(el);
    if (!active) return;
    if (prefersReducedMotion()) { gsap.set(q("[data-h]"), { opacity: 1, y: 0, scale: 1, clipPath: "inset(0 0 0 0)" }); return; }
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(q("[data-h=photo]"), { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
      .fromTo(q("[data-h=veil]"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.2)
      .fromTo(q("[data-h=eyebrow]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .fromTo(q("[data-h=line]"), { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 0.9, stagger: 0.14 }, 1.2)
      .fromTo(q("[data-h=sub]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 1.8)
      .fromTo(q("[data-h=cta]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 2.0)
      .fromTo(q("[data-h=meta]"), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.3);
    // leve paralaxe contínua da foto
    gsap.to(q("[data-h=photo]"), { yPercent: -3, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.6 });
  }, { scope: root, dependencies: [active] });

  return (
    <div ref={root} className="relative -m-[var(--slide-pad-x)] -mt-[calc(var(--slide-pad-y)+var(--safe-top))] -mb-[calc(var(--slide-pad-y)+56px+var(--safe-bottom))] flex min-h-full flex-1 flex-col overflow-hidden">
      {/* Fotografia oficial do acervo (brand book, aplicações) com tratamento duotone da marca */}
      <div className="absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-h="photo" src="/brand/hero-runners.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_30%] grayscale contrast-[1.15] opacity-0 md:object-[65%_35%]" />
        <div data-h="veil" className="absolute inset-0 bg-pink mix-blend-multiply opacity-0" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,15,15,0.96)_0%,rgba(15,15,15,0.88)_38%,rgba(15,15,15,0.35)_70%,rgba(15,15,15,0.15)_100%)] md:bg-[linear-gradient(90deg,rgba(15,15,15,0.97)_0%,rgba(15,15,15,0.9)_34%,rgba(15,15,15,0.25)_62%,rgba(15,15,15,0.05)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(15,15,15,1)_0%,rgba(15,15,15,0)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between px-[var(--slide-pad-x)] pt-[calc(var(--safe-top)+64px)] pb-[calc(var(--safe-bottom)+72px)] md:pt-[calc(var(--safe-top)+88px)] md:pb-[calc(var(--safe-bottom)+80px)]">
        <div>
          <div data-h="eyebrow" className="eyebrow mb-6 flex items-center gap-3 opacity-0">
            <span className="h-px w-8 bg-lime" aria-hidden /> From community to performance
          </div>
          <LogoMotion variant="white" play={active} className="w-[64vw] max-w-[420px] md:w-[30vw] md:max-w-[520px] xl:max-w-[600px]" />
        </div>

        <div className="mt-10 md:mt-6">
          <h1 className="display text-[2.6rem] leading-[0.92] text-offwhite sm:text-6xl md:text-7xl xl:text-[7.2rem]">
            <span data-h="line" className="block opacity-0">da comunidade</span>
            <span data-h="line" className="block opacity-0">à receita <span className="text-lime">recorrente.</span></span>
          </h1>
          <p data-h="sub" className="serif-italic mt-5 max-w-[34ch] text-lg leading-snug text-offwhite/85 opacity-0 md:mt-7 md:text-2xl">
            Plano de execução, validação e crescimento. Outubro de 2026 a março de 2027.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3 md:mt-9">
            <span data-h="cta" className="opacity-0"><Button size="lg" onClick={() => goTo("agora")}>Explorar o plano <ArrowRight size={18} /></Button></span>
            <span data-h="cta" className="opacity-0"><Button size="lg" variant="outline" onClick={() => goTo("decisoes")}>Ir às decisões</Button></span>
          </div>
          <div data-h="meta" className="ui mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.14em] text-offwhite/60 opacity-0 md:mt-10">
            <span>16 capítulos</span><span>11 entregas nesta semana</span><span>8 decisões para aprovar</span><span className="hidden md:inline">Reunião Yan · Alex · Anthony</span>
          </div>
        </div>
      </div>
    </div>
  );
}
