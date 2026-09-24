const https=require('https'),fs=require('fs'),path=require('path');
const {writeData,readData,metaFile}=require('../shared/dataStorage'); const BASE='https://json.tarkov.dev';
const MODES=new Set(['regular','pve','pvp-season']);
function getJson(url){return new Promise((resolve,reject)=>{const q=https.get(url,{headers:{'User-Agent':'Projeto-Tarkas/0.1'}},r=>{let body='',size=0,settled=false;const fail=e=>{if(!settled){settled=true;reject(e)}};if(r.statusCode<200||r.statusCode>299){r.resume();return fail(new Error('HTTP '+r.statusCode))}r.on('data',chunk=>{size+=chunk.length;if(size>30*1024*1024){q.destroy(new Error('resposta muito grande'));return}body+=chunk});r.once('error',fail);r.once('end',()=>{if(settled)return;try{const json=JSON.parse(body);settled=true;resolve(json)}catch(e){fail(e)}})});q.setTimeout(12000,()=>q.destroy(new Error('timeout')));q.once('error',reject)})}
function write(m,n,d){writeData(m,n,d)}
function readCache(m,n){return readData(m,n)}
async function endpoint(m,n){if(!MODES.has(m))m='regular';const e=await getJson(BASE+'/'+m+'/'+n);write(m,n,e);return e}
async function syncCore(mode='regular'){const names=['tasks','maps','traders','items','hideout'];const out={mode,locale:'pt',updatedAt:new Date().toISOString(),ok:[],failed:[]};const results=await Promise.all(names.map(async name=>{try{await endpoint(mode,name);const ok=[name];try{await endpoint(mode,name+'_pt');ok.push(name+'_pt')}catch{}return{ok,failed:[]}}catch(error){return{ok:[],failed:[{name,error:error.message}]}}}));for(const result of results){out.ok.push(...result.ok);out.failed.push(...result.failed)}const meta=metaFile('last-sync.json');fs.mkdirSync(path.dirname(meta),{recursive:true});fs.writeFileSync(meta,JSON.stringify(out,null,2));return out}
function getStatus(){let last=null;try{last=JSON.parse(fs.readFileSync(metaFile('last-sync.json'),'utf8'))}catch{}return{source:'json.tarkov.dev',last}}
module.exports={syncCore,getStatus,readCache};
