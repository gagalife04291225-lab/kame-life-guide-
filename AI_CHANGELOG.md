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

## 2026-11-02 — 私的GA4日次取得・集計CLI

- **Actor:** Codex（RO-3 実装）
- **Change:** `scripts/ga4_daily.py`、専用requirements、合成データテストと公開CI、`docs/operations/GA4_DAILY.md` を追加。AI-HANDOFFの停止点と再開条件を更新。既存認証を使う読み取り専用取得、独立PV/クリック、商品生ID・未設定bucket・前期比較、品質制限と私的レポート保存を実装。
- **Reason:** GA4自動分析の基盤を、計測コードやGA4設定の変更から独立させて検証する。実認証・日次ランナー・13CTAの分類/外部レポート依存は未確認のためBLOCKEDとして保持。
- **PR/Commit:** PR #212 / 初回実装 `90ce72f2d5c39bffee5afcddd92231db45397e7d`。最終head・merge結果はPRの実測を正とする。
- **Validation:** 合成データ16テスト、py_compile、diff check。実取得は認証不在で停止、本番成功とは扱わない。HTML・既存JS・商品DB・リンク・計測ID差分0。実数・認証情報は公開しない。
- **Approver:** Ownerの今回指示（安全性・互換性を検証できた変更はPR・mergeまで）。PlatformのApprove reviewは実施しない。
- **Conforms:** Constitution v2.1 / handoff-gate / closeout-gate。指定BASE `221278dedd31b9f1266c64edd9c29f005beabcbb`、開始時main `fa828ec93438bfad140288c67958052111f2696e`。


## 2026-11-10 JST — Windows GA4日次運用の復旧記録

- **Actor:** Codex（RO-3）
- **Change:** AI-HANDOFFを実際のWindows私的ランナーの状態へ更新。既存読み取り専用OAuthを再認可し、手動取得とTask Scheduler経由の起動・私的保存を確認。既存タスクを再利用し、クライアント/キー/権限追加・タスク設定上書きはなし。公開repoの変更は2文書のみ。
- **Reason:** 標準ADC不在と私的DPAPI認証を区別し、認証なしという古い停止点と、Testingの7日制限/復旧後定刻未検証を正しく引き継ぐ。
- **Validation:** 手動・タスク起動とも終了コード0、異なる新規レポート対を読取、API品質警告0、対象ホスト/ストリーム/時間帯/独立総計を照合。同一ユーザー・IgnoreNew・WakeToRun=falseを確認。定刻実行と恒久運用は未検証/未完。私的実数/秘密を転載しない。
- **PR/Commit:** 本作業ブランチ `claude/ga4-runtime-recovery-20261110` のPR結果を正とする。開始時main `34b47b509557c3a0c6282e88ad8fc0a67c39daac`、取得CLIはPR #212の既存版。
- **Approver:** OwnerのWindows日次稼働の作業指示と、PC操作を代行して進める追加指示。OAuth本番公開の承認とは扱わない。
- **Conforms:** Constitution v2.1 / handoff-gate / closeout-gate。


## 2026-11-12 JST — 「大きくならない亀7種」記事の改稿と関連ページの矛盾修正

- **Actor:** Claude Code（RO-3）
- **Change:** `guides/small-best-turtles.html` を、成体サイズ（一般的な目安／資料上の上限／雌雄差）と成体1匹の飼育スペース（当サイト目安／海外資料例）で判断できる構成へ改稿。参考資料28件、種カード7枚、同居、今は迎えない判断、FAQ 9問を追加し、根拠のない初期費用を削除。PR #213 の記事側導線を取り込み。関連ページ（ranking-beginner-top10・種ページ3枚・shindan/species.js）の矛盾を修正し、species-master のカブトニオイ（15→17.6cm）・ロシアリクガメ（20→22cm）と5種の note/sources を更新。
- **Reason:** Owner の明示指示（GSC 2026-10-13〜11-09: 214クリック・3,078表示・平均6.0位）。読者の「成長後も小さいか」に根拠付きで答えるため。
- **Validation:** check_enclosure_sync 一致110/不一致0、check_compare_enclosure 一致378/矛盾0、validate_species MISMATCH 0、tools 17テスト OK、FAQ 可視9＝JSON-LD 9、ローカルリンク・アンカー切れ0、320/390/1280px で横はみ出し0、GA4/アフィリエイトID数 不変。
- **PR/Commit:** ブランチ `claude/small-turtles-adult-size-20261112`。開始時 main `570bc1c2808c93bc2c5e72678e8b50b276242853`。merge は Owner 判断（PR #213 の公開判断を含むため）。
- **Approver:** Owner の作業指示。merge・公開は未承認。
- **Conforms:** Constitution v2.1 / handoff-gate / closeout-gate。

