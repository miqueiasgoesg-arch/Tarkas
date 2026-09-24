const assert=require('assert');
const {pointLayer}=require('./src/services/mapEngine');
const c=require('./calibration-config.json');
const cases=[
  ['factory',{x:0,y:-2,z:0},'Basement'],
  ['factory',{x:0,y:4,z:0},'Second_Floor'],
  ['factory',{x:0,y:7,z:0},'Third_Floor'],
  ['streets-of-tarkov',{x:0,y:-7,z:0},'Underground_Level'],
  ['streets-of-tarkov',{x:0,y:17,z:0},'Third_Floor']
];
for(const [map,position,expected] of cases){
  const floor=pointLayer(position,c[map]);
  assert.strictEqual(floor,expected,`${map} y=${position.y}`);
  console.log(map,position.y,floor);
}
