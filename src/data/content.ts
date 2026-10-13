export type Pillar = "comunidade" | "educacao" | "cultura" | "produto";
export const PILLARS: { id: Pillar; label: string; share: number; color: string }[] = [
  { id: "comunidade", label: "Comunidade e lifestyle", share: 0.35, color: "var(--runz-pink)" },
  { id: "educacao", label: "Educação", share: 0.30, color: "var(--runz-lime)" },
  { id: "cultura", label: "Entretenimento e cultura runner", share: 0.20, color: "var(--runz-offwhite)" },
  { id: "produto", label: "Produto e conversão", share: 0.15, color: "rgba(239,232,218,0.45)" },
];

export interface ContentItem {
  id: string;
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = segunda
  pillar: Pillar;
  format: string;
  channel: "Instagram" | "TikTok" | "Instagram + TikTok" | "Stories";
  theme: string;
  script: string;
  objective: string;
  owner: string;
  cta: string;
  status: "proposta" | "roteiro" | "produzido" | "agendado";
}

export const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/** Semana modelo (exemplos de peças; nenhuma publicada). */
export const CONTENT_WEEK: ContentItem[] = [
  { id: "c1", day: 0, pillar: "comunidade", format: "Reel bastidores", channel: "Instagram + TikTok", theme: "Segunda no clube: quem são as pessoas que correm com a gente", script: "Abertura com o encontro chegando. Três corredores falam por que aparecem toda semana. Fecha com o horário do próximo encontro.", objective: "Identificação e presença nos clubes", owner: "Social media", cta: "Salve o próximo encontro", status: "proposta" },
  { id: "c2", day: 1, pillar: "educacao", format: "Reel educativo", channel: "Instagram + TikTok", theme: "Por que seu primeiro plano de 5 km não deve começar correndo todo dia", script: "Treinador explica a lógica de progressão em 30 segundos, com um exemplo de semana. Deixa claro o limite: não substitui avaliação individual.", objective: "Confiança técnica", owner: "Treinador + Social", cta: "Entre na lista VIP", status: "proposta" },
  { id: "c3", day: 2, pillar: "cultura", format: "TikTok comportamento", channel: "TikTok", theme: "POV: você disse que ia correr às 6h", script: "Humor leve sobre rotina de corrida, sem banalizar segurança. Fecha com a frase da marca: a cidade pede ritmo.", objective: "Alcance e cultura runner", owner: "Social media", cta: "Marque quem corre com você", status: "proposta" },
  { id: "c4", day: 3, pillar: "educacao", format: "Carrossel", channel: "Instagram", theme: "O que o app mede e o que ele não consegue medir sem relógio", script: "Explica registro informado pelo corredor, limites de interpretação e por que o feedback não inventa dados.", objective: "Transparência do produto", owner: "Social + Técnico", cta: "Dúvidas nos comentários", status: "proposta" },
  { id: "c5", day: 4, pillar: "produto", format: "Demonstração do app", channel: "Instagram + TikTok", theme: "Do cadastro ao primeiro treino em 40 segundos", script: "Tela a tela: cadastro, avaliação, objetivo, plano. Identificado como protótipo até a homologação.", objective: "Conversão para a lista VIP", owner: "Alex + Social", cta: "Garanta sua vaga VIP: R$ 39,90", status: "proposta" },
  { id: "c6", day: 5, pillar: "comunidade", format: "Cobertura de prova", channel: "Stories", theme: "Preparação para a prova do fim de semana com o clube parceiro", script: "Stories ao vivo do aquecimento, largada e chegada. Depoimentos autorizados.", objective: "Prova social e parceria", owner: "Social media", cta: "Link do clube na bio", status: "proposta" },
  { id: "c7", day: 6, pillar: "cultura", format: "História de evolução", channel: "Instagram", theme: "Quatro semanas de constância: o que mudou", script: "Depoimento autorizado de um participante do piloto, com dados que ele mesmo registrou. Somente após o piloto.", objective: "Retenção e desejo", owner: "Social media", cta: "Comece seu teste de 14 dias", status: "proposta" },
];
