#!/usr/bin/env node
/**
 * 掲載できる写真の候補を iNaturalist から探すだけのスクリプト。
 *
 * 読み取り専用です。このファイルにはファイルを書き込む処理が一切ありません
 * （fs を import すらしていません）。HTML・画像・photo-credits.html・
 * species-list.html のいずれも触りません。ブランチも PR も作りません。
 *
 * 環境変数:
 *   EXPECTED_TAXON  探したい学名（例: Testudo graeca / Testudo graeca ibera）
 *   MAX_RESULTS     出力する候補の最大数（既定 5）
 *
 * 絞り込みの条件:
 *   - quality_grade = research
 *   - taxon.name が期待学名と完全一致
 *   - 三名法（3語以上）を指定したときは taxon.rank = subspecies
 *   - 写真のライセンスが CC BY / CC BY-SA / CC0
 *   - 作者名が取れること
 *   - 取得後の "large" 画像が 800×600 以上になること
 */

const env = (k, d = '') => (process.env[k] ?? d).trim();
const EXPECTED_TAXON = env('EXPECTED_TAXON');
const MAX_RESULTS = Math.max(1, Math.min(20, parseInt(env('MAX_RESULTS', '5'), 10) || 5));

const UA = 'kame-life-guide-photo-bot/1.0 (https://kamelifeguide.com)';

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

