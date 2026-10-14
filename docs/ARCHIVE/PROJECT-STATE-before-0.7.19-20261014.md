# Projeto Tarkas — Estado atual

## Validação pelo usuário no celular — 14/10/2026
- Usuário confirmou funcionamento e layout conforme esperado no aparelho real, pelo acesso Wi-Fi.
- Retratos adicionados depois; conferência visual desses retratos pelo usuário ainda pendente.


## Retratos nos comerciantes (local)
- Cartões de Missões exibem traderImage do catálogo; todos os 11 comerciantes no cache possuem URL de retrato.
- Imagens mantidas pela fonte; falha de carregamento mostra iniciais. Teste Electron de imagem e fallback passou; check geral aprovado.


## Celular — layout, QR Code e comerciantes (local)
- Corrigida barra lateral móvel sobrescrita por regras antigas; logo servido pelo Wi-Fi, painel compacto e conteúdo sem estouro horizontal.
- QR Code gerado no PC para cada link autenticado; link escrito mantido, QR antigo removido ao desativar.
- Missões começam por comerciantes; seleção mostra apenas as missões daquele trader, com busca, situação, lotes e retorno. Foco direto de missão preservado.
- Electron com perfil isolado passou em 360/390/430/768px; QR/link, carregamento do logo, comerciantes, busca sem acentos, paginação e status passaram. Capturas conferidas.
- Check geral, regressão de mapas e teste HTTP passaram. Próximo: leitura pela câmera e conferência física no celular; sem build Windows.


## Acesso no celular pelo Wi-Fi — local, não publicado
- Botão Acessar no celular ativa servidor HTTP protegido por chave temporária; desligado por padrão, encerra com o app.
- Navegador usa o SQLite do perfil ativo no PC; Tarkovinho continua com armazenamento por navegador. Sem PWA/offline ou acesso com PC desligado.
- Testes HTTP e Electron real em 390px aprovados, incluindo escrita compartilhada em perfil isolado; check geral e regressão de mapas passaram.
- Corrigido erro de sintaxe preexistente na navegação que impedia carregar app.js.
- Próximo: conferir celular físico/firewall na rede privada. Uso em docs/MOBILE-WIFI.md; nenhum EXE gerado.


Atualizado: 14/10/2026

## Navegação móvel — local, não publicado
- Menu lateral mantém rolagem horizontal com indicador discreto; ao trocar de seção, botão ativo entra em vista e recebe `aria-current`.
- Respeita redução de movimento do sistema. Prévia em dispositivo móvel pendente.

## Missões — navegação (não publicado)
- Em largura móvel, lista ganhou painel com rolagem própria limitado à viewport, detalhes não encolhem e ações têm área de toque maior. CSS implementado; prévia visual móvel pendente.
- Leituras de nível/catálogo concluídas após sair da tela respeitam a navegação; falhas durante a montagem mostram recuperação. Alteração sem validação Electron: a execução foi bloqueada pelo limite de aprovação automática.
- Carregar mais libera missões após as primeiras 120; contador informa o total filtrado.
- Busca sem acentos, filtros reiniciam lote, seleção mantém rolagem e foco na lista.
- Teste Electron com 245 missões simuladas e check geral aprovados. Revisão visual com dados reais pendente.

## Catálogo completo — não publicado
- Atualizar preços preserva busca, categoria, filtro de favoritos, ordenação e quantidade carregada. Estado também acompanha tentativa após falha de leitura. Teste Electron simulado e check geral aprovados.
- Limpar filtros reinicia busca/categoria/favoritos sem apagar favoritos salvos nem alterar ordenação; devolve foco à busca. Mensagens distinguem favoritos vazios de nenhum resultado. Testes Electron simulados e check geral aprovados; revisão visual pendente.
- Catálogo vazio permite sincronizar na própria tela, bloqueia clique duplicado e oferece nova tentativa em erro. Fluxos validados no Electron com sincronização simulada; conexão real ainda não validada neste checkpoint.
- Falhas na abertura agora mostram aviso com nova tentativa; falhas atrasadas respeitam saída da página. Testes de recuperação e regressão no Electron aprovados com dados simulados.
- Ordenação por nome/menor/maior preço, com itens sem preço ao final e lote reiniciado ao ordenar; favoritos com rótulo e estado acessíveis.
- Teste Electron de ordenação e isolamento de teclado aprovado com dados simulados; check geral aprovado. Conferência visual no app real pendente.
- Carregar mais em lotes de 160, preservando busca e categoria; filtros reiniciam o lote.
- Busca sem distinção de acentos, com índice preparado uma vez por abertura.
- Teste Electron com 321 itens simulados passou: lotes, fim da lista, busca e categoria. `npm run check` aprovado.

