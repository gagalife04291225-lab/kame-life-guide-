import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
// Explicitly verified model corrections; unrelated fields remain frozen.
export function applyReviewedAmazonHolds(before,after){
 for(const [id,oldAsin,asin,kind,model] of [['uvb_t5_desert_std','B00JZFJ5R0','B00AQU8HAO','10.0','OS5-24'],['uvb_t5_forest_std','B00JZFJ5LQ','B00AQU8GF0','5.0','FS5-24']]){
  const old=before[id],now=after[id];
  assert.equal(old.asin,oldAsin);assert.equal(now.asin,asin);
  assert.equal(now.affiliateUrl,'https://www.amazon.co.jp/dp/'+asin+'?tag=kamelife090e-22');
  assert.equal(now.amazonLinkStatus,'verified');
  assert.equal(now.name,`Zoo Med ReptiSun ${kind} T5 HO 24W 交換管（${model}）`);
  assert.equal(now.rakutenSearchTerm,`Zoo Med ReptiSun ${kind} T5 HO 24W ${model}`);
  for(const key of ['asin','affiliateUrl','amazonLinkStatus','name','rakutenSearchTerm'])old[key]=now[key];
 }
}

// Only these feed-owned fields can advance. All identity/search/safety fields
// continue to be checked against the historical fixtures by the calling suites.
export const RAKUTEN_FEED_KEYS=Object.freeze(['rakutenLastUpdated','rakutenUrl','rakutenStatus','rakutenItemCode','rakutenPrice','rakutenShop','rakutenConfidence','rakutenImageUrl']);
const REPOSITORY='gagalife04291225-lab/kame-life-guide-';
const git=(root,...args)=>execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const productsAt=(root,sha)=>JSON.parse(JSON.stringify(vm.runInNewContext(git(root,'show',sha+':data/products.js')+'\nPRODUCTS;')));
function commit(root,sha){
 assert.match(sha??'',/^[0-9a-f]{40}$/, 'Expected a complete trusted baseline SHA, not a candidate ref');
 assert.equal(git(root,'rev-parse',sha+'^{commit}'),sha,'Baseline commit unavailable');
 return sha;
}
function ancestor(root,a,b){
 try{git(root,'merge-base','--is-ancestor',a,b);}catch{throw new Error('Trusted baseline is not an ancestor: '+a+' -> '+b);}
}
function onlyFeedChanges(root,base,generated){
 const a=productsAt(root,base),b=productsAt(root,generated);
 assert.deepEqual(Object.keys(a),Object.keys(b),'Generated feed changed product membership');
 for(const id of Object.keys(a)){
  for(const key of RAKUTEN_FEED_KEYS){delete a[id][key];delete b[id][key];}
  assert.deepEqual(a[id],b[id],id+' generated update changed a non-feed field');
 }
 const paths=git(root,'diff','--name-only',base,generated).split('\n').filter(Boolean);
 assert.ok(paths.every(p=>['data/products.js','data/rakuten-diag.json'].includes(p)||p.endsWith('.html')),'Generated commit changed non-generated files');
}

