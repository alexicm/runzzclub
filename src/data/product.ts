export interface Feature {
  id: string;
  name: string;
  module: "training" | "clubs" | "billing" | "ops";
  status: "planejada" | "em-desenvolvimento" | "em-homologacao" | "liberada" | "bloqueada";
  mvp: boolean;
  criterion: string;
}

/** Status inicial: tudo planejado. Nenhum item em desenvolvimento até a contratação técnica. */
export const FEATURES: Feature[] = [
  { id: "f1", name: "Cadastro, permissões e triagem", module: "training", status: "planejada", mvp: true, criterion: "Jornada documentada, separação de dados e encaminhamento fora de escopo." },
  { id: "f2", name: "Avaliação inicial", module: "training", status: "planejada", mvp: true, criterion: "Perguntas definidas pelo treinador responsável." },
  { id: "f3", name: "Plano e calendário", module: "training", status: "planejada", mvp: true, criterion: "Plano utilizável, versionado e aprovado pelo responsável técnico." },
  { id: "f4", name: "Registro de treino sem relógio", module: "training", status: "planejada", mvp: true, criterion: "Tempo, distância quando disponível e contexto; sem inventar métricas." },
  { id: "f5", name: "Feedback de treino", module: "training", status: "planejada", mvp: true, criterion: "Explicação coerente com dados e limitações." },
  { id: "f6", name: "Adaptação auditável", module: "training", status: "planejada", mvp: true, criterion: "Regras explícitas, registro das mudanças e revisão humana." },
  { id: "f7", name: "Assinatura: teste, cobrança, cancelamento", module: "billing", status: "planejada", mvp: true, criterion: "Teste, cobrança, restauração de acesso, cancelamento e conciliação." },
  { id: "f8", name: "Clubes: eventos, inscrições, check-in", module: "clubs", status: "planejada", mvp: true, criterion: "Participantes únicos, origem e comissão." },
  { id: "f9", name: "Links de indicação e atribuição", module: "clubs", status: "planejada", mvp: true, criterion: "Um clube por novo assinante, confirmado pelo usuário." },
  { id: "f10", name: "Monitoramento e trilha de auditoria", module: "ops", status: "planejada", mvp: true, criterion: "Falhas, suporte, permissões e auditoria." },
  { id: "f11", name: "Eventos de produto e receita", module: "ops", status: "planejada", mvp: true, criterion: "Mesma conta, sem duplicidade." },
  { id: "f12", name: "Integração GPS (Strava, Garmin)", module: "training", status: "bloqueada", mvp: false, criterion: "Depende de autorização e matriz de direitos; risco documentado de corte de API." },
  { id: "f13", name: "Rede social, ranking, marketplace", module: "training", status: "planejada", mvp: false, criterion: "Fora do primeiro escopo." },
];

export const MODULE_LABEL = { training: "RUNZ Training", clubs: "RUNZ Clubs", billing: "Assinatura", ops: "Operação" } as const;

export interface JourneyStep {
  id: string;
  n: number;
  title: string;
  hint: string;
}
export const JOURNEY: JourneyStep[] = [
  { id: "cadastro", n: 1, title: "Cadastro do corredor", hint: "Origem registrada por canal e termos compreensíveis." },
  { id: "avaliacao", n: 2, title: "Avaliação inicial", hint: "Triagem definida pelo treinador; situações fora de escopo são encaminhadas." },
  { id: "objetivo", n: 3, title: "Definição de objetivo", hint: "5 km ou 10 km no MVP. A escolha muda a prévia do plano." },
  { id: "plano", n: 4, title: "Apresentação do plano", hint: "Plano versionado e aprovado pelo responsável técnico." },
  { id: "calendario", n: 5, title: "Calendário", hint: "Semana com treinos e descansos visíveis." },
  { id: "registro", n: 6, title: "Registro de um treino", hint: "Tempo, distância quando houver e como foi o esforço." },
  { id: "feedback", n: 7, title: "Feedback de treino", hint: "Explica o que os dados permitem concluir e o que não permitem." },
  { id: "proximo", n: 8, title: "Próximo treinamento", hint: "Próxima sessão e data da cobrança visíveis." },
];
