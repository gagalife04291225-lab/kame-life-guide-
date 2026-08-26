# AI-HANDOFF — AI作業の現在状態（単一正本）

> **このファイルが「今どこまで終わっていて、次に何をするか」の唯一の正本。**
> ChatGPT → Claude Code → 完了報告 → ChatGPT の往復で、
> 完了済み作業の再調査・次工程の取り違え・固定事項の再検証を防ぐために置いている。
>
> - **作業開始前に必ず読む。** ルールは `CLAUDE.md`「重複作業防止ゲート」と
>   `.claude/rules/chatgpt-handoff.md` にある。
> - **作業終了時に必ず更新する。** 更新手順は本ファイル末尾「更新ルール」。
> - **現在状態だけを書く。** 履歴は `AI_CHANGELOG.md`（append-only）、
>   規範は `DEVELOPMENT_CONSTITUTION.md`、恒久ルールは `CLAUDE.md`。ここに重複させない。

---

## CURRENT_BASE

| 項目 | 値 |
|------|-----|
| 基準 | **PR #78**（商品スニペット無効108件の解消 / merge 待ち）。`origin/main` は PR #76 時点 |
| 確認方法 | `git merge-base --is-ancestor <本PRのcommit> origin/main` が真であること |
| 最終更新日 | 2026-08-26 |
| 作業ブランチ | `claude/gemma-github-fj689h` |
| 作業ツリー | clean（origin/main と一致） |

---

## COMPLETED — 完了済み。**再調査禁止**

以下は結論が確定している。**再調査・再監査・再実装しない。**
再開できるのは「重複作業防止ゲート」の4条件を満たす場合のみ。

### 直近の連続作業（difficulty ／「初心者」表現）

