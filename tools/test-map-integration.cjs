const {app,BrowserWindow}=require('electron');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'tarkas-map-integration-'));
app.setPath('userData',root);
const report=JSON.parse(fs.readFileSync(path.join(__dirname,'../logs/real-data-qa.json'),'utf8'));fs.cpSync(report.dataRoot,path.join(root,'game-data'),{recursive:true});
require('../src/main');
app.whenReady().then(async()=>{
 try{
  const main=BrowserWindow.getAllWindows()[0];if(main.webContents.isLoading())await new Promise(resolve=>main.webContents.once('did-finish-load',resolve));
  assert.equal(await main.webContents.executeJavaScript("window.tarkas.openMapWindow('the-lab')"),true);
  const map=BrowserWindow.getAllWindows().find(window=>window.id!==main.id);map.hide();map.webContents.setBackgroundThrottling(false);
  map.webContents.on('did-fail-load',(_event,code,description,url,isMainFrame)=>console.log('Map failure:',code,description,url,isMainFrame));
  const wait=async predicate=>{for(let i=0;i<150;i++){if(await predicate())return;await new Promise(resolve=>setTimeout(resolve,150))}throw new Error('Map integration timeout')};
  await wait(()=>map.webContents.executeJavaScript("Boolean(document.querySelector('.leaflet-container'))"));
  const zoom=await map.webContents.executeJavaScript("(()=>{const button=document.querySelector('.leaflet-control-zoom-in');if(!button)return false;button.click();return true})()");assert.equal(zoom,true);
  map.setMinimumSize(300,300);map.setContentSize(390,844);map.showInactive();await map.webContents.executeJavaScript('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  assert.equal(await map.webContents.executeJavaScript('innerWidth'),390);
  fs.writeFileSync(path.join(__dirname,'../logs/map-mobile-lab.png'),(await map.webContents.capturePage()).toPNG());
  map.hide();
  await map.webContents.session.clearCache();
  await map.webContents.session.clearStorageData({origin:'https://tarkov.dev',storages:['serviceworkers','cachestorage']});
  await map.webContents.session.enableNetworkEmulation({offline:true});
  await main.webContents.executeJavaScript("window.tarkas.openMapWindow('customs')");
  console.log('Offline navigation started');
  await wait(()=>map.webContents.executeJavaScript("document.body.innerText.includes('Não foi possível carregar o mapa agora.') || Boolean(document.querySelector('.leaflet-container'))"));
  const offlineState=map.webContents.getURL().startsWith('data:')?'recovery-page':'cached-map';
  if(offlineState==='cached-map')assert.ok(await map.webContents.executeJavaScript("document.body.innerText.includes('Big Red')"));
  await map.webContents.session.enableNetworkEmulation({offline:false});
  await main.webContents.executeJavaScript("window.tarkas.openMapWindow('factory-night')");
  await wait(()=>Promise.resolve(map.webContents.getURL().includes('/map/factory?')));assert.equal(BrowserWindow.getAllWindows().length,2);
  console.log('PASS real map window: online Lab, zoom, 390px, offline='+offlineState+', night Factory alias and window reuse.');app.exit(0);
 }catch(error){const map=BrowserWindow.getAllWindows().find(window=>window.webContents.getURL().includes('tarkov.dev')||window.webContents.getURL().startsWith('data:'));if(map){console.log('Current map URL:',map.webContents.getURL());console.log(await map.webContents.executeJavaScript('document.body.innerText.slice(0,450)').catch(()=>''))}console.error(error);app.exit(1)}
});
