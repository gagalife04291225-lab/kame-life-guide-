const ORIGIN = 'https://kamelifeguide.com';
const IMAGE_ORIGIN = 'https://amazon-images.kamelifeguide.com';
const PATH = '/api/amazon-product-images';
const key = id => 'jp-primary-v3:' + id;
const TAG = 'kamelife090e-22';
const MAX_AGE = 18 * 60 * 60 * 1000;
const asin = x => typeof x === 'string' && /^[A-Z0-9]{10}$/.test(x);
function matchUrl(raw, test) {
  try {
    const u = new URL(raw);
    return !u.username && !u.password && test(u);
  } catch { return false; }
}
function photo(raw) {
  return matchUrl(raw,u=>u.origin==='https://m.media-amazon.com'&&!u.search&&!u.hash&&
    /^\/images\/I\/[\w%+.,-]+\.(?:jpg|jpeg|png|webp)$/i.test(u.pathname));
}
function exact(raw,id) {
  return matchUrl(raw,u=>u.origin==='https://www.amazon.co.jp'&&
    new RegExp('^/(?:dp|gp/product)/'+id+'/?$').test(u.pathname)&&
    u.searchParams.getAll('tag').length===1&&u.searchParams.get('tag')===TAG);
}
function allowed(env) {
  const ids=String(env.KLG_APPROVED_ASINS??'').trim().split(/[\s,]+/).filter(Boolean);
  return ids.length<=240&&ids.every(asin)?new Set(ids):new Set();
}
function reply(body,status=200,fromSite=false) {
  return Response.json(body,{status,headers:{
    'Cache-Control':'private, no-store, max-age=0',
    'X-Content-Type-Options':'nosniff',
    'Cross-Origin-Resource-Policy':fromSite?'same-site':'same-origin',
    ...(fromSite ? {'Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin'} : {})
  }});
}
export async function serve(req,env,now=Date.now(),dedicated=false) {
  const u=new URL(req.url);
  if(u.origin!==(dedicated?IMAGE_ORIGIN:ORIGIN)||u.pathname!==PATH)
    return reply({status:'not_found'},404);
  const mode=req.headers.get('Sec-Fetch-Site');
  if(dedicated && (req.headers.get('Origin')!==ORIGIN||(mode&&mode!=='same-site')))
    return reply({status:'cross_origin'},403);
  if(!dedicated&&mode&&mode!=='same-origin')return reply({status:'cross_origin'},403);
  if(req.method!=='GET')return reply({status:'method_not_allowed'},405,dedicated);
  const siteReply=(body,status=200)=>reply(body,status,dedicated);
  const ids=(u.searchParams.get('items')??'').split(',');
  if(u.searchParams.getAll('items').length!==1||ids.length>20||ids.some(id=>!asin(id)))return siteReply({status:'invalid_request'},400);
  const reviewed=allowed(env);
  const selected=[...new Set(ids)].filter(id=>reviewed.has(id));
  const photos=Object.create(null);
  if(!env.KLG_AMAZON_IMAGES||!selected.length)return siteReply({photos});
  let stored;
  try{stored=await env.KLG_AMAZON_IMAGES.get(selected.map(key),{type:'json'});}
  catch{return siteReply({status:'unavailable'},503);}
  for(const id of selected){
    const pair=stored.get(key(id));
    const checkedAt=pair?.checkedAt;
    if(Number.isSafeInteger(checkedAt)&&checkedAt<=now&&now-checkedAt<MAX_AGE&&
       photo(pair.url)&&exact(pair.detailUrl,id))
      photos[id]={asin:id,url:pair.url,detailUrl:pair.detailUrl,expiresAt:checkedAt+MAX_AGE};
  }
  return siteReply({photos});
}
async function post(fetcher,url,body,headers={}) {
  let r;
  try{r=await fetcher(url,{method:'POST',redirect:'error',cache:'no-store',
    headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body),
    signal:AbortSignal.timeout(6500)});}
  catch{throw Error('official_api_transport');}
  if(!r.ok){
    const err=Error('official_api_http_'+r.status);
    err.status=r.status;
    err.retryAfter=r.headers.get('Retry-After');
    throw err;
  }
  try{return await r.json();}catch{throw Error('official_api_invalid_json');}
}
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function retryDelay(hint,now,floor){
  if (!hint) return floor;
  if (/^[0-9]+$/.test(hint)) return Math.max(floor,1000*Number(hint));
  const target=Date.parse(hint);
  return Number.isFinite(target) ? Math.max(floor,target-now) : floor;
}
// Only documented single-item messages account for a missing batch member.
function failedItem(error) {
  if(typeof error?.message!=='string')return null;
  const message=error.message.trim();
  if(error.code==='ItemNotAccessible')
    return /^The ItemId ([A-Z0-9]{10}) is not accessible through the Creators API\.$/.exec(message)?.[1]??null;
  if(error.code==='InvalidParameterValue')
    return /^The ItemIds ([A-Z0-9]{10}) provided in the request is invalid\.$/.exec(message)?.[1]??null;
  return null;
}
function validateBatch(data,keys) {
  const photos=Object.create(null);
  const knownFailures=new Set(['ItemNotAccessible','InvalidParameterValue']);
  const rows=data?.itemsResult?.items??[];
  const failures=data?.errors??[];
  if(!Array.isArray(rows)||!Array.isArray(failures)||(!rows.length&&!failures.length)||
     failures.some(x=>!knownFailures.has(x?.code)))throw Error('official_api_unexpected_catalog_result');
  const seen=new Set();
  for(const row of rows){
    if(!keys.includes(row?.asin)||seen.has(row.asin))throw Error('official_api_item_mismatch');
    seen.add(row.asin);
    const detailUrl=row.detailPageURL??row.detailPageUrl;
    if(!exact(detailUrl,row.asin))throw Error('official_api_invalid_detail_url');
    const candidates=['large','medium'].map(size=>row.images?.primary?.[size]?.url);
    const candidate=candidates.find(photo);
    if(candidate)photos[row.asin]={url:candidate,detailUrl};
    else if(candidates.some(value=>value!=null))throw Error('official_api_invalid_photo_url');
  }
  for(const failure of failures){
    const id=failedItem(failure);
    if(!id||!keys.includes(id)||seen.has(id))throw Error('official_api_item_error_mismatch');
    seen.add(id);
  }
  if(seen.size!==keys.length)throw Error('official_api_incomplete_batch');
  return photos;
}
export async function refresh(env,{fetcher=fetch,clock=Date.now,sleep=wait}={}) {
  const ids=[...allowed(env)];
  if(!ids.length||!env.KLG_AMAZON_IMAGES||!env.KLG_CREATORS_CLIENT_ID||!env.KLG_CREATORS_CLIENT_SECRET)
    throw Error('image_refresh_unconfigured');
  const token=await post(fetcher,'https://api.amazon.co.jp/auth/o2/token',{
    grant_type:'client_credentials',client_id:env.KLG_CREATORS_CLIENT_ID,
    client_secret:env.KLG_CREATORS_CLIENT_SECRET,scope:'creatorsapi::default'
  });
  if(typeof token?.access_token!=='string'||!token.access_token||/[\r\n]/.test(token.access_token))
    throw Error('official_api_invalid_token');
  // Bound retries across the execution. A rate or auth failure stops further
  // requests; an isolated catalog failure does not erase or stall good batches.
  let retries=0,available=0,failedBatches=0;
  let firstError;
  for(let i=0;i<ids.length;i+=10){
    const keys=ids.slice(i,i+10);
    if(i>0) await sleep(2200);
    // Starting the expiry clock before acquisition is conservative.
    const checkedAt=clock();
    try{
      let data;
      for(let attempt=0;;attempt++){
        try{
          data=await post(fetcher,'https://creatorsapi.amazon/catalog/v1/getItems',{
            itemIds:keys,itemIdType:'ASIN',marketplace:'www.amazon.co.jp',partnerTag:TAG,
            resources:['images.primary.large','images.primary.medium']
          },{Authorization:'Bearer '+token.access_token,'x-marketplace':'www.amazon.co.jp'});
          break;
        }catch(err){
          if(err.status!==429||attempt>=2||retries>=3)throw err;
          const delay=retryDelay(err.retryAfter,clock(),2200*2**attempt);
          if(delay>12000)throw err;
          retries++;
          await sleep(delay);
        }
      }
      const photos=validateBatch(data,keys);
      const expiration=Math.floor((checkedAt+MAX_AGE)/1000);
      if(!Number.isSafeInteger(checkedAt)||expiration-Math.floor(clock()/1000)<60||clock()<checkedAt)
        throw Error('image_refresh_clock');
      // Validate the entire batch before touching any of its keys. Keys belonging
      // to failed requests keep their original storage and serving deadlines,
      // even if the allowlist is reordered or a different batch succeeds.
      for(let j=0;j<keys.length;j+=5){
        const results=await Promise.allSettled(keys.slice(j,j+5).map(async id=>{
          const pair=photos[id];
          if(pair){
            await env.KLG_AMAZON_IMAGES.put(key(id),JSON.stringify({checkedAt,...pair}),{expiration});
            available++;
          }else await env.KLG_AMAZON_IMAGES.delete(key(id));
        }));
        if(results.some(result=>result.status==='rejected'))throw Error('image_refresh_storage');
      }
    }catch(err){
      failedBatches++;
      firstError??=err;
      if([401,403,429].includes(err.status))break;
    }
  }
  if(firstError){
    // Surface an unhealthy run without exposing ASINs, links or upstream bodies.
    throw Error(firstError.message+'; failed_batches='+failedBatches+'; refreshed='+available);
  }
  return {requested:ids.length,available};
}
export default{
  fetch(req,env){return serve(req,env);},
  async scheduled(_event,env){console.log('Amazon image refresh',await refresh(env));}
};