- **追記（同PR・2026-11-12）:** レビュー指摘（PR #216 r4544118146）に対応し、診断画面が表示する `coreSpecs.size` を4種（ロシアリクガメ22cm・カブトニオイガメ17.6cm・スペングラーヤマガメ10.7cm・フロリダハコガメ18.7cm）で正本・記事にそろえた。`tools/test_species_size_sync.py`（3テスト）を追加。旧データでは失敗し、修正後は通ることを確認済み。
- **追記2（同PR・2026-11-12）:** 公開前確認で、診断の説明文・水槽サイズが記事と食い違う5種を正本の成体向け目安にそろえ、7種の「最大甲長」に注記（sizeNote）を表示。案内人の小数分割（既存不具合）を修正し、回答を上限側の数字だと明記。回帰テスト（Python 4件・node 21件）を追加。


## 2026-11-12 JST — 成長に合わせた容器の見直し（B案）

- **Actor:** Claude Code（RO-3）
- **Change:** `/kid/` に静的節「成長と容器の見直し」（#growth・出典8件）を追加し、小型種記事・ミシシッピニオイガメ・はじめての方向けランキング・代用品ガイド・陸系種ページ44枚から短い答えとリンクで案内。陸系ページの水棲向け「甲長の約4倍」注記を数字なしの陸系向け注記へ置換。ミシシッピニオイガメの水深を正本「浅め＋足場」へ、水槽目安を「当サイトの目安」と明記。回帰テスト `tools/test_growth_guidance.py` 追加。
- **Reason:** Owner の明示指示（前回調査の推奨B案）。子ガメの容器をいつ広げるかに、月齢の断定でなく暮らしぶりと甲長で答えるため。陸系ページの水棲倍率は正本ルール（陸生×5）と食い違っていた。
- **Validation:** tools 26テスト OK、annainin 21 / rakuten 20 PASS、validate_species MISMATCH 0、check_enclosure_sync 110/0、check_compare_enclosure 378/0/10（変更前と出力同一）、JSON-LD 解析 OK、320/390/1280px で横はみ出し0・JSエラー0、KID ツールの5段階表示件数が main と一致、新規文字色のコントラスト最小 7.77:1。
- **PR/Commit:** ブランチ `claude/turtle-growth-tank-review-20261112`。開始時 main `dc2ebfb2544938b2ee86498ad028bfe9b3197844`。
- **Approver:** Owner の作業指示。merge・公開は未承認。
- **Conforms:** Constitution v2.1 / handoff-gate / closeout-gate。
- **追記（同PR・2026-11-12）:** PM 監査（HEAD 9c1e2b71）に対応。水棲／陸棲の説明を冒頭から分離、定期の見直しと緊急の環境修正を分離、ミシシッピニオイガメの45cm/60cmの説明を甲長11cm前後で統一し海外資料の条件を併記、水深・UVBの出典表現を一致、外貼り目盛りの文章を簡潔化、陸系44枚の注記を簡潔化、出典の文字を拡大。トロ舟80型の甲長範囲と×5条件の既存不整合、種ページの「KID 安全判定」表記は別課題として記録。
- **追記2（同PR・2026-11-12）:** PM 監査（HEAD b813fdc8）に対応。ランキングの息継ぎ案内、ニオイガメ11cm境界の根拠明示、KID の表現（種ページ112枚の「KID 安全判定」含む）・区分の部分対応表示・サイズ条件未確認2件・購入リンクのロック（href除去）・呼吸器症状の獣医相談、陸系ページの矛盾（ソリガメ・インプレッサ・チュニジア/モロッコギリシャ・ヤマガメ3種・セオレ2種・トウブハコガメ）を修正。回帰テスト `tools/test-kid-lookup.mjs` 追加。
- **追記3（同PR・2026-11-12）:** 未確認容器2件の甲長ゲージの読み上げ名（aria-label）から未確認の数値範囲を除き、表示と同じ「対応甲長：未確認。下のサイズ条件を確認してください。」に統一。確認済み8件は出力不変。Owner 指示により merge。


## 2026-11-12 JST — /kid/ 甲長ゲージ: 上限なし3件の読み上げ名を修正

