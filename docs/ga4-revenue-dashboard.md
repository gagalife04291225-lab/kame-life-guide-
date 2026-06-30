# GA4 Revenue Dashboard — 仕様書（Phase 28-B）

GA4 property: `G-QQTE5CVF3K`
対象: カメライフガイド全体（診断ツール / species pages / compare / guides）
本書はドキュメントのみ。コード・GA4イベント名・アフィリエイトリンク・products.js は一切変更しない。

---

## 0. 監査結果サマリー（最重要）

ダッシュボードを設計する前に、現行コードベース（`shindan/index.html`, `js/starter-kit.js`,
`js/affiliate-cta.js`, `js/analytics-funnel.js`, `js/comparison-cta.js`）を実コードレベルで監査した。
依頼書に記載された「期待イベント名」と、実装上の実イベント名には差異がある。
そのままLooker Studio等で集計すると誤計測になるため、§8を必ず参照すること。

主要な不整合（先に共有）:

- `diagnosis_starterkit_click` というイベント名は**実装に存在しない**。実際は `diagnosis_result_starterkit_click`。
- `equipment_click` は**実装に存在しない**。Page 5（カテゴリ別ランキング）に必要なカテゴリ情報は、代わりに `starter_kit_click` の `category` パラメータから取得可能。
- `affiliate_click` は2系統の異なるパラメータ構造で発火している（診断結果ページ版 vs species page版）。`source`/`provider`、`location`/`source_page` のキー名が違う。
- `amazon_outbound_click` と `affiliate_click`(provider=amazon) は同一クリックで**二重発火**する箇所がある。
- レガシーイベント `affiliate_cta_click`（`js/affiliate-cta.js`）が残存。`affiliate_platform:'amazon'`固定で、対象要素 `a.btn-amz` はPhase 17-18のgear-cards撤去で大半が死んでいる可能性が高い（未検証）。
- Page 3 の「Step 5 species_click」に厳密対応する実イベントは `diagnosis_species_click`。

---

## 1. ダッシュボード構成

| Page | 目的 |
|---|---|
| 1. Executive Summary | 全体KPIを1画面で把握 |
| 2. Species Revenue Ranking | speciesページ別の収益貢献度 |
| 3. Diagnosis Funnel | 診断→購入導線のどこで離脱しているか |
| 4. Affiliate Source Split | Amazon vs Rakuten、導線別の勝敗 |
| 5. Product Category Ranking | 機材カテゴリ別のマネタイズ力 |
| 6. Action Board | 機械的優先度判定→次の一手 |

推奨ツール: GA4標準探索（Explore、特にファネル探索）+ Looker Studio（GA4コネクタ）。
カスタムイベントの構造差異はLooker Studio側の計算フィールドで正規化する（§8-A）。

---

## 2. Page 1 — Executive Summary

| スコアカード | GA4ソース | 状態 |
|---|---|---|
| Total Views | 標準 `page_view`（自動収集） | ✅ |
| Unique Users | 標準 `user_pseudo_id` ディメンション | ✅ |
| Diagnosis Starts | `shindan_start` | ✅ |
| Diagnosis Result Views | `diagnosis_result_view` | ✅ |
| Species Page Visits | `species_page_view`（`js/analytics-funnel.js`） | ✅（speciesページのみ、初回1回限定発火） |
| Starter Kit Shown | `starter_kit_shown`（shindan/species両方で同名発火） | ✅ |
| Starter Kit Clicks | `starter_kit_click` | ✅ |
| Affiliate Clicks | `affiliate_click`（要正規化、§8-A） | ⚠️ 構造差異あり |
| Affiliate CTR | 下記計算式 | — |
| Amazon Click % | `affiliate_click`正規化後 `provider/source='amazon'`の比率 | ⚠️ 正規化必須 |
| Rakuten Click % | 同上 `rakuten`比率 | ⚠️ 正規化必須 |

**派生指標:**

```
Affiliate CTR = affiliate_click ÷ starter_kit_shown
Diagnosis Completion Rate = diagnosis_result_view ÷ shindan_start
```

