# 種別の選定保留・追加5種 — 2026-11-12

BASE: 6b1ac588c776d3c75ee77d7bc6d15d3bb03a9cf4

## Homeの特定商品1件だけ保留
- 生成済み候補からHome slug × substrate_grassland_mixだけ除く。除外後の他tier fallbackはしない。Home種ページmountと診断spV2へslugを伝達。
- 対象: Home種ページ/診断allのstandard。10点/30,000〜62,000→9点/28,500〜58,500円。床材代を含まず別途選定が必要と表示。価格未掲載1点（水入れ）は別途維持。
- 低価格帯/高価格帯、通常land→forest、他118種は不変。EQUIPMENT_MAP/商品定義/URL/価格データは変えない。除外カードのAmazon/楽天URLは対象表示から消える。
- 価格帯に未選定カテゴリがある場合は節約額比較を止める。購入チェック完了は『表示中の商品』であって全必要設備がそろった意味にはしない。
- 商品使用不可の断定ではない。メーカーは乾燥環境向けに加え湿らせる使い方と砂漠〜亜熱帯を記載する。Homeの標準候補としての裏付け不足により編集上の選定保留。
- メーカー本文取得: https://product.gex-fp.co.jp/exoterra/index.php?cid=417&id=2184&m=ProductListDetail
- 生物側は既取得TFTSG Home2013 p070.8の湿り気・水場。再調査せず引継ぎ。

## 新5種の出典付き条件
- オーストラリアナガクビ: https://innersouthvets.com.au/wp-content/uploads/2018/05/Caring-for-your-turtle2.pdf — 病院配布資料、台/UVB/保温。古い距離・交換周期を転載しない。個人著者署名未確認なので『獣医師が執筆』とはしない。
- ジーベンロック（現サイトC.rugosa）: https://reptileone.com.au/care-sheets/Northern-Long-Neck-Turtle.pdf — メーカー飼育案内の乾ける台/UVB。
- アフリカヌマヨコクビ: https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/african-side-necked-turtle-care — 複数属の共通案内。固定水深/UVB割合を本種独自値にしない。
- ヒラリー: https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/hilaire-s-side-neck-turtle-care と https://sedici.unlp.edu.ar/bitstream/handle/10915/109403/Documento_completo.pdf-PDFA.pdf?isAllowed=y&sequence=1 — 病院飼育案内と2017査読論文の野外甲羅干しを区別。
- マッコード: https://www.terrarium.com.pl/chelodina-mccordi-zolw-wezoszyi-mccorda/ — Wrocław動物園での4成体の飼育を紹介した一人称記事。正式な著者所属は確認できず、動物園公式基準としない。枝/陸場/UVB/保温の飼育例。
- 各条件は機器適合/ワット数の保証ではない。コウホソはDWERの野外生態資料のみで設備根拠不足、今回追加しない。

## 検証
- 119種×通常/all×3tier=714構成。Home/all/standardだけ1商品減、他種/slugなし/不明slug不変、代替なし。Home種ページのslug渡しも検査。
- 独立test-home-hold-mount-events.mjs: mount実行、Home dry/forestと他種への再mount、表示の値とbundle_view・3クリックイベント一致。gtagはVM内だけ、ネット送信なし。
- 完全価格の合成ケースで通常なら節約表示あり、保留時だけ抑止を確認。
- 条件テスト16種×2＋他103種×2、計238描画。
- Chrome新5種×通常/all×3幅=30表示、Home診断all/種ページ×3幅=6表示。横溢れ0、JS error0。Home合計28,500〜58,500・9点・保留URL0。低/高の床材は保持。
- Python75、KID269、寿命90、案内人25、楽天20、既存診断119種/213カードPASS。実機スマホ/読み上げ未検証。

## 状態
公開前に個別商品の除外と小計変化をOwner側へ報告済み。公開承認前にmergeしない。全119種の適合保証は未完、外部条件照合16種と構造棚卸し103種を区別する。残種の機器/水位/成体空間検証はcoverageの優先キューに従う。
