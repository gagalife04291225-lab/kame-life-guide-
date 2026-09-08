# 外部フィルター × 対応ろ材 対応表（2026-09-08 監査）

> 目的: サイトで紹介している外部式フィルター本体ごとに、**その機種に適合する純正ろ材・交換パッド**を 1 対 1 で対応させる。
> 汎用ろ材の一律推奨はしない。ろ材の順番は**メーカー指定の水流方向**に従う。
>
> **証拠の強さ**: メーカー公式サイト（eheim.jp / product.gex-fp.co.jp / fluvalaquatics.com）と主要販売店（charm / rva / minatodenki / aquatailors / w-monster）は
> 本実行環境から **すべて egress 遮断（BLOCKED_EGRESS）**。したがって「メーカー適合」は
> ①メーカー公式ページの検索インデックス抜粋 ②純正品の商品名に含まれる機種指定（例「2213専用」）③販売店掲載の品番 の3点で判定した。
> Amazon 商品の実在は `WebSearch("<ASIN>", allowed_domains=["amazon.co.jp"])` で `/dp/<ASIN>` を URL 照合したもののみ VERIFIED とする。

## 判定語

2026-09-08 Owner 指示により、商品ごとに **Amazon 実体（identity）** と **機種適合（compatibility）** を分離して持つ（`data/products.js` の `amazonIdentity` / `compatibility` / `compatibilityNote` / `linkHold`）。

| 軸 | 値 | 意味 |
|---|---|---|
| identity | AMAZON_IDENTITY_VERIFIED | `WebSearch("<ASIN>", allowed_domains=["amazon.co.jp"])` で `/dp/<ASIN>` と商品名一致を URL 照合した |
| identity | AMAZON_IDENTITY_UNVERIFIED | 上記が取れていない |
| compatibility | COMPATIBILITY_VERIFIED | メーカー一次資料、または十分な型番・機種指定証拠（メーカー品番＋機種名を複数販売店が同一表記、国際品番との対応）がある |
| compatibility | COMPATIBILITY_PARTIAL | 型番未確認・必要容量未確認・一次資料 BLOCKED などが残る。**購入導線（best10 チップ）に出さない**（`linkHold: true`） |
| compatibility | COMPATIBILITY_UNVERIFIED | 適合根拠なし。商品データにも入れない |

`/dp/<ASIN>` と商品名の一致だけでは COMPATIBILITY_VERIFIED にしない。ASIN は推測しない。


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
**順番の追加確認（2026-09-08）**: 取扱説明書由来の英語二次資料（ManualsLib 抜粋・Planted Tank）が「最下段 MECH → 粗目（青）→ SUBSTRAT(pro) → 〔活性炭〕→ 最上段 細目（白）」で一致。国内資料の「粗目→メック」表記は少数派。**採用: メックが最下段、その上に粗目**（PARTIALLY_EVALUATED・取説 PDF 自体は BLOCKED_EGRESS）。

**付属ろ材（ろ材付きセット）**: 2211（2211320）・2213（2213320）は「フィルターパッド 細目×1・粗目×1・活性炭×1、エーハイムメック、サブストラットプロ」（eheim.jp 抜粋）。
**仕様変更**: 2211 は 2025-04、2215 は 2025-09 に付属生物ろ材が **サブストラットプロ → サブストラット** へ変更（eheim.jp 抜粋）。
**2217 の付属内容**: 国内流通の 2217-NEW（2217330）は **ろ材別売**（eheim.jp の製品名に「ろ材付き」が無く、charm が「2217-NEW専用ろ材セット メック&サブストラットプロレギュラー&5Lバケツ」を別売）。国際メディアセット 2522170 は 粗目 2616171×1・細目 2616175×1・MECH×1・SUBSTRATpro×4（単位未確認）。→ 2217 は初期ろ材も **P1_MISSING_MEDIA**（PARTIALLY_EVALUATED）。
**容量**: 2213 約3L・2215 約4L（eheim.jp 抜粋）。Owner 提示の「2213: MECH 1L + SUBSTRATpro 2L」等の**内訳容量は一次資料で確認できず**（PARTIALLY_EVALUATED）。国際品番 2522130（2213 用メディアセット）は eheim-service.de で「carbon / fine / coarse pad + SUBSTRATpro + MECH」の構成のみ確認。2522150 / 2522170 は未確認。

