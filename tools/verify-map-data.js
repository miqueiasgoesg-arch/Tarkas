const fs=require('fs');
const path=require('path');
const {maps,mapDetail}=require('../src/services/mapEngine');

const issues=[];
const catalog=maps('regular');
for(const entry of catalog){
  const detail=mapDetail('regular',entry.id);
  if(!detail){issues.push(entry.name+': detalhe indisponível');continue}
  if(detail.svgFile&&!fs.existsSync(path.join(__dirname,'..','assets','maps',detail.svgFile)))issues.push(entry.name+': base cartográfica ausente ('+detail.svgFile+')');
  if(detail.svgFile&&!detail.calibration)issues.push(entry.name+': base cartográfica sem calibração');
  const positions=[...detail.extracts.map(row=>row.position),...detail.spawns.map(row=>row.position),...detail.transits.map(row=>row.position),...detail.hazards.map(row=>row.position),...detail.locks.map(row=>row.position),...detail.switches.map(row=>row.position),...detail.stationaryWeapons.map(row=>row.position),...detail.btrStops.map(row=>row.position),...detail.lootClusters.map(row=>row.position),...detail.bosses.flatMap(boss=>boss.locations.flatMap(location=>location.positions))];
  if(detail.calibration&&positions.some(position=>position&&!position.projected&&!position.overlay))issues.push(entry.name+': posição sem projeção');
  const source=detail.svgFile?.endsWith('.json')?'planta raster local':detail.svgFile?'SVG vetorial local':'dados táticos';
  console.log(entry.name+' | '+source+' | '+positions.filter(Boolean).length+' posições');
}
if(issues.length){console.error('\nFalhas de integridade dos mapas:\n- '+issues.join('\n- '));process.exit(1)}
console.log('\nCobertura validada: '+catalog.length+' mapas.');
