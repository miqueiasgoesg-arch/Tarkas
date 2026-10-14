const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),http=require('node:http'),assert=require('node:assert/strict');
const exe=process.argv[2];if(!exe)throw new Error('Pass the packaged Tarkas.exe path');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const probe=http.createServer();await new Promise(resolve=>probe.listen(0,'127.0.0.1',resolve));const port=probe.address().port;await new Promise(resolve=>probe.close(resolve));
 const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
 const child=cp.spawn(path.resolve(exe),['--remote-debugging-port='+port],{env,windowsHide:true,stdio:'pipe'});
 child.stderr.on('data',()=>{});child.stdout.on('data',()=>{});
 let socket;
 try{
  let pages;for(let i=0;i<150;i++){try{pages=await (await fetch(`http://127.0.0.1:${port}/json`)).json();if(pages.some(p=>p.type==='page'&&p.url.includes('index.html')))break}catch{}await pause(100)}
  const page=pages?.find(p=>p.type==='page'&&p.url.includes('index.html'));assert.ok(page,'Packaged app did not expose its renderer');
  socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
  let id=0;const pending=new Map();socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id&&pending.has(message.id)){const callback=pending.get(message.id);pending.delete(message.id);callback(message)}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;const timer=setTimeout(()=>{pending.delete(next);reject(new Error('CDP timeout: '+method))},15000);pending.set(next,message=>{clearTimeout(timer);if(message.error)reject(new Error(message.error.message));else resolve(message.result)});socket.send(JSON.stringify({id:next,method,params}))});
  const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value};
  for(let i=0;i<80;i++){if(await evaluate("Boolean(document.querySelector('.command-hero'))"))break;await pause(100)}
  const state=await evaluate('window.tarkas.updateStatus()');assert.equal(state.currentVersion,'0.7.19');assert.equal(state.enabled,true);
  const profiles=await evaluate('window.tarkas.profiles()');assert.ok(profiles.length);
  const dashboard=await evaluate('window.tarkas.dashboard()');assert.ok(Array.isArray(dashboard.reminders));
  const mobile=await evaluate('window.tarkas.startMobile()');assert.equal(mobile.enabled,true);assert.ok(mobile.urls.length);
  const qr=await evaluate('window.tarkas.mobileQr('+JSON.stringify(mobile.urls[0])+')');assert.match(qr,/^data:image\/png;base64,/);
  const url=new URL(mobile.urls[0]),key=new URLSearchParams(url.hash.slice(1)).get('access');
  const result=await (await fetch(`http://127.0.0.1:${url.port}/api`,{method:'POST',headers:{'Content-Type':'application/json','X-Tarkas-Access':key},body:JSON.stringify({channel:'dashboard:get',args:[]})})).json();assert.deepEqual(result.value,dashboard);
  await evaluate('window.tarkas.stopMobile()');
  const shortcut=await evaluate('window.tarkas.createDesktopShortcut()');assert.equal(shortcut.created,true);
  const screenshot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(__dirname,'../logs/packaged-smoke.png'),Buffer.from(screenshot.data,'base64'));
  const output={time:new Date().toISOString(),exe:path.resolve(exe),version:state.currentVersion,profiles:profiles.length,mobile:true,qr:true,shortcut:true};fs.writeFileSync(path.join(__dirname,'../logs/packaged-smoke.json'),JSON.stringify(output,null,2));
  console.log('PASS packaged: version, existing profiles, dashboard, mobile HTTP, QR and desktop shortcut.');
  await send('Browser.close').catch(()=>{});
  await Promise.race([new Promise(resolve=>child.once('exit',resolve)),pause(5000)]);
 }finally{socket?.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
