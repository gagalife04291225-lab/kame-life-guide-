import assert from 'node:assert/strict';
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
