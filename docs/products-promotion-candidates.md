# products.js 昇格候補監査（Phase 39-P1-Step4）

`research/products-master.sample.json`（30件）と `data/products.js`（既存87商品）を照合し、
公開DBへの昇格候補を選定した監査記録。**本ドキュメントは監査結果のみであり、`data/products.js` 自体は変更していない。**

昇格作業を行う際は `docs/products-master-policy.md` の「products.js へ昇格する条件」6項目を
個別に満たしてから、少数ずつ実施すること。

---

## 1. 重複・競合候補（10件） — 昇格候補20件には含めない

既存 `PRODUCTS` と同一・類似の実商品である可能性が高く、「新規追加」ではなく
「統合・データ修正・方針決定」の対象として扱うべき候補。

### 1-1. 確認済みの強い重複（同一製品とほぼ断定できる根拠あり）

| master_id | product_name | 既存ID | 根拠 | 推奨アクション |
|---|---|---|---|---|
| RM0004 | 60cmガラス水槽（GEX） | `tank_60` | 既存が実ASIN(B09TF6B5P4)・実楽天URL付きのGEX 60cm水槽で同一と推定 | 新規追加せず既存を維持。RM0004は却下扱い |
| RM0005 | 90cmガラス水槽（GEX） | `tank_90` | 既存が実ASIN(B004J2G6XK)付きのGEX 90cm水槽で同一と推定 | 同上、却下扱い |
| RM0007 | ReptiSun 5.0 T5 HO（Zoo Med） | `uvb_t5_forest_std` | 既存の商品名が完全一致（"Zoo Med ReptiSun 5.0 UVB T5"）、実ASIN(B00JZFJ5LQ)あり | 同一製品。却下扱い |
| RM0008 | ReptiSun 10.0 T5 HO（Zoo Med） | `uvb_t5_desert_std` | 既存の商品名が完全一致、実ASIN(B00JZFJ5R0)あり | 同一製品。却下扱い |
| RM0016 | classic 250 / 2213（EHEIM） | `filter_canister_medium` | 既存の実楽天URLのスラッグに `eheim-2213` が含まれる＝同一製品 | **新規追加ではなくデータ修正候補**。既存の表示名"外部フィルター（中型）"を実製品名に更新することを検討 |
| RM0018 | GEX メガパワー 6090 | `filter_canister_xl` | 既存の表示名が完全一致（"GEX メガパワー 6090 外部フィルター"） | 同一製品。ただし既存の `rakutenSearchTerm` が "Fluval FX フィルター" になっており内部不整合（下記1-3参照） |

### 1-2. 重複の可能性が高いが要ブランド確認（既存側にブランド未記載のため断定不可）

| master_id | product_name | 既存ID | 既存側の状況 | 推奨アクション |
|---|---|---|---|---|
| RM0013 | マルチサーモ（GEX） | `thermostat` | 既存名"サーモスタット（アナログ）"はブランド未記載 | 実商品ページでGEX製かを個別確認してから統合判断 |
| RM0020 | Eco Earth（Zoo Med） | `substrate_coco` | 既存名"ヤシガラ（ブリック）"はブランド未記載 | 同上 |
| RM0023 | Cork Bark（Zoo Med） | `shelter_bark_hide` | 既存名"コルクバーク（丸太）"はブランド未記載 | 同上 |
| RM0025 | Turtle Dock（Zoo Med） | `shelter_turtle_dock` | 既存名"水棲ガメ用ドック（浮島タイプ）"がZoo Med Turtle Dockの和訳的名称と酷似 | ブランド確認に加え、**カテゴリ方針の決定が必要**（shelterのままか、新設water_dishへ移すか） |

### 1-3. 既存データの内部不整合（今回の監査で判明・別途対応が必要）

