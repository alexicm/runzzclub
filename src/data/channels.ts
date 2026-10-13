export type ChannelId = "clubs" | "races" | "social";

export interface FunnelStage { id: string; label: string; }
export const FUNNEL_STAGES: FunnelStage[] = [
  { id: "interesse", label: "Interesse" },
  { id: "cadastro", label: "Cadastro" },
  { id: "vip", label: "Lista VIP" },
  { id: "teste", label: "Teste gratuito" },
  { id: "cobranca", label: "Primeira cobrança" },
  { id: "ativa", label: "Assinatura ativa" },
  { id: "renovacao", label: "Renovação" },
];

export interface Channel {
  id: ChannelId;
  name: string;
  short: string;
  owners: string[];
  steps: string[];
  goals: string[];
  costs: string;
  bottlenecks: string[];
  /** Hipóteses iniciais do funil por canal (plano, seção 11.2, cenário de referência) */
  defaults: { leads: number; toSignup: number; toTrial: number; toPaid: number; };
  costPerPayer: number; // hipótese de custo variável por pagante (plano 10.2)
}

export const CHANNELS: Channel[] = [
  { id: "clubs", name: "Running Clubs", short: "Clubes", owners: ["Alex"],
    steps: ["Clube ativado", "Encontro com check-in", "Participante único elegível", "Teste iniciado pelo link do clube", "Primeira cobrança", "Comissão única paga"],
    goals: ["5 clubes no piloto", "60% dos clubes com 2 encontros em 30 dias", "30% dos elegíveis iniciam teste"],
    costs: "Ativação R$ 100 por clube, operação R$ 22 por clube ativo/mês, comissão R$ 39,90 por conversão, R$ 1,20 por teste.",
    bottlenecks: ["Organizadores não usam a ferramenta de forma recorrente", "Conflito com clubes que vendem assessoria"],
    defaults: { leads: 400, toSignup: 0.6, toTrial: 0.5, toPaid: 0.35 }, costPerPayer: 39.9 },
  { id: "races", name: "Provas de corrida", short: "Provas", owners: ["Alex", "Anthony"],
    steps: ["Parceria de preparação", "QR com origem exclusiva", "Interessado", "Teste", "Primeira cobrança", "Permanência depois da prova"],
    goals: ["3 organizadores prospectados", "Primeira parceria com prova de dezembro ou janeiro"],
    costs: "R$ 55 por pagante além do custo do teste (hipótese).",
    bottlenecks: ["Sazonalidade das provas", "Queda de motivação depois da prova"],
    defaults: { leads: 300, toSignup: 0.4, toTrial: 0.5, toPaid: 0.35 }, costPerPayer: 55 },
  { id: "social", name: "Instagram e TikTok", short: "Redes", owners: ["Anthony", "Social media"],
    steps: ["Alcance qualificado", "Cadastro na lista VIP", "Teste", "Primeira cobrança", "Renovação"],
    goals: ["100 VIPs até 01/11", "5 vídeos curtos por semana", "Testes de redes: 100 no M1 a 1.400 no M12 (referência)"],
    costs: "R$ 45 por pagante além do custo do teste (hipótese).",
    bottlenecks: ["Audiência de 397 mil não converte automaticamente", "Produção depende de contratação de conteúdo"],
    defaults: { leads: 2000, toSignup: 0.15, toTrial: 0.35, toPaid: 0.35 }, costPerPayer: 45 },
];
