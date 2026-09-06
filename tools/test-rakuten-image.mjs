/**
 * rakutenImageUrl 実装の回帰テスト（Schema v5）
 *
 * 実APIを叩かず、楽天レスポンスの両フォーマットを fixture で再現して
 * 「画像URLの抽出」「products.js への書き込み」「降格時のクリア」を検証する。
 *
 *   node tools/test-rakuten-image.mjs
 */
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { extractRakutenImageUrl, patchProductInSource, demotionUpdates } =
  require('../scripts/update-rakuten.js');

let pass = 0, fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + '\n        got  ' + JSON.stringify(got) +
                             '\n        want ' + JSON.stringify(want)); }
};

console.log('\n[1] extractRakutenImageUrl — レスポンス形の両対応');
const OK_URL = 'https://thumbnail.image.rakuten.co.jp/@0_mall/shop/cabinet/a/b.jpg?_ex=128x128';
// formatVersion 未指定（v1）: [{imageUrl}]
t('v1 mediumImageUrls (オブジェクト配列)',
  extractRakutenImageUrl({ mediumImageUrls: [{ imageUrl: OK_URL }] }), OK_URL);
// formatVersion=2: 文字列配列
t('v2 mediumImageUrls (文字列配列)',
  extractRakutenImageUrl({ mediumImageUrls: [OK_URL] }), OK_URL);
// medium が無ければ small へフォールバック
t('small へフォールバック',
  extractRakutenImageUrl({ mediumImageUrls: [], smallImageUrls: [{ imageUrl: OK_URL }] }), OK_URL);
t('medium を small より優先',
  extractRakutenImageUrl({ mediumImageUrls: [{ imageUrl: OK_URL }],
                           smallImageUrls: [{ imageUrl: 'https://image.rakuten.co.jp/x/s.jpg' }] }), OK_URL);
// 返す値は「APIが返した文字列そのまま」— リサイズ指定を書き換えない
t('URLを改変しない（_ex をそのまま保持）',
  extractRakutenImageUrl({ mediumImageUrls: [{ imageUrl: OK_URL }] }).includes('?_ex=128x128'), true);

console.log('\n[2] extractRakutenImageUrl — 不正入力は必ず null');
t('画像フィールドなし',     extractRakutenImageUrl({ itemName: 'x' }), null);
t('空配列',                 extractRakutenImageUrl({ mediumImageUrls: [] }), null);
t('null / undefined',       extractRakutenImageUrl(null), null);
t('http は拒否',            extractRakutenImageUrl({ mediumImageUrls: ['http://thumbnail.image.rakuten.co.jp/a.jpg'] }), null);
t('楽天外ホストは拒否',      extractRakutenImageUrl({ mediumImageUrls: ['https://evil.example.com/a.jpg'] }), null);
t('ホスト偽装は拒否',        extractRakutenImageUrl({ mediumImageUrls: ['https://thumbnail.image.rakuten.co.jp.evil.com/a.jpg'] }), null);
t('URLでない文字列は拒否',   extractRakutenImageUrl({ mediumImageUrls: ['javascript:alert(1)'] }), null);
t('不正を飛ばして有効を拾う', extractRakutenImageUrl({ mediumImageUrls: ['not-a-url', { imageUrl: OK_URL }] }), OK_URL);

console.log('\n[3] patchProductInSource — 新フィールドの追加と降格クリア');
const SRC = [
  'const PRODUCTS = {',
  '',
  '  demo_item: {',
  "    id: 'demo_item',",
  "    name: 'デモ商品',",
  "    rakutenStatus: 'available',",
  '    rakutenUrl: null,',
  '  },',
  '',
  '};',
].join('\n');

// 既存フィールドに rakutenImageUrl が「無い」状態から追加できること
const added = patchProductInSource(SRC, 'demo_item', { rakutenImageUrl: OK_URL });
t('未定義フィールドを追加できる', /rakutenImageUrl: '.*b\.jpg\?_ex=128x128',/.test(added), true);
t('既存フィールドを壊さない',     added.includes("name: 'デモ商品',"), true);

// 2回目の適用で重複しないこと（冪等性）
const twice = patchProductInSource(added, 'demo_item', { rakutenImageUrl: OK_URL });
t('冪等: 重複行が増えない', (twice.match(/rakutenImageUrl:/g) || []).length, 1);

// 降格すると画像が必ず null になること
const demoted = patchProductInSource(added, 'demo_item', demotionUpdates('2026-09-07', 5.0));
t('降格で rakutenImageUrl が null', /rakutenImageUrl: null,/.test(demoted), true);
t('降格で status が search',        /rakutenStatus: 'search',/.test(demoted), true);
t('降格で rakutenUrl が null',      /rakutenUrl: null,/.test(demoted), true);

console.log('\n[4] demotionUpdates が画像を落とすこと');
t('demotionUpdates に rakutenImageUrl: null',
  Object.prototype.hasOwnProperty.call(demotionUpdates('2026-09-07', null), 'rakutenImageUrl') &&
  demotionUpdates('2026-09-07', null).rakutenImageUrl === null, true);

console.log('\n──────────────────────────────');
console.log('PASS ' + pass + ' / FAIL ' + fail);
process.exit(fail === 0 ? 0 : 1);
