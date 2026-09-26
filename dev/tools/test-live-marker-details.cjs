const endpoint='http://127.0.0.1:9222/json';
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const page=(await fetch(endpoint).then(response=>response.json())).find(entry=>entry.type==='page'&&entry.url.includes('/resources/app.asar/'));
 if(!page)throw new Error('Renderer do EXE empacotado não encontrado');
 const socket=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true})});
 let serial=0;const pending=new Map();socket.addEventListener('message',event=>{const message=JSON.parse(event.data),entry=pending.get(message.id);if(!entry)return;pending.delete(message.id);message.error?entry.reject(new Error(message.error.message)):entry.resolve(message.result)});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value};
 await send('Runtime.enable');await wait(700);
 await evaluate(`(()=>{document.querySelector('#nav button[data-page="mapa"]').click();return true})()`);await wait(450);
 await evaluate(`(async()=>{const map=(await window.tarkas.maps('regular')).find(x=>x.slug==='customs');const select=document.querySelector('#raidmap');select.value=map.id;select.dispatchEvent(new Event('change',{bubbles:true}));return true})()`);await wait(1400);
 const actual=await evaluate(`(()=>{const marker=document.querySelector('.overlaymap .mark.boss')||document.querySelector('.overlaymap .mark.objective');if(!marker)throw Error('Nenhum marcador clicável');marker.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));const card=document.querySelector('#marker-details');return{markerType:[...marker.classList].find(x=>['boss','objective'].includes(x)),symbol:marker.dataset.symbol,heading:card?.querySelector('h3')?.textContent,category:card?.querySelector('.tag')?.textContent,note:card?.querySelector('p')?.textContent}})()`);
 if(!actual.symbol||!actual.heading||!actual.category||!actual.note)throw new Error('Ficha de marcador não abriu: '+JSON.stringify(actual));
 console.log(JSON.stringify({build:page.url,actual},null,2));socket.close();
})().catch(error=>{console.error(error.stack||error);process.exitCode=1});
