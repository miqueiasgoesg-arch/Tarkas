const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/main.js'),'utf8');
const events=new Map(),sent=[],timers=[];
let downloads=0,installArgs=null;
const ctx={updateState:null,app:{isPackaged:true,getVersion:()=> '0.7.18'},autoUpdater:{on:(event,fn)=>events.set(event,fn),checkForUpdates:async()=>{downloads++},quitAndInstall:(...args)=>installArgs=args},win:{isDestroyed:()=>false,webContents:{send:(_channel,state)=>sent.push(state)}},console,fetch:async()=>({ok:true,text:async()=> 'version: 0.7.19\n'}),setTimeout:fn=>timers.push(fn)};
vm.createContext(ctx);
vm.runInContext(source.slice(source.indexOf('let updateState='),source.indexOf('function createDesktopShortcut')),ctx);
(async()=>{
 assert.equal(vm.runInContext("compareVersions('0.7.19','0.7.18')",ctx),1);
 vm.runInContext('configureUpdates()',ctx);timers.shift()();await new Promise(resolve=>setImmediate(resolve));assert.equal(downloads,1);
 events.get('update-available')({version:'0.7.19'});assert.equal(sent.at(-1).status,'downloading');
 events.get('download-progress')({percent:49.8});assert.equal(sent.at(-1).progress,50);
 events.get('update-downloaded')({version:'0.7.19'});assert.equal(sent.at(-1).status,'ready');
 const install=source.slice(source.indexOf("ipcMain.handle('update:install'"));
 ctx.ipcMain={handle:(_channel,fn)=>ctx.install=fn};vm.runInContext(install,ctx);assert.equal(ctx.install(),true);timers.pop()();assert.deepEqual(installArgs,[true,true]);
 events.get('error')(new Error('offline'));await new Promise(resolve=>setImmediate(resolve));assert.ok(['error','manual'].includes(sent.at(-1).status));
 console.log('PASS: update comparison, availability, progress, ready, silent install with restart and manual fallback.');
})().catch(error=>{console.error(error);process.exitCode=1});
