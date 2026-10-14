# Projeto Tarkas — Plano de versões

## Missões — retratos
- Retratos dos comerciantes adicionados aos cartões; fallback de iniciais em falha de imagem. Teste Electron aprovado.


## Celular e missões por comerciante
- Layout móvel corrigido, logo disponível no acesso Wi-Fi e QR Code local implementado.
- Missões organizadas por comerciante antes da lista; busca, situação e foco preservados.
- Testes Electron/HTTP aprovados e capturas conferidas; homologação pela câmera/celular pendente.


## Celular pelo Wi-Fi
- Implementado acesso pelo navegador enquanto o Tarkas permanece aberto no PC; chave temporária e dados do perfil ativo compartilhados.
- Testes HTTP/Electron aprovados. Homologação em celular físico pendente; instruções em MOBILE-WIFI.md.


## Navegação móvel
- Menu horizontal com posição ativa visível, indicador de rolagem e sem animação quando o sistema pede movimento reduzido.
- Conferência em dispositivo ainda pendente.

## Missões — responsividade
- CSS móvel para lista e detalhes atualizado; revisar na prévia em celular antes da publicação.

## Missões — estabilidade de navegação
- Proteção contra respostas atrasadas implementada. Validação Electron pendente devido a bloqueio do limite de aprovação automática.

## Missões — acesso ao catálogo completo
- Implementados: carregamento além de 120 resultados, busca sem acentos e preservação de rolagem ao selecionar.
- Validado em teste Electron com dados simulados; revisão visual real pendente.

## Catálogo — navegação incremental
- Preservação do contexto ao atualizar preços implementada e validada com sincronização simulada.
- Limpeza conjunta de filtros e orientação de lista vazia implementadas e testadas; revisão visual ainda pendente.
- Primeira abertura: atualização direta do catálogo vazio e recuperação de falha implementadas; teste de integração real pendente.
- Recuperação de erro na abertura implementada, com nova tentativa e proteção contra respostas após navegar; validada com falhas simuladas.
- Ordenação por nome e preço implementada e testada; sem preço fica ao final. Favoritos identificados para leitores de tela.
- Implementado e testado localmente: mais resultados em lotes, busca sem acentos e preservação de filtros.
- Validação visual com catálogo real continua pendente antes da publicação.

## Estabilidade do Arsenal e Mercado
- Corrigido: fichas com carregamento persistente e respostas misturadas ao trocar itens.
- Implementado: fechamento, nova tentativa, proteção contra gravação duplicada e atualização do filtro de favoritos.
- Testes de concorrência no Electron aprovados com dados simulados; nenhuma publicação neste checkpoint.

## Tarkovinho — economia de extração
- Preparação revisada: resumo ao vivo, seleção preservada na loja e entrada sempre acessível; teste de largura 390px aprovado no Electron.
- Navegação de busca implementada: desvios pelos cantos, margem corporal e cache curto; validação jogável ainda pendente.
- IA local refinada: distância de combate, deslocamento lateral, aviso de tiro e busca temporária da última posição vista. Contorno avançado de obstáculos e avaliação de dificuldade continuam pendentes.
- Lapidação parcial: recuo, clarão, rastros, impactos e recarga na mira implementados. Arte direcional/articulação da arma e comportamento dos inimigos ainda pendentes.
- Corrigido localmente: personagem invertido ao mirar; obstáculos com acabamento de concreto, madeira e metal, preservando colisões.
- Implementado localmente: animação de pernas por deslocamento, tiros distintos por arma e passos por superfície; pendente avaliação visual/auditiva do jogador.
- Corrigido: feedback visível ao bloquear entrada sem munição; preparação sugere munição disponível. Fluxo validado no Electron.
- Implementado localmente: arsenal de cinco armas, compra/equipamento pré-raid, estoque persistente, venda seletiva e mochila limitada.
- Implementado: consumíveis e munição levados são descontados; apenas extração recupera o restante. Granadas com dano próprio e comida para energia.
- Pendente: validação visual e playtest de preços, cadência, dano e capacidade. Novos mapas e expansão narrativa continuam em pacote separado.

