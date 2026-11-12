# 他種の法令表示訂正

BASE: 17c981ae55867343f43eeab478f600ff11acd934。Ownerの「そうだね他も調べて」「進めて」「止めるなよ」と法令訂正・公開了承に基づく。

## Scope
7種の法令表示（アラバマチズ、ヨーロッパヌマ、トゲスッポン、パンケーキ、スライダー3亜種）。正本・識別・診断・種ページを整合。価格・商品リンク・GA4・飼育数値・診断score/match・通常候補の除外方針は不変。既存の推薦対象外4種の直接URLはHomeと同じ参考表示にして適合率を出さない。用品とページは保持。種の飼育一律禁止とは説明しない。

## 確認した公式根拠
- https://zoek.officielebekendmakingen.nl/trb-2026-100.html : 2026年9月公刊CITES附属書。pulchra II、Emys IIIはウクライナ個体群、Apalone IIのatra I例外。Emydidae全行および全文でTrachemys非掲載を確認。
- https://www.legislation.gov.au/F2023L00133/asmade/2023-02-22/text/original/pdf : pulchraとApalone II移行2023-02-23。
- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021R2280 : 前文8、Emysウクライナ個体群2021-06-22。EUのA/B/CとCITES I/II/IIIを混同しない。
- https://www.env.go.jp/content/000395814.pdf : 別表第二、パンケーキ2019-11-26国内適用、atraの国内指定。国内適用日を条約初掲載日と扱わない。
- https://www.jwrc.or.jp/service/cites/regist/gaiyo.htm と https://www.jwrc.or.jp/service/cites/regist/yuzuriuke.htm : 登録票・譲受30日以内の届出。国内CB/インボイスは登録票の代替ではない。
- https://www.env.go.jp/nature/intro/2outline/regulation/jokentsuki.html と https://www.env.go.jp/nature/intro/2outline/regulation/kisei.html : 家庭飼育/捕獲/頒布に当たらない無償譲渡譲受けと販売購入等の原則禁止を区別。

## 再作業しなかった項目
前監査のKinosternon11種の発効日指摘は、最新mainでは正本/全11種本文とも2023年11月へ訂正済み。重複修正しない。Home PR236も完了済み。

## 検証
専用Nodeテストで119種の非法令データ/関数保持、7種ページのJSON-LD parse/商品計測リンク保持。Python96 PASS。Home実calcResult20 PASS、次種条件119種/実表示ロジックPASS。案内人25、KID269、楽天20、asset versions PASS。既存の全面snapshot検査は今回7種の法令フィールドだけ例外化し専用テストで保護。
独立レビューの共通CB文章・atra国内説明・資料主体・表列数を修正しBLOCKER0。Chrome28表示（7種ページ/診断、390/1280）overflow0・捕捉console error0、用品保持。赤耳の旧alertを実画面で発見し修正、両幅で再確認。

追加4種×2幅=8表示で参考ラベル/タイトル・score非表示・用品保持・overflow0/console0を確認。共有は外部送信せず分岐を確認。

## 限界
本番公開確認はmerge後のPRコメントへ実測記録。スマホ実機/VoiceOver/TalkBackは未確認。CITES本部403は公式政府の条約全文で代替。atraの条約初掲載日を新たな確定値として追加していない。これは上記7種と関連導線の是正であり、サイト全種・全法令文の全面確認を完了した意味ではない。
