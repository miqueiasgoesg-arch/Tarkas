# Projeto Tarkas — Plano de versões

## Regra atual
Prioridade absoluta: **V0.1 funcionando > refinamentos > novas funcionalidades**.
O notebook MGOES-NOTE é o laboratório de desenvolvimento. O PC principal recebe apenas builds prontos para teste/uso.

## V0.1 — mínima, funcional e estável
- Aplicativo Windows iniciado por executável, sem terminal/BAT para uso normal.
- Instância única e encerramento limpo.
- Sincronização/cache dos dados essenciais do Tarkov com fallback local.
- Visão Geral enxuta.
- Catálogo de Quests com busca e filtro por mapa.
- Mapa Interativo com SVG local, marcadores essenciais, filtros, andares quando suportados, zoom/pan e horário Tarkov.
- Tratamento de erro sem derrubar o restante do aplicativo.
- Baixo uso de recursos quando ocioso.
- Nenhum watcher, servidor ou processo de desenvolvimento instalado/iniciado automaticamente.

## Fora da V0.1 — ideias preservadas
### V0.2
- Boss Radar completo.
- Progresso de quests mais detalhado e cadeia/pré-requisitos.
- “O que fazer agora?” por mapa.
- Melhorias de calibração e tratamento dos poucos outliers de mapas.
- Guia de chaves ligado a quests/mapas.
- Refinamentos de Raid Mode.

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
- Nada de hardcode de conteúdo que possa vir da fonte de dados.
- Sem polling pesado; cache e atualização sob demanda/intervalos conservadores.
- Scripts de diagnóstico/teste ficam fora da raiz do produto.
- O PC principal não é ambiente de desenvolvimento.
