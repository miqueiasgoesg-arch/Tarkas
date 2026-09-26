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
