# 共通ページの法令案内訂正（2026-11-13）

BASE: fde885bd1485ae74ce9527bb63f432e400c80008。HomeとPR #237の7種・Kinosternon11種の発効日は完了済み入力として再調査しない。今回の対象は種別ページとは別に残っていた共通ページの誤記。

## 対象と変更
- `compare/painted-vs-red-eared-slider.html`: 家庭飼育・無償譲渡を一律禁止／旧個体だけ届出付きで可とする記述を、meta/OG/Article/FAQ/本文/比較表/結論で訂正。一般家庭の飼育と頒布に当たらない無償譲渡・譲受けは手続き不要、売買・頒布・輸入・野外放出等は原則禁止を区別。ニシキガメを「規制なし」とする絶対表現も撤去し、国内販売時の現物確認・対面説明を明記。
- `before-keeping.html`: 「新たに購入・譲り受けることはできません」を同じ法規の説明へ訂正。
- 種別レコード、用品・価格・購入URL、GA4、デザイン、飼育数値は変更しない。
- `guides/beginner-top10-turtles.html` のクサガメIIIは推測でIIへ変更しない。種別公式担当の現行条約照合に委ね、今回は不変。

## 今回取得した公式根拠
- https://www.env.go.jp/nature/intro/2outline/regulation/jokentsuki.html : 一般家庭等の飼養、頒布でない少数相手への無償譲渡は許可不要。売買・頒布・輸入・放出等は原則として特定外来生物の規制が適用。無償でも多数への配分は頒布として規制される。2023-06-01指定。
- https://www.env.go.jp/nature/dobutsu/aigo/1_law/trader.html : 哺乳類・鳥類・爬虫類の販売時は事業所で現物確認と対面説明（一般購入者向け）。CITES非掲載を全法令規制なしとは扱わない。

## 確認範囲
`guides/*.html`, `compare/*.html`, `kids/*.html`, `trouble/*.html`, ルートHTMLのCITES/附属書/登録票/飼育禁止/対面/外来の抽出を読み、今回上記2ページの具体的矛盾を修正。すべての自治体条例や個体の取引適法性を判定する監査ではない。子ども向け野外移動・放流注意は変更不要。その他のCB可表現は「CB以外は違法」とは書かれていないため今回不変。

## 検証
専用4テストで家庭飼育/譲受けの条件、頒布の例外、FAQ可視/JSON-LD、description三層を検査。4テストPASS。修正前本文をメモリ上で差し替えると5 assertion FAIL・0 ERRORを確認。元からあるhref/src（公式出典の新規追加を除く）とJSON-LD以外のscriptは2ページとも完全一致。git diff --check PASS。共通HTMLは83ファイルを抽出確認、共通js/*.jsには今回キーワード該当なし。画面確認は親の統合検証に記録。未公開。


## Additional delegated species notes

- amazon-matamata.html: note and law FAQ/JSON-LD now agree on Appendix II. Removed unsupported blanket bans in all origin countries and unsupported market provenance claims. Current appendix source is the verified remaining-law-sources matrix; existing USFWS appendix reference retained.
- japanese-pond-turtle.html: removed blanket wild commercial export zero-quota claim. Replaced with the dated 2015 MOE export-advice conditions (wild under 8 cm eligible; at/over 8 cm ineligible; captive-bred eligible regardless of size); advice is not itself export permission. Domestic CB is a recommendation, not a blanket legal requirement.
- chinese-stripe-necked-turtle.html: wrong Red List URL replaced with MOE 2016 designation commencement source; added CITES III (China as listing party), explicitly separate from domestic invasive restrictions.
- Directly read on 2026-11-13: https://www.env.go.jp/press/101740.html and https://www.env.go.jp/press/103048.html. CITES category follows docs/qa/remaining-law-sources-20261113.md (full official 2026 appendix comparison), not a new repeat investigation.
- Added tools/test_species_law_notes.py: 3 focused regression tests. No care values, purchase/affiliate URLs, or measurement scripts intentionally changed. Parent handles integrated browser QA and release.