| PR | 作業 | merge | 確定した結論 |
|----|------|-------|-------------|
| #51 | 難易度体系5段階化 STEP 1 | `e4b3992` | `species-list.html` の難易度UIを正本5値へ。`LEGACY_DIFF` で旧URL互換。`?diff=初心者向け`=18件を維持 |
| #52 | 「初心者」公開表現 Phase B-1（B分類） | `eae8d6e` | 冬眠まわり37件を修正。**HOLD 15件**（内訳は UNRESOLVED） |
| #53 | 「初心者」公開表現 Phase B-2（E分類） | `5fa7c9c` | CTA・関連リンク・ナビ37件を「はじめての亀」系へ。**HOLD 1件** |
| #54 | difficulty 公開表現整合 Gate | `61ceb48` | 既知5件を**すべて判定A（正本が正しい）**で確定。「非推奨」を廃止 |
| #55 | difficulty 表示層の完全同期 | `e51fc09` | badge/stat-item の不一致28件を解消。**公開difficulty表示249箇所の不一致0** |
| #56 | AI引継ぎ・重複作業防止システムの整備 | `4fc0952` | 本ファイルを現在状態の単一正本として新設。`CLAUDE.md` と `.claude/rules/chatgpt-handoff.md` に読取ゲート・更新義務・NEXT HANDOFF ブロック・プロンプト生成規則を追加 |
| #57 | AI-HANDOFF の CURRENT_BASE を同期 | `ed14074` | 本ファイル自身を merge 後の main へ同期 |
| #58 | A-1 quick-facts のラベル置換 | PR #58 | species 26ページの `初心者向き？` → **`飼育難易度`**。値・理由文・色・アイコンは無変更。HOLD 0件。`compare/hermann-vs-greek.html` の「どっちが初心者向き？」3件（title / OG / hero-sub）は `<strong>` 形ではなく**対象外**として維持 |
| #59 | A-4 FAQ問いの可視・JSON-LD同期 | PR #59 | 5ページの `初心者向けですか？` → **`はじめて飼う亀に向きますか？`**。可視 `<summary>` と JSON-LD `"name"` を同一commitで完全一致。回答本文は無変更。HOLD 0件。**可視FAQとJSON-LDの同時修正を初めて適用し、成立を確認した** |
| #60 | H1 B分類の JSON-LD複製14件を同期 | PR #60 | 可視FAQ（`faq-body` / `h3`）と JSON-LD（`acceptedAnswer.text` / `"name"`）を同一commitで完全一致。14件×2箇所=28箇所。意味・安全性・推奨強度は不変。HOLD 0件。**B分類は 51/52 に到達**（残る B18 は A-5 と不可分のため NEXT へ） |
| #61 | A-5 見出し3件 ＋ B18 本文1件 | PR #61 | `<h2>初心者に向くか</h2>` → **`はじめての1頭に向くか`**（3件）と、`むしろ初心者と相性の良い面があります` → **`むしろはじめての1頭として相性の良い面があります`**（1件）。JSON-LD複製なし。HOLD 0件。**B分類 52/52 完了** |
| #62 | H2 shindan の「初心者TOP3」＋説明文を同時処理 | PR #62 | `初心者TOP3` → **`はじめての亀 TOP3`** と、それを名指しする `ec-text-sub`「初心者向けTOP3や比較ページも…」→ **`はじめての亀 TOP3や比較ページも…`** を同一commitで変更。JSON-LD複製なし。`href`・`id`・GA4・診断ロジックは無変更。**未処理HOLDが0になった** |
| #63 | N1 AI_CHANGELOG の欠落補完 | PR #63 | `AI_CHANGELOG.md` に **Merge済み PR 47件（#13〜#62）** を1エントリ1件で追記。既存2エントリは1文字も変更していない（append-only）。**想定の「#44〜#62 の19件」ではなく47件が欠落**していた（既存2エントリは PR ではなく branch commit を指していた）。Automation 31件・直push 5件は merge ではないため §9.3-R1 の対象外と判断 |
| #64 | C分類22件「初心者におすすめ」系の置換 | PR #64 | 22件 / 15ファイルを「はじめて飼う方」系へ。推薦強度・意味は不変。HOLD 0件。`species/mississippi-map-turtle.html` の1件のみ JSON-LD 複製があり可視と同一commitで同期（可視1 + LD1） |
| #65 | D分類24件「初心者には難しい」の理由明示化 | PR #65 | 24件 / 22ファイル。抽象的な警告を**その種で実際に難しい理由**へ書き換え。理由は各ページ本文・`species.js` の reason・「向いていない人」欄から取得（推測なし）。警告強度は不変。HOLD 0件。JSON-LD複製2件（`hermann-dry-template` / `three-toed-box-template`）は可視と同一commitで同期 |
| #66 | F分類12件（読者層・採点基準・UI例文） | PR #66 | 12件中 **11件を置換・1件を HOLD**。F1 3件は「初心者向けに解説します」→「はじめて飼う方に向けて解説します」、F2 6件は「初心者が〜」→「はじめて飼う方が〜」（1件のみ「初心者には見逃しやすい」→「飼育経験が浅いうちは見逃しやすい」）、F3 は `annainin` の placeholder のみ置換。**JSON-LD複製は0件**（4ファイルの JSON-LD に `初心者` は残るが、すべて `headline`/`description`/`name` = SEO②領域で F の対象文ではない）。**HOLD 1件 = F3-2 `annainin/index.html:74` の topic-btn 可視ラベル「初心者向け」**（理由は FIXED_FACTS 参照） |
| #68 | annainin の語彙統一（H4 + N2） | PR #68 | `annainin` 内の公開語彙を**「はじめての方向け」系へ統一**し、**H4 と N2 を同時に解消**。可視ラベル / `data-quick-reply` / `TOPIC_QUICK_REPLIES` / bot応答本文2件の**計4箇所**を同一commitで整合。`INTENT_RULES` の beginner キーワード `['初心者','はじめて','初めて','入門']` は**1文字も変更していない**（「初心者」と手入力するユーザーは beginner のまま）。`annainin` 配下の公開表示から「初心者」は**0件**になり、リポジトリに残るのは非表示の分類キーワード1件のみ |
| #69 | A分類28件の着手ゲート → **STOP（サイト変更0）** | PR #69 | `NEXT` の「A分類の残り28件」を現mainから再抽出しようとしたが、**28件を機械的に特定できないことが判明**して STOP した。原因は **Phase A の per-item 分類リストがリポジトリのどこにも保存されていない**こと（残っているのは分類ごとの件数だけ）。28件を確定するには Phase A の分類をやり直すしかなく、それは `DO_NOT_REPEAT` で禁止されている。**公開HTMLの「初心者」155行の分布を実測して記録し、代わりに機械判定できる `NEXT` を再設定した。** サイトファイルの変更は0件 |
| #70 | A-6 難易度の軸ラベル18行 | PR #70 | 機械条件で18行を再抽出し**行番号まで完全一致**。1件ずつ文脈確認し、**compare の `<td>初心者適性</td>` 6件を `<td>飼育難易度</td>` へ**。**セルの値は1文字も変更していない**（各ファイルで変化した `<td>` はラベル1個のみ）。**残り12件は HOLD**（内訳は UNRESOLVED の H5〜H7）。JSON-LD複製0件。`species/` の difficulty 表示227件は変更前後で完全一致、`species/` `shindan/` の変更0 |
| #71 | H7 解消 — スコア表の軸名を表と導入文で統一 | PR #71 | 5行を再抽出して完全一致を確認し、`初心者向け度`／`初心者向き度` → **`はじめての方向け度`**、`<th>初心者向け</th>` → **`<th>はじめての方向け</th>`** へ。同一ページの導入文と `<th>` を同一commitで揃えた。**`score-dots` の `filled` 数は前後で完全一致**（低臭 152/48・小型 80/20）＝値は無変更。`method-sub`「情報量・飼育データの豊富さ」と他の列ラベルも無変更。**対象2ファイルの「初心者」は0件**になった。`index.html:4156` の同一文字列は H5 のため無変更 |
| #72 | E-2 `shindan/index.html` の関連リンクカード15行 | PR #72 | 15行を再抽出して行番号まで一致を確認し、**`name: '初心者向け亀'` → `'はじめての亀'`（11件）／`name: '初心者向け亀比較'` → `'はじめての亀比較'`（1件）／`desc: '初心者おすすめ比較'` → `'はじめて飼う方におすすめ'`（3件）／`desc: '丈夫で初心者向き'` → `'丈夫ではじめてでも飼える'`（3件）**。**`url:` 66件の並びは完全一致**、キー名の並び・カード総数66も不変。`COMPARE_MAP`（17 slug）と `ROUTE_FALLBACK`（5キー）を構造比較し **url / 件数 / 順序の差分0・ラベル変化15**。5ルート＋変更カードを含む4シナリオを実描画し href・件数・順序が一致、JSエラー 0/0 |
| #73 | E-3 `shindan/index.html` の可視6行 | PR #73 | バッジ2件 `'🎯 初心者向き'` → **`'🎯 はじめての方向け'`**／生成文2件 `初心者向けの回答…` → **`はじめての方向けの回答…`**／`reason:` 2件 `初心者に最も適した` → **`はじめての1頭に最も適した`**。**`shindan/index.html` の「初心者」はコメント8件のみ**になった。変数名・キー名・`url` 66件・`difficulty`・`beginner` 識別子45件は不変。**新発見: `shindan/species.js` の `reason` に可視の「初心者」が3件残っている**（変更禁止指定のため対象外。詳細は `N4`） |
| #74 | N4 解消 — `shindan/species.js` の `reason` 3件 | PR #74 | **安全ゲート通過**（`species.js` 内に `reason` 参照0件＝`match()`/`score()` 未使用。消費は表示3箇所のみ）。ロシアリクガメ `初心者にも人気` → **`はじめて飼う方にも人気`**／クサガメ `初心者にも飼いやすい` → **`はじめてでも飼いやすい`**／トウブドロガメ `初心者にも向く` → **`はじめての1頭にも向く`**。**difficulty 118件と分布（入門11 / 入門〜中級7 / 中級23 / 中〜上級38 / 上級39）は完全不変**、`reason` 以外の全フィールド（name/latin/slug/cites/size/match/score/priority/availability/emoji/legal/hasPage）も不変。**`shindan/` の公開表示から「初心者」が0件**になった（残るのは `index.html` のコメント8件のみ） |
| #75 | N5 解消 — `js/` 配下の共有スクリプト8件 | PR #75 | **安全ゲート PASS・HOLD 0件**（8件とも比較・分岐 / GA4 / href / キー参照のいずれにも未使用）。8件すべてを **`はじめての方向け`** に統一。`js/quick-facts.js` 2（CTA・111ページ）／`js/starter-kit.js` 2（`🔰` tierバッジ・113ページ）／`js/comparison-cta.js` 2（`points` 配列・12ページ）／`js/ranking-engine.js` 2（ランキング名）。キー名・`icon`・`tier`/`cat` 判定条件・`weights`・`comparePage`・配列要素数・`href` はすべて不変。**`js/` 配下の「初心者」は `annainin.js:127` の非表示キーワード1件のみ**になった |
| #76 | 最終フェーズ — U2 + H5 + H6 + N3 | PR #76 | **「初心者」表記整理プロジェクトを CLOSED**。U1 は変更しないと決定してクローズ（★の71ページ再割り当ては実施しない）。U2 = `CLAUDE.md` に「公開語彙ルール — 「初心者」」を新設（18行の最小差分）。H5 6件 = 難易度軸へ統合せず別軸のまま `はじめての方向け` / `はじめての1頭◎` へ。**既存の「飼育難易度」行は無変更**。H6 3件 = E扱いで一般公開コピーとして置換（勝者バッジ / hero-stat / gh-card-tag）。N3 29件 = **変更17 / 内部互換HOLD 1 / SEO不可分HOLD 11** に分類し、17件を同工程で実装。**公開HTMLの「初心者」は 123 → 97 行になり、説明不能な公開表示は0件** |
| #78 | 商品スニペット無効108件の解消 | PR #78（**merge 待ち**） | GSC 実測エラー「offers、review、または aggregateRating を指定する必要があります」の解消。`*-best10.html` 7ファイルの JSON-LD `@graph` から **`ItemList` ノードのみ削除**（108アイテム）。`Article` / `BreadcrumbList` は1バイトも変更せず、**JSON-LD 以外の全文が7ファイルとも完全一致**。実描画で Amazon リンク109本・アフィリID付き109本・本文長・h1 が変更前と一致、JSエラー 0/0。**削除のみ（683行削除 / 追加0行）** |

