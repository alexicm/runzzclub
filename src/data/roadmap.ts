export interface Phase {
  id: string;
  n: string;
  title: string;
  window: string;
  start: string; // ISO
  end: string; // ISO (or planned)
  conditional?: string;
  deliverables: string[];
  owners: string[];
  metrics: string[];
  dependencies: string[];
}

export const PHASES: Phase[] = [
  { id: "p1", n: "01", title: "Estruturação", window: "13 a 18 de outubro", start: "2026-10-13", end: "2026-10-18",
    deliverables: ["Produto e escopo", "Responsáveis", "Tecnologia", "Preço e regras", "Primeiros parceiros"],
    owners: ["Alex", "Anthony", "Yan"], metrics: ["Decisões 1 a 8 registradas", "11 entregas da semana"], dependencies: [] },
  { id: "p2", n: "02", title: "Preparação comercial e técnica", window: "19 de outubro a 1 de novembro", start: "2026-10-19", end: "2026-11-01",
    deliverables: ["Metodologia", "Landing page", "Conteúdo", "Checkout", "Contratações", "Captação inicial"],
    owners: ["Anthony", "Treinador (a contratar)", "Social", "Técnico"], metrics: ["100 VIPs com origem", "5 clubes confirmados", "Checkout contratado"], dependencies: ["p1"] },
  { id: "p3", n: "03", title: "Desenvolvimento e homologação", window: "2 a 22 de novembro", start: "2026-11-02", end: "2026-11-22",
    deliverables: ["Implementação do MVP", "Testes", "Integrações autorizadas", "Segurança", "Validação do treinamento", "Monitoramento"],
    owners: ["Liderança técnica", "Treinador", "Anthony"], metrics: ["Zero falhas críticas abertas", "99,5% de sessões sem falha (meta)", "Carga 5x o piloto"], dependencies: ["p2"] },
  { id: "p4", n: "04", title: "Piloto controlado", window: "A partir de 23 de novembro", start: "2026-11-23", end: "2026-12-07", conditional: "Condicionado à homologação da fase 03. Janela de 30 a 45 dias citada em reunião ainda depende de confirmação técnica.",
    deliverables: ["100 usuários VIP", "Ativação", "Primeiros treinos", "Feedback", "Correções"],
    owners: ["Alex", "Anthony", "Treinador"], metrics: ["Ativação ≥ 80%", "Primeiro uso ≥ 60% em 7 dias", "Suporte por usuário"], dependencies: ["p3"] },
  { id: "p5", n: "05", title: "Validação comercial", window: "Dezembro de 2026", start: "2026-12-01", end: "2026-12-31",
    deliverables: ["Primeiras cobranças", "Conversão", "Cancelamentos", "Suporte", "Análise de qualidade"],
    owners: ["Anthony", "Alex"], metrics: ["Conversão paga ≥ 30%", "CAC completo ≤ R$ 80 por canal", "Contribuição ≥ R$ 25/pagante"], dependencies: ["p4"] },
  { id: "p6", n: "06", title: "Expansão condicionada", window: "Janeiro a março de 2027", start: "2027-01-01", end: "2027-03-31", conditional: "Liberada por indicadores e caixa, não por calendário.",
    deliverables: ["Campanhas", "Novos clubes", "Provas", "Otimização", "Retenção", "Avaliação da capacidade de escalar"],
    owners: ["Alex", "Anthony", "Yan"], metrics: ["Terceiro ciclo ≥ 80%", "200 a 300 pagantes observados em coortes", "Payback ≤ 4 ciclos"], dependencies: ["p5"] },
];

export interface CriticalNode { id: string; label: string; owner: string; }
export interface CriticalPath { id: string; title: string; nodes: CriticalNode[]; }

export const CRITICAL_PATHS: CriticalPath[] = [
  { id: "cp1", title: "Caminho da metodologia", nodes: [
    { id: "a1", label: "Responsável técnico", owner: "Yan e Alex" },
    { id: "a2", label: "Metodologia aprovada", owner: "Treinador" },
    { id: "a3", label: "Motor de treinamento", owner: "Técnico" },
    { id: "a4", label: "Homologação", owner: "Técnico e Treinador" },
    { id: "a5", label: "Piloto", owner: "Alex e Anthony" },
  ] },
  { id: "cp2", title: "Caminho do desenvolvimento", nodes: [
    { id: "b1", label: "Desenvolvedor", owner: "Alex" },
    { id: "b2", label: "Escopo", owner: "Alex e Técnico" },
    { id: "b3", label: "Implementação", owner: "Técnico" },
    { id: "b4", label: "Checkout e testes", owner: "Anthony e Técnico" },
    { id: "b5", label: "Liberação", owner: "Yan" },
  ] },
];
