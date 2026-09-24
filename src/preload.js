const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('tarkas', {
  dashboard:()=>ipcRenderer.invoke('dashboard:get'),
  toggleQuest:id=>ipcRenderer.invoke('quest:toggle',id),
  saveSetting:(key,value)=>ipcRenderer.invoke('setting:save',key,value),
  syncData:mode=>ipcRenderer.invoke('data:sync',mode),
  dataStatus:()=>ipcRenderer.invoke('data:status'),
  questCatalog:mode=>ipcRenderer.invoke('quests:catalog',mode),
  progress:()=>ipcRenderer.invoke('progress:get'),
  setQuestStatus:(id,status)=>ipcRenderer.invoke('progress:quest',id,status),
  toggleObjective:(id,questId)=>ipcRenderer.invoke('progress:objective',id,questId),
  plannedQuests:(mode,level)=>ipcRenderer.invoke('quests:planned',mode,level),
  raidPlan:(mode,map,level)=>ipcRenderer.invoke('raid:plan',mode,map,level),
  maps:mode=>ipcRenderer.invoke('maps:list',mode),
  mapDetail:(mode,id)=>ipcRenderer.invoke('maps:detail',mode,id),
  mapSvg:file=>ipcRenderer.invoke('map:svg',file),
  mapProject:(mode,id,position)=>ipcRenderer.invoke('map:project',mode,id,position),
  tarkovClock:()=>ipcRenderer.invoke('clock:tarkov')
});
