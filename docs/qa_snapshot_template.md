# qa_snapshot_template.md
# カメライフガイド — QA Snapshot 提出テンプレ
# バージョン: 1.0 | 策定日: 2026-06-24
# 使い方: このファイルをコピーして種名を埋めて提出する

---

# qa_snapshot_{slug}.md
# 対象: species/{slug}.html + shindan/species.js
# QA実施日: {YYYY-MM-DD}

---

## 1. Changed Files

| ファイル | 変更種別 | 行数 |
|---|---|---|
| `species/{slug}.html` | 新規作成 | {N}行 |
| `shindan/species.js` | 既存修正（{種名} entry 1箇所） | 変更なし |

---

## 2. species.js Diff

**対象エントリ: {種名}（{ルート}セクション L{行番号}〜L{行番号}）**

```diff
Before:
-   slug: null, hasPage: false,

After:
+   slug: '{slug}', hasPage: true,
```

診断ツールで{種名}が結果に出た際、「Species Guide」CTAが  
`../species/{slug}.html` へリンクされることを確認済み。

---

## 3. Critical HTML Blocks

### title
```
{実際のtitleタグの内容}
```

### meta description
```
{実際のmeta descriptionの内容}
```

### hero section（抜粋）
```html
<!-- heroのh1・latin・leadのみ抜粋 -->
<h1>{種名}</h1>
<div class="latin">{学名} — {英語名}</div>
<p class="lead">{leadテキスト（先頭80字）}</p>
<!-- hero背景色: {#カラーコード} → {#カラーコード} -->
```

### stats bar
```
甲長: {値}  /  難易度: {値}  /  寿命: {値}  /  食性: {値}
```

### warning box
```
<!-- warn-box -->
⚠️ {タイトル}
{内容サマリー（1〜2文）}

<!-- info-box（存在する場合のみ） -->
✅ {タイトル}
{内容サマリー（1〜2文）}
```

### affiliate section

| # | 機材名 | ASIN | tag=kamelife09-22 | rel=sponsored |
|---|---|---|---|---|
| 1 | {機材名} | {ASIN} | ✅ or ❌ | ✅ or ❌ |
| 2 | {機材名} | {ASIN} | ✅ or ❌ | ✅ or ❌ |
| 3 | {機材名} | {ASIN} | ✅ or ❌ | ✅ or ❌ |
| 4 | {機材名} | {ASIN} | ✅ or ❌ | ✅ or ❌ |
| 5 | {機材名} | {ASIN} | ✅ or ❌ | ✅ or ❌ |

全{N}件に `pr-note（※アフィリエイトリンクを含みます）` 表示: ✅ or ❌

---

## 4. Validation

| 項目 | 結果 | 詳細・補足 |
|---|---|---|
| Page loads | YES / NO | HTTPステータス{200/404}。GitHub Pages公開{確認済み/未確認} |
| CTA works | YES / NO | species.jsで slug/hasPage 設定済み。診断→CTAリンク{正常/要確認} |
| Mobile overflow | YES（問題なし）/ NO（問題あり） | compare-table overflow-x:auto {あり/なし}。media query {あり/なし} |
| Console errors | 要実機確認 / NO | HTML構文エラー{なし/あり：詳細}。JS実行はブラウザ側要確認 |
| Broken links | NO（全件200）/ YES（問題あり） | 同階層{N}リンク全{N}件200確認。内部リンク{N}種全実在確認済み |
| 404 errors | NO / YES | ページ本体ステータス{200/404} |

**Broken linksが YES の場合は必ず詳細を記載:**
```
404: {URL}  → 修正: {修正後URL} または 削除
```

---

## 5. Self Score

| 指標 | スコア | 根拠（-点の理由を明記） |
|---|---|---|
| Function | {N}/10 | {根拠。-点の理由を具体的に} |
| UX | {N}/10 | {根拠。-点の理由を具体的に} |
| SEO | {N}/10 | {根拠。-点の理由を具体的に} |
| Monetization | {N}/10 | {根拠。-点の理由を具体的に} |
| Accuracy | {N}/10 | {根拠。-点の理由を具体的に} |

**スコアルール:**
- 10/10 は完璧（実質ありえない）
- 9/10 は軽微な既知課題のみ（OGP未設定 = -1 が標準）
- 8/10 以下は必ず具体的な改善アクションを記載
- 7/10 以下は次回push前に修正を検討

---

## 6. Template Deviation（テンプレからの逸脱）

species-template.md の標準構成から変更した箇所を全て記載する。

| 変更箇所 | 標準 | 今回の実装 | 理由 |
|---|---|---|---|
| {変更箇所} | {標準の内容} | {今回の内容} | {なぜ変えたか} |

**逸脱がない場合:**
```
なし（全項目 species-template.md v1.0 に準拠）
```

---

## 7. Next Action（任意）

このページを起点とした次のアクション候補:

- [ ] OGP（og:title等）をサイト全体で追加するかどうか議論
- [ ] {近縁種名} のspeciesページ作成（hasPage:false確認済み）
- [ ] {機材名} のASINをequipment.jsに追加
- [ ] その他: {自由記述}

---

**Public URL:**  
`https://gagalife04291225-lab.github.io/kame-life-guide-/species/{slug}.html`

**QA RESULT: PASS / NEEDS FIX**

> NEEDS FIX の場合は修正箇所と修正方法を必ず記載すること。
