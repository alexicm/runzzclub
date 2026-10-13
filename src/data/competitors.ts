import type { Evidence } from "./provenance";

export type Confidence = "alta" | "media" | "baixa";

export interface Competitor {
  id: string;
  name: string;
  type: string;
  relation: string;
  monthly?: string;
  annual?: string;
  strengths: string[];
  learnings: string[];
  facts: { text: string; source: string; date: string; confidence: Confidence; evidence: Evidence }[];
  /** Posição na matriz: x = profundidade de treinamento (0-1), y = força de distribuição/comunidade (0-1) */
  x: number; y: number;
}

export const COMPETITORS: Competitor[] = [
  { id: "zyla", name: "Zyla", type: "App de treinamento digital", relation: "Benchmark competitivo de crescimento e distribuição",
    monthly: "R$ 39,90", annual: "R$ 229,90 (R$ 19,16/mês calculados)",
    strengths: ["Distribuição por benefício corporativo (Wellhub)", "Parcerias com eventos e marcas", "GPS próprio e direção para clubes"],
    learnings: ["Clubes não são espaço sem concorrência", "Feedback genérico e leitura de intervalados são críticas recorrentes", "Base declarada não é base pagante"],
    facts: [
      { text: "155.457 pessoas no contador do site", source: "zyla.fit via relatório Manus", date: "11/10/2026", confidence: "media", evidence: "concorrente" },
      { text: "Mais de 90% da base vinha do Wellhub em junho de 2026", source: "Relatório Manus, seção 6", date: "06/2026", confidence: "media", evidence: "concorrente" },
      { text: "83 avaliações escritas na App Store BR: 79,5% com 4 ou 5 estrelas", source: "App Store BR", date: "nov/2025 a out/2026", confidence: "alta", evidence: "concorrente" },
      { text: "Projeções próximas de R$ 10 milhões (fontes divergem entre faturamento e ARR)", source: "Relatório Manus", date: "11/10/2026", confidence: "baixa", evidence: "concorrente" },
    ], x: 0.72, y: 0.85 },
  { id: "runy", name: "RUNY", type: "App de treinamento de corrida", relation: "Concorrente direta. Não é desenvolvedora, parceira nem fornecedora da RUNZ.",
    strengths: ["Produto já em operação"], learnings: ["Documentos anteriores atribuíam o desenvolvimento da RUNZ à Runy; isso foi corrigido nesta apresentação"],
    facts: [
      { text: "Site público abre área de acesso; funcionalidades não verificadas", source: "runyapp.com", date: "11/10/2026", confidence: "baixa", evidence: "concorrente" },
    ], x: 0.55, y: 0.35 },
  { id: "runna", name: "Runna", type: "Treinamento estruturado integrado ao Strava", relation: "Benchmark de produto e preço",
    monthly: "R$ 39,90", annual: "R$ 229,90 (R$ 19,16/mês calculados)",
    strengths: ["Planos estruturados", "Marca integrada ao ecossistema Strava"], learnings: ["Não disputar somente preço", "Demonstrar valor da comunidade e da jornada"],
    facts: [
      { text: "Preço mensal R$ 39,90 e anual R$ 229,90", source: "runna.com/pt-br", date: "11/10/2026", confidence: "alta", evidence: "concorrente" },
    ], x: 0.9, y: 0.55 },
  { id: "assessorias", name: "Assessorias humanas", type: "Acompanhamento individual", relation: "Alternativa de maior ticket",
    strengths: ["Atenção individual", "Confiança no treinador"], learnings: ["Básico com escopo claro", "Evolução para atendimento humano sem desvalorizar o básico"],
    facts: [{ text: "Panorama qualitativo; sem dados de preço consolidados", source: "Relatório Manus, seção 10", date: "11/10/2026", confidence: "baixa", evidence: "hipotese" }], x: 0.85, y: 0.2 },
  { id: "gratuitas", name: "Ferramentas gratuitas", type: "Apps e planilhas", relation: "Barreira de entrada baixa",
    strengths: ["Custo zero"], learnings: ["Entregar organização e adaptação que justifiquem a assinatura"],
    facts: [{ text: "Hipótese de posicionamento", source: "Plano RUNZ, seção 2.2", date: "11/10/2026", confidence: "media", evidence: "hipotese" }], x: 0.25, y: 0.3 },
  { id: "runz", name: "RUNZ (posição pretendida)", type: "Treinamento por assinatura + clubes", relation: "Nossa aposta",
    monthly: "R$ 39,90 (R$ 89,90 com R$ 50 de desconto)", annual: "R$ 478,80 propostos",
    strengths: ["Operação dos clubes", "Experiência local", "Conversão mensurável por canal"], learnings: ["Diferenciação ainda a provar"],
    facts: [{ text: "Posição pretendida, não comprovada", source: "Plano RUNZ, seção 3", date: "11/10/2026", confidence: "media", evidence: "proposta" }], x: 0.6, y: 0.7 },
];

export const MARKET_CONTEXT = [
  { text: "5.241 corridas oficiais em 2025, crescimento de 85% sobre 2024", source: "ABRACEO, 27/02/2026", note: "Evidência de atividade no canal de eventos, não do mercado de assinaturas.", evidence: "concorrente" as Evidence },
  { text: "Cerca de 15 milhões de corredores no Brasil", source: "Pesquisa citada no relatório Manus", note: "Contexto atribuído; não multiplicar pelo ticket.", evidence: "concorrente" as Evidence },
  { text: "Cerca de 397 mil seguidores na audiência RUNZ", source: "Captura enviada por Alex", note: "Ativo informado, não número de clientes nem base de contatos autorizados.", evidence: "documento" as Evidence },
];
