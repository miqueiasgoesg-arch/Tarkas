# Projeto Tarkas — Plano de versões

## Regra atual
Prioridade absoluta: **V0.1 funcionando > refinamentos > novas funcionalidades**.
O MGOES-NOTE é a máquina preferencial de desenvolvimento. Se estiver indisponível, o PC principal pode assumir automaticamente; o inverso também vale. Antes de trocar de máquina, conferir o estado do projeto e evitar processos duplicados.

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
- Boss Radar completo.
- Progresso de quests mais detalhado e cadeia/pré-requisitos avançados.
- “O que fazer agora?” por mapa.
- Melhorias de calibração e tratamento dos poucos outliers de mapas.
- Guia de chaves ligado a quests/mapas.
- Refinamentos de Raid Mode e camada de switches.
- Battle Pass/documentos somente quando houver fonte estruturada e confiável.

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
