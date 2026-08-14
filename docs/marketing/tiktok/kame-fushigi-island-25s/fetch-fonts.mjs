#!/usr/bin/env node
/**
 * 動画で使うフォントを fonts/ に取り込む（サブセット）。
 *
 *   node fetch-fonts.mjs
 *
 * レンダリング用の Chromium は外部ネットワークに出られないことがあるため、
 * Google Fonts を実行時に読み込ませず、あらかじめ woff2 を同梱して
 * storyboard.html を完全自己完結にする。
 *
 * ⚠ テロップに「ここに無い漢字」を追加したときは、KANJI に足して再実行すること。
 *   （かな・英数・記号はすでに全部入っているので、かなだけの修正なら再実行不要）
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(HERE, 'fonts');
mkdirSync(FONT_DIR, { recursive: true });

// ---------- 収録する文字 ----------
const range = (a, b) => {
  let s = '';
  for (let c = a.codePointAt(0); c <= b.codePointAt(0); c++) s += String.fromCodePoint(c);
  return s;
};

const ASCII       = range(' ', '~');
const HIRAGANA    = range('ぁ', 'ゖ') + 'ゝゞ゛゜';
const KATAKANA    = range('ァ', 'ヶ') + 'ヽヾ・ー';
const PUNCT       = '。、「」『』（）〔〕【】！？〜～—―…‥：；・／＼＆＋－＝％＃＠＊　“”‘’';
const FULLWIDTH   = range('０', '９') + range('Ａ', 'Ｚ') + range('ａ', 'ｚ');
/** テロップ・エンドカードで使う漢字（storyboard.html の文言と対応） */
const KANJI       = '息子連帰何食場所暮親調見探考拾学島';

const TEXT = [...new Set([...(ASCII + HIRAGANA + KATAKANA + PUNCT + FULLWIDTH + KANJI)])].join('');

// ---------- 取得対象 ----------
const TARGETS = [
  { family: 'M PLUS Rounded 1c', weights: [700, 800], slug: 'mplus-rounded-1c' },
  { family: 'Noto Sans JP',      weights: [400, 700], slug: 'noto-sans-jp' }
];

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/** curl 経由で取得する（Node の fetch は HTTPS_PROXY を見ないため） */
const curl = (url, extra = []) =>
  execFileSync('curl', ['-fsSL', '-H', 'User-Agent: ' + UA, ...extra, url],
    { maxBuffer: 64 * 1024 * 1024, encoding: extra.includes('--output') ? 'utf8' : 'buffer' });

const css = [];
let totalBytes = 0;

for (const { family, weights, slug } of TARGETS) {
  for (const weight of weights) {
    const api = 'https://fonts.googleapis.com/css2'
      + '?family=' + encodeURIComponent(family) + ':wght@' + weight
      + '&text=' + encodeURIComponent(TEXT);

    const sheet = curl(api).toString('utf8');
    // &text= 指定時の URL は https://fonts.gstatic.com/l/font?kit=... 形式で
    // 拡張子が付かないため、拡張子ではマッチさせない。
    const m = sheet.match(/src:\s*url\((https:\/\/[^)]+)\)/);
    if (!m) throw new Error('woff2 の URL を取得できませんでした: ' + family + ' ' + weight + '\n' + sheet.slice(0, 400));

    const woff2 = curl(m[1]);
    const file = `${slug}-${weight}.woff2`;
    writeFileSync(path.join(FONT_DIR, file), woff2);
    totalBytes += woff2.length;
    console.log(`✓ ${file}  ${(woff2.length / 1024).toFixed(1)} KB`);

    css.push(
      `@font-face{`,
      `  font-family:'${family}';`,
      `  font-style:normal;`,
      `  font-weight:${weight};`,
      `  font-display:block;`,
      `  src:url('${file}') format('woff2');`,
      `}`
    );
  }
}

writeFileSync(
  path.join(FONT_DIR, 'fonts.css'),
  '/* fetch-fonts.mjs が自動生成。直接編集しない。 */\n' + css.join('\n') + '\n'
);

console.log(`\n✓ fonts/fonts.css を生成（合計 ${(totalBytes / 1024).toFixed(1)} KB / ${[...TEXT].length} 文字）`);
