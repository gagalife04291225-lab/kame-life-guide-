# species-template.md
# カメライフガイド — speciesページ量産テンプレ
# バージョン: 1.0 | 策定日: 2026-06-24
# 参照ページ: yellow-bellied-slider.html / mississippi-mud-turtle.html

---

## 概要

このテンプレはカメライフガイドのhasPage:false種を正式なspeciesページに昇格させるための設計仕様書。
HTMLフルコードではなく「何を入れるか・どの順で入れるか」の仕様として管理する。

---

## 1. ファイル命名規則

```
species/{slug}.html
```

- slugはspecies.jsの `slug:` フィールドと完全一致させる
- 英語・小文字・ハイフン区切り
- 例: `mississippi-mud-turtle.html` `yellow-bellied-slider.html`

---

## 2. head セクション

### 必須要素

```html
<title>{種名}の飼い方｜{2〜3個のキーワード}｜カメライフガイド</title>
<meta name="description" content="{種名}（{学名}）の飼育ガイド。{50〜80字で飼育の核心}。">
<link rel="canonical" href="https://gagalife04291225-lab.github.io/kame-life-guide-/species/{slug}.html">
```

### 固定（変更禁止）

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google Fonts（Playfair Display + Noto Serif JP） -->
<!-- GA4: G-QQTE5CVF3K -->
```

### CSS変数（固定）

```css
:root{
  --forest-deep:#0d1f1a;
  --forest:#2f4a3c;
  --parchment:#f4efe2;
  --accent:#d4a96a;
  --accent-dark:#8f5f2c;
  --sp-from: [種ごとに変える];  /* heroグラデ始点 */
  --sp-to:   [種ごとに変える];  /* heroグラデ終点 */
  --sp-accent:#7ebf8e;          /* 固定 */
}
```

#### hero グラデーション カラーガイド

| 種カテゴリ | `--sp-from` | ハードコード値（hero background） |
|---|---|---|
| 水棲（池・川） | `#0c1a10` | `#0c1a10 → #142a1a → #081208` |
| 水棲（海・汽水） | `#0c1a2a` | `#0c1a2a → #183040 → #081420` |
| リクガメ（乾燥） | `#1a140a` | `#1a140a → #2a1e0a → #100e04` |
| リクガメ（多湿） | `#0a1a10` | `#0a1a10 → #1a2e18 → #081208` |
| ヤマガメ・ハコガメ | `#0c1a10` | `#0c1a10 → #142a1a → #081208` |
| スッポン | `#0c1414` | `#0c1414 → #142828 → #081010` |
| 曲頸類 | `#0c1a10` | `#0c1a10 → #142a1a → #081208` |

---

## 3. hero セクション

```html
<header class="hero">
  <div class="wrap">
    <div class="eyebrow">Species Guide</div>   <!-- 固定 -->
    <span class="sp-emoji">{絵文字}</span>      <!-- species.jsのemojiと一致させる -->
    <h1>{日本語種名}</h1>
    <div class="latin">{学名（属種） — {英語名}</div>
    <p class="lead">{100〜140字で：分布・特徴・飼育の核心・注意点を凝縮}</p>
  </div>
</header>
```

**lead文の構成ルール:** 「[分布]に生息する[特徴]。[魅力]。ただし[最重要注意点]を飼育前に必ず確認すること。」

---

## 4. stats-bar

4項目固定。値は種ごとに変える。

```
甲長  | 難易度          | 寿命      | 食性
{数値} | 入門/中級/上級  | {XX〜YY年} | 草食/雑食/肉食
```

難易度の表現:
- `入門` — 初心者に推奨可
- `入門〜中級` — 初心者でも可だが注意あり
- `中〜上級` — 経験者向け
- `上級` — 難種

---

## 5. クイックスペックカード（stats-barの直下）

4項目 × 2列のグリッド。最後の行は「初心者向き？」のサマリーを全幅で。

```
🌡️ 水温/温度 | 📐 必要水槽/ケージ
🍽️ 給餌     | ⏳ 推定寿命
✅ or ❌ 初心者向き？ → {難易度} + {一言理由}
```

---

## 6. 3秒判定（quick-judge）

✅ 向いている条件を3つ、❌ 向いていない条件を3つ。
2列グリッド表示。

**書き方ルール:**
- ✅ は「〜できる人」「〜したい人」の形
- ❌ は「〜したい（だができない）」の形
- 飼育スペース・性格の好み・温度管理コスト・長期覚悟 を含めること

---

## 7. パンくずナビ

```html
<nav class="crumbs">
  カメライフガイド ＞ 種一覧 ＞ {種名}
</nav>
```

---

## 8. warn-box / info-box

最低1つは設置。優先度順：

| box種別 | 使う条件 | 内容 |
|---|---|---|
| `warn-box`（オレンジ） | 必ず入れる | 最大リスク1点（大型化・脱走・毒性・規制等） |
| `info-box`（緑） | 法的確認が必要な種 | 「合法」または「規制あり」を明記 |
| 複数warn | CITES II + 大型化 など | 2つまで許容 |

