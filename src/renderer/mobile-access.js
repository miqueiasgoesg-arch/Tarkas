(()=>{
  const layout=document.createElement('link');layout.rel='stylesheet';layout.href='mobile.css';document.head.append(layout);
  if(location.protocol!=='file:' || !window.tarkas?.startMobile)return;
  const button=document.createElement('button');button.type='button';button.textContent='Acessar no celular';button.className='qaction';
  document.querySelector('main > header').append(button);
  const panel=document.createElement('dialog');
  panel.style.cssText='max-width:min(560px,85vw);max-height:90dvh;overflow:auto;background:#15221b;color:#e8eadf;border:1px solid #68745b;padding:24px;overflow-wrap:anywhere';
  panel.innerHTML='<h2>Tarkas no celular</h2><p>Conecte o celular ao mesmo Wi-Fi deste PC. O Tarkas precisa permanecer aberto.</p><p>O celular usa o perfil ativo do PC. Missões, favoritos e configurações são compartilhados; o progresso do Tarkovinho fica neste navegador.</p><div role="status"></div><div class="links"></div><p>Compartilhe o link apenas com quem pode alterar seu progresso. Se a conexão falhar, confira se a rede do Windows é privada e se o firewall permite o Tarkas nessa rede.</p><button class="qaction" data-action="toggle">Ativar acesso</button> <button class="qaction" data-action="close">Fechar</button>';
  document.body.append(panel);
  const status=panel.querySelector('[role=status]'),links=panel.querySelector('.links'),toggle=panel.querySelector('[data-action=toggle]');let enabled=false;
  let generation=0;
  function render(state){const version=++generation;enabled=state.enabled;toggle.textContent=enabled?'Desativar acesso':'Ativar acesso';status.textContent=enabled?'Aponte a câmera do celular para o QR Code e toque no link que aparecer:':'Acesso pelo Wi-Fi desativado.';links.replaceChildren();for(const url of state.urls){const row=document.createElement('section'),anchor=document.createElement('a'),image=document.createElement('img');row.className='mobile-connection';image.alt='QR Code para abrir o Tarkas no celular';image.width=264;image.height=264;image.hidden=true;anchor.href=url;anchor.textContent=url;anchor.style.color='#e2c171';row.append(image,anchor);links.append(row);window.tarkas.mobileQr(url).then(data=>{if(version!==generation)return;image.src=data;image.hidden=false}).catch(()=>{if(version===generation)status.textContent='Não foi possível gerar o QR Code. Use o link abaixo ou desative e ative novamente.'})}if(enabled&&!state.urls.length)status.textContent='Nenhuma conexão de rede encontrada. Conecte o PC ao Wi-Fi e abra este painel novamente.'}
  button.onclick=async()=>{panel.showModal();try{render(await window.tarkas.mobileStatus())}catch{status.textContent='Não foi possível consultar o acesso.'}};
  toggle.onclick=async()=>{toggle.disabled=true;try{render(await window.tarkas[enabled?'stopMobile':'startMobile']())}catch{status.textContent='Não foi possível alterar o acesso. Tente novamente.'}finally{toggle.disabled=false}};
  panel.querySelector('[data-action=close]').onclick=()=>panel.close();
})();
