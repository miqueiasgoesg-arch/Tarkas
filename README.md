# Tarkas

Companion desktop para organizar a progressão em Escape from Tarkov.

## Recursos

- Quests, nível do PMC e notas pessoais.
- Mapa interativo com zoom, pan e marcadores pessoais.
- Biblioteca de armas, munições, acessórios e comparação.
- Mercado com médias de 24 horas e filtro para itens sem cotação de flea.
- Hideout, compras, stash, builds, kits de raid, metas e lembretes.
- Backup e restauração do perfil local.

## Instalação

Baixe o instalador `Tarkas-Setup-<versão>-Windows.exe` na página de Releases.
O instalador preserva os dados locais do perfil entre atualizações.

## Desenvolvimento

Requer Node.js e npm. No diretório do projeto, execute:

```powershell
npm.cmd install
npm.cmd start
```

Para validar o código:

```powershell
npm.cmd run check
```

Os dados consultados do jogo usam cache local e são atualizados pelo próprio aplicativo.
