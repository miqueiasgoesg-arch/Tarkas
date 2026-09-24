# Projeto Tarkas — Estado atual

Atualizado: 24/09/2026

## Regra de continuidade
Este arquivo deve ser atualizado em checkpoints relevantes. Antes de retomar em outra máquina/sessão, conferir este estado + Git. Notebook é preferencial; PC principal é fallback automático e vice-versa. Não executar o mesmo desenvolvimento simultaneamente nas duas máquinas.

## Prioridade
V0.1 funcional e estável antes de refinamentos. tarkov.dev é a fonte principal para dados do jogo; não duplicar manualmente informação estruturada disponível na fonte.

## Estado atual
- Versão: 0.1.1.
- UI principal: Visão Geral, Quests, Mapa Interativo.
- Player level persistente.
- Quest Engine: 515 quests, nível/pré-requisitos/progresso Ativar-Concluir.
- Quests agora possuem “Como fazer” usando dados reais do tarkov.dev.
- Auditoria: 1.441 objetivos e 1.441 traduções PT; 608 zonas; 319 possible-location positions; 15.179 referências de itens; catálogo com 5.442 itens.
- Guia de quest mostra objetivo, quantidade, found-in-raid, opcional, mapas e nomes dos itens quando disponíveis.
- Quest → Mapa implementado.
- Map Engine local com SVG, layers, zoom/pan, extrações, spawns, bosses e objetivos.
- Labs validado: 3 níveis, 6 extrações, 1 trânsito, 15 switches posicionados; switches ainda não são camada visual na UI.
- Battle Pass/documents: não inventar; integrar somente com fonte confiável/estruturada.

## Build atual
- Arquivo: dist/Tarkas-0.1.1-Windows.exe
- Tamanho: 355041270 bytes
- Gerado: 24/09/2026 19:11:02
- SHA-256: e4a03b3fb904a9dbe95f01b3a25a0242942acfc2a81e94ab4d6fe966de8cd111
- Build repetido em ambiente limpo: electron-builder concluiu com exit code 0 em 28,34 s. O erro ENOENT anterior não se repetiu.
- Smoke test do portátil recém-gerado: abriu no notebook com 4 processos Tarkas/Electron e encerrou sem processos órfãos.
- Build tecnicamente aprovado; falta validação visual do novo guia de quests antes da promoção final.

## Últimos commits importantes
- cc10e6f v0.1.1-portable-smoke-verified
- c0f764a v0.1.1-quest-howto
- daa614b v0.1.1-quest-guide-data

## Próximos passos
1. Validar visualmente “Como fazer” e Quest → Mapa.
2. Build limpo com exit code 0 concluído.
3. Reexecutar testes/audit.
4. Atualizar checklist e gerar hash final.
5. Copiar release final para Google Drive e depois PC principal.
6. Refinamentos posteriores: switches Labs visíveis, ícone próprio e documentação Battle Pass quando fonte confiável estiver disponível.
