# Changelog — Projeto Tarkas

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
