# Tarkas no celular pelo Wi-Fi

1. Abra a versão de desenvolvimento com `npm.cmd start` no PC MgoesPC.
2. Clique em **Acessar no celular**, no topo, e depois em **Ativar acesso**.
3. Conecte o celular à mesma rede do PC, aponte a câmera para o QR Code e toque no link que aparecer. O link escrito permanece disponível como alternativa.
4. Mantenha o Tarkas e o PC ligados durante o uso. Para encerrar, clique em **Desativar acesso**.

O link contém uma chave de acesso que permite ler e alterar seu progresso. Compartilhe apenas com pessoas autorizadas. A chave muda a cada ativação e o servidor não inicia automaticamente. Não encaminhe a porta pelo roteador para a internet.

Missões, favoritos, inventário e configurações usam o SQLite do perfil ativo no PC. Se você trocar de perfil no PC, o celular também passa a usar esse perfil nas próximas operações; recarregue a página depois da troca. Telas abertas não recebem atualização automática: navegue novamente ou recarregue para ver alterações feitas no outro aparelho.

O Tarkovinho salva sua economia no navegador de cada aparelho. Backup/restauração, troca/criação de perfis, envio de avatar, instalação e atualizações devem ser feitos no PC. Mapas externos abrem no navegador do celular; use Voltar para retornar ao Tarkas.

Se não conectar, confirme a rede Wi-Fi, escolha o endereço da interface conectada e confira o firewall do Windows: permita o Tarkas/Electron somente na rede privada. Redes de convidados podem bloquear comunicação entre aparelhos. A porta é escolhida automaticamente e pode mudar ao reativar o acesso.

Este acesso local usa HTTP: funciona no navegador, mas não oferece instalação PWA com service worker nem uso offline. Acesso pela internet com o PC desligado exige outra entrega.

O QR Code é gerado localmente com [node-qrcode](https://github.com/soldair/node-qrcode); seu link de acesso não é enviado a um gerador online.

Missões começam por cartões dos comerciantes. Toque em Prapor, Therapist ou outro comerciante para ver suas missões e use **Comerciantes** para voltar. Busca, situação, carregamento em lotes e foco de missão continuam disponíveis.

Validação: testes HTTP de chave, origem, operações bloqueadas, gravação compartilhada, arquivos, travessia de diretório e renovação da chave; teste Electron com perfil temporário, QR correspondente ao link completo, layout em 360/390/430/768px, logo, missões por comerciante e escrita SQLite compartilhada. Conferência física do novo layout e leitura pela câmera pendentes. Nenhum instalador gerado.