**PR #54 / #55 で確定し、二度と問い直さない判定:**

- `yellow-bellied-slider` = **入門**（公開側の「入門〜中級」が誤りだった）
- `hirase-turtle` = **中〜上級**（公開側の「上級」「非推奨」が誤りだった）
- `matamata` / `sulcata-tortoise` = **上級**（「非推奨」は難易度値ではなかった）
- **「非推奨」「最上級」は難易度値として廃止。** 正本5値以外を公開難易度欄に置かない
- 括弧付き難易度（`中級（入手性は上級並み）` 等）4件は削除済み。補足は既存本文がカバー
- `SHINDAN-SPECIES.md` の *Cuora mouhotii* 二重登録は**解消済み**。
  「モンホットハコガメ」はヒラセガメの**別名**（`species-master.json` の `wamei_aliases`）

### その前の連続作業（種一覧・分類・ガイド同期）

| PR | 作業 | merge |
|----|------|-------|
| #41〜#44 | PR監査／内部リンク残件／species一覧のグループ化／ガイド9本のspecies同期 | `c3b00c1` `1e86385` `07fbd28` `cdc1de1` |
| #45 | 種一覧の4重管理を解消し `species.js` から自動生成 | `f917ebe` |
| #46 | ガイド相互ナビを8本×7リンクの完全メッシュに | `e2126d2` |
| #47 | `species-list` のSEO件数表記を実態に合わせる | `ae54182` |
| #48 | `guides/index.html` のカテゴリを 3/8 → 8/8 に | `9ffbb9d` |
| #49 | 生息環境フィルタを6大分類へ統一（Phase 1C・`LEGACY_HAB` 互換） | `4aed4f0` |
| #50 | 6大分類UIを生成管理へ（Phase 1D） | `838c79f` |