// GitHub event JSON is supplied by the runner, not by the candidate tree. Local
// runs trust the fetched origin/main ref. No fallback to HEAD, newest bot-looking
// subject/author, candidate contents, or a moving date-based pin is permitted.
export function resolveRakutenBaseline(root,env=process.env){
 assert.equal(git(root,'rev-parse','--is-shallow-repository'),'false','Rakuten baseline requires full Git history; fetch --unshallow (CI fetch-depth: 0)');
 let published;
 try{published=git(root,'rev-parse','refs/remotes/origin/main^{commit}');}
 catch{throw new Error('Missing trusted origin/main; fetch the upstream main branch before running offline checks');}
 const head=git(root,'rev-parse','HEAD');
 const generated=env.KLG_RAKUTEN_GENERATED_REF;
 let ref;
 if(env.GITHUB_ACTIONS==='true'){
  assert.equal(env.GITHUB_REPOSITORY,REPOSITORY,'Unexpected repository for trusted baseline');
  assert.ok(env.GITHUB_EVENT_PATH,'Missing GitHub event file');
  const event=JSON.parse(readFileSync(env.GITHUB_EVENT_PATH,'utf8'));
  assert.equal(event.repository?.full_name,REPOSITORY,'Event repository mismatch');
  assert.equal(event.repository?.default_branch,'main','Unexpected default branch');
  if(generated){
   // Only the scheduled generator's reconcile child may compare the merge to
   // its captured pre-merge output. A PR cannot opt into this route.
   assert.ok(['schedule','workflow_dispatch'].includes(env.GITHUB_EVENT_NAME),'Generated baseline unavailable for this event');
   assert.equal(env.GITHUB_WORKFLOW_REF,REPOSITORY+'/.github/workflows/rakuten-sync.yml@refs/heads/main','Not the trusted generator workflow');
   assert.equal(env.GITHUB_REF,'refs/heads/main');
   ref=commit(root,generated);
   const base=commit(root,env.KLG_RAKUTEN_GENERATED_BASE);
   assert.equal(git(root,'show','-s','--format=%P',ref),base,'Generated baseline must be the captured single-parent commit');
   ancestor(root,base,published);ancestor(root,ref,head);
   assert.notEqual(ref,head,'Reconcile baseline must predate the merged candidate');
   onlyFeedChanges(root,base,ref);
  }else if(env.GITHUB_EVENT_NAME==='pull_request'){
   assert.equal(event.pull_request?.base?.repo?.full_name,REPOSITORY);
   assert.equal(event.pull_request?.base?.ref,'main');
   ref=commit(root,event.pull_request.base.sha);
   ancestor(root,ref,published);ancestor(root,ref,head);
  }else if(env.GITHUB_EVENT_NAME==='push'){
   assert.equal(event.ref,'refs/heads/main');
   const before=commit(root,event.before),after=commit(root,event.after);
   assert.equal(after,env.GITHUB_SHA);assert.equal(after,head);
   ancestor(root,before,after);ancestor(root,after,published);
   // A bot author string alone is not proof. Require the runner actor and
   // webhook sender as well, then restrict the entire product delta to feed.
   if(env.GITHUB_ACTOR==='github-actions[bot]'&&event.sender?.login==='github-actions[bot]'&&event.sender?.type==='Bot'){
    onlyFeedChanges(root,before,after);ref=after;
   }else ref=before;
  }else if(env.GITHUB_EVENT_NAME==='workflow_dispatch'){
   assert.equal(env.GITHUB_REF,'refs/heads/main','Manual checks must target main');
   ref=commit(root,env.GITHUB_SHA);ancestor(root,ref,published);ancestor(root,ref,head);
  }else{
   // Non-generator scheduled checks must use an already-published ancestor.
   assert.equal(env.GITHUB_EVENT_NAME,'schedule','Unsupported CI event for baseline');
   ref=git(root,'merge-base',published,head);
  }
 }else{
  assert.ok(!generated&&!env.KLG_RAKUTEN_GENERATED_BASE,'Generated baseline requires the trusted GitHub generator context');
  ref=git(root,'merge-base',published,head);
 }
 return commit(root,ref);
}

const PHOTO_LINK_FIXES = [
 ['uvb_compact','B00BF91Q1W','B088X2HCGG'],
 ['waterdish_zoomed_ramp_bowl','B00167XQLG','B00BUFVR56']
];
const amazonLink = id => 'https://www.amazon.co.jp/dp/'+id+'?tag=kamelife090e-22';
const PLUS_SEARCH = 'INKBIRD WiFi 温湿度計 IBS-TH3 PLUS';
const PLUS_HOLD = Object.freeze({rakutenStatus:'search',rakutenUrl:null,rakutenItemCode:null,
 rakutenPrice:null,rakutenShop:null,rakutenConfidence:null,rakutenImageUrl:null,rakutenLastUpdated:null});
