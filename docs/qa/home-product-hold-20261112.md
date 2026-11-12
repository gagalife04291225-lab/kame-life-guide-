# Home用品の条件説明（旧除外案は撤回）

## 2026-11-12 PR #233 修正版：Homeの用品を残して条件を説明
- BASE main 6b1ac588c776d3c75ee77d7bc6d15d3bb03a9cf4。Ownerが候補除外を拒否し再調査を指示。除外機構は撤回、商品・URL・価格・選定キーを保持。
- GEXデザートベースは湿潤使用への言及があり、名前を理由に不適合としない。メーカー使用厚とHome飼育実例の深さを区別、袋単位の価格と必要量、水場、保温、UVBの設置条件を種ページと診断両経路に説明。
- Homeの温度はTortoise Trust24〜27℃とTFTSG気温27〜32℃を出典別に示し、夏の高温安全・24/25℃危険境界・バスキング32〜38℃の根拠なし断定を訂正。FAQ/JSON-LD一致。キノコの動物性扱いも訂正。
- Homeだけ早見表の乾燥系分類・完成セット表現を修正。商品価格/選定/計測は保持。
- 前候補の水棲5種条件を保持（豪ナガクビ/ジーベン/アフリカヌマ/ヒラリー/マコード）。外部条件整理16種、残103種は構造棚卸しのみ、全商品の適合確認ではない。
- 検証：714通りの商品不変・Home実mount GA不変・FAQ一致、Python75、16種条件/238renders、119種213cards PASS。Home3経路×3幅×3価格帯=27操作・注記展開9表示で横溢れ0/JS0。独立技術/内容レビュー指摘反映。
- 公開状況：PR233を修正版へ更新。merge・本番確認は未実施。旧除外案を公開しない。
- 既知範囲：入口による候補差は保持し説明。製品のHome固有長期実績や必要袋数を保証しない。実機読み上げ未確認。QA記録 docs/qa/home-product-hold-20261112.md。

## 出典と限界
- GEX公式 https://product.gex-fp.co.jp/exoterra/index.php?cid=417&id=2184&m=ProductListDetail : 天然土・通水通気・湿潤時色変化・3〜5cm一般目安。Homeの種固有推薦ではない。
- https://herpetoculturenetwork.com/homeana-at-home-care-and-breeding-of-kinixys-homeana/ : Tyler Brooksの段階別床材/水場実例。商品適合保証ではない。
- https://www.tortoisetrust.org/Downloads/Kinixys.pdf : 暖かい湿潤森林床・24〜27℃。ベルの乾燥耐性と区別。
- https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_070_homeana_v1_2013.pdf : 気温27〜32℃・湿ったケージ・水場、食性。上記と数値を合成しない。
- https://www.tortoisetrust.com/post/out-of-africa-18-months-of-observations-on-the-captive-care-of-rescued-kinixys-homeana-hingebacks : 古い観察記録の再掲。バーク/ココ/水苔/落葉の実例のみ参照、赤色光やサーモなし加温を転記しない。
- https://archive.britishcheloniagroup.org.uk/testudo/v3/v3n3homes : 樹皮床材繁殖例。GEX製品と同一扱いしない。
- https://pitateki.com/faq.html : 底面補助/サーモ非推奨など既存確認事項。

## 不変の費用
種ページ/all：10件、12900–29800 / 30000–62000 / 46700–99500円（水入れ価格不明1件除く）。
land：9件、12700–29300 / 35500–69000 / 43400–93000円。
商品の袋数や別途設備を含む完成費用ではない。既存リンクは保持。

## 再利用した5種条件の資料
Inner South動物病院、Reptile One、Tree of Life動物病院（Africa/Hilaire）、terrarium.com.plのMcCord動物園飼育紹介。前候補で独立レビュー・30表示検証済み。根拠のない製品追加なし。
