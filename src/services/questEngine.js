const {readCache}=require('./tarkovData');
const {mapDetail,decoratePosition}=require('./mapEngine');
function payload(mode,name){const c=readCache(mode,name);return c?.data?.data||c?.data||{}}
function dict(mode,name,key){const d=payload(mode,name);return d[key]||d}
function list(mode,name,key){return Object.values(dict(mode,name,key)||{})}
function idx(xs){return new Map(xs.map(x=>[x.id,x]))}
function trans(mode,name){return payload(mode,name+'_pt')||{}}
function tr(map,key,fallback){return (typeof key==='string'&&map[key])||fallback||key||''}
function questCatalog(mode='regular'){
 const tasks=list(mode,'tasks','tasks'),maps=idx(list(mode,'maps','maps')),traders=idx(list(mode,'traders'));const tt=trans(mode,'tasks'),mt=trans(mode,'maps'),rt=trans(mode,'traders');
 return tasks.map(t=>{const m=maps.get(t.map),r=traders.get(t.trader);const mapName=m?tr(mt,m.name,m.name):'Any';const traderName=r?tr(rt,r.name,r.name):t.trader;
 return{id:t.id,name:tr(tt,t.name,t.normalizedName||t.name),normalizedName:t.normalizedName||'',level:t.minPlayerLevel||1,trader:traderName,map:mapName,mapId:t.map||null,
 objectives:(t.objectives||[]).map(o=>({id:o.id,type:o.type,description:tr(tt,o.description,o.description),count:o.count||1,foundInRaid:!!o.foundInRaid,maps:(o.maps||[]).map(id=>{const x=maps.get(id);return x?tr(mt,x.name,x.name):id}),mapIds:o.maps||[],zones:(o.zones||[]).filter(z=>z.position).map(z=>({mapId:z.map,position:z.position,outline:z.outline||[],y:z.position?.y??null})),possibleLocations:(o.possibleLocations||[]).map(x=>({mapId:x.map,positions:x.positions||[]}))})),
 requirements:(t.taskRequirements||[]).map(x=>({taskId:x.task,status:x.status||[]})),neededKeys:t.neededKeys||[],wikiLink:t.wikiLink||'',image:t.taskImageLink||''}})}
function questSummary(mode='regular'){const q=questCatalog(mode),maps={};for(const x of q)maps[x.map]=(maps[x.map]||0)+1;return{count:q.length,byMap:Object.entries(maps).sort((a,b)=>b[1]-a[1]),quests:q}}
function planQuests(mode='regular',progress=[],playerLevel=1){const qs=questCatalog(mode),status=new Map(progress.map(x=>[x.id,x.status]));const byId=new Map(qs.map(q=>[q.id,q]));return qs.map(q=>{let s=status.get(q.id);if(!s){const levelOk=playerLevel>=q.level;const reqOk=q.requirements.every(r=>status.get(r.taskId)==='completed');s=levelOk&&reqOk?'available':'locked'}return{...q,status:s,blockedBy:q.requirements.filter(r=>status.get(r.taskId)!=='completed').map(r=>byId.get(r.taskId)?.name||r.taskId)}})}
function raidPlan(mode='regular',mapName,progress=[],playerLevel=1){const map=mapName?mapDetail(mode,mapName):null,cal=map?.calibration||null;const qs=planQuests(mode,progress,playerLevel).filter(q=>['active','available'].includes(q.status)&&(!mapName||q.map===mapName||q.objectives.some(o=>o.maps.includes(mapName)))).map(q=>({...q,objectives:q.objectives.map(o=>({...o,zones:o.zones.map(z=>z.mapId===map?.id?{...z,position:decoratePosition(z.position,cal)}:z),possibleLocations:o.possibleLocations.map(l=>l.mapId===map?.id?{...l,positions:l.positions.map(p=>decoratePosition(p,cal))}:l)}))}));return{map:mapName||'Todos',quests:qs,objectiveCount:qs.reduce((n,q)=>n+q.objectives.length,0),keys:qs.flatMap(q=>q.neededKeys||[])}}
module.exports={questCatalog,questSummary,planQuests,raidPlan};
