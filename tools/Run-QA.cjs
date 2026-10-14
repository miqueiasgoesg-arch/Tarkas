const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
const results=[];
function run(file,electron=false){
 const result=cp.spawnSync(electron?require('electron'):process.execPath,[file],{cwd:root,env,encoding:'utf8',windowsHide:true,timeout:120000});
 const entry={file,passed:result.status===0&&!result.error,exitCode:result.status,output:(result.stdout||'')+(result.stderr||''),error:result.error?.message};results.push(entry);
 console.log((entry.passed?'PASS ':'FAIL ')+file);if(!entry.passed)console.log(entry.output,entry.error||'');
}
for(const file of fs.readdirSync(path.join(root,'dev/tests')).filter(name=>name.endsWith('.js')).sort())run('dev/tests/'+file);
for(const file of ['tools/test-map-window.cjs','tools/test-tarkovinho.cjs','tools/test-tarkovinho-navigation.cjs','tools/test-mobile-server.cjs','tools/test-update-flow.cjs'])run(file);
for(const file of ['tools/test-market-browser.cjs','tools/test-tarkovinho-browser.cjs','tools/test-mobile-browser.cjs','tools/test-real-browser.cjs','tools/test-map-integration.cjs'])run(file,true);
fs.mkdirSync(path.join(root,'logs'),{recursive:true});fs.writeFileSync(path.join(root,'logs/qa-final.json'),JSON.stringify({time:new Date().toISOString(),results},null,2));
console.log(results.filter(x=>x.passed).length+'/'+results.length+' approved');if(results.some(x=>!x.passed))process.exitCode=1;
