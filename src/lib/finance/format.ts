const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const brl2 = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const int = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });
const pct1 = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

export const fmtBRL = (v: number) => (Number.isFinite(v) ? brl.format(v) : "—");
export const fmtBRL2 = (v: number) => (Number.isFinite(v) ? brl2.format(v) : "—");
export const fmtInt = (v: number) => (Number.isFinite(v) ? int.format(Math.round(v)) : "—");
export const fmtPct = (v: number) => (Number.isFinite(v) ? pct.format(v) : "—");
export const fmtPct1 = (v: number) => (Number.isFinite(v) ? pct1.format(v) : "—");
export const fmtK = (v: number) => {
  if (!Number.isFinite(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1_000_000) return `${(v / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi`;
  if (a >= 1_000) return `${(v / 1_000).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} mil`;
  return int.format(v);
};
export const fmtBRLk = (v: number) => {
  if (!Number.isFinite(v)) return "—";
  const sign = v < 0 ? "−" : "";
  return `${sign}R$ ${fmtK(Math.abs(v))}`;
};
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};
export const fmtDateLong = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
};
