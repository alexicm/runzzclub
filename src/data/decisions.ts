export type DecisionStatus = "pendente" | "em-discussao" | "aprovada" | "bloqueada";

export interface Decision {
  id: string;
  n: string;
  title: string;
  summary: string;
  recommendation: string;
  unlocks: string[];
}

export const DECISIONS: Decision[] = [
  { id: "d1", n: "01", title: "Aprovar o escopo do RUNZ Training", summary: "Cadastro, avaliação, plano, calendário, registro, feedback, evolução, assinatura e supervisão profissional.", recommendation: "Aprovar o escopo essencial sem rede social, marketplace ou GPS próprio sofisticado.", unlocks: ["Prototipação (semana 2)", "Contratação técnica"] },
  { id: "d2", n: "02", title: "Aprovar a estratégia do RUNZ Clubs simplificado", summary: "Ferramenta gratuita (agenda, inscrições, check-in, painel, link de indicação) com comissão única de R$ 39,90.", recommendation: "Aprovar o piloto com 5 clubes e as regras de atribuição e estorno.", unlocks: ["Ativação comercial dos clubes", "Mapeamento de 20 clubes"] },
  { id: "d3", n: "03", title: "Definir o responsável pelo desenvolvimento", summary: "Fornecedor, equipe interna ou liderança técnica. Escopo, orçamento, prazo e plano de transição.", recommendation: "Decidir até 15/10 com contrato que preveja exportação de dados.", unlocks: ["Escopo e implementação", "Janela de 30 a 45 dias"] },
  { id: "d4", n: "04", title: "Aprovar a contratação do profissional técnico", summary: "Treinador habilitado que assina a metodologia e supervisiona a prescrição.", recommendation: "Aprovar contratação após a lista de 3 nomes (16/10).", unlocks: ["Metodologia", "Validação do piloto"] },
  { id: "d5", n: "05", title: "Validar precificação e condições do MVP", summary: "R$ 89,90 com R$ 50 de desconto fixo (R$ 39,90), 14 dias de teste, duração do desconto, cobrança e cancelamento.", recommendation: "Aprovar R$ 39,90 por 12 ciclos de lançamento e publicar condições claras.", unlocks: ["Checkout", "Landing page VIP", "Comunicação da oferta"] },
  { id: "d6", n: "06", title: "Aprovar orçamento inicial e limites financeiros", summary: "Estrutura fixa de referência de R$ 35 mil/mês no primeiro trimestre e desembolso inicial a cotar (hipótese R$ 120 mil).", recommendation: "Aprovar limites por marco, não um valor total antecipado.", unlocks: ["Contratações", "Campanhas"] },
  { id: "d7", n: "07", title: "Aprovar as metas e indicadores de acompanhamento", summary: "1.500 assinantes no sexto ciclo (meta operacional), indicadores do piloto e critérios de avanço.", recommendation: "Aprovar metas do piloto e revisar a meta de 1.500 após o terceiro ciclo.", unlocks: ["Painel operacional", "Critérios de expansão"] },
  { id: "d8", n: "08", title: "Confirmar responsáveis e datas da primeira sprint", summary: "As 11 entregas de 13 a 18/10 com responsáveis e prazos propostos.", recommendation: "Confirmar nesta reunião e revisar em 16/10 na primeira demonstração.", unlocks: ["Execução da semana 01"] },
];
