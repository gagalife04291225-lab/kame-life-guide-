import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html = fs.readFileSync(new URL('../shindan/index.html', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const routeSource = fs.readFileSync(new URL('../shindan/routes.js', import.meta.url), 'utf8');
const context = vm.createContext({SPECIES:{land:[],aquatic:[],forest:[],special:[]}});
vm.runInContext(routeSource + ';this.routes=ROUTES;', context);
assert.equal(context.routes.length,5);
function extract(name){ const start=html.indexOf('function '+name+'() {'); assert.ok(start>=0); const end=html.indexOf('\n}\n',start); return html.slice(start,end+2); }
const elements = new Map();
function node(){return {textContent:'',innerHTML:'',style:{},className:'',parentElement:{setAttribute(){}},setAttribute(){},appendChild(){},addEventListener(){},focus(){}};}
const document = {getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);},createElement:node};
const testContext = vm.createContext({document, Math, _viewedSteps:{}, currentQuestionIndex:0, gateIndex:0, READINESS_QUESTIONS:[{text:'Gate',choices:[]}],selectChoice(){},selectGateChoice(){}});
vm.runInContext(html.match(/function getRouteQuestionCount\(route\) \{[\s\S]*?\n\}/)[0],testContext);
vm.runInContext(extract('showQuestion')+'\n'+extract('showGateQuestion'),testContext);
let checks=0;
for(const route of context.routes){
  assert.equal(typeof route.name,'string'); assert.equal(typeof route.icon,'string'); assert.equal(route.emoji,undefined);
  testContext.selectedRoute=route;
  for(const fn of ['showQuestion','showGateQuestion','showQuestion']){
    vm.runInContext(fn+'()',testContext);
    assert.equal(elements.get('route-badge').textContent,route.name,route.id+' '+fn);
    checks++;
  }
}
assert.ok(!html.includes('route.emoji'));
console.log(`PASS: ${checks} route badge renders across all 5 routes, including gate and return`);
