(function(root){
 'use strict';
 const weapons={
  pistol:{name:'Pistola',price:0,ammo:'ammo9',mag:12,damage:1,interval:.32,speed:470,range:330,reload:1.3,pellets:1,spread:.025},
  smg:{name:'SMG',price:180,ammo:'ammo9',mag:24,damage:1,interval:.10,speed:490,range:310,reload:1.8,pellets:1,spread:.075},
  m4:{name:'M4',price:420,ammo:'ammo556',mag:30,damage:1.6,interval:.16,speed:650,range:520,reload:2.1,pellets:1,spread:.025},
  shotgun:{name:'Calibre 12',price:260,ammo:'shells',mag:6,damage:.85,interval:.85,speed:430,range:180,reload:2.5,pellets:6,spread:.3},
  sniper:{name:'Sniper',price:550,ammo:'ammo762',mag:5,damage:5,interval:1.65,speed:950,range:850,reload:2.8,pellets:1,spread:0}
 };
 const items={
  medkit:{name:'Medkit',sell:18,buy:35,stack:1},
  food:{name:'Ração',sell:8,buy:15,stack:1},
  grenade:{name:'Granada',sell:22,buy:40,stack:1},
  ammo9:{name:'Munição 9 mm',sell:1,buy:2,stack:12},
  ammo556:{name:'Munição 5,56',sell:2,buy:3,stack:12},
  shells:{name:'Cartucho calibre 12',sell:2,buy:4,stack:12},
  ammo762:{name:'Munição 7,62',sell:3,buy:5,stack:12},
  valuables:{name:'Peças e objetos de valor',sell:15,buy:0,stack:1}
 };
 const number=v=>Math.max(0,Math.min(1000000,Math.trunc(Number(v)||0)));
 function normalize(value,legacy=0){
  const data=value&&typeof value==='object'?value:{};
  const owned=[...new Set(['pistol',...(Array.isArray(data.owned)?data.owned:[]).filter(id=>weapons[id])])];
  return {version:1,money:number(data.money??legacy),owned,selected:owned.includes(data.selected)?data.selected:'pistol',inventory:Object.fromEntries(Object.keys(items).map(id=>[id,number(data.inventory?.[id])])),upgrades:Object.fromEntries(['armor','bag','ammo'].map(id=>[id,Math.min(3,number(data.upgrades?.[id]))]))};
 }
 function slots(bag){return Object.entries(bag).reduce((n,[id,count])=>n+(items[id]?Math.ceil(number(count)/items[id].stack):0),0)}
 function buyWeapon(data,id){const weapon=weapons[id];if(!weapon||data.owned.includes(id)||data.money<weapon.price)return false;data.money-=weapon.price;data.owned.push(id);data.selected=id;return true}
 function buyItem(data,id,count=1){const item=items[id];count=number(count);if(!item?.buy||!count||data.money<item.buy*count)return false;data.money-=item.buy*count;data.inventory[id]+=count;return true}
 function sell(data,id,count=1){count=number(count);if(!items[id]||!count||data.inventory[id]<count)return false;data.inventory[id]-=count;data.money+=items[id].sell*count;return true}
 function deploy(data,requested,capacity){
  const bag=Object.fromEntries(Object.keys(items).map(id=>[id,Math.min(data.inventory[id],number(requested[id]))]));
  if(slots(bag)>capacity)return null;
  for(const id in bag)data.inventory[id]-=bag[id];
  return bag;
 }
 function recover(data,bag,bonus=0){for(const id in items)data.inventory[id]+=number(bag[id]);data.money+=number(bonus)}
 const api={weapons,items,normalize,slots,buyWeapon,buyItem,sell,deploy,recover};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TarkovinhoEconomy=api;
})(typeof globalThis==='undefined'?this:globalThis);