- **Actor:** Claude Code（RO-3）
- **Change:** `js/kid-lookup.js` の甲長ゲージで、上限なしの用品（レンガ・ライトスタンド・吸込スポンジ）の aria-label を「対応甲長 0〜cm」から表示と同じ「対応甲長 上限なし」へ。`tools/test-kid-lookup.mjs` に上限なし・上限あり・未確認の回帰テストを追加。
- **Reason:** PR #217 の本番確認で、表示「上限なし」と読み上げ名「0〜cm」の不一致を確認したため（Owner 指示）。
- **Validation:** kid-lookup 145 / unittest 29 / annainin 21 / rakuten 20 / validate_species 0 / enclosure 110/0・378/0。アクセシビリティツリーと表示の一致（390・1280px）。他の7件のゲージ・カード・CTA は main と出力一致。ロック/解除・GA4 イベント・区分件数に回帰なし。
- **PR/Commit:** ブランチ `claude/kid-gauge-aria-unbounded-20261112`。開始時 main `97e7e434f828263b6773c467ce62196e80b9cd30`。
- **Approver:** Owner の作業指示。
- **Conforms:** Constitution v2.1 / handoff-gate / closeout-gate。


## 2026-11-12 — 初心者飼育案内の根拠追補

- Actor: Codex（RO-3）。Owner指示「何故やらなかった？進めて」「見直して 正にして」。
- Change: 9 HTML・master・診断2種のサイズ注記を整合。muskのUVB/温度/換水、3種のサイズ根拠、固定年齢による成長予測の撤去。順位・購入URL・CITES表示は不変。
- Validation: Python41/41、13ファイルhash一致、9ページ375/1280横はみ出し0、重要箇所目視。詳細と未測定事項はdocs/qa/care-evidence-followup-20261112.md。
- Status: 検証完了・PR/merge待ち。BASE0bc29360579461b90c3ddaf095a083671d8ded54、branch claude/care-evidence-followup-20261112、実装75e966c。PR番号・merge SHA・公開結果は未確定。
- Conforms: Constitution v2.1 / handoff-gate / closeout-gate。

- 追記: PR #219作成。Ownerの「入れて　マージして」により送信・merge承認。最終差分16ファイル、範囲外0、MERGEABLE/CLEAN（登録CIなし）、Python41/41再確認。本番はmerge後に別途実測する。

## 2026-11-12 KID 容器2件の寸法根拠是正（公開判断待ち）

外寸を内寸扱いしていた汎用データと×5/×3の安全断定を除去。赤長80L・天馬530Mの公式資料は型番限定の例として保存し、汎用容器への外挿をしない。UNKNOWN・K-SCORE非表示・数値ゲージ非表示・購入CTA保留・未確認トロ舟への代替推薦を除去。KID165件PASS、実Chromeの表示と390px/1249pxを確認。収益導線の変更を含むためOwner判断待ち。

2026-11-12追記: Ownerが購入CTA2件の一時停止を含む修正の送信・mergeを明示承認。PR #220。既存codexブランチとの名前衝突を避けcodex-kid-dimension-evidence-20261112で送信。


## 2026-11-12 — シェルター記事のサイズ根拠・適合表現を限定修正（ローカルのみ）

- **Actor:** Codex（RO-3）
- **Change:** `shelter-best10.html` のスペングラー成体サイズ3箇所と雌雄差を資料に沿って修正。XXL・GEX S/Mの適合保証と未確認の甲長境界を撤去。入口/内寸と個体の実寸を照合する案内へ変更し、導入・まとめ・metadataを同期。専用回帰テスト7件を追加。
- **Reason:** 比較記事とシェルター記事の新しい矛盾への限定対応。既存の承認待ち2件は変更せず、別clone/branchでローカル検証までとする指示。
- **Validation:** Python36/36、旧mainは新規テスト4メソッド/6 assertionでFAIL。375/1280pxで横はみ出し0・JS例外0、12スクリーンショット目視。商品名/順位/14 ASIN/非schema script/CSS/既存リンク/他10商品/比較記事は不変。外部フォント・本番・実商品適合は未評価。詳細は `docs/qa/shelter-size-evidence-20261112.md`。
- **Branch/Base:** `codex/shelter-size-evidence-20261112` / 実測main `0bc29360579461b90c3ddaf095a083671d8ded54`。
- **Publication:** push・PR・merge・公開アップロードなし。外部送信の許可待ち。

- **公開工程への追記（2026-11-12）:** Ownerが今回のシェルター修正を含む3候補の送信・mergeを承認。先行PRの内容を保持し、最終検証と公開確認を行う。初回ローカル検証の記録を公開成功に読み替えない。

- **送信ブランチ名:** 既存remoteブランチ `codex` と階層名が衝突するため、元のローカル候補を保持し、`codex-shelter-size-evidence-20261112` を公開用に使用。


