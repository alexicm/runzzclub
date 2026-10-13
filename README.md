# RUNZ Executive Experience

Apresentação executiva interativa e painel operacional da RUNZ. Construída com Next.js 16 (App Router), TypeScript estrito, Tailwind CSS 4 com tokens próprios, GSAP, Recharts e Zustand. Testes com Vitest (motor financeiro) e Playwright (navegação e interações).

## Como executar

```bash
npm install --legacy-peer-deps
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run test       # testes do motor financeiro (Vitest)
npm run e2e        # testes de navegação e interações (Playwright; usa build + porta 3100)
npm run lint
```

Deploy na Vercel: importe o repositório; não há variáveis de ambiente obrigatórias. O comando de build é `next build`.

## Dois modos

| Rota | Modo | Conteúdo |
|---|---|---|
| `/` | Apresentação executiva | 16 capítulos em composição 16:9, transições GSAP, teclado (← → Home End F M), menu de capítulos, tela cheia, swipe no celular, barra inferior estilo app iOS. A posição é mantida na URL (`#c07`). |
| `/painel` | Painel operacional (senha) | Visão geral, Growth, Produto, Financeiro e Execução. Estados editáveis com persistência local (apenas no navegador). |

## Estrutura

```
src/app                      rotas (page.tsx = apresentação, painel/page.tsx = painel)
src/styles/tokens.css        design tokens da marca (cores, tipografia, movimento)
src/data                     TODO o conteúdo editável, separado dos componentes
  provenance.ts              classificação de origem (decisão, documento, proposta, hipótese, simulação, concorrente, real)
  tasks.ts                   entregas da semana 01 e do plano de 30 dias
  roadmap.ts                 fases do MVP e caminhos críticos
  decisions.ts               8 decisões executivas
  people.ts                  responsáveis, funções e status de contratação
  competitors.ts             matriz competitiva com fonte, data e confiabilidade
  channels.ts                canais de aquisição e hipóteses do funil
  content.ts                 pilares editoriais e semana modelo de conteúdo
  product.ts                 funcionalidades do MVP e passos da jornada
  finance-defaults.ts        parâmetros do simulador, cenários (Anexo A do plano) e tabela de referência
src/lib/finance              motor financeiro em funções puras (unit, simulate, reverse, clubs, format)
src/lib/store.ts             estado compartilhado (Zustand + localStorage, chave runz-executive-v1)
src/lib/useSim.ts            simulação compartilhada por todos os capítulos
src/lib/animations           registro do GSAP, linguagem de movimento e hook de revelação
src/components/presentation  Deck (navegação e transições), SlideFrame, lista de capítulos
src/components/chapters      Ch01Hero … Ch16Decisoes
src/components/simulator     FinancialSimulator, RunClubSimulator, AcquisitionFunnel, ReverseGoalPlanner
src/components/charts        SubscriberGrowthChart, MrrChart, CostComposition, PaybackCurve, CashFlowChart, SensitivityGrid
src/components/roadmap       InteractiveRoadmap (fases + caminho crítico com atraso simulado), Gantt30
src/components/product-demo  MVPJourney (protótipo navegável do app)
src/components/operations    ExecutionBoard, TaskDrawer, TeamResponsibilityMap, DecisionPanel, Dashboard
src/components/ui            Button, Slider, Segmented, Stat, Drawer, EvidenceTag, StatusPill, Note, LogoMotion
tests/finance.test.ts        reproduz os números do plano (R$ 27,42; payback no 4º ciclo; M1 = 77; −R$ 286 mil em 12 meses)
e2e/presentation.spec.ts     navegação, tarefas, meta, simulador, protótipo, decisões, painel, overflow
```

## Como atualizar dados

- **Entregas e prazos:** `src/data/tasks.ts`. Cada tarefa tem responsáveis, critério de conclusão, dependências, semana e fase. O status real é editado na interface e salvo no navegador.
- **Decisões:** `src/data/decisions.ts`. Os estados (pendente, em discussão, aprovada, bloqueada) só mudam por ação explícita do usuário.
- **Hipóteses financeiras:** `src/data/finance-defaults.ts` (`DEFAULT_PARAMS`, `SCENARIO_PARAMS`, `SCENARIO_INPUTS`). Toda mudança passa pelos testes em `tests/finance.test.ts`.
- **Concorrentes:** `src/data/competitors.ts`. Cada dado leva fonte, data e nível de confiabilidade; sem fonte confirmada, marcar como hipótese.
- **Resultados reais:** contadores da aba Growth do painel. Começam em zero e nunca são preenchidos com valores fictícios.

