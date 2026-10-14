const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'tarkas-real-data-'));
require('../src/shared/dataStorage').setDataRoot(root);
(async()=>{
 const sync=await require('../src/services/tarkovData').syncCore('regular');
 assert.deepEqual(sync.failed,[],'Real synchronization failed');
 const engine=require('../src/services/questEngine'),catalog=engine.questSummary('regular');
 assert.ok(catalog.count>100);assert.ok(catalog.quests.every(q=>q.trader));
 const market=require('../src/services/market').catalog('regular');assert.ok(market.length>100);
 const weapon=market.find(item=>item.kind==='weapon');if(weapon)assert.ok(require('../src/services/market').details('regular',weapon.id));
 const maps=require('../src/services/mapEngine').maps('regular');assert.ok(maps.length>=13);
 const documents=require('../src/services/battlePass').getBattlePassDocuments();assert.ok(documents.length);
 const report={updatedAt:new Date().toISOString(),sync,quests:catalog.count,market:market.length,maps:maps.map(m=>m.name),documents:documents.length,dataRoot:root};
 fs.mkdirSync(path.join(__dirname,'../logs'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../logs/real-data-qa.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
})().catch(error=>{console.error(error);process.exitCode=1});
