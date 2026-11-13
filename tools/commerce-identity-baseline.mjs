import assert from 'node:assert/strict';
// Explicitly approved identity holds; do not ignore arbitrary commercial changes.
export function applyReviewedAmazonHolds(before,after){
 for(const [id,asin] of [['uvb_t5_desert_std','B00JZFJ5R0'],['uvb_t5_forest_std','B00JZFJ5LQ']]){
  const old=before[id],now=after[id];
  assert.equal(old.asin,asin);assert.equal(old.affiliateUrl,'https://www.amazon.co.jp/dp/'+asin+'?tag=kamelife090e-22');
  assert.equal(now.asin,null);assert.equal(now.affiliateUrl,null);assert.equal(now.amazonLinkStatus,'identity_review');
  assert.equal(now.name,old.name);assert.equal(now.rakutenSearchTerm,old.rakutenSearchTerm);
  old.asin=null;old.affiliateUrl=null;old.amazonLinkStatus='identity_review';
 }
}