## 2026-11-12 — シェルター修正PR #221に先行mainを統合

- PR #219/#220を含むmain `b1f0256bd94dbf790939a24bde9792a5bf8288a8` を取り込み、共有記録の競合のみ解消。飼育案内とKIDのソース・本番確認結果を保持した。KID2件の型番/用途未確認と購入CTA HOLDは継続。
- シェルター記事と専用テストはレビュー済み `97fb14b` と同一。Python 48/48、KID 165/165 PASS（WindowsはUTF-8モードと既存tzdataを使用）。公開前差分は当初の5ファイルのみ。


## 2026-11-12 KID用品・実例とメーカー資料の整理（未公開候補）

- 販売先5商品の型番を照合し、ROX530M/530L内寸A/B、GEX専用器具条件、赤長80L外寸を型番限定で記録。
- Ownerの訂正を反映し、メーカー用途外と実飼育例の不存在を混同する一律非推奨案を撤回。床材/注水/湿潤床材、別型番の条件を区別。
- 全10用品の根拠なしSAFE/スコア/倍率を見直し、8用品の適合甲長未確認と2器具の甲長非該当を表示。元2CTA停止維持、既存3導線は条件確認ロック。URL/tag/GA4不変。
- Node263PASS、Python48OK、実Chromeの10カードと375/1280px確認。公開保留、commit/push/PR/merge未実施。詳細: docs/qa/kid-model-verification-20261112.md。

- 追加指示で衣装ケースの複数実例（長期利用と破損の双方）を反映。天馬FAQを他社全製品へ一般化しない。Node263PASS・独立レビューBLOCKER0・追加表示確認済み。Owner承認で元2CTA停止のままPR/merge工程へ移行。本番未確認。

## [2026-11-12] 飼育情報の残る根拠・意味の是正（ローカル候補、未公開）

- **Actor:** ChatGPT（調査・実装・独立レビュー）
- **Change:** 17レコードの記録最大甲長を出典・分類範囲とともに同期。根拠のない通常サイズ帯5件を記録上限と区別。寿命8種を平均/飼育期間記録/機関の案内へ分類し、種ページ・診断・共通表示・案内人に反映。容器紹介3ページの一律倍率・長さ/面積の単位混同・無出典流量倍率を条件付き説明へ変更。
- **Reason:** Owner「未確認を確認して」「他の何々が未確認を無くして」。未確立値を埋めるのでなく、取得資料の意味と掲載範囲を明確にするため。
- **PR/Commit:** `codex/remaining-care-evidence-20261112`、開始main `e94ef55284f847eb845d46427701bd0307ea144a`。commit/push/PR/merge未実施。
- **Approver:** Ownerの見直し指示に基づく候補作成。公開前の実画面確認・統合判断は未完了。
- **Conforms:** 変更範囲固定、根拠と未評価の分離。KID/商品URL/GA4/CITES/順位は変更なし。
- **Evidence:** `docs/qa/remaining-care-evidence-20261112.md`、`docs/qa/size-evidence-20261112.md`、`docs/fixed-facts/lifespan-evidence-20261112.md`。

## [2026-11-12] 飼育根拠候補のPC確認・KID先行main統合

- **Actor:** ChatGPT（実装・別担当による独立レビュー/PC検証）。
- **Change/Reason:** Owner「進めて」で画面確認後の反映工程へ。PR #222 main `6b0ff0ad368fa11f79c0feff1e349208fc11068c` を取り込み、KIDコードを保持。共有docsの競合だけを解消し両方の履歴を残した。
- **Validation:** PC Python58/58、寿命90/90、元43ファイルhash一致、28HTMLの375/1280px横はみ出し0、8種寿命共通部品・実12問診断・代表画面・#growth確認。cloudの57/58環境ERROR履歴は保持。
- **PR/Commit:** 原候補 `ea1eb764fc7524c589133ef57cd1c20ea64ef551`、PC記録 `8277e00c`、branch `codex-remaining-care-evidence-20261112`。本番確認は未実施。
- **Approver/Conforms:** Owner継続指示。対象外0を最終差分で確認し、商品URL/GA4/CITES/順位/CSS不変を維持する。

- **KID先行公開の実測報告受領:** PR #222 merge `6b0ff0ad368fa11f79c0feff1e349208fc11068c`、Pages run43169226211成功。担当が公開3ファイルHTTP200/改行正規化完全一致と本番Chrome10カード/21出典/元2CTA停止を確認。careではKIDのサイトファイルを変更せず保持。

## [2026-11-12] 分類依存11レコードの継続是正（ローカル候補）

