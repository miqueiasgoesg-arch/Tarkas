const path=require('path');
const {setDataRoot}=require('../../src/shared/dataStorage');
setDataRoot(path.join(__dirname,'..','..','.tarkas-data'));
const {raidPlan}=require('../../src/services/questEngine');
const {mapDetail}=require('../../src/services/mapEngine');
for(const slug of ['customs','the-lab']){
 const map=mapDetail('regular',slug),plan=raidPlan('regular',map.name,[],79);
 if(plan.keys.some(x=>!x.id||!x.name||!x.quests.length))throw new Error(slug+': chave sem ficha');
 if(plan.objectiveItems.some(x=>!x.id||!x.name||!x.quests.length))throw new Error(slug+': item sem ficha');
 if(new Set(plan.keys.map(x=>x.id)).size!==plan.keys.length)throw new Error(slug+': chaves duplicadas');
 if(new Set(plan.objectiveItems.map(x=>x.id)).size!==plan.objectiveItems.length)throw new Error(slug+': itens duplicados');
 console.log(slug,{keys:plan.keys.length,objectiveItems:plan.objectiveItems.length});
}
