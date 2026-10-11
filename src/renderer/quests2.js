/* Missões 2.0: transforma a linha curada em uma decisão prática de raid. */
(function(){
  const content=document.querySelector('#content');
  if(!content)return;

  const statusLabel={completed:'Concluída',active:'Em andamento',available:'Disponível',pending:'Pendente',locked:'Bloqueada'};
  const isMap=name=>name&&name!=='Any'&&name!=='Rota escolhida';

  async function addQuestLineBriefing(){
    const detail=document.querySelector('.quest-line-layout main');
    if(!detail||detail.dataset.lineBriefing)return;
    detail.dataset.lineBriefing='loading';
    try{
      const heading=detail.querySelector('h3')?.textContent?.trim();
      const lines=await window.tarkas.questLines('regular');
      const line=lines.find(entry=>entry.name===heading);
      if(!line||detail!==document.querySelector('.quest-line-layout main'))return;

      const lineSteps=line.quests.filter(quest=>quest.lineRole==='line');
      const next=lineSteps.find(quest=>quest.status==='active')||lineSteps.find(quest=>quest.status==='available')||lineSteps.find(quest=>quest.status!=='completed');
      const finale=[...lineSteps].reverse().find(quest=>quest.rewards?.length)||lineSteps.at(-1);
      const panel=document.createElement('section');
      panel.className='quest-line-briefing';
      panel.setAttribute('aria-label','Dossiê prático da linha '+line.name);

      const header=document.createElement('header');
      header.innerHTML='<div><small>DOSSIÊ DA LINHA</small><b></b><span></span></div><strong></strong>';
      header.querySelector('b').textContent=next?'Próxima etapa: '+next.name:'Linha concluída';
      header.querySelector('span').textContent=next?next.trader+' · nível '+next.level+' · '+(next.map||'sem mapa específico'):'Todas as etapas registradas foram concluídas neste perfil.';
      header.querySelector('strong').textContent=line.completed+'/'+line.total+' etapas';
      panel.append(header);

      const body=document.createElement('div');body.className='quest-line-briefing-body';
      const context=document.createElement('article');
      context.innerHTML='<small>COMO LER</small><p>O contexto explica a motivação da cadeia. A ordem, os níveis e os requisitos vêm do catálogo local sincronizado.</p>';
      body.append(context);

      const outcome=document.createElement('article');
      outcome.innerHTML='<small>DESFECHO / RECOMPENSA</small><p></p>';
      const rewards=(finale?.rewards||[]).slice(0,4).map(reward=>reward.label).join(' · ');
      outcome.querySelector('p').textContent=rewards?rewards:'A recompensa final não está detalhada pela fonte local. Abra a etapa para conferir os dados disponíveis.';
      body.append(outcome);

      const requirements=document.createElement('article');
      requirements.innerHTML='<small>REQUISITOS DA PRÓXIMA ETAPA</small><p></p>';
      const requirementList=[];
      for(const objective of next?.objectives||[]){
        const items=(objective.items||[]).map(item=>item.name).filter(name=>name&&!/^[a-f0-9-]{20,}$/i.test(name));
        if(items.length)requirementList.push((objective.count>1?objective.count+'× ':'')+items.join(', ')+(objective.foundInRaid?' · encontrado em raid':''));
      }
      const objectiveMaps=[...new Set((next?.objectives||[]).flatMap(objective=>objective.maps||[]).filter(isMap))];
      if(objectiveMaps.length)requirementList.push('Ação marcada em '+objectiveMaps.join(', '));
      requirements.querySelector('p').textContent=requirementList.length?requirementList.slice(0,3).join(' · '):'Esta etapa não exige item catalogado. Abra a missão para conferir a ação e as condições completas.';
      body.append(requirements);panel.append(body);

      if(next){
        const actions=document.createElement('div');actions.className='quest-line-briefing-actions';
        const openQuest=document.createElement('button');openQuest.type='button';openQuest.className='qaction';openQuest.textContent='Abrir esta missão';
        openQuest.onclick=()=>{document.querySelector('#nav button[data-page="quests"]')?.click();setTimeout(()=>{const search=document.querySelector('#qs');if(search){search.value=next.name;search.dispatchEvent(new Event('input'));search.focus()}},80)};
        actions.append(openQuest);
        if(isMap(next.map)){
          const openMap=document.createElement('button');openMap.type='button';openMap.className='qaction';openMap.textContent='Preparar '+next.map;
          openMap.onclick=()=>{document.querySelector('#nav button[data-page="mapa"]')?.click();setTimeout(()=>{const select=document.querySelector('#raidmap');const option=[...(select?.options||[])].find(item=>item.textContent===next.map);if(select&&option){select.value=option.value;select.dispatchEvent(new Event('change'))}},140)};
          actions.append(openMap);
        }
        const state=document.createElement('small');state.textContent='Estado: '+(statusLabel[next.status]||next.status);
        actions.append(state);panel.append(actions);
      }
      detail.querySelector('.quest-line-lore')?.insertAdjacentElement('afterend',panel);
      detail.dataset.lineBriefing='ready';
    }catch(error){
      console.warn('Tarkas quest-line briefing',error);
      detail.dataset.lineBriefing='error';
    }
  }

  function syncRoadmap(){
    const now=document.querySelector('.roadmap-now');
    if(!now||now.dataset.missionsRound)return;
    now.dataset.missionsRound='ready';
    const label=now.querySelector('b'),copy=now.querySelector('span'),action=now.querySelector('button');
    if(label)label.textContent='Missões 2.0 · linhas, lore e desbloqueios';
    if(copy)copy.textContent='O pacote atual conecta contexto, pré-requisitos e a próxima missão prática. Mapas 2.0 permanece como base concluída para objetivos verificáveis.';
    if(action){action.textContent='Abrir História';action.onclick=()=>document.querySelector('#nav button[data-page="story"]')?.click()}
    document.querySelectorAll('.roadmap-stage').forEach(stage=>{
      const title=stage.querySelector('h3')?.textContent||'',state=stage.querySelector('small');
      if(title.includes('Mapas 2.0')){stage.classList.remove('em-andamento');stage.classList.add('concluído');if(state)state.textContent='CONCLUÍDO'}
      if(/Linhas de missões|lore/i.test(title)){stage.classList.remove('planejado');stage.classList.add('em-andamento');if(state)state.textContent='EM ANDAMENTO'}
    });
  }

  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;addQuestLineBriefing();syncRoadmap()});
  });
  observer.observe(content,{childList:true,subtree:true});
  addQuestLineBriefing();
  syncRoadmap();

  const style=document.createElement('style');
  style.textContent=`.quest-line-briefing{margin:12px 0;border:1px solid #5d593a;background:linear-gradient(120deg,#1e1d12,#101610)}.quest-line-briefing header{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:13px 14px;border-bottom:1px solid #443f29}.quest-line-briefing header small,.quest-line-briefing header b,.quest-line-briefing header span{display:block}.quest-line-briefing header small,.quest-line-briefing article small{color:#e0bd58;font-size:9px;letter-spacing:1.1px}.quest-line-briefing header b{margin-top:4px;color:#f2ead1;font-size:14px}.quest-line-briefing header span{margin-top:3px;color:#aeb8a8;font-size:10px}.quest-line-briefing header strong{flex:none;padding:7px 9px;border:1px solid #4e613e;background:#132016;color:#bfe0a9;font:700 11px Consolas,monospace;white-space:nowrap}.quest-line-briefing-body{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:10px}.quest-line-briefing article{padding:10px;border:1px solid #333f31;background:#0c110d}.quest-line-briefing article p{margin:5px 0 0;color:#c3cbc0;font-size:10px;line-height:1.5}.quest-line-briefing-actions{display:flex;align-items:center;flex-wrap:wrap;gap:7px;padding:0 10px 10px}.quest-line-briefing-actions .qaction{margin:0}.quest-line-briefing-actions small{margin-left:auto;color:#aeb9a9;font-size:10px}@media(max-width:800px){.quest-line-briefing-body{grid-template-columns:1fr}}@media(max-width:620px){.quest-line-briefing header{align-items:flex-start;flex-direction:column}.quest-line-briefing-actions small{width:100%;margin-left:0}}`;
  document.head.append(style);
})();
