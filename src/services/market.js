const { readCache } = require('./tarkovData');

function payload(mode, name) {
  const cached = readCache(mode, name);
  return cached?.data?.data || cached?.data || {};
}

function catalog(mode = 'regular') {
  const source = payload(mode, 'items');
  const items = Object.values(source?.items || source || {});
  const pt = payload(mode, 'items_pt');
  return items.filter(item => item?.id && item?.name).map(item => ({
    id: item.id,
    name: pt?.[item.name] || item.name,
    shortName: pt?.[item.shortName] || item.shortName || item.name,
    price: Number(item.avg24hPrice),
    lowPrice: Number(item.low24hPrice) || null,
    lastLowPrice: Number(item.lastLowPrice) || null,
    scannedAt: item.lastScan || '',
    types: item.types || [],
    icon: item.iconLink || item.image512pxLink || '',
    description: pt?.[item.description] || item.description || ''
  })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

function details(mode='regular',id='') {
  const source=payload(mode,'items'),items=source?.items||source||{},raw=items[id];
  if(!raw)return null;
  const pt=payload(mode,'items_pt');
  const name=pt?.[raw.name]||raw.name||'Item desconhecido';
  const tradersSource=payload(mode,'traders'),traders=tradersSource?.traders||tradersSource||{},tradersPt=payload(mode,'traders_pt');
  const traderName=id=>{const trader=traders[id];return trader?(tradersPt?.[trader.name]||trader.name||id):id};
  const taskSource=payload(mode,'tasks'),tasks=Object.values(taskSource?.tasks||taskSource||{}),tasksPt=payload(mode,'tasks_pt'),mapsSource=payload(mode,'maps'),maps=mapsSource?.maps||mapsSource||{},mapsPt=payload(mode,'maps_pt');
  const quests=[];
  for(const task of tasks){
    const objectives=(task.objectives||[]).filter(objective=>(objective.items||[]).includes(id));
    const keyUses=(task.neededKeys||[]).filter(requirement=>(requirement.keys||[]).includes(id));
    if(!objectives.length&&!keyUses.length)continue;
    const taskName=tasksPt?.[task.name]||task.normalizedName||task.name||'Quest';
    const map=maps[task.map];
    const mapName=map?(mapsPt?.[map.name]||map.name):'Qualquer mapa';
    objectives.forEach(objective=>quests.push({name:taskName,map:mapName,role:'Objetivo: '+(tasksPt?.[objective.description]||objective.description||'item necessário'),foundInRaid:Boolean(objective.foundInRaid)}));
    keyUses.forEach(()=>quests.push({name:taskName,map:mapName,role:'Chave necessária',foundInRaid:false}));
  }
  const hideoutSource=payload(mode,'hideout'),stations=Object.values(hideoutSource?.hideout||hideoutSource||{}),hideoutPt=payload(mode,'hideout_pt');
  const hideout=[];
  for(const station of stations)for(const level of station.levels||[])for(const requirement of level.itemRequirements||[])if(requirement.item===id)hideout.push({station:hideoutPt?.[station.name]||station.normalizedName||station.name||'Estação',level:Number(level.level)||0,count:Number(requirement.count)||1,foundInRaid:Boolean(requirement.attributes?.foundInRaid)});
  const buyFrom=(raw.buyFromTrader||[]).map(row=>({trader:traderName(row.trader),price:Number(row.priceRUB)||0,level:Number(row.minTraderLevel)||0,currency:row.currency||'RUB'})).sort((a,b)=>a.price-b.price);
  const sellTo=(raw.sellToTrader||[]).map(row=>({trader:traderName(row.trader),price:Number(row.priceRUB)||0,currency:row.currency||'RUB'})).sort((a,b)=>b.price-a.price);
  return {id,name,shortName:pt?.[raw.shortName]||raw.shortName||name,description:pt?.[raw.description]||raw.description||'',types:raw.types||[],icon:raw.iconLink||raw.image512pxLink||'',price:Number(raw.avg24hPrice)||0,lowPrice:Number(raw.low24hPrice)||0,lastLowPrice:Number(raw.lastLowPrice)||0,scannedAt:raw.lastScan||'',wikiLink:raw.wikiLink||'',weight:Number(raw.weight)||0,buyFrom,sellTo,quests,hideout};
}

module.exports = { catalog, details };
