/**
 * Governança de dados (seção 9 do briefing).
 * Toda informação exibida recebe uma classificação de origem.
 */
export type Evidence =
  | "decisao" // decisão tomada em reunião (09/10/2026) ou pelo responsável
  | "documento" // informação documentada no plano (RUNZ_Plano_Completo_Alex.pdf, 11/10/2026)
  | "proposta" // proposta aguardando aprovação
  | "hipotese" // hipótese financeira ou operacional
  | "simulacao" // resultado de cálculo com premissas explícitas
  | "concorrente" // dado de concorrente (fonte, data e confiabilidade)
  | "real"; // resultado real futuro (ainda não disponível)

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  decisao: "Decisão de reunião",
  documento: "Documentado",
  proposta: "Proposta a aprovar",
  hipotese: "Hipótese",
  simulacao: "Simulação",
  concorrente: "Dado de concorrente",
  real: "Resultado real",
};

export const EVIDENCE_HINT: Record<Evidence, string> = {
  decisao: "Alinhado na reunião de 09/10/2026 ou definido por Alex.",
  documento: "Consta no plano completo de 11/10/2026.",
  proposta: "Recomendação deste plano; ainda não aprovada.",
  hipotese: "Valor de planejamento, não custo contratado.",
  simulacao: "Conta feita com premissas explícitas; não é resultado.",
  concorrente: "Fonte pública, não auditada; ver data e confiabilidade.",
  real: "Será preenchido com dados da operação; vazio até lá.",
};

export const SOURCES = {
  plano: "RUNZ_Plano_Completo_Alex.pdf, v1.0, 11/10/2026",
  reuniao: "Anotações da reunião de 09/10/2026 (Gemini)",
  brandbook: "RUNZCLUB - BRANDBOOK V1.pdf",
  manus: "Relatório “Zyla: análise completa do negócio”, Manus, 11/10/2026",
  zylaSite: "zyla.fit, seção Assinaturas, consulta em 11/10/2026",
  runnaSite: "runna.com/pt-br, consulta em 11/10/2026",
  abraceo: "ABRACEO, 4º Summit ABRACEO/CBAt, 27/02/2026",
  appstore: "App Store BR, 83 avaliações escritas, nov/2025 a out/2026",
} as const;
