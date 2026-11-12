# 七種の用品条件 — 2026-11-12

BASE: 0531ae034765e0c89bc0f9e1b4de43717ce46da4

## 範囲と変更
テラピン6亜種とヒメハコヨコクビに、商品とは別の確認条件を追加。6亜種固有の飼育値を検証したという意味ではない。陸場/UVB/保温/水深/淡水/汽水機器の条件を明示し、適合を商品価格帯だけで判断させない。用品の割当、商品ID、URL、価格、合計は不変。浮島Mのwhy一行のみ、根拠のない15cm適合を公式仕様へ訂正。

## 根拠（取得済み本文・独立レビュー）
- ADW: https://animaldiversity.org/accounts/Malaclemys_terrapin/ — 種全体の汽水域、飲用淡水、日光浴。
- VHS: https://www.virginiaherpetologicalsociety.com/reptiles/turtles/northern-diamond-back-terrapin/index.php — 北部亜種の雌雄差等。他5亜種独立資料ではない。
- CTTC: https://www.tortoise.org/archives/malaclem.html — 飼育者記録。陸場・照明・水管理。現代の全亜種共通塩分/UVB仕様ではない。
- AllAbout: https://allabout.co.jp/gm/gc/70686/ — ヒメハコの甲長程度の浅場、陸場、紫外線を含むバスキング。
- たな: https://pets.tana.cc/2014-01-20-pelusios-nanus/ — 3頭の飼育例。13〜15cmの個別水深を安全上限にはしない。
- GEX: https://product.gex-fp.co.jp/exoterra/index.php?cid=415&id=1005&m=ProductListDetail — FAQのM寸法29.8×17.8×5.4cm、適合水槽45〜60cm/ガラス5mm以下。『甲長3倍』の曖昧な記載から上限値を捏造しない。

## 検証
- 新テスト: 対象7種×native/all、他112種×2、計238 kit renders。参照専用への切替/他種への切替も消去。旧main描画で失敗することを確認。
- Python75（GA4環境依存テストは既知のtzdata欠如で対象外）、KID269、案内人25、寿命90、楽天20、用品119種/213カードPASS。
- Chrome: 対象7種×native/all×320/390/1280px=42表示、横はみ出し0、JSエラー0。ヒメハコ出典details開閉PASS。スマホ実機・読み上げ実機は未検証。
- 独立技術レビュー: reference_only遷移の残存リスクを修正し再レビューBLOCKER0。
- 独立内容レビュー: ヒメハコのUVB/保温を明示。固定水深や塩分の安全保証なし。

## 限界
全119種/142商品の飼育適合は未完。既存resolverを一律変えない。現在の基本スペックの塩分値、複数の費用表示の異なる前提は今回の条件表示により検証済みにはならない。6亜種共通の具体的器具/塩分値を追加するには対応する出典が必要。
公開のmerge SHA/Pages結果/本番UI実測はPRコメントへ記録する。
