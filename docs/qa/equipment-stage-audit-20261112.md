# 全種用品適合・段階2 — 2026-11-12

BASE: 4baf1b8770c810c0b6f5f2a487dfbbdd14d868c1

## 調査範囲
119種の既存データ/商品割当の構造照合。外部本文と表示条件の照合は既存7種＋今回4種の11種であり、全商品適合を保証しない。残108種は既存資料の棚卸し。coverage JSONは監査キューで、機械的な不適合判定やHTML生成元ではない。

## 今回CLOSED
- Home: TFTSG2013 p070.8 Captive Husbandryは湿り気と十分な水場。乾燥系を標準扱いしない条件表示。https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_070_homeana_v1_2013.pdf
- マタマタ2種: Cunhaほか2021の著者公開全文p110、底歩き・浅場と呼吸。生態を踏まえた用品確認で、固定安全水深や機器適合保証ではない。https://www.researchgate.net/publication/352260587_Distribution_of_Chelus_fimbriata_and_Chelus_orinocensis_Testudines_Chelidae
- スッポンモドキ: TFTSG2008 p009.14の広い水槽/水中の隠れ場所/同居個体への攻撃。120cmなら終生可とはしない。https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_009_insculpta_v1_2008.pdf
- 費用: CTAはbudgetの5カテゴリだけ集計して初期費用と表示していた。standard全候補合計のcostboxと範囲が異なるのでCTA独自集計を撤去し一覧参照へ。costboxは『標準価格帯の候補合計／飼育開始の総額ではない』。初月1〜3万円の根拠不明な損失訴求も削除。
- 商品ID/価格/URL/選定は変更なし。GAイベント名・キーは保持、has_teaser=false、init_cost/monthly_cost空文字（削除した予告に合わせる）。

## DROP（今回行わない一括修正）
- 46種の通常/all差を単純に片方へ合わせる。特殊のスッポン系をsemiへ移すと砂底がなくなる例がある。
- ニシキハコ2種を『乾燥種だから保湿用品不可』とする。TFTSG2024概要本文では潜れる柔らかい床材を重視。湿度不要の根拠はない。https://iucn-tftsg.org/cbftt/species-accounts/terrapene-ornata-126/ 。全文13MB超取得不可、飼育節は検索経由のみ。固定湿度値未確定。

## 継続調査の優先順位と再開入力
1. 残る特殊種の陸場/UVB/砂底: ナガクビ4種、ヨコクビ類、スッポン5種など。種概説と飼育資料本文を取得して条件と用品を別々に評価する。空欄を不要としない。
2. 成体大型: 陸系7種は120cm規格超/専用場前提、水棲大型も池規模。内寸/奥行き/体重/個体の段階が未構造化のため型番の数字だけで商品を排除しない。メーカー取説と生物側寸法根拠が必要。
3. 浅水種の水中ヒーター最低水位/ろ過器吸排水: 実水位と各機器取説を照合。大型=不適合と短絡しない。
4. 浮島Mのメーカー適合45〜60cmと共通候補90/120cm、ガラス厚/支持/面積の相性は未確認。PR231の説明訂正を組合せ適合済みとしない。
5. Homeのall/ページdry_smallの経路差は条件表示で明示したが、全製品の置換は未実施。湿度/水場だけで照明/餌まで一括変更しない。
6. 種ページの独自月額等と共通表の根拠は未照合。今回撤去した診断CTAの二重表示と区別する。

## 正確性の訂正
一般マタマタはaquatic通常semi_aquatic_medium、オリノコはexotic通常fully_aquatic。調査初報の『両方fully』は誤りで、コード台帳と最終検証は実定義を使った。

## 検証
- 新テストは11種×native/all、他108種×2、全238 kit renders、refOnly/他種遷移の消去。費用イベント実ブロックをVM実行し送出を確認。
- Python75、KID269、案内人25、寿命90、楽天20、診断119種/213カードPASS。GA4 Pythonは既知tzdata欠如で対象外。
- Chrome追加4種×通常/all×320/390/1280=24表示、横溢れ0・JSエラー0、出典details開閉、候補合計/旧小計なしを確認。初回UI試験はマタマタを誤ってexotic指定して不成立、正しいaquaticに訂正して全24件再実施。
- 独立技術レビューで費用変数残存を検出→修正→実イベント回帰追加→再レビューBLOCKER0。Homeと水棲3種の根拠を別々に独立確認済み。
- 実機スマホ/スクリーンリーダーは未確認。merge/Pages/本番はPRコメントで記録する。
