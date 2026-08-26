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
| 基準 | **PR #65**（D分類24件の書き換え）を含む `origin/main` |
| 確認方法 | `git merge-base --is-ancestor <本PRのcommit> origin/main` が真であること |
| 最終更新日 | 2026-08-25 |
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
- 処理済 171件（B-1 37 + B-2 37 + A-1 26 + A-4 5 + H1 14 + A-5 3 + B18 1 + H2 2 + C 22 + D 24）→ **残 68件**
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
- **残る未処理分類は E（見出し・CTA・ナビ）30件 / F（その他）12件 / A分類の残り**。合計68件
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

### 判断待ち（亀好きさんの決定が必要。勝手に進めない）

| ID | 内容 |
|----|------|
| U1 | **badge★の1対1再割り当て。** 「最上級」廃止で★5が空いたため `中級★3 / 中〜上級★4 / 上級★5` にできるが、ラベルが既に正しい71ページ（中〜上級37 + 上級34）の★を付け替えることになる |
| U2 | **CLAUDE.md への「初心者」方針追記の承認。** 追記案は作成済み（本ファイル §NEXT の前提ではない） |

### HOLD（条件が揃うまで着手しない）

| ID | 内容 |
|----|------|
| H3 | 写真HOLD 4件・亜種HOLD — **`CLAUDE.md` の該当節が正本。** 能動的な再探索を行わない |

### 新発見（未処理）

現在なし（N1 は NEXT へ移動）。

---

## NEXT — 次に実行する工程（**1つだけ**）

### F分類12件 — 読者層の指定・採点基準の説明・UI例文

**なぜ今これか**: D が閉じ、残るは E 30 / F 12 / A の残り。
**E分類の残り30件は h1・パンくず・ページ主題見出しが中心で、Phase A の判断どおり
SEO（②87件）と同時でないと `title` と `h1` が乖離する**（PR #53 で CTA・ナビ37件は
処理済み、残りがこの塊）。F は SEO と独立して閉じられる最後のまとまり。

| 項目 | 内容 |
|------|------|
| **対象** | Phase A の **F分類 12件 / 8ファイル**。内訳は F1 読者層の指定3 / F2 読者の困りごと・採点基準6 / F3 UI例文・サジェスト3。※着手時に現mainから実数を再抽出し、12件と一致しなければ STOP して差異を報告 |
| **Scope** | F1「初心者向けに解説します」→「はじめて飼う方に向けて解説します」／F2「初心者が迷いやすい」→「はじめて飼うときに迷いやすい」または主語削除／F3 `annainin` の placeholder・topic-btn の例文 |
| **★F3 の注意** | `annainin/index.html` の `data-quick-reply="初心者向けの亀は？"` は**内部値**。可視ラベルと内部値のどちらを変えるかの判断が要る。**内部値は変更せず可視のみ**を原則とし、可視だけ変えると挙動がずれる場合はその件を HOLD |
| **開始前ゲート** | 12件それぞれで JSON-LD複製 / 属性値との結合 / 見出し・パンくず / `title`・`meta` を機械判定。複製があれば可視と同一commitで同期（PR #59 / #60 / #64 / #65 の手順）。該当するものだけ HOLD |
| **変更禁止** | difficulty の値・★・色・アイコン／A-1「飼育難易度」・A-4「はじめて飼う亀に向きますか？」・A-5「はじめての1頭に向くか」／B・C・D・E分類／CTA・ナビ／`title`・`meta`・OG・canonical／`href`・URL・slug／`sort=beginner`／`?diff=初心者向け`／GA4／`s.beginner`／`data-*`（`data-quick-reply` を含む）／taxonomy／写真／CITES／学名・和名／`shindan/species.js`／複合質問2件／`compare/hermann-vs-greek.html` の3件 |
| **完了条件** | ①F分類12件の置換完了（HOLD分を除く）②JSON-LD複製があった分は可視と完全一致・パース成功 ③Scope Lock 対象に意図外差分0 ④generator 4本 `--check` 差分0 ⑤JSエラー増加0 ⑥`annainin` の検索サジェスト動作に回帰なし ⑦commit → push → PR → merge → main反映確認 ⑧本ファイルの更新 |

> **UNRESOLVED を勝手に全部処理しない。** 今回実行するのは上記1工程だけ。
> U1 / U2 は**亀好きさんの判断待ち**、H3 は再探索禁止のため触れない。

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
