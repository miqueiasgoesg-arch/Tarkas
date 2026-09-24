# Projeto Tarkas — Estado atual

Atualizado: 24/09/2026

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Antes de retomar em outra máquina/sessão, conferir este estado + Git. Notebook é preferencial; PC principal é fallback automático e vice-versa. Não executar o mesmo desenvolvimento simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Versão: 0.1.1.
- UI principal: Visão Geral, Quests, Mapa Interativo.
- Player level persistente.
- Quest Engine: 515 quests, nível/pré-requisitos/progresso Ativar-Concluir.
- Quests agora possuem “Como fazer” usando dados reais do tarkov.dev.
- Auditoria: 1.441 objetivos e 1.441 traduções PT; 608 zonas; 319 possible-location positions; 15.179 referências de itens; catálogo com 5.442 itens.
- Guia de quest mostra objetivo, quantidade, found-in-raid, opcional, mapas e nomes dos itens quando disponíveis.
- Quest → Mapa implementado.
- Map Engine local com SVG, layers, zoom/pan, extrações, spawns, bosses e objetivos.
- Labs validado: 3 níveis, 6 extrações, 1 trânsito, 15 switches posicionados; switches ainda não são camada visual na UI.
- Battle Pass/documents: não inventar; integrar somente com fonte confiável/estruturada.

## Build atual
- Arquivo: dist/Tarkas-0.1.1-Windows.exe
- Tamanho: 355043500 bytes
- Gerado: 24/09/2026 20:00:41
- SHA-256: 02C4D97AEDC6959DC5512D961AE5CAEA5C15B8AD1A7EE634759F91E917F54A67
- Build portátil gerado com npm.cmd run dist; electron-builder concluiu com exit code 0.
- QA visual no renderer real do EXE: Visão Geral (6 cards), Como fazer (8/8 imagens de itens carregadas), e Customs (SVG, 5 andares, legenda e 429 marcadores).
- No mesmo EXE, “Ver local no mapa” destacou o objetivo certo; “Abrir mapa” destacou a quest. Capturas de QA ficaram temporariamente no notebook.
- Build copiada ao Drive e sincronizada no PC principal; o hash confere nos dois.
- Teste automatizado adicional confirmou foco de quest bloqueada com dados reais de Shoreline.
- Testes de sintaxe e os 15 scripts de dev/tests passaram.

## Últimos commits importantes
- f113af0 qa v0.1.1 modules and distribute release
- 710e2a2 fix quest and objective map focus
- dec1c0e v0.1.1-map-quest-focus
- cc10e6f v0.1.1-portable-smoke-verified
- c0f764a v0.1.1-quest-howto
- daa614b v0.1.1-quest-guide-data

## Distribuição da candidata V0.1.1
- Cópia versionada no Drive: G:\Meu Drive\Tarkas Releases\V0.1.1\Tarkas-0.1.1-Windows.exe.
- O PC principal sincronizou o mesmo arquivo nesse caminho; tamanho e SHA-256 conferem com a build do notebook.
- Clone de fallback no PC: E:\DESENVOLVIMENTO\Projeto-Tarkas, branch master, commit f113af0, árvore limpa.
- O clone tem dependências instaladas; `npm.cmd run check` passou. `npm audit --omit=dev` encontrou 0 vulnerabilidades; npm 11 reporta 14 vulnerabilidades nas ferramentas de desenvolvimento, sem upgrades nesta V0.1.1.
- Um bundle Git completo foi guardado em G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-24.bundle para atualizar o fallback. O notebook segue como único local de desenvolvimento.

## Próximos passos
1. Notebook permanece como cópia principal; não desenvolver em paralelo no PC. Quando o notebook não responder, o clone E:\DESENVOLVIMENTO\Projeto-Tarkas está pronto como fallback.
2. Refinamentos V0.2: switches Labs visíveis, ícone próprio e documentação Battle Pass quando houver fonte confiável.
3. O usuário pode abrir a candidata sincronizada e enviar feedback manual quando quiser.

## Correção Quest → Mapa (24/09/2026)
- Causa: o commit dec1c0e guardava os IDs da quest/objetivo, mas o Map Engine não os consumia.
- Foco agora inclui quests selecionadas independentemente do status; o objetivo selecionado ganha destaque visual no mapa e a quest aparece na faixa “Quest em foco”.
- Foco de quest/objetivo validado no EXE recém-compilado dist/Tarkas-0.1.1-Windows.exe, incluindo cliques reais nos dois botões da tela de Quests.
