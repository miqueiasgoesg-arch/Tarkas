# Projeto Tarkas — Estado atual

Atualizado: 14/10/2026. Máquina oficial: MgoesPC.

## Candidata 0.7.19
- package.json, package-lock.json e VERSION unificados em 0.7.19.
- Instalador/portátil gerados; 0.7.19 instalada em AppData/Local/Programs/Tarkas.
- Correções locais anteriores preservadas: Missões, Mercado/Arsenal, Mapas e Tarkovinho.

## Celular pelo Wi-Fi
- Servidor ativado explicitamente, link com chave temporária e QR Code gerado no PC.
- Perfil ativo, missões, favoritos e configurações compartilhados com o SQLite do PC.
- Layout, navegação e logo corrigidos; usuário aprovou funcionamento no aparelho real.
- Acesso exige PC/Tarkas ligados. Sem PWA offline, nuvem ou acesso com PC desligado.
- Tarkovinho usa armazenamento do navegador de cada aparelho.

## Missões e comerciantes
- Entrada por comerciante, retratos dos 11 traders, busca/status/paginação e retorno.
- Atalhos preservam foco de missão; ativação/conclusão atualizam estado e filtros.
- Recuperação de erros e isolamento de respostas atrasadas preservados.
- Retratos remotos têm alternativa de iniciais em falha.

## Mercado, Arsenal e documentos
- Catálogo incremental, ordenação, favoritos e preservação de filtros.
- Fichas ignoram respostas antigas; nova tentativa e proteção contra clique duplicado.
- Validação com catálogo sincronizado real: 504 missões, 5.476 itens e 8 documentos.
- Battle Pass registra inventário; não calcula tiers sem fonte estruturada.

## Mapas 2.0
- Cartografia do Tarkov.dev em janela reutilizável e alternativa no navegador.
- Planejamento local reúne objetivos, documentos/itens e chaves.
- 13 destinos online renderizados e capturas conferidas; Factory noturna usa alias.
- Tempo até mapa visível nesta execução: aproximadamente 4–8 segundos por destino.
- Tratamento offline, navegação cancelada e respostas antigas validados por testes.
- Camadas/andares/marcadores são do provedor; não desenhar coordenadas inventadas.

## Tarkovinho
- Arsenal, estoque, mochila, consumíveis, extração, morte e rollback testados.
- IA respeita visão/memória, aviso de tiro, colisão e rotas por obstáculos.
- Armas/antebraços articulados pelo ângulo, torso redesenhado e cabeça/pernas preservadas.
- Inimigos deixam de mirar na posição oculta do jogador ao perder visão.
- Recuo, clarão, rastros, impactos, passos e timbres por arma implementados.
- Avaliação humana de dificuldade, som e acabamento artístico continua pendente.

## Idiomas
- PT/EN/ES na navegação e fluxos atuais de Visão Geral/Missões/acesso móvel.
- Tradução reversível ao trocar idioma; nomes oficiais preservados.
- Textos editoriais extensos e mensagens dinâmicas ainda têm trechos em português.

## Validação e proteção de dados
- Check de sintaxe/dados aprovado; 27 testes da validação consolidada aprovados.
- Teste adicional com sincronização real aprovado, sem alterar dados do usuário.
- Backup fechado cobre SQLite, perfis, avatares, cache e armazenamento local.
- Backup 20261014-100014-400: 260 arquivos verificados por SHA-256.
- Pit Stop e Sinal Verde aprovados; sem dependência do notebook.
- App empacotado passou: versão, perfis existentes, painel, Wi-Fi, QR e atalho.
- Atualizador validado com eventos simulados; publicação GitHub em fechamento.

## Próximos passos
1. Instalação aprovada; 4 bancos SQLite idênticos ao backup e perfis preservados.
2. Salvar checkpoint Git, publicar release e abrir pelo atalho normal.
3. Obter feedback humano específico do minigame e dos trechos editoriais.

Histórico anterior preservado em docs/ARCHIVE/PROJECT-STATE-before-0.7.19-20261014.md.