**warn-boxで書くべき内容の優先度:**
1. 大型化・最終水槽サイズ（スライダー系・大型種）
2. 脱走リスク（ドロガメ・ハコガメ）
3. 条件付特定外来（アカミミ等）
4. CITES II CB証明書確認（CITES II種）
5. 危険性（噛みつき・毒・攻撃性）

---

## 9. 本文（article）

### 必須セクション（h2）とその内容

| h2 | 内容 | 文字数目安 |
|---|---|---|
| Wild Life — [野生環境タイトル] | 分布・生息環境・野生の食性・習性 | 150〜250字 |
| 飼育環境 — [管理の核心] | 水槽/ケージ・温度・水深・床材・注意点 | 200〜350字 |
| （種類に応じたh2） | 冬眠/換気/水質/保冷など種固有テーマ | 100〜200字 |
| [近縁種]との比較 | 比較表 | 表で完結 |
| 食事 — [食性の特徴] | 給餌方法・頻度・フード選び | 100〜200字 |
| 推奨機材セット | gear-cards 5件 | カードで完結 |
| よくあるトラブルQ&A | FAQ 6問 | FAQで完結 |
| 関連ページ | rel-btn群 | ボタンで完結 |

### inline-cta（本文の途中に1箇所）

Wild Lifeセクション直後に設置：

```html
<div class="inline-cta">
  <div class="inline-cta-emoji">🐢</div>
  <div class="inline-cta-body">
    <p>{種名}以外も比較したい？ 約80種対応の診断ツールで確かめられます。</p>
    <a href="../shindan/index.html">無料で診断する（3分）</a>
  </div>
</div>
```

---

## 10. env-grid（環境数値）

4枚カード、2列グリッド。

```
カード1: 水温/温度
カード2: バスキング温度 または 湿度
カード3: 水深/水槽サイズ または ケージサイズ
カード4: UVB
```

各カード:
- `env-label`: カテゴリ名
- `env-value`: 数値（大きく表示）
- `env-sub`: 補足（注意点）

---

## 11. 比較表（compare-table）

近縁種2〜3種を並べる。

```html
<div class="compare-wrap">  <!-- overflow-x:auto 必須 -->
  <table class="compare-table">
    <thead><tr>
      <th>種名</th><th>甲長</th><th>難易度</th>
      <th>[種に応じた4列目]</th><th>[5列目]</th><th>特徴</th>
    </tr></thead>
    <tbody>
      <tr class="recommended"> <!-- このページの種 -->
      <tr> <!-- 比較種 × 2〜3 -->
    </tbody>
  </table>
</div>
```

比較軸の選び方:
- 水棲 → 水槽サイズ / 性格 / 法的ステータス
- リクガメ → ケージサイズ / 管理難度 / 産地
- ヤマガメ → 保冷要否 / 半水棲or陸棲 / 入手難度

**比較種の内部リンクは実在するspeciesページのみ使用（404チェック必須）**

---

## 12. gear-cards（機材5件）

### ルート別推奨ASIN早見表（equipment.jsより確認済み）

| # | カテゴリ | land_dry | land_humid | land_large | aquatic_small | aquatic_medium/large | forest系 | softshell | brackish | snakeneck |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | UVB | B00JZFJ5R0 | B00JZFJ5LQ | B00JZFJ5R0 | B00JZFJ5LQ | B00JZFJ5LQ | B00JZFJ5LQ | B00JZFJ5LQ | B00JZFJ5LQ | B00JZFJ5LQ |
| 2 | バスキング | B0043B0AU2(50W) | B0043B0AU2(50W) | B0043AYZL8(100W) | B0043B2AJQ(30W) | B0043B0AU2(50W) | B0043B2AJQ(30W) | B0043B0AU2(50W) | B0043B0AU2(50W) | B0043B0AU2(50W) |
| 3 | 床材/底床 | B00I0MM9MC(赤玉) | B005J94WEM(ヤシガラ) | B00I0MM9MC(赤玉) | B00XVP3TPO(大磯) | B00XVP3TPO(大磯) | B005J94WEM(ヤシガラ) | B004WH8YBO(川砂) | null(相談推奨) | B00XVP3TPO(大磯) |
| 4 | フード | B0DF2SJMCJ(リクガメ) | B0DF2SJMCJ(リクガメ) | B0DF2SJMCJ(リクガメ) | B00E0GMQAM(カメプロス) | B00E0GMQAM(カメプロス) | B00E0GMQAM(カメプロス) | B00E0GMQAM(カメプロス) | B00E0GMQAM(カメプロス) | B00E0GMQAM(カメプロス) |
| 5 | フィルター | null | null | null | B0012UO6Q6 | B0012UO6Q6 | null | B0012UO6Q6 | B0012UO6Q6 | B0012UO6Q6 |

> ケージ(cage)のASINは全てnull（未登録）。検索リンクで代替するか省略。

### gear-card 1件の必須構成

