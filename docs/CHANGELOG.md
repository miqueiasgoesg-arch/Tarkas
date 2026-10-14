# Changelog — Projeto Tarkas

## 2026-10-14 — Pacote consolidado 0.7.19
- Backup completo com aplicativo fechado, manifesto SHA-256 e verificação; Pit Stop confere versão e evita varrer mídia/cache.
- Unificados VERSION e pacote; arquivos locais de QA excluídos do Git.
- Traduções reversíveis dos fluxos atuais, armas/antebraços articulados e mira inimiga sem rastreamento oculto.
- Sincronização real, 13 destinos online, 27 testes, backup de 260 arquivos e Sinal Verde aprovados.
- Gerados instalador/portátil e validado aplicativo empacotado com perfis existentes.


## 2026-10-14 — Retratos dos comerciantes
- Catálogo de missões inclui traderImage da base de comerciantes; cartões exibem retrato com texto alternativo e iniciais como fallback.
- Conferidos os 11 comerciantes do cache. Teste Electron de imagem/fallback e check geral passaram.


## 2026-10-14 — Layout móvel, QR Code e comerciantes
- Corrigidas regras antigas que forçavam a lateral desktop no celular e o logo indisponível pelo HTTP.
- QR Code local com qrcode 1.5.4 para o link autenticado; nenhum serviço externo recebe a chave.
- Aba Missões abre cartões dos comerciantes e filtra a lista pelo trader selecionado, com busca/status/paginação e retorno.
- Testes Electron em 360/390/430/768px, QR/link, busca, paginação, isolamento por comerciante, mudança de status e foco direto passaram; capturas revisadas. Check/HTTP/mapas passaram; nenhum EXE gerado.


## 2026-10-14 — Acesso móvel pelo Wi-Fi (local)
- Adicionados servidor HTTP sob ativação explícita, chave temporária, ponte navegador/IPC e painel de links no PC.
- Reutiliza dados SQLite; bloqueia operações de sistema e diálogos pelo acesso remoto. Mapas abrem no navegador.
- Corrigido erro de sintaxe existente no ramo dashboard da navegação.
- Testes HTTP e Electron em 390px com perfil isolado aprovados; check geral e teste de janela de mapas passaram. Sem build Windows; celular físico pendente.


## 2026-10-14 — Menu móvel (local)
- Menu horizontal mostra indicador de rolagem; seção selecionada entra em vista automaticamente.
- Adicionado estado `aria-current` para leitores de tela; animação respeita preferência de movimento reduzido.
- Prévia em dispositivo móvel ainda pendente.

## 2026-10-14 — Missões no celular (local)
- Lista de missões em telas estreitas recebe rolagem delimitada, evitando empurrar os detalhes para baixo.
- Detalhes preservam largura e botões de ação ficam mais fáceis de tocar.
- Prévia móvel pendente; limite de aprovação automática impede nova execução do Electron neste momento.

## 2026-10-14 — Navegação segura em Missões (local)
- Leituras assíncronas de nível e catálogo ignoram respostas após sair da página.
- A tela ainda apresenta recuperação se ocorrer falha durante a montagem.
- Não foi possível validar no Electron: limite de aprovação automática bloqueou a execução do teste.

## 2026-10-13 — Navegação de Missões (local)
- Corrigido limite silencioso de 120 missões com carregamento em lotes e contador do total filtrado.
- Busca tolerante a acentos e controles com rótulos acessíveis.
- Selecionar missão preserva rolagem e foco; busca mantém missão selecionada quando ela continua nos resultados visíveis.
- Testes Electron com 245 missões simuladas e check geral aprovados. Sem publicação.

## 2026-10-13 — Contexto após atualização (local)
- Atualização de preços mantém filtros, ordenação e lote visível do catálogo.
- Estado passa pela recuperação de leitura sem gravar preferências no perfil.
- Testes Electron com 321 itens e sincronização simulada aprovados, além do check geral. Sem publicação.

## 2026-10-13 — Limpeza de filtros (local)
- Botão Limpar filtros restaura todos os itens, mantém ordenação e devolve foco ao campo de busca.
- Filtro de favoritos anuncia estado; mensagens de lista vazia indicam como voltar aos itens.
- Testes de filtros combinados, foco e regressões passaram no Electron com dados simulados. Sem publicação.

## 2026-10-13 — Primeira abertura do catálogo (local)
- Catálogo vazio oferece atualização direta com aviso de andamento, proteção contra clique duplicado e retry em falha.
- Sincronização concluída após sair não reabre a página.
- Suíte Electron com sincronização simulada e check geral aprovados. Sem publicação.