## Mapas 2.0 — critérios aprovados em 13/10/2026
- Implementado: cartografia do Tarkov.dev em janela ampla reutilizável e opção de navegador.
- Implementado: objetivos, documentos/itens e chaves no planejamento local; lista completa das missões retornadas.
- Implementado: nova tentativa em falhas, proteção contra respostas atrasadas e alias de Factory noturna.
- Fora deste pacote, por decisão do usuário: miniaturas e desenho de rotas locais; camadas, andares e pontos são responsabilidade do provedor.
- Gate pendente: revisar visualmente cada destino online, navegação missão/mapa, tela pequena, falta de rede e desempenho. Não marcar concluído nem publicar antes dessa revisão.

## Checkpoint 13/10/2026 — revisão local
- Implementado: Arsenal e Mercado unificados; capítulo ilustrado; roadmap responsivo; dificuldade do minigame e correções de listas/documentos.
- Próximo: conferir telas desktop/celular e equilibrar dificuldade jogando a prévia antes de publicar.

## Checkpoint 12/10/2026 — estabilidade de missões
- Implementado: abertura da missão indicada nos atalhos e separação entre mapa da missão e raid rápida.
- Implementado: continuidade da digitação, atualização imediata de status e recuperação de falha de gravação.
- Próximo: conferir visualmente os fluxos de busca, ativação e conclusão no Electron antes da release.

## Regra atual
Prioridade absoluta: **V0.1 funcionando > refinamentos > novas funcionalidades**.
O PC MgoesPC é a máquina oficial de desenvolvimento. O MGOES-NOTE é apenas laboratório e não deve executar Codex neste projeto. Antes de trocar de máquina, conferir o estado do projeto e evitar processos duplicados.

## V0.1 — mínima, funcional e estável
- Aplicativo Windows iniciado por executável, sem terminal/BAT para uso normal.
- Instância única e encerramento limpo.
- Sincronização/cache dos dados essenciais do Tarkov com fallback local.
- Visão Geral enxuta e nível do jogador persistente.
- Catálogo de Quests com busca, filtro, pré-requisitos e ações Ativar/Concluir.
- Atalho Quest → Mapa.
- Mapa Interativo com SVG local, marcadores essenciais, filtros, andares quando suportados, zoom/pan e horário Tarkov.
- Labs validado com três níveis e dados estruturados disponíveis para extrações, trânsito, switches e loot.
- Tratamento de erro sem derrubar o restante do aplicativo.
- Baixo uso de recursos quando ocioso.
- Nenhum watcher, servidor ou processo de desenvolvimento iniciado automaticamente.

## Fora da V0.1 — ideias preservadas
### V0.2
- Boss Radar completo (chance, pontos, grupos e janela de entrada exibidos a partir do cache local).
- Progresso de quests mais detalhado e cadeia/pré-requisitos avançados.
- “O que fazer agora?” por mapa.
- Melhorias de calibração e tratamento dos poucos outliers de mapas.
- Guia de chaves ligado a quests/mapas.
- Raid Mode: checklist de chaves e itens de objetivo das quests ativas/disponíveis por mapa; riscos só entram com posições estruturadas verificáveis.
- Rastreador local do inventário dos documentos de Battle Pass sustentados pelo cache do tarkov.dev; progresso por tier/recompensas aguardam fonte estruturada.

### V0.3
- Stash/inventário.
- Hideout e timers.
- Gerador/combustível e lembretes.
- Cultist Circle: receitas, histórico, confiança e avisos.
- Loadouts e economia.

### V0.4+
- Raid Scan por screenshot/foto.
- Assistente NICK // RAID.
- Vídeos/YouTube contextualizados por patch.
- Sincronização em nuvem e múltiplos computadores.
- Web/PWA/mobile para usar o celular como segunda tela.
- Planejamento público/estático de bosses.
- Arsenal/builds/munição como dados exclusivamente do jogo.

## Regras técnicas
- Shared Core não deve depender do Electron.
- Dados globais do jogo separados do progresso pessoal.
- Antes de criar manualmente uma ferramenta/dataset do Tarkov, verificar primeiro tarkov.dev/API e ecossistema aberto.
- Nada de inventar coordenadas ou conteúdo dinâmico ausente da fonte.
- Sem polling pesado; cache e atualização sob demanda/intervalos conservadores.
- Scripts de diagnóstico/teste ficam em dev/.
- Disponibilidade > preferência de máquina; notebook preferido, PC como fallback automático e vice-versa.
