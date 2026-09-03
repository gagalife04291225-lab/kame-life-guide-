# AI_CHANGELOG

> AI協働による変更の意思決定トレーサビリティ記録（append-only）。
> Development Constitution v2.0 §9.3 に基づく。1エントリ = Merge済み変更1件。改ざん禁止・追記のみ。
> 各エントリは Date / Actor / Change / Reason / PR・Commit / Approver / Conforms を含む。

---

## [2026-07-16] Development Constitution v2.0 導入（Migration Phase 1 / U1）

- **Actor:** Claude Code（実装） / TeTe（承認）
- **Change:** `DEVELOPMENT_CONSTITUTION.md`（v2.0, Status: DRAFT）と本 `AI_CHANGELOG.md` を新規追加。
- **Reason:** 散在する開発ルール（CLAUDE.md / SHINDAN-SPEC.md / docs）を単一の最上位規範へ一元化するため。Operational Readiness Audit / Migration Execution Plan の Phase 1 として、サイトに影響しない新規文書追加から着手。
- **PR/Commit:** branch `claude/readme-test-line-9tbkht`（本コミット）
- **Approver:** TeTe（"go" 指示）
- **Conforms:** Constitution v2.0
- **備考:** F1（デプロイ経路）・F2（正規URL）は【CONFIRM_REQUIRED】として保留。批准（Status: ACTIVE 化）と既存文書の書換え（Phase 2 以降）は F1/F2 確定後に実施する。

---

## [2026-07-16] F2（正規URL）正式批准（Migration P2c）

- **Actor:** Claude Code（実装） / TeTe（承認）
- **Change:** `DEVELOPMENT_CONSTITUTION.md` §7.4 の【CONFIRM_REQUIRED: F2】を解除し、canonical = `https://kamelifeguide.com/`（apex / non-www / HTTPS）を確定記載。Status を F2=CONFIRMED へ更新。
- **Reason:** F2監査（読み取り専用）で、canonical 165件・sitemap 158URL・robots・CNAME・内部リンクが全て `https://kamelifeguide.com`（apex/non-www/https）で統一され、http/www/github.io 混在ゼロ、❌修正必須ゼロを確認したため。
- **PR/Commit:** branch `claude/readme-test-line-9tbkht`（本コミット）
- **Approver:** TeTe（P2c 指示）
- **Conforms:** Constitution v2.0
- **備考:** GitHub Pages「Enforce HTTPS」設定と www→apex ライブ挙動はリポジトリ外の残確認（§7.4-R3）。canonical 確定値には影響しない。

---

## [2026-08-26] 記録欠落の補完 — Merge 済み PR 47件（#13〜#62）を遡って追記

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** `AI_CHANGELOG.md` に、これまで未記録だった Merge 済み PR 47件（#13〜#62）を1エントリ1件で追記。既存2エントリ（2026-07-16）は改変していない。
- **Reason:** §9.3-R1「Merge 済み変更 1 件につき 1 エントリを追記 MUST」に対し、本ファイルの記録が 2026-07-16 で停止しており、以後の Merge 済み PR が1件も記録されていなかったため。各エントリの Change / Reason は Git 履歴（merge commit・PR ブランチのコミット本文・変更統計）から機械抽出した事実のみで構成し、推測で補っていない。
- **PR/Commit:** PR #63 / branch `claude/gemma-github-fj689h`
- **Approver:** 亀好きさん（N1 実行指示）
- **Conforms:** Constitution v2.0 §9.3
- **備考:** Automation（rakuten 価格更新）31件と直 push 5件は main への直接反映であり「Merge 済み変更」に当たらないため本補完の対象外とした。欠番 #14 / #16 / #35 は main にMerge されていない。

---

