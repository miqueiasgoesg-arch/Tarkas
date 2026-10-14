(()=>{
 const entries=[
 ['Escolha um comerciante','Choose a trader','Elige un comerciante'],['Toque no comerciante para abrir sua linha de missões.','Tap a trader to open their quest line.','Toca un comerciante para abrir su línea de misiones.'],['QUADRO DE MISSÕES','QUEST BOARD','TABLERO DE MISIONES'],['Buscar comerciante ou missão','Search trader or quest','Buscar comerciante o misión'],['Todas as missões','All quests','Todas las misiones'],['Comerciantes','Traders','Comerciantes'],['← Comerciantes','← Traders','← Comerciantes'],['Em andamento','In progress','En curso'],['Pronto para a próxima incursão?','Ready for the next raid?','¿Listo para la próxima incursión?'],['STATUS DO OPERADOR','OPERATOR STATUS','ESTADO DEL OPERADOR'],['Escolha uma missão, prepare o mapa e mantenha o seu progresso organizado sem carregar telas desnecessárias.','Choose a quest, prepare the map and keep your progress organized.','Elige una misión, prepara el mapa y organiza tu progreso.'],['NÍVEL PMC','PMC LEVEL','NIVEL PMC'],['Editar nível','Edit level','Editar nivel'],['EM ANDAMENTO','IN PROGRESS','EN CURSO'],['DISPONÍVEIS','AVAILABLE','DISPONIBLES'],['CONCLUÍDAS','COMPLETED','COMPLETADAS'],['LEMBRETES','REMINDERS','RECORDATORIOS'],['PRÓXIMA AÇÃO','NEXT ACTION','PRÓXIMA ACCIÓN'],['RAID RÁPIDA','QUICK RAID','INCURSIÓN RÁPIDA'],['PROGRESSO DO OPERADOR','OPERATOR PROGRESS','PROGRESO DEL OPERADOR'],['Abrir missão','Open quest','Abrir misión'],['Planejar no mapa','Plan on map','Planificar en el mapa'],['Preparar incursão','Prepare raid','Preparar incursión'],['Escolha sua primeira missão','Choose your first quest','Elige tu primera misión'],['Abra Missões para ver o que está disponível no seu nível.','Open Quests to see what is available at your level.','Abre Misiones para ver lo disponible en tu nivel.'],['Ativar missão','Activate quest','Activar misión'],['Concluir missão','Complete quest','Completar misión'],['Ver requisitos','View requirements','Ver requisitos'],['Preparar no mapa','Plan on map','Planificar en el mapa'],['OBJETIVOS DA INCURSÃO','RAID OBJECTIVES','OBJETIVOS DE LA INCURSIÓN'],['Nenhuma missão encontrada.','No quests found.','No se encontraron misiones.'],['Ajuste os filtros ou altere seu nível na Visão Geral.','Adjust filters or change your level in Overview.','Ajusta los filtros o cambia tu nivel en Resumen.'],['Acessar no celular','Open on phone','Abrir en el móvil'],['Tarkas no celular','Tarkas on your phone','Tarkas en tu móvil'],['Ativar acesso','Enable access','Activar acceso'],['Desativar acesso','Disable access','Desactivar acceso'],['Fechar','Close','Cerrar'],['Conecte o celular ao mesmo Wi-Fi deste PC. O Tarkas precisa permanecer aberto.','Connect your phone to the same Wi-Fi as this PC. Keep Tarkas open.','Conecta el móvil al mismo Wi-Fi que el PC. Mantén Tarkas abierto.'],['Acesso pelo Wi-Fi desativado.','Wi-Fi access is disabled.','Acceso por Wi-Fi desactivado.'],['Aponte a câmera do celular para o QR Code e toque no link que aparecer:','Point your phone camera at the QR code and tap the link:','Apunta la cámara al código QR y toca el enlace:']
 ];
 const originals=new WeakMap();
 const attributes=new WeakMap();
 const base=window.tarkasI18n.translateUi;
 function translated(value,language){
  const entry=entries.find(row=>row[0]===value);if(entry)return entry[language==='en'?1:2];
  const match=value.match(/^(.*?) — Missões$/);if(match)return match[1]+(language==='en'?' — Quests':' — Misiones');
  if(/^Disponíveis no nível \d+$/.test(value))return value.replace('Disponíveis no nível',language==='en'?'Available at level':'Disponibles en el nivel');
  return value;
 }
 window.tarkasI18n.translateUi=(language,root=document.body)=>{
  const lang=window.tarkasI18n.normalize(language),walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()){
   const node=walker.currentNode;if(node.parentElement?.closest('script,style'))continue;
   const current=node.nodeValue,previous=originals.get(node),source=previous&&previous.rendered===current?previous.source:current;
   const output=lang==='pt-BR'?source:source.replace(source.trim(),translated(source.trim(),lang));
   if(output!==current)node.nodeValue=output;originals.set(node,{source,rendered:output});nodes.push(node);
  }
  const changed=[];
  root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(element=>{
   const saved=attributes.get(element)||{};
   for(const key of ['placeholder','aria-label','title']){const current=element.getAttribute(key);if(current===null)continue;const previous=saved[key],source=previous&&previous.rendered===current?previous.source:current;const output=lang==='pt-BR'?source:translated(source,lang);element.setAttribute(key,output);saved[key]={source,rendered:output};changed.push([element,key,saved]);}attributes.set(element,saved);
  });
  if(lang!=='pt-BR')base(language,root);
  for(const node of nodes)originals.get(node).rendered=node.nodeValue;
  for(const [element,key,saved] of changed)saved[key].rendered=element.getAttribute(key);
 };
})();
