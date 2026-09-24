const https=require('https'),fs=require('fs'),path=require('path');
const dir='D:/DESENVOLVIMENTO/Projeto-Tarkas/assets/maps';fs.mkdirSync(dir,{recursive:true});
const files=["Customs.svg","Factory.svg","GroundZero.svg","Interchange.svg","Labs.svg","Lighthouse.svg","Reserve.svg","Shoreline.svg","StreetsOfTarkov.svg","Terminal.svg","Woods.svg"];
function get(f){return new Promise((ok,no)=>{https.get('https://raw.githubusercontent.com/the-hideout/tarkov-dev-svg-maps/master/'+f,r=>{if(r.statusCode!==200)return no(new Error(f+' '+r.statusCode));const w=fs.createWriteStream(path.join(dir,f));r.pipe(w);w.on('finish',()=>w.close(ok))}).on('error',no)})}
(async()=>{for(const f of files){await get(f);console.log('OK',f)} })().catch(e=>{console.error(e);process.exit(1)});