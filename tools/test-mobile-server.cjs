const assert=require('node:assert/strict'),path=require('node:path'),vm=require('node:vm');
const {createMobileServer}=require('../src/services/mobileServer');
(async()=>{
 const saved=new Map(),handlers=new Map([
  ['dashboard:get',()=>({quests:7})],
  ['setting:save',(_event,key,value)=>{saved.set(key,value);return true}],
  ['setting:get',(_event,key,fallback)=>saved.get(key)??fallback],
  ['profile:import',()=>{throw new Error('Must never execute')}]
 ]);
 const server=createMobileServer({handlers,rendererRoot:path.resolve(__dirname,'../src/renderer'),preloadPath:path.resolve(__dirname,'../src/preload.js')});
 try{
  assert.equal(server.status().enabled,false);
  const [state,again]=await Promise.all([server.start(),server.start()]);assert.deepEqual(state,again);assert.equal(state.enabled,true);
  assert.ok(state.urls.length,'A local network interface is required for this test');
  const link=new URL(state.urls[0]),base=`http://127.0.0.1:${link.port}`,token=new URLSearchParams(link.hash.slice(1)).get('access');
  const rpc=(channel,args=[],access=token,origin)=>fetch(base+'/api',{method:'POST',headers:{'Content-Type':'application/json','X-Tarkas-Access':access,...(origin?{Origin:origin}:{})},body:JSON.stringify({channel,args})});
  assert.equal((await rpc('dashboard:get',[],'')).status,401);
  assert.equal((await rpc('dashboard:get',[],token,'https://foreign.example')).status,403);
  assert.equal((await rpc('profile:import')).status,403);
  assert.equal((await rpc('unknown')).status,403);
  assert.deepEqual(await (await rpc('dashboard:get')).json(),{value:{quests:7}});
  await rpc('setting:save',['mobile-test','saved']);assert.equal((await (await rpc('setting:get',['mobile-test'])).json()).value,'saved');
  const html=await (await fetch(base)).text();assert.ok(html.indexOf('mobile-bridge.js')<html.indexOf('i18n.js'));
  assert.equal((await fetch(base+'/..%5cpreload.js')).status,404);
  assert.equal((await fetch(base+'/app.js')).status,200);
  assert.equal((await fetch(base+'/brand-logo.png')).status,200);
  assert.equal((await fetch(base+'/mobile.css')).status,200);
  assert.equal((await fetch(base+'/tarkovinho.html')).status,200);
  const bridge=await (await fetch(base+'/mobile-bridge.js')).text(),storage=new Map();
  const context={window:{},location:{hash:link.hash,pathname:'/',search:'',assign:url=>{context.destination=url}},URLSearchParams,sessionStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)},history:{replaceState:()=>{}},fetch:(url,options)=>fetch(base+url,options)};
  vm.runInNewContext(bridge,context);
  assert.equal((await context.window.tarkas.dashboard()).quests,7);
  await context.window.tarkas.saveSetting('bridge-test',42);assert.equal(await context.window.tarkas.getSetting('bridge-test'),42);
  assert.equal(await context.window.tarkas.openMapWindow('woods'),true);assert.equal(context.destination,'https://tarkov.dev/map/woods?lng=pt');
  assert.equal(await context.window.tarkas.openMapWindow('invalid'),false);
  await assert.rejects(context.window.tarkas.importProfile(),/PC/);
  await server.stop();assert.equal(server.status().enabled,false);
  const renewed=await server.start();assert.notEqual(renewed.urls[0],state.urls[0]);
  const newBase=new URL(renewed.urls[0]);assert.equal((await fetch(`http://127.0.0.1:${newBase.port}/api`,{method:'POST',headers:{'X-Tarkas-Access':token},body:'{}'})).status,401);
  console.log('Mobile server: authentication, origin, shared writes, bridge, assets, traversal, stop and key renewal passed.');
 }finally{await server.stop()}
})().catch(error=>{console.error(error);process.exitCode=1});