### CLAUDE.md にクローズ記録がある完了プロジェクト（**ここに複製しない**）

- **亜種PROJECT**（Phase A/B/C）… 2026-08-24 正式クローズ。候補集合を使い切り未判定ゼロ
- **生体写真の監査・差し替え**… 2026-08-23 完了。出典URL重複0・MD5重複0
- **HOLD 4件の写真素材**… 2026-08-24 調査クローズ。能動的な再探索を行わない

---

## FIXED_FACTS — 固定入力。**再検証しない**

### 種データ

- **difficulty 正本5値**（正本は `shindan/species.js` の `difficulty`）
  `入門 11 / 入門〜中級 7 / 中級 23 / 中〜上級 38 / 上級 39` = **118**、正本外の値 0
- 掲載種 **118**、うち個別ページを持つ種 **112**
- **6大分類**（正本は `tools/taxonomy.js` の `GENUS_CAT` / `CAT_ORDER`）
  `リクガメ 27 / ヤマガメ・ハコガメ 22 / 半水棲 18 / 水棲（淡水）29 / 汽水 6 / スッポン・曲頸 16` = 118
- **公開difficulty表示は正本と完全同期済み**
  `diff-badge 112 / quick-facts 26 / stat-item 111` = **249箇所・不一致0**
- badge の★は `入門★1 / 入門〜中級★2 / 中級★3 / 中〜上級★3 / 上級★4`
  （中級と中〜上級が★3で重なっている。UNRESOLVED を参照）

### 「初心者」公開表現（Phase A の分類・**再分類しない**）

- 公開表示 **239件 / 87ファイル**（基準 `6bb2fb0`）
  `A 難易度 62 / B 飼育経験 52 / C おすすめ 22 / D 注意・警告 24 / E 見出し・CTA・ナビ 67 / F その他 12`
- 処理済 183件（B-1 37 + B-2 37 + A-1 26 + A-4 5 + H1 14 + A-5 3 + B18 1 + H2 2 + C 22 + D 24 + F 11 + H4 1）→ **残 56件**
- **A-1 は完了。** species 個別ページの quick-facts ラベルは `飼育難易度`。
  `初心者向き？` は species/ 配下に残っていない
- **B分類（飼育経験）52件は 52/52 完了・未処理0。** 冬眠まわりの可視文とJSON-LDは同期済み。
  **B分類はクローズ。再監査しない**
- **A-5 は完了。** 見出しは `はじめての1頭に向くか`。
  `初心者に向くか` はリポジトリ内に残っていない
- **C分類（おすすめ・選び方）22件は完了・未処理0。** 「初心者におすすめ／人気／飼いやすい」は
  「はじめて飼う方」「はじめてでも」「はじめての1頭」系へ置換済み。推薦強度は変えていない。
  **C分類はクローズ。再監査しない**
- **D分類（注意・警告）24件は完了・未処理0。** 抽象的な「初心者には難しい」を
  難所を名指しする文へ書き換え済み。難所の内訳は
  湿度・温度の同時管理9 / 情報・流通の乏しさ3 / 汽水・塩分管理2 / 終生サイズ2 /
  給餌・取り扱い1 / 除外リストの条件化2 / 冬眠4 / 主語削除1。
  **D分類はクローズ。再監査しない**
- **F分類（その他）12件は 12/12 完了・未処理0。** 残っていた H4 は PR #68 で解消済み。 読者層の指定・採点基準の説明・UI例文を
  「はじめて飼う方」「飼育経験が浅いうちは」系へ置換済み。**F分類はクローズ。再監査しない**
- **残る未処理は A分類の残り28件（62 − A-1 26 − A-4 5 − A-5 3）と
  E分類の残り28件（67 − B-2 37 − H2 2）の合計56件。**
  （旧記述の「E 30件」は内訳と合っていなかったため、固定入力どうしの差し引きで訂正した。
  Phase A の分類そのものはやり直していない）
