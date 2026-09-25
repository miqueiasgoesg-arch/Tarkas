# Projeto Tarkas — Estado atual

Atualizado: 25/09/2026

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Antes de retomar em outra máquina/sessão, conferir este estado + Git. Notebook é preferencial; PC principal é fallback automático e vice-versa. Não executar o mesmo desenvolvimento simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Versão candidata: 0.1.3.
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
- Arquivo: dist/Tarkas-0.1.3-Windows.exe
- Tamanho: 355052879 bytes
- Gerado: 25/09/2026 09:09:07 (relógio do notebook)
- SHA-256: D89A317228227A64B11A3EE735BBB2C2720F9E8E6A0BA10FDCBDF398759DE231
- Build portátil gerado com npm.cmd run dist; electron-builder concluiu com exit code 0.
- O recurso de ícone foi extraído do EXE e conferido visualmente (32×32); corresponde ao PNG Tarkas.
- EXE recém-compilado aberto no notebook com depuração remota: renderer mostrou o app, Mapa Interativo abriu The Lab, controle Switches ligado e 15 marcadores presentes; captura visual conferida.
- `npm.cmd run check` e os 15 scripts de `dev/tests` passaram antes da build.
- Labs, três níveis e switches já haviam sido exercitados no EXE V0.1.2. Quest → Mapa foi validado no EXE V0.1.1: “Ver local no mapa” destacou o objetivo e “Abrir mapa” destacou a quest.
- O ícone do app vem de `assets/tarkas-icon.png`, a partir da fonte vetorial `assets/tarkas-icon.svg`.

## Últimos commits importantes
- e4d035c feat(app): add custom Tarkas icon
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

## Candidata V0.1.2 e fallback (25/09/2026)
- EXE versionado no Drive: G:\Meu Drive\Tarkas Releases\V0.1.2\Tarkas-0.1.2-Windows.exe; PC sincronizou o mesmo tamanho e SHA-256.
- Bundle Git completo no Drive: G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-25-final.bundle, atualizado até este checkpoint.
- O clone do PC está divergente e foi preservado sem alterações. Na última verificação (25/09), seu HEAD era `ed6d8d0` com commits locais adicionais; a árvore estava limpa e os arquivos `assets/tarkas-icon.svg` e `.png` pertenciam àquela cópia. O EXE V0.1.2 sincronizado no PC manteve o SHA-256 da build do notebook. Não mesclar nem sobrescrever o clone sem revisar esses commits.

## Próximos passos
1. Notebook permanece como cópia principal; não desenvolver em paralelo no PC. Se precisar alternar, preservar e revisar as alterações locais já presentes no clone do PC antes de integrá-las.
2. Refinamentos V0.2: documentação Battle Pass somente quando houver fonte confiável.
3. A candidata V0.1.3 está versionada no Drive para feedback manual.

## Camada de switches de Labs (25/09/2026)
- Adicionado o controle `Switches`, ligado por padrão, com marcadores roxos e legenda própria.
- A camada usa apenas as 15 posições já presentes em `mapDetail`; o teste de dados exige projeção e inclusão no mapa para todas elas.
- Validado no EXE portátil V0.1.2 aberto no notebook: 15 visíveis, 0 ao desmarcar, 15 ao marcar novamente; os três andares permaneceram selecionáveis.
- O primeiro teste real encontrou `ReferenceError` porque os listeners usavam `filterState` e `refreshMarks` fora do escopo. O estado foi movido ao escopo da tela do mapa, a versão 0.1.2 foi reconstruída e a nova build passou a validação.

## Ícone próprio e candidata V0.1.3 (25/09/2026)
- Reaproveitado o rascunho já presente no clone divergente do PC: moldura verde escura, traço dourado e letra T. O clone do PC permaneceu sem alterações.
- SVG principal em `assets/tarkas-icon.svg`; PNG correspondente em `assets/tarkas-icon.png`, configurado como ícone do executável Windows.
- `package.json` avançou para 0.1.3. O EXE foi compilado, teve o ícone extraído do recurso do Windows e foi aberto no notebook para validar a tela real.
- Release versionado no Drive: G:\Meu Drive\Tarkas Releases\V0.1.3\Tarkas-0.1.3-Windows.exe.
- Bundle Git completo: G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-25-v0.1.3.bundle.

## Correção Quest → Mapa (24/09/2026)
- Causa: o commit dec1c0e guardava os IDs da quest/objetivo, mas o Map Engine não os consumia.
- Foco agora inclui quests selecionadas independentemente do status; o objetivo selecionado ganha destaque visual no mapa e a quest aparece na faixa “Quest em foco”.
- Foco de quest/objetivo validado no EXE recém-compilado dist/Tarkas-0.1.1-Windows.exe, incluindo cliques reais nos dois botões da tela de Quests.
