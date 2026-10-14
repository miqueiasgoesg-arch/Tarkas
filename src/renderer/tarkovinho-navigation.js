(function(root){
 // Small visibility graph: obstacle corners instead of a per-frame tile grid.
 function clear(a,b,boxes){
  for(const box of boxes){
   let low=0,high=1;
   for(const axis of ['x','y']){
    const delta=b[axis]-a[axis],min=box[axis],max=min+(axis==='x'?box.w:box.h);
    if(Math.abs(delta)<1e-9){if(a[axis]<min||a[axis]>max){low=2;break}}
    else{let first=(min-a[axis])/delta,last=(max-a[axis])/delta;if(first>last)[first,last]=[last,first];low=Math.max(low,first);high=Math.min(high,last)}
   }
   if(low<=high)return false;
  }return true;
 }
 function route(start,target,obstacles,width,height,radius=12){
  const boxes=obstacles.map(o=>({x:o.x-radius,y:o.y-radius,w:o.w+radius*2,h:o.h+radius*2}));
  const valid=p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=radius&&p.x<=width-radius&&p.y>=radius&&p.y<=height-radius&&clear(p,p,boxes);
  if(!valid(start)||!valid(target))return [];
  if(clear(start,target,boxes))return [{x:target.x,y:target.y}];
  const nodes=[{x:start.x,y:start.y},{x:target.x,y:target.y}];
  for(const box of boxes)for(const x of [box.x-2,box.x+box.w+2])for(const y of [box.y-2,box.y+box.h+2])if(valid({x,y}))nodes.push({x,y});
  const distance=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),visited=new Set();distance[0]=0;
  for(let count=0;count<nodes.length;count++){
   let current=-1;
   for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(current<0||distance[i]<distance[current]))current=i;
   if(current<0||!Number.isFinite(distance[current]))break;
   if(current===1){const result=[];for(let i=1;i!==0;i=previous[i])result.unshift(nodes[i]);return result}
   visited.add(current);
   for(let i=0;i<nodes.length;i++){
    if(visited.has(i)||!clear(nodes[current],nodes[i],boxes))continue;
    const candidate=distance[current]+Math.hypot(nodes[current].x-nodes[i].x,nodes[current].y-nodes[i].y);
    if(candidate<distance[i]){distance[i]=candidate;previous[i]=current}
   }
  }return [];
 }
 const api={route,clear};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TarkovinhoNavigation=api;
})(typeof globalThis==='undefined'?this:globalThis);
