const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { initDb,getDashboard,toggleQuest,saveSetting,questProgress,setQuestStatus,toggleObjective,objectiveProgress } = require('./services/db');
const { syncCore, getStatus } = require('./services/tarkovData');
const { questSummary, planQuests, raidPlan } = require('./services/questEngine');
const { maps, mapDetail, projectPoint, pointLayer } = require('./services/mapEngine');
const { tarkovPair } = require('./services/gameClock');
const { setDataRoot } = require('./shared/dataStorage');
let win; let tray; const svgCache=new Map();
function createWindow() {
  win = new BrowserWindow({ width: 1440, height: 900, minWidth: 1050, minHeight: 700,
    backgroundColor: '#0b0d0c', show: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false } });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  ipcMain.removeHandler('map:svg'); ipcMain.handle('map:svg',(_e,file)=>{if(!/^[A-Za-z0-9.-]+\.svg$/.test(file||''))return null;if(svgCache.has(file))return svgCache.get(file);try{let s=require('fs').readFileSync(path.join(__dirname,'..','assets','maps',file),'utf8');s=s.replace(/<\?xml[^>]*>|<!--[^]*?-->/g,'').replace(/>\s+</g,'><').trim();svgCache.set(file,s);return s}catch{return null}});
  win.once('ready-to-show', () => win.show());
  win.on('close', e => { if (!app.isQuitting) { e.preventDefault(); win.hide(); } });
  win.on('hide',()=>{try{win.webContents.setBackgroundThrottling(true)}catch{}});
}
function createTray() {
  tray = new Tray(nativeImage.createEmpty()); tray.setToolTip('Projeto Tarkas');
  tray.setContextMenu(Menu.buildFromTemplate([{ label:'Abrir Tarkas',click:()=>{win.show();win.focus()}},{type:'separator'},{label:'Sair',click:()=>{app.isQuitting=true;app.quit()}}]));
  tray.on('double-click',()=>win.show());
}
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-gpu-program-cache');
app.commandLine.appendSwitch('disk-cache-size','1');
app.commandLine.appendSwitch('disable-features','DawnGraphiteCache');
const gotLock=app.requestSingleInstanceLock();
if(!gotLock){app.quit()}else{
app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus()}});
app.whenReady().then(()=>{setDataRoot(path.join(app.getPath('userData'),'game-data'));initDb();createWindow();createTray();setTimeout(()=>syncCore('regular').catch(()=>{}),1500);});
}
app.on('window-all-closed',e=>e.preventDefault());
ipcMain.handle('dashboard:get',()=>getDashboard());
ipcMain.handle('quest:toggle',(_e,id)=>toggleQuest(id));
ipcMain.handle('setting:save',(_e,key,value)=>saveSetting(key,value));
ipcMain.handle('data:sync',(_e,mode)=>syncCore(mode));
ipcMain.handle('data:status',()=>getStatus());
ipcMain.handle('quests:catalog',(_e,mode)=>questSummary(mode));
ipcMain.handle('progress:get',()=>({quests:questProgress(),objectives:objectiveProgress()}));
ipcMain.handle('progress:quest',(_e,id,status)=>setQuestStatus(id,status));
ipcMain.handle('progress:objective',(_e,id,questId)=>toggleObjective(id,questId));
ipcMain.handle('quests:planned',(_e,mode,level)=>planQuests(mode,questProgress(),level));
ipcMain.handle('raid:plan',(_e,mode,map,level)=>raidPlan(mode,map,questProgress(),level));
ipcMain.handle('maps:list',(_e,mode)=>maps(mode));
ipcMain.handle('maps:detail',(_e,mode,id)=>mapDetail(mode,id));
ipcMain.handle('map:project',(_e,mode,id,position)=>{const m=mapDetail(mode,id);if(!m?.calibration)return null;return{point:projectPoint(position,m.calibration),floor:pointLayer(position,m.calibration)}});
ipcMain.handle('clock:tarkov',()=>tarkovPair());
