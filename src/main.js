const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initDb,getDashboard,toggleQuest,saveSetting,getSetting,playerLevel,questProgress,setQuestStatus,toggleObjective,objectiveProgress } = require('./services/db');
const { syncCore, getStatus } = require('./services/tarkovData');
const { questSummary, planQuests, raidPlan } = require('./services/questEngine');
const { maps, mapDetail, projectPoint, pointLayer } = require('./services/mapEngine');
const { tarkovPair } = require('./services/gameClock');
const { setDataRoot } = require('./shared/dataStorage');
let win; const svgCache=new Map();
function createWindow() {
  win = new BrowserWindow({ width: 1440, height: 900, minWidth: 1050, minHeight: 700,
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
app.whenReady().then(async()=>{setDataRoot(path.join(app.getPath('userData'),'game-data'));initDb();const last=getStatus().last;if(!last){await syncCore('regular').catch(()=>{})}createWindow();const age=last?.updatedAt?Date.now()-Date.parse(last.updatedAt):0;if(last&&age>6*60*60*1000)setTimeout(()=>syncCore('regular').catch(()=>{}),2500);});
}
app.on('window-all-closed',()=>app.quit());
ipcMain.handle('dashboard:get',()=>getDashboard());
ipcMain.handle('quest:toggle',(_e,id)=>toggleQuest(id));
ipcMain.handle('setting:save',(_e,key,value)=>{if(key==='playerLevel'){const n=Number(value);if(!Number.isInteger(n)||n<1||n>79)throw new Error('Nível deve estar entre 1 e 79');value=n}return saveSetting(key,value)});
ipcMain.handle('setting:get',(_e,key,fallback)=>getSetting(key,fallback));
ipcMain.handle('player:level',()=>playerLevel());
ipcMain.handle('data:sync',(_e,mode)=>syncCore(mode));
ipcMain.handle('data:status',()=>getStatus());
ipcMain.handle('quests:catalog',(_e,mode)=>questSummary(mode));
ipcMain.handle('progress:get',()=>({quests:questProgress(),objectives:objectiveProgress()}));
ipcMain.handle('progress:quest',(_e,id,status)=>setQuestStatus(id,status));
ipcMain.handle('progress:objective',(_e,id,questId)=>toggleObjective(id,questId));
ipcMain.handle('quests:planned',(_e,mode,level)=>planQuests(mode,questProgress(),level??playerLevel()));
ipcMain.handle('raid:plan',(_e,mode,map,level,focusQuestId)=>raidPlan(mode,map,questProgress(),level??playerLevel(),focusQuestId||''));
ipcMain.handle('maps:list',(_e,mode)=>maps(mode));
ipcMain.handle('maps:detail',(_e,mode,id)=>mapDetail(mode,id));
ipcMain.handle('map:project',(_e,mode,id,position)=>{const m=mapDetail(mode,id);if(!m?.calibration)return null;return{point:projectPoint(position,m.calibration),floor:pointLayer(position,m.calibration)}});
ipcMain.handle('clock:tarkov',()=>tarkovPair());
