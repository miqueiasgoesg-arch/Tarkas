# Projeto Tarkas — Estado atual

Atualizado: 25/09/2026

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Antes de retomar em outra máquina/sessão, conferir este estado + Git. Notebook é preferencial; PC principal é fallback automático e vice-versa. Não executar o mesmo desenvolvimento simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Versão: 0.1.2.
- UI principal: Visão Geral, Quests, Mapa Interativo.
- Player level persistente.
- Quest Engine: 515 quests, nível/pré-requisitos/progresso Ativar-Concluir.
- Quests agora possuem “Como fazer” usando dados reais do tarkov.dev.
- Auditoria: 1.441 objetivos e 1.441 traduções PT; 608 zonas; 319 possible-location positions; 15.179 referências de itens; catálogo com 5.442 itens.
- Guia de quest mostra objetivo, quantidade, found-in-raid, opcional, mapas e nomes dos itens quando disponíveis.
- Quest → Mapa implementado.
- Map Engine local com SVG, layers, zoom/pan, extrações, spawns, bosses, objetivos e switches.
- Labs validado: 3 níveis, 6 extrações, 1 trânsito e 15 switches do cache tarkov.dev, todos projetados dentro dos limites do mapa. A camada Switches abre ligada, tem marcadores roxos e pode ser ocultada/mostrada.
- Battle Pass/documents: não inventar; integrar somente com fonte confiável/estruturada.

## Build atual
- Arquivo: dist/Tarkas-0.1.2-Windows.exe
- Tamanho: 355044005 bytes
- Gerado: 24/09/2026 21:12:28 (relógio do notebook)
- SHA-256: 1C429CE43D818FFF6F6E82EAAD8318D69C39475E550FCE8D5BB5E8AEF433A5EF
- Build portátil gerado com npm.cmd run dist; electron-builder concluiu com exit code 0.
- QA no renderer do EXE recém-compilado: mapa Labs mostrou 15/15 switches e legenda; o controle escondeu 15 e restaurou 15; os 3 botões de nível mantiveram os pontos; Customs exibiu somente o switch presente nos dados.
- Captura real do mapa Labs foi salva temporariamente no notebook. O listener de camadas foi exercitado no EXE; um erro de escopo encontrado no primeiro teste foi corrigido e a build recriada antes da validação final.
- Quest → Mapa previamente validado no EXE V0.1.1: “Ver local no mapa” destacou o objetivo e “Abrir mapa” destacou a quest.
- Teste automatizado cobre os 15 switches projetados dentro dos limites do mapa; `npm.cmd run check` e os 15 scripts de `dev/tests` passaram.

## Últimos commits importantes
- c7d2826 feat(labs): add visible switch markers
- f113af0 qa v0.1.1 modules and distribute release
- 710e2a2 fix quest and objective map focus
- dec1c0e v0.1.1-map-quest-focus
- cc10e6f v0.1.1-portable-smoke-verified
- c0f764a v0.1.1-quest-howto
- daa614b v0.1.1-quest-guide-data

## Distribuição da candidata V0.1.1
- Cópia versionada no Drive: G:\Meu Drive\Tarkas Releases\V0.1.1\Tarkas-0.1.1-Windows.exe.
- O PC principal sincronizou o mesmo arquivo nesse caminho; tamanho e SHA-256 conferem com a build do notebook.
- Clone de fallback no PC: E:\DESENVOLVIMENTO\Projeto-Tarkas, branch master, árvore limpa, atualizado a partir do bundle Git completo no Drive.
- O clone tem dependências instaladas; `npm.cmd run check` passou. `npm audit --omit=dev` encontrou 0 vulnerabilidades; npm 11 reporta 14 vulnerabilidades nas ferramentas de desenvolvimento, sem upgrades nesta V0.1.1.
- Um bundle Git completo foi guardado em G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-24.bundle para atualizar o fallback. O notebook segue como único local de desenvolvimento.

## Próximos passos
1. Notebook permanece como cópia principal; não desenvolver em paralelo no PC. Quando o notebook não responder, o clone E:\DESENVOLVIMENTO\Projeto-Tarkas está pronto como fallback.
2. Refinamentos V0.2: ícone próprio e documentação Battle Pass somente quando houver fonte confiável.
3. A candidata V0.1.2 fica versionada no Drive para feedback manual.

## Camada de switches de Labs (25/09/2026)
- Adicionado o controle `Switches`, ligado por padrão, com marcadores roxos e legenda própria.
- A camada usa apenas as 15 posições já presentes em `mapDetail`; o teste de dados exige projeção e inclusão no mapa para todas elas.
- Validado no EXE portátil V0.1.2 aberto no notebook: 15 visíveis, 0 ao desmarcar, 15 ao marcar novamente; os três andares permaneceram selecionáveis.
- O primeiro teste real encontrou `ReferenceError` porque os listeners usavam `filterState` e `refreshMarks` fora do escopo. O estado foi movido ao escopo da tela do mapa, a versão 0.1.2 foi reconstruída e a nova build passou a validação.

## Correção Quest → Mapa (24/09/2026)
- Causa: o commit dec1c0e guardava os IDs da quest/objetivo, mas o Map Engine não os consumia.
- Foco agora inclui quests selecionadas independentemente do status; o objetivo selecionado ganha destaque visual no mapa e a quest aparece na faixa “Quest em foco”.
- Foco de quest/objetivo validado no EXE recém-compilado dist/Tarkas-0.1.1-Windows.exe, incluindo cliques reais nos dois botões da tela de Quests.
