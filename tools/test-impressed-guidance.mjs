import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const base='fde885bd';
const before=p=>execFileSync('git',['show',`${base}:${p}`],{encoding:'utf8'});
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const path='species/impressed-tortoise.html', html=read(path), old=before(path);
const faq=s=>[...s.matchAll(/<div class="faq-body">([\s\S]*?)<\/div>/g)].map(m=>m[1]);
const blocks=s=>[...s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const all=blocks(html).flatMap(b=>b['@graph']||[b]);
const schema=all.find(b=>b['@type']==='FAQPage');
assert.ok(schema);assert.deepEqual(schema.mainEntity.map(e=>e.acceptedAnswer.text),faq(html));
for(const forbidden of ['22〜28℃','水槽用クーラー','週2〜3回提供するのが理想','人工飼料だけでは本種は長期的に衰弱','草食（キノコ','冷やす系','クーラー・加湿器が必須','室温を22〜28℃','低温（20〜25℃','UVB 1.0〜2.0'])assert.ok(!html.includes(forbidden),forbidden);
for(const required of ['菌食中心（キノコ・植物）','植物性の餌','人工飼料を混ぜた','隠れ家と活動場所','生息地の気温','卵の孵化条件','加温した退避場所'])assert.ok(html.includes(required),required);
assert.throws(()=>assert.ok(!old.includes('水槽用クーラー')),'old wording fails');
// Existing navigation / purchase URLs retain order, with only two explicit research citations added.
const links=s=>[...s.matchAll(/\bhref="([^"]*)"/g)].map(m=>m[1]);
const added=['https://journals.ku.edu/reptilesandamphibians/article/download/15951/14232','https://colombia.wcs.org/Portals/113/TSA-Magazine-2014.pdf#page=70'];
assert.deepEqual(links(html).filter(u=>!added.includes(u)),links(old));
const scripts=s=>[...s.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0].replace(/(\.\.\/(?:data\/products|js\/starter-kit)\.js)\?v=[a-f0-9]{12}/g,'$1?v=HASH')).filter(s=>!s.includes('application/ld+json'));
assert.deepEqual(scripts(html),scripts(old),'selection/GA/mount scripts unchanged');
const master=JSON.parse(read('data/species-master.json')), prior=JSON.parse(before('data/species-master.json'));
const target=master.species.find(s=>s.slug==='impressed-tortoise'), prev=prior.species.find(s=>s.slug==='impressed-tortoise');
assert.ok(html.includes(target.care.enclosure_jp.value));
const mutable=new Set(['value','sources','last_verified']);
for(const k of ['air_temp_c','diet','enclosure_jp']){
 const a=structuredClone(target.care[k]),b=structuredClone(prev.care[k]);
 for(const prop of mutable){delete a[prop];delete b[prop];}
 delete a.japan_fit.jp_note;delete b.japan_fit.jp_note;
 assert.deepEqual(a,b,`${k}: classification/basis unchanged`);
 assert.ok(target.care[k].sources.length>0);
 assert.equal(target.care[k].verification,prev.care[k].verification);
}
const normalized=structuredClone(master);
for(const k of ['air_temp_c','diet','enclosure_jp'])normalized.species.find(s=>s.slug==='impressed-tortoise').care[k]=prev.care[k];
// The separate enclosure-checker regression verifies these exact wording-only updates.
const enclosureWording={'loggerhead-musk-turtle':'45〜60cm規格（当サイト目安・体格で見直し）','mississippi-mud-turtle':'45〜60cm規格（当サイト目安・体格で見直し）','western-painted-turtle':'オス60cm・メス90〜120cm（当サイト目安）'};
for(const [slug,value] of Object.entries(enclosureWording)){const a=normalized.species.find(s=>s.slug===slug).care.enclosure_jp,b=prior.species.find(s=>s.slug===slug).care.enclosure_jp;assert.equal(a.value,value);a.value=b.value;if(slug==='western-painted-turtle'){assert.equal(a.japan_fit.jp_note,value);a.japan_fit.jp_note=b.japan_fit.jp_note;}}
// Canton basis is covered by the dedicated non-conflation regression.
execFileSync('python',['tools/test_canton_enclosure_basis.py'],{stdio:'pipe'});
const canton=normalized.species.find(s=>s.slug==='canton-reeves-turtle');
canton.care.enclosure_jp.japan_fit.basis=prior.species.find(s=>s.slug==='canton-reeves-turtle').care.enclosure_jp.japan_fit.basis;
assert.deepEqual(normalized,prior,'all other master species/fields unchanged');
console.log('PASS impressed guidance: FAQ JSON-LD, old failure, temperature meanings, existing links/scripts unchanged, master scope/verification preserved');