## [2026-08-13] PR #13 — キッズページ「カメふしぎ島」公開とトップ導線の追加

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** キッズページ「カメふしぎ島」公開とトップ導線の追加（8 files changed, 1197 insertions(+), 5 deletions(-)）
- **Reason:** カメに興味を持った小学生本人が読めるページを新設するため。全漢字にふりがな（ruby）を付け、生態・飼う前の約束・やってはいけないこと・クイズ・大人向けページへの導線を置き、トップにも Kids 導線を追加した。
- **PR/Commit:** PR #13 / merge `d7523be`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-14] PR #15 — カメふしぎ島（8ページ）＋「おうちの方へ」＋トップ導線・sitemap

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** カメふしぎ島（8ページ）＋「おうちの方へ」＋トップ導線・sitemap（30 files changed, 2427 insertions(+), 5 deletions(-)）
- **Reason:** PR #13 の revert で外れていたトップページの Kids 導線を、承認済みの 内容そのままで復旧する。デザイン・文言・画像は変更していない。
- **PR/Commit:** PR #15 / merge `3a03e49`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #17 — 診断ツール: 種データの重複・CITES区分の是正と架空種「Cuora ornata」の整理

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 診断ツール: 種データの重複・CITES区分の是正と架空種「Cuora ornata」の整理（9 files changed, 62 insertions(+), 338 deletions(-)）
- **Reason:** 昨日整備済みの北米ハコガメ体系（キタニシキハコガメ Terrapene ornata ornata / ニシキハコガメ（オルナータ） T. o. luteola）が正。実在しない学名 Cuora ornata に 基づく架空エントリを以下の通り整理:
- **PR/Commit:** PR #17 / merge `c85505e`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #18 — SEO: noindexスタブ hime-nioi-turtle.html を sitemap から削除

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** SEO: noindexスタブ hime-nioi-turtle.html を sitemap から削除（1 file changed, 4 deletions(-)）
- **Reason:** noindex 指定のリダイレクトスタブは sitemap 収録対象外のため除去（176 URL に）。
- **PR/Commit:** PR #18 / merge `8a1ea66`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #19 — 種ページ品質基盤の統合（97ページ日本向けセクション・FACT-CHECK基盤・誤情報修正）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 種ページ品質基盤の統合（97ページ日本向けセクション・FACT-CHECK基盤・誤情報修正）（114 files changed, 13538 insertions(+), 237 deletions(-)）
- **Reason:** 長期作業ブランチ（claude/ai-tiktok-oss-architecture-u6xkun）のサイト関連作業のみを main へ移植した統合コミット。別プロジェクト（AI TikTok Company）のファイルは含まない。 main 側の先行修正（PR #17/#18: ornata整理・フトマユ重複統合・パンケーキ診断除外・
- **PR/Commit:** PR #19 / merge `755e036`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #20 — TRUST-1: 診断Readiness Gate（飼わない判断）・売らない領域・信頼表示の導入

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** TRUST-1: 診断Readiness Gate（飼わない判断）・売らない領域・信頼表示の導入（16 files changed, 585 insertions(+), 10 deletions(-)）
- **Reason:** 最終監査で点数方式（risk合計・閾値4）の欠陥を確認したため修正: - 「住まい未確認（障害未確定）＋預け先なし＋予算〜1万」でCが出ていた - 予算回答（種絞り込み用の設問）がC/B境界の決定打になり得た - 重み0/1/2と閾値4に測定的根拠がなかった
- **PR/Commit:** PR #20 / merge `892c145`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #21 — REPO-CLEANUP-1: 検証済み不要ファイル333件の削除（113.8MB減）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** REPO-CLEANUP-1: 検証済み不要ファイル333件の削除（113.8MB減）（333 files changed, 372 deletions(-)）
- **Reason:** REPO-CLEANUP-1（2026-08-18 全数監査に基づく検証済み削除・333ファイル / 113.8MB）: - _incoming/ の受け入れ画像189件（完成品は assets/species-photos に配置済み・CSV 3枚は残置） - _incoming_redo.zip / _incoming_slim.zip（展開済みの中間アップロードzip）
- **PR/Commit:** PR #21 / merge `2f6da84`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-18] PR #22 — 飼育環境イメージ図10枚＋用品導線（設置商品・GA4クリック計測）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 飼育環境イメージ図10枚＋用品導線（設置商品・GA4クリック計測）（32 files changed, 646 insertions(+), 19 deletions(-)）
- **Reason:** 飼育環境の型を図で示すため、AI生成の環境イメージ図10枚をハビタットガイド8本と種ページ11件の計19箇所へ配置した。実写生体写真はすべて維持し、画像内の機材を特定商品として扱わないよう商品紹介とは完全に分離している。
- **PR/Commit:** PR #22 / merge `ad6462d`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-19] PR #23 — 8ハビタットガイドのFACT-CHECK修正＋イシガメ識別情報のサイト内統一

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 8ハビタットガイドのFACT-CHECK修正＋イシガメ識別情報のサイト内統一（9 files changed, 29 insertions(+), 28 deletions(-)）
- **Reason:** 8ハビタットガイドの本文を一次資料・公的機関・専門情報源で FACT-CHECK した結果、イシガメ／クサガメの見分け表でキールと腹甲が逆転しているなどの誤りが見つかったため訂正した（広島大学デジタル博物館準拠）。断定的すぎる水温記述も条件付き表現へ改めた。
- **PR/Commit:** PR #23 / merge `8d2e4da`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #24 — 亜種3ページ・実写写真2枚・写真取得ワークフロー

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 亜種3ページ・実写写真2枚・写真取得ワークフロー（13 files changed, 1658 insertions(+), 5 deletions(-)）
- **Reason:** 種ページの実写写真を、出典から取得→検証→実装→PR まで自動化する GitHub Actions を追加。作業環境から iNaturalist / Wikimedia Commons へ 到達できない場合でも、Actions ランナー経由で完結できる。
- **PR/Commit:** PR #24 / merge `2294bc0`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #25 — 写真取得ワークフローの修正（node_modules混入・潜在バグ・Commons学名ゲート）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 写真取得ワークフローの修正（node_modules混入・潜在バグ・Commons学名ゲート）（3 files changed, 96 insertions(+), 12 deletions(-)）
- **Reason:** Commons の説明文に期待学名が「言及」されているだけで同定一致と判定され、 別亜種の写真がそのままページに入る状態だった。iNaturalist 側で species_guess を排除したのと同じ穴が Commons 側に残っていた。
- **PR/Commit:** PR #25 / merge `4ab3da9`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #26 — 写真差し替え時のクレジット更新と出典の使い回し検知（C-1・C-2）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 写真差し替え時のクレジット更新と出典の使い回し検知（C-1・C-2）（1 file changed, 87 insertions(+), 9 deletions(-)）
- **Reason:** 全96枚の実データ照合で、同じ観察を複数の種ページに貼った例が15グループ、 写真の実際の分類群がページと異なる例が20件見つかった。どちらも、この スクリプトに次の2つの穴があったことが原因。
- **PR/Commit:** PR #26 / merge `b3d687d`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #27 — 写真候補を探す読み取り専用モード（taxon_id 解決方式）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 写真候補を探す読み取り専用モード（taxon_id 解決方式）（2 files changed, 245 insertions(+), 10 deletions(-)）
- **Reason:** 学名をそのまま観察検索の taxon_name に渡すと、iNaturalist が属レベルまで 拾って別種が混ざる。実測では Geoemyda spengleri の検索で11件が返り、 その全部が Geoemyda japonica（リュウキュウヤマガメ）だった。
- **PR/Commit:** PR #27 / merge `6319e5e`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #28 — TAXONOMY P0 分類修正6件

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** TAXONOMY P0 分類修正6件（18 files changed, 156 insertions(+), 119 deletions(-)）
- **Reason:** 確定方針に沿って、分類まわりの誤りをまとめて修正した。 CITES区分・slug・URL・掲載写真は変更していない。
- **PR/Commit:** PR #28 / merge `d13e8d6`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-20] PR #29 — ヒラタニオイガメの recommendationPriority を削除

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** ヒラタニオイガメの recommendationPriority を削除（1 file changed, 1 insertion(+), 1 deletion(-)）
- **Reason:** Sternotherus depressus（ヒラタニオイガメ）から recommendationPriority: 98 をフィールドごと削除した。
- **PR/Commit:** PR #29 / merge `18f8db1`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-21] PR #30 — 引き継ぎ表を species.js と同期

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 引き継ぎ表を species.js と同期（1 file changed, 38 insertions(+), 15 deletions(-)）
- **Reason:** SHINDAN-SPECIES.md だけを変更した。診断ロジック・写真には触れていない。
- **PR/Commit:** PR #30 / merge `a150498`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-21] PR #31 — Terrapene ornata を単型種へ同期、Podocnemis unifilis の誤和名を修正

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** Terrapene ornata を単型種へ同期、Podocnemis unifilis の誤和名を修正（10 files changed, 57 insertions(+), 51 deletions(-)）
- **Reason:** Terrapene ornata の学名を三名法から二名法へ統一し（ornate-box-turtle / desert-box-turtle の2ページ）、あわせて Podocnemis unifilis の誤和名を修正した。
- **PR/Commit:** PR #31 / merge `6480c77`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-21] PR #32 — 学名の rank 仕様を導入し、地域型・品種を二重登録と区別する

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 学名の rank 仕様を導入し、地域型・品種を二重登録と区別する（2 files changed, 74 insertions(+), 2 deletions(-)）
- **Reason:** 同じ学名を複数レコードが持つケースが master に4組あり、 それが二重登録なのか意図した地域型・品種なのかをデータで区別できなかった。 判別用の任意フィールド scientific_name.rank を導入し、検査を新設する。
- **PR/Commit:** PR #32 / merge `48e6787`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-22] PR #33 — 亜種PROJECT Phase B（亜種5件のページとデータを追加）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 亜種PROJECT Phase B（亜種5件のページとデータを追加）（21 files changed, 2499 insertions(+), 10 deletions(-)）
- **Reason:** PR #33 の最終監査で検出した2件を修正する。
- **PR/Commit:** PR #33 / merge `bc6759e`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-22] PR #34 — データ層の同期・生体写真の実体照合監査・CITES/分類学名の全層統一

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** データ層の同期・生体写真の実体照合監査・CITES/分類学名の全層統一（50 files changed, 827 insertions(+), 277 deletions(-)）
- **Reason:** 初回コミット(c3739af)以来、ページのfigcaption・pc_parsed・credits_mapと photo-credits.htmlが矛盾したまま併存していた10種を、GitHub Actionsの photo-fetchワークフロー(dry_run)でiNaturalist APIを照会し、S3の原本画像と
- **PR/Commit:** PR #34 / merge `4091e58`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-24] PR #36 — 生体写真の出典URL重複を全解消＋亜種PROJECT Phase B

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 生体写真の出典URL重複を全解消＋亜種PROJECT Phase B（43 files changed, 939 insertions(+), 157 deletions(-)）
- **Reason:** Phase B 候補11件を repo 状態と照合し、実装対象を確定した。
- **PR/Commit:** PR #36 / merge `9276850`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-24] PR #37 — 亜種PROJECT Phase C（優先亜種5種）＋title重複4件の最小修正

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 亜種PROJECT Phase C（優先亜種5種）＋title重複4件の最小修正（23 files changed, 2555 insertions(+), 9 deletions(-)）
- **Reason:** Phase C の C判定リストはリポジトリに残っていなかったため、推測で再現せず 一次データから候補集合を作り直した。species-master.json の掲載86種の 二名法名を鍵に iNaturalist Open Data の taxa.csv.gz（1,650,967行）を 1パス走査し、カメ目に属する亜種149件を抽出。active=false・既実装29件・
- **PR/Commit:** PR #37 / merge `793f859`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #38 — ギリシャリクガメ亜種2ページのtitle重複修正＋亜種PROJECT正式クローズ

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** ギリシャリクガメ亜種2ページのtitle重複修正＋亜種PROJECT正式クローズ（3 files changed, 43 insertions(+), 10 deletions(-)）
- **Reason:** moroccan-greek-tortoise / tunisian-greek-tortoise の <title> と og:title に あった「温度・餌・ケージ・餌・設備・難易度」を、同属の既存ページ （iberian-greek-tortoise）と同じ「温度・餌・ケージ・難易度」へ修正した。
- **PR/Commit:** PR #38 / merge `c646ad6`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #39 — best10の商品スニペット構造化データを修正（GSC重大エラー解消）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** best10の商品スニペット構造化データを修正（GSC重大エラー解消）（7 files changed, 216 insertions(+), 972 deletions(-)）
- **Reason:** GSC が 2026-08-01 に「商品スニペット構造化データの重大な問題: 『offers』『review』または『aggregateRating』を指定する必要があります」を 検出（Gmail の Search Console 通知で実測確認）。発生源は best10系7ページの ItemList 内 Product 108個で、全数が3要素とも欠落していた。
- **PR/Commit:** PR #39 / merge `16646f5`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #40 — リビアギリシャリクガメを追加（HOLD解除・外部調査の結果反映）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** リビアギリシャリクガメを追加（HOLD解除・外部調査の結果反映）（11 files changed, 550 insertions(+), 6 deletions(-)）
- **Reason:** HOLD 5件の外部写真ソース完全調査＋分類再検証（亀好きさんの明示指示・ NO-REWORK GATE 条件④）の結果、Testudo graeca cyrenaica を HOLD から IMPLEMENT に確定し、libyan-greek-tortoise として実装した。
- **PR/Commit:** PR #40 / merge `02f5644`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #41 — HOLD 4件の完全クローズ記録＋STEP 1（アフィリ表記前置・静的リンク補完・見出し構造修正）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** HOLD 4件の完全クローズ記録＋STEP 1（アフィリ表記前置・静的リンク補完・見出し構造修正）（27 files changed, 133 insertions(+), 56 deletions(-)）
- **Reason:** 亀好きさんの決定にもとづき、HOLD 4件の写真調査をここで完全に終了する。 前コミットで記録した「Torsten Blanck 本人への画像提供依頼」経路を取り消し、 クローズ方針へ差し替えた。
- **PR/Commit:** PR #41 / merge `c3b00c1`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #42 — 静的種別一覧に未掲載だった6ページを追加

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 静的種別一覧に未掲載だった6ページを追加（1 file changed, 6 insertions(+)）
- **Reason:** Phase B 由来の6ページが noscript の静的一覧（クローラー向け）に 未掲載で、ハブページからの静的被リンクが0だった。 既存の並び（slug 昇順）に沿った位置へ挿入した。
- **PR/Commit:** PR #42 / merge `1e86385`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #43 — 種一覧を「大分類→属→種→亜種」でグループ表示（Phase 1A）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 種一覧を「大分類→属→種→亜種」でグループ表示（Phase 1A）（1 file changed, 131 insertions(+), 1 deletion(-)）
- **Reason:** 118種がフラットな1枚のグリッドに並び、既定の並び順が実質 「species.js への追加順」だったため、同属・同種の亜種が一覧の 端から端まで散っていた（Kinosternon 11種が2位〜115位など）。
- **PR/Commit:** PR #43 / merge `07fbd28`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #44 — 飼育ガイド9本に「このガイドの対象種」を追加し species.js と同期

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 飼育ガイド9本に「このガイドの対象種」を追加し species.js と同期（10 files changed, 772 insertions(+), 1 deletion(-)）
- **Reason:** 生息環境別ガイド8本には species ページへのリンクが1本も無く、112種中 106種がどの飼育ガイドからも辿れなかった。guide-brackish はテラピン 3亜種だけを紹介したままで、後から追加した3亜種が反映されていなかった。
- **PR/Commit:** PR #44 / merge `cdc1de1`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #45 — 種一覧の4重管理を解消し species.js から自動生成する

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 種一覧の4重管理を解消し species.js から自動生成する（4 files changed, 557 insertions(+), 284 deletions(-)）
- **Reason:** JS表示118 / noscript112 / 隠しdiv100 / 件数バー初期値98 と、同じ一覧が 4つの別々の管理で食い違っていた。すべて shindan/species.js を基準に 自動生成へ切り替え、数と並び順を一致させる。
- **PR/Commit:** PR #45 / merge `f917ebe`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #46 — ガイド相互ナビを8本すべて7リンクに統一し誤リンクを解消

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** ガイド相互ナビを8本すべて7リンクに統一し誤リンクを解消（9 files changed, 182 insertions(+), 25 deletions(-)）
- **Reason:** 「ほかの暮らしのガイド」の相互リンクが5本のガイドで欠落・誤リンクしていた。 マタマタ・ナガクビガメ・スッポンは guide-softshell に集約されているのに、 5本のガイドからそこへ到達できない状態だった。
- **PR/Commit:** PR #46 / merge `e2126d2`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #47 — species-list の件数表記を実態に合わせる（100種別ガイド → 118種）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** species-list の件数表記を実態に合わせる（100種別ガイド → 118種）（1 file changed, 6 insertions(+), 6 deletions(-)）
- **Reason:** 一覧カードは118件・専用speciesページは112件だが、title / description / OGP / 構造化データに旧「100種別ガイド」表記が残っていた。 一覧の掲載数と個別ページ数を混同しない表現に直す。
- **PR/Commit:** PR #47 / merge `ae54182`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #48 — 「カテゴリから探す」の飼育環境カテゴリを3/8から8/8に

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 「カテゴリから探す」の飼育環境カテゴリを3/8から8/8に（2 files changed, 134 insertions(+), 12 deletions(-)）
- **Reason:** guides/index.html の「カテゴリから探す」にある「飼育環境 — 種類別ガイド」は 水棲ガメ・リクガメ・半水棲ガメの3カードしかなく、ガイドが8本に増えたあとも 更新されていなかった。49種ぶんのカテゴリがこのハブから辿れない状態だった。
- **PR/Commit:** PR #48 / merge `9ffbb9d`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #49 — 生息環境フィルタを確定済み6大分類へ統一（Phase 1C）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 生息環境フィルタを確定済み6大分類へ統一（Phase 1C）（10 files changed, 76 insertions(+), 43 deletions(-)）
- **Reason:** explore.html と species-list.html の生息環境フィルタは hab 4値 （水棲/半水棲/陸棲/森林系）で、Phase 1A で確定した6大分類と一致していなかった。 「水棲」50件が受け皿になり、汽水6件とスッポン・曲頸16件が独立して 選べない状態だった。判定も種名に「ニオイ」「ドロ」を含むかの正規表現で、
- **PR/Commit:** PR #49 / merge `4aed4f0`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #50 — 6大分類UIを生成管理へ入れる（Phase 1D）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 6大分類UIを生成管理へ入れる（Phase 1D）（3 files changed, 159 insertions(+)）
- **Reason:** Phase 1C で6大分類へ統一したが、species-list.html の生息環境ボタンと explore.html のカテゴリカードは手書きのままで、tools/taxonomy.js の CAT_ORDER を変えても追随しなかった。この2箇所を生成対象にする。
- **PR/Commit:** PR #50 / merge `838c79f`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #51 — 難易度体系5段階化 STEP 1

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 難易度体系5段階化 STEP 1（1 file changed, 43 insertions(+), 14 deletions(-)）
- **Reason:** shindan/species.js の difficulty 生値5段階（入門/入門〜中級/中級/中〜上級/上級）を species-list.html のUIでもそのまま使うようにした。これまでUI側だけが独自に 3段階へ圧縮しており（diffRank）、正本と表示がずれていた。
- **PR/Commit:** PR #51 / merge `e4b3992`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #52 — 「初心者」公開表現 Phase B-1（B分類37件・HOLD 15件）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 「初心者」公開表現 Phase B-1（B分類37件・HOLD 15件）（22 files changed, 37 insertions(+), 37 deletions(-)）
- **Reason:** 公開文言で「初心者」を人へのラベルとして使わない方針にもとづき、 Phase A の B分類「飼育経験」52件のうち37件を修正した。 冬眠の安全側運用を説明する文が中心で、意味・安全性・推奨強度は変えていない。
- **PR/Commit:** PR #52 / merge `eae8d6e`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #53 — 「初心者」公開表現 Phase B-2（E分類CTA・ナビ37件・HOLD 1件）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** 「初心者」公開表現 Phase B-2（E分類CTA・ナビ37件・HOLD 1件）（32 files changed, 37 insertions(+), 37 deletions(-)）
- **Reason:** Phase A の E分類67件のうち、SEO・構造化データと密結合しない 「CTA・関連リンク・ナビの可視ラベル」38件を対象に、37件を修正した。 遷移先（href）・GA4・見出し・title は一切変更していない。
- **PR/Commit:** PR #53 / merge `5fa7c9c`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #54 — difficulty 公開表現整合 Gate（既知5件確定・「非推奨」廃止）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** difficulty 公開表現整合 Gate（既知5件確定・「非推奨」廃止）（4 files changed, 7 insertions(+), 7 deletions(-)）
- **Reason:** difficulty 正本5値と公開ページの難易度表記に残っていた既知の不整合を確定させ、 8箇所を修正した。正本（shindan/species.js）は変更していないため、 5段階の件数（入門11 / 入門〜中級7 / 中級23 / 中〜上級38 / 上級39 = 118）は不変。
- **PR/Commit:** PR #54 / merge `61ceb48`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #55 — difficulty 表示層の完全同期（不一致28→0）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** difficulty 表示層の完全同期（不一致28→0）（31 files changed, 32 insertions(+), 33 deletions(-)）
- **Reason:** diff-badge と stat-item に残っていた正本との不一致をすべて解消した。 正本（shindan/species.js）は無変更で、5段階の件数は 入門11 / 入門〜中級7 / 中級23 / 中〜上級38 / 上級39 = 118 のまま。
- **PR/Commit:** PR #55 / merge `e51fc09`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #56 — AI引継ぎ・重複作業防止システムの整備

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** AI引継ぎ・重複作業防止システムの整備（3 files changed, 287 insertions(+), 7 deletions(-)）
- **Reason:** ChatGPT → Claude Code → 完了報告 → ChatGPT の往復で、完了済み作業の再調査・ 次工程の取り違え・固定事項の再検証が起きていた。状態を1ファイルに集約して防ぐ。
- **PR/Commit:** PR #56 / merge `4fc0952`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #57 — AI-HANDOFF の CURRENT_BASE を同期

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** AI-HANDOFF の CURRENT_BASE を同期（1 file changed, 3 insertions(+), 2 deletions(-)）
- **Reason:** 新設した更新ルール（同ファイル末尾／.claude/rules/chatgpt-handoff.md §1-2）に従い、 AI-HANDOFF.md 自身を現在状態へ同期する。PR #56 は merge commit が確定する前に 本文を書いたため、CURRENT_BASE が1コミット古いまま残っていた。
- **PR/Commit:** PR #57 / merge `ed14074`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #58 — A-1 quick-facts のラベル置換（26件）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** A-1 quick-facts のラベル置換（26件）（27 files changed, 49 insertions(+), 40 deletions(-)）
- **Reason:** Phase A の A分類 A-1。species 個別ページの quick-facts 最終行にある問いのラベルを、 人へのラベル付けをやめて難易度の軸名に変えた。値・理由文・色・アイコンは無変更。
- **PR/Commit:** PR #58 / merge `c81a4dd`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #59 — A-4 FAQ問いの可視・JSON-LD同期（5ページ）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** A-4 FAQ問いの可視・JSON-LD同期（5ページ）（6 files changed, 33 insertions(+), 26 deletions(-)）
- **Reason:** Phase A の A分類 A-4。species 個別ページのFAQ問いから人へのラベル付けをやめ、 可視 <summary> と JSON-LD FAQPage の "name" を同一commitで完全一致させた。
- **PR/Commit:** PR #59 / merge `21df3eb`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-25] PR #60 — H1 B分類の可視FAQとJSON-LD同期（14件）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** H1 B分類の可視FAQとJSON-LD同期（14件）（15 files changed, 47 insertions(+), 42 deletions(-)）
- **Reason:** Phase B-1 で HOLD していた14件。可視FAQ（faq-body / h3）と、それを1文字違わず 複製している JSON-LD FAQPage（acceptedAnswer.text / "name"）を同一commitで 完全一致させた。14件 × 2箇所 = 28箇所。
- **PR/Commit:** PR #60 / merge `e5702c2`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-26] PR #61 — A-5 3件 + B18 1件（B分類 52/52 完了）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** A-5 3件 + B18 1件（B分類 52/52 完了）（4 files changed, 22 insertions(+), 21 deletions(-)）
- **Reason:** 見出しと本文が同じ主張を扱うため、片方だけ直すと乖離する。同一commitで処理した。 これにより B分類（飼育経験）52件が 52/52・未処理0 で完了する。
- **PR/Commit:** PR #61 / merge `141723b`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-08-26] PR #62 — H2 最終HOLD解消（未処理HOLD 0）

