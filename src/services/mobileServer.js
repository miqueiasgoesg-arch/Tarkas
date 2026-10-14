const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const blocked = new Set(['profiles:create','profiles:switch','profile:import','profile:export','profile:avatar:upload','shortcut:desktop','map:open-window','map:open-external','update:install','update:check','update:open-release']);
function createMobileServer({ handlers, rendererRoot, preloadPath }) {
  let server = null, token = '', starting = null;
  function status() {
    const port = server?.address()?.port;
    const addresses = [...new Set(Object.values(os.networkInterfaces()).flat().filter(entry => entry && entry.family === 'IPv4' && !entry.internal).map(entry => entry.address))];
    return { enabled: Boolean(port), urls: port ? addresses.map(ip => `http://${ip}:${port}/#access=${token}`) : [] };
  }
  async function stop() {
    if (starting) await starting;
    const previous = server; server = null; token = '';
    if (previous) { previous.closeAllConnections(); await new Promise(resolve => previous.close(resolve)); }
    return status();
  }
  function bridge() {
    const source = fs.readFileSync(preloadPath, 'utf8').replace("const { contextBridge, ipcRenderer } = require('electron');", '');
    return `(()=>{'use strict';
      const fragment=new URLSearchParams(location.hash.slice(1));
      if(fragment.has('access')){sessionStorage.setItem('tarkasAccess',fragment.get('access'));history.replaceState(null,'',location.pathname+location.search)}
      const contextBridge={exposeInMainWorld:(name,value)=>{window[name]=value}};
      const ipcRenderer={on:()=>{},invoke:async(channel,...args)=>{
        const response=await fetch('/api',{method:'POST',headers:{'Content-Type':'application/json','X-Tarkas-Access':sessionStorage.getItem('tarkasAccess')||''},body:JSON.stringify({channel,args})});
        const result=await response.json();if(!response.ok)throw new Error(result.error);return result.value;
      }};
      ${source}
      const maps=new Set(['customs','factory','ground-zero','interchange','icebreaker','lighthouse','reserve','shoreline','streets-of-tarkov','terminal','the-lab','the-labyrinth','woods']);
      const openMap=async slug=>{if(slug==='night-factory'||slug==='factory-night')slug='factory';if(!maps.has(slug))return false;location.assign('https://tarkov.dev/map/'+slug+'?lng=pt');return true};
      window.tarkas.openMapWindow=openMap;window.tarkas.openExternalMap=openMap;
      window.tarkas.updateStatus=async()=>({status:'current',currentVersion:${JSON.stringify(require('../../package.json').version)},enabled:false,message:'Acesso pelo Wi-Fi do PC'});
      window.tarkas.checkUpdate=window.tarkas.updateStatus;
      window.tarkas.createDesktopShortcut=async()=>({created:false,message:'No celular, use Adicionar à tela inicial no menu do navegador.'});
      for(const name of ['uploadProfileAvatar','exportProfile','importProfile','createProfile','switchProfile'])window.tarkas[name]=async()=>{throw new Error('Faça esta operação no Tarkas do PC.')};
    })();`;
  }
  async function handle(req, res) {
    const send = (code, value) => {res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('X-Content-Type-Options','nosniff');
    try {
      if (req.url === '/api') {
        if (req.method !== 'POST') return send(405, {error:'Método inválido'});
        const incoming = Buffer.from(String(req.headers['x-tarkas-access'] || ''));
        const expected = Buffer.from(token);
        if (!token || incoming.length !== expected.length || !crypto.timingSafeEqual(incoming, expected)) return send(401,{error:'Abra o link de acesso mostrado no Tarkas do PC.'});
        if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) return send(403,{error:'Origem inválida'});
        let body = '', size = 0;
        for await (const chunk of req) {size += chunk.length;if(size > 256*1024)return send(413,{error:'Solicitação muito grande'});body += chunk;}
        const {channel,args} = JSON.parse(body);
        if (!Array.isArray(args) || args.length > 10 || typeof channel !== 'string' || blocked.has(channel) || channel.startsWith('mobile:') || !handlers.has(channel)) return send(403,{error:'Operação disponível apenas no PC.'});
        const value = await handlers.get(channel)(null,...args);
        return send(200,{value:value === undefined ? null : value});
      }
      if (!['GET','HEAD'].includes(req.method)) return send(405,{error:'Método inválido'});
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(pathname === '/brand-logo.png') {
        const logo=fs.readFileSync(path.join(rendererRoot,'../../assets/tarkas-logo-v2.png'));
        res.writeHead(200,{'Content-Type':'image/png','Cache-Control':'no-store'});return res.end(req.method==='HEAD'?'':logo);
      }
      if (pathname === '/mobile-bridge.js') {
        res.writeHead(200,{'Content-Type':'text/javascript; charset=utf-8','Cache-Control':'no-store'});return res.end(req.method === 'HEAD' ? '' : bridge());
      }
      const target = path.resolve(rendererRoot,'.'+(pathname === '/' ? '/index.html' : pathname));
      const relative = path.relative(rendererRoot,target);
      if(relative.startsWith('..') || path.isAbsolute(relative))return send(404,{error:'Não encontrado'});
      const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
      const type=types[path.extname(target)];
      if(!type || !fs.existsSync(target) || !fs.statSync(target).isFile())return send(404,{error:'Não encontrado'});
      let bytes=fs.readFileSync(target);
      if(path.basename(target)==='index.html')bytes=Buffer.from(bytes.toString().replace('<script src="i18n.js">','<script src="mobile-bridge.js"></script><script src="i18n.js">'));
      res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(req.method==='HEAD'?'':bytes);
    } catch(error) { if(!res.headersSent)send(400,{error:'Não foi possível concluir a solicitação. Verifique a conexão e tente novamente.'});else res.end(); }
  }
  async function start() {
    if(starting){await starting;return status();}
    if(server)return status();
    token=crypto.randomBytes(32).toString('hex');
    server=http.createServer(handle);server.requestTimeout=15000;server.headersTimeout=10000;
    starting=new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'0.0.0.0',resolve)});
    try {await starting;return status();}catch(error){server=null;token='';throw error;}finally{starting=null;}
  }
  return {start,stop,status};
}
module.exports={createMobileServer};
