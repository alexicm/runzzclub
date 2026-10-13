"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Presentation, LayoutDashboard, TrendingUp, Boxes, Wallet, ListChecks, RotateCcw, Plus, X } from "lucide-react";
import { useRunz, type GrowthOps } from "@/lib/store";
import { ALL_TASKS, WEEK1_TASKS } from "@/data/tasks";
import { DECISIONS } from "@/data/decisions";
import { FEATURES, MODULE_LABEL, type Feature } from "@/data/product";
import { PEOPLE } from "@/data/people";
import { useSim } from "@/lib/useSim";
import { unitContribution, paybackCurve, breakEvenPayers, fmtBRL, fmtBRL2, fmtInt, fmtPct, fmtPct1, fmtDate } from "@/lib/finance";
import { Gantt30 } from "@/components/roadmap/Gantt30";
import { FinancialSimulator } from "@/components/simulator/FinancialSimulator";
import { DecisionPanel } from "@/components/operations/DecisionPanel";
import { ExecutionBoard } from "@/components/operations/ExecutionBoard";
import { EvidenceTag } from "@/components/ui/EvidenceTag";
import { Note } from "@/components/ui/Note";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { StatusPill, DECISION_STATUS_LABEL } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";

type Tab = "visao" | "growth" | "produto" | "financeiro" | "execucao";
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "visao", label: "Visão geral", icon: <LayoutDashboard size={18} /> },
  { id: "growth", label: "Growth", icon: <TrendingUp size={18} /> },
  { id: "produto", label: "Produto", icon: <Boxes size={18} /> },
  { id: "financeiro", label: "Financeiro", icon: <Wallet size={18} /> },
  { id: "execucao", label: "Execução", icon: <ListChecks size={18} /> },
];

const RISKS = [
  { r: "Clubes não utilizam a ferramenta", m: "Medir encontros recorrentes, não apenas adesão inicial" },
  { r: "Cancelamento antes do retorno do CAC", m: "Limites de CAC, análise por coorte e pausa do canal ruim" },
  { r: "Prescrição inadequada", m: "Supervisão, testes, escopo restrito e encaminhamento" },
  { r: "Dependência de APIs ou lojas", m: "Matriz de direitos, alternativas e conciliação de cobrança" },
  { r: "Fornecedor atrasa ou não permite continuidade", m: "Contrato com exportação, responsabilidades e plano de transição" },
];

function Counter({ label, k, value, onChange, hint }: { label: string; k: keyof GrowthOps; value: number; onChange: (k: keyof GrowthOps, v: number) => void; hint?: string }) {
  return (
    <label className="flex flex-col gap-1 rounded-2xl border border-line p-3">
      <span className="eyebrow">{label}</span>
      <input type="number" min={0} value={value} onChange={(e) => onChange(k, Math.max(0, Number(e.target.value)))} className="num w-full bg-transparent text-2xl text-offwhite outline-none" />
      {hint && <span className="ui text-[10.5px] text-faint">{hint}</span>}
    </label>
  );
}