| 機種 | 役割 | 純正品 | 品番（販売店表記） | Amazon ASIN | 判定 |
|---|---|---|---|---|---|
| 2211 | 物理・粗目 | 2211専用 粗目フィルターパッド 2枚入 | **2616112**＝EHEIM Japan 品番（JAN 4011708260760・9.5×9.5×2cm・yodobashi/minatodenki/discountaqua）。国際品番 2616111 は同じ 2211 用 2枚入。**末尾差は市場 SKU 差で入数・適合は同一** | B004WI1I02 | identity VERIFIED / **compatibility VERIFIED** |
| 2211 | 物理・細目 | 2211専用 細目フィルターパッド 3枚入 | **2616116**＝EHEIM Japan 品番（国際 2616115 と同じ 3枚入） | B004WI1I1G | identity VERIFIED / **compatibility VERIFIED** |
| 2213 | 物理・粗目 | 2213専用 粗目フィルターパッド 2枚入 | **2616132**＝EHEIM Japan 品番（yodobashi/minatodenki/aquatailors/rva）。国際 2616131 と同じ 2213 用 2枚入 | B004WI233I | identity VERIFIED / **compatibility VERIFIED** |
| 2213 | 物理・細目 | 2213専用 細目フィルターパッド 3枚入 | **2616136**＝EHEIM Japan 品番（minatodenki/aquatailors/suiso-ya）。国際 2616135 と同じ 2213 用 3枚入 | B004FLGIGK | identity VERIFIED / **compatibility VERIFIED** |
| 2213 | 化学（用途限定） | 2213専用 活性炭フィルターパッド 3枚入 | 型番未確認 | B004WI234M | identity VERIFIED / **compatibility PARTIAL**（型番未確認・必要時のみ／薬剤使用後など用途限定。商品データとして保持、導線に出さない） |
| 2215 | 物理・粗目 | 2215専用 粗目フィルターパッド 2枚入 | 2616151（Amazon 表記・国際品番一致） | B0014FKJNS | identity VERIFIED / **compatibility VERIFIED** |
| 2215 | 物理・細目 | 2215専用 細目フィルターパッド 3枚入 | 2616155（Amazon 表記・国際品番一致） | B0014FIOLM | identity VERIFIED / **compatibility VERIFIED** |
| 2217 | 物理・粗目 | 2217専用 粗目フィルターパッド 2枚入 | 2616171（minatodenki・国際品番と同一。国際メディアセット 2522170 の構成品としても確認） | 検索結果に価格付きで存在するが `/dp/` URL 未取得 | identity **UNVERIFIED** / compatibility VERIFIED → 商品データに入れない（CANDIDATE_FOUND_UNVERIFIED） |
| 2217 | 物理・細目 | 2217用 細目フィルターパッド 6枚入 | 2217998＝EHEIM Japan の 6枚入 SKU（2213 用は 2213998・yodobashi）。国際 2616175 は 1枚入で別 SKU | B00E0GLA04 | identity VERIFIED / **compatibility VERIFIED** |
| 共通 | 生物 | サブストラットプロ レギュラー 1L | — | B005G0OUSW | identity VERIFIED / **compatibility PARTIAL**（適合機種は確実だが全量交換に要る容量が一次資料未確認。補充・半量交換用として保持、導線に出さない） |
| 共通 | 物理・リング | エーハイムメック 1L | — | B075VM8C5P | identity VERIFIED / **compatibility PARTIAL**（同上） |

品番の末尾（…1/…5 と …2/…6）は入数違いの別 SKU の可能性があるが、メーカー一覧ページが BLOCKED_EGRESS のため EVALUATED_INCONCLUSIVE。

### GEX メガパワー 2045 / 6090

**水流**: 「フルボトムアップ」＝ケース下部から上部へ（GEX 公式抜粋）。
**順番**: 取扱説明書 PDF（product.gex-fp.co.jp）が BLOCKED_EGRESS のため **EVALUATED_INCONCLUSIVE**。交換セットの構成（スポンジ＝粗目物理、マット＝細目物理、バイオ＝生物、カーボン＝化学）は GEX 公式抜粋で確認。

| 機種 | 純正品 | 構成 / 品番 | Amazon ASIN | 判定 |
|---|---|---|---|---|
| 6090 | メガパワー 6090用 交換ろ材セット | メガマット6090用（GM-18161・2枚）×1、メガスポンジ6090用 ×2、メガカーボン 150g×2、メガバイオ 250g×2。本体付属（レビュー抜粋）: ウールマット・粗めスポンジ・活性炭300g・ゼオライト500g・リングろ材450g、3段バスケット | B076MDP7WD | identity VERIFIED / **compatibility VERIFIED**（メーカー機種指定）。投入順は EVALUATED_INCONCLUSIVE |
| 2045 | メガパワー2045用 交換ろ材セット | メガマットダブル2045（ウールマット＋スポンジマット）、メガバイオカーボン2045用、クリーンバイオリング-N（2/3量交換） | B077N2ZDLN | identity VERIFIED / **compatibility VERIFIED**（メーカー機種指定）。投入順は EVALUATED_INCONCLUSIVE |

### Fluval FX6

**水流**: 上部から吸い込み、側面の3段フォーム（物理）を通ってから中央のバスケットを上→下（Fluval 公式・manualslib 抜粋）。
**メーカー推奨の順番（上→下）**: 上段＝物理（Bio-Foam 等）→ 中段＝生物（BIOMAX）→ 下段＝化学（必要時のみ）。
**EHEIM 用ろ材は流用しない。**

| 純正品 | 型番 | Amazon（co.jp） | 判定 |
|---|---|---|---|
| Bio-Foam FX4/FX5/FX6 2枚 | A239 | B00D6DRSK8 | identity VERIFIED / **compatibility VERIFIED**（Fluval 公式型番） |
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
