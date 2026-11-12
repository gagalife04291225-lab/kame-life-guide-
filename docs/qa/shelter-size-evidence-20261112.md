# シェルター記事のサイズ根拠・限定修正（2026-11-12）

更新: Ownerの送信・merge承認を受け公開工程へ移行。以下の数値は初回ローカル検証の実測。最新main統合後の結果は追記する。

## 状態と範囲

- **ローカル実装・検証完了**。初回検証時は外部送信なし。その後Ownerが送信・mergeを承認。本番反映はmerge後に別途確認する。
- 作業開始時のmain: `0bc29360579461b90c3ddaf095a083671d8ded54`（`git ls-remote`で実測）。
- ブランチ: `codex/shelter-size-evidence-20261112`。
- 既存候補とは別cloneで作成。元候補をcheckout・編集・commitせず保存した。
- 変更対象: `shelter-best10.html`、専用テスト、AI-HANDOFF、AI_CHANGELOG、本記録。サイト側は1 HTMLだけ。
- 本件は3商品の適合断定の修正であり、全商品・全119種の根拠確認ではない。

## 根拠と変更

1. [Yasukawa & Ota (2010), TFTSG account 047](https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_047_spengleri_v1_2010.pdf): p.047.3に成体甲長67.4–107.1mm、p.047.4に “Carapace length does not differ significantly between the sexes.”。成体の記録範囲を丸めた「おおむね7〜11cm」と、約10.7cmまでという当該資料の記録を区別した。最大世界記録や絶対的な上限とはしていない。
2. [Naturalis, Turtles of the World](https://turtles.linnaeus.naturalis.nl/linnaeus_ng/app/views/species/taxon.php?id=8063): 甲長13cmまでという図鑑記載を残した。資料間の数字の違いを隠していない。
3. `guides/small-best-turtles.html` の比較表・種カード・可視FAQ・FAQPage JSON-LDと照合。比較記事は変更なし。シェルター記事にある3箇所の旧サイズ記述と「メスはさらに大きい」を撤去し、出典のある導入段落へ整理した。
4. ロックシェルターSP XXL（RX-197 / B07F49T8N2）、GEXレプタイルケイブS（PT2851 / B004KUYSH2）、同M（PT2852 / B00E0GM8JG）の適合保証と8/10/12/13cmの境界を撤去。「内寸・入口要確認」とし、今の個体の甲長・甲幅・甲高との照合と成長時の見直しを案内した。
5. 商品の本体寸法は既存値をそのまま保持。入口の幅・高さ、内部で使える奥行・幅・高さは3商品とも本記事では未確認。`docs/fixed-facts/`、`data/products.js`、`research/products-master.sample.json`の関係記録を確認したが、この実寸を裏付ける記録は見つからなかった。外寸から有効内寸や対応甲長を逆算していない。
6. 導入・lead・まとめ・footerとdescription/OG/Article descriptionを同じ選び方へ修正。本文レビューでは原典との整合・未確認範囲・3商品の限定変更にBLOCKERなし。

## 検証の実測

- `python -W ignore::ResourceWarning -m unittest discover -s tools -p 'test_*.py' -v`: **36/36 PASS**、うち新規 `test_shelter_size_guidance.py` **7/7 PASS**。
- 初回の全体実行では既存GA4の2件がWindowsのtzdata不足でERROR。既存のローカルtzdata配置先を `PYTHONPATH` に指定し、コードを変更せず全36件を再実行してPASS。新しい依存のダウンロードはしていない。
- 新規7件に旧mainのシェルターHTMLを読ませると、4テストメソッド/6 assertionでFAIL、実行時ERROR 0。種の説明・導入・metadata・3商品に対する回帰を検出した。
- JSON-LD: シェルターArticle/BreadcrumbListの解析OK。description3面一致。比較記事の可視FAQ9件とFAQPage9件が一致。シェルター記事にFAQPageはない。
- 既存リンクの削除0。追加は上記出典2本のみ。ローカルリンク/リソース16件の存在確認、切れ0。
- mainとの不変比較: 商品名、順位13件、ASIN14件、非schemaの全script、全style、比較記事、今回変更しない商品10件のブロックが一致。B案のファイルに差分なし。
- `git diff --check`: PASS。

## ブラウザ表示

- Chrome/157.0.8103.51 の独立headless profileでローカルHTTPのみ表示。既存のサインイン済みブラウザは操作していない。
- viewport 375×1000 と1280×1000。Windowsスクロールバー分を除いた `clientWidth/scrollWidth` はそれぞれ360/360、1265/1265。横はみ出し要素0、JS例外0、壊れた画像0。
- 14本のAmazonボタンが元のASINと `kamelife090e-22` 付きURLになることをDOMで確認。リンク先へ遷移していない。
- 導入、資料注記、XXL、S、M、まとめを各幅で撮影した**12枚を実際に目視**し、変更した文言・バッジ・リンクに欠け/重なり/横切れがないことを確認。
- 画面と測定結果はローカルQAフォルダーに保存: `375-{intro,source,xxl,s,m,closing}.png`、`1280-{intro,source,xxl,s,m,closing}.png`、`browser-results.json`、`invariants.json`、再現用 `browser_qa.py`。
- **制限**: 外向きページ要求を遮断し、GA4とGoogle Fontsを読み込んでいない。字体はローカルfallback。公開URLでの表示、外部フォント利用時の折り返し、実機スクリーンリーダー、全ページのWCAG AA適合、実商品の適合は未評価。既存CSSは不変。最後のローカルサーバー終了時に接続切断ログが出たが、保存済みの測定とスクリーンショットは完了しておりブラウザ例外は0。

## 終了区分

- **CLOSED（ローカル）**: スペングラーの根拠修正と3商品の適合断定撤去、関連表示の照合、回帰テスト、ローカル画面確認。
- **公開工程**: Owner承認済み。PR・merge・本番確認の結果は実施後に記録する。
- **未確認**: 3商品の入口幅/高さと内部奥行/幅/高さ。数値の適合を追加する場合に限り、型番を特定したメーカー資料または実測が必要。
- **対象外**: 他商品の適合・湿度・既存体験談・価格/在庫・全面監査。今回の結果を根拠確認済みとは扱わない。
- **DO NOT REPEAT**: B案や既存2候補の再実装、同じ生物学的出典の全面再監査、既存の非対象商品を根拠なく数値修正すること。
