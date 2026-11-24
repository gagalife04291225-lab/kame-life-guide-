// Offline integration fixture for the live route, result, saved URL and share handlers.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const historical='3f6bc64286dc4139dfe7a5ea3402fb160a769546';
const baseline=()=>execFileSync('git',['show',historical+':shindan/index.html'],{encoding:'utf8',cwd:root});
function harness({url='https://kamelifeguide.com/shindan/', old=false}={}){
 const page=old?baseline():read('shindan/index.html');
 const scripts=[...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 const main=scripts.find(s=>s.includes('function tryRestoreFromUrl()'));
 const loader=scripts.find(s=>s.includes('window.__lazyScriptCache = {}'));
 const replay=main.slice(0,main.indexOf('// ===== 初期化（URL復元対応） ====='));
 let shown='screen-start', stack=[], dom=new Map(), emitted=[], attempts=[], timer=[], allButtons=[], shares=[];
 let ctx, lastFocus=null;
 class Node{
  constructor(id){this.id=id;this.dataset={};this.style={};this.attrs={};this.events={};this.children=[];this.tokens=new Set();this._html='';this.hidden=false;this.textContent='';
   this.classList={add:(...a)=>{a.forEach(s=>this.tokens.add(s));if(id.startsWith('screen-')&&a.includes('active'))shown=id},remove:(...a)=>a.forEach(s=>this.tokens.delete(s)),contains:x=>this.tokens.has(x)};
  }
  set innerHTML(s){this._html=s;this.children=[];if(this.id==='choices')allButtons=[];for(const [,id] of s.matchAll(/ id="([^"]+)"/g)) if(!dom.has(id))dom.set(id,new Node(id));} get innerHTML(){return this._html;}
  appendChild(e){this.children.push(e);if(this.id==='choices')allButtons.push(e);return e}
  setAttribute(k,v){this.attrs[k]=v}
  hasAttribute(k){return k in this.attrs}
  getAttribute(k){return this.attrs[k]??null}
  removeAttribute(k){delete this.attrs[k]}
  addEventListener(k,f){(this.events[k]??=[]).push(f)}
  removeEventListener(k,f){this.events[k]=(this.events[k]||[]).filter(x=>x!==f)}
  getBoundingClientRect(){return {top:-200}}
  get offsetHeight(){return 500}
  click(){if(!this.disabled)(this.events.click||[]).forEach(f=>f.call(this,{target:this,preventDefault(){}}))}
  querySelector(s){if(s==='.sk-card')return this._html.includes('sk-card')?new Node(s):null;return new Node(s)}
  querySelectorAll(){return []}
  get previousElementSibling(){return new Node('prev')}
  get parentElement(){return this._parent??=new Node('parent')}
  focus(){lastFocus=this.id;}
  closest(){return null}
 }
 for(const m of page.matchAll(/<[^>\n]*(?:\n[^>]*?)?\bid="([\w-]+)"[^>]*>/g)){const el=new Node(m[1]);el.hidden=/\shidden\b/.test(m[0]);dom.set(m[1],el);}
 const doc={getElementById:id=>dom.get(id)||null,querySelector:s=>new Node(s),
  querySelectorAll(s){return s==='.choice-btn'?allButtons:s==='.screen'?[...dom.values()].filter(x=>x.id.startsWith('screen-')):[];},
  createElement:t=>new Node(t),createDocumentFragment:()=>new Node('frag'),addEventListener(){},
  head:{appendChild(s){
    attempts.push(s.src);
    const bare=s.src.split('?')[0]; assert.ok(['species.js','../data/products.js','../js/starter-kit.js'].includes(bare),s.src);
    queueMicrotask(()=>{
      vm.runInContext(read(bare==='species.js'?'shindan/species.js':bare.slice(3)),ctx);
      if(bare==='../js/starter-kit.js')ctx.mountStarterKit=(options,id)=>{doc.getElementById(id).innerHTML=ctx.renderStarterKitHtmlV2(options.equipmentKey,options)};
      s.onload?.();
    });
  }}
 };
 const winEvents={};
 const w={scrollTo(){},addEventListener(k,f){(winEvents[k]??=[]).push(f);},
  removeEventListener(k,f){winEvents[k]=(winEvents[k]||[]).filter(x=>x!==f);},location:new URL(url)}; const h={replaceState(a,b,s){w.location=new URL(s);ctx.location=w.location;stack.push(s)}};
 ctx=vm.createContext({console:{warn:(...a)=>emitted.push(['warn',...a])},document:doc,window:w,location:w.location,history:h,URL,URLSearchParams,navigator:{share:p=>{shares.push(p);return Promise.resolve();}},ga4Event:(...x)=>emitted.push(x),requestAnimationFrame(){},setTimeout:(f,ms)=>{if(ms===250)timer.push(f);},clearTimeout(){}});
 vm.runInContext(read('shindan/routes.js')+'\n'+loader+'\n'+replay,ctx);
 ctx.resetTimers=()=>{const f=timer.shift();assert.ok(f);f();};
 return {ctx,dom,attempts,emitted,stack,shares,winEvents,get shown(){return shown},get focus(){return lastFocus},btns:()=>allButtons};
}
const settle=()=>new Promise(r=>setImmediate(r));
async function run(housing,care,{lowBudget=false,space=0,...o}={}){
 const H=harness(o),c=H.ctx;
 c.startQuizWithRoute('land');
 const n=vm.runInContext('selectedRoute.questions.length',c);
 for(let i=0;i<n;i++){const index= i===n-2 ? (lowBudget?0:2):(i===0?space:0);H.btns()[index].click(); c.resetTimers();}
 H.btns()[housing].click();c.resetTimers();H.btns()[care].click();c.resetTimers();
 await settle();return H;
}

const notice=h=>h.dom.get('result-preparation-note');
const kit=h=>h.dom.get('starter-kit-section').innerHTML.includes('sk-card');
const hasShownKit=h=>!h.dom.get('result-kit-jump').hidden && kit(h);
const gate=h=>h.emitted.find(e=>e[0]==='readiness_gate_result')?.[1];
const results=h=>h.emitted.filter(e=>e[0]==='diagnosis_result_view');
const encoded=(route,name)=>'https://kamelifeguide.com/shindan/?'+new URLSearchParams({r:route,s:name});
const assertNeutral = h => {
  assert.equal(h.shown,'screen-result');
  assert.equal(hasShownKit(h),false);
  assert.equal(h.dom.get('starter-kit-section').innerHTML,'');
  assert.equal(h.dom.get('res-cta-top').innerHTML,'');
  assert.equal(h.dom.get('res-cta-block').innerHTML,'');
  assert.equal(h.dom.get('res-runnerups').hidden,true);
  assert.equal(h.dom.get('score-meter').style.display,'none');
  assert.equal(h.focus,'result-preparation-title');
  assert.ok(!notice(h).hidden);
  assert.match(notice(h).innerHTML,/before-keeping\.html#keeping-checklist/);
};
const original=await run(0,0,{space:0,lowBudget:true,old:true});
assert.equal(original.dom.get('res-name').textContent,'ロシアリクガメ');
assert.equal(gate(original).verdict,'A');
assert.ok(hasShownKit(original));
assert.match(original.dom.get('starter-kit-section').innerHTML,/¥12,900〜¥29,800/);
const corrected=await run(0,0,{space:0,lowBudget:true});
assert.equal(corrected.dom.get('res-name').textContent,original.dom.get('res-name').textContent);
assert.equal(gate(corrected).verdict,gate(original).verdict);
assertNeutral(corrected);
assert.match(notice(corrected).innerHTML,/60cm程度まで.*90cm級以上/);
assert.match(notice(corrected).innerHTML,/10,000円.*12,900円/);
assert.equal(results(corrected).length,1);
assert.equal(corrected.emitted.some(e=>e[0]==='diagnosis_cta_view'),false);
assert.equal(corrected.emitted.find(e=>e[0]==='shindan_result')[1].match_pct,original.emitted.find(e=>e[0]==='shindan_result')[1].match_pct);
const ordinary=await run(0,0,{space:2});
const earlier=await run(0,0,{space:2,old:true});
assert.equal(hasShownKit(ordinary),true);
assert.equal(notice(ordinary).hidden,true);
assert.equal(ordinary.dom.get('res-name').textContent,earlier.dom.get('res-name').textContent);
assert.equal(ordinary.dom.get('starter-kit-section').innerHTML,earlier.dom.get('starter-kit-section').innerHTML);
assert.equal(ordinary.emitted.find(e=>e[0]==='shindan_result')[1].match_pct,earlier.emitted.find(e=>e[0]==='shindan_result')[1].match_pct);
assert.equal(ordinary.winEvents.scroll.length,1);
ordinary.winEvents.scroll[0]();
assert.ok(ordinary.dom.get('exit-capture').classList.contains('ec-visible'));
vm.runInContext('showResult(result,86);',ordinary.ctx);
assert.equal(ordinary.winEvents.scroll.length,1);
assert.equal(ordinary.dom.get('ec-btn-sk').events.click.length,1);
vm.runInContext('showResult(result,null,null,true);',ordinary.ctx);
assert.equal(ordinary.winEvents.scroll.length,0);
assert.equal(ordinary.dom.get('ec-btn-sk').events.click.length,0);
assertNeutral(ordinary);
assert.equal(ordinary.dom.get('exit-capture').classList.contains('ec-visible'),false);
const budgetOnly=await run(0,0,{space:2,lowBudget:true});
assertNeutral(budgetOnly);assert.match(notice(budgetOnly).innerHTML,/初期費用/);
assert.doesNotMatch(notice(budgetOnly).innerHTML,/90cm級以上/);
const capacityOnly=await run(0,0,{space:0});
assertNeutral(capacityOnly);assert.match(notice(capacityOnly).innerHTML,/90cm級以上/);
assert.doesNotMatch(notice(capacityOnly).innerHTML,/予算を上回ります/);
const housingBlocked=await run(3,0,{space:0});
assertNeutral(housingBlocked);assert.match(notice(housingBlocked).innerHTML,/同居する人の同意/);
assert.equal(gate(housingBlocked).verdict,'B');
const stopped=await run(3,2,{space:2});
assert.equal(stopped.shown,'screen-gate-stop');assert.equal(stopped.stack.length,0);
async function restore(url) {
 const h=harness({url}); await h.ctx.window.loadSpecies(); await h.ctx.window.loadResultAssets();
 return {h,restored:h.ctx.tryRestoreFromUrl()};
}
for(const link of [housingBlocked.stack.at(-1),encoded('land','ロシアリクガメ')]) {
 let {h,restored}=await restore(link);assert.ok(restored);assertNeutral(h);
 const warning=notice(h).innerHTML;assert.match(warning,/飼育の準備は未確認/);
 assert.doesNotMatch(warning,/現状では飼育の前提が整っていません|1万円|予算を上回ります/);
 assert.equal(h.dom.get('gate-notice').hidden,true);
 h.dom.get('btn-share').click();
 assert.equal(h.shares.length,1);const item=h.shares[0];
 assert.match(item.text,/ロシアリクガメの参考情報/);
 assert.doesNotMatch(item.text,/相性|％|%|予算|同意|住まい|入院/);
 assert.deepEqual([...new URL(item.url).searchParams.keys()],['r','s']);
 ({h,restored}=await restore(item.url));assert.ok(restored);assertNeutral(h);
 assert.equal(notice(h).innerHTML,warning);
 assert.equal(h.dom.get('res-name').textContent,'ロシアリクガメ');
}
for(const url of [encoded('unknown','ロシアリクガメ'),encoded('land',''),encoded('aquatic','ロシアリクガメ'),
                   encoded('land','%'),encoded('land','ロシアリクガメ')+'&r=land',
                   encoded('land','ロシアリクガメ')+'&s=ロシアリクガメ','https://kamelifeguide.com/shindan/']) {
 const {h,restored}=await restore(url);assert.equal(restored,false);assert.equal(h.shown,'screen-start');
 assert.equal(h.shares.length,0);assert.equal(kit(h),false);
}
const recovered=harness();
await recovered.ctx.window.loadSpecies();await recovered.ctx.window.loadResultAssets();
vm.runInContext(`selectedRoute=ROUTES.find(r=>r.id==='land');
  scores={medium:3,budget_under10k:1};
  result=SPECIES.land.find(sp=>sp.slug==='russian-tortoise');
  this.__kit=generateKitByTier;
  generateKitByTier=undefined;
  showResult(result,86);
`,recovered.ctx);
assert.match(notice(recovered).innerHTML,/予算に収まるとは未確認/);
vm.runInContext('generateKitByTier=__kit;',recovered.ctx);
assert.equal(vm.runInContext('refreshResultGuardBeforeKit(result)',recovered.ctx),false);
assertNeutral(recovered);
assert.match(notice(recovered).innerHTML,/12,900円/);
assert.equal(results(recovered).length,1); // Retry cannot duplicate species result analytics.
const synthetic=harness();
await synthetic.ctx.window.loadSpecies();await synthetic.ctx.window.loadResultAssets();
const master=JSON.parse(read('data/species-master.json'));
for(const [slug,width] of Object.entries(vm.runInContext('ADULT_ENCLOSURE_WIDTH',synthetic.ctx))) {
 const row=master.species.find(sp=>sp.slug===slug);
 assert.match(row?.care?.enclosure_jp?.value??'',new RegExp(String(width)),slug+' kept in sync with adult source');
}
const example=(route,scores,slug)=>vm.runInContext(`selectedRoute=ROUTES.find(r=>r.id===${JSON.stringify(route)});
 scores=${JSON.stringify(scores)};
 getResultPreparationGuard(SPECIES.all.find(sp=>sp.slug===${JSON.stringify(slug)}),false);`,synthetic.ctx);
const pond=example('aquatic',{small_tank:3},'japanese-pond-turtle');
assert.ok(pond.blocksCommerce);assert.match(pond.notes[0],/60cm程度まで.*90cm級以上/);
const musk=example('aquatic',{small_tank:3},'musk-turtle');
assert.equal(musk.blocksCommerce,false); // 30–60 band does not prove a given 30cm tank fits.
assert.match(musk.notes[0],/30〜60cmの範囲.*実際の幅は未確認.*60cm級以上/);
const wild=example('aquatic',{large_tank:3},'japanese-pond-turtle');
assert.equal(wild.blocksCommerce,false); // no inferred upper bound on 90cm+ choice.
for(const [field,cap] of [['budget_10_30k',30000],['budget_30_70k',70000]]) {
 vm.runInContext(`calcBundlePriceRange=()=>({low:${cap+100}});`,synthetic.ctx);
 const expensive=example('land',{large:3,[field]:1},'russian-tortoise');
 assert.ok(expensive.blocksCommerce);
 assert.match(expensive.notes[0],new RegExp(cap.toLocaleString('ja-JP')+'円'));
 vm.runInContext(`calcBundlePriceRange=()=>({low:${cap}});`,synthetic.ctx);
 assert.equal(example('land',{large:3,[field]:1},'russian-tortoise').blocksCommerce,false);
}
console.log('PASS: source-exact old/new 60cm+10k, independent budget & capacity gates, normal result kit byte-equivalent, normal score schema, B/C, restoration & repeated sharing without source answers, invalid URLs and retry re-gate.');
