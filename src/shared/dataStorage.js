const fs=require('fs'),path=require('path');
let root=null;
const dataCache=new Map();
function setDataRoot(p){root=p?path.resolve(p):null}
function getDataRoot(){if(root)return root;if(process.env.TARKAS_DATA_DIR)return path.resolve(process.env.TARKAS_DATA_DIR);try{const {app}=require('electron');if(app?.getPath&&app.isReady?.())return path.join(app.getPath('userData'),'game-data')}catch{}return path.join(process.cwd(),'.tarkas-data')}
function ensure(){const p=getDataRoot();fs.mkdirSync(p,{recursive:true});return p}
function dataFile(mode,name){return path.join(getDataRoot(),mode+'-'+name+'.json')}
function writeData(mode,name,data){ensure();const file=dataFile(mode,name);fs.writeFileSync(file,JSON.stringify({savedAt:new Date().toISOString(),data}));dataCache.delete(file)}
function readData(mode,name){const file=dataFile(mode,name);try{const stat=fs.statSync(file),stamp=stat.size+':'+stat.mtimeMs,cached=dataCache.get(file);if(cached?.stamp===stamp)return cached.value;const value=JSON.parse(fs.readFileSync(file,'utf8'));dataCache.set(file,{stamp,value});return value}catch{dataCache.delete(file);return null}}
function metaFile(name){return path.join(getDataRoot(),name)}
module.exports={setDataRoot,getDataRoot,ensure,dataFile,writeData,readData,metaFile};