- **`annainin` の公開表示から「初心者」は0件。** `js/annainin.js` に残る1件は
  `INTENT_RULES` の分類キーワードで**非表示・変更禁止**（N2 は解消済み）
- **未処理の HOLD は 0。** Phase B-1 / B-2 由来の HOLD 16件（JSON-LD複製14 + B18 1 + H2 1）は
  すべて解消済み。以後、これらを HOLD として扱わない
- **`shindan/index.html` の exit-capture カードは `はじめての亀 TOP3` 系で統一済み。**
  `ec-btn-guide` の `href` / `id` / GA4イベント（`exit_capture_click` / `target_type`）は無変更
- **A-4 は完了。** 対象5ページのFAQ問いは `はじめて飼う亀に向きますか？`。
  可視 `<summary>` と JSON-LD `"name"` は一致している。
  残る「初心者向けですか？」2件は**複合質問で対象外**
  （`guide-beginner.html`「リクガメと水棲ガメ、どちらが初心者向けですか？」／
  `species/razorback-musk-turtle.html`「ニオイガメとカブトニオイガメ、どちらが初心者向けですか？」。
  いずれも Phase A では E分類）
- **「初心者向け」→「入門向け」の一律置換は禁止。** 「入門」は既に難易度値として
  公開HTML内で128件使われており、件数の異なる集合が同じ語になる
- **商品スニペット（Product リッチリザルト）はサイトとして出さない方針**（PR #78）。
  本サイトは商品を販売しておらず Amazon へ送客する比較記事のため、Google の Product
  構造化データが想定する「自サイトの商品ページ」に当たらない。
  `offers`（価格・在庫）の追加は **Amazon アソシエイト規約リスクのため恒久的に禁止**。
  GSC 実測でも商品スニペットは **有効0**（一度もリッチリザルト表示に至っていない）
- **`*-best10.html` 7ファイルの JSON-LD は `Article` + `BreadcrumbList` の2ノードで確定**（PR #78）。
  `ItemList` は再追加しない。best10 の商品リンクは `js/affiliate-track-static.js` が
  イベント委譲で計測しており、**静的HTMLに Amazon リンクは0本**（JSが生成）。
  したがって JSON-LD の変更は可視リンク・計測に一切影響しない
- **構造化データの実測（PR #78 の調査で確定・再走査しない）**
  Product は `*-review.html` 6ファイルのみ（`name` + `brand` + `review` のみで
  `image`/`offers`/`aggregateRating`/`sku` なし）／microdata 0 ／JSによる JSON-LD 動的注入 0 ／
  `offers`・`aggregateRating`・`price`・`sku`・`gtin` はサイト全体で 0 件
- **「初心者」表記整理プロジェクトは CLOSED**（PR #76）。**新しい調査フェーズを作らない。**
  公開HTMLに残る97行は全件が次のいずれかで説明できる（PR #76 で全件走査・再調査しない）:
  **SEO運用HOLD 80**（`title` 6 / `meta`・OG 33 / JSON-LD 26 /
  可視FAQ×JSON-LD 1対1 の3 / 見出し h1-h6 9 / パンくず 3）／
  **内部互換 5**（`?diff=初心者向け` の `href` 2 / `<option value="beginner">` 1 /
  GA4 `page_title` 1 / `species-list.html` の `LEGACY_DIFF` キー 1）／
  **明示HOLD 2**（`aria-label`（h1と対）1 / `compare/hermann-vs-greek.html` の `hero-sub`（title・OGと対）1）／
  **非表示コメント 10**
- **SEO系（`title`/`meta`/OG/JSON-LD/見出し/パンくず）80行は GSC/GA4 の実測トリガーなしに変更しない。**
  `CLAUDE.md` の「公開語彙ルール — 「初心者」」と `docs/operations/DECISION_RULE.md` が正本
- **U1 は「変更しない」で決着**（PR #76）。badge★の71ページ再割り当ては実施しない。
  ★・difficulty・色・アイコンは現状のまま**変更禁止**
- **H5 の6件は難易度軸へ統合しない**と決着（PR #76）。別軸として `はじめての方向け` を維持し、
  同じ表・カードの「飼育難易度」「難易度」行はそのまま残す
- **`js/` 配下の共有スクリプトの公開語彙は `はじめての方向け` で確定**（PR #75）。
  `quick-facts.js` の Sticky CTA（`isEasy` = difficulty に「入門」で長文/短文を出し分け）／
  `starter-kit.js` の `🔰` tierバッジ（food×budget と enclosure の既定）／
  `comparison-cta.js` の `points` 配列（比較の観点名）／`ranking-engine.js` の `label`。
  **`js/` に残る「初心者」は `annainin.js:127` の `INTENT_RULES` 1件のみで、非表示・恒久的に変更禁止**
- **`js/` 配下の共有スクリプトの影響範囲**（PR #75 実測・再調査しない）。
  `quick-facts.js` **111ページ** / `starter-kit.js` **113ページ** / `comparison-cta.js` **12ページ** /
  `ranking-engine.js` **0ページ**（どのHTMLからも読み込まれていない）
