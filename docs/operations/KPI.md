# 固定KPI一覧（KPI DEFINITIONS）

> KAME LIFE GUIDE 運営ドキュメント｜毎週・毎月に見る指標を固定する
> 関連: [WEEKLY_REVIEW.md](WEEKLY_REVIEW.md) ・ [MONTHLY_REVIEW.md](MONTHLY_REVIEW.md) ・ [DECISION_RULE.md](DECISION_RULE.md) ・ [OPERATIONS_MANUAL.md](OPERATIONS_MANUAL.md)

**原則：ここに載っているのは、GSC / GA4 / ASPレポートで実際に取得できる指標だけ。存在しない指標は載せない。**

---

## A. 検索（Google Search Console）

| KPI | 取得元 | 更新頻度 | 注意事項 |
|-----|--------|----------|----------|
| Click（検索クリック） | GSC 検索パフォーマンス | 週次 | 反映に1〜2日遅延あり |
| Impression（表示回数） | GSC 検索パフォーマンス | 週次 | 同上 |
| CTR | GSC 検索パフォーマンス | 週次 | Click ÷ Impression。位置により基準が変わる |
| Position（平均掲載順位） | GSC 検索パフォーマンス | 週次 | 平均値。低い＝上位。ページ/クエリで分けて見る |

> GSC には **収益・セッション・離脱率は存在しない**（Click / Impression / CTR / Position のみ）。

---

## B. 流入・行動（GA4：G-QQTE5CVF3K）

| KPI | 取得元（GA4） | 更新頻度 | 注意事項 |
|-----|--------------|----------|----------|
| Sessions | 標準：セッション | 週次 | 参照元/メディア別に分解可 |
| Users | 標準：ユーザー | 週次 | |
| Engagement（エンゲージメント率） | 標準 | 週次 | 直帰率 = 1 − エンゲージメント率 |
| 平均エンゲージメント時間 | 標準 | 週次 | |
| スクロール率 | 拡張計測 `scroll`(90%) ÷ page_view | 週次 | **GA4拡張計測がONの場合のみ**取得可 |
| 流入元 | 標準：セッションの参照元/メディア | 週次 | TikTokは bio リンクのUTM(`utm_source=tiktok`)で分離 |

---

## C. 診断ファネル（GA4・実装済みカスタムイベント）

| KPI | 取得元イベント | 更新頻度 | 注意事項 |
|-----|----------------|----------|----------|
| 診断ページ表示 | `/shindan/` の page_view | 週次 | ファネルの分母 |
| 診断開始 | `shindan_start` | 週次 | |
| 診断開始率 | `shindan_start` ÷ 診断page_view | 週次 | |
| 診断完了（結果表示） | `diagnosis_result_view`（≒`shindan_result`） | 週次 | |
| 診断完了率 | `diagnosis_result_view` ÷ `shindan_start` | 週次 | |
| 結果→種CTA | `diagnosis_result_species_cta` | 週次 | |
| 結果→比較CTA | `diagnosis_result_compare_cta` | 週次 | |
| 結果→Starter Kit | `diagnosis_result_starterkit_click` / `_cta` | 週次 | |

---

## D. 収益導線（GA4・affiliate_click）

| KPI | 取得元 | 更新頻度 | 注意事項 |
|-----|--------|----------|----------|
| affiliate_click | GA4 イベント `affiliate_click` | 週次 | 発火元はページごとに異なる（下記）。購入数・実人数とは区別する |
| provider別 | パラメータ `provider`（amazon / rakuten） | 週次 | **要カスタムディメンション登録** |
| category / tier / location / species_slug / source_page 別 | 同パラメータ | 月次 | 送信元によって有無・値の体系が異なる。GA4登録状況と分けて確認する |
| 商品ID別 | パラメータ `product_id` | 月次 | ASIN・商品DBの内部ID・ガイド独自IDが混在。検索リンクや楽天で空の経路もある。未設定を除外して総数を小さくしない |
| 100PVあたりのアフィリエイトクリック回数 | 同期間・同プロパティ・同ホスト・同ページの `affiliate_click` 数 ÷ `page_view` 数 × 100 | 月次 | クリック表とは別に `イベント名 = page_view` でイベント数を取得する。PV未取得・0では算出しない。ユニークCTR・購入率ではなく、複数クリックにより100回/100PVを超え得る |

### CSVを照合する手順

