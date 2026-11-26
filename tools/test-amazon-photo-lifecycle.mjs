import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const asin='B000NGQZU0', orig='https://www.amazon.co.jp/dp/'+asin+'?tag=kamelife090e-22', detail=orig+'&linkCode=ogi';
const src=readFileSync(process.argv[2]||new URL('../js/amazon-product-images.js',import.meta.url),'utf8');
function browser(fetchPlan=[]) {
 let time=1_000_000, count=0, timerId=0, interval, observe, latestImage;
 const timers=new Map(), docEvents={},winEvents={};
 const el=()=>({attrs:new Map(),dataset:{},textContent:'Amazon',isConnected:true,style:{},events:{},
   classList:{add(){},remove(){}},querySelector(){return null;},
   closest(sel){return sel.startsWith('.item')?this:null;},getAttribute(k){return this.attrs.get(k);},
   setAttribute(k,v){this.attrs.set(k,v);},removeAttribute(k){this.attrs.delete(k);},append(e){this.child=e;},
   prepend(e){this.frame=e;},remove(){this.removed=true;},addEventListener(k,f){this.events[k]=f;}});
 const a=el(), away=el();
 for (const e of [a,away]) {e.setAttribute('href',orig);e.dataset.clickUrl=orig;}
 a.getBoundingClientRect=()=>({top:40,bottom:90});
 away.getBoundingClientRect=()=>({top:2000,bottom:2050});
 const document={visibilityState:'visible',body:{},querySelector(){return {content:'/api/amazon-product-images'};},
 querySelectorAll(){return [a,away];},
 addEventListener(k,f){docEvents[k]=f;},
 createElement(k){const e=el();if(k==='img') {latestImage=e;e.naturalWidth=318;e.naturalHeight=500;}return e;}};
 const response=()=>({ok:true,headers:{get:()=> 'application/json'},json:async()=>({photos:{[asin]:{
   asin,detailUrl:detail,url:'https://m.media-amazon.com/images/I/test-fixture.jpg',expiresAt:time+120000}}})});
 runInNewContext(src,{URL,AbortSignal,document,innerHeight:844,Date:{now:()=>time},
 location:{origin:'https://kamelifeguide.com'},window:{addEventListener(k,f){winEvents[k]=f;}},
 IntersectionObserver:class{constructor(fn){observe=fn;}observe(){}unobserve(){}},
 MutationObserver:class{observe(){}},
 setTimeout(fn,delay){timers.set(++timerId,{fn,at:time+delay});return timerId;},
 clearTimeout(id){timers.delete(id);},
 setInterval(fn){interval=fn;},fetch:async()=>{count++;return fetchPlan.length?await fetchPlan.shift()(response):response();}});
 async function tick(ms=40){time+=ms;for(const [k,t] of timers) if(t.at<=time){timers.delete(k);void t.fn();}for(let i=0;i<16;i++)await Promise.resolve();}
 return {a,tick,interval, count:()=>count, show:()=>winEvents.pageshow({persisted:true}),
 hide:()=>winEvents.pagehide({persisted:true}),intersect:()=>observe([{target:a,isIntersecting:true}]),
 load:()=>a.frame.child.events.load(), frame:()=>a.frame};
}
{
 const b=browser();b.intersect();await b.tick();b.load();assert.equal(b.a.getAttribute('href'),detail);
 b.hide();assert.equal(b.a.getAttribute('href'),orig);assert.equal(b.a.dataset.clickUrl,orig);assert.equal(b.frame().removed,true);
 b.show();await b.tick();assert.equal(b.count(),2,'persisted pageshow must fetch without extra browser events');
 b.load();assert.equal(b.a.getAttribute('href'),detail);
}
{
 const b=browser([()=>({ok:false})]);b.intersect();await b.tick();assert.equal(b.count(),1);
 await b.tick(299999);b.interval();await b.tick(0);assert.equal(b.count(),1,'honor backoff');
 await b.tick(1);b.interval();await b.tick();assert.equal(b.count(),2,'retry without leaving viewport');
 b.load();assert.equal(b.a.dataset.clickUrl,detail);
}
{
 let release;const b=browser([r=>new Promise(resolve=>{release=()=>resolve(r());})]);
 b.intersect();await b.tick();b.hide();b.show();await b.tick();assert.equal(b.count(),1,'do not overlap the batches');
 release();await b.tick(0);assert.equal(b.frame(),undefined,'discard reply from previous page lifetime');
 await b.tick();assert.equal(b.count(),2);b.load();assert.equal(b.a.getAttribute('href'),detail);
}
{
 let release;
 const b=browser([r=>r(),r=>new Promise(resolve=>{release=()=>resolve(r());})]);
 b.intersect();await b.tick();b.load();const original=b.frame();
 await b.tick(59999);b.interval();await b.tick(0);assert.equal(b.count(),1,'outside renewal window');
 await b.tick(1);b.interval();await b.tick();assert.equal(b.count(),2,'fetch before expiry');
 assert.equal(b.frame(),original);assert.equal(b.a.dataset.clickUrl,detail);
 release();await b.tick(0);
 await b.tick(59960);b.interval();await b.tick(0);
 assert.equal(b.frame(),original,'a renewed identical photo must not recreate its frame');
 assert.equal(original.removed,undefined);assert.equal(b.a.getAttribute('href'),detail);
}
{
 const b=browser();b.intersect();await b.tick();b.load();const original=b.frame();
 b.a.getBoundingClientRect=()=>({top:2000,bottom:2050});
 await b.tick(60000);b.interval();await b.tick();
 assert.equal(b.count(),1,'offscreen cards do not trigger early requests');
 await b.tick(59960);
 assert.equal(original.removed,true,'offscreen photos are still subject to the expiry');
}
{
 let first;
 const b=browser([r=>(first=r()),()=>first,()=>({ok:false})]);
 b.intersect();await b.tick();
 // Snapshot immediately, because the fixture response generates dates when its JSON is read.
 const data=await first.json();first={...first,json:async()=>data};
 b.load();const original=b.frame();
 await b.tick(60000);b.interval();await b.tick();
 assert.equal(b.count(),2);assert.equal(original.removed,undefined);
 await b.tick(10000);b.interval();await b.tick(0);assert.equal(b.count(),2,'stale rows have a short backoff');
 await b.tick(20000);b.interval();await b.tick();assert.equal(b.count(),3);
 assert.equal(b.a.dataset.clickUrl,detail,'temporary fetch failure does not remove a valid photo');
 await b.tick(29920);
 assert.equal(original.removed,true,'expiry removes the stale photo without waiting for a scan');
 assert.equal(b.a.getAttribute('href'),orig);assert.equal(b.a.dataset.clickUrl,orig);
}
console.log('Amazon photo lifecycle: bfcache, backoff, in-flight clear, in-place renewal and exact expiry PASS');
