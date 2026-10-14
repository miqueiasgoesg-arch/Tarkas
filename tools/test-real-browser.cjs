const {app,BrowserWindow}=require('electron');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'tarkas-real-browser-')),report=JSON.parse(fs.readFileSync(path.join(__dirname,'../logs/real-data-qa.json'),'utf8'));
app.setPath('userData',root);fs.cpSync(report.dataRoot,path.join(root,'game-data'),{recursive:true});
require('../src/main');
app.whenReady().then(async()=>{
 try{
  const win=BrowserWindow.getAllWindows()[0];if(win.webContents.isLoading())await new Promise(resolve=>win.webContents.once('did-finish-load',resolve));
  const run=code=>win.webContents.executeJavaScript(code);
  const wait=async code=>{for(let i=0;i<80;i++){if(await run(code))return;await new Promise(resolve=>setTimeout(resolve,50))}throw new Error('Timed out: '+code)};
  await wait("Boolean(document.querySelector('.command-hero'))");
  await run("document.querySelector('#nav [data-page=quests]').click()");await wait("document.querySelectorAll('.mission-trader').length>0");
  const traders=await run("[...document.querySelectorAll('.mission-trader')].map(b=>b.dataset.trader)");assert.ok(traders.length>=10);
  await run("document.querySelector('.mission-trader[data-trader=Prapor]').click()");assert.ok(await run("Boolean(document.querySelector('.mission-detail h3'))"));
  const selected=await run("document.querySelector('.mission-detail h3').textContent");
  await run("document.querySelector('.mission-search select').value='available';document.querySelector('.mission-search select').dispatchEvent(new Event('change'))");
  await run("document.querySelector('[data-detail=status]').click()");await wait("window.tarkas.progress().then(p=>p.quests.some(q=>q.status==='active'))");
  await run("document.querySelector('.mission-search select').value='active';document.querySelector('.mission-search select').dispatchEvent(new Event('change'))");assert.equal(await run("document.querySelector('[data-detail=status]').textContent"),'Concluir missão');
  await run("(async()=>{await market()})()");await wait("document.querySelectorAll('.market-item').length>0");assert.equal(await run("document.querySelectorAll('.market-item').length"),160);
  await run("document.querySelector('.market-item').click()");await wait("Boolean(document.querySelector('.market-detail h3'))");
  await run("(async()=>{await battlePass()})()");
  assert.equal((await run('window.tarkas.battlePassDocuments()')).length,8);
  await run("window.tarkas.saveSetting('battlePassDocumentCounts',JSON.stringify({'qa-document':7}))");assert.match(await run("window.tarkas.getSetting('battlePassDocumentCounts','{}')"),/7/);
  await run("document.querySelector('#nav [data-page=quests]').click()");await wait("document.querySelectorAll('.mission-trader').length>0");
  for(const [language,heading] of [['en','Choose a trader'],['es','Elige un comerciante'],['pt-BR','Escolha um comerciante']]){await run(`window.tarkasI18n.translateUi('${language}',document.getElementById('content'))`);assert.equal(await run("document.querySelector('.mission-command h2').textContent"),heading)}
  console.log('PASS: real synchronized catalog, '+traders.length+' traders, quest status, market detail, 8 documents, persistence and reversible PT/EN/ES. Quest example: '+selected);app.exit(0);
 }catch(error){console.error(error);app.exit(1)}
});