- `uvb_t5_desert_12`（既存）: 商品名は「GEX EXOTERRA レプタイルUVB150 26W」だが `rakutenSearchTerm` は「Arcadia T5 HO 12% UVB 爬虫類」になっており、名前と検索語が別ブランドを指している。RM0009（Arcadia ProT5 Kit Desert 12%）は、この不整合を解消する実体候補になり得る。
- `filter_canister_xl`（既存）: 商品名は「GEX メガパワー 6090」だが `rakutenSearchTerm` は「Fluval FX フィルター 亀 大型水槽」になっており同様の不整合。RM0017（Fluval FX6）は、この枠を正しいFluval製品として独立させる候補になり得る。
- `food_aquatic_staple`（既存）: 商品名「カメプロス（テトラ）」だが、カメプロスはキョーリン（Kyorin）のブランドであり、テトラ表記は誤りの可能性が高い。RM0028（ReptoMin, Tetra）は、テトラ社の実製品として別枠で追加し、既存エントリのブランド表記修正と切り分けるための根拠になる。

これら3件は「昇格」というより「既存データのブランド表記修正」案件であり、今回のScope Lock（`data/products.js`変更禁止）の対象外として記録のみ行う。次フェーズでの個別対応を推奨。

---

## 2. 昇格候補20件

30件中、上記10件（重複・競合）を除いた20件を昇格候補とする。

### Priority A（7件）— 既存の不整合を解消する、または構造的な欠落を埋める

#### RM0009 — ProT5 Kit Desert 12%
- **category**: lighting_uvb
- **promotion_priority**: A
- **既存products.jsとの関係**: `uvb_t5_desert_12` の `rakutenSearchTerm` が指す実体そのものである可能性が高い（1-3参照）
- **昇格理由**: 既存データの商品名／検索語の内部不整合を解消できる。Arcadia公式サイト（sources.md）で存在確認済みのブランド
- **要確認事項**: `uvb_t5_desert_12` を置き換えるか、並存する別商品として追加するかの方針決定
- **Amazon確認要否**: 要（国内代理店経由の取扱ページ確認）
- **楽天確認要否**: 要

#### RM0012 — Deep Heat Projector
- **category**: lighting_basking
- **promotion_priority**: A
- **既存products.jsとの関係**: 直接の重複なし。既存basking premiumは`basking_hid_70w`（ゼンスイ）のみで、Arcadia製品は未収録
- **昇格理由**: 非可視光の輻射熱ランプという既存basking_ceramic_100wと異なる訴求（大型ケージ向け）を持つ専門ブランド製品で、ラインアップの厚みを追加できる
- **要確認事項**: 国内取扱店（代理店）の在庫状況
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0015 — Habistat Dimming Thermostat
- **category**: heating（thermostat）
- **promotion_priority**: A
- **既存products.jsとの関係**: `thermostat_digital`（既存プレミアム帯、汎用名）と機能が近いが、ディマー式は保温球専用の別方式
- **昇格理由**: 上級者向けの専門ブランド。既存プレミアム帯の汎用名"デジタルサーモスタット"を実ブランド品に置き換えるか、並存させる判断材料になる
- **要確認事項**: 国内代理店の有無、入手性が低い（`availability_status: low`）ため個別確認必須
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0017 — FX6
- **category**: filter
- **promotion_priority**: A
- **既存products.jsとの関係**: `filter_canister_xl` の `rakutenSearchTerm` が指す実体である可能性が高い（1-3参照）。ただしFX6自体はGEXメガパワー6090より上位の大容量モデルで別製品
- **昇格理由**: 既存データの内部不整合を解消しつつ、RedEarSlider.comフォーラム（sources.md）で実飼育者の使用実績が多い上位モデルを正式追加できる
- **要確認事項**: `filter_canister_xl` を置き換えるか、独立の最上位premium枠として追加するか
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0026 — Repti Ramp Bowl
- **category**: water_dish（新設カテゴリ）
- **promotion_priority**: A
- **既存products.jsとの関係**: 重複なし。**現行products.jsに"water_dish"カテゴリ自体が存在しない**（`dish-best10.html`ページはサイトに存在するが対応する商品データがない）
- **昇格理由**: サイト上の既存ページとデータの欠落を埋める。カテゴリ新設の最初の実装候補として適切
- **要確認事項**: カテゴリ新設に伴う`EQUIPMENT_MAP`各エントリへの`water_dish`枠追加が必要か、運営者に確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0027 — SANKO レプタイルディッシュ
- **category**: water_dish（新設カテゴリ）
- **promotion_priority**: A
- **既存products.jsとの関係**: 重複なし（RM0026と同じ理由）
- **昇格理由**: 国内ブランドで入手性が高く（`availability_status: high`）、water_dishカテゴリのbudget枠として即戦力
- **要確認事項**: RM0026とのtier分け（budget/standard）方針
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0028 — ReptoMin
- **category**: food
- **promotion_priority**: A
- **既存products.jsとの関係**: `food_aquatic_staple`（既存名"カメプロス（テトラ）"）とブランド表記の齟齬がある（1-3参照。カメプロスは実際はキョーリン製）
- **昇格理由**: Tetra社の実製品として正しく追加することで、既存エントリのブランド誤表記を実質的に是正できる
- **要確認事項**: 既存`food_aquatic_staple`のブランド表記修正を別途行うか、RM0028を単純併記に留めるか
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

