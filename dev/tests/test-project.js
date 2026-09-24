const assert=require('assert');
const {projectPoint}=require('../../src/services/mapEngine');
const c=require('../../calibration-config.json');
for(const map of ['customs','factory','interchange','the-lab']){
  const projected=c[map].bounds.map(([x,z])=>projectPoint({x,z},c[map]));
  assert.strictEqual(projected.length,2,map);
  for(const point of projected){
    assert(Number.isFinite(point.x)&&Number.isFinite(point.y),`${map} must project finite coordinates`);
  }
  console.log(map,projected);
}
