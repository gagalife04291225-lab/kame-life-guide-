#!/usr/bin/env node
/**
 * 種ページ用の実写写真を取得して実装するスクリプト（GitHub Actions から実行）
 *
 * カメライフガイドの写真方針をコードで強制する：
 *   1. ライセンスは CC BY / CC BY-SA / CC0 / PD のみ。NC・ND は失敗させる
 *   2. 期待する学名（亜種まで）と出典側の同定が一致しなければ失敗させる
 *      → 種レベルでしか同定されていない写真を亜種ページに使う事故を機械的に防ぐ
 *   3. 800×600 webp に統一し、作者・出典・ライセンスを photo-credits.html に必ず残す
 *
 * 環境変数:
 *   SOURCE          commons | inaturalist
 *   REF             Commons のファイル名 / iNaturalist の観察ID（URL可）
 *   SLUG            species/{SLUG}.html の slug（例: golden-greek-tortoise）
 *   EXPECTED_TAXON  期待する学名（例: Testudo graeca terrestris）
 *   JP_NAME         写真クレジットに載せる和名（例: ゴールデンギリシャリクガメ）
 *   PHOTO_INDEX     観察に複数枚ある場合の採用番号（既定 0）
 *   DRY_RUN         true なら検証だけ行いファイルを書き換えない
 *   SELF_TEST       true なら通信せず、対象ページの差し込み位置だけ検査する
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const env = (k, d = '') => (process.env[k] ?? d).trim();

const SOURCE = env('SOURCE');
const REF = env('REF');
const SLUG = env('SLUG');
const EXPECTED_TAXON = env('EXPECTED_TAXON');
const JP_NAME = env('JP_NAME');
const PHOTO_INDEX = parseInt(env('PHOTO_INDEX', '0'), 10) || 0;
const DRY_RUN = env('DRY_RUN') === 'true';
const SELF_TEST = env('SELF_TEST') === 'true';

const fail = (msg) => { console.error(`\n✗ ${msg}\n`); process.exit(1); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ── ライセンス判定 ────────────────────────────────────────────
// 許可するのは商用利用でき、改変（トリミング）もできるものだけ。
const LICENSES = {
  'cc0':       { label: 'CC0 1.0',     url: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by':     { label: 'CC BY 4.0',   url: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa':  { label: 'CC BY-SA 4.0',url: 'https://creativecommons.org/licenses/by-sa/4.0/' },
};

function normalizeLicense(raw) {
  const code = String(raw || '').toLowerCase().replace(/\s+/g, '-');
  if (!code) return { allowed: false, reason: '不明（All rights reserved の可能性）' };
  if (/(^|-)nc(-|$)/.test(code)) return { allowed: false, reason: `非営利限定（${raw}）` };
  if (/(^|-)nd(-|$)/.test(code)) return { allowed: false, reason: `改変不可（${raw}）` };
  if (/^pd|public-?domain/.test(code)) {
    return { allowed: true, label: 'パブリックドメイン', url: 'https://creativecommons.org/publicdomain/mark/1.0/' };
  }
  const m = code.match(/^cc-?(by-sa|by|0|zero)?-?([0-9.]+)?/);
  if (!m) return { allowed: false, reason: `判定できないライセンス（${raw}）` };
  const kind = m[1] === '0' || m[1] === 'zero' ? 'cc0' : m[1] === 'by-sa' ? 'cc-by-sa' : m[1] === 'by' ? 'cc-by' : null;
  if (!kind) return { allowed: false, reason: `判定できないライセンス（${raw}）` };
  const version = m[2] || (kind === 'cc0' ? '1.0' : '4.0');
  const base = LICENSES[kind];
  const label = kind === 'cc0' ? `CC0 ${version}` : `${kind === 'cc-by-sa' ? 'CC BY-SA' : 'CC BY'} ${version}`;
  const url = kind === 'cc0'
    ? base.url
    : `https://creativecommons.org/licenses/${kind === 'cc-by-sa' ? 'by-sa' : 'by'}/${version}/`;
  return { allowed: true, label, url };
}

// ── 学名の一致判定 ────────────────────────────────────────────
const normTaxon = (s) => String(s || '')
  .replace(/\b(?:ssp|subsp|var)\.?\s*/gi, ' ')
  .replace(/[_\-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

function assertTaxon(found, haystackExtra = []) {
  const want = normTaxon(EXPECTED_TAXON);
  if (!want) fail('EXPECTED_TAXON が未指定です。亜種まで含めた学名を必ず指定してください。');
  if (want.split(' ').length < 2) fail(`EXPECTED_TAXON "${EXPECTED_TAXON}" が属名+種小名の形になっていません。`);

  const candidates = [found, ...haystackExtra].filter(Boolean).map(normTaxon);
  const hit = candidates.some((c) => c === want || c.includes(want));
  if (!hit) {
    console.error('  期待した学名 :', EXPECTED_TAXON);
    console.error('  出典側の同定 :', found || '(なし)');
    if (haystackExtra.length) console.error('  参照した文字列:', haystackExtra.slice(0, 6).join(' / '));
    fail('学名が一致しません。亜種まで同定された写真だけを使う方針のため中止します。');
  }
  ok(`学名一致: ${EXPECTED_TAXON}`);
}

// ── 出典ごとのメタデータ取得 ──────────────────────────────────
async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'kame-life-guide-photo-bot/1.0 (https://kamelifeguide.com)' } });
  if (!res.ok) fail(`API取得に失敗しました（HTTP ${res.status}）: ${url}`);
  return res.json();
}