- Actor: ChatGPT。Ownerの未確認解消依頼の継続。base main8518b01b8251a853bcbba8f19c6cfe282abfb9ee。
- Change: 種/亜種/旧広義群/地域型/色彩型と記録値を区別。疑義あるギリシャ46cmは確度を明記し集計除外。上限未確立の型はnullとし、個体記録や基礎種参考値と分離。診断・正本・種ページ・分類データ・公開導線・関連比較表を同期。
- Source: TTWG2025、直接取得した種概説/原著/州政府/大学系標本情報。分類変更を法令上の扱いの変更と同一視しない。
- Gate: KID・商品リンク・GA4・法令判断・寿命・順位・CSS不変。候補の検証・公開は別途実測。commit/push/PR/merge未実施。

- 検証: 独立レビューの旧分類/末尾旧値/年齢予測残存を全件修正し再読クローズ。Python67件中66PASS/既存GA4環境ERROR1、分類9・案内人25・寿命90・KID263・楽天20PASS。validator0/0、容器110/0・比較378/0/10。PC実画面・公開は未実施。詳細はdocs/qa/classification-round2-qa-20261112.md。

## [2026-11-12] 分類・比較説明・文体の統合とPC検証

- Owner「書き方がAIっぽいな」で公開保留後、「すすめて」で再開。base8518b01b8251a853bcbba8f19c6cfe282abfb9ee。旧追加patchが失われたため新候補を再構築し独立レビュー・Library保存、PC保全済み分類35と統合。
- 共通文115HTML/406置換、分類の注記、KIDの文体、比較表32ページと初心者記事を修正。ニシキ2ページの旧通常値6表示を追加是正。競合5ページは変更行・対象比較行だけを統合し分類の新事実を保持。
- PC Python76/76、案内人25、寿命90、KID269、楽天20 PASS。121HTML×2幅でページ横溢れ0。初心者FAQ・診断注記・KID条件展開と元2CTA停止を実画面確認。
- 商品URL/tag・GA4・CITES判断・CSS・順位・元2CTA停止を保持。本番検証はmerge後の実測をPRへ記録。今回追記時点で公開完了とはしていない。


## 2026-11-12 診断ルート名の undefined 修正

- BASE: 6e253000189fa7b42a5723802c183e5381c52b8c
- CLOSED（実装修正）: shindan/index.html の通常質問・飼育準備質問で、存在しない route.emoji を参照せず route.name を表示。選択画面の SVG アイコン、診断条件、計測、購入リンクは変更なし。
- 回帰テスト: tools/test-shindan-route-labels.mjs。全5ルートの通常質問・準備質問・通常質問への復帰の15表示を確認。旧コードで失敗し修正後PASS。
- ローカル Chrome: 全5ルートを実際に選択し最後の診断結果まで通過。通常質問・準備質問に undefined なし。
- 既存検証: Python サイト関連59件、KID269件、案内人25件、寿命90件、楽天20件PASS。validate_species MISMATCH0/WARN0。
- BLOCKED: GA4関連テスト2件は環境のtzdata不足（America/Los_Angeles）。今回はGA4変更なし。
- 公開確認: マージ後に実施。既存NEXTのGA4定刻実測・他の未解決項目は変更しない。


## 2026-11-12 診断用品の表示・選定条件監査
- BASE: f84fbc2e1894c3c878da618b5580bce0bb182ce7
- 実装: water_dish の画面用ラベル漏れを修正。診断TOP3は経験値による商品断定をやめ、用品カテゴリと選定条件を案内。共有Starter Kitは価格帯ごとの比較候補と明記。容器9件の無条件の成体適合・同居保証を削除し、全容器カードで内寸・成体の広さを照合する案内を表示。
- 変更しないもの: 商品ID/ASIN/購入URL/EQUIPMENT_MAP、診断の採点、既存resolveEquipmentKey。自動選定の整合修正案はレビューで不適切と分かり撤回。イベント名は維持。diagnosis_cta_view.top3_tier は商品tierを選ばなくなったため requirements に変更。
- 検証: 全119種、全213用品カードでカテゴリラベル・比較候補案内を回帰検査。Chrome全5ルート代表×320/390/1280で横はみ出し0。ロシアの3価格帯タブ・水入れ日本語表示・購入リンクを確認、JSエラー0。
- BLOCKED: 既存の用品系統選定に不整合。通常/allで46種が相違。種ページキーへの統一も通常48/all63種を変え、ベル/ホームセオレ等では本文の生態と衝突する。全面統一せず、種別の用品適合を根拠付きで監査後に対応する。
- 監査根拠: docs/qa/diagnosis-equipment-source-audit-20261112.json。119種、明示キー112ページ/欠落1、null slug6。通常/allと種ページの実効商品ID差分1247件を記録。
- 本件は用品選定全体の適合を保証する修正ではない。既存NEXTのGA4定刻実測は変更しない。

