"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Calendar, Flag, Play, Sparkles } from "lucide-react";
import { JOURNEY } from "@/data/product";
import { cn } from "@/lib/cn";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/animations/gsap";
import { Button } from "@/components/ui/Button";

type Goal = "5k" | "10k";
interface Form { name: string; level: "iniciante" | "intermediario"; goal: Goal; minutes: number; km: number; effort: 1 | 2 | 3 | 4 | 5; }

const PLAN: Record<Goal, { weeks: number; perWeek: number; week: { d: string; t: string; k: "leve" | "intervalado" | "longo" | "descanso" }[] }> = {
  "5k": { weeks: 8, perWeek: 3, week: [{ d: "Seg", t: "Corrida leve · 20 min", k: "leve" }, { d: "Ter", t: "Descanso", k: "descanso" }, { d: "Qua", t: "Intervalado · 6 × 1 min", k: "intervalado" }, { d: "Qui", t: "Descanso", k: "descanso" }, { d: "Sex", t: "Descanso", k: "descanso" }, { d: "Sáb", t: "Longo · 30 min", k: "longo" }, { d: "Dom", t: "Descanso", k: "descanso" }] },
  "10k": { weeks: 10, perWeek: 4, week: [{ d: "Seg", t: "Corrida leve · 30 min", k: "leve" }, { d: "Ter", t: "Descanso", k: "descanso" }, { d: "Qua", t: "Intervalado · 5 × 3 min", k: "intervalado" }, { d: "Qui", t: "Descanso", k: "descanso" }, { d: "Sex", t: "Ritmo · 25 min", k: "leve" }, { d: "Sáb", t: "Descanso", k: "descanso" }, { d: "Dom", t: "Longo · 50 min", k: "longo" }] },
};

