import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url), base='5c2b665555dc513072b7385f66786bc49f5ac154';
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const old=p=>execFileSync('git',['show',base+':'+p],{cwd:root,encoding:'utf8'});
function context(qf){let c=vm.createContext({console,window:{},document:{}});vm.runInContext(read('data/products.js')+'\n'+read('js/starter-kit.js')+'\n'+qf,c);return c;}
const before=context(old('js/quick-facts.js')),after=context(read('js/quick-facts.js'));
const opts={equipmentKey:'semi_aquatic_small',name:'ミシシッピニオイガメ',difficulty:'入門'};
const html=after.renderQuickFacts({...opts,monthlyCostReference:true});
assert.match(html,/低価格帯の候補合計/); assert.match(html,/¥10,300〜¥24,000/);
assert.match(html,/価格未掲載の商品・別売器具などは含みません/);
assert.match(html,/<a href="#starter-kit-root">下の飼育セットガイドで確認<\/a>/);
assert.ok(!html.includes('¥1,000〜2,500'));
assert.ok(!html.includes('今日から'));assert.ok(!after.renderStickyCTA(opts).includes('全部選んだ'));
assert.match(read('species/musk-turtle.html'),/mountQuickFacts\(\{ monthlyCostReference: true,/);
assert.equal((read('species/musk-turtle.html').match(/monthlyCostReference/g)||[]).length,1);
for(const key of Object.keys(after.QF_MONTHLY)){
 assert.equal(after.QF_MONTHLY[key],before.QF_MONTHLY[key]);
 const o={equipmentKey:key,name:'別の種',difficulty:'中級'};
 assert.deepEqual([...after.renderQuickFacts(o).matchAll(/<span class="qf-cost">(.*?)<\/span>/g)].map(m=>m[1]),[...before.renderQuickFacts(o).matchAll(/<span class="qf-cost">(.*?)<\/span>/g)].map(m=>m[1]));
}
const home={equipmentKey:'tortoise_forest',name:'ホームセオレガメ'};
assert.equal(after.renderQuickFacts(home),before.renderQuickFacts(home));
assert.equal(after.renderStickyCTA(home),before.renderStickyCTA(home));
for(const p of ['data/products.js','js/starter-kit.js','shindan/species.js','shindan/routes.js'])assert.equal(read(p),old(p),p+' unchanged');
console.log('PASS: budget total unchanged, exclusions visible, musk monthly reference only, 8 fallback tables unchanged, Home exact output, products/starter/diagnosis unchanged.');

vm.runInContext(read('shindan/species.js')+';this.species=SPECIES;',after);
let checked=0;
for(const [route,list] of Object.entries(after.species).filter(([r])=>r!=='all'))for(const sp of list){
 if(sp.name==='ホームセオレガメ')continue;
 const o={...sp,equipmentKey:sp.equipmentKey||route};
 const expected=before.renderQuickFacts(o).replace('初期費用目安','低価格帯の候補合計').replace('機材セット合計（目安）','価格未掲載の商品・別売器具などは含みません').replace('この亀を今日から飼えるセットを見る →','飼育セットガイドを見る →');
 assert.equal(after.renderQuickFacts(o),expected,sp.name);
 const sticky=before.renderStickyCTA(o).replace('はじめての方向けに全部選んだ飼育セットを見る','飼育セットガイドを見る').replace('はじめての方向け飼育セットを見る','飼育セットガイドを見る');
 assert.equal(after.renderStickyCTA(o),sticky,sp.name); checked++;
}
assert.equal(checked,118);console.log('PASS: all 118 non-Home species exact renderer outputs differ only by approved copy.');