- 同一監査内の追加表示修正: 全142商品・15カテゴリのラベル網羅（用品系統に未使用の4カテゴリも含む）。空価格41件は販売先確認とし、候補合計は価格未掲載件数を表示、不明価格がある場合は節約額を表示しない。全商品cardと空価格合計テストを追加。BASEでFAIL、修正後PASS。商品価格データ自体は無変更。

- 監査範囲/修正/未解決4群の一覧: docs/qa/diagnosis-equipment-display-audit-20261112.md。費用マップ8系統の相違と商品情報外部再検証も一括記録。
## 2026-11-12 — 5比較記事の評価根拠を是正
- 根拠不明な本文★とProduct/Reviewをセットで撤去。床材6種の実使用断定・売れ筋引用・順位番号・短評を整理。商品リンクと計測は不変。
- 5件の回帰テストとWindows/Chrome検証。初回GA4環境エラーは既存検証用tzdata参照で解消し全85件PASS。QA記録: docs/qa/review-evidence-five-20261112.md。

## [2026-11-12] ケージ比較記事の体験・評価と製品分類を是正
- Actor: OpenAI dot
- Change: cage-reviewの実使用主張・4.8/Review schema・順位を撤去、WH6045成体案内とDC600分類を訂正。旧年タイトルを無年号へ。回帰4件と根拠記録を追加。
- Reason: Owner本人が5製品の実使用を否定。Amazon評価の出所は確認できず。メーカー仕様と記事に明確な矛盾あり。
- PR/Commit: 本ブランチ。公開工程の実測結果はPRコメント。
- Approver: Owner「確認して 不具合なおして」と本人の実使用否定、既存merge指示の範囲。
- Conforms: 最小限の事実是正。商品リンク/GA不変。


## 2026-11-12 便利ワザ記事の実用化（PR #228）

- BASE: f84fbc2e1894c3c878da618b5580bce0bb182ce7。公開前に main 179b1c19498929bc32964d6096ee3509a44644b6（PR #226）を競合なく取り込み。
- 26サイトの本文調査から8つの工夫を採用。水換え・清掃・温度/記録の3分類、短い効果説明と開閉式3手順。獣医・メーカー・飼育者の出典を区別し、本人の使用体験は追加しない。
- guides/keeper-hacks.html の既存購入URL8本/tagと飼育情報を保持。全ページ必須のGA4欠落とsitemap登録漏れを補修。
- 独立レビューの指摘（排水前の電源停止を手順の先頭へ）を修正済み。内容・HTMLの未修正指摘0。
- Chrome実画面: 320/390/1280pxで横溢れ0、390pxでdetails8件の開閉16操作PASS、Enter開閉と#cleanジャンプPASS、summary高さ52.8px、console error0。外部GA4読込をローカルQA時のみ除去し本物の計測は送信しない。
- 最終検証: #227統合後、既存PC検証用tzdataを実行時だけ参照してPython92/92 PASS（新規7件含む）。KID269/案内人25/寿命90/楽天20 PASS。初回の環境由来エラーはPC最終検証で解消。新規インストール・システム設定変更なし。
- 公開はPR/merge後に配信一致と実画面を別途確認し、PRコメントへ記録する。未確認を公開済みとは扱わない。
- NEXTは既存のGA4定刻実測を維持。今回の記事を再調査・再実装しない。


## 2026-11-12 種別用品適合監査・段階1
- BASE f1812ed4。119種の既存根拠を項目別JSONに保存。詳細/残件/費用影響: docs/qa/equipment-suitability-plan-20261112.md。全種外部確認完了ではない。
- 限定修正: forest/box高価格帯の発熱器と制御器を分離。ピタリ1/2/3号の公式FAQと矛盾する説明を修正。2亜種のreasonを当サイトの目安90〜120cmに整合。商品URL/価格/診断resolver不変、実効商品差分2枠。
- 残件:DBT6/ヒメハコ必須カテゴリと実商品の二層管理、ホームセオレ、成体容器、機器適合、費用前提。既存NEXTのGA4定刻実測は変更しない。

## 2026-11-12 七種の用品条件

テラピン6亜種とヒメハコヨコクビに条件・出典表示を追加。浮島Mの15cm適合断言を公式仕様へ。商品/価格/リンク/振り分け不変。全119種適合完了とは扱わない。検証は docs/qa/seven-species-equipment-conditions-20261112.md。