- **Actor:** Claude Code（実装） / 亀好きさん（承認）
- **Change:** H2 最終HOLD解消（未処理HOLD 0）（2 files changed, 21 insertions(+), 17 deletions(-)）
- **Reason:** Phase B-2 で HOLD していた最後の1件。exit-capture カードの ボタンラベルと、それを名指しする説明文を同一commitで変更した。 片方だけ直すと同一カード内で表記が乖離するため分離できなかった。
- **PR/Commit:** PR #62 / merge `3b9a395`
- **Approver:** 亀好きさん
- **Conforms:** Constitution v2.0

---

## [2026-09-03] Development Constitution v2.1 — 条件付き Actor merge の許可

- **Actor:** Claude Code（起案・実装） / 亀好きさん（裁定・承認）
- **Change:** `DEVELOPMENT_CONSTITUTION.md` を v2.0 → **v2.1**（§9.2-R1 の MINOR＝運用調整）。
  **§2.6-I1 を改定** — 公開（Publish）は RO-1 単独のまま、Merge は5条件をすべて満たす場合に限り
  Actor（RO-2 / RO-3）も実施可とした。整合: §2.3-R1 / §2.4-R1 / §2.4-R2 / §4.2-R2 / §4.3。
  §9.2 に改定履歴表を新設。下位規則を v2.1 準拠へ更新
  （`.claude/rules/pm-conduct.md` §7 を 7.1/7.2/7.3 に再構成・§4 に但し書き追加、
  `.claude/rules/chatgpt-handoff.md` §2・§4、`.claude/rules/closeout-gate.md`、
  `CLAUDE.md` 経路表と Git 運用）。§1.3-R2 / §9.2-R3 に従い `Conforms-to` を v2.1 へ更新。
- **Reason:** 制定時の `pm-conduct.md` §7 Merge Gate「危険が無ければ merge 可能」が
  憲法 §2.6-I1「Merge は RO-1 のみ MUST」と矛盾していた。Owner の裁定は当初案B
  （Actor は merge しない）だったが、Owner の意図が案A（危険が無ければ Actor merge 可）
  であることが判明し、案A へ変更。案A は憲法改定を伴うため v2.1 とした。
  併せて Owner 裁定 D-02（品質不足による STOP は積み残しではない）と
  D-03（合格基準の引き下げ禁止は検査の追加に及ばない）を規則へ反映。
- **PR/Commit:** PR #132（前段・案B反映） / merge `5f96d2d`、本PR（案A・v2.1改定）
- **Approver:** 亀好きさん（「aにして」）
- **Conforms:** Constitution v2.1
- **備考:** 過去の Actor merge 4件（PR #129 `877667d` / #130 `1e7ec89` / #131 `321ebe0` /
  #132 `5f96d2d`）は改定後の5条件をすべて充足しており revert 不要。
  経緯は `docs/decisions/OPEN-DECISIONS.md` に記録した。

---