## Governança e proveniência

Cada bloco usa a etiqueta `EvidenceTag` para declarar a origem: decisão de reunião (09/10/2026), documento (plano de 11/10/2026), proposta a aprovar, hipótese, simulação, dado de concorrente ou resultado real (vazio até a operação). O simulador reproduz o cenário de referência do plano (5.827 pagantes e R$ 232.486 de MRR no M12; −R$ 286 mil acumulados; M11 positivo) e recalcula qualquer cenário novo com suas próprias premissas.

A RUNY é tratada como concorrente. Não é desenvolvedora, parceira nem fornecedora da RUNZ; referências anteriores que atribuíam o desenvolvimento à Runy foram corrigidas.

## Regras do motor financeiro

- Base paga do mês = base retida do mês anterior + novos pagantes; base retida = base anterior × (1 − churn).
- Novos pagantes por canal = testes encerrados × conversão.
- MRR = pagantes ativos × mensalidade. MRR, receita acumulada e ARR nunca se misturam.
- Contribuição unitária = mensalidade − tributos − pagamentos − reserva de perdas − custo variável.
- CAC variável = (comissões + ativação + testes + aquisição por canal) ÷ novos pagantes. CAC completo soma 25% da estrutura fixa como leitura gerencial, sem dupla subtração no resultado.
- Payback por coorte: contribuição acumulada com retenção menos CAC.
- Comissão de clube contada uma única vez por aquisição elegível.

## Inventário da identidade visual (ID VISUAL RUNZ)

Fonte: `RUNZCLUB - BRANDBOOK V1.pdf`, `PALETA RUNZ.pdf`, pasta `logos`, `ICON`, `MILES` e documentos de posicionamento.

| Item | Identificado | Aplicação |
|---|---|---|
| Cores | `#ff025a` (pink), `#b8f705` (lime), `#efe8da` (offwhite), `#1d1d1d`, `#000000`, `#0f0f0f` | `src/styles/tokens.css` |
| Tipografia primária | Be Vietnam Pro, títulos sempre em itálico e minúsculas | `next/font/google` (OFL) |
| Tipografia secundária | Gambetta (texto corrido, legendas) | Fontshare, ITF Free Font License |
| Logotipos | `runz` e `runz club` em branco, preto, offwhite, cinza, verde, vermelho e colorido (PNG) | `public/brand/` |
| Motion do logo | O PNG oficial foi separado em duas camadas (estrelas e wordmark) sem alterar proporções; a animação move as camadas, não redesenha a marca | `LogoMotion.tsx` |
| Fotografia | Foto oficial dos três corredores (aplicações do brand book), com tratamento duotone pink | hero |
| Mascote | `MILES.ai` convertido para SVG (disponível em `public/brand/MILES.svg`, não usado como decoração) | reserva |
| Usos incorretos | Não distorcer, girar, contornar, recortar, sombrear ou aplicar sobre fundo de baixo contraste | respeitado |

**Lacunas registradas:** o brand book não define espaçamentos, grid, raios, curvas de animação nem estilos de gráfico. Esses valores estão marcados como "neutro" nos tokens e são decisões desta apresentação, não regras oficiais. Não há logotipo em vetor no acervo (apenas PNG e páginas rasterizadas do PDF).

## Materiais usados e ausentes

- Usados: `RUNZ_Plano_Completo_Alex.pdf` (11/10/2026), anotações da reunião de 09/10/2026, `crescimento.png` e `avaliacoes.png` (Zyla), acervo ID VISUAL RUNZ.
- Ausentes no projeto: planilhas financeiras originais, relatório completo da Manus sobre a Zyla e documentação de preço além do plano. Onde faltou fonte, a apresentação indica hipótese.

## Persistência e futuro

Os estados (tarefas, decisões, parâmetros do simulador, contadores, funcionalidades, bloqueios) ficam em `localStorage` e não são compartilhados entre usuários; a interface avisa isso. O store em `src/lib/store.ts` concentra todas as escritas, o que permite trocar a persistência por Supabase sem alterar os componentes.
