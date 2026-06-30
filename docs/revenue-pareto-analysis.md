# Revenue Pareto Analysis — Species Pages Runbook（Phase 28-D1）

対象: カメライフガイド species/ 配下98ページ（`hasPage:true`の全種）
GA4 property: `G-QQTE5CVF3K`

**本書は実行手順書（runbook）であり、完了済み分析ではない。** 実GA4データへの接続がこのセッションには
存在しないため（コネクタ未接続、Google Driveにもエクスポート済みデータなし）、Top 10ランキングや
具体的なCTR・クリック数は一切記載していない。実データが揃い次第、本書の手順通りに数値を埋める。

---

## 1. 必須GA4エクスポートフィールド

エクスポート時に必ず含める列（過不足なく）:

| フィールド | 種別 | 説明 |
|---|---|---|
| `page_path` | ディメンション | `species/{slug}.html` でフィルタ |
| `event_name` | ディメンション | `page_view`, `starter_kit_shown`, `starter_kit_click`, `affiliate_click` を対象 |
| `provider` | イベントパラメータ | `affiliate_click`のみ保持（`amazon` / `rakuten`） |
| `location` | イベントパラメータ | `affiliate_click`のみ保持（`diagnosis_result` / `species_page` / `starter_kit` / `guide_page` / `compare_page`） |
| `category` | イベントパラメータ | `affiliate_click`・`starter_kit_click`で保持（`enclosure` / `uvb` / `basking` / `heater` / `substrate` / `shelter` / `filter` / `supplement` / `unknown`） |
| `product_id` | イベントパラメータ | `affiliate_click`で保持（任意項目、存在する場合のみ） |
| `species_slug` | イベントパラメータ | `affiliate_click`で保持 |
| `tier` | イベントパラメータ | `affiliate_click`で保持（任意項目） |
| `event_count` | 指標 | 各イベントの発生回数 |
| `page_views` | 指標 | 標準`page_view`数（speciesページ単位） |
| `users` | 指標 | 標準ユニークユーザー数（`user_pseudo_id`基準） |
| `avg_engagement_time` | 指標 | 標準GA4エンゲージメント時間（ページ単位平均） |

`price_band`はPhase 28-Cで定義された任意パラメータだが、現状どの発火箇所にも実データソースが存在しないため
（`docs/ga4-revenue-dashboard.md` Phase 28-B監査、`docs/ga4-revenue-dashboard.md` §8参照）、本エクスポートには含めない。

---

## 2. 推奨データ期間（2モード）

### モードA — Post-normalization only（推奨・既定）

```
開始日: 2026-06-30（commit d9320f7 — affiliate_click正規化デプロイ日）
終了日: 直近
```

この期間のみ`affiliate_click`のパラメータ構造が単一スキーマ（`provider`/`location`/`category`統一後）で一貫している。
**Pareto分析・Winners/Zombies/Hidden Gems判定は、原則このモードのデータのみを使用すること。**
最低1〜2週間分のデータが溜まってから実行を推奨（即日〜数日のデータはサンプルサイズが小さく統計的に不安定）。

### モードB — Historical（参考値・注意ラベル必須）

```
開始日: 任意（2026-06-30より前を含む）
終了日: 2026-06-29 以前 または 2026-06-30をまたぐ期間
```

⚠️ **このモードのデータには `affiliate_click` が2つの異なるパラメータ構造
（`source`/`location` 系と `provider`/`source_page` 系）で混在している。**
集計に使う場合は必ずレポート上に「⚠️ pre-normalization / mixed data — 構造差異未補正」のラベルを付け、
モードAの結果と並べて比較する用途以外には使わないこと（意思決定の根拠にはモードAのみを使う）。

---

## 3. Revenue Proxy Formula（固定）

```
score = (affiliate_click_count × 5) + (starter_kit_click_count × 2) + (page_views × 0.1)
```

species（`species_slug` または `page_path`）単位で集計する。

---

