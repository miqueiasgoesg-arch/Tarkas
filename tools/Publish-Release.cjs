const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const repo='miqueiasgoesg-arch/Tarkas',root=path.resolve(__dirname,'..'),version=require('../package.json').version;
async function main(){
 const env={...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'never'};
 const credential=cp.spawnSync('git',['credential','fill'],{cwd:root,input:'protocol=https\nhost=github.com\n\n',env,encoding:'utf8',windowsHide:true});
 if(credential.status!==0)throw new Error('GitHub authentication unavailable; no credentials were printed or saved.');
 const token=credential.stdout.split('\n').find(line=>line.startsWith('password='))?.slice(9);if(!token)throw new Error('GitHub authentication unavailable');
 const headers={Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
 const api=async(url,options={})=>{const response=await fetch(url,{...options,headers:{...headers,...options.headers}});if(!response.ok)throw new Error('GitHub HTTP '+response.status);return response.status===204?null:response.json()};
 const info=await api('https://api.github.com/repos/'+repo);if(!info.permissions?.push)throw new Error('GitHub account cannot publish to this repository');
 if(process.argv.includes('--check-only')){console.log('GitHub publication access confirmed for '+repo);return;}
 const commit=cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true}).trim(),tag='v'+version;
 const existing=await fetch('https://api.github.com/repos/'+repo+'/releases/tags/'+tag,{headers});if(existing.status!==404)throw new Error('Release tag already exists or cannot be inspected; refusing to overwrite');
 const body=fs.readFileSync(path.join(root,'docs/RELEASE-'+version+'.md'),'utf8');
 const release=await api('https://api.github.com/repos/'+repo+'/releases',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tag_name:tag,target_commitish:commit,name:'Tarkas '+version,body,draft:true,prerelease:false})});
 const files=['Tarkas-Setup-'+version+'-Windows.exe','Tarkas-Setup-'+version+'-Windows.exe.blockmap','Tarkas-Portable-'+version+'-Windows.exe','latest.yml','SHA256-'+version+'.txt'];
 for(const file of files){const target=path.join(root,'dist',file);if(!fs.existsSync(target))throw new Error('Missing release artifact: '+file);await api(release.upload_url.replace(/\{.*$/,'')+'?name='+encodeURIComponent(file),{method:'POST',headers:{'Content-Type':'application/octet-stream','Content-Length':String(fs.statSync(target).size)},body:fs.createReadStream(target),duplex:'half'});console.log('Uploaded '+file)}
 const published=await api('https://api.github.com/repos/'+repo+'/releases/'+release.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({draft:false,make_latest:'true'})});
 fs.writeFileSync(path.join(root,'logs/published-release.json'),JSON.stringify({url:published.html_url,tag,commit,time:new Date().toISOString()},null,2));console.log('Published '+published.html_url);
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
