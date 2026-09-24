const path = require('path');
const Database = require('better-sqlite3');
const { app } = require('electron');
let db;
function initDb(){
  db = new Database(path.join(app.getPath('userData'),'tarkas.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS quests(id TEXT PRIMARY KEY,name TEXT,map TEXT,trader TEXT,done INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT);
  CREATE TABLE IF NOT EXISTS reminders(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,due_at TEXT,done INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS stash(id TEXT PRIMARY KEY,name TEXT,qty INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS quest_progress(id TEXT PRIMARY KEY,status TEXT DEFAULT 'locked',updated_at TEXT);
  CREATE TABLE IF NOT EXISTS objective_progress(id TEXT PRIMARY KEY,quest_id TEXT,done INTEGER DEFAULT 0,updated_at TEXT);`);
  const count=db.prepare('SELECT COUNT(*) n FROM quests').get().n;
  if(!count){ const ins=db.prepare('INSERT INTO quests VALUES(?,?,?,?,0)');
    [['q1','Debut','Customs','Prapor'],['q2','Shortage','Any','Therapist'],['q3','Checking','Customs','Prapor'],['q4','Introduction','Woods','Mechanic']].forEach(x=>ins.run(...x)); }
}
function getDashboard(){
  const progress=db.prepare('SELECT * FROM quest_progress').all();
  const reminders=db.prepare('SELECT * FROM reminders WHERE done=0 ORDER BY due_at LIMIT 5').all();
  const stats={active:progress.filter(q=>q.status==='active').length,available:progress.filter(q=>q.status==='available').length,done:progress.filter(q=>q.status==='completed').length};
  return {progress,reminders,stats};
}
function toggleQuest(id){
  const q=db.prepare('SELECT status FROM quest_progress WHERE id=?').get(id);
  return setQuestStatus(id,q?.status==='completed'?'active':'completed');
}
function saveSetting(key,value){ db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,String(value)); return true; }
function getSetting(key,fallback=null){const row=db.prepare('SELECT value FROM settings WHERE key=?').get(key);return row?row.value:fallback}
function playerLevel(){const n=Number(getSetting('playerLevel','1'));return Number.isInteger(n)&&n>=1&&n<=79?n:1}
function questProgress(){return db.prepare('SELECT * FROM quest_progress').all()}
function setQuestStatus(id,status){const allowed=['locked','available','active','completed'];if(!allowed.includes(status))throw new Error('status inválido');db.prepare(`INSERT INTO quest_progress(id,status,updated_at) VALUES(?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at`).run(id,status);return {id,status}}
function toggleObjective(id,questId){db.prepare(`INSERT INTO objective_progress(id,quest_id,done,updated_at) VALUES(?,?,1,datetime('now')) ON CONFLICT(id) DO UPDATE SET done=1-done,updated_at=datetime('now')`).run(id,questId);return db.prepare('SELECT * FROM objective_progress WHERE id=?').get(id)}
function objectiveProgress(){return db.prepare('SELECT * FROM objective_progress').all()}
module.exports={initDb,getDashboard,toggleQuest,saveSetting,getSetting,playerLevel,questProgress,setQuestStatus,toggleObjective,objectiveProgress};
