#!/usr/bin/env node
/**
 * 種ページ（species/*.html）の「このページの目次」を生成して差し替える。
 *
 *   node tools/gen-species-toc.js          … 生成して書き込む
 *   node tools/gen-species-toc.js --check  … 差分があるかだけ調べる（書き込まない）
 *
 * 入力は各ページ自身の <h2> 見出しだけ。本文・見出しの文言は一切変更しない。
 * やることは2つ:
 *   1. 目次対象の h2 に id="sec-N" を付与する（このスクリプトが付けた id のみ管理。
 *      再実行時は一度すべて剥がして付け直すため冪等）
 *   2. 最初の目次対象 h2 の直前に <nav class="sp-toc"> を挿入する
 *      （BEGIN/END マーカーで囲み、再実行時は自前生成分のみ差し替える）
 *
 * 目次に載せない h2:
 *   - class に lp-heading を含む（ヒーロー「◯◯と暮らすと〜」。本文より前にあり導入部のため）
 *   - 見出し文言が EXCLUDE_HEADINGS（関連ページ・フッター等の回遊ブロック）
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// gen_related_links.py と同一の除外集合（テンプレ・noindex）
const EXCLUDE_FILES = new Set([
  '_template-monetized.html',
  'pink-bellied-template.html',
  'three-toed-box-template.html',
  'hermann-dry-template.html',
  'hime-nioi-turtle.html',
  'ornate-cuora.html',
  'ouachita-map-turtle.html',
]);

const EXCLUDE_HEADINGS = new Set([
  '関連ページ',
  'ほかの飼育ガイド',
  'Kame Life Guide',
]);

const BEGIN = '<!-- BEGIN:species-toc (tools/gen-species-toc.js が生成。手で編集しない) -->';
const END = '<!-- END:species-toc -->';
const BLOCK = new RegExp(
  BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' +
  END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\n?', 'g');

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function headingText(inner) {
  // タグを除去し、実体参照は表示用にそのまま残す（&amp; は h2 内の表記どおり）
  return inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function build(src) {
  // 1. 自前生成分を剥がす（目次ブロックと sec-N id）
  let html = src.replace(BLOCK, '');
  html = html.replace(/(<h2)([^>]*?) id="sec-\d+"([^>]*>)/g, '$1$2$3');

  // 2. 目次対象の h2 を収集し id を付け直す
  const entries = [];
  let n = 0;
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    const text = headingText(inner);
    if (/\blp-heading\b/.test(attrs) || EXCLUDE_HEADINGS.has(text)) return m;
    n += 1;
    const id = 'sec-' + n;
    entries.push({ id, text });
    return '<h2' + attrs + ' id="' + id + '">' + inner + '</h2>';
  });

  if (entries.length === 0) return { html, count: 0 };

  // 3. 最初の目次対象 h2 の直前に目次を挿入
  const lines = entries.map(e =>
    '    <li><a href="#' + e.id + '">' + e.text + '</a></li>').join('\n');
  const block =
    BEGIN + '\n' +
    '<nav class="sp-toc" aria-label="このページの目次">\n' +
    '  <div class="sp-toc-title">このページの目次</div>\n' +
    '  <ul>\n' + lines + '\n  </ul>\n' +
    '</nav>\n' +
    END + '\n';
  const firstH2 = html.indexOf('<h2' + html.match(/<h2([^>]*) id="sec-1"/)[1] + ' id="sec-1"');
  // 行頭から挿入する（直前の改行位置）
  const k = html.lastIndexOf('\n', firstH2);
  html = html.slice(0, k + 1) + block + html.slice(k + 1);
  return { html, count: entries.length };
}

function main() {
  const check = process.argv.indexOf('--check') >= 0;
  const files = fs.readdirSync(path.join(ROOT, 'species'))
    .filter(f => f.endsWith('.html') && !EXCLUDE_FILES.has(f)).sort();
  let changed = 0, totalEntries = 0;
  for (const f of files) {
    const fp = path.join(ROOT, 'species', f);
    const src = fs.readFileSync(fp, 'utf8');
    const { html, count } = build(src);
    totalEntries += count;
    if (html !== src) {
      changed += 1;
      if (!check) fs.writeFileSync(fp, html);
    }
  }
  console.log('対象 species ページ: ' + files.length);
  console.log('目次項目総数: ' + totalEntries);
  console.log(check ? ('差分のあるファイル: ' + changed) : ('書き込み: ' + changed + ' ファイル'));
  return 0;
}

process.exit(main());
