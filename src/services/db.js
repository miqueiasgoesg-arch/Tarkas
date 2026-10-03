const path = require('path');
const Database = require('better-sqlite3');
const { app } = require('electron');
let db;
let activeProfileId='default';
function profileDatabasePath(profileId='default'){
  const id=String(profileId||'default').trim().toLowerCase();
  if(id==='default')return path.join(app.getPath('userData'),'tarkas.db');
  if(!/^[a-z0-9_-]{1,48}$/.test(id))throw new Error('Perfil inválido');
  return path.join(app.getPath('userData'),'profiles','tarkas-'+id+'.db');
}
function initDb(profileId='default'){
  if(db)db.close();
  activeProfileId=String(profileId||'default').trim().toLowerCase()||'default';
  const dbPath=profileDatabasePath(activeProfileId);
  require('fs').mkdirSync(path.dirname(dbPath),{recursive:true});
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS quests(id TEXT PRIMARY KEY,name TEXT,map TEXT,trader TEXT,done INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
  CREATE TABLE IF NOT EXISTS reminders(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,due_at TEXT,done INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS stash(id TEXT PRIMARY KEY,name TEXT,qty INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS builds(id TEXT PRIMARY KEY,name TEXT,weapon_id TEXT,weapon_name TEXT,notes TEXT,created_at TEXT,updated_at TEXT);
  CREATE TABLE IF NOT EXISTS build_items(build_id TEXT,item_id TEXT,item_name TEXT,slot_name TEXT,PRIMARY KEY(build_id,item_id));
  CREATE TABLE IF NOT EXISTS map_pins(id TEXT PRIMARY KEY,map_name TEXT,label TEXT,note TEXT,x REAL,z REAL,color TEXT,created_at TEXT);
  CREATE TABLE IF NOT EXISTS raid_logs(id TEXT PRIMARY KEY,map_name TEXT,result TEXT,summary TEXT,loot_value INTEGER DEFAULT 0,kills INTEGER DEFAULT 0,created_at TEXT);
  CREATE TABLE IF NOT EXISTS goals(id TEXT PRIMARY KEY,title TEXT,kind TEXT,done INTEGER DEFAULT 0,created_at TEXT);
  CREATE TABLE IF NOT EXISTS favorite_items(item_id TEXT PRIMARY KEY,item_name TEXT,kind TEXT,created_at TEXT);
  CREATE TABLE IF NOT EXISTS item_tags(item_id TEXT,tag TEXT,PRIMARY KEY(item_id,tag));
  CREATE TABLE IF NOT EXISTS shopping_list(id TEXT PRIMARY KEY,item_name TEXT,quantity INTEGER DEFAULT 1,done INTEGER DEFAULT 0,created_at TEXT);
  CREATE TABLE IF NOT EXISTS quest_progress(id TEXT PRIMARY KEY,status TEXT DEFAULT 'locked',updated_at TEXT);
  CREATE TABLE IF NOT EXISTS objective_progress(id TEXT PRIMARY KEY,quest_id TEXT,done INTEGER DEFAULT 0,updated_at TEXT);`);
  db.exec('CREATE TABLE IF NOT EXISTS raid_kits(id TEXT PRIMARY KEY,name TEXT,items_json TEXT,created_at TEXT);');
  db.exec('CREATE TABLE IF NOT EXISTS item_locations(id TEXT PRIMARY KEY,item_id TEXT,item_name TEXT,map_name TEXT,area TEXT,note TEXT,created_at TEXT);');
  const count=db.prepare('SELECT COUNT(*) n FROM quests').get().n;
  if(!count){ const ins=db.prepare('INSERT INTO quests VALUES(?,?,?,?,0)');
    [['q1','Debut','Customs','Prapor'],['q2','Shortage','Any','Therapist'],['q3','Checking','Customs','Prapor'],['q4','Introduction','Woods','Mechanic']].forEach(x=>ins.run(...x)); }
}
function commandOverview(){
  const count=table=>db.prepare('SELECT COUNT(*) n FROM '+table).get().n;
  return {builds:count('builds'),pins:count('map_pins'),raids:count('raid_logs'),goals:db.prepare('SELECT COUNT(*) n FROM goals WHERE done=0').get().n,favorites:count('favorite_items'),stash:count('stash')};
}
function profileSummary(){
  const count=table=>db.prepare('SELECT COUNT(*) n FROM '+table).get().n;
  return {id:activeProfileId,level:playerLevel(),quests:count('quest_progress'),builds:count('builds'),stash:count('stash'),raids:count('raid_logs'),updatedAt:getSetting('profileLastUpdated','')};
}
function savedBuilds(){return db.prepare('SELECT id,name,weapon_id,weapon_name,notes,created_at,updated_at FROM builds ORDER BY updated_at DESC').all().map(build=>({...build,items:db.prepare('SELECT item_id id,item_name name,slot_name slot FROM build_items WHERE build_id=?').all(build.id)}))}
function saveBuild(name,weaponId,weaponName,notes='',items=[]){
  const title=String(name||'').trim(),weapon=String(weaponId||'').trim();
  if(!title||title.length>100||!weapon)throw new Error('Build inválida');
  const id='build-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),now=new Date().toISOString();
  db.prepare('INSERT INTO builds(id,name,weapon_id,weapon_name,notes,created_at,updated_at) VALUES(?,?,?,?,?,?,?)').run(id,title,weapon,String(weaponName||''),String(notes||'').slice(0,500),now,now);
  const addItem=db.prepare('INSERT OR IGNORE INTO build_items(build_id,item_id,item_name,slot_name) VALUES(?,?,?,?)');
  for(const item of Array.isArray(items)?items.slice(0,80):[])if(item?.id)addItem.run(id,String(item.id),String(item.name||item.shortName||item.id),String(item.slot||''));
  return {id,name:title};
}
function shoppingList(){return db.prepare('SELECT * FROM shopping_list WHERE done=0 ORDER BY created_at DESC').all()}
function addShoppingItem(name,quantity=1){const item=String(name||'').trim(),qty=Math.max(1,Math.min(999,Math.trunc(Number(quantity)||1)));if(!item||item.length>160)throw new Error('Item inválido');db.prepare('INSERT INTO shopping_list(id,item_name,quantity,done,created_at) VALUES(?,?,?,?,?)').run('buy-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),item,qty,0,new Date().toISOString());return true}
function completeShoppingItem(id){db.prepare('UPDATE shopping_list SET done=1 WHERE id=?').run(String(id));return true}
function raidHistory(){return db.prepare('SELECT * FROM raid_logs ORDER BY created_at DESC LIMIT 100').all()}
function addRaidLog(mapName,result,summary='',lootValue=0,kills=0){const map=String(mapName||'').trim(),outcome=String(result||'').trim();if(!map||!['survived','died','run-through'].includes(outcome))throw new Error('Raid inválida');const id='raid-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7);db.prepare('INSERT INTO raid_logs(id,map_name,result,summary,loot_value,kills,created_at) VALUES(?,?,?,?,?,?,?)').run(id,map,outcome,String(summary||'').slice(0,500),Math.max(0,Math.trunc(Number(lootValue)||0)),Math.max(0,Math.trunc(Number(kills)||0)),new Date().toISOString());return {id}}
function goalsList(){return db.prepare('SELECT * FROM goals ORDER BY done,created_at DESC').all()}
function addGoal(title,kind='personal'){const text=String(title||'').trim();if(!text||text.length>160)throw new Error('Meta inválida');db.prepare('INSERT INTO goals(id,title,kind,done,created_at) VALUES(?,?,?,?,?)').run('goal-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),text,String(kind||'personal').slice(0,40),0,new Date().toISOString());return true}
function completeGoal(id){db.prepare('UPDATE goals SET done=1 WHERE id=?').run(String(id));return true}
function mapPins(mapName){return db.prepare('SELECT * FROM map_pins WHERE map_name=? ORDER BY created_at DESC').all(String(mapName))}
function addMapPin(mapName,label,note='',x=null,z=null){const map=String(mapName||'').trim(),title=String(label||'').trim(),px=Number(x),pz=Number(z);if(!map||!title||title.length>100)throw new Error('Ponto inválido');db.prepare('INSERT INTO map_pins(id,map_name,label,note,x,z,color,created_at) VALUES(?,?,?,?,?,?,?,?)').run('pin-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),map,title,String(note||'').slice(0,300),Number.isFinite(px)?px:null,Number.isFinite(pz)?pz:null,'gold',new Date().toISOString());return true}
function removeMapPin(id){db.prepare('DELETE FROM map_pins WHERE id=?').run(String(id));return true}
function favorites(){return db.prepare('SELECT * FROM favorite_items ORDER BY created_at DESC').all()}
function toggleFavorite(itemId,itemName,kind='item'){const id=String(itemId||'');const exists=db.prepare('SELECT 1 FROM favorite_items WHERE item_id=?').get(id);if(exists){db.prepare('DELETE FROM favorite_items WHERE item_id=?').run(id);return false}db.prepare('INSERT INTO favorite_items(item_id,item_name,kind,created_at) VALUES(?,?,?,?)').run(id,String(itemName||''),String(kind||'item'),new Date().toISOString());return true}
function stashItems(){return db.prepare('SELECT * FROM stash WHERE qty>0 ORDER BY name').all()}
function setStashItem(id,name,quantity){const key=String(id||name||'').trim(),title=String(name||'').trim(),qty=Math.max(0,Math.min(9999,Math.trunc(Number(quantity)||0)));if(!key||!title)throw new Error('Item inválido');if(!qty){db.prepare('DELETE FROM stash WHERE id=?').run(key);return true}db.prepare('INSERT INTO stash(id,name,qty) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,qty=excluded.qty').run(key,title,qty);return true}
function addBuildMissingToShopping(buildId){const parts=db.prepare('SELECT item_id id,item_name name FROM build_items WHERE build_id=?').all(String(buildId)),stashById=new Set(db.prepare('SELECT id FROM stash WHERE qty>0').all().map(x=>x.id)),stashByName=new Set(db.prepare('SELECT name FROM stash WHERE qty>0').all().map(x=>x.name.toLowerCase())),existing=new Set(db.prepare('SELECT item_name FROM shopping_list WHERE done=0').all().map(x=>x.item_name.toLowerCase()));let added=0;for(const part of parts){if(stashById.has(part.id)||stashByName.has(part.name.toLowerCase())||existing.has(part.name.toLowerCase()))continue;addShoppingItem(part.name,1);existing.add(part.name.toLowerCase());added++}return {added,total:parts.length}}
function getDashboard(){
  const progress=db.prepare('SELECT * FROM quest_progress').all();
  const reminders=db.prepare("SELECT * FROM reminders WHERE done=0 ORDER BY CASE WHEN due_at='' THEN 1 ELSE 0 END, due_at LIMIT 5").all();
  const stats={active:progress.filter(q=>q.status==='active').length,available:progress.filter(q=>q.status==='available').length,done:progress.filter(q=>q.status==='completed').length};
  return {progress,reminders,stats};
}
function addReminder(title,dueAt=''){
  const text=String(title||'').trim();
  if(!text||text.length>160)throw new Error('Lembrete inválido');
  db.prepare('INSERT INTO reminders(title,due_at,done) VALUES(?,?,0)').run(text,String(dueAt||''));
  return true;
}
function completeReminder(id){
  const result=db.prepare('UPDATE reminders SET done=1 WHERE id=?').run(Number(id));
  if(!result.changes)throw new Error('Lembrete não encontrado');
  return true;
}
function toggleQuest(id){
  const q=db.prepare('SELECT status FROM quest_progress WHERE id=?').get(id);
  return setQuestStatus(id,q?.status==='completed'?'active':'completed');
}
function saveSetting(key,value){ db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value)); if(key!=='profileLastUpdated')db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('profileLastUpdated',new Date().toISOString()); return true; }
function getSetting(key,fallback=null){const row=db.prepare('SELECT value FROM settings WHERE key=?').get(key);return row?row.value:fallback}
function playerLevel(){const n=Number(getSetting('playerLevel','1'));return Number.isInteger(n)&&n>=1&&n<=79?n:1}
function questProgress(){return db.prepare('SELECT * FROM quest_progress').all()}
function setQuestStatus(id,status){const allowed=['locked','available','active','completed'];if(!allowed.includes(status))throw new Error('status inválido');db.prepare(`INSERT INTO quest_progress(id,status,updated_at) VALUES(?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at`).run(id,status);return {id,status}}
function toggleObjective(id,questId){db.prepare(`INSERT INTO objective_progress(id,quest_id,done,updated_at) VALUES(?,?,1,datetime('now')) ON CONFLICT(id) DO UPDATE SET done=1-done,updated_at=datetime('now')`).run(id,questId);return db.prepare('SELECT * FROM objective_progress WHERE id=?').get(id)}
function objectiveProgress(){return db.prepare('SELECT * FROM objective_progress').all()}
function raidKits(){return db.prepare('SELECT * FROM raid_kits ORDER BY created_at DESC').all().map(kit=>({...kit,items:JSON.parse(kit.items_json||'[]')}))}
function saveRaidKit(name,items){const title=String(name||'').trim(),list=Array.isArray(items)?items.map(item=>String(item).trim()).filter(Boolean).slice(0,40):[];if(!title||title.length>100||!list.length)throw new Error('Kit inválido');db.prepare('INSERT INTO raid_kits(id,name,items_json,created_at) VALUES(?,?,?,?)').run('kit-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),title,JSON.stringify(list),new Date().toISOString());return true}
function removeRaidKit(id){db.prepare('DELETE FROM raid_kits WHERE id=?').run(String(id));return true}
function itemLocations(itemId){return db.prepare('SELECT * FROM item_locations WHERE item_id=? ORDER BY created_at DESC').all(String(itemId))}
function addItemLocation(itemId,itemName,mapName,area,note=''){const id=String(itemId||''),name=String(itemName||'').trim(),map=String(mapName||'').trim(),place=String(area||'').trim();if(!id||!name||!map||!place||name.length>160||map.length>80||place.length>160)throw new Error('Local inválido');db.prepare('INSERT INTO item_locations(id,item_id,item_name,map_name,area,note,created_at) VALUES(?,?,?,?,?,?,?)').run('loc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),id,name,map,place,String(note||'').slice(0,400),new Date().toISOString());return true}
function removeItemLocation(id){db.prepare('DELETE FROM item_locations WHERE id=?').run(String(id));return true}
const profileTables=['settings','reminders','stash','builds','build_items','map_pins','raid_logs','goals','favorite_items','item_tags','shopping_list','quest_progress','objective_progress','raid_kits','item_locations'];
function exportProfile(){const data={};for(const table of profileTables)data[table]=db.prepare('SELECT * FROM '+table).all();return {format:'tarkas-profile',version:1,profile:{id:activeProfileId,level:playerLevel()},exportedAt:new Date().toISOString(),data}}
function validateProfileSnapshot(snapshot){if(snapshot?.format!=='tarkas-profile'||snapshot.version!==1||!snapshot.data||typeof snapshot.data!=='object')throw new Error('Backup incompatível');for(const table of profileTables){const rows=snapshot.data[table];if(rows!==undefined&&!Array.isArray(rows))throw new Error('Backup corrompido');if(Array.isArray(rows)&&rows.length>10000)throw new Error('Backup grande demais')}return true}
function importProfile(snapshot){validateProfileSnapshot(snapshot);const transaction=db.transaction(()=>{for(const table of profileTables)db.prepare('DELETE FROM '+table).run();for(const table of profileTables){const rows=Array.isArray(snapshot.data[table])?snapshot.data[table]:[];if(!rows.length)continue;const columns=Object.keys(rows[0]).filter(column=>/^[a-z_]+$/.test(column));if(!columns.length)continue;const statement=db.prepare('INSERT OR REPLACE INTO '+table+'('+columns.join(',')+') VALUES('+columns.map(()=>'?').join(',')+')');for(const row of rows)statement.run(...columns.map(column=>row[column]??null))}saveSetting('profileLastUpdated',new Date().toISOString())});transaction();return true}
module.exports={initDb,getDashboard,commandOverview,profileSummary,savedBuilds,saveBuild,shoppingList,addShoppingItem,completeShoppingItem,addBuildMissingToShopping,raidHistory,addRaidLog,goalsList,addGoal,completeGoal,mapPins,addMapPin,removeMapPin,favorites,toggleFavorite,stashItems,setStashItem,addReminder,completeReminder,toggleQuest,saveSetting,getSetting,playerLevel,questProgress,setQuestStatus,toggleObjective,objectiveProgress,raidKits,saveRaidKit,removeRaidKit,itemLocations,addItemLocation,removeItemLocation,exportProfile,importProfile,validateProfileSnapshot};
