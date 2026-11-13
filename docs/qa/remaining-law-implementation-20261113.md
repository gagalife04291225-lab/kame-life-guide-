
## REMAINING_LAW_20261113 — 全121件の現行CITES区分と読者向け法規説明

- BASE: `fde885bd1485ae74ce9527bb63f432e400c80008`。作業branch: `codex-remaining-law-20261113`。PR #240（https://github.com/gagalife04291225-lab/kame-life-guide-/pull/240）。実装・検証済み、未merge/本番未確認。
- 全121件の現行CITES区分を公式統合附属書に照合。既済Home/7種/ドロガメ日付は固定入力とし再調査していない。根拠表: `docs/qa/remaining-law-sources-20261113.md`。
- 4 nullを確定（ハナガメIII、コウホソ/ジーベンロック/ヒラリー非掲載）。archive4種Iのverificationを確定。ニホンイシガメの一律ゼロ輸出枠を撤去。ハナガメJS/MD同期。選択除外/順位/用品は不変。
- オリノコマタマタの旧非掲載本文・FAQをIIへ訂正。アカミミ共通2ページの家庭飼育・限定無償譲渡例外を整合。II共通注記47ファイル（template含む）と関連FAQで国内CB証明・インボイス・CITES輸出入書類の混同を訂正。モエギ登録票発行元、台湾セマルの捕獲規制と許可例外も訂正。
- 独立レビュー: FAQ215回答と可視本文一致、商品URL/通常scripts(GA含む)不変、現121区分と正本一致、残るblocker0。
- 検証: Python111件中109PASS、GA4の2件はPCにtzdata無しの環境エラー。追加法規13件PASS。validate_species MISMATCH0/WARN0。annainin25、rakuten20、既存Home/7種法規NodeテストPASS。enclosure110/0、compare378/0/判定不能10（Windows globのパス区切りを実行時のみ正規化）。diff check PASS。
- 実画面はBLOCKED: 既存Playwright無し。ブラウザのローカルfile表示はポリシー拒否、明示された迂回禁止を遵守。公開前/本番の画面確認済みとはしない。デザイン/CSS/購入先/GAコード変更なし。
- CLOSED: B6カントンクサガメ現行IIは公式S1で確認、IIIへ戻さない。歴史的な全掲載日/自治体条例/個別個体の取引適法性まで確認済みとはしない。
- NEXT: 本差分のPRレビューと許可範囲確認後にmergeし、配信内容を検証。全121区分の再調査・既済用品32種の再実行は不要。

Official procedure source: https://www.meti.go.jp/policy/external_economy/trade_control/02_exandim/06_washington/cites_im.html
Taiwan/Yaeyama clarification: https://www.env.go.jp/nature/intro/2outline/iaslist/gairailist/byseitailist4/shiryou3-2.pdf


### 追加検証 2026-11-13

cloudの既存Pythonで同一PR HEADの全111テストPASS。PCのtzdata不足で失敗していた2件も成功。Git管理外の独立一時検証環境で実行し、コード・保護・テストは不変。実画面は引き続き未確認。

Browser Use 拒否原文（file:// の代表ページ表示時。再操作なし）:

> Browser Use rejected this action due to browser security policy. Reason: The browser URL policy blocks this action. Browser use could not acquire authority to trigger network egress. The URL policy gate did not grant access. The requested URL protocol is not allowed. Allowed protocols: "http:", "https:". The agent must not attempt to achieve the same outcome via workaround, indirect execution, raw CDP or browser commands, alternate browser surfaces, or policy circumvention. Proceed only with a materially safer alternative that does not require this blocked browser action; if none exists, stop and request user input.
