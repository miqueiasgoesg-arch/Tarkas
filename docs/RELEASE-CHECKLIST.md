# Checklist obrigatório de release

## Integridade
- [ ] App abre sem erro.
- [ ] Funções principais testadas.
- [ ] Dados do usuário preservados.
- [ ] Backup criado antes de migrações importantes.
- [ ] Logs sem erro crítico novo.

## Independência
- [ ] Testado diretamente no PC de produção.
- [ ] Notebook desligado ou desconectado durante o teste.
- [ ] Sem caminho UNC/compartilhamento obrigatório.
- [ ] Sem servidor/processo obrigatório hospedado no notebook.
- [ ] Dependências necessárias presentes ou empacotadas.

## Distribuição
- [ ] VERSION atualizado.
- [ ] CHANGELOG atualizado.
- [ ] Build reproduzível.
- [ ] Executável/atalho simples disponível.
- [ ] Smoke test realizado na build final.

## Resultado
A release só recebe SINAL VERDE quando todos os itens obrigatórios estiverem atendidos.