import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const fx=JSON.parse(fs.readFileSync(path.join(root,'tools/lifespan-fixtures.json'),'utf8'));
const compare=['hermann-vs-greek','hermann-vs-russian','elongated-vs-hermann','musk-vs-razorback','reeves-vs-japanese-pond','painted-vs-red-eared-slider','red-footed-vs-leopard','three-toed-vs-eastern-box','three-toed-vs-gulf-coast'];
const files=['ranking-beginner-top10.html',...compare.map(x=>`compare/${x}.html`),'guides/small-turtle-top10.html','guides/small-best-turtles.html'];
const strip=s=>s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
let checks=0;const check=(x,msg)=>{assert.ok(x,msg);checks++;};
for(const file of files){
 const s=fs.readFileSync(path.join(root,file),'utf8');
 check(!s.includes('寿命目安'),`${file}: old table heading`);
 for(const m of s.matchAll(/<a href="([^"]*species\/([^/"#]+)\.html#lifespan-evidence)">([^<]+)<\/a>/g)){
  const [_,url,key,label]=m;
  check(!!fx[key],`${file}: fixture ${key}`);
  check(fs.readFileSync(path.resolve(root,path.dirname(file),url.split('#')[0]),'utf8').includes('id="lifespan-evidence"'),`${file}: target anchor`);
  if(file.startsWith('compare/') || file.startsWith('ranking')) check(label===fx[key][0],`${file}: label drift ${key}`);
 }
 for(const m of s.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
  const data=JSON.parse(m[1]);checks++;
  const nodes=Array.isArray(data)?data:[data,...(data['@graph']||[])];
  for(const node of nodes.filter(n=>n['@type']==='FAQPage')) for(const q of node.mainEntity.filter(q=>/寿命|長生き/.test(q.name))){
   check(strip(s.replace(/<script[\s\S]*?<\/script>/g,'')).includes(strip(q.acceptedAnswer.text)),`${file}: FAQ ${q.name}`);
  }
 }
 if(file.startsWith('compare/')) check(s.includes('平均寿命を同じ条件で比べたものではありません'),`${file}: qualifier`);
}
const ranking=fs.readFileSync(path.join(root,files[0]),'utf8');
check((ranking.match(/<strong>寿命の資料(?:（種全体）)?<\/strong>/g)||[]).length===10,'ten ranking cards');
check(ranking.includes('<a href="https://www.pondturtle.com/lturtle.html">成体から23年5か月の飼育記録</a>'),'Podocnemis unifilis direct Slavens record, no invented species page');
check(!files.map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('').includes('適切な飼育下では30〜50年以上生きます'),'no all-species promise');


const legalText=fs.readFileSync(new URL('../compare/three-toed-vs-gulf-coast.html',import.meta.url),'utf8');
assert.ok(!legalText.includes('規制なし（野生採集個体の輸入禁止）'));
assert.equal((legalText.match(/CITES附属書II（国際取引の規制）/g)||[]).length,2);
assert.ok(legalText.includes('輸出入の手続きと国内での譲渡は別'));

for(const file of ['guides/low-odor-top10-turtles.html','guides/beginner-top10-turtles.html','ranking-beginner-top10.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert.ok(!/このランキングの種は30〜50年以上|小型水棲種でも30〜40年|40〜50年の長期的パートナー/.test(html));
}
const diagnosis=fs.readFileSync(path.join(root,'shindan/index.html'),'utf8');
assert.ok(diagnosis.includes('var LIFESPAN_DATA = {};'));
assert.ok(!diagnosis.includes('50〜100年生きることもあります'));

const hermannHint=ranking.match(/bfy-rec">→ ヘルマンリクガメ<\/div>[\s\S]*?<span class="bfy-note">([^<]+)/)?.[1];
assert.ok(hermannHint&& !/\d+年/.test(hermannHint),'Hermann hint must not inherit Russian numeric record');

console.log(`lifespan crosspages: ${checks} fixture/FAQ checks plus 9 legal/residual checks PASS (14 articles + diagnosis)`);