## 2026-10-13 — Recuperação da abertura do catálogo (local)
- Tratada rejeição na leitura de catálogo, favoritos ou status: aviso acessível e botão para tentar novamente.
- Falha recebida depois de sair da página não substitui a tela atual.
- Testados erro, recuperação por botão e saída durante carregamento, além das regressões existentes. Check geral aprovado; sem publicação.

## 2026-10-13 — Ordenação do Arsenal e Mercado (local)
- Seletor de ordem original, nome A–Z e preços crescente/decrescente, sem alterar a fonte do catálogo.
- Itens sem preço válido ficam no final nas ordenações por preço.
- Favoritos anunciam nome e estado; testes de ordenação e teclado aprovados no Electron com dados simulados.

## 2026-10-13 — Navegação do catálogo (local)
- Itens além dos primeiros 160 acessíveis por Carregar mais, sem perder filtros.
- Busca tolerante a acentos e foco de teclado no primeiro item do novo lote.
- Teclado no botão de favorito não abre inadvertidamente a ficha.
- Testes Electron com dados simulados e verificação geral aprovados. Sem publicação.

## 2026-10-13 — Fichas do Arsenal e Mercado
- Respostas antigas não alteram item, categoria ou página mais recente.
- Removido aviso de carregamento após resposta; estado ocupado acessível, fechamento e retry.
- Sincronização respeita saída da página; locais pessoais bloqueiam envio duplicado e mantêm texto em falha.
- Favoritos exibem falha e removem da lista filtrada o item desfavoritado.
- Testes de concorrência e recuperação no Electron aprovados.

## 2026-10-13 — Preparação da raid (local)
- Rodapé de entrada fixo com resumo de arma, munição e slots.
- Quantidades não são mais zeradas a cada compra/venda; estoque restante limita a seleção.
- Valores inválidos e excesso de slots bloqueiam entrada antes de retirar suprimentos.
- Testes de preparação e renderização compacta no Electron aprovados.

## 2026-10-13 — Navegação dos inimigos (local)
- Busca da última posição vista contorna obstáculos com rotas por cantos, sem atravessar paredes.
- Margem corporal, limites do mapa e falha segura quando não existe caminho.
- Cache de rota por 0,7s; testes de geometria e deslocamento incluídos.

## 2026-10-13 — Reação dos inimigos (não publicado)
- Avanço, recuo e movimentação lateral, com parada para mirar e aviso visual de disparo.
- Cancelamento de tiro ao perder visão; memória limitada da última posição observada.
- Patrulha limitada ao mapa e sujeita às colisões. Economia e inventário inalterados.

## 2026-10-13 — Feedback de combate (local)
- Recuo diferenciado, clarão direcional, rastros curtos e impactos leves em cobertura/personagens.
- Confirmação visual de acerto e recarga junto à mira.
- Partículas limitadas e efeitos com expiração; nenhuma mudança em preços, estoque ou dano das armas.

## 2026-10-13 — Orientação e obstáculos do Tarkovinho
- Removida rotação integral do sprite: mira não deixa mais o personagem de cabeça para baixo.
- Obstáculos diferenciados por material, com sombreamento e desgaste determinístico sem alterar área bloqueada.

## 2026-10-13 — Movimento e som do Tarkovinho
- Animação segmentada de pernas do jogador e inimigos, com passada calculada pela distância real e repouso suave.
- Efeitos procedurais distintos para pistola, SMG, M4, calibre 12 e sniper.
- Passos sincronizados, timbre por cenário e sons inimigos atenuados por distância.
- Buffer de áudio reutilizado, limite de vozes e botão mudo preservado.

## 2026-10-13 — Botão de entrada no Tarkovinho
- Aviso de falta de munição movido para junto do botão, com rolagem para ficar visível.
- Preparação sugere um carregador quando existe munição no estoque e verifica a disponibilidade real antes de entrar.
- Teste no Electron em perfil temporário aprovou entrada com pistola, bloqueio explicado de SMG vazia e entrada de SMG abastecida.

