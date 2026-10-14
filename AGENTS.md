# Projeto Tarkas — instruções do agente

- Todo Codex roda no PC `MgoesPC`.
- Pasta oficial: `D:\DESENVOLVIMENTO\Projeto-Tarkas`.
- Notebook `MGOES-NOTE` = laboratório/testes auxiliares; não executar Codex nele.
- Ler `docs/PROJECT-STATE.md` antes de mudanças importantes.
- Verificar `git status` e commits recentes antes de alterar código.
- Preservar o trabalho existente e fazer mudanças pequenas, testáveis e reversíveis.
- Manter `docs/PROJECT-STATE.md`, `docs/ROADMAP.md` e `docs/CHANGELOG.md` atualizados.
- O aplicativo no PC deve funcionar mesmo com o notebook desligado.
- Não depender de servidor, porta, processo, compartilhamento ou caminho do notebook.
- Rodar `tools/PitStop.ps1` e testes antes de releases.
- Exigir Sinal Verde antes de considerar uma release pronta.
- Preferir executável/atalho simples no PC.

## Modo EconÃ´mico Codex [NICK-ECONOMY-2026-09-26]
- Ler docs/CODEX-ECONOMY.md antes de iniciar tarefa Codex.
- Receber escopo fechado e parar quando os critÃ©rios de aceite forem atingidos.
- NÃ£o explorar melhorias extras, nÃ£o reler histÃ³rico sem necessidade e nÃ£o gerar builds intermediÃ¡rias.
- Usar testes direcionados durante o desenvolvimento e validaÃ§Ã£o completa somente no fechamento.
- Ignorar node_modules/dist/build/backups/logs/caches/mÃ­dias/dados salvo necessidade explÃ­cita.
- Manter PROJECT-STATE.md conciso; histÃ³ria antiga vai para CHANGELOG/ARCHIVE.
- Resposta final curta: AlteraÃ§Ãµes | Testes | Problemas | PrÃ³ximo passo.

## Economia Desktop Commander [NICK-DESKTOP-COMMANDER-ECONOMY-V1]
- Desktop Commander Ã© recurso remoto limitado; usar somente quando acesso real Ã  mÃ¡quina for necessÃ¡rio.
- Planejamento, brainstorming, critÃ©rios de aceite e desenho do pacote devem ser concluÃ­dos antes da primeira chamada remota.
- Agrupar leituras com mÃºltiplos arquivos e evitar reler conteÃºdo jÃ¡ conhecido.
- Preferir um patch/lote coerente a vÃ¡rias microalteraÃ§Ãµes remotas.
- Rodar testes direcionados durante o lote e check/suÃ­te completa apenas uma vez no fechamento.
- Evitar restart, smoke test, git status e validaÃ§Ãµes repetidas apÃ³s cada microalteraÃ§Ã£o; fazer um fechamento Ãºnico quando seguro.
- NÃ£o usar Desktop Commander para tarefas que podem ser resolvidas sem acesso ao PC.
- Reaproveitar scripts determinÃ­sticos locais para diagnÃ³stico, build, QA e release.
- Manter reserva mensal para recuperaÃ§Ã£o, rollback, launcher quebrado, release blocker e incidentes.
- Com <=15% das chamadas mensais restantes: congelar evoluÃ§Ã£o remota nÃ£o crÃ­tica e trabalhar por pacotes finais consolidados.
- Com <=5% restantes: usar apenas para emergÃªncia, recuperaÃ§Ã£o, bloqueio real de release ou entrega final indispensÃ¡vel.
- Nunca consumir a reserva apenas para "prossseguir" em polimento incremental sem impacto claro.
- Meta: menos chamadas, mais trabalho Ãºtil por chamada, sem reduzir testes de seguranÃ§a ou integridade.