Diagnosis Completion Rate はユーザー単位（user_pseudo_id distinct）で計算することを推奨。
イベント単位だと再診断（やり直し）を含み実態より高く出る。

---

## 3. Page 2 — Species Revenue Ranking

| カラム | ソース |
|---|---|
| page path | 標準 `page_location`/`page_path` |
| species name | `species_page_view.species`（pathから正規表現抽出済み） |
| page views | 標準 `page_view` |
| avg engagement time | 標準 GA4 エンゲージメント時間ディメンション |
| starter kit shown | `starter_kit_shown` |
| starter kit clicks | `starter_kit_click` |
| affiliate clicks | `affiliate_click`（正規化後合算） |
| amazon clicks | `affiliate_click` 正規化 `provider/source='amazon'` |
| rakuten clicks | `affiliate_click` 正規化 `provider/source='rakuten'` |
| affiliate CTR | `affiliate_click ÷ starter_kit_shown`（ページ単位） |
| revenue proxy score | §5参照 |

降順ソートし、Top 10（強化対象）とBottom 20（要改善・統合候補）をハイライト表示する。

---

## 4. Page 3 — Diagnosis Funnel

| Step | 名称 | 実イベント | 状態 |
|---|---|---|---|
| 1 | Homepage visit | 標準 `page_view`（`page_path='/'` または `landing_page_view`） | ✅ |
| 2 | shindan_start | `shindan_start` | ✅ |
| 3 | diagnosis_result_view | `diagnosis_result_view` | ✅ |
| 4 | diagnosis_starterkit_click | **実名は `diagnosis_result_starterkit_click`** | ⚠️ 名称修正して使用 |
| 5 | species_click | **実名は `diagnosis_species_click`**（診断結果→speciesページ直接遷移CTA） | ⚠️ 名称修正して使用 |
| 6 | starter_kit_cta_click | `starter_kit_cta_click`（shindan/species両方で発火、パラメータ構造が異なる） | ⚠️ 構造差異あり |
| 7 | affiliate_click | `affiliate_click`（要正規化） | ⚠️ 構造差異あり |

ステップ4と5は目的が異なる点に注意: 4はStarter Kitアンカーへのリンク、5はspeciesページそのものへの直接リンク。
合算せず両方を可視化し、どちらの導線がより使われているか比較できるようにする。

**ドロップオフ計算:**

```
conversion% (Step N) = Step N ユーザー数 ÷ Step 1 ユーザー数
drop-off% (Step N→N+1) = 1 - (Step N+1 ユーザー数 ÷ Step N ユーザー数)
```

GA4探索のファネル機能（オープンファネル、ユーザー単位）を使用。

**フラグ:** `drop-off% > 40%` のステップを **P0 leak** として自動ハイライトする。

---

## 5. Page 4 — Affiliate Source Split

軸: 正規化済み `provider`（amazon / rakuten）× 正規化済み `location`

| location値 | 取得元 | 備考 |
|---|---|---|
| `diagnosis_result` | shindan版 `affiliate_click.location` | Phase 28-Aで新規追加分のみ計測可能 |
| `species_page` / `starter_kit` | species版 `affiliate_click.source_page`（page_path） | 厳密には固定値ではなくpage_path文字列。Looker側で `species/`を含むpathへのマッピングルールが必要 |
| `guide_page` | **データなし** | guides配下にaffiliate_click相当の発火が存在しない |
| `compare_page` | **データなし** | `comparison_cta_click`は存在するが`affiliate_click`とは別イベント・別スキーマで、直接合算不可 |

**回答できる問い:** 「全体でAmazon/Rakutenどちらが勝っているか」「diagnosis_result/species_pageのlocation別でどちらが強いか」。
**回答できない問い（現状）:** guide_page/compare_page別のソース内訳（実装が必要、§10参照）。

---

## 6. Page 5 — Product Category Ranking

| カテゴリ | 取得元 |
|---|---|
| enclosure / uvb / basking / heater / substrate / shelter / filter / supplements | `starter_kit_click.category`（`a.dataset.cat`、`data/products.js`の`category`フィールドと一致） |

