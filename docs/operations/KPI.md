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
| affiliate_click | GA4 イベント `affiliate_click` | 週次 | 全アフィリンクを `affiliate-track-static.js` が委譲計測 |
| provider別 | パラメータ `provider`（amazon / rakuten） | 週次 | **要カスタムディメンション登録** |
| category / tier / source_page 別 | 同パラメータ | 月次 | 同上（未登録だとGA4/Looker Studioで分解不可） |
| 商品別 | パラメータ `product_id`（Amazon=ASIN） | 月次 | 検索リンク(/s?k=)はASIN空 |

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
2. `affiliate_click` のパラメータ（provider / category / tier / source_page / product_id）を**カスタムディメンション（イベント範囲）に登録**
3. TikTok bio リンクに UTM を付与（例：`?utm_source=tiktok&utm_medium=social&utm_campaign=bio`）
