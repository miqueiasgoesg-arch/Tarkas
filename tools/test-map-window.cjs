const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../src/main.js'),'utf8');
const portion=source.slice(source.indexOf('const externalMapSlugs='),source.indexOf("ipcMain.handle('map:open-external'"));
let created=0;
class FakeWindow {
 constructor(options){created++;this.options=options;this.events={};this.urls=[];this.minimized=false;this.webContents={setWindowOpenHandler:fn=>this.popup=fn,on:(name,fn)=>this.events[name]=fn}}
 isDestroyed(){return false} isMinimized(){return this.minimized} restore(){this.minimized=false;this.restored=true}
 setMenuBarVisibility(){} show(){} focus(){} on(name,fn){this.events[name]=fn}
 loadURL(url){this.urls.push(url);return Promise.resolve()}
}
const ctx={BrowserWindow:FakeWindow,win:{},applicationIcon:'test',mapWindow:null};
vm.createContext(ctx);vm.runInContext(portion,ctx);
assert.equal(ctx.openMapWindow('https://evil.example'),false);assert.equal(created,0);
const slugs=['customs','factory','ground-zero','interchange','icebreaker','lighthouse','reserve','shoreline','streets-of-tarkov','terminal','the-lab','the-labyrinth','woods'];
for(const slug of slugs){assert.equal(ctx.openMapWindow(slug),true);assert.equal(ctx.mapWindow.urls.at(-1),'https://tarkov.dev/map/'+slug+'?lng=pt')}
assert.equal(created,1);
ctx.mapWindow.minimized=true;ctx.openMapWindow('night-factory');assert.equal(ctx.mapWindow.restored,true);
assert.equal(ctx.mapWindow.urls.at(-1),'https://tarkov.dev/map/factory?lng=pt');
assert.equal(ctx.mapWindow.options.webPreferences.nodeIntegration,false);
assert.equal(ctx.mapWindow.options.webPreferences.sandbox,true);
assert.equal(ctx.mapWindow.popup().action,'deny');
const count=ctx.mapWindow.urls.length,fail=ctx.mapWindow.events['did-fail-load'];
fail({},-3,'cancelled',ctx.mapWindow.tarkasMapUrl,true);assert.equal(ctx.mapWindow.urls.length,count);
fail({},-105,'offline','https://tarkov.dev/map/woods?lng=pt',true);assert.equal(ctx.mapWindow.urls.length,count);
fail({},-105,'offline',ctx.mapWindow.tarkasMapUrl,true);assert.ok(ctx.mapWindow.urls.at(-1).startsWith('data:text/html'));
console.log('PASS: 13 destinations, Factory alias, reuse, restore, isolation, aborted/stale loads and offline page.');