`equipment_click`は存在しないため、カテゴリ別クリック数は `starter_kit_click` の `category` パラメータで代替する。
カテゴリ別の `affiliate_click` 直接ひも付けは存在しないため、`starter_kit_click`(category別) を proxy として使い、
直後の `affiliate_click`(同一セッション・同一species) との時系列突合でカテゴリ別CTRを推定する運用を推奨。

```
revenue proxy（カテゴリ別）= starter_kit_click(category) × 2 + 推定affiliate_click(category) × 5
```

完全な精度を出すには、`starter_kit_click`イベントに既存の`category`パラメータをそのまま`affiliate_click`にも
含める実装変更が必要（§10のNext Phase候補）。

---

## 7. Page 6 — Action Board（しきい値ルール）

| ルール | 条件 | アクション |
|---|---|---|
| P0 | トラフィック上位 ＋ `affiliate_click ÷ starter_kit_shown` < 5% | 即時導線再設計 |
| P1 | `starter_kit_click ÷ starter_kit_shown` < 10% | CTA文言・配置の改善 |
| P2 | `page_view`上位 ＋ `affiliate_click = 0` | プレミアムStarter Kit追加を検討 |
| Opportunity | `affiliate_click ÷ starter_kit_shown` > 15% | 類似species/カテゴリへ横展開 |

しきい値（5% / 10% / 15%、「上位」の閾値）は初期値。3〜4週間分のデータが溜まった時点で
分布の中央値・四分位ベースに再調整することを推奨する。

---

## 8. GA4イベントマッピング監査

| 依頼書の期待名 | 実装に存在するか | 実イベント名 / 場所 | 主要パラメータ | 備考 |
|---|---|---|---|---|
| `shindan_start` | ✅ あり | `shindan_start`（shindan/index.html） | `route_id`, `route_name` | そのまま使用可 |
| `diagnosis_result_view` | ✅ あり | `diagnosis_result_view` | `species`, `slug` | そのまま使用可 |
| `diagnosis_starterkit_click` | ⚠️ 名称不一致 | **`diagnosis_result_starterkit_click`** | `species`, `slug`, `cta_type`, `equipment_key` | 実名で集計すること |
| `starter_kit_shown` | ✅ あり（2箇所同名） | shindan/index.html `renderStarterKit()` と `js/starter-kit.js`（species page） | `species_name`/`species`, `equipment_key`, `card_count`, `route`, `source_page` | `source_page='shindan'`で診断結果由来を判別可。species側の`source_page`有無は未確認 |
| `starter_kit_click` | ✅ あり（2箇所、パラメータ差異） | shindan版（簡易）/ species版（`js/starter-kit.js`、詳細: `affiliate_platform`, `tab_type`等含む） | 両者で`category`は共通キー名 | カテゴリ集計はspecies版が情報量多い |
| `starter_kit_cta_click` | ✅ あり（2箇所、パラメータ差異） | shindan版: `cta_source`（Rakuten分のみ付与）/ species版: `affiliate_platform` | 役割は同じだが別キー名 | 正規化必要 |
| `equipment_click` | ❌ 存在しない | — | — | Page 5のカテゴリ計測は`starter_kit_click.category`で代替（§6参照） |
| `affiliate_click` | ✅ あり（2系統、**構造が違う**） | (A) shindan/index.html: `source`, `location`, `species_slug`, `equipment_key`, `click_url`, `route`<br>(B) `js/starter-kit.js`: `provider`, `mode`, `product_id`, `tier`, `source_page`, `category`, `equipment_key` | — | Looker側で下記の正規化計算フィールドが必須 |
| `amazon_outbound_click` | ✅ あり（複数箇所） | shindan/index.html（3箇所）, `js/starter-kit.js` | `source`, `species`, `species_slug`, `equipment_key`, `click_url`, `asin` | Amazon限定。`affiliate_click`(amazon)と**重複発火**、二重カウント注意 |
| （未依頼・追加発見）`diagnosis_species_click` | ✅ あり | shindan/index.html（種ページ直接遷移CTA） | `species`, `slug`, `cta_type`, `candidate_count` | Page 3 Step 5の実体 |
| （未依頼・追加発見）`affiliate_cta_click` | ⚠️ レガシー | `js/affiliate-cta.js`（`a.btn-amz`要素対象） | `affiliate_platform:'amazon'`固定, `placement`, `page_path` | gear-cards撤去後、対象要素がほぼ存在しない可能性。死活未検証 |
| （未依頼・追加発見）`species_page_view` | ✅ あり | `js/analytics-funnel.js` | `species`（pathから正規表現抽出） | Page 2「species name」の正規ソース |
| （未依頼・追加発見）`comparison_cta_click` | ✅ あり | `js/comparison-cta.js` | 未監査詳細 | compare系ページの導線。Page 4の`compare_page`実装時に再監査要 |

