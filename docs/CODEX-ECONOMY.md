# Modo Econômico Codex

Objetivo: máxima produtividade com o menor consumo de créditos possível.

## Regras obrigatórias
- Codex executa código, testes e alterações técnicas; planejamento/brainstorm deve chegar resolvido.
- Trabalhar somente no escopo solicitado. Não explorar melhorias extras sem bloqueio real.
- Preferir o modelo de menor custo capaz de cumprir a tarefa; reservar modelos caros para problemas difíceis.
- Ler primeiro AGENTS.md + estado atual. Não ler CHANGELOG, ARCHIVE, backups ou histórico salvo sem necessidade.
- Ignorar por padrão: node_modules, dist, build, backups, logs, caches, instaladores, mídias e dados do usuário.
- Agrupar alterações relacionadas em um único pacote.
- Durante desenvolvimento, executar testes direcionados; validação completa somente no fechamento do pacote.
- Não gerar instalador/portable/.exe a cada microalteração. Build completa apenas em checkpoint de release ou quando solicitada.
- Pit Stop, Sinal Verde, backups e diagnósticos determinísticos devem rodar por scripts locais, não por raciocínio de IA.
- Evitar agentes paralelos/delegados salvo quando o ganho for claramente maior que o custo.
- Resposta final curta: Alterações | Testes | Problemas | Próximo passo.
- Encerrar a tarefa assim que os critérios de aceite forem atendidos.

## Contexto
- PROJECT-STATE.md deve conter apenas estado atual, bloqueios e próximos passos.
- Meta: manter PROJECT-STATE.md curto (ideal <= 120 linhas).
- Histórico antigo vai para CHANGELOG.md ou docs/ARCHIVE/ quando necessário.
- Nenhum conhecimento crítico deve existir somente na conversa.