## Tarkas — Arsenal e Mercado (não publicado)
- Fichas invalidam respostas atrasadas ao trocar item/categoria/página; carregamento é removido e estado ocupado finalizado.
- Fechar ficha e tentar novamente em erros; sincronização não reabre Mercado depois de sair da página.
- Salvar local bloqueia clique duplicado e preserva campos em erro. Favoritos tratam falha e atualizam a lista filtrada.
- Teste Electron com dados simulados passou para respostas invertidas, carregamento, categoria, erro/retry e saída da página. Sem publicação.

## Tarkovinho — preparação revisada (não publicada)
- Rodapé fixo com arma, tiros, slots ocupados e botão de entrada; loja/arsenal rolam separadamente.
- Quantidades selecionadas preservadas nas atualizações da loja e limitadas ao estoque restante.
- Validação explícita de quantidades e capacidade antes de descontar suprimentos.
- Testes de economia/preparação passaram; Electron validou entrada, aviso de munição e rodapé visível em largura de 390px. Ainda não publicado.

## Tarkovinho — contorno de obstáculos, não publicado
- Busca da última posição conhecida agora usa rotas pelos cantos, considerando raio do inimigo e limites do mapa.
- Rotas reaproveitadas por 0,7s; destino inacessível não provoca travessia de paredes.
- Memória de visão continua limitada a 2,5s. Nenhuma leitura da posição oculta para traçar rotas.
- Testes isolados e simulação de movimento validam caminhos, clearance, paredes sem passagem e destinos inválidos. Playtest de dificuldade ainda pendente.

## Tarkovinho — comportamento de combate, não publicado
- Inimigos avançam, recuam e alternam movimentação lateral; param para mirar e sinalizam 0,4s antes do disparo.
- Perda de visão cancela tiro; busca da última posição dura 2,5s, sem atualização da posição oculta do jogador.
- Patrulha respeita obstáculos e bordas. Busca com contorno implementada no checkpoint acima; movimento lateral de combate permanece local.
- Testes direcionados aprovados para aviso, cancelamento, memória, colisões e bordas. Ajuste de dificuldade pelo jogador pendente.

## Lapidação do combate — primeira parte, não publicada
- Recuo visual por categoria de arma, clarão direcional, rastros curtos, impactos em cobertura e indicação de dano sem sangue.
- Mira com confirmação de acerto e contador de recarga; efeitos expiram e partículas limitadas a 100.
- Inventário e economia preservados. Sprites completos com arma articulada e refinamento de IA continuam pendentes; esta rodada não os substitui.

## Ajuste visual do Tarkovinho
- Sprite permanece em pé ao mirar: espelhamento horizontal substitui rotação integral que invertia o personagem.
- Barreiras de concreto, paletes/caixas e contêineres desenhados com materiais, desgaste estável e sombras; colisões preservadas.
- Testes de gameplay passaram; acabamento visual ainda sujeito à avaliação do jogador.

## Tarkovinho — movimento e áudio (não publicado)
- Pernas alternadas por deslocamento real e oscilação leve do corpo, inclusive inimigos; parada suaviza para repouso.
- Cinco timbres de tiro sintetizados localmente; passos sincronizados à distância percorrida, com variação quintal/depósito e atenuação dos inimigos.
- Áudio respeita mudo, limita vozes simultâneas e reutiliza buffer de ruído. Sem download de arquivos de áudio.
- Setas direcionais corrigidas para corresponder às teclas normalizadas. Conferência estética e auditiva humana ainda necessária.

## Correção do botão de incursão
- Bloqueio por falta de munição agora explica o motivo junto ao botão, dentro da área visível.
- Armas compradas sugerem até um carregador da munição existente no estoque; quantidade permanece editável.
- Teste real em Electron com perfil temporário: pistola inicia, SMG sem munição apresenta aviso visível e SMG abastecida inicia. Testes de economia também passaram.

