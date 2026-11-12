/**
 * 亀の案内人（js/annainin.js）の数値読み取りの回帰テスト
 *
 * 背景: parseNums が /\d+/ だったため "17.6cm" を 17 と 6 に分けて読み、
 * 「成体の甲長はおおよそ6〜120cm」という実在しない最小値を出していた。
 *
 *   node tools/test-annainin-numbers.mjs
 *
 * 実ブラウザは使わず、species.js と annainin.js を vm で読み込んで検査する。
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function load(speciesSource) {
  const ctx = {
    console,
    document: { addEventListener() {}, getElementById() { return null; } },
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  if (speciesSource !== null) vm.runInContext(speciesSource, ctx, { filename: 'species.js' });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/annainin.js'), 'utf8'), ctx, { filename: 'annainin.js' });
  return ctx.KameAnnainin;
}

let pass = 0, fail = 0;
const t = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name + '\n        got  ' + JSON.stringify(got) + '\n        want ' + JSON.stringify(want)); }
};

const realSpecies = fs.readFileSync(path.join(ROOT, 'shindan/species.js'), 'utf8');
const A = load(realSpecies);
const P = A._test.parseNums;

console.log('\n[1] parseNums — 整数・小数・範囲・未設定');
t('整数', P('14cm'), [14]);
t('小数', P('17.6cm'), [17.6]);
t('小数（10.7）', P('10.7cm'), [10.7]);
t('範囲（整数）', P('40〜80年'), [40, 80]);
t('範囲（小数を含む）', P('13.5〜16.8cm'), [13.5, 16.8]);
t('注記付き', P('17.5cm超（オス）'), [17.5]);
t('雌雄の併記', P('オス〜12cm/メス〜27cm'), [12, 27]);
t('数字なし', P('不明'), null);
t('空文字', P(''), null);
t('null', P(null), null);
t('undefined', P(undefined), null);
t('数値0', P(0), [0]);

console.log('\n[2] sizeSummary — 実データで小数が分割されない');
const s = A._test.sizeSummary();
// 期待値を独立に計算する: 各種の coreSpecs.size の中の最大の数（小数込み）
const ctx2 = {}; vm.createContext(ctx2);
vm.runInContext(realSpecies + ';this.S = SPECIES;', ctx2);
const uppers = ctx2.S.all.filter(x => x.sizeEvidenceKind !== 'uncertain_report').map(x => x.coreSpecs && String(x.coreSpecs.size || '').match(/\d+(?:\.\d+)?/g))
  .filter(Boolean).map(a => Math.max(...a.map(Number)));
t('最小値＝各種の上限のうち最小（小数を分割しない）', s.min, Math.min(...uppers));
t('最大値', s.max, Math.max(...uppers));
t('最小値は 6cm（17.6 の「6」等）にならない', s.min > 6, true);
t('最小の種の名前がある', typeof s.minName === 'string' && s.minName.length > 0, true);

console.log('\n[3] sizeSummary — 小数だけのデータ');
const B = load("const SPECIES = { all: [ { name: 'A', coreSpecs: { size: '10.7cm' } }, { name: 'B', coreSpecs: { size: '17.6cm' } }, { name: 'C', coreSpecs: {} } ] };");
t('min/max/名前', B._test.sizeSummary(), { min: 10.7, max: 17.6, minName: 'A', maxName: 'B' });
const D = load("const SPECIES = { all: [ { name: 'X', coreSpecs: { size: 'オス7cm/メス12cm' } }, { name: 'Y', coreSpecs: { size: '10.7cm' } } ] };");
t('雌雄併記は上限側（12）で比べる', D._test.sizeSummary().min, 10.7);

console.log('\n[4] 種データなし');
const C = load(null);
t('sizeSummary は null を返す', C._test.sizeSummary(), { min: null, max: null, minName: null, maxName: null });

console.log('\n[5] 「大きさ」の回答が一般的な成体サイズと読めない');
const reply = A.getAnnaininResponse('size').reply;
t('上限側の数字だと書いている', /一般的な成体の大きさではなく上限側/.test(reply), true);
t('「成体の甲長はおおよそ」と書いていない', /成体の甲長はおおよそ/.test(reply), false);

const E = load("const SPECIES = { all: [ {name:'valid',coreSpecs:{size:'17cm'}},{name:'uncertain',sizeEvidenceKind:'uncertain_report',coreSpecs:{size:'999cm'}},{name:'cherry',coreSpecs:{size:'地域型の上限は未確立'},sizeNote:'飼育個体30cm'},{name:'albino',coreSpecs:{size:'色彩型固有の記録なし'},sizeNote:'参考23cm'} ] };");
t('疑義ある最大報告と型の個別記録を集計しない', E._test.sizeSummary(), {min:17,max:17,minName:'valid',maxName:'valid'});
for (const slug of ['cherry-head-tortoise','albino-chinese-softshell']) {
 const rec=ctx2.S.all.find(x=>x.slug===slug);
 t(slug+'の最大欄に集計可能な数字なし', P(rec.coreSpecs.size), null);
}
t('ギリシャの疑義を集計除外用属性で示す',ctx2.S.all.find(x=>x.slug==='greek-tortoise').sizeEvidenceKind,'uncertain_report');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
