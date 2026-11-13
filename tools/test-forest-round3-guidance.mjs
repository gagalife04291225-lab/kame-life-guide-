import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const load=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const base=p=>execFileSync('git',['-C',root,'show','71a63860:'+p],{encoding:'utf8'}).replace(/\r\n/g,'\n');
const paths=['species/spenglers-leaf-turtle.html','species/brown-wood-turtle-manni.html'];
const addedSources=['https://theturtleroom.org/species-profile/geoemyda-spengleri/','https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/painted-central-american-wood-turtle-care'];
const urls=s=>[...s.matchAll(/\bhref="([^"]+)"/g)].map(x=>x[1]).filter(x=>!addedSources.includes(x));
const scripts=s=>[...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(x=>x[0].replace(/(\.\.\/(?:data\/products|js\/starter-kit)\.js)\?v=[a-f0-9]+/g,'$1'));
// PR240 law-only text is independently tested and must match its committed content exactly.
execFileSync('python',['tools/test_cites_document_wording.py'],{cwd:root,stdio:'pipe'});
const normalizeLaw=(text,path)=>{const legal=execFileSync('git',['-C',root,'show','c763fa94:'+path],{encoding:'utf8'}).replace(/\r\n/g,'\n');const box=x=>x.match(/<div class="cites-box">.*?<\/div>/)?.[0];assert.equal(box(text),box(legal));return text.replace(box(text),box(base(path)));};
let checks=0;const ok=x=>{assert.ok(x);checks++;};
for(const path of paths){
 let now=normalizeLaw(load(path),path);const old=base(path);
 if(path==='species/brown-wood-turtle-manni.html'){
  const [value,note,url]=JSON.parse(load('tools/lifespan-fixtures.json'))['brown-wood-turtle-manni'];
  assert.ok(now.includes(note));
  assert.equal([...now.matchAll(/href="([^"]+)"/g)].filter(m=>m[1]===url).length,1);
  now=now.replace('href="'+url+'"','data-lifespan-source="'+url+'"');
  const exact="lifespan: '"+value+"', lifespanLabel: '寿命の資料'";
  assert.equal(now.split(exact).length-1,2);
  now=now.replaceAll(exact,"lifespan: '20〜50年'");
 }
 assert.deepEqual(urls(now),urls(old),'Existing links/order unchanged');checks++;
 assert.deepEqual(scripts(now),scripts(old),'Scripts including JSON-LD/GA4 unchanged except shared asset cache version');checks++;
 for(const m of now.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){JSON.parse(m[1]);checks++;}
 const temp=s=>[...s.matchAll(/\d+(?:〜\d+)?℃/g)].map(x=>x[0]);
 assert.deepEqual(temp(now),temp(old),'Temperature tokens unchanged');checks++;
 const price=s=>[...s.matchAll(/[¥￥]\s*[\d,]+|[\d,]+円/g)].map(x=>x[0]);
 assert.deepEqual(price(now),price(old),'Prices unchanged');checks++;
 const cites=s=>s.split('\n').filter(x=>/CITES|cites_/.test(x));
 assert.deepEqual(cites(now),cites(old),'CITES text unchanged');checks++;
}
const sp=load(paths[0]),manni=load(paths[1]);
ok(!/1年後|10年後|60cm規格[^<。]*終生飼育|飼育の難所は広さではなく|UVI 1〜2|60〜80cmケージで安定/.test(sp));
ok(sp.includes('成長の速さや到達する大きさには個体差'));
ok(sp.includes('水場や隠れ家を置いた後にも歩き回れる床面積'));
ok(sp.includes('UVB照明を使う飼育例あり')&&sp.includes('本種に一律の出力を定めた資料ではありません'));
ok(sp.includes(addedSources[0]));
ok(manni.includes('90cmは当サイトの目安')&&manni.includes('成体1匹に120×60cm以上'));
ok(manni.includes(addedSources[1])&&manni.includes('その後にも歩き回れる広さ'));
assert.throws(()=>assert.ok(!/1年後|10年後|UVI 1〜2/.test(base(paths[0]))),{name:'AssertionError'});checks++;
assert.throws(()=>assert.ok(base(paths[1]).includes('成体1匹に120×60cm以上')),{name:'AssertionError'});checks++;
console.log(`PASS ${checks}: forest guidance; old fails; links/scripts/JSON-LD/prices/temperature/CITES unchanged`);