- **`shindan/species.js` の `reason` は表示専用フィールド**（PR #74 で全走査して確定・再調査しない）。
  `species.js` 内に `reason` の参照は0件で、`match(scores)` / `score(scores)` は
  スコアオブジェクトしか見ていない。消費するのは表示3箇所だけ:
  `shindan/index.html:2895`（`textContent`）／`shindan/index.html:3854`（`runnerup-desc`・48文字スライス）／
  **`species-list.html:677`（`<p class="sp-reason">`・118件）**。
  → `reason` を1箇所直すと診断結果と種一覧の両方に反映される
- **`shindan/` 配下の公開表示から「初心者」は0件**（PR #74）。
  `species.js` 0 / `index.html` 可視0 / `routes.js` 0 / `equipment.js` 0。
  `index.html` に残る8件はすべてコメントで画面に出ない（恒久的に対象外）
- **診断結果のメイン説明文（`#res-reason`）は `shindan/species.js` の `reason` を描画している**
  （PR #73 の実描画で確定・再調査しない）。`shindan/index.html` 側の `reason:` 2件
  （`:2668` の exotic 安全 fallback / `:2860` の fallback 種）は**通常経路では表示されない**
- **`shindan/index.html` の可視文字列は確定**（PR #73）。バッジ `🎯 はじめての方向け`／
  生成文 `はじめての方向けの回答…`／fallback `はじめての1頭に最も適した`。
  **`shindan/index.html` に残る「初心者」8件はすべてコメントで画面に出ない。恒久的に対象外**
- **バッジは3系統**（PR #73 で実行時に確認）。`BARRIER_BADGE_ADVANCED`（difficulty に「上級」）/
  `BARRIER_BADGE_MAP`（8キー・equipKey 一致）/ `BARRIER_BADGE_BEGINNER`（difficulty に「入門」）。
  **変数名・キー名は互換のため変更しない**（`beginner` を含む識別子は45件あり、いずれも内部識別子）
- **`shindan/index.html` の関連リンクカードは2つのマップで定義されている**（PR #72 で確定・再調査しない）。
  `COMPARE_MAP`（種 slug 別・**17 slug**）と `ROUTE_FALLBACK`（`land` / `aquatic` / `forest` /
  `exotic` / `all` の5キー）。**カード定義は合計66件**で、描画は
  `res-compare-card-name` / `-desc` / `-btn`（`href`）の単純な文字列連結。
  `.res-compare-card-name` / `-desc` に**省略（ellipsis / line-clamp）や固定幅はない**ため、
  ラベルの文字数が増えても折り返すだけで切れない
- **診断の関連リンクカードの語彙は確定**（PR #72）。`はじめての亀` / `はじめての亀比較` /
  `はじめて飼う方におすすめ` / `丈夫ではじめてでも飼える`。**`url:` は1件も変更していない**
- **スコア表（`cmp-table` + `score-dots`）の列は「ドットが多いほど良い」向きで統一されている**
  （PR #71 で確定・再確認しない）。ニオイ管理／排泄量少なさ／掃除頻度少なさ／ニオイ管理しやすさ／
  **はじめての方向け**。**この軸に `飼育難易度` を使わない** — 使うと多いほど難しい＝悪い、と読めて
  列の向きが反転する。値（`dot filled` の数）は変更禁止なので、ラベル側を反転させない語に揃える
- **スコア表の軸名は `はじめての方向け`（表の `<th>`）/ `はじめての方向け度`（導入文・`method-label`）で確定**（PR #71）。
  導入文と `<th>` は**常に同一commitで揃える**
- **compare 系の★は「多いほどやさしい」**（PR #70 で全 compare ページを実測して確定・再調査しない）。
  `飼育難易度 ★★★★★ 入門向き` / `★★★★☆ 初中級` / `★★★☆☆ 中級` /
  `★★☆☆☆（中〜上級者向け）`。**species 個別ページの diff-badge とは向きが逆**なので、
  compare の★を species の★と同じ規則で読み替えない（★の統一は U1 の範囲）
- **compare の比較表の難易度軸ラベルは `飼育難易度` で統一済み**（PR #70）。
  値（★・◎・○・―・括弧の補足）は一切変更していない
- **Phase A の per-item 分類リストは repo に存在しない**（PR #69 で確定・再探索しない）。
  残っているのは分類ごとの件数（A62 / B52 / C22 / D24 / E67 / F12）だけで、
  「どの行がA分類か」の一覧は `docs/` にも `AI_CHANGELOG.md` にも `CLAUDE.md` にも無い。
  **したがって「A分類の残り28件」は機械的に再現できない。** 件数からの差し引き（62−26−5−3=28）は
  合計としては正しいが、対象行を一意に決めるだけの情報がない
- **公開HTMLの「初心者」分布（main `3e84381` 実測・155行）**
  変更禁止 66行（`title` 6 / `meta`・OG 33 / JSON-LD の `headline`・`description`・`name` 21 /
  パンくず 2 / `href` 2 / `<option value="beginner">` 1 / GA4 `page_title` 1）／
  E分類側の見出し（h1-h6）9行／**本文・ラベル 80行**
