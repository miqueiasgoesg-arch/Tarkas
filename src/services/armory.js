const {readCache}=require('./tarkovData');
function payload(mode,name){const c=readCache(mode,name);return c?.data?.data||c?.data||{}}
function catalog(mode='regular'){
  const items=Object.values(payload(mode,'items').items||payload(mode,'items')||{});
  const translated=payload(mode,'items_pt');
  return items.filter(item=>item?.id&&((item.types||[]).includes('gun')||(item.types||[]).includes('mods'))).map(item=>({
    id:item.id,name:translated[item.name]||item.name,shortName:translated[item.shortName]||item.shortName||item.name,
    kind:(item.types||[]).includes('gun')?'weapon':'attachment',types:item.types||[],icon:item.image512pxLink||item.iconLink||'',
    caliber:item.properties?.caliber||'',price:item.avg24hPrice||item.basePrice||0,ergonomics:item.properties?.ergonomics??null,
    recoil:item.properties?.recoilVertical??null,link:item.link||''
  })).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
function text(translated,value,fallback=''){return translated?.[value]||fallback||value||''}
function details(mode='regular',id){
  const source=payload(mode,'items'),items=source.items||source||{},translated=payload(mode,'items_pt'),item=items[id];
  if(!item)return null;
  const view=raw=>raw?{id:raw.id,name:text(translated,raw.name,raw.name),icon:raw.iconLink||raw.image512pxLink||'',shortName:text(translated,raw.shortName,raw.shortName)}:null;
  const properties=item.properties||{},allowedAmmo=(properties.allowedAmmo||[]).map(ammoId=>view(items[ammoId])).filter(Boolean);
  const installed=(item.containsItems||[]).map(entry=>view(items[entry.item])).filter(Boolean);
  const slots=(properties.slots||[]).map(slot=>({name:slot.name||slot.id,required:!!slot.required,items:(slot.filters?.allowedItems||[]).map(itemId=>view(items[itemId])).filter(Boolean)}));
  return {id:item.id,name:text(translated,item.name,item.name),shortName:text(translated,item.shortName,item.shortName),description:text(translated,item.description,item.description),icon:item.image512pxLink||item.iconLink||'',types:item.types||[],caliber:properties.caliber||'',ergonomics:properties.ergonomics??null,recoilVertical:properties.recoilVertical??null,recoilHorizontal:properties.recoilHorizontal??null,fireRate:properties.fireRate??null,effectiveDistance:properties.effectiveDistance??null,price:item.avg24hPrice||item.basePrice||0,allowedAmmo,installed,slots};
}
module.exports={catalog,details};
