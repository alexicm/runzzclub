"use client";
import { useEffect, useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "runz-painel-auth";
const PASS = "258510";

/** Bloqueio simples do painel. Proteção de conveniência no navegador, não substitui autenticação de servidor. */
export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => { try { setOk(sessionStorage.getItem(KEY) === "1"); } catch { setOk(false); } });
    return () => cancelAnimationFrame(id);
  }, []);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASS) { try { sessionStorage.setItem(KEY, "1"); } catch {} setOk(true); } else { setErr(true); setValue(""); }
  };
  if (ok === null) return <div className="min-h-dvh bg-deep" />;
  if (ok) return <>{children}</>;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-deep px-6 text-offwhite">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[28px] border border-line bg-ink/60 p-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/runz-offwhite.png" alt="RUNZ" className="h-6 w-auto" />
        <div className="eyebrow mt-4 flex items-center gap-2"><Lock size={12} /> Painel operacional</div>
        <h1 className="display mt-1 text-3xl">acesso restrito.</h1>
        <p className="body mt-2 text-sm text-muted">Área de acompanhamento da RUNZ. Informe a senha para continuar.</p>
        <input type="password" inputMode="numeric" autoFocus value={value} onChange={(e) => { setValue(e.target.value); setErr(false); }} placeholder="Senha" aria-label="Senha" className="ui mt-5 w-full rounded-xl border border-line-strong bg-deep/60 px-4 py-3 text-lg tracking-[0.3em] text-offwhite outline-none focus:border-lime/70" />
        {err && <p className="ui mt-2 text-[12px] text-bad">Senha incorreta.</p>}
        <Button type="submit" className="mt-4 w-full" size="lg">Entrar</Button>
      </form>
    </div>
  );
}
