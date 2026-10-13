import type { PersonId } from "./people";

export type TaskStatus = "pendente" | "em-andamento" | "bloqueada" | "concluida";

export interface Task {
  id: string;
  title: string;
  description: string;
  owners: PersonId[];
  due: string; // ISO date
  doneCriteria: string;
  dependencies: string[]; // task ids
  week: 1 | 2 | 3 | 4;
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  critical?: boolean;
}

/** Semana 01: 13 a 18 de outubro de 2026. Prazos propostos, a aprovar. */
export const WEEK1_TASKS: Task[] = [
  { id: "t01", title: "Aprovar oferta e regras do MVP", description: "Confirmar oferta única: R$ 89,90 com R$ 50 de desconto fixo (R$ 39,90), 14 dias de teste, cobrança após o teste e regras de cancelamento.", owners: ["alex", "anthony", "yan"], due: "2026-10-14", doneCriteria: "Documento de oferta aprovado por Yan com Alex e Anthony, com duração do desconto definida.", dependencies: [], week: 1, phase: 1, critical: true },
  { id: "t02", title: "Alinhar produção de conteúdo com Gabriel", description: "Conversa sobre linhas editoriais, cadência de cinco vídeos por semana e condições de trabalho.", owners: ["alex"], due: "2026-10-14", doneCriteria: "Cadência, formatos e responsabilidades registrados por escrito.", dependencies: [], week: 1, phase: 1 },
  { id: "t03", title: "Confirmar responsável pelo desenvolvimento", description: "Definir quem constrói o MVP: fornecedor, equipe interna ou liderança técnica. Escopo, orçamento e prazo contratual.", owners: ["alex"], due: "2026-10-15", doneCriteria: "Nome, escopo, orçamento e data de início confirmados.", dependencies: ["t01"], week: 1, phase: 1, critical: true },
  { id: "t04", title: "Escolher checkout e desenhar cobrança", description: "Comparar web e lojas (Apple e Google) por conversão, taxa efetiva, conformidade e suporte. Desenhar fluxo teste → cobrança → renovação → cancelamento.", owners: ["anthony"], due: "2026-10-15", doneCriteria: "Fornecedor escolhido e fluxo de cobrança desenhado com eventos de conciliação.", dependencies: ["t01"], week: 1, phase: 1, critical: true },
  { id: "t05", title: "Preparar Instagram e TikTok", description: "Criar perfil no TikTok, revisar bio e destaques do Instagram, preparar templates da identidade visual.", owners: ["anthony", "social"], due: "2026-10-15", doneCriteria: "Perfis ativos com identidade aplicada e primeiro conteúdo agendado.", dependencies: ["t02"], week: 1, phase: 1 },
  { id: "t06", title: "Levantar 3 profissionais técnicos", description: "Lista de treinadores habilitados com disponibilidade, condições e capacidade de assinar a metodologia.", owners: ["yan", "alex"], due: "2026-10-16", doneCriteria: "Três nomes com disponibilidade e proposta de condições.", dependencies: [], week: 1, phase: 1, critical: true },
  { id: "t07", title: "Publicar landing page VIP com tracking", description: "Página de captação da lista VIP de 100 pessoas, com origem registrada por canal (UTM e código de clube).", owners: ["alex", "tech"], due: "2026-10-16", doneCriteria: "Página no ar, eventos de cadastro medidos e origem por canal funcionando.", dependencies: ["t01"], week: 1, phase: 1 },
  { id: "t08", title: "Mapear 20 running clubs e iniciar 10 contatos", description: "Priorizar clubes sociais sem assessoria própria. Registrar organizador, cidade, tamanho estimado e status do contato.", owners: ["alex"], due: "2026-10-16", doneCriteria: "Planilha com 20 clubes e 10 primeiros contatos registrados.", dependencies: [], week: 1, phase: 1 },
  { id: "t09", title: "Prospectar 3 organizadores de provas", description: "Identificar provas de novembro a março e propor parceria de preparação com QR de origem exclusiva.", owners: ["alex", "anthony"], due: "2026-10-16", doneCriteria: "Três organizadores contatados com proposta enviada.", dependencies: [], week: 1, phase: 1 },
  { id: "t10", title: "Criar dashboard operacional", description: "Painel de acompanhamento de tarefas, metas, funil e indicadores do MVP (esta aplicação, modo Painel).", owners: ["alex"], due: "2026-10-16", doneCriteria: "Painel acessível por Yan, Alex e Anthony com tarefas, responsáveis e status.", dependencies: [], week: 1, phase: 1 },
  { id: "t11", title: "Realizar primeira demonstração de entregas", description: "Reunião curta de revisão: o que foi entregue, o que travou e as decisões necessárias para a semana 2.", owners: ["alex", "anthony"], due: "2026-10-16", doneCriteria: "Reunião realizada com registro de decisões e próximos responsáveis.", dependencies: ["t01", "t03", "t04"], week: 1, phase: 1 },
];

