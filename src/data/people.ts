export type PersonId = "alex" | "anthony" | "yan" | "treinador" | "social" | "tech" | "gabriel";

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  status: "idealizador" | "lideranca" | "em-avaliacao" | "a-contratar" | "nao-definido";
  initials: string;
  responsibilities: string[];
  deliverables: string[];
  dependencies: string[];
  pendingDecisions: string[];
}

export const PEOPLE: Person[] = [
  {
    id: "alex", name: "Alex", role: "Estratégia, growth e produto", status: "lideranca", initials: "AL",
    responsibilities: ["Estratégia", "Growth", "Produto", "Parcerias", "Gestão de projetos", "Indicadores", "Coordenação executiva"],
    deliverables: ["Plano executivo e apresentação", "Landing page VIP com tracking", "Mapa de running clubs", "Dashboard operacional"],
    dependencies: ["Aprovações de Yan", "Definição do responsável técnico", "Checkout definido por Anthony"],
    pendingDecisions: ["Escopo do RUNZ Training", "Responsável pelo desenvolvimento"],
  },
  {
    id: "anthony", name: "Anthony", role: "Operação comercial e financeiro", status: "lideranca", initials: "AN",
    responsibilities: ["Operação comercial", "Checkout", "Precificação", "Modelo financeiro", "Gestão de conversão e receita", "Coordenação operacional"],
    deliverables: ["Checkout escolhido e fluxo de cobrança", "Tabela de preços e condições", "Instagram e TikTok preparados", "Conciliação financeira"],
    dependencies: ["Regras do MVP aprovadas", "Fornecedor de pagamento"],
    pendingDecisions: ["Precificação e condições do MVP", "Duração do desconto"],
  },
  {
    id: "yan", name: "Yan", role: "Idealizador do projeto · aprovações e investimento", status: "idealizador", initials: "YA",
    responsibilities: ["Aprovações executivas", "Decisões de investimento", "Apoio a contratações estratégicas", "Desbloqueio de recursos", "Acompanhamento de metas"],
    deliverables: ["Aprovação do escopo e do orçamento", "Lista de profissionais técnicos (com Alex)", "Acompanhamento semanal de metas"],
    dependencies: ["Documento de decisões desta apresentação"],
    pendingDecisions: ["Orçamento inicial e limites financeiros", "Contratação do profissional técnico"],
  },
  {
    id: "treinador", name: "Treinador responsável", role: "Metodologia e supervisão técnica", status: "a-contratar", initials: "TR",
    responsibilities: ["Metodologia", "Prescrição e validação técnica", "Protocolos de treinamento", "Supervisão da qualidade", "Conteúdo técnico"],
    deliverables: ["Metodologia aprovada e versionada", "Casos de teste do motor de treinamento", "Validação do piloto"],
    dependencies: ["Contratação aprovada por Yan", "Escopo do produto"],
    pendingDecisions: ["Aprovar a contratação do profissional técnico"],
  },
  {
    id: "social", name: "Social media", role: "Conteúdo e redes (Gabriel Brito em avaliação)", status: "em-avaliacao", initials: "GB",
    responsibilities: ["Produção de conteúdo", "Roteiros", "Instagram", "TikTok", "Calendário editorial", "Cobertura dos parceiros"],
    deliverables: ["Calendário semanal publicado", "5 vídeos curtos por semana", "Bastidores de clubes e provas"],
    dependencies: ["Alinhamento com Alex (14/10)", "Perfis preparados por Anthony"],
    pendingDecisions: ["Formalização do responsável por conteúdo"],
  },
  {
    id: "tech", name: "Liderança técnica ou fornecedor", role: "Aplicativo e infraestrutura (não definido)", status: "nao-definido", initials: "TI",
    responsibilities: ["Arquitetura", "Aplicativo", "Integrações", "Infraestrutura", "Segurança", "Manutenção"],
    deliverables: ["Escopo e orçamento do MVP", "Implementação e homologação", "Checkout integrado e testado"],
    dependencies: ["Decisão sobre responsável pelo desenvolvimento (15/10)", "Escopo aprovado"],
    pendingDecisions: ["Definir o responsável pelo desenvolvimento"],
  },
];

export const PERSON_BY_ID = Object.fromEntries(PEOPLE.map((p) => [p.id, p])) as Record<PersonId, Person>;

export function ownerNames(ids: PersonId[]): string {
  return ids.map((id) => PERSON_BY_ID[id]?.name ?? id).join(", ");
}