- **本文・ラベル80行のうち、難易度の軸ラベルとして機械判定できるのは18行**（PR #69 で実測）。
  `<td>` 9 / `<th>` 3 / `.wb-badge` 1 / `.rank-badge-pill` 1 / `.gh-card-tag` 1 /
  `.method-label` 1 / `.stat-label` 1 / `index.html` の hero-stat 1。
  残る62行は A（難易度）か C（おすすめ）か D（警告）か E（見出し・CTA）かを
  **文脈判断しないと分けられない** = Phase A の再分類にあたる
- 採用する語彙（サイトに既に定着しているもののみ。新語を作らない）
  UI・見出し・CTA →「はじめての」／散文 →「はじめて飼う方」「飼育経験が浅いうちは」／
  条件・除外 →「飼育経験が中級までの方」／警告 → 難所を名指しする

### 構造上の制約（**再確認しない**）

- **JSON-LD の `FAQPage` が可視の `faq-body` / `h3` を1文字違わず複製している。**
  可視側だけを直すと構造化データと表示内容が乖離する。
  可視FAQを直すときは**同一commitでJSON-LDと完全同期**させる（PR #54 で条件付き許可済み）。
  **PR #59 / #60 でこの手順の成立を確認済み。**
  #59 は `"name"`、#60 は `acceptedAnswer.text` に適用。いずれも可視とJSON-LDを
  同時置換し、置換箇所以外に差分0・JSONパース成功を確認している
- 互換のため変更しない: `sort=beginner` / `?diff=初心者向け` / GA4イベント名 /
  `s.beginner` / beginner を含むURL・slug・ファイル名
- generator 5本（マーカー方式・`--check` で差分検出）
  `tools/taxonomy.js`（分類SSoT）/ `gen-category-ui.js` / `gen-species-list.js` /
  `gen-guide-species.js` / `gen-guide-nav.js`
- 本番URLの確認は本実行環境から不可（EGRESS_BLOCKED）。GitHub Pages 反映確認は亀好きさん側

#### `annainin`（亀の案内人チャット）の実測構造 — PR #66 / #68 で確定・**再調査しない**

- `js/annainin.js:347-349` のハンドラは `getAttribute('data-quick-reply')` **だけ**を読む。
  `.an-topic-btn` の可視ラベルは**一切読まれない**
- `submitUserText()` は送信テキストを**そのままユーザー発言バブルとして画面に描画**する。
  → 可視ラベルと `data-quick-reply` は**必ず同じ語彙に揃える**（PR #68 で揃えた）
- `TOPIC_QUICK_REPLIES`（`js/annainin.js`）は `data-quick-reply` と `textContent` の
  **両方**に同じ文字列を入れる。bot の返信ボタンは**可視表示**である
- bot 応答本文2件（`capability` / `unknown`）は **topic-btn 10個の可視ラベルを順に列挙**している。
  ラベルを変えたらこの2件も必ず同時に変える
- **`INTENT_RULES`（`js/annainin.js:127` 付近）は公開表示ではない分類語彙。**
  beginner キーワード `['初心者','はじめて','初めて','入門']` は**恒久的に変更しない**。
  「初心者」を削ると「初心者」と手入力したユーザーが `unknown` に落ちる
- **annainin の公開語彙は「はじめての方向け」で確定**（PR #68）。
  topic-btn 可視 `はじめての方向け` / `data-quick-reply` と `TOPIC_QUICK_REPLIES[0]` は
  `はじめての方向けの亀は？`。**この4箇所は今後ばらばらに変更しない**
- GA4 は `annainin_view` / `annainin_message_sent` / `annainin_intent_classified` /
  `annainin_feature_link_click` の4種。イベント名・パラメータ名は無変更。
  `message_length` は送信文の長さそのものなので、文言を変えれば値は変わる（9→12）。
  これは仕様どおりで、GA4 定義の変更ではない

### 変更履歴（AI_CHANGELOG）

- **`AI_CHANGELOG.md` は Merge済み PR #13〜#62 を全件記録済み**（PR #63 で補完）。
  §9.3-R2 の7項目（Date / Actor / Change / Reason / PR・Commit / Approver / Conforms）を
  47/47 で満たし、記載した merge commit は 47/47 が実在する
- **記録対象は「Merge済み変更」＝PR merge のみ。** Automation（rakuten 価格更新・main 直 push）と
  直 push は §9.3-R1 の「Merge 済み変更」に当たらないため記録しない
- 欠番 **#14 / #16 / #35** は main に Merge されていない
- 各エントリの Change / Reason は Git 履歴（merge commit・PRブランチのコミット本文・変更統計）から
  取った事実のみ。**推測で補っていない**

### 正本ファイルの所在