/** Semanas 02 a 04: plano operacional de 30 dias (propostas). */
export const WEEK2_4_TASKS: Task[] = [
  { id: "t12", title: "Implementar calendário de conteúdo", description: "Primeiras duas semanas de conteúdo produzidas e agendadas.", owners: ["social"], due: "2026-10-23", doneCriteria: "10 vídeos curtos produzidos e 5 publicados.", dependencies: ["t05"], week: 2, phase: 2 },
  { id: "t13", title: "Contratação técnica", description: "Formalizar contrato com fornecedor ou liderança técnica, incluindo exportação de dados e plano de transição.", owners: ["alex", "yan"], due: "2026-10-23", doneCriteria: "Contrato assinado com escopo, prazo e critérios de homologação.", dependencies: ["t03"], week: 2, phase: 2, critical: true },
  { id: "t14", title: "Consolidar parceiros piloto", description: "Fechar ao menos 5 clubes para o piloto com perfis distintos.", owners: ["alex"], due: "2026-10-25", doneCriteria: "5 clubes confirmados com organizador e data de encontro.", dependencies: ["t08"], week: 2, phase: 2 },
  { id: "t15", title: "Prototipação das telas do MVP", description: "Fluxo cadastro → avaliação → plano → calendário → registro → feedback validado com o treinador.", owners: ["alex", "tech"], due: "2026-10-25", doneCriteria: "Protótipo navegável aprovado por Alex e pelo treinador.", dependencies: ["t13"], week: 2, phase: 2 },
  { id: "t16", title: "Definição de metodologia", description: "Treinador responsável define protocolos, limites de escopo e critérios de encaminhamento.", owners: ["treinador"], due: "2026-10-25", doneCriteria: "Documento de metodologia versionado e aprovado.", dependencies: ["t06"], week: 2, phase: 2, critical: true },
  { id: "t17", title: "Desenvolvimento do MVP", description: "Implementação das funcionalidades essenciais: cadastro, avaliação, plano, calendário, registro, feedback, assinatura.", owners: ["tech"], due: "2026-11-01", doneCriteria: "Build interno com os fluxos essenciais executáveis.", dependencies: ["t15", "t16"], week: 3, phase: 2, critical: true },
  { id: "t18", title: "Validação das interfaces", description: "Revisão de usabilidade e aderência à identidade visual.", owners: ["alex", "social"], due: "2026-11-01", doneCriteria: "Lista de ajustes priorizada e aplicada.", dependencies: ["t17"], week: 3, phase: 2 },
  { id: "t19", title: "Ativação comercial dos clubes piloto", description: "Treinar organizadores, cadastrar clubes e gerar links de indicação.", owners: ["alex", "anthony"], due: "2026-11-01", doneCriteria: "5 clubes com agenda publicada e link ativo.", dependencies: ["t14"], week: 3, phase: 2 },
  { id: "t20", title: "Captura de leads e lista VIP", description: "Atingir os 100 VIPs com origem por canal registrada.", owners: ["anthony", "social"], due: "2026-11-01", doneCriteria: "100 cadastros VIP com origem identificada.", dependencies: ["t07", "t12"], week: 3, phase: 2 },
  { id: "t21", title: "Instrumentação dos eventos de produto", description: "Eventos de cadastro, ativação, primeiro treino, cobrança e cancelamento ligados à mesma conta.", owners: ["tech", "anthony"], due: "2026-11-01", doneCriteria: "Eventos conferidos em ambiente de teste sem duplicidade.", dependencies: ["t17"], week: 3, phase: 3 },
  { id: "t22", title: "Testes de integração e cobrança", description: "Checkout, teste gratuito, cobrança, restauração e cancelamento testados ponta a ponta.", owners: ["tech", "anthony"], due: "2026-11-08", doneCriteria: "Zero falhas críticas abertas nos fluxos de cobrança.", dependencies: ["t04", "t21"], week: 4, phase: 3, critical: true },
  { id: "t23", title: "Revisão de métricas e backlog", description: "Revisar indicadores do piloto, metas e backlog priorizado.", owners: ["alex", "anthony", "yan"], due: "2026-11-08", doneCriteria: "Backlog priorizado e metas do piloto confirmadas.", dependencies: ["t22"], week: 4, phase: 3 },
  { id: "t24", title: "Demonstração das funcionalidades", description: "Demo interna das funcionalidades disponíveis para Yan, Alex, Anthony e o treinador.", owners: ["tech", "alex"], due: "2026-11-08", doneCriteria: "Demo realizada e lista de correções registrada.", dependencies: ["t17"], week: 4, phase: 3 },
  { id: "t25", title: "Preparação do piloto", description: "Selecionar 100 VIPs (40 audiência, 40 clubes, 20 provas), definir suporte e critérios de elegibilidade.", owners: ["alex", "anthony"], due: "2026-11-08", doneCriteria: "Lista de 100 participantes elegíveis e protocolo de suporte.", dependencies: ["t20", "t22"], week: 4, phase: 3, critical: true },
];

export const ALL_TASKS: Task[] = [...WEEK1_TASKS, ...WEEK2_4_TASKS];
export const TASK_BY_ID = Object.fromEntries(ALL_TASKS.map((t) => [t.id, t])) as Record<string, Task>;

export const WEEKS = [
  { n: 1 as const, label: "Semana 01", range: "13 a 18/10", theme: "Decisões, escopo, responsáveis, landing page, canais sociais e primeiras prospecções." },
  { n: 2 as const, label: "Semana 02", range: "19 a 25/10", theme: "Conteúdo, contratação técnica, parceiros piloto, prototipação e metodologia." },
  { n: 3 as const, label: "Semana 03", range: "26/10 a 01/11", theme: "Desenvolvimento, validação das interfaces, ativação dos clubes, leads e instrumentação." },
  { n: 4 as const, label: "Semana 04", range: "02 a 08/11", theme: "Testes de integração, revisão de métricas, demonstração, backlog e preparação do piloto." },
];