## 2026-10-13 — Tarkovinho: estoque e arsenal (não publicado)
- Loja de pistola/SMG/M4/calibre 12/sniper com diferenças reais de alcance, dano, cadência, recarga e dispersão.
- Inventário persistente com venda seletiva, munição por calibre e preparação da mochila antes de entrar.
- Extração recupera loot e suprimentos não usados sem venda automática; contrato paga bônus separado.
- Armas permanecem compradas após morrer; equipamento consumível levado é perdido.
- Comida, energia, granadas temporizadas, indicação da área de explosão e dano ao próprio jogador.
- Mochila limitada, melhorias preservadas e proteção contra revenda de munição gratuita.
- Migração do saldo antigo e testes de extração, morte, duplicação, persistência e falha de gravação.

## 2026-10-13 — Revisão de Mapas 2.0 (não publicado)
- Plano detalha objetivos, itens/documentos e chaves; remove limite de cinco missões exibidas.
- Foco em missão pode ser removido; troca de área invalida respostas anteriores e limpa plano antigo.
- Mensagens de erro com nova tentativa e abertura alternativa no navegador.
- Janela tática restaura ao reabrir; cancelamentos e falhas de navegações antigas não substituem o destino atual.
- Teste isolado aprovado para 13 destinos, alias Factory noturna, reutilização, sandbox e falhas simuladas.
- Roadmap alinhado à integração aprovada. Validação visual online/desempenho ainda pendente.

## 2026-10-13 — Desafio e apresentação (não publicado)
- Unificação de Arsenal e Mercado com ficha técnica, munições compatíveis e encaixes.
- Roadmap com pontos de operação responsivos e estado selecionado acessível.
- Ilustrações remotas de mapas/personagens nos sete capítulos, com créditos e tratamento de falha.
- Lista de missões sem compressão de linhas; documentos em cartões com descrição quebrável e inventário legível.
- Tarkovinho com quatro inimigos mais resistentes, projéteis mais rápidos, recarga temporizada e extração condicionada a saque.
- Corrigidos tiros através de cobertura, setas de movimento e mira automática para o inimigo mais próximo.
- Testes direcionados de recarga, extração, resistência e cobertura aprovados. Validação visual pendente.

## 2026-10-12 — Correções locais de interação em Missões (não publicado)
- Atalhos selecionam a missão solicitada mesmo quando ela está em andamento ou concluída; a busca fica preenchida com seu nome.
- Planejamento da próxima missão usa o mapa da missão em vez do mapa selecionado na Raid Rápida.
- Busca preserva foco, cursor, espaços e maiúsculas durante a digitação.
- Filtros refletem o novo status após ativar ou concluir uma missão.
- Botão bloqueia gravação duplicada, permite repetir após falha e evita redesenhar uma página já fechada.
- Missões concluídas deixam de exibir a mensagem incorreta de pré-requisitos pendentes.

## 2026-10-11 — V0.7.7, Missões 2.0 — linhas e desbloqueios
- Cada linha de missão ganha um **dossiê prático**: próxima etapa, comerciante, nível, mapa e progresso local, sem misturar lore com requisitos verificáveis.
- O dossiê mostra itens concretos da próxima etapa, quantidade e a exigência de item encontrado em raid quando o catálogo a informar; etapas sem item deixam isso claro.
- Atalhos levam diretamente à missão filtrada ou ao mapa relevante para preparar a raid.
- O Roadmap registra **Mapas 2.0** como concluído e abre a fase de **Missões 2.0**.
- A verificação de release passa a validar também o módulo de Missões 2.0, além da cobertura cartográfica dos 14 mapas.

## 2026-10-09 — V0.7.6, estabilidade de navegação
- Navegação consolidada em um registro único de telas, evitando que implementações antigas concorram ao abrir Visão Geral, Missões, Mapa, Passe de Batalha e os módulos complementares.
- Estados de carregamento e falha agora comunicam o status para leitores de tela e mantêm uma ação clara de tentativa novamente.
- Painel de camadas do mapa passa a apresentar **áreas de spawn** agrupadas por setor, deixando explícita a diferença entre setores úteis e pontos técnicos brutos.
- Mantidos os refinamentos de leitura dos mapas, painéis de conteúdo longo e trilha visual do roadmap.

## 2026-10-09 — V0.7.5, Mapas 2.0 — explorador e rotas
- O painel lateral dos mapas ganhou acesso direto a **Rota da missão**, desenhando spawn possível → objetivo em foco → extração próxima apenas quando houver posições verificáveis.
- Corrigido o filtro de Documentos e Stashes: a camada de objetivos necessária permanece ligada, então os marcadores filtrados não desaparecem.
- A busca do explorador isola e realça marcadores pelo nome, com retorno da quantidade encontrada.
- O mapa permanece em tela ampla, com a camada lateral fixa e a validação dos 14 mapas antes do empacotamento.