## 4. Winner / Zombie / Hidden Gem 判定ルール

| 区分 | 条件 |
|---|---|
| **Winner** | revenue proxy score 降順で上位10ページ |
| **Zombie** | `page_views`が全98ページ中上位30%（約29ページ） **かつ** `affiliate_click ÷ starter_kit_shown` < 5% |
| **Hidden Gem** | `page_views`が全98ページの中央値未満 **かつ** `affiliate_click ÷ starter_kit_shown` > 15% |

`starter_kit_shown`がゼロ（Starter Kitが表示されていないspecies）の場合、CTRは計算不能（`N/A`）として
Zombie/Hidden Gem判定から除外し、別途「計測不能ページ」として一覧化する。

---

## 5. 出力テーブル（空欄・実データ投入待ち）

### Table 1 — Top Revenue Species（Winners）

| rank | species | score | affiliate CTR | recommendation |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |
| 9 | | | | |
| 10 | | | | |

recommendation判定: CTR > 15% → 「横展開」／ 5〜15% → 「現状維持」／ < 5% → 「Zombie候補として要確認」

### Table 2 — Zombie Pages

| species | page_views順位 | affiliate CTR | issue（仮説） | fix recommendation |
|---|---|---|---|---|
| | | | | |

issue仮説チェックリスト: 弱いCTA文言・配置／商品適合度の低さ（`recommendedFor`不一致）／検索意図のズレ／記事トーンとKit価格帯のミスマッチ

### Table 3 — Hidden Gems

| species | page_views | affiliate CTR | why strong（仮説） | scaling plan |
|---|---|---|---|---|
| | | | | |

### Pareto集計

```
Total species pages = 98 active
Top X pages responsible for 80% revenue proxy = ___
Pareto ratio = Top X ÷ 98 × 100% = ___%
```

### Phase 28-E 推奨ターゲット（20ページ）

```
Winners（Table 1 Top 10）+ Hidden Gems（Table 3 Top 10）= 20ページ
```

| 優先順位 | species | 区分（Winner/Hidden Gem） |
|---|---|---|
| 1〜10 | | Winner |
| 11〜20 | | Hidden Gem |

---

## 6. 実行手順（GA4 Explore / Looker Studio）

### 6-A. GA4標準探索（Explore）を使う場合

1. GA4管理画面 → 探索 → 自由形式
2. ディメンションに `page_path`, `event_name` を追加
3. カスタムパラメータ`provider`, `location`, `category`, `product_id`, `species_slug`, `tier`をディメンションとして登録済みか確認（未登録なら「カスタム定義」→「カスタムディメンションを作成」で`event_name`スコープのカスタムイベントパラメータとして追加）
4. 指標に `イベント数`, `表示回数(page_views)`, `アクティブユーザー数`, `平均エンゲージメント時間` を追加
5. 日付範囲を §2 モードAの通りに設定（2026-06-30〜直近）
6. フィルタ: `page_path` が `species/` を含む
7. テーブルをCSVエクスポート

### 6-B. Looker Studio を使う場合

1. `docs/ga4-revenue-dashboard.md` のPage 2「Species Revenue Ranking」テーブル定義をそのまま流用
2. 期間フィルタをモードAの範囲に固定
3. テーブルをCSVエクスポート

---

## 7. CSV取得後の次のアクション

1. エクスポートしたCSV（またはGoogle Sheet URL）をこのプロジェクトのチャットに共有する。
2. 次回セッションでCSVを読み込み、§5の全テーブルとPareto比率を実数値で埋める。
3. データがモードAの期間（2026-06-30以降）であることを確認する。サンプル数が少ない場合は
   「参考値・要再計測」ラベルを付けて報告する。
4. Table 1〜3が確定したらPhase 28-Eの推奨ターゲットリスト（20ページ）を確定し、
   Premium Starter Kitの設計に着手する。

本ドキュメントはコード変更を一切含まない。`docs/revenue-pareto-analysis.md`の新規作成のみ。
