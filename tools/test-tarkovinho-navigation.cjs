const assert=require('node:assert/strict'),{route,clear}=require('../src/renderer/tarkovinho-navigation');
const start={x:40,y:100},goal={x:260,y:100},obstacles=[{x:130,y:60,w:30,h:80}],radius=12;
const detour=route(start,goal,obstacles,300,220,radius);
assert.ok(detour.length>=3);assert.deepEqual(detour.at(-1),goal);
const inflated=obstacles.map(o=>({x:o.x-radius,y:o.y-radius,w:o.w+radius*2,h:o.h+radius*2}));
let previous=start;
for(const point of detour){assert.ok(clear(previous,point,inflated));assert.ok(point.x>=radius&&point.x<=288&&point.y>=radius&&point.y<=208);previous=point}
assert.deepEqual(route(start,goal,[],300,220),[goal]);
assert.deepEqual(route(start,goal,[{x:130,y:0,w:30,h:220}],300,220),[]);
assert.deepEqual(route({x:140,y:100},goal,obstacles,300,220),[]);
assert.deepEqual(route(start,{x:400,y:100},[],300,220),[]);
assert.deepEqual(route(start,start,[],300,220),[start]);
assert.deepEqual(route(start,goal,obstacles,300,220),detour);
console.log('PASS navigation: detour, radius clearance, walls, bounds, blocked spawn, stationary target and deterministic routes.');
