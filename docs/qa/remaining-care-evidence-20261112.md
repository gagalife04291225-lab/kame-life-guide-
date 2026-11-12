# 残る飼育根拠の是正候補

2026-11-12。base main e94ef55284f847eb845d46427701bd0307ea144a、branch codex/remaining-care-evidence-20261112。ローカル候補。公開変更なし。

## Scope

- サイズ17レコード。TTWG2025掲載の最大SCLを通常成体サイズと区別。既存のより大きい資料値も機械的に小さくしない（ヒガシナガクビ30cm）。詳細は size-evidence-20261112.md。
- 寿命8種。平均が未確立のものは未確立のまま、飼育期間記録や動物園案内に分類。詳細は ../fixed-facts/lifespan-evidence-20261112.md。master lifespan値は不変。
- cage-review / cage-best10 / water-filter-review の容器説明。無出典の一律倍率、長さと面積の単位混同、汚染負荷とろ過流量の一律倍率を撤去。種別条件・実際の空間・実水量・メーカー適合に基づく説明と #growth 導線へ。
- KID、価格、商品URL、GA4、CITES、順位、CSSは対象外。

## 根拠

- TTWG2025専門家編纂資料の本文・該当分類/最大SCLを確認。引用される元論文すべてを独立再取得した意味ではない。
  https://iucn-tftsg.org/wp-content/uploads/crm.10.checklist.atlas_.v10.2025.pdf
- MSDは種別空間・隠れ家・温度勾配などの一般原則の参照先。一律の甲長倍率の根拠ではない。
  https://www.msdvetmanual.com/all-other-pets/reptiles/providing-a-home-for-a-reptile
- VCA水棲飼育はアカミミガメの代表例であり他種への一律適用をしない。
  https://vcahospitals.com/know-your-pet/turtles-aquatic-housing

## 実測検証

- Python全体58件: 57通過、1ERROR。既存GA4 test_private_output_repo_and_resolved_pathsが環境の祖先.gitを検知し OUTPUT_INSIDE_GIT_REPOSITORY_REFUSED。今回GAコード無変更。安全ガードを弱めて通していない。
- Node: 寿命90 / 案内人21 / KID165 / 楽天20 PASS。
- サイズ関連Python18件PASS（既存シェルターテストを含む）。新規サイズ7、容器文言3。
- validate_species MISMATCH0/WARN0。enclosure_sync110一致/0矛盾（既存の正本なし警告2）、compare378/0/判定不能10。
- 変更HTMLのJSON-LD28ブロック解析OK。対象HTMLのGA ID/アフィリエイトURL列はbaseと一致。diff-check PASS。
- 独立レビューの通常サイズ帯5件、診断旧最大断定2件、FAQ @graph同期漏れを修正。一般成体値を最大へ丸めず、資料上限というラベルで示した。
- ローカルChromiumは起動時socket Operation not permittedで停止。許可付き再試行も同じ。画面の幅・折返し・画面操作は未評価。実機/PCで確認するまでは表示PASSとはしない。

## 結論の分類

- CLOSE NOW（候補実装済み）: 上記対象の数値の意味/同期/単位/出典是正。独立最終レビュー・実画面が公開前ゲート。
- BLOCKED: シェルター3型番の有効内寸は実測またはメーカー回答が必要。外寸を適合甲長へ変換しない。
- 調査結論: 平均寿命が未確立、分類群や流通名が広義/狭義で混在するものは、推測の数字を入れず資料の限界として明示。全121レコード全飼育値の確認済みではない。
- 分類依存11レコードのサイズは無理に統一していない。対象分類を明示できる資料が必要。調べていないことと区別する。
- DROP: 既にmergedのPR219/220/221を再実装しない。固定年齢の成長値撤去はPR219で完了済み。