## 2026-10-09 — V0.7.4, Mapas 2.0
- Explorador tático reorganizado com camadas exclusivas, busca, filtros de documentos e stashes, andares, zoom, pan e painel lateral persistente.
- Camadas verificadas para extrações, spawns, objetivos, bosses, perigos, switches, transições, BTR, portas, armas estacionárias e zonas de loot agrupado.
- Rota sugerida agora desenha spawn possível → objetivo → extração ou informa claramente quando não há coordenada confirmada.
- Factory à Noite compartilha a planta calibrada de Factory; Labirinto e Icebreaker mostram modo tático de dados enquanto não houver arte local redistribuível.
- Inclusa validação automática de integridade para SVGs, calibração e posições dos 14 mapas antes da release.

## 2026-10-04 — V0.5.6, estabilidade e navegação
- Corrigida a troca de idioma da interface.
- Criação automática do atalho do Tarkas na área de trabalho.
- Cursor de operador refinado para os estados normal e interativo.
- Mapas com controles visíveis de zoom e centralização.
- Recompensas de quests exibem valores e comerciantes legíveis.
- Ajustado o layout da fila de upgrades do Hideout e da navegação lateral.

## 2026-10-04 — V0.5.5, rota guiada e planejamento
- Base multilíngue com detecção do idioma do sistema, escolha manual persistente por perfil e suporte inicial a português, inglês e espanhol.
- Navegação, busca rápida, identificação do aplicativo e ações globais de atualização respeitam o idioma escolhido.
- Preparadas a correção do reinício pós-atualização e a criação de atalho na área de trabalho pelo próprio app.
- Rota de raid ganhou animação por objetivos e extrações; o painel de nível agora usa brasão vetorial; Roadmap e Hideout receberam planejamento de próximas etapas.
- Cache local de dados e preços atualizado em 04/10/2026, sem falhas na fonte.

## 2026-10-04 — V0.5.4, campanha oficial e cursor
- A aba História agora exibe uma campanha guiada com capítulos oficiais, sem depender do marcador ausente na base local.
- Cada capítulo traz contexto, mapa, passo a passo didático, alertas para escolhas de rota e progresso local por perfil.
- Cursor tático redesenhado: operador em pé com arma baixa no repouso e arma elevada em ações clicáveis; campos de texto continuam com cursor de digitação.

## 2026-10-03 — V0.5.3, atualização no próprio app
- O aviso de atualização do Tarkas permanece visível na Visão Geral, mesmo depois do carregamento do painel inicial.
- O cartão permite verificar a versão publicada, acompanhar o download e instalar/reiniciar sem baixar manualmente o instalador.

## 2026-10-03 — V0.5.2, guia didático e Roadmap
- Nova aba Roadmap para mostrar o que está concluído, em andamento e planejado.
- Missões exibem recompensas quando a fonte local informar EXP, itens, rublos ou reputação.
- Abrir uma quest no mapa agora mostra um guia passo a passo e as chaves necessárias pela rota.
- Boss Radar passa a abrir uma ficha clicável com chance, locais, entrada e capangas.
- Biblioteca de itens fecha a ficha anterior ao trocar de categoria; painel de nível e cursor tático foram refinados.

## 2026-10-03 — V0.5.1, operador, história e interface
- Cartão de Operador por perfil: imagem local do personagem em PNG, JPG ou WEBP.
- Nova aba História: rota guiada de quests encadeadas, passos marcáveis e atalhos para o mapa.
- Painel de nível, lembretes, rolagem e botões táticos refinados.
- Corrigido o aviso de carregamento que permanecia na ficha de itens.

## Em preparação — V0.5.0, biblioteca e perfis
- Biblioteca de itens com categorias claras, busca e fichas clicáveis.
- Fichas mostram preço, descrição, comerciantes, vínculo com quests, Hideout e atalhos para mapas relacionados.
- Locais pessoais de farm são salvos por perfil e incluídos no backup.
- Perfis locais isolam progresso, stash, builds, raids e anotações; a restauração cria uma cópia de recuperação.

## 2026-10-03 — V0.4.12, atualização automática
- O Tarkas consulta versões publicadas no GitHub ao abrir.
- Quando há uma versão nova, ela é baixada em segundo plano e pode ser instalada pelo painel da Visão Geral.
- O processo mantém o perfil local; os backups continuam disponíveis na Central de Operações.

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