## Tarkovinho — arsenal e estoque (local, não publicado)
- Pistola gratuita; SMG, M4, calibre 12 e sniper compráveis e permanentes. Arma selecionada antes da raid com dano/cadência/alcance/carregador próprios.
- Loot não é vendido automaticamente: volta ao estoque; venda por item ou lote de munição. Medkits, comida, granadas e quatro tipos de munição.
- Preparação retira suprimentos do estoque antes da raid; extração devolve apenas o restante. Morte perde os suprimentos, não as armas.
- Mochila de 8 slots + melhorias; munição empilha por 12. Tiros de emergência da pistola não voltam ao estoque e não podem ser vendidos.
- Q cura, F come, G lança granada com temporizador e dano próprio. R recarrega. Controles de toque incluídos.
- Saldo e melhorias legados migrados para tv_economy_v1; transações revertem em falha de gravação.
- Testes automatizados de economia e gameplay aprovados. Visual, balanceamento jogável e orientação em celular ainda precisam ser conferidos. Não houve publicação.

## Mapas 2.0 — escopo revisado e aprovado
- Cartografia, zoom, andares, camadas e marcadores no Tarkov.dev; sem recriar miniaturas ou rotas locais.
- Plano do Tarkas agora lista todas as missões retornadas, objetivos, documentos/itens e chaves. Inclui nova tentativa e saída do foco de uma missão.
- Trocas rápidas ignoram resultados antigos; janela reutilizada restaura quando minimizada, ignora navegação cancelada e falhas de destino anterior. Alternativa no navegador disponível.
- Teste tools/test-map-window.cjs passou: 13 destinos + alias noturno, isolamento e falha offline simulada. Check passou: 14 mapas locais.
- Ainda NÃO concluído/publicado: falta homologação visual online por destino e medição de desempenho. Testes simulados não confirmam conteúdo do site.

## Checkpoint local — desafio e apresentação (não publicado)
- Arsenal incorporado ao Mercado, com atributos, munições e encaixes no detalhe do item.
- Tarkovinho: quatro inimigos mais resistentes, recarga de 1,6s, extração de 6s com saque mínimo; cobertura bloqueia projéteis e linha de tiro.
- Roadmap em pontos de operação responsivos; capítulos ilustrados por mapas/personagens do acervo Tarkov.dev, com fonte e aviso offline.
- Ajustes de altura das missões e cartões de documentos. Conferência visual no Electron ainda pendente.
- Check de sintaxe/dados passou (14 mapas); teste direcionado tools/test-tarkovinho.cjs passou.

## Checkpoint local — correções de missões
- Atalhos da Visão Geral e do mapa selecionam a missão solicitada; planejamento da missão usa seu mapa, independente do seletor de raid rápida.
- Código local em 0.7.18, com alterações anteriores preservadas; este checkpoint não foi publicado.
- Busca mantém foco e posição do cursor; filtros continuam sem diferenciar maiúsculas.
- Ativar/concluir atualiza o estado usado pelos filtros e impede cliques duplicados durante a gravação.
- Erros de gravação oferecem nova tentativa. Conferência visual no Electron ainda pendente.
- As referências de versões e builds abaixo são históricas, não indicam a candidata atual.

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Todo Codex roda no PC MgoesPC, que passa a ser a fonte oficial de desenvolvimento. O notebook MGOES-NOTE é apenas laboratório/testes auxiliares e não deve executar Codex. Não desenvolver simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Próxima candidata: suporte multilíngue com detecção do idioma do sistema e preferência salva por perfil. A navegação, o painel de versão/atualização e os textos globais já estão disponíveis em português, inglês e espanhol; os guias táticos serão ampliados progressivamente sem traduzir nomes oficiais do jogo.
- O painel de atualização exibe a versão instalada. A próxima publicação também corrige o reinício após atualizar e permite criar um atalho na área de trabalho pelo próprio app.
- Pacote atual: cursor tático simplificado com operador e arma, rota animada em mapas, brasão de nível vetorial, Roadmap detalhado e fila de próximos upgrades do Hideout.
- Dados regulares de quests, mapas, comerciantes, Hideout e preços foram sincronizados com sucesso em 04/10/2026.
- Versão candidata local: 0.5.0; ainda não publicada.
- Atualização automática configurada para consultar releases publicadas no GitHub.
- Biblioteca de itens: categorias, busca, fichas clicáveis, preço, comerciantes, vínculos com quests/Hideout e atalhos para mapa quando há vínculo verificável.
- Perfis locais isolam progresso, stash, builds, raids e anotações. Backup exportável e restauração com cópia de recuperação.
- Locais pessoais de farm podem ser adicionados por item e são preservados em backup.
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
1. PC MgoesPC é a cópia principal para Codex e desenvolvimento oficial. Notebook é laboratório/testes auxiliares; não executar Codex nele.
2. Boss Radar no Raid Mode exibe chance, áreas, grupos e janela de entrada conforme o cache estruturado; minas/snipers seguem sem marcador até o cache trazer posições verificáveis.
3. A candidata V0.2.1 está versionada no Drive para feedback manual.

