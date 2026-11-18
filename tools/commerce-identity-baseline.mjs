import assert from 'node:assert/strict';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
// Explicitly verified model corrections; unrelated fields remain frozen.
export function applyReviewedAmazonHolds(before,after){
 for(const [id,oldAsin,asin,kind,model] of [['uvb_t5_desert_std','B00JZFJ5R0','B00AQU8HAO','10.0','OS5-24'],['uvb_t5_forest_std','B00JZFJ5LQ','B00AQU8GF0','5.0','FS5-24']]){
  const old=before[id],now=after[id];
  assert.equal(old.asin,oldAsin);assert.equal(now.asin,asin);
  assert.equal(now.affiliateUrl,'https://www.amazon.co.jp/dp/'+asin+'?tag=kamelife090e-22');
  assert.equal(now.amazonLinkStatus,'verified');
  assert.equal(now.name,`Zoo Med ReptiSun ${kind} T5 HO 24W 交換管（${model}）`);
  assert.equal(now.rakutenSearchTerm,`Zoo Med ReptiSun ${kind} T5 HO 24W ${model}`);
  for(const key of ['asin','affiliateUrl','amazonLinkStatus','name','rakutenSearchTerm'])old[key]=now[key];
 }
}

// Match the already-published scheduled Rakuten sync, not values from the candidate.
// Only feed-managed fields may differ from the historical product fixture.
export function applyCommittedRakutenSync(before,after,root){
 const ref='006da867b21cf6d68371654d639202144783b8bb';
 const keys=['rakutenLastUpdated','rakutenUrl','rakutenStatus','rakutenItemCode','rakutenPrice','rakutenShop','rakutenConfidence','rakutenImageUrl'];
 const committed=vm.runInNewContext(execFileSync('git',['-C',root,'show',ref+':data/products.js'],{encoding:'utf8'})+'\nPRODUCTS;');
 assert.deepEqual(Object.keys(committed),Object.keys(before));
 assert.deepEqual(Object.keys(after),Object.keys(before));
 for(const [id,product] of Object.entries(before))for(const key of keys){
  const pinned=committed[id],actual=after[id];
  assert.equal(Object.hasOwn(actual,key),Object.hasOwn(pinned,key),id+' committed feed presence '+key);
  assert.deepEqual(actual[key],pinned[key],id+' committed feed '+key);
  if(Object.hasOwn(pinned,key))product[key]=pinned[key];
  else delete product[key];
 }
}
