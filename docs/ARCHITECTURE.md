# Projeto Tarkas — Arquitetura multiplataforma

Meta: um Tarkas, vários dispositivos: Windows Desktop + Web/PWA responsiva.

## Princípios
- Shared Core não depende de Electron.
- Dados globais do jogo ficam separados do progresso do usuário.
- Sincronização usa mudanças versionadas por entidade e backend plugável.
- Desktop pode ficar minimizado/ocioso durante raid enquanto celular/PWA funciona como segunda tela.
- Sem polling pesado ou renderização contínua em background.
- Credenciais e autorização ficam no backend, nunca no cliente.

## Clientes
- Windows Desktop: Electron, cache local e integração com tray.
- Web/PWA: interface responsiva usando o mesmo domínio e progresso.
- Futuro mobile nativo pode consumir o mesmo Shared Core/API.
