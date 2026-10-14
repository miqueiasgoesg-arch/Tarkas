const {app,BrowserWindow}=require('electron');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
app.setPath('userData',fs.mkdtempSync(path.join(os.tmpdir(),'tarkas-online-maps-')));
const slugs=['customs','factory','ground-zero','interchange','icebreaker','lighthouse','reserve','shoreline','streets-of-tarkov','terminal','the-lab','the-labyrinth','woods'];
app.whenReady().then(async()=>{
 const results=[],win=new BrowserWindow({show:false,width:1100,height:760,webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,backgroundThrottling:false}});
 for(const slug of (process.argv[2]?slugs.filter(slug=>slug===process.argv[2]):slugs)){
  const start=Date.now();try{
   await win.loadURL('https://tarkov.dev/map/'+slug+'?lng=pt');
   let ready=false;for(let i=0;i<200;i++){ready=await win.webContents.executeJavaScript("Boolean(document.elementFromPoint(innerWidth/2,innerHeight/2)?.closest('.leaflet-container,.maplibregl-map'))");if(ready)break;await new Promise(resolve=>setTimeout(resolve,150))}
   await win.webContents.executeJavaScript('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
   const snapshot=await win.webContents.executeJavaScript("({url:location.href,text:document.body.innerText.slice(0,900),canvases:document.querySelectorAll('canvas').length,svgs:document.querySelectorAll('svg').length})");
   fs.writeFileSync(path.join(__dirname,'../logs/map-'+slug+'.png'),(await win.webContents.capturePage()).toPNG());
   results.push({slug,elapsedMs:Date.now()-start,ready,...snapshot});console.log(slug+': rendered='+ready+', '+(Date.now()-start)+'ms');
  }catch(error){results.push({slug,elapsedMs:Date.now()-start,error:error.message});console.log(slug+': '+error.message)}
 }
 fs.writeFileSync(path.join(__dirname,'../logs/online-maps-qa.json'),JSON.stringify(results,null,2));app.exit(results.some(r=>r.error||!r.ready)?1:0);
});
