const {SCHEMA_VERSION}=require('./schema');
function makeSyncEnvelope(deviceId,changes=[]){
 return {schemaVersion:SCHEMA_VERSION,deviceId:String(deviceId||'local'),generatedAt:new Date().toISOString(),changes};
}
function newestWins(local,remote){
 if(!local)return remote;if(!remote)return local;
 return Date.parse(remote.updatedAt||0)>Date.parse(local.updatedAt||0)?remote:local;
}
module.exports={makeSyncEnvelope,newestWins};