const EHEIM_2217_BEFORE = '2217-NEWはろ材別売のため別途ろ材が必要';
const EHEIM_2217_AFTER = '2217-NEWはろ材別売。50Hz用と60Hz用は別製品です。購入前に、使う場所の電源周波数と販売ページの周波数が合っているか確認してください。';
export function applyVerifiedPhotoLinkFixes(before,after){
 for(const [id,old,now] of PHOTO_LINK_FIXES){
  assert.equal(before[id].asin,old);
  assert.equal(before[id].affiliateUrl,amazonLink(old));
  assert.equal(after[id].asin,now);
  assert.equal(after[id].affiliateUrl,amazonLink(now));
  before[id].asin=now;
  before[id].affiliateUrl=amazonLink(now);
 }
 const eheim=before.filter_canister_premium;
 assert.ok(eheim.why.endsWith(EHEIM_2217_BEFORE));
 const expected=eheim.why.slice(0,-EHEIM_2217_BEFORE.length)+EHEIM_2217_AFTER;
 assert.equal(after.filter_canister_premium.why,expected);
 eheim.why=expected;
 assert.equal(after.thermometer_wifi.rakutenSearchTerm,PLUS_SEARCH);
 assert.equal(after.thermometer_wifi.rakutenIdentityHold,true);
 before.thermometer_wifi.rakutenSearchTerm=PLUS_SEARCH;
 before.thermometer_wifi.rakutenIdentityHold=true;
}
// Validate the exact changed fields first, then compare all other source bytes.
export function withoutVerifiedPhotoLinkDifferences(source,historical){
 const parse = s => vm.runInNewContext(s+'\nPRODUCTS;');
 const before=parse(historical),after=parse(source);
 const previousTerm=before.thermometer_wifi.rakutenSearchTerm;
 const eheimBefore=before.filter_canister_premium.why;
 applyVerifiedPhotoLinkFixes(before,after);
 for(const [id,old,now] of PHOTO_LINK_FIXES){
  const anchor = source.indexOf('\n  '+id+': {');
  const end = source.indexOf('\n  },',anchor);
  assert.ok(anchor>=0&&end>anchor);
  let block=source.slice(anchor,end);
  block=block.replace("affiliateUrl: '"+amazonLink(now)+"'", "affiliateUrl: '"+amazonLink(old)+"'");
  block=block.replace("asin: '"+now+"'", "asin: '"+old+"'");
  source=source.slice(0,anchor)+block+source.slice(end);
 }
 const eheimAnchor=source.indexOf('\n  filter_canister_premium: {');
 const eheimEnd=source.indexOf('\n  },',eheimAnchor);
 assert.ok(eheimAnchor>=0&&eheimEnd>eheimAnchor);
 const eheimBlock=source.slice(eheimAnchor,eheimEnd)
  .replace("why: '"+after.filter_canister_premium.why+"'","why: '"+eheimBefore+"'");
 source=source.slice(0,eheimAnchor)+eheimBlock+source.slice(eheimEnd);
 const anchor=source.indexOf('\n  thermometer_wifi: {');
 const end=source.indexOf('\n  },',anchor);
 assert.ok(anchor>=0&&end>anchor);
 const block=source.slice(anchor,end)
  .replace("rakutenSearchTerm: '"+PLUS_SEARCH+"'","rakutenSearchTerm: '"+previousTerm+"'")
  .replace(/^    rakutenIdentityHold: true,\r?\n/m,'');
 return source.slice(0,anchor)+block+source.slice(end);
}

export function applyCommittedRakutenSync(before,after,root){
 const ref=resolveRakutenBaseline(root);
 const committed=productsAt(root,ref);
 assert.deepEqual(Object.keys(committed),Object.keys(before));
 assert.deepEqual(Object.keys(after),Object.keys(before));
 for(const [id,product] of Object.entries(before))for(const key of RAKUTEN_FEED_KEYS){
  const actual=after[id];
  const pinned=id==='thermometer_wifi' && actual.rakutenIdentityHold===true && !committed[id].rakutenIdentityHold
    ? PLUS_HOLD : committed[id];
  assert.equal(Object.hasOwn(actual,key),Object.hasOwn(pinned,key),id+' committed feed presence '+key);
  assert.deepEqual(actual[key],pinned[key],id+' committed feed '+key);
  if(Object.hasOwn(pinned,key))product[key]=pinned[key];
  else delete product[key];
 }
}
