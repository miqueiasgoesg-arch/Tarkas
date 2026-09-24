
const fs=require('fs');
const p="D:\\DESENVOLVIMENTO\\Projeto-Tarkas\\src\\renderer\\app.js";
let s=fs.readFileSync(p,'utf8');
s=s.replace("async function raid(){const ms=await window.tarkas.maps('regular');","async function raid(){const ms=await window.tarkas.maps('regular');const cache=new Map();let renderToken=0;");
s=s.replace("const draw=async()=>{const id=document.querySelector('#raidmap').value;if(!id)return;const m=await window.tarkas.mapDetail('regular',id),svgRaw=m.svgFile?await window.tarkas.mapSvg(m.svgFile):null,showX=",
"const draw=async()=>{const id=document.querySelector('#raidmap').value;if(!id)return;const token=++renderToken;let pack=cache.get(id);if(!pack){const m=await window.tarkas.mapDetail('regular',id);const svgRaw=m.svgFile?await window.tarkas.mapSvg(m.svgFile):null;const x=await window.tarkas.raidPlan('regular',m.name,1);pack={m,svgRaw,x};cache.set(id,pack)}if(token!==renderToken)return;const {m,svgRaw,x}=pack,showX=");
s=s.replace("const level=1,x=await window.tarkas.raidPlan('regular',m.name,level);if(showQ)","if(showQ)");
fs.writeFileSync(p,s);
console.log('patched',s.includes('const cache=new Map()'),s.includes('const {m,svgRaw,x}=pack'));