```html
<div class="gear-card">
  <div class="gear-icon">{絵文字}</div>
  <div class="gear-info">
    <div class="gear-name">{商品カテゴリ名と補足}</div>
    <div class="gear-why">{なぜこの種にこの機材が必要か・80字以内}</div>
    <div class="gear-btns">
      <a class="btn-amz" href="https://www.amazon.co.jp/dp/{ASIN}?tag=kamelife09-22"
         target="_blank" rel="nofollow sponsored noopener">Amazonで見る</a>
      <a class="btn-rak" href="https://search.rakuten.co.jp/search/mall/{検索ワード}/"
         target="_blank" rel="nofollow noopener">楽天で探す</a>
    </div>
    <p class="pr-note">※ アフィリエイトリンクを含みます</p>
  </div>
</div>
```

**チェック必須:**
- `tag=kamelife09-22` が全Amazon URLに付いているか
- `rel="nofollow sponsored noopener"` が全Amazon aタグに付いているか
- `pr-note` が全gear-cardに付いているか

---

## 13. FAQ（6問）

### 問の構成ルール

| 位置 | テーマ | 必須か |
|---|---|---|
| Q1 | **種の個性・行動の疑問**（「隠れる」「臭い」「なつく？」等） | 必須 |
| Q2 | **近縁種との違い**（比較FAQ） | 必須 |
| Q3 | **餌・食欲** | 必須 |
| Q4 | **健康・甲羅** | 必須 |
| Q5 | **種固有の注意点**（大型化・脱走・冬眠・法規制等） | 必須 |
| Q6 | **入手・手放し方** | 必須 |

### FAQ HTML構造

```html
<details class="faq">
  <summary>
    {質問文}
    <span class="faq-tag {tag-class}">{タグラベル}</span>
  </summary>
  <div class="faq-body">
    {回答文（2〜5文、読みやすい体言止めOK）}
  </div>
</details>
```

faq-tagクラス: `tag-env`（環境）/ `tag-health`（健康）/ `tag-food`（餌）/ `tag-law`（法律）/ タグなし（比較・その他）

---

## 14. CTA群（下部）

### 関連リンク（rel-btn）

必ず含めること:
- ハビタットガイド（`guide-semi.html` / `guide-water-full.html` / `guide-dry.html` / `guide-moist.html` いずれか）
- 近縁species 1〜3種（実在するページのみ）
- 機材best10系（`water-filter-best10.html` / `food-best10.html` / `uvb-light-best10.html`）

### shindan-cta

```html
<div class="shindan-cta">
  <p>{種に合わせた一言診断誘導文}</p>
  <a href="../shindan/index.html">🐢 カメ適性診断をはじめる（約80種対応）</a>
</div>
```

### end-cta

```html
<div class="end-cta">
  <div class="end-cta-label">Next Step</div>
  <h3>{イタリック体で締めの一言}</h3>
  <p>{種名}は{寿命}生きます。{一言の覚悟喚起}</p>
  <div class="end-cta-btns">
    <a class="btn-cta-primary" href="../shindan/index.html">まずは自分に合う亀を診断する</a>
    <a class="btn-cta-secondary" href="../{ハビタットガイド}.html">🏔️ {ガイド名}を読む</a>
    <a class="btn-cta-secondary" href="../{機材ページ}.html">🔬 {機材名}を選ぶ</a>
  </div>
```

### species-nav（end-cta内に含める）

4リンク固定構成:

```
① AI亀診断（shindan/index.html）
② 初心者向けの亀を見る（guide-beginner.html）
③ [このページの種カテゴリ]ガイド（guide-semi/water-full/dry/moist等）
④ 他のspecies記事を見る（species-list.html）
```

---

## 15. closing / footer（固定・変更禁止）

```html
<section class="closing">
  <h2>Kame Life Guide</h2>
  <p>野生環境から逆算した飼育情報を、すべて無料で。</p>
  <div class="hub-links">
    <a href="../index.html">トップ</a>
    <a href="../species-list.html">種一覧</a>
    <a href="../guide-{カテゴリ}.html">{カテゴリ}ガイド</a>
    <!-- 2〜3個の機材ページ -->
  </div>
</section>

<footer>
  カメライフガイド｜運営：TeTe（実飼育者）｜note｜プライバシーポリシー
  ※ アソシエイト免責文
</footer>
```

---

## 16. species.js の更新（ページ作成後に必須）

対象エントリを特定し以下2フィールドを変更:

```diff
- slug: null, hasPage: false,
+ slug: '{slug名}', hasPage: true,
```

**他のフィールドは変更しない。** match/score関数には触れない。

---

## 17. ページ量産時の作業順序

```
1. species.jsで対象種のエントリを確認（学名・難易度・size・legal）
2. checklist.md の作成前チェックを実施
3. 近縁種の実在speciesページを確認
4. ルート判定 → ASIN早見表から機材セットを選択
5. hero色を種カテゴリで決定
6. HTMLを600〜700行で作成
7. checklist.md の作成後チェックを実施
8. species.js の slug/hasPage を更新
9. 両ファイルをpush（PAT使用・使用後即削除）
10. qa_snapshot.md を作成・提出
```
