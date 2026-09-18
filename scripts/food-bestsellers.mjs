// 亀の餌の「売れ筋」を楽天 Ichiba Item Search API で引き、動画・記事から使える一覧を作る。
// 既存の scripts/update-rakuten.js と同じ API・同じ並び（-reviewCount）を使う。
// 秘密（applicationId / accessKey / affiliateId）は一切出力しない。
import fs from 'node:fs/promises';
import https from 'node:https';

const APP_ID = process.env.RAKUTEN_APP_ID;
const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;
const HOST = 'openapi.rakuten.co.jp';
const PATH = '/ichibams/api/IchibaItem/Search/20260701';
const OUT = process.argv[2] ?? 'data/food-bestsellers.json';

if (!APP_ID || !ACCESS_KEY) { console.error('RAKUTEN_APP_ID / RAKUTEN_ACCESS_KEY が無い'); process.exit(1); }

// 餌そのものを探す語。機材（ケージ・ライト等）は別カテゴリなので後段で落とす。
const KEYWORDS = [
  'カメ 餌 配合飼料',
  '亀 フード 主食',
  'ミドリガメ 餌',
  'リクガメ フード',
  'リクガメ 野草 フード',
  'カメ 乾燥エビ 餌',
  '亀 おやつ 川エビ',
  'リクガメ 餌 野草',
  'リクガメ 主食 ペレット',
  'カメ 餌 人気',
  '水棲ガメ 餌',
  'ゼニガメ 餌',
];
// 機材、他の動物のフード、給餌器、および「亀/カメ」の字だけ一致する人間用食品を落とす。
// 「カメラ」は カメ を含むので必ず除外する（自動給餌器が混入した実測がある）。
const NG = /(ケージ|水槽|ライト|ヒーター|フィルター|サーモ|温度計|シェルター|床材|カルシウム剤?$|水質|カルキ|ネット|ピンセット|水槽台|バスキング|亀田製菓|介護食|おかゆ|人間用|お菓子|せんべい|自動給餌|給餌器|給餌機|餌やり機|インコ|オウム|文鳥|ハムスター|うさぎ|モルモット|犬用|猫用|ハリネズミ|フェレット)/;
// 名前にカメ（亀）が出てこない商品は、検索語に引っかかっただけなので採らない。
const TURTLE = /(亀|かめ|ガメ|タートル|トータス|陸ガメ|カメ(?!ラ))/;
const OK = /(餌|エサ|フード|飼料|ペレット|スティック|エビ|乾燥|主食|おやつ)/;
// 場面は検索語ではなく商品名で決める（「カメ 餌」で乾燥エビが出るなど、語と中身はずれる）。
const sceneOf = (name) => {
  if (/(川エビ|乾燥エビ|大エビ|ガマルス|ヨコエビ|ミルワーム|赤虫|クリル|ごほうび)/.test(name)) return 'animal';
  if (/(リクガメ|陸ガメ|トータス|草食|野草|桑|マルベリ|タンポポ|牧草|チモシー)/.test(name)) return 'plant';
  return 'pellet';
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const requestOnce = (keyword) => new Promise((resolve, reject) => {
  const params = new URLSearchParams({
    applicationId: APP_ID, accessKey: ACCESS_KEY, affiliateId: AFFILIATE_ID ?? '',
    keyword, hits: '30', sort: '-reviewCount', imageFlag: '1', availability: '1',
  });
  const req = https.request({
    hostname: HOST, path: `${PATH}?${params}`, method: 'GET',
    headers: { Accept: 'application/json', Origin: 'https://gagalife04291225-lab.github.io', Referer: 'https://gagalife04291225-lab.github.io/' },
  }, (res) => {
    let data = '';
    res.on('data', (c) => { data += c; });
    res.on('end', () => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
    });
  });
  req.on('error', reject);
  req.end();
});

// 楽天APIは短時間に連続で叩くと 429 を返す（実測）。指数バックオフで最大4回まで待つ。
const search = async (keyword) => {
  let last;
  for (let i = 0; i < 5; i++) {
    if (i) await sleep(2000 * 2 ** (i - 1));
    try { return await requestOnce(keyword); }
    catch (e) {
      last = e;
      if (!/HTTP (429|5\d\d)/.test(String(e))) throw e;
      console.log(`    retry ${i + 1}/4: ${keyword} (${e.message})`);
    }
  }
  throw last;
};

const big = (url) => String(url || '').replace(/_ex=\d+x\d+/, '_ex=800x800');

const main = async () => {
  const seen = new Map();
  const log = [];
  for (const term of KEYWORDS) {
    if (log.length) await sleep(1500);
    let json;
    try { json = await search(term); }
    catch (e) { log.push({ term, error: String(e) }); console.log(`NG  ${term}: ${e}`); continue; }
    const items = (json.Items ?? []).map((x) => x.Item ?? x);
    let kept = 0;
    for (const it of items) {
      const name = it.itemName ?? '';
      if (NG.test(name) || !OK.test(name) || !TURTLE.test(name)) continue;
      const code = it.itemCode;
      if (seen.has(code)) continue;
      const img = big(it.mediumImageUrls?.[0]?.imageUrl ?? it.mediumImageUrls?.[0] ?? '');
      if (!/^https:/.test(img)) continue;
      seen.set(code, {
        scene: sceneOf(name), itemCode: code, name, shop: it.shopName,
        price: it.itemPrice, reviewCount: it.reviewCount, reviewAverage: it.reviewAverage,
        image: img, affiliateUrl: it.affiliateUrl || it.itemUrl, keyword: term,
      });
      kept++;
    }
    log.push({ term, hits: items.length, kept });
    console.log(`OK  ${term}: ${items.length}件中 ${kept}件を採用`);
  }
  const all = [...seen.values()].sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  await fs.writeFile(OUT, JSON.stringify({ fetched_at: new Date().toISOString(), log, items: all }, null, 2));
  console.log(`\n売れ筋（レビュー数順）上位:`);
  for (const p of all.slice(0, 12)) console.log(`  ${String(p.reviewCount).padStart(5)}件 ★${p.reviewAverage}  ${p.name.slice(0, 48)}`);
  console.log(`\n合計 ${all.length} 件を ${OUT} へ保存`);
  if (!all.length) process.exit(1);
};
await main();