const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

// 出典側の文字列（作者名など）をそのままHTMLに入れない。
const escHtml = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

async function fromCommons() {
  let title = REF.replace(/^https?:\/\/[^/]+\/wiki\//, '');
  title = decodeURIComponent(title).replace(/_/g, ' ');
  if (!/^file:/i.test(title)) title = `File:${title}`;

  const api = 'https://commons.wikimedia.org/w/api.php';
  const q = `${api}?action=query&format=json&titles=${encodeURIComponent(title)}` +
            '&prop=imageinfo|categories&cllimit=100&iiprop=url|extmetadata|size&iiurlwidth=1600';
  const data = await getJson(q);
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) fail(`Commons にファイルが見つかりません: ${title}`);

  const info = page.imageinfo?.[0];
  if (!info) fail('imageinfo を取得できませんでした。');
  const meta = info.extmetadata || {};
  const cats = (page.categories || []).map((c) => c.title.replace(/^Category:/, ''));

  const licenseRaw = meta.License?.value || meta.LicenseShortName?.value || '';
  const artist = stripTags(meta.Artist?.value) || '(作者名の記載なし)';
  const objectName = stripTags(meta.ObjectName?.value);
  const description = stripTags(meta.ImageDescription?.value);

  // description（利用者が書いた自由文）は同定の根拠にしない。
  // 「本種は Testudo hermanni。Testudo graeca terrestris とは異なる」のような
  // 比較のための言及だけで一致してしまうため。
  if (description) console.log('  説明文    : (照合には使いません)', description.slice(0, 80));

  return {
    kind: 'commons',
    author: artist,
    licenseRaw,
    sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    sourceLabel: 'Wikimedia Commons',
    sourceExtra: title,
    imageUrl: info.thumburl || info.url,
    taxonFound: '',
    // カテゴリは Commons で最も同定に近い構造化情報。ファイル名・ObjectName は
    // 補助でしかないので、亜種の判定には使わない（taxonCats を参照）。
    taxonHaystack: [...cats, objectName, title],
    taxonCats: cats,
    place: stripTags(meta.ObjectName?.value) || '',
  };
}

async function fromINaturalist() {
  const id = (REF.match(/(\d{3,})/) || [])[1];
  if (!id) fail(`iNaturalist の観察IDを読み取れません: ${REF}`);
  const data = await getJson(`https://api.inaturalist.org/v1/observations/${id}`);
  const obs = data?.results?.[0];
  if (!obs) fail(`観察が見つかりません: ${id}`);

  const photo = obs.photos?.[PHOTO_INDEX];
  if (!photo) fail(`写真 index=${PHOTO_INDEX} が存在しません（この観察の枚数: ${obs.photos?.length || 0}）`);

  const taxon = obs.taxon || {};
  if (taxon.rank) ok(`iNaturalist の同定ランク: ${taxon.rank}`);
  if (obs.quality_grade) ok(`品質グレード: ${obs.quality_grade}`);

  const large = String(photo.url || '').replace(/\/(square|small|medium|thumb)\./, '/large.');

  return {
    kind: 'inaturalist',
    author: obs.user?.name || obs.user?.login || '(作者名の記載なし)',
    licenseRaw: photo.license_code || '',
    sourceUrl: `https://www.inaturalist.org/observations/${id}`,
    sourceLabel: 'iNaturalist',
    sourceExtra: `観察 ${id}`,
    imageUrl: large,
    taxonFound: taxon.name || '',
    // species_guess（投稿者の自由記入）は根拠にしない。コミュニティ同定 taxon.name のみで判定する。
    taxonHaystack: [],
    taxonRank: taxon.rank || '',
    place: obs.place_guess || '',
  };
}

