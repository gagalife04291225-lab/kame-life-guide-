# 陸ガメ用品条件・食性横断監査 2026-11-12

## 範囲
7種の条件案を同名JSONに保存。商品選定・価格・リンクを変更しない。119種全体や個別製品適合が完了したとは扱わない。JSONは未実装の提案。

## 食性の表示経路
shindan/index.html 3698行以降は coreSpecs を優先し、diet を「食性」と表示。旧specsより優先するためspecies.jsのcoreSpecs.diet修正が必要。種ページの食性欄は静的HTML。quick-facts.js/starter-kit.jsにdietの表示処理なし。

- red-footed-tortoise: species.js reason/specsは雑食、coreSpecs.dietは草食。master care.dietは「雑食（葉野菜中心＋果実＋動物質少量）」で一致していなかった。種ページ242行「雑食寄り草食」を「雑食（植物性・動物性）」へ変更。リード228行、285行、319行、351行は植物主体と雑食を併記しており、単独の草食分類ではない。FAQ154/469行・406行の給餌頻度は今回は変更していない（頻度の妥当性は未確認）。
- elongated-tortoise: species.js coreSpecs.dietは草食、specsは野草・野菜・果物少量。masterにはdietフィールドがない。種ページ268行食性欄、407行「雑食性に近い草食」、526行「草食を基本」の3箇所を雑食と食材の組合せに修正。今回触れた箇所はFAQではないためJSON-LD変更なし。
- compare/red-footed-vs-leopard.html: アカアシ雑食、ヒョウモン草食と区別できている。変更不要。
- guide-arid.html421行: 森林群の説明「草食メイン。アカアシなど…雑食寄り」は群一般化が残る。対象が広いため今回は未変更。
- HTML/JS/JSON全体で種名またはslugと草食が同一行に現れる箇所を抽出し、上記とチャコ説明（別種を草食と呼ぶ）を確認。動的・別行記述は個別ファイルを照合。全サイトの全給餌記述を検証済みとはしない。

## 根拠（本文取得済）
- RVC Mediterranean tortoise care 2024: ロシア、ヘルマン、ギリシャを対象。床面積・暖涼双方の隠れ家・水場・UVB・湿度の種差。https://www.rvc.ac.uk/Media/Default/Beaumont%20Sainsbury%20Animal%20Hospital/EXOTICS/Animal%20Care%20Factsheets/Mediterranean%20tortoise%20care%202024%20jh.pdf
- Hermanni Haven 飼育繁殖例: 幼体の保湿と成体の乾いた休息場所を区別。8x4ftは成体3頭の季節収容例で単独最小寸法ではない。https://www.hermannihaven.com/t-hermanni-care-sheet
- Tortoise Trust Elongata: 雑食、湿った床、水浴び容器、強光を避ける性質、大型飼育場。https://www.tortoisetrust.org/Downloads/Elongata.pdf
- RVC Red-foot care（旧2016資料）: 雑食と保湿/換気。床材・照明の古い個別方式は一律採用しない。https://www.rvc.ac.uk/Media/Default/small-animal/documents/Red-foot-tortoise-care-sheet%202016-1.pdf
- Tortoise Trust Sulcata: 大型の強固な囲いと屋内外の実飼育例。https://www.tortoisetrust.org/Downloads/Sulcata.pdf
- Tree of Life Exotic Pet Medical Center Sulcata: 幼体用設備と成体屋外囲い/加温小屋を区別。https://treeoflifeexotics.vet/education-resource-center/for-clients/tortoises/sulcata-tortoise-care
- Smithsonian: アルダブラの巨大な体格と動物園での屋外利用。https://nationalzoo.si.edu/animals/aldabra-tortoise
- Aldabra Giant Tortoises UK実例: 日陰、水場、加温小屋、成長に応じた出入り口。https://www.aldabragianttortoises.co.uk/should-i-get-a-tortoise/recommendations-of-things-to-include-in-your-tortoise-house-and-pen

## 商品仕様と条件
GEX9030 PT2611の91.5x46.5x33cmは本体寸法で内寸ではない。セットは本体・背景・ステー、灯具は別。取説はメッシュ上へライト直置き禁止、ステー固定、2か所使用時はステー追加。PRO9030は別型番で混同しない。
https://product.gex-fp.co.jp/exoterra/index.php?cid=395&id=938&m=ProductListDetail
https://product.gex-fp.co.jp/p_manuals/1948/GlassTerrarium.pdf?1762828041=

## 未確認
7種の全製品適合、実内寸、必要灯数、UVB距離、総袋数、総費用は未確定。数字を資料から一括移植しない。フチゾリ/各ギリシャ亜種/チャコ/ヒョウモン/ベル/インプレッサ等は今回未完。アカアシ条件をチェリーヘッドへ自動展開しない。