function Goal({ label, value, target, note }: { label: string; value: number; target: number; note: string }) {
  const p = Math.min(1, target ? value / target : 0);
  return (
    <div className="rounded-2xl border border-line p-3.5">
      <div className="flex items-baseline justify-between"><span className="eyebrow">{label}</span><span className="num text-[12px] text-muted">meta {fmtInt(target)}</span></div>
      <div className="num mt-1 text-3xl text-offwhite">{fmtInt(value)}</div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-offwhite/10"><div className="h-full bg-lime transition-[width] duration-700" style={{ width: `${p * 100}%` }} /></div>
      <div className="ui mt-1 text-[10.5px] text-faint">{note}</div>
    </div>
  );
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("visao");
  const growth = useRunz((s) => s.growth);
  const setGrowth = useRunz((s) => s.setGrowth);
  const tasks = useRunz((s) => s.tasks);
  const decisions = useRunz((s) => s.decisions);
  const features = useRunz((s) => s.features);
  const setFeature = useRunz((s) => s.setFeature);
  const blockers = useRunz((s) => s.blockers);
  const addBlocker = useRunz((s) => s.addBlocker);
  const removeBlocker = useRunz((s) => s.removeBlocker);
  const resetAll = useRunz((s) => s.resetAll);
  const target = useRunz((s) => s.targetSubscribers);
  const { out, params } = useSim();
  const [newBlock, setNewBlock] = useState({ text: "", owner: "" });

  const taskStats = useMemo(() => {
    const done = ALL_TASKS.filter((t) => tasks[t.id]?.status === "concluida").length;
    const blocked = ALL_TASKS.filter((t) => tasks[t.id]?.status === "bloqueada").length;
    const w1 = WEEK1_TASKS.filter((t) => tasks[t.id]?.status === "concluida").length;
    const next = ALL_TASKS.filter((t) => tasks[t.id]?.status !== "concluida").sort((a, b) => a.due.localeCompare(b.due)).slice(0, 5);
    return { done, blocked, w1, next, total: ALL_TASKS.length };
  }, [tasks]);
  const pendingDecisions = DECISIONS.filter((d) => (decisions[d.id]?.status ?? "pendente") !== "aprovada");
  const unit = unitContribution(params);
  const pb = paybackCurve(unit, params.referenceCac, params.churn, 24).paybackCycle;
  const onCounter = (k: keyof GrowthOps, v: number) => setGrowth({ [k]: v });
  const fstatus = (f: Feature) => features[f.id] ?? f.status;
  const FEATURE_STATUS: Feature["status"][] = ["planejada", "em-desenvolvimento", "em-homologacao", "liberada", "bloqueada"];
  const FS_LABEL: Record<Feature["status"], string> = { planejada: "Planejada", "em-desenvolvimento": "Em desenvolvimento", "em-homologacao": "Em homologação", liberada: "Liberada", bloqueada: "Bloqueada" };

  return (
    <div className="flex min-h-dvh flex-col bg-deep text-offwhite md:flex-row">
      {/* sidebar desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line p-5 md:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-6 w-auto self-start" />
        <div className="eyebrow mt-2">Painel operacional</div>
        <nav className="mt-6 flex flex-col gap-1">{TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={cn("ui flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold", tab === t.id ? "bg-offwhite text-ink" : "text-offwhite/75 hover:bg-offwhite/8")}>{t.icon}{t.label}</button>)}</nav>
        <div className="mt-auto flex flex-col gap-2">
          <Link href="/" className="ui flex items-center gap-2 rounded-xl border border-line-strong px-3 py-2.5 text-[13px] font-semibold hover:border-offwhite/70"><Presentation size={16} /> Modo apresentação</Link>
          <button onClick={() => { if (confirm("Limpar todos os estados salvos neste navegador?")) resetAll(); }} className="ui flex items-center gap-2 px-3 py-2 text-[12px] text-muted hover:text-offwhite"><RotateCcw size={14} /> Limpar dados locais</button>
          <p className="ui text-[10.5px] leading-snug text-faint">Dados salvos apenas neste navegador. Não são compartilhados automaticamente entre usuários. Preparado para conexão futura com Supabase.</p>
        </div>
      </aside>

      {/* topo mobile */}
      <header className="flex items-center justify-between border-b border-line px-4 pb-3 md:hidden" style={{ paddingTop: "calc(var(--safe-top) + 12px)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-5 w-auto" />
        <span className="display text-lg">{TABS.find((t) => t.id === tab)!.label.toLowerCase()}</span>
        <Link href="/" aria-label="Modo apresentação" className="rounded-full p-2 hover:bg-offwhite/10"><Presentation size={20} /></Link>
      </header>

      <main className="scroll-thin flex-1 overflow-y-auto px-4 py-5 pb-[calc(76px+var(--safe-bottom))] md:px-8 md:py-7 md:pb-8">
        <div className="mb-5 flex flex-wrap items-center gap-2"><EvidenceTag kind="real" label="Resultados reais: vazios até a operação" /><EvidenceTag kind="simulacao" label="Projeções do simulador" /><span className="ui text-[11px] text-faint">Dados demonstrativos e editáveis, identificados por origem.</span></div>

        {tab === "visao" && (
          <div className="grid gap-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Goal label="Assinantes pagantes" value={growth.subscriptions} target={target} note="Meta operacional no 6º ciclo. Valor real editável em Growth." />
              <Goal label="Lista VIP" value={growth.vipList} target={100} note="Piloto de 100 pessoas (decisão de reunião)." />
              <Goal label="Clubes ativos" value={growth.clubsActive} target={5} note="Piloto com 5 clubes de perfis distintos." />
              <Goal label="Entregas concluídas" value={taskStats.done} target={taskStats.total} note={`${taskStats.w1} de ${WEEK1_TASKS.length} na semana 01 · ${taskStats.blocked} bloqueadas`} />
            </section>
            <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-line p-4">
                <div className="mb-3 flex items-center justify-between"><span className="eyebrow">Próximas entregas</span><button onClick={() => setTab("execucao")} className="ui text-[11px] text-muted hover:text-offwhite">ver execução</button></div>
                <ul className="ui flex flex-col gap-1.5 text-[13px]">{taskStats.next.map((t) => <li key={t.id} className="flex items-center justify-between gap-3 rounded-xl bg-offwhite/5 px-3 py-2"><span className="min-w-0 truncate"><span className="num mr-2 text-lime">{fmtDate(t.due)}</span>{t.title}</span><span className="shrink-0 text-faint">{t.owners.map((o) => PEOPLE.find((p) => p.id === o)!.name).join(", ")}</span></li>)}</ul>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <div className="mb-3 eyebrow">Pendências de decisão ({pendingDecisions.length})</div>
                <ul className="ui flex flex-col gap-1.5 text-[12.5px]">{pendingDecisions.map((d) => { const s = decisions[d.id]?.status ?? "pendente"; return <li key={d.id} className="flex items-center justify-between gap-2"><span className="min-w-0 truncate"><span className="num mr-2 text-pink">{d.n}</span>{d.title}</span><StatusPill status={s} label={DECISION_STATUS_LABEL[s]} /></li>; })}</ul>
              </div>
            </section>
            <section className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-line p-4">
                <div className="mb-3 eyebrow">Riscos principais (plano, seção 15)</div>
                <ul className="ui flex flex-col gap-2 text-[12.5px]">{RISKS.map((r) => <li key={r.r} className="rounded-xl bg-offwhite/5 px-3 py-2"><span className="font-semibold text-offwhite">{r.r}</span><span className="block text-muted">{r.m}</span></li>)}</ul>
              </div>
              <div className="rounded-2xl border border-line p-4">
                <div className="mb-3 eyebrow">Bloqueios registrados</div>
                <ul className="ui mb-3 flex flex-col gap-1.5 text-[12.5px]">
                  {blockers.length === 0 && <li className="text-faint">Nenhum bloqueio registrado.</li>}
                  {blockers.map((b) => <li key={b.id} className="flex items-start justify-between gap-2 rounded-xl border border-bad/40 px-3 py-2"><span><span className="text-offwhite">{b.text}</span><span className="block text-faint">{b.owner || "sem responsável"} · {new Date(b.createdAt).toLocaleDateString("pt-BR")}</span></span><button onClick={() => removeBlocker(b.id)} aria-label="Remover" className="rounded-full p-1 hover:bg-offwhite/10"><X size={14} /></button></li>)}
                </ul>
                <div className="flex flex-col gap-2 sm:flex-row"><Input placeholder="Descreva o bloqueio" value={newBlock.text} onChange={(e) => setNewBlock({ ...newBlock, text: e.target.value })} /><Input placeholder="Responsável" className="sm:max-w-[160px]" value={newBlock.owner} onChange={(e) => setNewBlock({ ...newBlock, owner: e.target.value })} /><Button size="sm" variant="subtle" onClick={() => { if (newBlock.text.trim()) { addBlocker(newBlock.text.trim(), newBlock.owner.trim()); setNewBlock({ text: "", owner: "" }); } }}><Plus size={14} /> Registrar</Button></div>
              </div>
            </section>
            <section className="rounded-2xl border border-line p-4"><div className="mb-3 eyebrow">Evolução semanal · semana 01</div><div className="h-[420px]"><ExecutionBoard compact /></div></section>
            <section><DecisionPanel showClosing={false} /></section>
          </div>
        )}

        {tab === "growth" && (
          <div className="grid gap-5">
            <Note>Contadores da operação real. Começam em zero e devem ser preenchidos pela equipe. Nenhum contato ou conversão é inventado.</Note>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Counter label="Running clubs prospectados" k="clubsProspected" value={growth.clubsProspected} onChange={onCounter} hint="Meta semana 01: 20 mapeados, 10 contatos" />
              <Counter label="Clubes em negociação" k="clubsNegotiating" value={growth.clubsNegotiating} onChange={onCounter} />
              <Counter label="Clubes ativos" k="clubsActive" value={growth.clubsActive} onChange={onCounter} hint="Meta do piloto: 5" />
              <Counter label="Provas em negociação" k="racesNegotiating" value={growth.racesNegotiating} onChange={onCounter} hint="Meta semana 01: 3 organizadores" />
              <Counter label="Leads · clubes" k="leadsClubs" value={growth.leadsClubs} onChange={onCounter} />
              <Counter label="Leads · provas" k="leadsRaces" value={growth.leadsRaces} onChange={onCounter} />
              <Counter label="Leads · redes" k="leadsSocial" value={growth.leadsSocial} onChange={onCounter} />
              <Counter label="Usuários na lista VIP" k="vipList" value={growth.vipList} onChange={onCounter} hint="Meta: 100 até 01/11" />
              <Counter label="Conversões de teste" k="trials" value={growth.trials} onChange={onCounter} />
              <Counter label="Assinaturas" k="subscriptions" value={growth.subscriptions} onChange={onCounter} hint="Primeira cobrança válida" />
            </section>
            <section className="rounded-2xl border border-line p-4">
              <div className="mb-3 flex items-center justify-between"><span className="eyebrow">Funil comercial real</span><EvidenceTag kind="real" /></div>
              {[["Leads (todos os canais)", growth.leadsClubs + growth.leadsRaces + growth.leadsSocial], ["Lista VIP", growth.vipList], ["Testes", growth.trials], ["Assinaturas", growth.subscriptions]].map(([l, v], i, arr) => { const max = Number(arr[0][1]) || 1; return (
                <div key={String(l)} className="mb-1.5 grid grid-cols-[180px_1fr_60px] items-center gap-2 ui text-[12.5px]"><span className="text-offwhite/85">{l}</span><div className="h-6 rounded-md bg-offwhite/6"><div className="h-full rounded-md bg-lime transition-[width] duration-500" style={{ width: `${Math.max(Number(v) > 0 ? 3 : 0, (Number(v) / max) * 100)}%` }} /></div><span className="num text-right">{fmtInt(Number(v))}</span></div>
              ); })}
            </section>
          </div>
        )}

        {tab === "produto" && (
          <div className="grid gap-5">
            <Note>Status editável por funcionalidade. Estado inicial: tudo planejado; nada em desenvolvimento até a contratação técnica.</Note>
            {FEATURE_STATUS.map((s) => { const items = FEATURES.filter((f) => fstatus(f) === s); return (
              <section key={s} className="rounded-2xl border border-line p-4">
                <div className="mb-2 flex items-center gap-3"><span className="eyebrow">{FS_LABEL[s]}</span><span className="num text-[12px] text-muted">{items.length}</span></div>
                {items.length === 0 ? <p className="ui text-[12px] text-faint">Nenhuma funcionalidade.</p> : (
                  <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">{items.map((f) => (
                    <li key={f.id} className="ui flex flex-col gap-1.5 rounded-xl bg-offwhite/5 p-3 text-[12.5px]">
                      <div className="flex items-center justify-between gap-2"><span className="font-semibold text-offwhite">{f.name}</span>{f.mvp && <span className="rounded-full bg-pink/20 px-2 py-[1px] text-[10px] text-pink">MVP</span>}</div>
                      <span className="text-[11px] text-faint">{MODULE_LABEL[f.module]} · {f.criterion}</span>
                      <Select value={fstatus(f)} onChange={(e) => setFeature(f.id, e.target.value as Feature["status"])} className="!py-1.5 text-[12px]">{FEATURE_STATUS.map((k) => <option key={k} value={k}>{FS_LABEL[k]}</option>)}</Select>
                    </li>
                  ))}</ul>
                )}
              </section>
            ); })}
          </div>
        )}

        {tab === "financeiro" && (
          <div className="grid gap-5">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[["Receita real", "—"], ["MRR real", "—"], ["Churn real", "—"], ["CAC real", "—"]].map(([l, v]) => <div key={l} className="rounded-2xl border border-dashed border-line-strong p-3.5"><div className="flex items-center justify-between"><span className="eyebrow">{l}</span><EvidenceTag kind="real" label="Real" /></div><div className="num mt-1 text-3xl text-faint">{v}</div><div className="ui text-[10.5px] text-faint">Sem dados: operação ainda não iniciada.</div></div>)}
            </section>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-line p-3.5"><div className="eyebrow">MRR projetado M12</div><div className="num mt-1 text-3xl text-lime">{fmtBRL(out.summary.mrrEnd)}</div><div className="ui text-[10.5px] text-faint">simulador · {fmtInt(out.summary.payersEnd)} pagantes</div></div>
              <div className="rounded-2xl border border-line p-3.5"><div className="eyebrow">Contribuição / payback</div><div className="num mt-1 text-3xl text-offwhite">{fmtBRL2(unit)}</div><div className="ui text-[10.5px] text-faint">payback {pb ? `${pb}º ciclo` : "não ocorre"} · churn {fmtPct1(params.churn)}</div></div>
              <div className="rounded-2xl border border-line p-3.5"><div className="eyebrow">Ponto de equilíbrio</div><div className="num mt-1 text-3xl text-offwhite">{fmtInt(breakEvenPayers(params.fixedCostQ1, unit, params.churn))}</div><div className="ui text-[10.5px] text-faint">pagantes · estrutura {fmtBRL(params.fixedCostQ1)} + R$ 5 mil clubes</div></div>
              <div className="rounded-2xl border border-line p-3.5"><div className="eyebrow">Necessidade de caixa</div><div className="num mt-1 text-3xl text-pink">{fmtBRL(out.summary.cashNeedWithReserve)}</div><div className="ui text-[10.5px] text-faint">déficit máx. {fmtBRL(out.summary.maxDeficit)} + 20% · {fmtPct(out.summary.acqShare.clubs)} via clubes</div></div>
            </section>
            <section className="h-[760px] rounded-2xl border border-line p-4"><FinancialSimulator compact /></section>
          </div>
        )}

        {tab === "execucao" && <section className="h-[calc(100dvh-170px)] min-h-[560px]"><Gantt30 yanView /></section>}
      </main>

      {/* tab bar mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-deep/90 backdrop-blur-md md:hidden" style={{ paddingBottom: "var(--safe-bottom)" }} aria-label="Seções do painel">
        {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={cn("ui flex flex-col items-center gap-1 py-2 text-[10px] font-semibold", tab === t.id ? "text-lime" : "text-offwhite/60")}>{t.icon}{t.label}</button>)}
      </nav>
    </div>
  );
}
