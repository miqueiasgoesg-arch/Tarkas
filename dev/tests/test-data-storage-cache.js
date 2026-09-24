const assert=require('assert');
const fs=require('fs');
const os=require('os');
const path=require('path');
const {setDataRoot,writeData,readData}=require('../../src/shared/dataStorage');
const {getStatus}=require('../../src/services/tarkovData');

const root=fs.mkdtempSync(path.join(os.tmpdir(),'tarkas-storage-'));
try{
  const missing=path.join(root,'not-created');
  setDataRoot(missing);
  assert.strictEqual(getStatus().last,null);
  assert.strictEqual(fs.existsSync(missing),false);
  setDataRoot(root);
  writeData('regular','cache-check',{version:1});
  const first=readData('regular','cache-check');
  const second=readData('regular','cache-check');
  assert.deepStrictEqual(first.data,{version:1});
  assert.strictEqual(second,first);
  writeData('regular','cache-check',{version:2});
  const refreshed=readData('regular','cache-check');
  assert.deepStrictEqual(refreshed.data,{version:2});
  assert.notStrictEqual(refreshed,first);
  console.log('data-storage-cache ok');
}finally{
  fs.rmSync(root,{recursive:true,force:true});
}
