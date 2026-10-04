const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs');
const path = require('path');
const { initDb,getDashboard,commandOverview,profileSummary,savedBuilds,saveBuild,shoppingList,addShoppingItem,completeShoppingItem,addBuildMissingToShopping,raidHistory,addRaidLog,goalsList,addGoal,completeGoal,mapPins,addMapPin,removeMapPin,favorites,toggleFavorite,stashItems,setStashItem,addReminder,completeReminder,toggleQuest,saveSetting,getSetting,playerLevel,questProgress,setQuestStatus,toggleObjective,objectiveProgress,raidKits,saveRaidKit,removeRaidKit,itemLocations,addItemLocation,removeItemLocation,exportProfile,importProfile } = require('./services/db');
const { syncCore, getStatus } = require('./services/tarkovData');
const { getBattlePassDocuments } = require('./services/battlePass');
const { questSummary, planQuests, raidPlan, kappaTracker } = require('./services/questEngine');
const { maps, mapDetail, projectPoint, pointLayer } = require('./services/mapEngine');
const { tarkovPair } = require('./services/gameClock');
const { catalog:armoryCatalog,details:armoryDetails } = require('./services/armory');
const { catalog:hideoutCatalog } = require('./services/hideout');
const { catalog:marketCatalog,details:marketDetails } = require('./services/market');
const { setDataRoot } = require('./shared/dataStorage');
let win; const svgCache=new Map();
const profileRegistryPath=()=>path.join(app.getPath('userData'),'profiles.json');
function loadProfiles(){try{const saved=JSON.parse(fs.readFileSync(profileRegistryPath(),'utf8'));if(Array.isArray(saved?.profiles)&&saved.profiles.length)return saved}catch{}return{activeId:'default',profiles:[{id:'default',name:'Principal',createdAt:new Date().toISOString()}]}}
function saveProfiles(registry){fs.writeFileSync(profileRegistryPath(),JSON.stringify(registry,null,2),'utf8')}
function activeProfile(){const registry=loadProfiles();const profile=registry.profiles.find(item=>item.id===registry.activeId)||registry.profiles[0];return{registry,profile}}
function profileList(){const {registry}=activeProfile();return registry.profiles.map(profile=>({...profile,active:profile.id===registry.activeId}))}
function createProfile(name){const title=String(name||'').trim().replace(/\s+/g,' ');if(!title||title.length>40)throw new Error('Informe um nome de até 40 caracteres');const {registry}=activeProfile();if(registry.profiles.length>=12)throw new Error('Limite de 12 perfis');const stem=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30)||'perfil';let id=stem,n=2;while(registry.profiles.some(profile=>profile.id===id))id=stem+'-'+n++;const profile={id,name:title,createdAt:new Date().toISOString()};registry.profiles.push(profile);registry.activeId=id;saveProfiles(registry);initDb(id);return profile}
function switchProfile(id){const {registry}=activeProfile(),profile=registry.profiles.find(item=>item.id===String(id));if(!profile)throw new Error('Perfil não encontrado');registry.activeId=profile.id;saveProfiles(registry);initDb(profile.id);return profile}
function updateProfileNickname(nickname){const clean=String(nickname||'').trim().replace(/\s+/g,' ');if(clean.length>32)throw new Error('Use um nickname de até 32 caracteres');const {registry,profile}=activeProfile();if(clean)profile.nickname=clean;else delete profile.nickname;saveProfiles(registry);return profile}
const avatarDirectory=()=>path.join(app.getPath('userData'),'profile-avatars');
const avatarMime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
function profileAvatar(){const {profile}=activeProfile(),file=String(profile.avatarFile||'');if(!file||path.basename(file)!==file)return null;const filePath=path.join(avatarDirectory(),file),extension=path.extname(file).toLowerCase(),mime=avatarMime[extension];if(!mime||!fs.existsSync(filePath))return null;try{return{dataUrl:'data:'+mime+';base64,'+fs.readFileSync(filePath).toString('base64')}}catch{return null}}
async function uploadProfileAvatar(){const choice=await dialog.showOpenDialog(win,{title:'Escolha a imagem do seu operador',properties:['openFile'],filters:[{name:'Imagens',extensions:['png','jpg','jpeg','webp']}]});if(choice.canceled||!choice.filePaths[0])return null;const source=choice.filePaths[0],extension=path.extname(source).toLowerCase();if(!avatarMime[extension])throw new Error('Formato de imagem não aceito');const stats=fs.statSync(source);if(stats.size>8*1024*1024)throw new Error('Use uma imagem de até 8 MB');const {registry,profile}=activeProfile();fs.mkdirSync(avatarDirectory(),{recursive:true});if(profile.avatarFile){const previous=path.join(avatarDirectory(),path.basename(profile.avatarFile));if(fs.existsSync(previous))fs.unlinkSync(previous)}profile.avatarFile=profile.id+'-'+Date.now()+extension;fs.copyFileSync(source,path.join(avatarDirectory(),profile.avatarFile));saveProfiles(registry);return profileAvatar()}
function removeProfileAvatar(){const {registry,profile}=activeProfile();if(profile.avatarFile){const filePath=path.join(avatarDirectory(),path.basename(profile.avatarFile));if(fs.existsSync(filePath))fs.unlinkSync(filePath);delete profile.avatarFile;saveProfiles(registry)}return true}
let updateState={status:'idle',version:null,progress:0,message:''};
const updateSnapshot=()=>({...updateState,currentVersion:app.getVersion(),enabled:app.isPackaged});
function sendUpdateState(){if(win&&!win.isDestroyed())win.webContents.send('update:state',updateSnapshot())}
function configureUpdates(){
  if(!app.isPackaged)return;
  autoUpdater.autoDownload=true;
  autoUpdater.autoInstallOnAppQuit=true;
  autoUpdater.on('checking-for-update',()=>{updateState={...updateState,status:'checking',message:'Verificando atualizações…'};sendUpdateState()});
  autoUpdater.on('update-available',info=>{updateState={...updateState,status:'downloading',version:info.version,progress:0,message:'Baixando atualização…'};sendUpdateState()});
  autoUpdater.on('download-progress',progress=>{updateState={...updateState,status:'downloading',progress:Math.round(progress.percent||0),message:'Baixando atualização…'};sendUpdateState()});
  autoUpdater.on('update-not-available',()=>{updateState={...updateState,status:'current',message:'O Tarkas já está atualizado.'};sendUpdateState()});
  autoUpdater.on('update-downloaded',info=>{updateState={...updateState,status:'ready',version:info.version,progress:100,message:'Atualização pronta para instalar.'};sendUpdateState()});
  autoUpdater.on('error',error=>{updateState={...updateState,status:'error',message:'Não foi possível verificar a atualização agora.'};console.warn('update check failed:',error.message);sendUpdateState()});
  setTimeout(()=>autoUpdater.checkForUpdates().catch(()=>{}),5000);
}
function createDesktopShortcut(){
  if(process.platform!=='win32'||!app.isPackaged)return{created:false,message:'O atalho fica disponível na versão instalada do Tarkas.'};
  const target=process.execPath,shortcut=path.join(app.getPath('desktop'),'Tarkas.lnk');
  const created=shell.writeShortcutLink(shortcut,'create',{target,workingDirectory:path.dirname(target),description:'Abrir Tarkas'});
  return{created,message:created?'Atalho criado na área de trabalho.':'Não foi possível criar o atalho agora.'};
}
function createWindow() {
  win = new BrowserWindow({ title: 'Tarkas', width: 1440, height: 900, minWidth: 1050, minHeight: 700,
    backgroundColor: '#0b0d0c', show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false } });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  ipcMain.removeHandler('map:svg'); ipcMain.handle('map:svg',(_e,file)=>{if(!/^[A-Za-z0-9.-]+\.svg$/.test(file||''))return null;if(svgCache.has(file))return svgCache.get(file);try{let s=require('fs').readFileSync(path.join(__dirname,'..','assets','maps',file),'utf8');s=s.replace(/<\?xml[^>]*>|<!--[^]*?-->/g,'').replace(/>\s+</g,'><').trim();svgCache.set(file,s);return s}catch{return null}});
  win.once('ready-to-show', () => win.show());
}
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-program-cache');
app.commandLine.appendSwitch('disk-cache-size','1');
app.commandLine.appendSwitch('disable-features','DawnGraphiteCache');
const gotLock=app.requestSingleInstanceLock();
if(!gotLock){app.quit()}else{
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus()}});
app.whenReady().then(()=>{setDataRoot(path.join(app.getPath('userData'),'game-data'));const {profile}=activeProfile();initDb(profile.id);const last=getStatus().last;createWindow();configureUpdates();setTimeout(()=>createDesktopShortcut(),900);const age=last?.updatedAt?Date.now()-Date.parse(last.updatedAt):0;if(!last||age>6*60*60*1000)setTimeout(()=>syncCore('regular').catch(()=>{}),900);});
}
app.on('window-all-closed',()=>app.quit());
ipcMain.handle('dashboard:get',()=>getDashboard());
ipcMain.handle('profiles:list',()=>profileList());
ipcMain.handle('profiles:current',()=>({...activeProfile().profile,...profileSummary()}));
ipcMain.handle('profiles:create',(_e,name)=>createProfile(name));
ipcMain.handle('profiles:switch',(_e,id)=>switchProfile(id));
ipcMain.handle('profiles:nickname',(_e,nickname)=>updateProfileNickname(nickname));
ipcMain.handle('profile:avatar',()=>profileAvatar());
ipcMain.handle('profile:avatar:upload',()=>uploadProfileAvatar());
ipcMain.handle('profile:avatar:remove',()=>removeProfileAvatar());
ipcMain.handle('command:overview',()=>commandOverview());
ipcMain.handle('kits:list',()=>raidKits()); ipcMain.handle('kits:save',(_e,name,items)=>saveRaidKit(name,items)); ipcMain.handle('kits:remove',(_e,id)=>removeRaidKit(id));
ipcMain.handle('profile:export',async()=>{const profile=activeProfile().profile;const choice=await dialog.showSaveDialog(win,{title:'Salvar backup do Tarkas',defaultPath:'tarkas-'+profile.id+'-backup.json',filters:[{name:'Backup do Tarkas',extensions:['json']} ]});if(choice.canceled||!choice.filePath)return null;fs.writeFileSync(choice.filePath,JSON.stringify(exportProfile(),null,2),'utf8');return choice.filePath});
ipcMain.handle('profile:import',async()=>{const choice=await dialog.showOpenDialog(win,{title:'Restaurar backup do Tarkas',properties:['openFile'],filters:[{name:'Backup do Tarkas',extensions:['json']}]});if(choice.canceled||!choice.filePaths[0])return false;const incoming=JSON.parse(fs.readFileSync(choice.filePaths[0],'utf8'));const recoveryDir=path.join(app.getPath('userData'),'restore-backups');fs.mkdirSync(recoveryDir,{recursive:true});const recoveryFile=path.join(recoveryDir,'antes-da-restauracao-'+Date.now()+'.json');fs.writeFileSync(recoveryFile,JSON.stringify(exportProfile(),null,2),'utf8');importProfile(incoming);return {restored:true,recoveryFile}});
ipcMain.handle('builds:list',()=>savedBuilds());
ipcMain.handle('builds:save',(_e,name,weaponId,weaponName,notes,items)=>saveBuild(name,weaponId,weaponName,notes,items));
ipcMain.handle('shopping:list',()=>shoppingList());
ipcMain.handle('shopping:add',(_e,name,quantity)=>addShoppingItem(name,quantity));
ipcMain.handle('shopping:complete',(_e,id)=>completeShoppingItem(id));
ipcMain.handle('builds:shopping-missing',(_e,id)=>addBuildMissingToShopping(id));
ipcMain.handle('raids:list',()=>raidHistory());
ipcMain.handle('raids:add',(_e,map,result,summary,loot,kills)=>addRaidLog(map,result,summary,loot,kills));
ipcMain.handle('goals:list',()=>goalsList());
ipcMain.handle('goals:add',(_e,title,kind)=>addGoal(title,kind));
ipcMain.handle('goals:complete',(_e,id)=>completeGoal(id));
ipcMain.handle('pins:list',(_e,map)=>mapPins(map));
ipcMain.handle('pins:add',(_e,map,label,note,x,z)=>addMapPin(map,label,note,x,z));
ipcMain.handle('pins:remove',(_e,id)=>removeMapPin(id));
ipcMain.handle('favorites:list',()=>favorites());
ipcMain.handle('favorites:toggle',(_e,id,name,kind)=>toggleFavorite(id,name,kind));
ipcMain.handle('stash:list',()=>stashItems());
ipcMain.handle('stash:set',(_e,id,name,qty)=>setStashItem(id,name,qty));
ipcMain.handle('reminder:add',(_e,title,dueAt)=>addReminder(title,dueAt));
ipcMain.handle('reminder:complete',(_e,id)=>completeReminder(id));
ipcMain.handle('quest:toggle',(_e,id)=>toggleQuest(id));
ipcMain.handle('setting:save',(_e,key,value)=>{if(key==='playerLevel'){const n=Number(value);if(!Number.isInteger(n)||n<1||n>79)throw new Error('Nível deve estar entre 1 e 79');value=n}return saveSetting(key,value)});
ipcMain.handle('setting:get',(_e,key,fallback)=>getSetting(key,fallback));
ipcMain.handle('player:level',()=>playerLevel());
ipcMain.handle('data:sync',(_e,mode)=>syncCore(mode));
ipcMain.handle('data:status',()=>getStatus());
ipcMain.handle('battlepass:documents',()=>getBattlePassDocuments());
ipcMain.handle('armory:catalog',(_e,mode)=>armoryCatalog(mode));
ipcMain.handle('armory:detail',(_e,mode,id)=>armoryDetails(mode,id));
ipcMain.handle('hideout:catalog',(_e,mode)=>hideoutCatalog(mode));
ipcMain.handle('market:catalog',(_e,mode)=>marketCatalog(mode));
ipcMain.handle('market:detail',(_e,mode,id)=>marketDetails(mode,id));
ipcMain.handle('item-locations:list',(_e,itemId)=>itemLocations(itemId));
ipcMain.handle('item-locations:add',(_e,itemId,itemName,mapName,area,note)=>addItemLocation(itemId,itemName,mapName,area,note));
ipcMain.handle('item-locations:remove',(_e,id)=>removeItemLocation(id));
ipcMain.handle('quests:catalog',(_e,mode)=>questSummary(mode));
ipcMain.handle('kappa:tracker',(_e,mode)=>kappaTracker(mode,questProgress()));
ipcMain.handle('progress:get',()=>({quests:questProgress(),objectives:objectiveProgress()}));
ipcMain.handle('progress:quest',(_e,id,status)=>setQuestStatus(id,status));
ipcMain.handle('progress:objective',(_e,id,questId)=>toggleObjective(id,questId));
ipcMain.handle('quests:planned',(_e,mode,level)=>planQuests(mode,questProgress(),level??playerLevel()));
ipcMain.handle('raid:plan',(_e,mode,map,level,focusQuestId)=>raidPlan(mode,map,questProgress(),level??playerLevel(),focusQuestId||''));
ipcMain.handle('maps:list',(_e,mode)=>maps(mode));
ipcMain.handle('maps:detail',(_e,mode,id)=>mapDetail(mode,id));
ipcMain.handle('map:project',(_e,mode,id,position)=>{const m=mapDetail(mode,id);if(!m?.calibration)return null;return{point:projectPoint(position,m.calibration),floor:pointLayer(position,m.calibration)}});
ipcMain.handle('clock:tarkov',()=>tarkovPair());
ipcMain.handle('update:status',()=>updateSnapshot());
ipcMain.handle('update:check',async()=>{if(!app.isPackaged)return updateSnapshot();await autoUpdater.checkForUpdates().catch(()=>{});return updateSnapshot()});
ipcMain.handle('shortcut:desktop',()=>createDesktopShortcut());
ipcMain.handle('update:install',()=>{if(updateState.status!=='ready')return false;updateState={...updateState,status:'installing',message:'Instalando atualização e reiniciando o Tarkas…'};sendUpdateState();setTimeout(()=>autoUpdater.quitAndInstall(true,true),250);return true});
