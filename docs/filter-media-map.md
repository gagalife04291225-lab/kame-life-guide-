# 外部フィルター × 対応ろ材 対応表（2026-09-08 監査）

> 目的: サイトで紹介している外部式フィルター本体ごとに、**その機種に適合する純正ろ材・交換パッド**を 1 対 1 で対応させる。
> 汎用ろ材の一律推奨はしない。ろ材の順番は**メーカー指定の水流方向**に従う。
>
> **証拠の強さ**: メーカー公式サイト（eheim.jp / product.gex-fp.co.jp / fluvalaquatics.com）と主要販売店（charm / rva / minatodenki / aquatailors / w-monster）は
> 本実行環境から **すべて egress 遮断（BLOCKED_EGRESS）**。したがって「メーカー適合」は
> ①メーカー公式ページの検索インデックス抜粋 ②純正品の商品名に含まれる機種指定（例「2213専用」）③販売店掲載の品番 の3点で判定した。
> Amazon 商品の実在は `WebSearch("<ASIN>", allowed_domains=["amazon.co.jp"])` で `/dp/<ASIN>` を URL 照合したもののみ VERIFIED とする。

## 判定語

| 判定 | 意味 |
|---|---|
| VERIFIED | 型番・適合機種・Amazon 商品ページの3つが揃った |
| VERIFIED_ADD_CANDIDATE | 上記が揃い、`data/products.js` へ追加した候補（merge は Owner 判断） |
| CANDIDATE_FOUND_UNVERIFIED | 商品は存在するが Amazon の `/dp/` URL または型番が未確定 |
| PARTIALLY_EVALUATED | 一部項目（容量・順番など）が未確認 |
| EVALUATED_INCONCLUSIVE | 調べたが確定できない |
| NOT_FOUND_AMAZON | amazon.co.jp で該当純正品を発見できない |
| NOT_FOUND_EXACT_MATCH | 類似品はあるが適合一致しない |
| BLOCKED_EGRESS | 確認経路が遮断されている |

## 1. サイト掲載中の外部式フィルター（現 main 実測）

| 機種 | 掲載箇所 | `data/products.js` id | 本体 ASIN |
|---|---|---|---|
| EHEIM クラシック 2211 | water-filter-best10 | （なし） | B002S1ROSU |
| EHEIM クラシック 2213 | best10 / water-filter-review / guides/filter-guide / products.js | `filter_canister_medium` | B002S152LG |
| EHEIM クラシック 2215 | best10 / products.js | `filter_canister_large` | B002OCNJXM |
| EHEIM クラシック 2217 | products.js のみ | `filter_canister_premium` | B002SGX79U |
| GEX メガパワー 2045 | best10 | （なし） | B004GK68HE |
| GEX メガパワー 6090 | best10 / water-filter-review（検索リンク）/ products.js | `filter_canister_xl` | B004FZ99HG |
| Fluval FX6 | products.js のみ | `filter_fluval_fx6` | B00BJQ50HC |

本体 ASIN 自体は再照合していない（NO-REWORK）。

## 2. 機種別の純正ろ材・交換パッド

### EHEIM クラシック（2211 / 2213 / 2215 / 2217）

**水流**: ケース下部から上部へ一直線（下から上の 1way 構造）。給水側＝最下段、排水側＝最上段。
**メーカー指定の順番（下→上）**: エーハイムメック → 粗目パッド（青）→ サブストラットプロ（またはサブストラット）→ 細目パッド（白）→ ［必要時のみ活性炭パッド］。
※ 二次情報（eheim.jp 公式ページの検索抜粋・複数レビュー）に基づく PARTIALLY_EVALUATED。取扱説明書 PDF（eheim.jp）は BLOCKED_EGRESS。
メックと粗目パッドの上下は資料により表記が割れる（「最下段がメック」と「粗目→メック」）。**どちらも生物ろ材より給水側に置く**点は一致。

**付属ろ材（ろ材付きセット）**: 2211（2211320）・2213（2213320）は「フィルターパッド 細目×1・粗目×1・活性炭×1、エーハイムメック、サブストラットプロ」（eheim.jp 抜粋）。
**仕様変更**: 2211 は 2025-04、2215 は 2025-09 に付属生物ろ材が **サブストラットプロ → サブストラット** へ変更（eheim.jp 抜粋）。2217 の付属内容は EVALUATED_INCONCLUSIVE。
**容量**: 2213 約3L・2215 約4L（eheim.jp 抜粋）。Owner 提示の「2213: MECH 1L + SUBSTRATpro 2L」等の**内訳容量は一次資料で確認できず**（PARTIALLY_EVALUATED）。国際品番 2522130（2213 用メディアセット）は eheim-service.de で「carbon / fine / coarse pad + SUBSTRATpro + MECH」の構成のみ確認。2522150 / 2522170 は未確認。

