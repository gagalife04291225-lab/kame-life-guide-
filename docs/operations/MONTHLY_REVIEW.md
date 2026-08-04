# 月次レビュー手順（MONTHLY REVIEW）

> KAME LIFE GUIDE 運営ドキュメント｜毎月初・約35分
> 関連: [KPI.md](KPI.md) ・ [WEEKLY_REVIEW.md](WEEKLY_REVIEW.md) ・ [DECISION_RULE.md](DECISION_RULE.md) ・ [OPERATIONS_MANUAL.md](OPERATIONS_MANUAL.md)

**原則：推測しない。実測値のみでレポート化する。前月比（MoM）で見る。**

---

## 1. 収集する数値（すべて実測）

### 検索（GSC・直近1か月 vs 前月）
- 検索クリック（合計・カテゴリ別）
- 平均CTR（合計・カテゴリ別）
- 平均掲載順位（主要ページ）
- 表示回数（合計・カテゴリ別）

### 流入（GA4）
- セッション / ユーザー（参照元別：Organic Search / TikTok(utm) / Direct / Referral）
- 人気記事 TOP10（page_view）

### 診断（GA4）
- 診断利用数：`shindan_start` 件数
- 診断完了率：`diagnosis_result_view` ÷ `shindan_start`
- 結果 → CTA率：`diagnosis_result_species_cta` / `diagnosis_result_starterkit_cta` ÷ `diagnosis_result_view`

### 収益（ASPレポート ＋ GA4）
- Amazonアソシエイト報酬（確定 / 発生）＝**Amazonレポート**
- 楽天アフィリエイト報酬＝**楽天レポート**
- `affiliate_click`（GA4・provider / category / tier 別）
- **EPC = 確定報酬 ÷ affiliate_click**（＝1クリックあたり報酬）
  - オーガニック主体で広告費がほぼ0のため、真のROI（対広告費）ではなく実質EPC

### 改善結果
- 当月に着手した P0 ページの Before → After（順位 / CTR）

### 楽天同期ログ（在庫・価格の異常検知）

`data/products.js` は毎日3時（JST）の Rakuten Price Sync が更新している。**この同期は失敗しても静かに続くため、月に一度ログを見ないと異常に気付けない。**

見る場所：GitHub → Actions → **Rakuten Price Sync** → 直近の実行 → `sync` ジョブ → **Run Rakuten sync** ステップ。末尾の `=== Rakuten Sync Report ===` にある次の3行だけを記録する。

| ログ行 | 意味 | 0件でなかったときの対応 |
|--------|------|------------------------|
| `Failed` | 楽天APIがその商品の問い合わせを拒否した | 商品IDの `rakutenSearchTerm` を確認する。**半角1文字の単語**（例：末尾の `S`）はAPIが `wrong_parameter` で弾く |
| `Demoted` | 在庫が確認できなくなり、価格とアフィリエイトURLを自動クリアした | その商品は楽天で買えなくなった可能性が高い。Amazon側の在庫も確認し、必要なら代替商品を検討する |
| `Pending hits` | `pending`（楽天に無いと判断した商品）に候補が出た | 候補が**本当に同じ商品か**を目視で確認してから `search` に戻す。自動では昇格しない |

補足：楽天APIは `availability=1`（在庫あり商品のみ）で問い合わせている。したがって「該当なし」は**その検索語では買える商品に到達できていない**ことを意味する。`No result` の件数が前月から大きく増えていたら、検索語ではなく実際の流通が変わった可能性を疑う。

---

## カテゴリ定義（URLパターン｜GSC・GA4共通）

| カテゴリ | URLパターン |
|---------|-------------|
| 種ページ | `/species/` |
| 比較記事 | `/compare/` |
| 病気記事 | `/trouble/` |
| Best10 | `-best10.html` |
| レビュー | `-review.html` |
| ガイド | `/guides/` ＋ `guide-*.html` |
| 診断 | `/shindan/` |
| Trust/About | about-tete / privacy / disclaimer / photo-credits |

---

## 2. レビュー手順（35分）

1. （5分）ASPレポートから Amazon / 楽天の当月報酬を記録シートに入力
2. （10分）GSC・GA4 から上記数値を収集（カテゴリ別・前月比）
3. （5分）EPC を category / provider 別に算出（確定報酬 ÷ affiliate_click）
4. （5分）当月の改善結果（P0の Before→After）を集計
5. （5分）楽天同期ログの `Failed` / `Demoted` / `Pending hits` を記録（対応は前章の表に従う）
6. （5分）所見と翌月の重点1〜2テーマを決定 → 次章レポートに記載

---

## 3. 月次レポート テンプレート

```
# KAME LIFE GUIDE 月次レポート YYYY-MM

## サマリ（前月比 MoM）
- 検索クリック：___（前月 ___・___%）
- 平均CTR：___%（前月 ___%）
- 平均順位：___（前月 ___）
- セッション：___（Organic ___ / TikTok ___ / Direct ___）
- 診断開始：___ ／ 診断完了率：___%
- affiliate_click：___（Amazon ___ / 楽天 ___）
- 報酬：Amazon ___円 / 楽天 ___円 ／ EPC ___円/click
- 楽天同期：Failed ___件 / Demoted ___件 / Pending hits ___件（0件が正常）

## カテゴリ別 検索（Click / CTR / 順位）
| カテゴリ | Click | CTR | 平均順位 | MoM |
|---|---|---|---|---|
| 種ページ | | | | |
| 比較記事 | | | | |
| 病気記事 | | | | |
| Best10 | | | | |
| レビュー | | | | |
| ガイド | | | | |
| 診断 | | | | |

## 人気記事 TOP10（page_view）
1. ...

## 改善結果（当月着手 P0）
| ページ | 改善タイプ | Before(順位/CTR) | After(順位/CTR) |
|---|---|---|---|

## 収益効率（EPC）
| provider/category | affiliate_click | 確定報酬 | EPC |
|---|---|---|---|

## 所見・翌月の重点（1〜2テーマ）
- 高EPC × 高クリックのカテゴリ：___ → 強化
- 検索需要はあるがページが無いクエリ：___ → 記事化候補
```

---

## 4. 翌月目標の立て方（実測ベース）

- **強化対象**：EPC が高い × affiliate_click が多いカテゴリを次月の重点にする
- **記事化候補**：GSC「クエリ」で表示はあるが専用ページが無い／順位が低いクエリから選ぶ（推測で決めない）
- **改善継続**：P0（表示多い×CTR低 / 順位11〜20位）を週最大3ページのペースで継続
- 目標値は前月実測を基準に置く（例：CTR ___% → ___%）。根拠のない数値目標は置かない。