1. 同一プロパティで日付範囲を固定し、レポートのタイムゾーン・ホスト名・取得日時・データ品質表示を記録する。進行中の日や処理中データを含む値は取得時点のスナップショットとして扱い、最終値としない。
2. 行を標準ディメンションのページパス、値をイベント数とし、`affiliate_click` と `page_view` を別タブで完全一致フィルタして書き出す。ユーザー数や別イベントの数を分母に混ぜない。
3. 各CSVの総計と全明細の合計、パス重複、クリックがあるページのPV欠損を照合する。`/` と `/index.html`、`/kid/` と `/kids/` などを無条件に統合しない。表示行数だけで全行取得と判断しない。
4. 商品ID別も未設定行を残し、全明細の合計と総計を照合する。同じ未設定表示が複数行あれば原本の行を保持し、原因を推測しない。取得時点の異なる総数を同一スナップショットとして結合しない。
5. 100PVあたりのクリック回数が100を超えても重複計測とは断定しない。収益の優先順位にはクリック件数に加えてPV、商品別内訳、ASPの確定報酬を用い、少数PVの比率だけで本文や順位を変更しない。

### 計測コードと分析上の注意

- best10 / review の一部: `js/affiliate-track-static.js`。Amazon の `product_id` は `data-asin` または `/dp/` のASIN。検索リンクと楽天は空。`category` はファイル名由来、`species_slug` / `tier` は空。
- Starter Kit: `js/starter-kit.js`。`product_id` は商品DB内部IDを優先し、ASINはフォールバック。`starter_kit_click` / `starter_kit_cta_click` は別イベントであり、`affiliate_click` に加算しない。
- 一部ページの Amazon ボタン: `js/affiliate-cta.js`。`product_id` は `data-product-id` / `data-asin`、`category` は `unknown`。
- 環境用品候補: `js/setup-products.js`。商品DB内部IDと `location=setup_products` を送る。
- 4ガイドの購入CTA: HTML の `onclick`。独自IDと `source_page` / `guide_category` を送るが、共通の `location` / `category` / `species_slug` は未送信。
- `kid/index.html`: `js/kid-lookup.js`。`equipment_id` / `channel` / `source` を送る。共通の `product_id` / `provider` 等とは別の体系。
- `product_id` が似た商品名を指しても、検索リンクの独自IDをASINと無条件に合算しない。生ID別集計を保存し、商品同一性の確認後に別集計を作る。
- ソース上のリスナー数と、GA4への到達・管理画面のイベント作成ルールは別検証。重複送信の有無は本番の送信記録とGA4設定も確認する。
- 本節はコード仕様であり、GA4のカスタム定義が登録済みであることを意味しない。登録名だけでなく、紐づくパラメータ名・スコープ・最終変更日を別途確認する。最終変更日を作成日と断定しない。`affiliate_vendor` と `provider`、`starter_kit_tier` と `tier` は別のキーであり、自動で対応すると扱わない。

> **計測境界はクリックまで。** アソシエイト特性上、購入・購入CVRは自サイトで追えない。

---

## E. 収益実額（ASPレポート＝GSC/GA4の外）

| KPI | 取得元 | 更新頻度 | 注意事項 |
|-----|--------|----------|----------|
| Amazon報酬（発生 / 確定） | Amazonアソシエイト レポート | 月次 | GSC/GA4には無い。手動転記 |
| 楽天報酬 | 楽天アフィリエイト レポート | 月次 | 同上 |
| EPC（1クリックあたり報酬） | 確定報酬 ÷ `affiliate_click` | 月次 | 広告費ほぼ0のため実質EPC（真のROIではない） |

---

## F. TikTok（TikTok Analytics）

| KPI | 取得元 | 更新頻度 | 注意事項 |
|-----|--------|----------|----------|
| 投稿数 | TikTok Analytics | 週次 | |
| 再生数（合計/平均） | TikTok Analytics | 週次 | |
| プロフィールクリック | TikTok Analytics | 週次 | |
| ホームページ流入 | **GA4** `utm_source=tiktok` セッション | 週次 | bioリンクのUTM付与が前提 |

---

## 取得前の必須設定（一度だけ・GA4管理画面／サイトコードは不変）

1. GA4 拡張計測：`scroll` / outbound click / page_view が ON か確認（スクロール率に必要）
2. GA4管理画面の既存カスタム定義を確認し、実際に使うイベントパラメータ（provider / location / category / product_id / species_slug / tier、ガイド用 source_page 等）と**イベント範囲**の定義を照合する。登録済みの重複作成はしない。ページパスは標準ディメンションを使う。登録・送信後のレポート反映には24〜48時間かかり得る（[Google公式](https://support.google.com/analytics/answer/14239696?hl=ja)）。過去の空値が補完されたとは扱わない。
3. TikTok bio リンクに UTM を付与（例：`?utm_source=tiktok&utm_medium=social&utm_campaign=bio`）
