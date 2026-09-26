# Projeto Tarkas — Estado atual

Atualizado: 26/09/2026

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Antes de retomar em outra máquina/sessão, conferir este estado + Git. Notebook é preferencial; PC principal é fallback automático e vice-versa. Não executar o mesmo desenvolvimento simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Versão candidata: 0.2.1.
- UI principal: Visão Geral, Quests, Mapa Interativo.
- Player level persistente.
- Quest Engine: 515 quests, nível/pré-requisitos/progresso Ativar-Concluir.
- Quests agora possuem “Como fazer” usando dados reais do tarkov.dev.
- Auditoria: 1.441 objetivos e 1.441 traduções PT; 608 zonas; 319 possible-location positions; 15.179 referências de itens; catálogo com 5.442 itens.
- Guia de quest mostra objetivo, quantidade, found-in-raid, opcional, mapas e nomes dos itens quando disponíveis.
- Quest → Mapa implementado.
- Map Engine local com SVG, layers, zoom/pan, extrações, spawns, bosses, objetivos e switches.
- Labs validado: 3 níveis, 6 extrações, 1 trânsito e 15 switches do cache tarkov.dev, todos projetados dentro dos limites do mapa. A camada Switches abre ligada, tem marcadores roxos e pode ser ocultada/mostrada.
- Battle Pass: rastreador local dos 8 itens de documentação publicados no cache do tarkov.dev; sem calcular progresso por tier.

## Build atual
- Portátil: dist/Tarkas-Portable-0.2.1-Windows.exe
- Instalador: dist/Tarkas-Setup-0.2.1-Windows.exe
- Tamanhos: portátil 355058480 bytes; instalador 100169843 bytes.
- Gerado: 26/09/2026 no notebook.
- SHA-256: portátil D806FF3B703874C87EA10622EBF0166034FBF46C0E128F21BC951763F86935EA; instalador 0E13D20787DC8054B6610316330403920902AABBF141FA2BDB04984FAD294300.
- Build portátil + instalador gerados com `npm.cmd run dist`; electron-builder concluiu com exit code 0.
- O recurso de ícone foi extraído do EXE e conferido visualmente (32×32); corresponde ao PNG Tarkas.
- EXE recém-compilado aberto no notebook com depuração remota: renderer mostrou o app, Mapa Interativo abriu The Lab, controle Switches ligado e 15 marcadores presentes; captura visual conferida.
- `npm.cmd run check` e os 16 scripts de `dev/tests` passaram antes da build.
- Labs, três níveis e switches já haviam sido exercitados no EXE V0.1.2. Quest → Mapa foi validado no EXE V0.1.1: “Ver local no mapa” destacou o objetivo e “Abrir mapa” destacou a quest.
- O ícone do app vem de `assets/tarkas-icon.png`, a partir da fonte vetorial `assets/tarkas-icon.svg`.

## Últimos commits importantes
- 95169fd feat(battlepass): track sourced document inventory
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
2. V0.2 registra itens documentais; requisitos e recompensas por tier continuam fora até existir fonte estruturada.
3. A candidata V0.2.1 está versionada no Drive para feedback manual.

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
- Bundle Git completo: G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-25-v0.2.0.bundle.

## Correção Quest → Mapa (24/09/2026)
- Causa: o commit dec1c0e guardava os IDs da quest/objetivo, mas o Map Engine não os consumia.
- Foco agora inclui quests selecionadas independentemente do status; o objetivo selecionado ganha destaque visual no mapa e a quest aparece na faixa “Quest em foco”.
- Foco de quest/objetivo validado no EXE recém-compilado dist/Tarkas-0.1.1-Windows.exe, incluindo cliques reais nos dois botões da tela de Quests.


## Rastreador de documentos do Battle Pass V0.2.0 (25/09/2026)
- Catálogo de oito itens vem do cache localizado `regular/items` + `regular/items_pt` do tarkov.dev; imagens e descrições exibidas são as da fonte. Classificados está marcado como universal conforme sua descrição publicada.
- O jogador registra quantidades localmente; o total na tela é apenas a soma dos itens registrados. Nenhum tier, requisito de progresso ou recompensa é inferido, pois o schema/catálogo disponível não oferece esses dados.
- Validação no EXE recém-compilado `dist/Tarkas-0.2.0-Windows.exe`: oito cartões e imagens renderizados; quantidade alterada para 7, persistiu ao navegar para outra tela e voltar; depois foi restaurada para 0. QA usou perfil isolado e a instância foi encerrada.
- `npm.cmd run check` e os 16 testes em `dev/tests` passaram; `npm.cmd run dist` terminou com exit code 0.
- SHA-256 do EXE: `FFC7CEE489401259C5EAF8398CA18C37819FF7FEAB3F432B8656B66BA7907879` (355.058.480 bytes).
- Release V0.2.0 no Drive: `G:\Meu Drive\Tarkas Releases\V0.2.0\Tarkas-0.2.0-Windows.exe`.
- Bundle Git completo V0.2.0: `G:\Meu Drive\Tarkas-dev-source\Projeto-Tarkas-2026-09-25-v0.2.0.bundle`.

## Empacotamento Windows V0.2.1 (26/09/2026)
- `electron-builder` configurado para gerar duas saídas x64: portátil e instalador NSIS assistido.
- Artefatos: `dist/Tarkas-Portable-0.2.1-Windows.exe` (355058480 bytes) e `dist/Tarkas-Setup-0.2.1-Windows.exe` (100169843 bytes).
- SHA-256 portátil: `D806FF3B703874C87EA10622EBF0166034FBF46C0E128F21BC951763F86935EA`.
- SHA-256 instalador: `0E13D20787DC8054B6610316330403920902AABBF141FA2BDB04984FAD294300`.
- `npm run check` e os 16 testes de `dev/tests` passaram antes da build; `npm run dist` terminou com exit code 0.
- Smoke test do portátil passou. O instalador foi instalado silenciosamente em diretório isolado de QA, o app abriu, o desinstalador retornou exit code 0 e o diretório de teste foi removido.
- Dados persistentes continuam fora da pasta do programa em `app.getPath('userData')/game-data`, portanto a instalação não depende de escrita na pasta do executável.
- Release copiado para `G:\Meu Drive\Tarkas Releases\V0.2.1\` com os dois EXEs e `SHA256.txt`.