## 2026-11-12 全種構造監査・4種条件と費用表示

119種を監査台帳へ集約。Home/マタマタ2種/スッポンモドキの出典付き条件、初期費用と候補小計の混同訂正、根拠不明損失額の撤去。商品/リンク/価格/選定不変。CTAイベントの費用予告属性のみ現表示に整合。


## 2026-11-12 PR #233 修正版：Homeの用品を残して条件を説明
- BASE main 6b1ac588c776d3c75ee77d7bc6d15d3bb03a9cf4。Ownerが候補除外を拒否し再調査を指示。除外機構は撤回、商品・URL・価格・選定キーを保持。
- GEXデザートベースは湿潤使用への言及があり、名前を理由に不適合としない。メーカー使用厚とHome飼育実例の深さを区別、袋単位の価格と必要量、水場、保温、UVBの設置条件を種ページと診断両経路に説明。
- Homeの温度はTortoise Trust24〜27℃とTFTSG気温27〜32℃を出典別に示し、夏の高温安全・24/25℃危険境界・バスキング32〜38℃の根拠なし断定を訂正。FAQ/JSON-LD一致。キノコの動物性扱いも訂正。
- Homeだけ早見表の乾燥系分類・完成セット表現を修正。商品価格/選定/計測は保持。
- 前候補の水棲5種条件を保持（豪ナガクビ/ジーベン/アフリカヌマ/ヒラリー/マコード）。外部条件整理16種、残103種は構造棚卸しのみ、全商品の適合確認ではない。
- 検証：714通りの商品不変・Home実mount GA不変・FAQ一致、Python75、16種条件/238renders、119種213cards PASS。Home3経路×3幅×3価格帯=27操作・注記展開9表示で横溢れ0/JS0。独立技術/内容レビュー指摘反映。
- 公開状況：PR233を修正版へ更新。merge・本番確認は未実施。旧除外案を公開しない。
- 既知範囲：入口による候補差は保持し説明。製品のHome固有長期実績や必要袋数を保証しない。実機読み上げ未確認。QA記録 docs/qa/home-product-hold-20261112.md。

## 2026-11-12 | Codex | 用品条件第2群・測定機能表示（未公開）
Reason: User requested remaining species verification and fixes. Approver: owner instruction to proceed; publication pending. BASE: 893e89d288f88e3439d4e8d1996f7e9ba724f732。商品削除・選定・URL・価格変更なし。
- 73117を温湿度計扱いする表示を修正。温度計/水温計/赤外線表面温度計/温湿度計を6商品で分離。GAのcategoryキー維持、display_categoryは表示と一致。
- 別売灯具・固定具・床材必要袋数の費用を候補合計と区別。
- 水棲6、陸ガメ7、湿地/ハコガメ3の条件を資料付き追加。計32種は条件照合のみ、87種は棚卸しのみ。全用品適合の完了ではない。
- アカアシ・エロンガータの診断食性を雑食へ。エロンガータ旧specsと種ページ3箇所、アカアシ種ページ食性も整合。
- テスト: 714選定/価格/商用データ不変、119種の実スペック描画、238条件描画、6計測器の実mount/clickイベント、75Python、KID269、案内人25、validate_species0。容器検査はWindowsの区切りをメモリ上で正規化して110/0・378/0/10、元ファイル未変更。
- Chromeローカル: 新16種×通常/all×320/390/1280=96表示、横はみ出し0・JSerror0。食性2ページ390px、価格帯3切替、参考資料展開も確認。実機スマホ/読み上げは未確認。
- 独立レビュー: 技術・3森林種・RSPCA/エロンガータ資料照合PASS。RVC資料は調査担当取得、独立再取得は403で未確認。
- 残件: 87種の外部条件、個別製品の適合全件、実内寸/必要数/UVB距離/療養用や飼料給与の根拠。guide-aridの森林群説明も別途。メーカー確認によりPRO L2は中大型/60〜90cm用であり、小型用との推測で外さない。
NEXT: 最新mainと差分を再確認、PRで公開判断。その後は残87種を優先順に継続。


## [2026-11-12] 用品資材の内容ハッシュによるキャッシュ対策
- Actor: OpenAI Codex
- Change: 3資材を参照する123 HTMLに内容ハッシュ版番号。更新スクリプト・回帰テスト、楽天通常更新でのHTML連動を追加。商品・価格・購入リンク・資材の処理内容は変更なし。
- Reason: PR #234配信後にブラウザで旧用品JSが残ったため。
- PR/Commit: codex-version-equipment-assets-20261112（公開結果はPRに追記）
- Approver: Owner。将来の楽天自動更新がHTMLも変更する旨を説明後「いいよ」。
- Conforms: 最新mainと独立レビューを確認して公開。ブラウザデータの消去は行わない。

