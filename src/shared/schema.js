const SCHEMA_VERSION=1;
const SYNC_ENTITIES=['quest_progress','objective_progress','settings','stash','reminders'];
function syncRecord(entity,id,data,updatedAt=new Date().toISOString(),deleted=false){
 if(!SYNC_ENTITIES.includes(entity)) throw new Error('Entidade não sincronizável');
 return {schemaVersion:SCHEMA_VERSION,entity,id:String(id),data,updatedAt,deleted};
}
module.exports={SCHEMA_VERSION,SYNC_ENTITIES,syncRecord};
