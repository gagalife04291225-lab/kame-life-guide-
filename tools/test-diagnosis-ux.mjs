import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html = fs.readFileSync('shindan/index.html','utf8');
const top = fs.readFileSync('index.html','utf8');
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync('shindan/routes.js','utf8'), ctx);
const helper = html.match(/function getRouteQuestionCount\(route\) \{[\s\S]*?\n\}/)?.[0];
assert.ok(helper, 'one shared count for entry and progress');
vm.runInContext(helper, ctx);
assert.deepEqual(Array.from(vm.runInContext('ROUTES.map(r=>getRouteQuestionCount(r))',ctx)),[9,12,9,8,10]);
assert.ok(!html.includes("card.setAttribute('role', 'listitem')"));
assert.ok(html.includes("card.type = 'button'"));
assert.ok(html.includes('id="route-cards" role="group"'));
assert.ok(html.includes("getRouteQuestionCount(route) + '問"));
assert.ok(!vm.runInContext("ROUTES.find(r=>r.id==='all').desc",ctx).includes('8問'));
for (const [name,s] of [['diagnosis',html],['top',top]]) {
 assert.equal((s.match(/<main\b/g)||[]).length,1,name+' one main');
 assert.equal((s.match(/<\/main>/g)||[]).length,1);
 assert.ok(!s.includes('role="main"'));
}
assert.ok(html.includes('.route-card:focus-visible'));
assert.match(html,/\.route-desc \{[^}]*font-size: \.9rem;[^}]*color: #c7d3cb/);
function lum(rgb) {return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
const fg=[199,211,203],base=[13,31,26];
for(const alpha of [0,.06,.11]) { const bg=base.map(v=>Math.round(255*alpha+v*(1-alpha)));const ratio=(lum(fg)+.05)/(lum(bg)+.05);assert.ok(ratio>=4.5);console.log('contrast',alpha,ratio.toFixed(2)); }
console.log('diagnosis UX assertions PASS');
