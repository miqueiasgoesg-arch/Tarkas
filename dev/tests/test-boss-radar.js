const path=require('path');
const {setDataRoot}=require('../../src/shared/dataStorage');
setDataRoot(path.join(__dirname,'..','..','.tarkas-data'));
const {mapDetail}=require('../../src/services/mapEngine');
for(const slug of ['customs','factory','reserve']){
 const map=mapDetail('regular',slug);
 if(!map?.bosses?.length)throw new Error(slug+': radar sem bosses');
 for(const boss of map.bosses){
  if(!boss.mob||!boss.name||!Number.isFinite(boss.chance))throw new Error(slug+': ficha de boss incompleta');
  if(!Array.isArray(boss.locations)||!Array.isArray(boss.escorts))throw new Error(slug+': detalhes de boss incompletos');
 }
 console.log(slug,{bosses:map.bosses.length,withPositions:map.bosses.filter(x=>x.locations.some(l=>l.positions.length)).length});
}
