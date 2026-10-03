# Changelog — Projeto Tarkas

## 2026-10-03 — V0.4.11, operação e navegação
- Adicionadas anotações pessoais em quests e lembretes com data/hora.
- Melhoria na remoção de marcadores pessoais e no painel de operações.
- Catálogo, mapa, mercado e dados de raid preservam cache local e tratamento de erros.

## 2026-10-03 — V0.4.6, busca rápida
- Atalho Ctrl+K abre uma busca rápida para navegar entre as áreas do Tarkas.

## 2026-10-03 — V0.4.5, backup de perfil
- A Central de Operações pode exportar e restaurar um backup do progresso local para uso em outro computador.

## 2026-10-03 — V0.4.4, filtro de itens sem mercado
- Itens marcados como `noFlea`, como Bitcoin físico, foram removidos do Mercado; esses itens não têm cotação de pulgas e não devem usar preço-base como referência.

## 2026-10-03 — V0.4.3, preços de mercado
- O Mercado agora mostra apenas média de preço das últimas 24 horas; preço-base do jogo não é mais apresentado como cotação.
- A tela informa quando os dados foram atualizados e permite atualizar a base de preços manualmente.

## 2026-10-03 — V0.4.2, Mercado
- Novo módulo Mercado com busca em itens do cache local, preços de referência e favoritos.

## 2026-10-03 — V0.4.1, Hideout e pontos pessoais
- Novo painel Hideout com 26 estações, 68 níveis, materiais e tempo do próximo upgrade; o nível de cada estação é salvo localmente.
- Pontos pessoais podem ser posicionados diretamente na planta do mapa e permanecem visíveis nas próximas aberturas.
- Central de Operações reúne builds, compras, stash, raids, metas, favoritos e Kappa tracker.

## 2026-09-28 — Boss Radar
- Raid Mode agora lista cada boss do mapa com chance de spawn, áreas, grupo e janela de entrada quando esses campos existem no cache do tarkov.dev.
- Marcadores de boss passam a usar o nome do mob estruturado em vez do rótulo genérico.

## 2026-09-28 — Raid Mode, checklist de raid
- O plano reúne chaves e itens de objetivo das quests ativas/disponíveis, deduplicados e com a quest de origem.
- Minas e snipers continuam sem marcadores: o cache atual não fornece coordenadas estruturadas verificáveis.

## 2026-09-26 — V0.2.4, identificação do produto
- Janela e documento passam a usar o nome curto `Tarkas`.
- O pacote Windows declara autoria `MGOES`, removendo o aviso de metadado ausente durante a compilação.
- A barra lateral inclui a assinatura discreta “Desenvolvido por MGOES”.

## 2026-09-26 — V0.2.3, ficha tática no mapa
- Clicar em um marcador do mapa abre uma ficha no próprio painel com categoria, nome e contexto disponível para extração, spawn, boss, objetivo e switch.
- O painel usa somente os nomes, chances e descrições presentes no conjunto local estruturado; nenhum ponto ou detalhe adicional foi inferido.

## 2026-09-26 — marcadores táticos legíveis
- Mapa Interativo passou a usar símbolos distintos: quadrado para extrações, triângulo para spawns, silhueta para bosses, cruz para objetivos e losango para switches.
- A legenda usa os mesmos símbolos dos marcadores e o destaque amarelo de uma quest continua prevalecendo.

## 2026-09-26 — migração do desenvolvimento
- Repositório Git oficial 0.2.1 migrado do notebook para o PC `MgoesPC`.
- PC passa a ser a fonte oficial para todas as sessões Codex.
- Notebook `MGOES-NOTE` passa a ser somente laboratório/testes auxiliares.
- Histórico Git preservado via bundle; HEAD `cd2b563`.
- Nick Core reaplicado no projeto do PC.
- Pasta antiga do PC preservada em backup antes da migração.

## Regra atual
- Nenhum desenvolvimento via Codex deve ocorrer no notebook.
- O aplicativo final deve funcionar no PC mesmo com o notebook desligado.
