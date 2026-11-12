/** Lifespan records must not be presented as average/maximum lifespan. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = process.env.LIFESPAN_TEST_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = JSON.parse(fs.readFileSync(new URL('./lifespan-fixtures.json', import.meta.url)));
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const ctx = {console, document: {addEventListener(){},getElementById(){return null;}}};ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(read('shindan/species.js')+';this.species=SPECIES.all;',ctx);
vm.runInContext(read('js/annainin.js'),ctx);
let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};
for(const [slug,[value,note,url]] of Object.entries(fixtures)){
 const sp=ctx.species.find(s=>s.slug===slug);check(sp,slug);
 check(sp.coreSpecs.lifespan===value,slug+' core');
 check(sp.lifespanEvidence.note===note,slug+' evidence');
 check(sp.lifespanEvidence.url===url,slug+' URL');
 const html=read('species/'+slug+'.html');
 check(html.includes(value),slug+' display');check(html.includes(note),slug+' note');check(html.includes(url),slug+' source');
 check((html.match(/lifespanLabel: '寿命の資料'/g)||[]).length===2,slug+' both widgets labelled');
 check(!/推定寿命<|寿命目安</.test(html),slug+' old label absent');
 const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 check(blocks.length>0,slug+' structured data parses');
 if(['russian-tortoise','hermann-tortoise'].includes(slug)) {
  check(blocks.some(b=>JSON.stringify(b).includes(note)),slug+' FAQ matches visible answer');
 }
}
const reply=ctx.KameAnnainin.getAnnaininResponse('lifespan').reply;
check(reply.includes('平均寿命')&&reply.includes('記録'), 'answer distinguishes record/mean');
check(!/\d+.*[〜～].*\d+/.test(reply),'no aggregate range');
check(ctx.KameAnnainin._test.lifespanSummary().max===null,'records never aggregated');
check(read('js/quick-facts.js').includes("opts.lifespanLabel || '寿命目安'"),'quick label backward compatible');
check(read('js/starter-kit.js').includes("opts.lifespanLabel || '寿命目安'"),'starter label backward compatible');
const index=read('shindan/index.html');
check(index.includes('sp.lifespanEvidence ? sp.coreSpecs.lifespan'),'diagnostic override');
check(index.includes('specGrid.appendChild(lifeNoteEl)'),'diagnostic source visible');
check(!index.includes("lifespan: '20〜30年', diet: '雑食'"),'fallbacks updated');
console.log(`${checks} lifespan checks passed`);