| 機種 | 役割 | 純正品 | 品番（販売店表記） | Amazon ASIN | 判定 |
|---|---|---|---|---|---|
| 2211 | 物理・粗目 | 2211専用 粗目フィルターパッド 2枚入 | 2616112（Amazon slug）/ 2616111（eheim.jp 抜粋） | B004WI1I02 | VERIFIED_ADD_CANDIDATE |
| 2211 | 物理・細目 | 2211専用 細目フィルターパッド 3枚入 | 2616116（Amazon slug） | B004WI1I1G | VERIFIED_ADD_CANDIDATE |
| 2213 | 物理・粗目 | 2213専用 粗目フィルターパッド 2枚入 | 2616131（eheim.jp 抜粋） | B004WI233I | VERIFIED_ADD_CANDIDATE |
| 2213 | 物理・細目 | 2213専用 細目フィルターパッド 3枚入 | 2616136（Amazon slug）/ 2616135（eheim.jp 抜粋） | B004FLGIGK | VERIFIED_ADD_CANDIDATE |
| 2213 | 化学（必要時） | 2213専用 活性炭フィルターパッド 3枚入 | — | B004WI234M | VERIFIED_ADD_CANDIDATE（常時必須ではない） |
| 2215 | 物理・粗目 | 2215専用 粗目フィルターパッド 2枚入 | 2616151 | B0014FKJNS | VERIFIED_ADD_CANDIDATE |
| 2215 | 物理・細目 | 2215専用 細目フィルターパッド 3枚入 | 2616155 | B0014FIOLM | VERIFIED_ADD_CANDIDATE |
| 2217 | 物理・粗目 | 2217専用 粗目フィルターパッド 2枚入 | 2616171（minatodenki） | 検索結果に存在するが `/dp/` URL 未取得 | CANDIDATE_FOUND_UNVERIFIED |
| 2217 | 物理・細目 | 2217用 細目フィルターパッド 6枚入 | 2217998 | B00E0GLA04 | VERIFIED_ADD_CANDIDATE |
| 共通 | 生物 | サブストラットプロ レギュラー 1L | — | B005G0OUSW | VERIFIED_ADD_CANDIDATE（補充・半量交換用） |
| 共通 | 物理・リング | エーハイムメック 1L | — | B075VM8C5P | VERIFIED_ADD_CANDIDATE |

品番の末尾（…1/…5 と …2/…6）は入数違いの別 SKU の可能性があるが、メーカー一覧ページが BLOCKED_EGRESS のため EVALUATED_INCONCLUSIVE。

### GEX メガパワー 2045 / 6090

**水流**: 「フルボトムアップ」＝ケース下部から上部へ（GEX 公式抜粋）。
**順番**: 取扱説明書 PDF（product.gex-fp.co.jp）が BLOCKED_EGRESS のため **EVALUATED_INCONCLUSIVE**。交換セットの構成（スポンジ＝粗目物理、マット＝細目物理、バイオ＝生物、カーボン＝化学）は GEX 公式抜粋で確認。

| 機種 | 純正品 | 構成 / 品番 | Amazon ASIN | 判定 |
|---|---|---|---|---|
| 6090 | メガパワー 6090用 交換ろ材セット | メガマット6090用（GM-18161・2枚）×1、メガスポンジ6090用 ×2、メガカーボン 150g×2、メガバイオ 250g×2 | B076MDP7WD | VERIFIED_ADD_CANDIDATE |
| 2045 | メガパワー2045用 交換ろ材セット | メガマットダブル2045（ウールマット＋スポンジマット）ほか。単品: メガバイオカーボン／クリーンバイオ リングN | B077N2ZDLN | VERIFIED_ADD_CANDIDATE（セット内訳の全量は EVALUATED_INCONCLUSIVE） |

### Fluval FX6

**水流**: 上部から吸い込み、側面の3段フォーム（物理）を通ってから中央のバスケットを上→下（Fluval 公式・manualslib 抜粋）。
**メーカー推奨の順番（上→下）**: 上段＝物理（Bio-Foam 等）→ 中段＝生物（BIOMAX）→ 下段＝化学（必要時のみ）。
**EHEIM 用ろ材は流用しない。**