| 対象 | 正本 |
|------|------|
| difficulty・種データ | `shindan/species.js` |
| 学名・CITES・難易度の参照表 | `SHINDAN-SPECIES.md` |
| 分類（属→6大分類） | `tools/taxonomy.js` |
| 種のメタデータ・出典 | `data/species-master.json` |
| 恒久ルール | `CLAUDE.md` |
| 規範 | `DEVELOPMENT_CONSTITUTION.md` |
| 変更履歴（append-only） | `AI_CHANGELOG.md` |

---

## UNRESOLVED — 本当に未解決のものだけ

### 判断待ち

**なし。** U1 / U2 / H5 / H6 は PR #76 ですべて決着した。

| ID | 決着 |
|----|------|
| U1 | **CLOSE / 変更しない。** badge★の71ページ再割り当ては実施しない |
| U2 | **実施済み。** `CLAUDE.md` に「公開語彙ルール — 「初心者」」を新設 |
| H5 | **実施済み。** 難易度軸へ統合せず、別軸のまま確定語彙へ（6件） |
| H6 | **実施済み。** E扱いで一般公開コピーとして置換（3件） |

### HOLD（条件が揃うまで着手しない）

| ID | 内容 |
|----|------|
| H3 | 写真HOLD 4件・亜種HOLD — **`CLAUDE.md` の該当節が正本。** 能動的な再探索を行わない |
| H8 | **「初心者」の SEO運用HOLD 80行**（`title` 6 / `meta`・OG 33 / JSON-LD 26 / 可視FAQ×JSON-LD 1対1 の3 / 見出し 9 / パンくず 3）。**GSC/GA4 の実測がトリガーを引いたページのみ・週最大3ページ**という運営フェーズの方針に従う。**一斉置換は禁止。能動的に着手しない** |

### 新発見（未処理）

**なし。** N3 / N4 / N5 はすべて解消済み。

---

## NEXT — 次に実行する工程（**1つだけ**）

### PR #78 の Owner merge → GSC で「商品スニペット」の解消を確認

**PR #78（`claude/remove-itemlist-product-snippet`）は作成済み・merge 待ち。**
merge は Owner のみ（Constitution Invariant I1）。Agent は merge しない。

| 項目 | 内容 |
|------|------|
| **やること** | ① Owner が PR #78 を確認して merge ② GitHub Pages 反映を待つ（約60秒）③ GSC で `*-best10.html` 7URL を「URL 検査 → 公開URLをテスト」するか、リッチリザルトテストで `ItemList` が消えたことを確認 ④ GSC の「商品スニペット」レポートから108件が消えるまで待つ（**Google の再クロール待ちで数日〜数週間かかる**。すぐには 0 にならない） |
| **期待結果** | 商品スニペット: 無効 108 → 0（対象そのものが消えるため、レポートから項目ごと消える可能性が高い）。パンくずリスト31件・データセット1件は**無傷** |
| **変更しない** | `offers`・価格・在庫の追加（Amazon 規約リスク・恒久禁止）／`*-review.html` の Product 6件（今回は対象外。GSC 再確認後に判断）／H3・H8 |
| **注意** | GSC の反映は遅延する。merge 直後に 108 のままでも異常ではない |

**その次**（収益改善フェーズ）: Owner から実測データを受領して改善対象を決める。
必要な最小チェックリストは調査済み（下記 `FIXED_FACTS` / 過去の引き継ぎ報告）。
最小は ① GSC 検索パフォーマンス > ページ（過去28日・表示回数上位20）と
④ Amazon アソシエイト > 売上（過去30日・商品名/ASIN/発生日）の2つ。

> **UNRESOLVED を勝手に処理しない。** H3（写真・亜種）は再探索禁止、
> H8（SEO系80行）は GSC/GA4 の実測トリガーなしに着手しない。

---

## 更新ルール（作業終了時に必ず実施）

Claude Code は各作業の完了後、**同じPRの中で**本ファイルを更新する。

1. **CURRENT_BASE** — 基準（今回のPR）と最終更新日を書き換える。
   merge commit は本ファイルを書く時点では確定しないため、**PR番号で記す**。
   次に作業する側は `git log --oneline -1 origin/main` で実測し、
   `git merge-base --is-ancestor <該当PRのcommit> origin/main` が真であることを確認する
2. **COMPLETED** — 完了した NEXT を移す。PR番号・merge commit・**確定した結論**を必ず書く
3. **FIXED_FACTS** — 新たに確定し、今後は入力として使う事実を追記する
4. **UNRESOLVED** — 本当に未解決のものだけ残す。判断待ち / HOLD / 新発見 を区別する。
   解決したものは削除する
5. **NEXT** — 次の工程を**1つだけ**設定する。対象 / Scope / 変更禁止 / 完了条件を書く。
   複数工程の詰め合わせにしない
6. **古くなった状態記述を残さない。** 本ファイルは履歴ではなく現在状態。
   経緯は `AI_CHANGELOG.md` に、恒久ルールは `CLAUDE.md` に置く

**禁止事項**

- COMPLETED と NEXT に同じ作業を同時に置かない
- FIXED_FACTS に書いた事項を NEXT で再調査させる構造にしない
- 「たぶん終わっている」ものを COMPLETED に書かない。PR番号か merge commit で裏付ける
