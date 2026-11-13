// Temporary fixed-scope official Rakuten lookup. No production files changed.
'use strict';
const https=require('https'),fs=require('fs');
const app=process.env.RAKUTEN_APP_ID, key=process.env.RAKUTEN_ACCESS_KEY, affiliate=process.env.RAKUTEN_AFFILIATE_ID;
if(!app||!key||!affiliate)throw Error('Missing configured Rakuten credential');
const targets=[
{id:'suisaku-ph73',shop:'chanet',url:'https://item.rakuten.co.jp/chanet/268072/',queries:['4974105005733','クイック 水替え ポンプ']},
{id:'gex-cleaner-dropper',shop:'chanet',url:'https://item.rakuten.co.jp/chanet/168159/',queries:['4972547026545','クリーナースポイト']},
{id:'tanita-kj305',shop:'webby',url:'https://item.rakuten.co.jp/webby/50892153/',queries:['4904785196100','KJ-305']},
{id:'shimano-st422i',shop:'naturum',url:'https://item.rakuten.co.jp/naturum/2455158/',queries:['4969363724885','ST-422I']}
];
function search(shop,keyword){return new Promise((resolve,reject)=>{
const q=new URLSearchParams({applicationId:app,accessKey:key,affiliateId:affiliate,shopCode:shop,keyword,hits:'30'});
const req=https.get({hostname:'openapi.rakuten.co.jp',path:'/ichibams/api/IchibaItem/Search/20260701?'+q,headers:{Accept:'application/json',Origin:'https://gagalife04291225-lab.github.io',Referer:'https://gagalife04291225-lab.github.io/'}},r=>{let b='';r.on('data',c=>b+=c);r.on('end',()=>{if(r.statusCode!==200)return reject(Error('HTTP '+r.statusCode));try{resolve(JSON.parse(b));}catch{reject(Error('Invalid JSON'));}});});req.on('error',()=>reject(Error('Network error')));req.setTimeout(20000,()=>req.destroy(Error('Timeout')));
});}
function plain(s){if(!s)return '';let u=new URL(s);return u.searchParams.get('pc')||s;}
function same(a,b){return a.replace(/^http:/,'https:').replace(/\/$/,'')===b.replace(/\/$/,'');}
(async()=>{let result=[];
for(const t of targets){let found=null,attempts=[];
for(const query of t.queries){await new Promise(r=>setTimeout(r,1300));try{const d=await search(t.shop,query);const items=(d.Items||d.items||[]).map(x=>x.Item||x);attempts.push({query,count:items.length});for(const it of items){const candidate=it.affiliateUrl;if(candidate&&new URL(candidate).hostname==='hb.afl.rakuten.co.jp'&&same(plain(candidate),t.url)&&same(plain(it.itemUrl),t.url)){found={itemName:it.itemName,itemCode:it.itemCode,itemPrice:it.itemPrice,availability:it.availability,itemUrl:plain(it.itemUrl),affiliateUrl:candidate};break;}}}catch(e){attempts.push({query,error:e.message});}if(found)break;}
result.push({id:t.id,expectedUrl:t.url,attempts,match:found});console.log(t.id+': '+(found?'EXACT_URL_MATCH':'NO_EXACT_MATCH'));}
const output=JSON.stringify({checkedAt:new Date().toISOString(),results:result},null,2);
const safe=output.split('rafcid=wsc_i_is_'+app).join('rafcid=PUBLISHED_TRACKING');
if([app,key,affiliate].some(v=>safe.includes(v))||/applicationId=|accessKey=|affiliateId=|Authorization/i.test(output))throw Error('Secret scan failed');
fs.writeFileSync('keeper-product-links.json',output);console.log('Secret scan passed; production unchanged');
})().catch(()=>{console.error('Lookup failed; no credential values emitted');process.exit(1)});