// ── HTML への差し込み ─────────────────────────────────────────
function patchSpeciesPage(meta, lic) {
  const file = path.join(ROOT, 'species', `${SLUG}.html`);
  if (!fs.existsSync(file)) fail(`種ページが見つかりません: species/${SLUG}.html`);
  let s = fs.readFileSync(file, 'utf8');

  const alt = escHtml(`${JP_NAME || SLUG}の生体写真`);
  const figure =
    '<div class="species-photo">\n' +
    '  <figure>\n' +
    `    <img src="../assets/species-photos/${SLUG}.webp" width="800" height="600" loading="lazy" alt="${alt}">\n` +
    `    <figcaption>Photo by ${escHtml(meta.author)} / <a href="${escHtml(meta.sourceUrl)}" target="_blank" rel="noopener nofollow">${escHtml(meta.sourceLabel)}</a>` +
    ` — <a href="${lic.url}" target="_blank" rel="noopener nofollow">${lic.label}</a></figcaption>\n` +
    '  </figure>\n' +
    '</div>\n';

  const pending = /<div class="photo-pending">[\s\S]*?<\/div>\n/;
  // figure で明示的に閉じる。<div>だけを目印にすると後続の別ブロックまで飲み込む。
  const existing = /<div class="species-photo">\s*<figure>[\s\S]*?<\/figure>\s*<\/div>\n/;

  if (pending.test(s)) {
    s = s.replace(pending, figure);
    s = s.replace(/\n *\.photo-pending\{[^}]*\}/, '');
    ok('写真保留ブロックを実写に差し替えました');
  } else if (existing.test(s)) {
    s = s.replace(existing, figure);
    ok('既存の写真ブロックを差し替えました');
  } else {
    fail(`species/${SLUG}.html に .photo-pending も .species-photo も見つかりません。手作業で差し込み位置を用意してください。`);
  }

  if (!s.includes('css/species-photo.css')) {
    s = s.replace('<link rel="stylesheet" href="../css/species.css">',
                  '<link rel="stylesheet" href="../css/species.css">\n<link rel="stylesheet" href="../css/species-photo.css">');
    ok('species-photo.css を読み込みに追加しました');
  }

  s = s.replace(/<meta property="og:image" content="[^"]*">/,
                `<meta property="og:image" content="https://kamelifeguide.com/assets/species-photos/${SLUG}.webp">`);

  if (!DRY_RUN) fs.writeFileSync(file, s);
  return file;
}

// ── 出典の重複チェック（C-2）────────────────────────────────
// 同じ観察・同じファイルを別の種ページに使うと、出典の同定とページの
// 学名が食い違う。同じ種ページの差し替えだけは許可する。
const normUrl = (u) => {
  try { return decodeURIComponent(String(u)).replace(/_/g, ' ').trim().toLowerCase(); }
  catch { return String(u).replace(/_/g, ' ').trim().toLowerCase(); }
};