### 8-A. 正規化計算フィールド（Looker Studio推奨実装）

```
normalized_provider =
  CASE
    WHEN event_name = 'affiliate_click' AND provider IS NOT NULL THEN provider
    WHEN event_name = 'affiliate_click' AND source IS NOT NULL THEN source
    WHEN event_name = 'amazon_outbound_click' THEN 'amazon'
    ELSE 'unknown'
  END

normalized_location =
  CASE
    WHEN location IS NOT NULL THEN location              -- shindan版
    WHEN source_page = 'shindan' THEN 'diagnosis_result'
    WHEN source_page IS NOT NULL THEN source_page         -- species版 page_path
    ELSE 'unknown'
  END
```

**二重カウント回避ルール:** `affiliate_click`と`amazon_outbound_click`は同一クリックで両方発火するケースがある
（shindan/index.htmlの3箇所すべて）。確定指標（Affiliate CTR等）には**`affiliate_click`のみ**を正とし、
`amazon_outbound_click`はAmazon限定の詳細内訳（ASIN別など）を見たい時の補助イベントとして扱う。

### 8-B. 監査結果サマリー（依頼の3観点）

1. **Missing events:** `equipment_click`（未実装）。`diagnosis_starterkit_click`という名前のイベントも存在しない（類似イベントはあるが別名）。
2. **Duplicate semantics:** `affiliate_click` と `amazon_outbound_click`（Amazon分は意味的に重複）。`starter_kit_click` と `starter_kit_cta_click`（個別カード vs まとめてCTA、意味は別だが両方「クリック」として混同されやすい）。
3. **Naming inconsistencies:** `source`/`provider`、`location`/`source_page`、`cta_source`/`affiliate_platform` — 同じ概念に異なるキー名が使われている（§8-A参照）。

本フェーズではイベント名・パラメータ名の変更は一切行っていない。

---

## 9. 週次レビューテンプレート

```
## 週次レビュー — YYYY-MM-DD週

### 1. Traffic trend
- Total views: ___（先週比 __%）
- Unique users: ___（先週比 __%）

### 2. Funnel leak
- 最大ドロップオフ箇所: Step ___ → Step ___（__%）
- P0判定（>40%）: あり / なし

### 3. Top revenue species
- 1位〜5位（revenue proxy score順）: ___

### 4. Dead pages
- page_view上位 かつ affiliate_click=0 のページ: ___

### 5. Best affiliate source
- 全体: Amazon __% / Rakuten __%
- location別の勝敗: ___

### 6. Recommended next sprint
- P0対応: ___
- P1対応: ___
- Opportunity横展開: ___
```

---

## 10. 次フェーズ推奨（コード変更が必要・本フェーズでは未実施）

優先度順:

1. `affiliate_click`のパラメータ統一（`source`/`provider`、`location`/`source_page`を1系統に）。
2. `amazon_outbound_click`と`affiliate_click`の重複発火整理（どちらを正とするか確定）。
3. `guide_page`/`compare_page`へのaffiliate_click相当イベント実装（Page 4の欠損データ解消）。
4. `starter_kit_click`の`category`パラメータを`affiliate_click`側にも引き継ぐ実装（Page 5の精度向上）。
5. レガシー`affiliate_cta_click`（`a.btn-amz`対象）の生死確認、不要なら撤去検討。

これらはすべて別フェーズでの承認後に着手する。本ドキュメントはダッシュボード仕様のみ。
