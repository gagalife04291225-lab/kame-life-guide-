// Wording may change; record values, source identities and numeric claims may not.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const current=JSON.parse(fs.readFileSync(new URL('tools/lifespan-fixtures.json',root),'utf8'));
const before=JSON.parse(fs.readFileSync(new URL('tools/lifespan-style-baseline.json',root),'utf8'));
assert.deepEqual(Object.keys(current),Object.keys(before));
let checks=1;
for(const [key,value] of Object.entries(current)){
 for(const [index,field] of [[0,'value'],[2,'url'],[3,'source']]){assert.equal(value[index],before[key][field],key+' fixed value/source');checks++;}
 const oldNums=new Set(before[key].numbers);
 for(const n of value[1].match(/\d+(?:\.\d+)?/g)||[]){assert.ok(oldNums.has(n),key+' no new numeric claim '+n);checks++;}
 assert.ok(!/今回の照合では|長期飼育を考える際、この計算の前提|取り違えないようにします/.test(value[1]),key+' no work-log phrasing');checks++;
}
console.log(`${checks} lifespan style invariants PASS`);