// 掲載できるライセンスだけを通す（NC・ND は不可）。取得側と同じ基準。
const LICENSES = {
  'cc0':       { label: 'CC0 1.0',     url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by':     { label: 'CC BY 4.0',   url: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa':  { label: 'CC BY-SA 4.0', url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
};

// iNaturalist の "large" は長辺 1024px に縮小される。取得側は large を
// ダウンロードして 800×600 以上かを見るので、ここでも同じ寸法を予測する。
// （原寸だけを見ると、縦長写真が検索では通って取得で落ちる）
function largeDims(w, h) {
  if (!w || !h) return null;
  const longest = Math.max(w, h);
  if (longest <= 1024) return { w, h };
  const s = 1024 / longest;
  return { w: Math.round(w * s), h: Math.round(h * s) };
}

function largeUrl(url) {
  return String(url || '').replace(/\/(square|small|medium|thumb)\./, '/large.');
}

if (!EXPECTED_TAXON) fail('EXPECTED_TAXON が未指定です。探したい学名を指定してください。');

const words = EXPECTED_TAXON.split(/\s+/).filter(Boolean);
if (words.length < 2) fail(`EXPECTED_TAXON "${EXPECTED_TAXON}" が属名+種小名の形になっていません。`);
const wantsSubspecies = words.length >= 3;

console.log(`\n■ 候補検索: ${EXPECTED_TAXON}`);
console.log(`■ 条件: research grade / CC BY・CC BY-SA・CC0 / large が 800×600 以上` +
            (wantsSubspecies ? ' / 同定ランク subspecies' : ''));
console.log('■ このモードはファイルを一切変更しません。\n');

// ── 1段目: 学名から taxon ID を完全一致で確定する ──────────────
// 学名をそのまま観察検索に渡すと、iNaturalist が属レベルまで拾って
// 別種が混ざる（例: Geoemyda spengleri で Geoemyda japonica が返る）。
// 先に taxon を一意に確定し、そのIDで観察を引く。
const tq = new URL('https://api.inaturalist.org/v1/taxa');
tq.searchParams.set('q', EXPECTED_TAXON);
tq.searchParams.set('per_page', '30');
tq.searchParams.set('locale', 'en');

const tRes = await fetch(tq, { headers: { 'User-Agent': UA } });
if (!tRes.ok) fail(`iNaturalist の taxa 取得に失敗しました（HTTP ${tRes.status}）`);
const tData = await tRes.json();

const matched = (tData?.results || []).filter((t) => {
  if (t.name !== EXPECTED_TAXON) return false;        // 学名の完全一致だけ
  if (t.is_active === false) return false;             // 廃止された taxon は使わない
  if (wantsSubspecies && t.rank !== 'subspecies') return false;
  return true;
});

if (matched.length === 0) {
  console.error(`  候補になった taxon: ${(tData?.results || []).slice(0, 8).map((t) => `${t.name}(${t.rank})`).join(' / ') || 'なし'}`);
  fail(`"${EXPECTED_TAXON}" に完全一致する taxon が iNaturalist に見つかりません。\n` +
       '  綴りを確認するか、現行分類で使われている名前かを見直してください。');
}
if (matched.length > 1) {
  console.error('  該当した taxon:');
  for (const t of matched) console.error(`    id=${t.id} ${t.name} (${t.rank})`);
  fail(`"${EXPECTED_TAXON}" に完全一致する taxon が ${matched.length} 件あり、1つに絞れません。\n` +
       '  取り違えると別の分類群の写真を選ぶことになるため中止します。');
}

const taxon = matched[0];
console.log(`▼ taxon を確定しました`);
console.log(`  taxon id   : ${taxon.id}`);
console.log(`  taxon.name : ${taxon.name}`);
console.log(`  taxon.rank : ${taxon.rank}`);
console.log(`  観察数     : ${taxon.observations_count ?? '不明'}`);
console.log(`  ページ     : https://www.inaturalist.org/taxa/${taxon.id}\n`);

// ── 2段目: 確定した taxon ID で観察を引く ──────────────────────
const q = new URL('https://api.inaturalist.org/v1/observations');
q.searchParams.set('taxon_id', String(taxon.id));
q.searchParams.set('quality_grade', 'research');
q.searchParams.set('photos', 'true');
q.searchParams.set('photo_license', 'cc-by,cc-by-sa,cc0');
q.searchParams.set('order_by', 'votes');
q.searchParams.set('order', 'desc');
q.searchParams.set('per_page', '100');
q.searchParams.set('locale', 'en');

const res = await fetch(q, { headers: { 'User-Agent': UA } });
if (!res.ok) fail(`iNaturalist API の取得に失敗しました（HTTP ${res.status}）`);
const data = await res.json();
const results = data?.results || [];
console.log(`▼ API が返した観察: ${results.length} 件（総数 ${data?.total_results ?? '不明'}）\n`);

const reject = { taxon: 0, rank: 0, license: 0, author: 0, size: 0, dims: 0 };
const hits = [];

for (const obs of results) {
  // 二重ゲート: taxon ID で引いた後も、観察ごとに学名とランクを再確認する。
  // taxon_id 検索は下位分類群（亜種など）の観察も含むため。
  const ot = obs.taxon || {};
  if ((ot.name || '') !== EXPECTED_TAXON) { reject.taxon++; continue; }
  if (wantsSubspecies && ot.rank !== 'subspecies') { reject.rank++; continue; }

  const author = obs.user?.name || obs.user?.login || '';
  if (!author) { reject.author++; continue; }

  // 観察に複数枚ある場合、条件を満たす最初の1枚を採用候補にする。
  let picked = null;
  let sawLicense = false;
  let sawDims = false;
  for (let i = 0; i < (obs.photos || []).length; i++) {
    const p = obs.photos[i];
    const lic = LICENSES[p.license_code];
    if (!lic) continue;
    sawLicense = true;
    const od = p.original_dimensions;
    if (!od?.width || !od?.height) continue;
    sawDims = true;
    const lg = largeDims(od.width, od.height);
    if (!lg || lg.w < 800 || lg.h < 600) continue;
    picked = { index: i, lic, orig: od, large: lg, url: largeUrl(p.url) };
    break;
  }
  if (!picked) {
    if (!sawLicense) reject.license++;
    else if (!sawDims) reject.dims++;
    else reject.size++;
    continue;
  }

  hits.push({
    id: obs.id,
    taxonName: ot.name,
    rank: ot.rank || '(不明)',
    author,
    login: obs.user?.login || '',
    lic: picked.lic,
    place: obs.place_guess || '(記載なし)',
    orig: picked.orig,
    large: picked.large,
    photoUrl: picked.url,
    photoIndex: picked.index,
    photoCount: (obs.photos || []).length,
    faves: obs.faves_count ?? 0,
  });
  if (hits.length >= MAX_RESULTS) break;
}

console.log('▼ 除外の内訳');
console.log(`  学名が一致しない        : ${reject.taxon}`);
if (wantsSubspecies) console.log(`  同定ランクが亜種でない  : ${reject.rank}`);
console.log(`  ライセンス不可          : ${reject.license}`);
console.log(`  作者名なし              : ${reject.author}`);
console.log(`  原寸が不明              : ${reject.dims}`);
console.log(`  large が 800×600 未満   : ${reject.size}`);

if (!hits.length) {
  console.log('\n▼ 結果: 条件を満たす候補は見つかりませんでした。');
  console.log('  学名の綴り、または条件（亜種ランク・ライセンス・解像度）を見直してください。\n');
  process.exit(0);
}

console.log(`\n▼ 候補 ${hits.length} 件（お気に入り数の多い順）\n`);
hits.forEach((h, n) => {
  console.log(`── 候補 ${n + 1} ─────────────────────────────────`);
  console.log(`  observation ID : ${h.id}`);
  console.log(`  taxon.name     : ${h.taxonName}`);
  console.log(`  taxon.rank     : ${h.rank}`);
  console.log(`  作者           : ${h.author}${h.login && h.login !== h.author ? ` (@${h.login})` : ''}`);
  console.log(`  ライセンス     : ${h.lic.label}`);
  console.log(`  撮影地         : ${h.place}`);
  console.log(`  元画像サイズ   : ${h.orig.width}×${h.orig.height}`);
  console.log(`  取得後の寸法   : ${h.large.w}×${h.large.h}（large。800×600 に切り出し）`);
  console.log(`  写真URL        : ${h.photoUrl}`);
  console.log(`  観察ページ     : https://www.inaturalist.org/observations/${h.id}`);
  console.log(`  採用する枚目   : photo_index=${h.photoIndex}（この観察の写真は ${h.photoCount} 枚）`);
  console.log(`  お気に入り数   : ${h.faves}`);
  console.log('');
});

console.log('▼ 次の手順');
console.log('  写真の見栄えと、写っている個体が本当にその種かは人の目で確認してください。');
console.log('  採用する場合は mode=fetch・dry_run=true で同じ観察IDを流し、');
console.log('  検証が通ってから dry_run=false にしてください。\n');
