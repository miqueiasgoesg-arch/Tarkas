# Mapas 2.0 — reconstrução completa

## Objetivo

Substituir a tela atual de mapa por uma experiência estável, didática e centrada
na leitura de uma raid. A referência de interação é o padrão de painel lateral,
camadas e filtros do Tarkov.dev, mas o Tarkas não copiará sua interface nem
inventará dados de localização.

## Princípios

- Um mapa deve abrir rapidamente e continuar responsivo ao alternar filtros.
- O jogador escolhe uma camada de cada vez; o mapa nunca precisa mostrar tudo.
- Cada marcador tem fonte, tipo, andar e uma ficha explicando o que fazer.
- Rotas são anotações pessoais ou trajetos explicitamente marcados como
  indicativos. O app não afirma que uma rota é segura.
- Nenhuma funcionalidade interage com o jogo, lê memória, cria overlay no jogo,
  radar, ESP ou automação.

## Estrutura da tela

1. **Barra lateral persistente**
   - busca de local, quest, chave ou item;
   - andares e subsolos;
   - grupos expansíveis: extrações, perigos, landmarks, loot, itens localizáveis,
     documentos, chaves, spawns, bosses, switches e pontos pessoais;
   - contador por grupo e botão para limpar todos os filtros.
2. **Canvas de mapa isolado**
   - SVG do mapa com grupos de andares;
   - zoom, pan e centralizar sem recriar a página;
   - renderização de marcadores em camada própria, sem observadores globais;
   - painel de detalhes ao selecionar um marcador.
3. **Barra de contexto**
   - mapa, duração da raid, condições relevantes e estado do plano atual;
   - alerta de fonte e data da última sincronização.
4. **Planejamento**
   - objetivo em foco, requisitos, portas/chaves e saída;
   - rota pessoal salva no perfil, com pontos numerados e remoção individual.

## Entregas em ordem

## Estado atual de implementação

- **Cobertura local:** 12 dos 14 mapas possuem SVG local; Factory à Noite usa a
  mesma planta calibrada de Factory. Labirinto e Icebreaker funcionam no modo
  tático de dados, sem planta visual redistribuída.
- **Camadas verificadas:** extrações por facção, spawns, objetivos, documentos,
  bosses, perigos, switches, transições, paradas BTR, portas/acessos, armas
  estacionárias e zonas de loot agrupado.
- **Interação:** filtros exclusivos, busca, andares, zoom/pan, rota sugerida,
  rota pessoal, detalhes de marcador e painel lateral fixo.
- **Proteção de release:** `npm run check` valida sintaxe, SVGs, calibração e
  todas as coordenadas estruturadas antes de gerar um pacote.

### Critérios para encerrar a atualização

1. Revisão visual manual no build Windows dos 14 mapas, incluindo troca rápida,
   zoom, pan, filtros, andares, busca, documentos e rotas.
2. Revisar landmarks e loot solto quando a fonte local passar a fornecer nomes e
   posições compatíveis.
3. Adicionar plantas de Labirinto e Icebreaker somente após obter uma fonte que
   permita redistribuição, crédito e licença compatível.

### A. Fundação estável

- Extrair o mapa para um módulo próprio com ciclo de vida explícito: criar,
  atualizar e destruir.
- Remover a dependência de vários `MutationObserver` na tela de mapa.
- Criar contrato de camadas: `floor`, `category`, `subCategory`, `source`,
  `position`, `label` e `details`.
- Selecionar Customs como mapa piloto.

### B. Leitura tática

- Painel lateral em árvore com filtros independentes.
- Andares, subsolo e opacidade das camadas SVG.
- Busca que centraliza um resultado sem exibir todos os demais marcadores.
- Detalhes didáticos para objetivo, documento, chave, porta, extração e perigo.

### C. Conteúdo verificado

- Portas e chaves vinculadas às quests.
- Documentos e Battle Pass com localização destacada.
- Stashes, loot e pontos de interesse somente quando a fonte possuir
  coordenadas compatíveis e revisadas.
- Indicação visível da origem e da data dos dados.

### D. Expansão

- Replicar o padrão aprovado em Customs para os outros mapas.
- Adicionar modos iniciante, quest e planejamento de raid.
- Avaliar compartilhamento de plano somente após a experiência individual estar
  estável.

## Fontes e licença

Os SVGs comunitários de `the-hideout/tarkov-dev-svg-maps` são a base de
referência permitida: são modulares por andares e elementos. Todo uso deve
preservar atribuição e a licença CC BY-NC-SA 4.0. O Tarkas deve manter o
arquivo `docs/ATTRIBUTIONS.md` atualizado.