| 純正品 | 型番 | Amazon（co.jp） | 判定 |
|---|---|---|---|
| Bio-Foam FX4/FX5/FX6 2枚 | A239 | B00D6DRSK8 | VERIFIED_ADD_CANDIDATE |
| Bio-Foam 3枚 | A228 | 未発見 | NOT_FOUND_AMAZON |
| Carbon Foam Pad | A249 | 未発見 | NOT_FOUND_AMAZON |
| Polishing Pad | （型番未確定） | 未発見 | NOT_FOUND_AMAZON |
| BIOMAX | （型番未確定） | 未発見 | NOT_FOUND_AMAZON |

## 3. 亀向け「ろ材構成」の原則（記事・導線で守る）

1. 物理ろ過（粗目スポンジ／粗目マット）を**給水側の最前段**に置き、フン・食べ残しを先に止める
2. 生物ろ過（焼結ガラス・セラミック）
3. 仕上げ物理ろ過（細目マット／ウール）
4. 化学ろ過（活性炭）は**必要時のみ**

- 順番は機種のメーカー指定水流に従う（EHEIM クラシック＝下→上、GEX メガパワー＝下→上、Fluval FX6＝側面フォーム→バスケット上→下）
- 生物ろ材は**全量同時交換しない**（半量ずつ）
- 容量不足のろ材を適合扱いしない／メーカー非対応品を「使えるはず」で配線しない

## 4. 商品不足判定（機種別）

| 機種 | 初期ろ材 | 交換パッド | 生物ろ材の補充 | 判定 |
|---|---|---|---|---|
| EHEIM 2211 | 本体セットに付属 → NO_ADD_NEEDED | 導線なし → **P1_MISSING_REPLACEMENT_PAD**（候補 VERIFIED） | 導線なし → P1_MISSING_MEDIA（候補 VERIFIED） | 追加候補 4 |
| EHEIM 2213 | 付属 → NO_ADD_NEEDED | **P1_MISSING_REPLACEMENT_PAD**（候補 VERIFIED） | P1_MISSING_MEDIA（候補 VERIFIED） | 追加候補 5（活性炭含む） |
| EHEIM 2215 | 付属 → NO_ADD_NEEDED | **P1_MISSING_REPLACEMENT_PAD**（候補 VERIFIED） | P1_MISSING_MEDIA | 追加候補 4 |
| EHEIM 2217 | 付属内容 EVALUATED_INCONCLUSIVE | 細目 VERIFIED／粗目 CANDIDATE_FOUND_UNVERIFIED | P1_MISSING_MEDIA | 追加候補 3（粗目は保留） |
| GEX 2045 | 付属 → NO_ADD_NEEDED | **P1_MISSING_MEDIA**（交換セット VERIFIED） | セットに含む | 追加候補 1 |
| GEX 6090 | 付属 → NO_ADD_NEEDED | **P1_MISSING_MEDIA**（交換セット VERIFIED） | セットに含む | 追加候補 1 |
| Fluval FX6 | 付属（本体） | Bio-Foam VERIFIED／他 NOT_FOUND_AMAZON | NOT_FOUND_AMAZON | 追加候補 1 |

## 5. 未確定項目と再開条件

| 項目 | 確認したこと | 不足 | 再開条件 |
|---|---|---|---|
| EHEIM 付属ろ材の内訳容量（MECH/SUBSTRAT の L 数） | eheim.jp 抜粋でろ材容量 3L/4L と構成種別 | 内訳 L 数 | eheim.jp 製品ページ／取説 PDF が読める環境 |
| EHEIM ろ材の順番（メックと粗目の上下） | 二次情報 2 系統 | 取説の図 | 同上 |
| 2217 粗目パッド | Amazon 検索結果に価格付きで存在 | `/dp/` URL | bare-ASIN 検索で URL が返る ASIN が分かったとき |
| GEX メガパワーの順番 | 交換セット構成・フルボトムアップ | 取説の図 | product.gex-fp.co.jp の取説 PDF が読める環境 |
| Fluval FX6 の BIOMAX / Polishing / Carbon | 公式抜粋で型番 A228 / A249 | amazon.co.jp の商品ページ | co.jp で純正品が流通したとき |
| 価格帯 | 未取得 | `priceRange` | Amazon 価格が取得できる経路 |

## 6. 楽天

全 13 件を `rakutenStatus: 'search'`（`rakutenSearchTerm` 付与）で登録。日次同期（rakuten-sync）で `pending` / `available` へ遷移する。search を「商品確認済み」とは扱わない。