function Status() {
  return <div className="ui flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-offwhite"><span>9:41</span><span className="h-[6px] w-[6px] rounded-full bg-lime" /></div>;
}
function Pill({ children, on }: { children: React.ReactNode; on?: boolean }) {
  return <span className={cn("ui rounded-full px-3 py-1 text-[11px] font-semibold", on ? "bg-pink text-offwhite" : "bg-offwhite/10 text-offwhite/80")}>{children}</span>;
}
function Primary({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="ui mt-auto flex h-11 w-full items-center justify-center gap-2 rounded-full bg-pink text-[13px] font-bold text-offwhite">{children}</button>;
}

export function MVPJourney({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>({ name: "Theo", level: "iniciante", goal: "5k", minutes: 22, km: 3.1, effort: 3 });
  const screen = useRef<HTMLDivElement>(null);
  const plan = PLAN[form.goal];
  const go = (n: number) => setStep(Math.max(0, Math.min(JOURNEY.length - 1, n)));

  useGSAP(() => {
    const el = screen.current; if (!el || !active) return;
    if (prefersReducedMotion()) return;
    gsap.fromTo(el, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, ease: "power3.out" });
  }, { scope: screen, dependencies: [step, active] });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const screens: React.ReactNode[] = [
    // 1 cadastro
    <div key="s1" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-5 w-auto self-start" />
      <h4 className="display mt-3 text-2xl text-offwhite">criar conta.</h4>
      <p className="ui text-[12px] text-muted">Origem registrada: link do clube <span className="text-lime">Z2 Running</span> (exemplo).</p>
      <label className="ui text-[11px] text-faint">Nome<input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full rounded-xl border border-line-strong bg-black/40 px-3 py-2 text-[13px] text-offwhite outline-none focus:border-lime" /></label>
      <label className="ui text-[11px] text-faint">E-mail<input readOnly value="theo@exemplo.com" className="mt-1 w-full rounded-xl border border-line bg-black/40 px-3 py-2 text-[13px] text-offwhite/70" /></label>
      <p className="ui text-[10.5px] leading-snug text-faint">Ao continuar você aceita os termos. Dados de saúde não são compartilhados com clubes.</p>
      <Primary onClick={() => go(1)}>Continuar <ChevronRight size={16} /></Primary>
    </div>,
    // 2 avaliação
    <div key="s2" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Avaliação inicial · 1 de 3</span>
      <h4 className="display text-2xl text-offwhite">como você corre hoje?</h4>
      <div className="flex flex-col gap-2">
        {([["iniciante", "Comecei há menos de 3 meses ou não corro"], ["intermediario", "Corro de 2 a 3 vezes por semana"]] as const).map(([v, l]) => (
          <button key={v} onClick={() => set("level", v)} className={cn("ui rounded-2xl border px-4 py-3 text-left text-[13px]", form.level === v ? "border-lime bg-lime/10 text-offwhite" : "border-line text-offwhite/80")}>{l}</button>
        ))}
      </div>
      <p className="ui text-[11px] leading-snug text-faint">Perguntas definidas pelo treinador responsável. Situações fora do escopo são encaminhadas para avaliação humana.</p>
      <Primary onClick={() => go(2)}>Continuar <ChevronRight size={16} /></Primary>
    </div>,
    // 3 objetivo
    <div key="s3" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Objetivo</span>
      <h4 className="display text-2xl text-offwhite">qual a sua meta?</h4>
      <div className="grid grid-cols-2 gap-2">
        {(["5k", "10k"] as Goal[]).map((g) => (
          <button key={g} onClick={() => set("goal", g)} className={cn("flex flex-col items-start gap-1 rounded-2xl border p-4", form.goal === g ? "border-pink bg-pink/10" : "border-line")}>
            <Flag size={16} className={form.goal === g ? "text-pink" : "text-muted"} />
            <span className="display text-3xl text-offwhite">{g}</span>
            <span className="ui text-[11px] text-muted">{PLAN[g].weeks} semanas · {PLAN[g].perWeek}x/sem</span>
          </button>
        ))}
      </div>
      <div className="ui rounded-xl border border-line p-3 text-[12px] text-offwhite/85">
        <div className="eyebrow mb-1">Prévia do plano {form.goal}</div>
        {plan.week.filter((w) => w.k !== "descanso").map((w) => <div key={w.d} className="flex justify-between"><span className="text-muted">{w.d}</span><span>{w.t}</span></div>)}
      </div>
      <Primary onClick={() => go(3)}>Gerar plano <Sparkles size={16} /></Primary>
    </div>,
    // 4 plano
    <div key="s4" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Seu plano</span>
      <h4 className="display text-2xl text-offwhite">{form.goal} em {plan.weeks} semanas.</h4>
      <div className="flex gap-2"><Pill on>{plan.perWeek} treinos/semana</Pill><Pill>{form.level === "iniciante" ? "Iniciante" : "Intermediário"}</Pill></div>
      <ul className="ui flex flex-col gap-2 text-[12.5px]">
        <li className="rounded-xl bg-offwhite/6 px-3 py-2"><span className="text-lime">Semanas 1 a 2</span> · adaptação, caminhada e trote</li>
        <li className="rounded-xl bg-offwhite/6 px-3 py-2"><span className="text-lime">Semanas 3 a {plan.weeks - 2}</span> · progressão de volume e intervalados</li>
        <li className="rounded-xl bg-offwhite/6 px-3 py-2"><span className="text-lime">Últimas 2 semanas</span> · ajuste e simulação da prova</li>
      </ul>
      <p className="ui text-[10.5px] leading-snug text-faint">Plano versionado e aprovado pelo responsável técnico (v0 · protótipo). Não substitui avaliação individual.</p>
      <Primary onClick={() => go(4)}>Ver calendário <Calendar size={16} /></Primary>
    </div>,
    // 5 calendário
    <div key="s5" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Semana 1 de {plan.weeks}</span>
      <h4 className="display text-2xl text-offwhite">calendário.</h4>
      <ul className="flex flex-col gap-1.5">
        {plan.week.map((w, i) => (
          <li key={w.d} className={cn("ui flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px]", w.k === "descanso" ? "text-faint" : "bg-offwhite/6 text-offwhite")}>
            <span className="num w-8 text-[11px] text-muted">{w.d}</span>
            <span className={cn("h-2 w-2 rounded-full", w.k === "leve" ? "bg-lime" : w.k === "intervalado" ? "bg-pink" : w.k === "longo" ? "bg-offwhite" : "bg-offwhite/20")} />
            <span className="flex-1">{w.t}</span>
            {i === 0 && <span className="text-[10px] text-lime">hoje</span>}
          </li>
        ))}
      </ul>
      <Primary onClick={() => go(5)}>Registrar treino de hoje <Play size={16} /></Primary>
    </div>,
    // 6 registro
    <div key="s6" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Registro · {plan.week[0].t}</span>
      <h4 className="display text-2xl text-offwhite">como foi?</h4>
      <label className="ui text-[11px] text-faint">Tempo (min)<input type="number" value={form.minutes} onChange={(e) => set("minutes", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-line-strong bg-black/40 px-3 py-2 text-[13px] text-offwhite outline-none focus:border-lime" /></label>
      <label className="ui text-[11px] text-faint">Distância (km, opcional)<input type="number" step="0.1" value={form.km} onChange={(e) => set("km", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-line-strong bg-black/40 px-3 py-2 text-[13px] text-offwhite outline-none focus:border-lime" /></label>
      <div className="ui text-[11px] text-faint">Esforço percebido
        <div className="mt-1 flex gap-1.5">{([1, 2, 3, 4, 5] as const).map((e) => <button key={e} onClick={() => set("effort", e)} className={cn("num h-9 flex-1 rounded-lg border text-[13px]", form.effort === e ? "border-pink bg-pink text-offwhite" : "border-line text-offwhite/80")}>{e}</button>)}</div>
      </div>
      <Primary onClick={() => go(6)}>Salvar <Check size={16} /></Primary>
    </div>,
    // 7 feedback
    <div key="s7" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Feedback</span>
      <h4 className="display text-2xl text-offwhite">treino registrado.</h4>
      <div className="ui grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-offwhite/6 py-2"><div className="num text-lg text-lime">{form.minutes}′</div><div className="text-[10px] text-faint">tempo</div></div>
        <div className="rounded-xl bg-offwhite/6 py-2"><div className="num text-lg text-offwhite">{form.km > 0 ? form.km.toLocaleString("pt-BR") : "—"}</div><div className="text-[10px] text-faint">km</div></div>
        <div className="rounded-xl bg-offwhite/6 py-2"><div className="num text-lg text-offwhite">{form.km > 0 ? `${Math.floor(form.minutes / form.km)}:${String(Math.round(((form.minutes / form.km) % 1) * 60)).padStart(2, "0")}` : "—"}</div><div className="text-[10px] text-faint">min/km</div></div>
      </div>
      <p className="body text-[13px] leading-snug text-offwhite/90">
        {form.effort >= 4 ? "Esforço alto para um treino leve. O próximo treino mantém o volume e reduz o ritmo." : "Esforço compatível com treino leve. O plano segue como previsto."}
        {form.km <= 0 && " Sem distância registrada, o feedback usa apenas tempo e esforço."}
      </p>
      <p className="ui text-[10.5px] leading-snug text-faint">O feedback explica o que os dados permitem concluir. Sem relógio, o app não inventa métricas ausentes.</p>
      <Primary onClick={() => go(7)}>Próximo treino <ArrowRight size={16} /></Primary>
    </div>,
    // 8 próximo
    <div key="s8" className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-5 pt-4">
      <span className="eyebrow">Próximo treinamento</span>
      <h4 className="display text-2xl text-offwhite">{plan.week[2].d}: {plan.week[2].t.split(" · ")[0].toLowerCase()}.</h4>
      <div className="ui rounded-2xl border border-pink/40 bg-pink/10 p-3 text-[12.5px]"><div className="eyebrow mb-1 text-pink">{plan.week[2].t}</div>Aquecimento de 8 min, blocos com recuperação ativa, volta à calma.</div>
      <div className="ui mt-1 rounded-xl border border-line p-3 text-[12px] text-offwhite/85">
        <div className="flex justify-between"><span className="text-muted">Teste gratuito</span><span>dia 1 de 14</span></div>
        <div className="flex justify-between"><span className="text-muted">Primeira cobrança</span><span className="text-lime">R$ 39,90 em 14 dias</span></div>
        <div className="flex justify-between"><span className="text-muted">Cancelar</span><span>a qualquer momento</span></div>
      </div>
      <Primary onClick={() => go(0)}>Recomeçar demonstração</Primary>
    </div>,
  ];

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:[grid-auto-rows:minmax(0,1fr)] gap-5 lg:grid-cols-[1fr_minmax(300px,360px)_1fr] lg:items-center">
      {/* lista de passos */}
      <ol className="order-2 flex flex-col gap-1 lg:order-1" data-reveal>
        {JOURNEY.map((j, i) => (
          <li key={j.id}>
            <button onClick={() => go(i)} className={cn("flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition-colors", i === step ? "bg-offwhite/10" : "hover:bg-offwhite/5")}>
              <span className={cn("num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px]", i < step ? "bg-lime text-ink" : i === step ? "bg-pink text-offwhite" : "border border-line-strong text-muted")}>{i < step ? <Check size={12} /> : j.n}</span>
              <span className="min-w-0"><span className={cn("ui block text-[13px] font-semibold", i === step ? "text-offwhite" : "text-offwhite/75")}>{j.title}</span><span className="ui hidden text-[11.5px] leading-snug text-faint xl:block">{j.hint}</span></span>
            </button>
          </li>
        ))}
      </ol>

      {/* telefone */}
      <div className="order-1 mx-auto lg:order-2" data-reveal data-noswipe style={{ height: "min(640px, calc(100dvh - 300px))", minHeight: 480 }}>
        <div className="relative mx-auto h-full rounded-[44px] border-[6px] border-ink-3 bg-deep shadow-[0_30px_80px_rgba(0,0,0,.6)]" style={{ aspectRatio: "9 / 19" }}>
          <div className="absolute left-1/2 top-2 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
          <div className="absolute inset-0 overflow-hidden rounded-[38px] bg-[#141414]">
            <Status />
            <div ref={screen} className="h-[calc(100%-28px)]">{screens[step]}</div>
          </div>
        </div>
      </div>

      {/* controles e contexto */}
      <div className="order-3 flex flex-col gap-4" data-reveal>
        <div className="rounded-2xl border border-line p-4">
          <div className="eyebrow mb-1">Passo {JOURNEY[step].n} de 8</div>
          <h3 className="display text-2xl text-offwhite">{JOURNEY[step].title.toLowerCase()}</h3>
          <p className="body mt-2 text-[14px] text-offwhite/85">{JOURNEY[step].hint}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => go(step - 1)} disabled={step === 0}><ArrowLeft size={16} /> Anterior</Button>
          <Button onClick={() => go(step + 1)} disabled={step === JOURNEY.length - 1}>Próximo <ArrowRight size={16} /></Button>
        </div>
        <p className="ui text-[11.5px] leading-snug text-faint">Protótipo conceitual com dados fictícios (persona “Theo”). O aplicativo ainda não foi implementado; a prescrição será definida e validada pelo treinador responsável.</p>
      </div>
    </div>
  );
}