### Priority B（9件）— ブランド多様化・価格帯補完として価値あり

#### RM0006 — 120cmガラス水槽（GEX）
- **category**: enclosure（tank）
- **promotion_priority**: B
- **既存products.jsとの関係**: `tank_120_aqua`（コトブキ、premium帯）と同サイズだがGEXのため価格帯が異なる可能性
- **昇格理由**: 120cm帯にbudget/standard選択肢を追加できる
- **要確認事項**: 実勢価格が`tank_120_aqua`と十分に差別化できるか
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0010 — Intense Basking Spot
- **category**: lighting_basking
- **promotion_priority**: B
- **既存products.jsとの関係**: 既存basking budgetはGEX/汎用ブランドが中心で、Exo Terra製品は未収録
- **昇格理由**: 世界的定番ブランドの選択肢追加
- **要確認事項**: 国内代理店経由価格
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0011 — Halogen Basking Spot
- **category**: lighting_basking
- **promotion_priority**: B
- **既存products.jsとの関係**: `basking_halogen_50w`/`basking_halogen_35w`と機能重複するが、既存は汎用ブランド、本品はExo Terra正規品
- **昇格理由**: ブランド信頼性の高い代替として並存の価値あり
- **要確認事項**: 既存の汎用ハロゲン球との価格差
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0019 — EarthMix
- **category**: substrate
- **promotion_priority**: B
- **既存products.jsとの関係**: 重複なし。既存substrateはZoo Med/GEX中心でArcadiaブランドは未収録
- **昇格理由**: 森林性・ハコガメ向け床材のブランド選択肢を追加
- **要確認事項**: 国内取扱が限定的（`availability_status: low`）なため入手経路の確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0021 — Plantation Soil
- **category**: substrate
- **promotion_priority**: B
- **既存products.jsとの関係**: 重複なし。Exo Terraブランドの湿潤系床材は未収録
- **昇格理由**: `substrate_forest_blend`/`substrate_cypress`と並ぶ湿潤系の選択肢拡充
- **要確認事項**: 国内正規代理店の有無
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0022 — Reptile Cave
- **category**: shelter
- **promotion_priority**: B
- **既存products.jsとの関係**: `shelter_small`/`shelter_medium`と機能重複するが、既存はブランド未記載の汎用品でありExo Terra正規品との重複は未確認（1-2の基準ほど強い根拠はないため昇格候補に残す）
- **昇格理由**: ブランド認知度の高い選択肢を追加できる
- **要確認事項**: 既存`shelter_small`/`shelter_medium`の実ブランドを確認し、同一であれば統合に切り替える
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0024 — SANKO ロックシェルター
- **category**: shelter
- **promotion_priority**: B
- **既存products.jsとの関係**: 重複なし。国内ブランドSANKOは未収録
- **昇格理由**: 入手性が高く（`availability_status: high`）budget/standard帯の国産選択肢として価値あり
- **要確認事項**: 型番・サイズ展開の確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0029 — Mazuri Aquatic Turtle Diet
- **category**: food
- **promotion_priority**: B
- **既存products.jsとの関係**: 重複なし。既存food premiumは`food_tortoise_gel`（リクガメ向けRepashy）のみで、水棲ガメ向けpremiumフードが存在しない
- **昇格理由**: 水棲ガメ側のpremium帯の欠落を埋める
- **要確認事項**: 入手性が低い（`availability_status: low`）ため個人輸入前提かどうかの確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0030 — Mazuri Tortoise Diet
- **category**: food
- **promotion_priority**: B
- **既存products.jsとの関係**: `food_tortoise_herbs`（キョーリン マルベリックドライ）、`food_tortoise_gel`（Repashy）と並ぶ別ブランドのpremium選択肢
- **昇格理由**: リクガメpremium帯のブランド多様化
- **要確認事項**: RM0029と同様、入手性の確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