function pageSourceUrls(html) {
  const re = /https:\/\/(?:www\.inaturalist\.org\/observations\/\d+|commons\.wikimedia\.org\/wiki\/[^"']+)/g;
  return (html.match(re) || []);
}

function assertSourceNotUsedElsewhere(meta) {
  const dir = path.join(ROOT, 'species');
  const want = normUrl(meta.sourceUrl);
  const used = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const slug = f.slice(0, -5);
    if (slug === SLUG) continue; // 同じ種ページの差し替えは許可
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    if (pageSourceUrls(html).some((u) => normUrl(u) === want)) used.push(slug);
  }
  if (used.length) {
    console.error('  すでに使用中の種ページ:', used.map((x) => `species/${x}.html`).join(' / '));
    fail('この出典は別の種ページで既に使われています。\n' +
         '  1つの観察・1つのファイルは1個体・1同定なので、複数の種に使うと\n' +
         '  出典の同定とページの学名が食い違います。別の写真を選んでください。\n' +
         `  出典: ${meta.sourceUrl}`);
  }
  ok('この出典を使っている他の種ページはありません');
}

// 差し替え前に、いまページが載せている出典URLを控える（C-1 で使う）。
function currentSourceUrl() {
  const f = path.join(ROOT, 'species', `${SLUG}.html`);
  if (!fs.existsSync(f)) return null;
  const block = fs.readFileSync(f, 'utf8').match(/<div class="species-photo">[\s\S]{0,1400}/);
  if (!block) return null;
  return pageSourceUrls(block[0])[0] || null;
}

function patchPhotoCredits(meta, lic, oldSourceUrl) {
  const file = path.join(ROOT, 'photo-credits.html');
  let s = fs.readFileSync(file, 'utf8');

  const dl =
    '    <dl class="pc-dl">\n' +
    `      <div><dt>作者</dt><dd>${escHtml(meta.author)}</dd></div>\n` +
    `      <div><dt>出典</dt><dd><a href="${escHtml(meta.sourceUrl)}" target="_blank" rel="noopener nofollow">${escHtml(meta.sourceLabel)}（${escHtml(meta.sourceExtra)}）</a></dd></div>\n` +
    `      <div><dt>ライセンス</dt><dd><a href="${lic.url}" target="_blank" rel="noopener nofollow">${lic.label}</a></dd></div>\n` +
    '    </dl>\n';
  const item =
    '  <div class="pc-item">\n' +
    `    <div class="pc-head"><span class="pc-jp">${escHtml(JP_NAME || SLUG)}</span><span class="pc-latin">${escHtml(EXPECTED_TAXON)}</span></div>\n` +
    dl +
    '  </div>\n';

  // ── C-1: 既存エントリがあるなら、作者・出典・ライセンスを新しい写真のものに更新する ──
  // 学名だけを鍵にすると同じ学名の別エントリを取り違えるので、
  // まず「差し替え前にページが載せていた出典URL」で特定し、無ければ学名で探す。
  const blocks = [];
  const re = /  <div class="pc-item">\n(?:(?!  <div class="pc-item">)[\s\S])*?  <\/div>\n/g;
  let m;
  while ((m = re.exec(s)) !== null) blocks.push({ text: m[0], start: m.index, end: m.index + m[0].length });

  const latinTag = `<span class="pc-latin">${escHtml(EXPECTED_TAXON)}</span>`;
  const byLatin = blocks.filter((b) => b.text.includes(latinTag));
  const byUrl = oldSourceUrl
    ? blocks.filter((b) => pageSourceUrls(b.text).some((u) => normUrl(u) === normUrl(oldSourceUrl)))
    : [];

  let target = null;
  const both = byUrl.filter((b) => byLatin.includes(b));
  if (both.length === 1) target = both[0];
  else if (byUrl.length === 1) target = byUrl[0];
  else if (byLatin.length === 1) target = byLatin[0];
  else if (byLatin.length > 1) {
    fail(`photo-credits.html に "${EXPECTED_TAXON}" のエントリが ${byLatin.length} 件あり、` +
         'どれを更新すべきか特定できません。手作業で整理してから再実行してください。');
  }

  if (target) {
    const updated = target.text.replace(/    <dl class="pc-dl">\n[\s\S]*?    <\/dl>\n/, dl);
    if (updated === target.text) fail('photo-credits.html の既存エントリを更新できませんでした（構造が想定と異なります）。');
    s = s.slice(0, target.start) + updated + s.slice(target.end);
    if (!DRY_RUN) fs.writeFileSync(file, s);
    ok('photo-credits.html の既存エントリを新しい作者・出典・ライセンスに更新しました');
    return file;
  }

  const anchor = '\n  <p class="pc-note">';
  if (!s.includes(anchor)) fail('photo-credits.html の追記位置（pc-note）が見つかりません。');
  s = s.replace(anchor, '\n' + item + anchor);
  if (!DRY_RUN) fs.writeFileSync(file, s);
  ok('photo-credits.html に作者・出典・ライセンスを追記しました');
  return file;
}

function patchSpeciesList() {
  const file = path.join(ROOT, 'species-list.html');
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes(`"${SLUG}":1`)) { ok('species-list.html には登録済みでした'); return file; }
  const m = s.match(/var PHOTO_SLUGS = \{/);
  if (!m) fail('species-list.html の PHOTO_SLUGS が見つかりません。');
  s = s.replace('var PHOTO_SLUGS = {', `var PHOTO_SLUGS = {"${SLUG}":1,`);
  if (!DRY_RUN) fs.writeFileSync(file, s);
  ok('species-list.html の PHOTO_SLUGS に登録しました（一覧サムネイル）');
  return file;
}

// ── セルフテスト（通信なし・差し込み位置の確認のみ）──────────
if (SELF_TEST) {
  console.log(`\n[SELF TEST] species/${SLUG}.html の差し込み位置を確認します`);
  const f = path.join(ROOT, 'species', `${SLUG}.html`);
  if (!fs.existsSync(f)) fail(`種ページがありません: species/${SLUG}.html`);
  const s = fs.readFileSync(f, 'utf8');
  const hasSlot = /<div class="photo-pending">/.test(s) || /<div class="species-photo">/.test(s);
  if (!hasSlot) fail('写真の差し込み位置（.photo-pending / .species-photo）がありません。');
  ok('写真の差し込み位置あり');
  if (!fs.readFileSync(path.join(ROOT, 'photo-credits.html'), 'utf8').includes('\n  <p class="pc-note">')) {
    fail('photo-credits.html の追記位置が見つかりません。');
  }
  ok('photo-credits.html の追記位置あり');
  if (!fs.readFileSync(path.join(ROOT, 'species-list.html'), 'utf8').includes('var PHOTO_SLUGS = {')) {
    fail('species-list.html の PHOTO_SLUGS が見つかりません。');
  }
  ok('species-list.html の PHOTO_SLUGS あり');
  console.log('\n[SELF TEST] PASS\n');
  process.exit(0);
}

// ── 本処理 ────────────────────────────────────────────────────
if (!SOURCE || !REF || !SLUG || !EXPECTED_TAXON) {
  fail('SOURCE / REF / SLUG / EXPECTED_TAXON はすべて必須です。');
}

console.log(`\n■ 出典: ${SOURCE}  参照: ${REF}`);
console.log(`■ 対象: species/${SLUG}.html  期待する学名: ${EXPECTED_TAXON}\n`);

const meta = SOURCE === 'commons' ? await fromCommons()
           : SOURCE === 'inaturalist' ? await fromINaturalist()
           : fail(`SOURCE は commons か inaturalist を指定してください（受け取った値: ${SOURCE}）`);

console.log('▼ 取得したメタデータ');
console.log('  作者      :', meta.author);
console.log('  ライセンス:', meta.licenseRaw || '(記載なし)');
console.log('  同定      :', meta.taxonFound || '(構造化データなし・カテゴリ等で照合)');
console.log('  撮影地    :', meta.place || '(記載なし)');
console.log('  画像URL   :', meta.imageUrl);
console.log('');

console.log('▼ 検証');
const lic = normalizeLicense(meta.licenseRaw);
if (!lic.allowed) fail(`このライセンスでは掲載できません: ${lic.reason}\n  カメライフガイドは CC BY / CC BY-SA / CC0 / PD のみを使用します。`);
ok(`ライセンス可: ${lic.label}`);
assertTaxon(meta.taxonFound, meta.taxonHaystack);

// 三名法（亜種まで）を求めたときは、出典側でも亜種として同定されていること。
const wantsSubspecies = EXPECTED_TAXON.trim().split(/\s+/).length >= 3;

if (wantsSubspecies && meta.kind === 'inaturalist' && meta.taxonRank !== 'subspecies') {
  fail(`iNaturalist の同定ランクが "${meta.taxonRank || '不明'}" です（期待: subspecies）。` +
       '亜種まで同定された観察だけを使う方針のため中止します。');
}

if (wantsSubspecies && meta.kind === 'commons') {
  // Commons には同定ランクの構造化データが無い。カテゴリが最も同定に近いので、
  // 亜種を求めた場合はカテゴリでの一致を必須にする。
  // ファイル名・ObjectName・説明文は、いずれも書き手の自由文なので根拠にしない。
  const want = normTaxon(EXPECTED_TAXON);
  const catHit = (meta.taxonCats || []).map(normTaxon).some((c) => c === want || c.includes(want));
  if (!catHit) {
    console.error('  期待した学名  :', EXPECTED_TAXON);
    console.error('  カテゴリ      :', (meta.taxonCats || []).join(' / ') || '(なし)');
    fail('Commons のカテゴリに亜種名が見つかりません。\n' +
         '  Commons は同定の構造化データを持たないため、亜種を指定した場合は\n' +
         `  Category:${EXPECTED_TAXON} 相当のカテゴリが付いた写真だけを使います。`);
  }
  ok(`カテゴリで亜種を確認: ${EXPECTED_TAXON}`);
}

if (meta.kind === 'commons') {
  console.log('  ! Commons は同定の構造化データを持ちません。この写真は要目視確認です。');
}

// 同じ出典を別の種ページで使い回していないか（C-2）。書き込み前に確認する。
assertSourceNotUsedElsewhere(meta);

if (!meta.author || /記載なし/.test(meta.author)) {
  fail('作者名を取得できませんでした。帰属表示ができないため中止します。');
}
ok(`作者名あり: ${meta.author}`);

// 画像取得 → 800×600 webp
console.log('\n▼ 画像処理');
const res = await fetch(meta.imageUrl, { headers: { 'User-Agent': 'kame-life-guide-photo-bot/1.0 (https://kamelifeguide.com)' } });
if (!res.ok) fail(`画像の取得に失敗しました（HTTP ${res.status}）`);
const buf = Buffer.from(await res.arrayBuffer());
ok(`元画像 ${Math.round(buf.length / 1024)} KB`);

// ESM の import は NODE_PATH を参照しないため、CJS の require で解決する。
// （sharp をリポジトリ外に置いているので、明示パスを渡せるようにしておく）
const { createRequire } = await import('node:module');
const requireCjs = createRequire(import.meta.url);
const sharp = requireCjs(env('SHARP_PATH') || 'sharp');
const outPath = path.join(ROOT, 'assets', 'species-photos', `${SLUG}.webp`);
const srcMeta = await sharp(buf).metadata();
ok(`元画像の寸法 ${srcMeta.width}×${srcMeta.height}`);
if (!srcMeta.width || !srcMeta.height) fail('元画像の寸法を取得できませんでした。');
if (srcMeta.width < 800 || srcMeta.height < 600) {
  fail(`元画像が小さすぎます（${srcMeta.width}×${srcMeta.height}）。` +
       '800×600 に引き伸ばすと画質が落ちるため中止します。より大きい写真を選んでください。');
}
const ratio = srcMeta.width / srcMeta.height;
if (ratio < 0.9 || ratio > 2.2) {
  console.log(`  ! 縦横比 ${ratio.toFixed(2)} は 4:3 から離れています。中央を切り出すため、` +
              '被写体が切れていないか PR で必ず目視確認してください。');
}
const out = await sharp(buf).resize(800, 600, { fit: 'cover', position: 'centre' }).webp({ quality: 88 }).toBuffer();
if (!DRY_RUN) fs.writeFileSync(outPath, out);
ok(`800×600 webp を書き出し（${Math.round(out.length / 1024)} KB）${DRY_RUN ? ' ※DRY_RUNのため未保存' : ''}`);

// HTML 反映
console.log('\n▼ ページ反映');
// 差し替え前の出典URLを控えてからページを書き換える（photo-credits の特定に使う）。
const oldSourceUrl = currentSourceUrl();
const touched = [patchSpeciesPage(meta, lic), patchPhotoCredits(meta, lic, oldSourceUrl), patchSpeciesList()];

console.log('\n▼ 完了');
console.log('  更新:', touched.map((f) => path.relative(ROOT, f)).join(', '));
console.log(`  画像: assets/species-photos/${SLUG}.webp`);
console.log(`  表記: Photo by ${meta.author} / ${meta.sourceLabel} — ${lic.label}`);
if (DRY_RUN) console.log('\n  ※ DRY_RUN のためファイルは書き換えていません。\n');