## 2026-11-12 Home セオレ法令訂正・候補復旧
- BASE 88b143a9。CITES I・国際希少野生動植物種（2026-03-05）を環境省/JWRCで確認。種ページ・診断・master・識別・一覧資料を同期。登録票と飼育継続を区別。
- 旧候補消失に伴う再作成。専用4件/validate0/0/714用品/238renders/asset hash PASS。全Python96件のうち既存GA4環境1 ERROR。他95成功。未公開。

## 2026-11-13 Home法令訂正のPC検証
- Libraryで回収した候補へ診断推薦除外・直接URL参考表示・30日譲受届を追補。資料・種ページ・既飼育者用品は保持。
- Python96全PASS。Windows既存tzdataを利用。商品714構成、他118種早見表、Chrome表示確認。Owner了承に基づきPR経由で公開工程へ。

## 2026-11-13 他種7種の法令訂正
CITES区分/個体群/亜種例外と国内規制を分離。パンケーキ登録票、スライダー飼育/無償譲渡条件を同期。独立レビューと回帰・Chrome確認を実施。詳細 docs/qa/other-species-law-20261113.md。公開実測はPRコメントへ。


## 2026-11-13 — PH-73を便利ワザの排水例へ追加（未公開候補）
- Actor: Codex / Change: keeper-hacksの折りたたみ内にメーカー確認済みPH-73の仕様・選ぶ条件・公式出典を追加。専用テスト2件。
- Reason: Ownerの「商品を追加するものはない？」と便利ワザ強化依頼。初期表示の長文化、架空体験、未確認購入リンクを避ける。
- BASE: 17c981ae55867343f43eeab478f600ff11acd934 / PR #238（Draft）・実装commit aad07fc2。
- Approver: Ownerの作業依頼の範囲。merge/公開は未実施。Conforms: 専用9・Python98 PASS、実Chrome3幅、独立レビューBLOCKER0、購入URL8本/GA/CITES不変。


## [2026-11-13] 用品条件の全119件照合と診断ルート統一
- Actor: ChatGPT（実装・独立内容/技術レビュー）。Approver: Owner「3早く終わらせて」「終わるまで止めないで」。
- Change: 未公開12件を回収、残75件の対象範囲を判定し全119件に出典範囲つき条件を表示。slugなし6件も名前照合で条件を追加。購入表示条件は変更せず。通常/allの46件の候補差を解消。
- Reason: 既存調査を繰り返さず未処理を閉じる。飼育実例を尊重し、科群共通資料を種固有の商品適合認定へ変えない。
- Related: インプレッサ等の本文整合、共通ゲル/ビタミン/照明バッジ、カントン容器根拠。商品・リンク・価格・計測・通常診断の選定は維持。
- PR/Commit: codex-equipment-finish-20261113（本コミット）。最終merge/本番確認はPRコメントに記録。
- Conforms: 最小差分、既存資料回収、出典の適用範囲、全件台帳、全回帰・実画面確認。

- 最終補完：slugなし6件にも既存の用品表示があるため、日本語名で条件を表示。出典注記のない既存条件で「undefined」が出る不具合も修正。全119件の条件欠落を検査する。

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


### 追加検証 2026-11-13

cloudの既存Pythonで同一PR HEADの全111テストPASS。PCのtzdata不足で失敗していた2件も成功。Git管理外の独立一時検証環境で実行し、コード・保護・テストは不変。実画面は引き続き未確認。

## [2026-11-13] Diagnosis entry UX (pending PR)
- Actor: OpenAI assistant.
- Change: dynamic total question counts; native route buttons; visible focus and readable entry text; semantic main landmarks on home/diagnosis. Regression tests added/updated.
- Reason: remove the eight-versus-ten question contradiction and restore keyboard/accessibility semantics without changing diagnosis decisions.
- PR/Commit: codex-diagnosis-ux-20261113, pending review; not merged.
- Approver: owner requested sequential fixes and completion; parent controls publication order.
- Conforms: no scoring/species, commerce, tracking, legal or billing changes.

- Review follow-up (2026-11-13): routes.js now uses the existing LF-normalized SHA256/12-character asset version scheme and is included in automatic asset-version refresh. Dedicated tests verify the rendered reference and fixture propagation, avoiding old cached eight-question descriptions. Final Node regression log: diagnosis-ux-qa/node-final.log (the earlier node.log retains an intermediate test-harness failure).