### Priority C（4件）— 実商品の特定・ブランド確認が先に必要

#### RM0001 — ReptiHabitat 40 Gallon
- **category**: enclosure（cage）
- **promotion_priority**: C
- **既存products.jsとの関係**: 重複なし。ただし北米向けキット商品で日本国内の取扱実態が不明瞭
- **昇格理由**: Zoo Med公式ブランドではあるが、国内でのAmazon.co.jp/楽天販売実績を先に確認する必要がある
- **要確認事項**: 国内正規販売の有無（並行輸入のみの場合は昇格見送りを検討）
- **Amazon確認要否**: 要（並行輸入か正規品か要区別）
- **楽天確認要否**: 要

#### RM0002 — Tortoise House
- **category**: enclosure（cage）
- **promotion_priority**: C
- **既存products.jsとの関係**: 重複なし
- **昇格理由**: RM0001と同様の理由。国内入手性が中程度で個別確認が必要
- **要確認事項**: 国内販売実態の確認
- **Amazon確認要否**: 要
- **楽天確認要否**: 要

#### RM0003 — 木製ケージ 120×60
- **category**: enclosure（cage）
- **promotion_priority**: C
- **既存products.jsとの関係**: `enclosure_tortoise_120`（premium、120cm）と機能重複。ブランドが"Generic"のため実商品を未特定
- **昇格理由**: 実際にどのメーカー・型番の商品を指すか特定できない限り、そのままでは昇格不可
- **要確認事項**: 実商品（メーカー・型番）の特定が最優先。特定できなければ本候補は却下
- **Amazon確認要否**: 要（実商品特定後）
- **楽天確認要否**: 要（実商品特定後）

#### RM0014 — 爬虫類サーモスタット
- **category**: heating（thermostat）
- **promotion_priority**: C
- **既存products.jsとの関係**: `thermostat`（既存budget帯）と機能重複。ブランドNissoは判明しているが商品名が一般名詞的で型番不明
- **昇格理由**: 具体的な型番が特定できれば独立候補になり得るが、現状では既存budget帯との差別化ポイントが不明
- **要確認事項**: Nisso製品の具体的な型番・商品ページの特定
- **Amazon確認要否**: 要（実商品特定後）
- **楽天確認要否**: 要（実商品特定後）

---

## 3. 次にproducts.jsへ実装すべきTOP10

Priority A全7件 + Priority Bのうち欠落補完・入手性が高いもの3件を推奨する。

1. RM0026 — Repti Ramp Bowl（water_dishカテゴリ新設の起点）
2. RM0027 — SANKO レプタイルディッシュ（water_dishのbudget枠）
3. RM0028 — ReptoMin（`food_aquatic_staple`のブランド誤表記是正を伴う）
4. RM0009 — ProT5 Kit Desert 12%（`uvb_t5_desert_12`の内部不整合是正）
5. RM0017 — FX6（`filter_canister_xl`の内部不整合是正）
6. RM0012 — Deep Heat Projector（basking premium帯の拡充）
7. RM0015 — Habistat Dimming Thermostat（thermostat premium帯の拡充）
8. RM0024 — SANKO ロックシェルター（国内入手性が高くリスクが低い）
9. RM0006 — 120cmガラス水槽（GEX）（tank premium帯の価格帯補完）
10. RM0029 — Mazuri Aquatic Turtle Diet（水棲ガメfood premium帯の欠落補完）

上位3件（RM0026・RM0027・RM0028）は新設カテゴリまたは既存データ不整合の是正に直結するため、
最初の実装バッチとして優先することを推奨する。実装時は必ず
`docs/products-master-policy.md`「products.js へ昇格する条件」の6項目を個別に満たすこと。
