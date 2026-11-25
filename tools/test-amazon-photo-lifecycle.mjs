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
   asin,detailUrl:detail,url:'https://m.media-amazon.com/images/I/test-fixture.jpg',expiresAt:time+60000}}})});
 runInNewContext(src,{URL,AbortSignal,document,innerHeight:844,Date:{now:()=>time},
 location:{origin:'https://kamelifeguide.com'},window:{addEventListener(k,f){winEvents[k]=f;}},
 IntersectionObserver:class{constructor(fn){observe=fn;}observe(){}unobserve(){}},
 MutationObserver:class{observe(){}},
 setTimeout(fn,delay){timers.set(++timerId,{fn,at:time+delay});return timerId;},
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
console.log('Amazon photo lifecycle: bfcache recovery, timed backoff, in-flight clear PASS');
