import {normalizeSourcedLifespan} from './lifespan-baseline.mjs';
import './test-next-species-conditions.mjs';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/\r\n/g,'\n');
const html=read('shindan/index.html');
const base='88b143a9336aa8b41a0d3d886e0554320c7bdc94';
function species(src){const c=vm.createContext({window:{}});vm.runInContext(src+';this.S=SPECIES;',c);return c.S;}
const old=species(execFileSync('git',['-C',root,'show',base+':shindan/species.js'],{encoding:'utf8'}).replace(/\r\n/g,'\n'));
let last;const warnings=[];
const c=vm.createContext({window:{},console:{warn(...args){warnings.push(args);}},document:{getElementById(){return {style:{},parentElement:{setAttribute(){}}};}},ga4Event(){},saveResultToUrl(){},calcMatchPercent(){return 90;},showResult(sp,pct,runners){last={sp,runners};}});
vm.runInContext(read('shindan/species.js')+';this.S=SPECIES;',c);
const compatStart=html.indexOf('function applyAllRouteTagCompat(');
const calcStart=html.indexOf('function calcResult()');
assert.ok(compatStart>=0&&calcStart>compatStart);
vm.runInContext(html.slice(compatStart,html.indexOf('// ===== 結果表示 =====')),c);
let cases=0;
for(const [id,list] of Object.entries(c.S)) for(const scores of [{},{humid:100,advanced:100,tropical_climate:100,charisma:100,collector:100,expert:100},{beginner:10},{rare:10,expert:10,ultra_rare:10}]){
 c.selectedRoute={id,species:list};c.scores={...scores};last=null;c.calcResult();
 assert.ok(last?.sp);assert.notEqual(last.sp.name,'ホームセオレガメ');
 for(const sp of last.runners||[])assert.notEqual(sp.name,'ホームセオレガメ');cases++;
}
assert.equal(cases,20);assert.deepEqual(warnings,[]);
const stable=s=>JSON.stringify(s,(k,v)=>typeof v==='function'?v.toString():v);

// These exact care edits are asserted by test-next-species-conditions.
// Preserve all legal/routing/function fields in this original-baseline comparison.
function normalizeIndependentCare(a,b){
 normalizeSourcedLifespan(a,b);
 if(a.slug==='chinese-stripe-necked-turtle'){assert.equal(b.cites,'CITES III');delete a.cites;delete b.cites;}
 if(a.slug==='impressed-tortoise'){
  a.reason=b.reason;
  a.specs={...a.specs,'主な食事':b.specs['主な食事'],'温度':b.specs['温度']};
  a.coreSpecs={...a.coreSpecs,temp:b.coreSpecs.temp,diet:b.coreSpecs.diet};
 }
 if(['elongated-tortoise','red-footed-tortoise'].includes(a.slug)){
  a.coreSpecs={...a.coreSpecs,diet:b.coreSpecs.diet};
  if(a.slug==='elongated-tortoise')a.specs={...a.specs,'主な食事':b.specs['主な食事']};
 }
}
let unchanged=0;
for(const route of ['land','aquatic','forest','exotic']){
 assert.equal(old[route].length,c.S[route].length);
 old[route].forEach((sp,i)=>{const now=c.S[route][i];assert.equal(sp.name,now.name);if(sp.name!=='ホームセオレガメ'){const a={...sp},b={...now};if(['alabama-map-turtle','european-pond-turtle','spiny-softshell-turtle','pancake-tortoise','red-eared-slider','yellow-bellied-slider','cumberland-slider'].includes(sp.slug)){for(const k of ['cites','legalNote','diagnosisNotice',...(sp.legal==='conditional_invasive'?['reason']:[])]){delete a[k];delete b[k];}}normalizeIndependentCare(a,b);assert.equal(stable(a),stable(b),sp.name);unchanged++;}});
}
assert.equal(unchanged,118);
const home=c.S.land.find(s=>s.name==='ホームセオレガメ');
assert.ok(home.hasPage);assert.equal(home.slug,'home-hinge-back-tortoise');assert.equal(home.legal,'cites_i');assert.equal(home.availability,'archive');assert.equal(home.match({}),false);assert.equal(home.score({}),-9999);
assert.ok(home.diagnosisNotice.includes('飼育が一律に禁止されたという意味ではありません'));
console.log(`PASS: Home excluded from actual calcResult in ${cases} route/score cases; other ${unchanged} species legal/routing/functions identical; independently asserted care fields normalized; Home page retained.`);
