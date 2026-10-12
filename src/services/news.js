const STEAM_RSS='https://steamcommunity.com/games/3932890/rss/';
let cached={at:0,items:[]};
const decode=value=>String(value||'').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const field=(xml,name)=>xml.match(new RegExp('<'+name+'[^>]*>([\\s\\S]*?)</'+name+'>','i'))?.[1]||'';

async function officialNews(){
  if(Date.now()-cached.at<10*60*1000&&cached.items.length)return cached.items;
  try{
    const response=await fetch(STEAM_RSS,{headers:{'user-agent':'Tarkas companion news reader','accept':'application/rss+xml, application/xml, text/xml'}});
    if(!response.ok)throw new Error('Steam RSS '+response.status);
    const xml=await response.text();
    const items=[...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map(match=>{
      const entry=match[1],url=decode(field(entry,'link'));
      return {title:decode(field(entry,'title'))||'Anúncio oficial',summary:decode(field(entry,'description')).slice(0,380),publishedAt:decode(field(entry,'pubDate')),url};
    }).filter(item=>/^https:\/\/steamcommunity\.com\//.test(item.url)).slice(0,12);
    if(items.length)cached={at:Date.now(),items};
    return cached.items;
  }catch(error){console.warn('official news unavailable:',error.message);return cached.items}
}

module.exports={officialNews};
