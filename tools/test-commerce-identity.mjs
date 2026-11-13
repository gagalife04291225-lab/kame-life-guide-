import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {PRODUCTS}=require('../data/products.js');
for(const [id,name] of [['uvb_t5_desert_std','Zoo Med ReptiSun 10.0 UVB T5'],['uvb_t5_forest_std','Zoo Med ReptiSun 5.0 UVB T5']]){
 const p=PRODUCTS[id];assert.equal(p.name,name);assert.equal(p.affiliateUrl,null);assert.equal(p.asin,null);assert.equal(p.rakutenStatus,'search');assert.match(p.rakutenSearchTerm,/Zoo Med ReptiSun/);
}
console.log('PASS: 2 intended T5 products preserved; ambiguous direct ASINs withheld; named search retained');