## Marcadores táticos V0.2.2 (26/09/2026)
- Implementados símbolos por categoria no Mapa Interativo: extração (quadrado com seta), spawn (triângulo), boss (silhueta), objetivo (cruz) e switch (losango).
- A alteração não introduz posições novas: ela somente torna visualmente distinguíveis os dados estruturados já disponíveis.
- A próxima etapa é compilar e validar esta mudança no EXE recém-gerado antes de tratá-la como release.
- `npm.cmd run dist` concluiu no PC: portátil `dist/Tarkas-Portable-0.2.2-Windows.exe` (355072553 bytes, SHA-256 `7D802A645076186D304AE0AB101C7F1D881E966E3D3E0C061567B8F13DFC914A`) e instalador `dist/Tarkas-Setup-0.2.2-Windows.exe` (100170788 bytes, SHA-256 `A76C6A6E1BCB981E7889A3053D9F19F99EDBA0B7BCA9C0813C8744F87409440D`).
- O portátil V0.2.2 foi aberto e validado no app real: Dashboard, guia de quest com imagens, Customs com 450 marcadores e o fluxo Quest → Mapa passaram; a captura visual confirmou os novos símbolos no mapa.

## Ficha tática de marcador V0.2.3 (26/09/2026)
- Ao clicar em um marcador, o mapa passa a abrir uma ficha contextual no mesmo painel; a interação não interfere em zoom, pan, filtros ou andares.
- A ficha descreve apenas a categoria e o texto local do marcador. Para objetivo de quest, exibe o nome da quest e a descrição do objetivo; para boss, preserva nome e chance enviados pela fonte.
- Aguardar build e validação no EXE para considerar esta candidata pronta.
- V0.2.3 compilada no PC: portátil `dist/Tarkas-Portable-0.2.3-Windows.exe` (355074971 bytes, SHA-256 `2D4654AC1220F0C3431C67214BDCA3D7FA829AF34B509ADB175688F3CCB81D19`) e instalador `dist/Tarkas-Setup-0.2.3-Windows.exe` (100171353 bytes, SHA-256 `61EBBFB222024C0C4AD938F45DC7FF4A55EF8F027A69828E10D824695F38DBCA`).
- O portátil recém-compilado foi aberto e passou: clicou em marcador de boss, abriu ficha com categoria, nome e chance; a regressão de Dashboard, guia de quest e Quest → Mapa também passou.

## Identificação do Tarkas V0.2.4 (26/09/2026)
- Nome da janela e título HTML unificados em `Tarkas`; autoria do pacote Windows declarada como `MGOES`.
- Assinatura visual “Desenvolvido por MGOES” adicionada de modo discreto à barra lateral.
- Aguardar compilação e abertura do EXE para validar os metadados do produto.
- Build V0.2.4 concluída sem o antigo aviso de autoria: portátil `dist/Tarkas-Portable-0.2.4-Windows.exe` (SHA-256 `D96F4C7EF0AAD1E746DCD3543C42DF46AAC3C6270B45DA6BE3636A714EFE9EF3`) e instalador `dist/Tarkas-Setup-0.2.4-Windows.exe` (SHA-256 `B68346B78B3484D8C527949B8F67DAABF59FE8E930FF18BFB59B00986E3081E5`).
- O portátil V0.2.4 foi aberto após encerrar apenas a instância temporária V0.2.3: a janela apresentou o título `Tarkas`; testes de Dashboard/Quest/Mapa e de ficha de marcador passaram.

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
