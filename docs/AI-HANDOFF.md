# AI-HANDOFF — AI作業の現在状態（単一正本）

> **このファイルが「今どこまで終わっていて、次に何をするか」の唯一の正本。**
> ChatGPT → Claude Code → 完了報告 → ChatGPT の往復で、
> 完了済み作業の再調査・次工程の取り違え・固定事項の再検証を防ぐために置いている。
>
> - **作業開始前に必ず読む。** ルールは `CLAUDE.md`「重複作業防止ゲート」と
>   `.claude/rules/chatgpt-handoff.md` にある。
>   PM（RO-2）は加えて `.claude/rules/pm-conduct.md`（PM 行動規範・作業開始前ゲート）を確認する。
> - **作業終了時に必ず更新する。** 更新手順は本ファイル末尾「更新ルール」。
> - **現在状態だけを書く。** 履歴は `AI_CHANGELOG.md`（append-only）、
>   規範は `DEVELOPMENT_CONSTITUTION.md`、恒久ルールは `CLAUDE.md`。ここに重複させない。

---

## 読む順序（作業開始前のゲート）

規範と記録は全部で約2,900行あった。**毎回全部読む必要はない。**
必要なものだけ読み、該当したときだけ参照する。

| 区分 | 対象 | 量 |
|------|------|---:|
| **常時必読** | 本ファイルの `CURRENT_BASE` / `UNRESOLVED` / `NEXT` | 約135行 |
| **役割で必読** | PM（RO-2）→ [`.claude/rules/pm-conduct.md`](../.claude/rules/pm-conduct.md)<br>実装（RO-3）→ [`.claude/rules/chatgpt-handoff.md`](../.claude/rules/chatgpt-handoff.md) ＋ [`.claude/rules/closeout-gate.md`](../.claude/rules/closeout-gate.md) | 110行 / 180行 |
| **該当時のみ** | `CLAUDE.md` の該当 SKILL 節（その作業をするとき）<br>`DEVELOPMENT_CONSTITUTION.md`（規範が競合したとき）<br>`docs/fixed-facts/`（該当する種・表現・構造に触れるとき）<br>`docs/archive/COMPLETED-PROJECTS.md`（完了済みの詳細が要るとき）<br>`docs/decisions/OPEN-DECISIONS.md`（裁定待ちの詳細が要るとき） | 参照時 |

**この区分は読む量を減らすためのものであり、規範の効力を下げるものではない。**
`docs/fixed-facts/` と `docs/archive/` の内容は **固定入力・再調査禁止**のまま。
何が確定済みかは本ファイルの索引表で分かる。

---

## CURRENT_BASE

| 項目 | 値 |
|------|-----|
| 基準 | `origin/main` = **016ba27**（PR #133 merge・憲法 v2.1 反映済み・2026-09-03 実測値） |
| サイトファイルの状態 | 直近の一連の作業は**ドキュメントのみ**の変更。サイトファイル（HTML/CSS/JS/data/assets）は無変更 |
| 確認方法 | `git log --oneline -1 origin/main` で**実測する** |
| 最終更新日 | 2026-09-03 |
| 掲載種数 | **119種**（通常一覧 115 ＋ 参考掲載 4） |
| 作業ブランチ | `claude/moneyprinterturbo-japanese-poc-nd71z0` |

---

## COMPLETED — 完了済み。**再調査禁止**

### 憲法 v2.1 改定 — 条件付き Actor merge の許可（2026-09-03 / 本PR）

Owner が Merge 権限の裁定を**案B から案A へ変更**した。案A は憲法の改定を伴う。

- **`DEVELOPMENT_CONSTITUTION.md` を v2.0 → v2.1 へ改定**（§9.2-R1 の MINOR＝運用調整）。
  成立は §9.2-R2「RO-1 の承認のみ」に依る
- **§2.6-I1 を改定**。**公開（Publish）は RO-1 単独のまま**とし、Merge は次の**5条件を
  すべて満たす場合に限り** Actor（RO-2 / RO-3）も実施できるとした
  1. 宣言した検証項目がすべて PASS し実測値を PR に記載
  2. Scope Lock 外の変更が 0 件であることを実測で提示
  3. 破壊的変更・不可逆操作を含まない
  4. 収益ゲート（Amazon / GA4）と法令ゲート（CITES 等）に影響しない
  5. Owner が当該 PR について停止を指示していない
- 整合させた条項: §2.3-R1（RACI の Merge 行）／§2.4-R1（権限表を Approve・Publish と Merge に分離）／
  §2.4-R2／§4.2-R2／§4.3（R1 を公開に限定し R2 を新設）。§9.2 に**改定履歴表**を新設
- 下位規則を v2.1 準拠へ: `pm-conduct.md` §7 を 7.1/7.2/7.3 に再構成、
  `chatgpt-handoff.md` §2・§4、`CLAUDE.md` の経路表と Git 運用
- §1.3-R2／§9.2-R3 に従い `Conforms-to` を **v2.1** へ更新（`CLAUDE.md` /
  `pm-conduct.md` / `OPEN-DECISIONS.md`）
- 裁定書の D-03（過去の Actor merge の扱い）は**前提が変わったため裁定済みの記録へ変更**。
  PR #129/#130/#131/#132 の4件は改定後の5条件をすべて充足しており **revert 不要**

**確定した結論**: Merge は5条件下で Actor 可。**公開は Owner 単独のまま。**

### Owner 裁定 D-01/D-02/D-03 の規則反映（2026-09-03 / 前PR #132）

Owner が3件を裁定した。**下位規則を憲法へ合わせる方向**の是正である。

| 旧ID | 事項 | 裁定 | 反映先 |
|------|------|------|--------|
| D-01 | Merge 権限の優先関係 | **案B** — 下位2規則を憲法に合わせ、**Actor は PR 作成で停止する** | `chatgpt-handoff.md` §2・§4／`pm-conduct.md` §7 |
| D-02 | 品質不足による STOP の扱い | **案A** — 一文追加 | `closeout-gate.md` |
| D-03 | 「基準の引き下げ」と「検査の追加」の区別 | **案A** — 一文追加 | `pm-conduct.md` §4 |

- **D-01 B**: `chatgpt-handoff.md` §2 の見出しを「検証後は merge まで進める」→
  **「PR 作成で停止する」**へ。既定フローから merge を外し、
  「Actor（RO-2 / RO-3）は merge しない。merge・公開は RO-1 のみ」を明記。
  §4 終了条件からも merge / main反映確認を外した。
  `pm-conduct.md` §7 Merge Gate も同様に書き換え、
  **PM の役割は「Owner が merge を判断できる状態にして引き渡すこと」**と定義した。
  変更理由（憲法 §2.6-I1 との矛盾・§1.3-R1 上位優先）を各節の冒頭に残した
- **D-02 A**: `closeout-gate.md` に「品質不足による STOP は積み残しではない。
  `CLOSE` の一形態として扱う」を追加。本ゲートが禁じているのは
  「面倒だから後回し」であり「基準に達していないから出さない」ことではない、と明記
- **D-03 A**: `pm-conduct.md` §4 に「合格基準の**引き下げ**を禁止する。
  実害を発見して**検査を追加する**ことは、この禁止に当たらない」を追加
- `CLAUDE.md` は変更なし。359行目・366行目が既に「Merge は Owner のみ（Invariant I1）」で
  憲法準拠だったことを実測で確認した
- 裁定済み3件を `docs/decisions/OPEN-DECISIONS.md` から削除し、残り2件を D-01/D-02 へ採番し直した。
  **新たに D-03 を追加** — 裁定以前に Actor が merge した3件（PR #129/#130/#131）の扱い

**本PRは裁定 D-01(案B) の最初の適用例である。Actor は merge しない。**
Owner の merge を待つ。

### PM 実務原則の追加と裁定書の新設（2026-09-03 / 本PR）

- `.claude/rules/pm-conduct.md` に **§8 PM の在り方（実務原則）7項目**を追加（110→185行）。
  **起案は Claude Code（Owner 指示による）** であり §1〜§7（Owner 確定）と出所が違うことを
  §8 冒頭に明記した。各原則に根拠を付し、実測でないものはそう書いた
  - 8.1 成果物を見ずに受入判定をしない（Artifact First）／8.2 反証可能な受入基準／
    8.3 PM 自身の数値にも出所／8.4 STOP を成果として扱う／8.5 一度に1工程／
    8.6 自著の唯一の判定者にならない／8.7 Owner 判断事項を作業報告に埋めない
- `docs/decisions/OPEN-DECISIONS.md` を新設（197行）。裁定待ち5件を
  競合規則・選択肢・影響・推奨・「裁定が無いと何が止まるか」つきで分離した（§8.7 の実装）
- 本ファイルの UNRESOLVED は **5行の索引表**に置き換え、読む量を増やしていない

**確定した結論**: 裁定事項の正本は `docs/decisions/OPEN-DECISIONS.md`。
裁定済みの項目は同ファイルから削除し、確定内容を該当規則へ反映する。

### AI-HANDOFF の分割と読む順序の階層化（2026-09-03 / 本PR）

必読規範が2,904行に達し、`docs/AI-HANDOFF.md` の COMPLETED 節797行・FIXED_FACTS 節429行が
全体の42%を占めていた。同ファイル自身の更新ルール「現在状態だけを書く。履歴は AI_CHANGELOG」に
反していたため、PR #128（CLAUDE.md 905→646行）と同じ方式で分離した。

- **A 分離**: COMPLETED 26件中20件（663行）を `docs/archive/COMPLETED-PROJECTS.md` へ。
  FIXED_FACTS の参照表3件（種データ／「初心者」公開表現／構造上の制約・計366行）を
  `docs/fixed-facts/` の3ファイルへ。**本文は一切改変せず移動のみ**
- 分離元には**1件1行の索引表**を残し、各移動先の見出しに「固定入力・再調査禁止」を明記した
- **B 階層化**: 本ファイル冒頭に「読む順序」を新設。常時必読／役割で必読／該当時のみ を区分
- **C（規範の統合）は実測にもとづき実施しない**。CLAUDE.md ∩ 憲法 = 0行、
  CLAUDE.md ∩ agent.md = 1行で、統合による削減効果が無いことを確認した

**実測**: 必読 2,904 → **1,931行（−33%）**。`docs/AI-HANDOFF.md` 1,400 → **424行**。
常時必読は `CURRENT_BASE`/`UNRESOLVED`/`NEXT` の**約135行**。
移動前の非空行1,167行が移動後も全て存在し、**欠落0件**を機械照合で確認。
Scope Lock 外の変更 **0件**。

**確定した結論**: 完了記録の正本は `docs/archive/COMPLETED-PROJECTS.md`、
固定参照表の正本は `docs/fixed-facts/`。`docs/AI-HANDOFF.md` は現在状態と索引のみを持つ。

### PM 行動規範の恒久ルール化（2026-09-03 / 本PR）

Owner が 2026-09-03 に確定した PM 運用規則を、GitHub 上の恒久ルールとして保存した。

- **`.claude/rules/pm-conduct.md` を新設（110行）。** Conforms-to: Development Constitution v2.0。
  対象 Role は **RO-2（Architect / PM）**。憲法 §2.1-R1 に従い Role で記述し Actor 名は書いていない
- 内容は Owner 確定文の**そのまま**: 作業開始前ゲート（7種の作業）／禁止6項目／必須3項目／
  証拠・計数8項目／STOP・BLOCKED 5項目＋反復禁止／Short Video Gate／Merge Gate
- **新ルールは追加していない。既存ルールの意味も変えていない。** 参照表と
  【CONFIRM_REQUIRED】1件のみを補記した
- 参照経路: `CLAUDE.md`（+3行）と本ファイル冒頭（+1行）から `pm-conduct.md` を指す
- 実測: 規範項目の網羅 **40/40**・見出し重複 0・Scope Lock 外の変更 **0件**

**確定した結論**: PM 行動規範は `.claude/rules/pm-conduct.md` が正本。
Merge Gate と憲法 §2.6-I1（Merge は RO-1 のみ）の優先関係は**未確定**として
【CONFIRM_REQUIRED】で残した（下記 UNRESOLVED）。


### CLAUDE.md 整理 PR-1 — 完了記録の分離（2026-09-03 / 本PR）

CLAUDE.md 905行のうち約3分の1が過去の完了記録で占められていたため、
恒久ルールと作業記録を分離した。**移動のみで、本文は一切改変していない。**

- CLAUDE.md **905行 → 646行**
- 新規 `docs/archive/COMPLETED-PROJECTS.md`（296行）へ移動:
  生体写真の全数監査（2026-08-22）／生体写真監査の完了（2026-08-23）／
  亜種PROJECT Phase B 完了記録／同 Phase C 完了記録／title 重複の修正／
  HOLD案件の外部ソース完全調査／HOLD 4件の写真素材 最終確定
- CLAUDE.md 側には要約と参照リンクを残した。**再監査禁止の効力は維持している。**
- 恒久ルール（写真の選定基準・絶対に使わない写真・採用する写真・手順・
  正式クローズ方針・再開条件・写真監査の鉄則5項目・NO-REWORK GATE）は
  すべて CLAUDE.md に残した
- 移動に伴う相互参照の修正1件のみ実施（「下記『HOLD 4件の写真素材 最終確定』」→
  アーカイブへのパス）

**検証（実測）**: 移動対象の非空行209行はアーカイブ側に改変・欠落0。
残す対象の非空行468行は新 CLAUDE.md に欠落0。

**移動先について**: 当初 `AI_CHANGELOG.md` へ移す計画だったが、同ファイルは
PR単位の定型ログ（Actor / Change / Reason / PR・Commit / Approver / Conforms）であり
判定表・出典表を流し込むと形式が壊れるため、`docs/archive/` に分離した。


### 成体サイズ監査の修正・正本化（2026-08-31 / 本PR）

全119種サイズ監査（READ ONLY・確定済み）の指摘を修正した。**再監査はしていない。**

- **チェリーヘッド**: 30〜40cm → **20〜30cm 基準**（ページ4箇所＋species.js）。
  基準種アカアシ（30〜35cm）より大きい自己矛盾を解消
- **スベスッポン**: 上限45cm → **メス最大35.6cm** 基準（ページ11箇所＋species.js）。
  meta の「20〜25cm」という別方向の誤りも同時に是正
- **イベラギリシャ**: 20〜30cm → **成体18〜25cm＋大型個体群30cm超の補足**
  （ページ8箇所＋species.js）。「最大35cm」は一般サイズとして表示しない
- **スッポンモドキ**: 50〜70cm → **成体30〜55cm・最大70cm**（最大70は維持）
- **アラバマチズガメ**: species.js を文献値（♂11.3〜12.7/♀27.3〜29.2）と同水準の
  オス〜12cm/メス〜27cm へ。ページは元から正しく無変更
- **master 正本化**: 上記4種の `max_shell_length_cm` を UNPROVEN → **LIKELY**
  （value・provenance・sources・note・last_verified を記録）。アラバマは既存 27.3 LIKELY を維持。
  **対象外101件の UNPROVEN には手を付けていない**

**監査の訂正（重要・再発防止）**: 監査報告の「species.js 誤り2件（アラバマ ♂7/♀12・
イベラ 12〜15cm）」は**私の抽出バグによる誤検出**だった。species.js には slug を持たない
6レコード（インドホシ・ビルマホシ・エジプト・マダガスカル・ヒラタニオイ・テキサスチズ）があり、
非貪欲 regex がその size を次レコードに誤帰属させていた。正しいレコード分割で再照合した結果、
**page↔species.js の20%超乖離は0件**。実在した誤りは「全層で同じ間違い」型
（チェリーヘッド・スベスッポン等）のみで、これは外部文献との照合でしか発見できない。

### READABILITY — 種ページ113枚に「このページの目次」を生成（2026-08-30 / 本PR）

NEXT PROJECT DISCOVERY（READ ONLY）の候補4を Owner 指示「3で」で着手・CLOSE した。

- **`tools/gen-species-toc.js` を新設**（既存 generator 4本と同じ設計様式:
  BEGIN/END マーカー・`--check`・冪等）。入力は各ページ自身の `<h2>` だけ。
  **本文・見出しの文言は一切変更していない**
- 目次対象の h2 に `id="sec-N"` を付与し、最初の対象 h2 の直前に
  `<nav class="sp-toc">` を挿入。目次から除外: `lp-heading`（ヒーロー）／
  関連ページ／ほかの飼育ガイド／Kame Life Guide（回遊・フッター見出し）
- `css/species.css` に `.sp-toc` スタイルと `[id^="sec-"]{scroll-margin-top:64px}`
  を追加（固定ナビ `--klg-nav-h:52px` に隠れない着地位置）
- 実測: **113/113 ページ・目次項目868件**。anchor↔id 不整合0・id重複0。
  冪等（2回目実行で書き込み0）。全 generator `--check` 差分0。
  `gen_related_links.py --apply` もスクラッチで無干渉を確認（更新0・壊れたURL0）
- **DISCOVERY の「目次あり2/113」は誤検出だった**と訂正: 2件は外部URL
  `iucn-tftsg.org/toc/` の部分一致で、実際の目次は **0/113** だった

### 公開表示の破損2件 CLOSE（2026-08-30 / 本PR）

PUBLIC IMPACT 棚卸し（READ ONLY）で「4条件（未解決／外部入力不要／Owner判断不要／公開影響あり）を
すべて満たす」と確定した2件だけを処理した。**新しい監査は行っていない。**

- **guide-moist.html の対象種リストを generator から同期。** 見出し「22種」→「23種」、
  ヒラセガメの直後にオプストヒラセガメ（`species/obsti-hirase-turtle.html` /
  *Cuora mouhotii obsti*）を1行追加。**手編集はせず `node tools/gen-guide-species.js` の
  再実行で生成**（ブロックに「手で編集しない」と明記されているため）
- **`species/canton-reeves-turtle.html` の meta description の破損を除去。**
  正常な100文字の後ろに残っていた置換残骸53文字（未対応の `'` と開き括弧を欠いた
  「Turtle）」を含む）を削除しただけ。**新しい文言は作っていない。**
  og:description / title / og:title は無変更

**確定した事実（再調査しない）:**

- **乖離の原因はデータ不足ではなく generator の再実行漏れ。** オプストヒラセガメは
  `shindan/species.js:874-880` に `hasPage: true` で以前から存在していた。
  **種を追加したら `tools/gen-guide-species.js` を再実行する**運用が抜けやすい
- 公開ページを生成する generator 4系統のうち、乖離していたのは gen-guide-species.js だけ。
  gen-species-list / gen-guide-nav / gen-category-ui は修正前後とも差分0
- description の破損は全 species ページ中この1件のみ（修正後は0件）。
  meta description を生成するスクリプトは存在せず、過去の手作業置換の失敗が残ったもの
- 実測: 全 generator --check 差分0 / ranking QA 18/18 PASS / validator MISMATCH 0・WARN 0・
  `--strict` exit 0 / `test_validate_species.py` 10 PASS /
  公開HTML差分は上記2ページのみ / data・shindan・ranking・js・css・sitemap 差分0 /
  CITES・Amazon・楽天の該当行差分0

**CLOSED と確定したもの（棚卸しの実測結果。再調査しない）:**

- `CLAUDE.md` が「次工程」として残していた**クレジット表記ゆれ10件は解消済み**。
  Wikimedia 由来とされた5件はいずれも iNaturalist 出典＋CC ライセンスリンク付きの
  figcaption になっており、alt の和名5件も photo-credits.html の見出しと一致していた
- `photo-credits.html` の「ヒメハコヨコクビガメ / *Pelusios castaneus*」は、
  同ページ956行目の近縁種代替の注記でこの事例が名指しで開示されており**欠陥ではない**
- `ranking-beginner-top10.html` 9位の公開スコア **62.00 は species_scores × type0 で
  完全一致**する。10位の 61.90 と違い正しい種のレコードに由来し、他8枚と同素性。
  **撤去対象にあたらない**

### 分離した完了記録（**固定入力・再調査禁止**）

古い完了記録 20件は [`docs/archive/COMPLETED-PROJECTS.md`](archive/COMPLETED-PROJECTS.md) へ移した。
**本文は無改変。移動のみ。** 何が確定済みかは下の索引で分かる。

| 完了記録 | 状態 |
|---|---|
| Species Scores Phase 1A — 既存スコア基盤の安全化（2026-08-30 / 本PR） | 完了・再調査禁止 |
| 公開データ整合・事実性の連続CLOSE（2026-08-29〜30 / PR #115〜#123） | 完了・再調査禁止 |
| RAKUTEN-ID Phase 5 — 型番検索の発火条件拡張（2026-08-29 / PR #114 / merge `e8bf58b`） | 完了・再調査禁止 |
| RAKUTEN-ID Phase 4 — 型番ルートの追加と B確定5件の処理（2026-08-29 / PR #113 / merge `8c7cdca`） | 完了・再調査禁止 |
| RAKUTEN-ID Phase 3 — 日次レガシー経路の identity gate 統一（2026-08-29 / PR #112 / merge `346bd57`） | 完了・再調査禁止 |
| RAKUTEN-ID Phase 1＋Phase 2 — 楽天アフィリエイト自動収益化（2026-08-29） | 完了・再調査禁止 |
| VISUAL SYSTEM Phase 3 — 公開表示の欠陥CLOSE（2026-08-29 / PR #109 / merge `386f86e`） | 完了・再調査禁止 |
| VISUAL SYSTEM Phase 2 / DESIGN CLOSEOUT（2026-08-29 / 本PR） | 完了・再調査禁止 |
| VISUAL SYSTEM Phase 1（2026-08-29 / 本PR） | 完了・再調査禁止 |
| CLOSEOUT COMPLETE（2026-08-29 / 本PR） | 完了・再調査禁止 |
| DECISION CLOSEOUT（2026-08-29 / 本PR） | 完了・再調査禁止 |
| CLOSEOUT PHASE — 残件棚卸しと一括クローズ（2026-08-29 / 本PR） | 完了・再調査禁止 |
| TOP DESIGN — トップページ「引き算の再設計」（2026-08-28） | 完了・再調査禁止 |
| ② species-list.html の再設計（2026-08-28） | 完了・再調査禁止 |
| archive・reference_only 8種の掲載仕様監査 ＋ 法規制表示の回帰修正（2026-08-28） | 完了・再調査禁止 |
| ③ species-list.html の掲載区分 — 通常一覧115種 ＋ 参考掲載3種（2026-08-28） | 完了・再調査禁止 |
| ④ species-list.html —「暮らしから選ぶ」6大分類の写真タイル（2026-08-28） | 完了・再調査禁止 |
| 和名↔学名↔分類階級 監査の是正（2026-08-26） | 完了・再調査禁止 |
| 直近の連続作業（difficulty ／「初心者」表現） | 完了・再調査禁止 |
| その前の連続作業（種一覧・分類・ガイド同期） | 完了・再調査禁止 |

### CLAUDE.md にクローズ記録がある完了プロジェクト（**ここに複製しない**）

- **亜種PROJECT**（Phase A/B/C）… 2026-08-24 正式クローズ。候補集合を使い切り未判定ゼロ
- **生体写真の監査・差し替え**… 2026-08-23 完了。出典URL重複0・MD5重複0
- **HOLD 4件の写真素材**… 2026-08-24 調査クローズ。能動的な再探索を行わない

---

## FIXED_FACTS — 固定入力。**再検証しない**

### ゴールデンギリシャリクガメの写真素材（2026-08-27・探索クローズ）

`species/golden-greek-tortoise.html` は **land 27種でただ1つ生体写真を持たないページ**
（`img` タグ0件・`species-photo` ブロック無し・`css/species-photo.css` 未読込・
`og:image` は `images/hero/eastern-box-turtle-hero.jpg` を流用中）。
候補探索を2回実施して**打ち止めまで到達した**。以下は一次データの実測値であり推論ではない。
**同じ探索をやり直さない。**

- ***Testudo graeca* 系の taxon は 20件**（種1＋亜種19。うち active 11）。
  シノニム `floweri`(40026) / `perses`(889772) / `anamurensis`(40027) / `pallasi`(116209) /
  `lamberti`(116206) / `nikolskii`(40025) / `soussensis`(40024) / `graeca`(40031) は
  **すべて active=false かつ観察0件**。掘る先はもう無い。
- **terrestris 固有域の箱 = lat 28.0–36.0 / lon 32.5–42.0**。
  `observations.csv.gz` から *T. graeca* 系 7,148観察を抽出して亜種別レンジを実測し、
  **他亜種が1件も入らない最大の範囲**として確定した。箱の中身は
  種レベル(40023) research 880 / casual 10 / needs_id 1、terrestris 166、他亜種 **0**。
  最寄りの他亜種（ibera）は箱の外 45km。
- **照合した写真は累計 606枚**（terrestris 同定 280 ＋ 固有域 research 309 ＋ 固有域 casual/needs_id 17）。
  **商用可（CC0 / CC-BY / CC-BY-SA）は 21枚のみ**で、残る **585枚（96.5%）が CC-BY-NC 系**。
  ボトルネックは**ライセンスであって素材の総量ではない**。
- **解像度は制約になっていない。** 商用可21枚は**全部が 800×600 以上**。
  「あと少しで届かない」写真は0枚。**基準を下げても候補は増えない。**
- **21枚すべてを原寸取得して1枚ずつ目視済み**（推論による判定は0件）。
  候補ボード → https://claude.ai/code/artifact/f7554b86-cdce-4e53-b65b-4512543fb7f6
- **研究グレードの範囲に、採用基準を完全に満たす写真は無い。**
  自然な姿勢の成体は1枚（photo 10249391）だけで、それも甲が暗色で「ゴールデン」に見えない。
  黄金色が明瞭なもの（photo 229122899 / 5361707）は**頭も四肢も引っ込んでいる**。
- **casual grade に、21枚中もっとも状態のよい写真がある**（photo 30155234 / obs c66eee0a /
  Hila Taylor / CC BY 4.0 / 2048×2048）。頭を完全に出し目が開き、甲は黄金色。
  ただし **quality grade が casual** で、当サイト基準（research grade）の外側。
  **Open Data の公開項目に captive フラグは無く、casual の理由は断定できない**
  （日付・座標・種同定が揃っているため飼育個体フラグの可能性が高い、までしか言えない）。
- **第1次の最上位候補 photo 229122899（obs 302e6a4f）はトルコ南東部ディヤルバクル産**で、
  流通名「ゴールデンギリシャ」が指すレバント個体群から**約700km北**。
  半径150km内の亜種同定つき terrestris はわずか2件。第1次では把握していなかった弱点。

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

### 分離した参照表（**固定入力・再検証しない**）

| 参照表 | 行数 | 所在 |
|---|---:|---|
| 種データ | 132 | [`docs/fixed-facts/species-data.md`](fixed-facts/species-data.md) |
| 「初心者」公開表現 | 130 | [`docs/fixed-facts/beginner-wording.md`](fixed-facts/beginner-wording.md) |
| 構造上の制約 | 104 | [`docs/fixed-facts/structural-constraints.md`](fixed-facts/structural-constraints.md) |

## UNRESOLVED — 本当に未解決のものだけ

### 裁定待ち（**Owner の判断が要る**）

選択肢・影響・推奨・「裁定が無いと何が止まるか」は
[`docs/decisions/OPEN-DECISIONS.md`](decisions/OPEN-DECISIONS.md) にある。

| ID | 事項 | 裁定が無いと |
|----|------|-------------|
| D-01 | **Short Video Gate のデッドロック**（APIキー取得 / CC BY-SA 受入 / 停止） | **動画制作が止まる** |
| D-02 | PM 実務原則 `pm-conduct.md` §8 の承認範囲 | 止まらない（実務原則として機能） |

**裁定済み（2026-09-03）**: Merge 権限 → **案A**（**憲法を v2.1 へ改定**し、5条件下で Actor merge を許可）／
品質不足の STOP → **案A**（`closeout-gate.md` に追加済み）／
基準の引き下げと検査の追加の区別 → **案A**（`pm-conduct.md` §4 に追加済み）

### DECISION

| ID | 内容 | 判断材料 |
|----|------|---------|
| **R1 food_hikari_turtle の実体確認** | name「カメのごはん（ウーパールーパー用？）」と term/why が別商品を指す。ASIN B0043UN3X4 の実体確認は Owner の実物確認が必要 | 確認できたら name/term を同期し `rakutenIdentityHold` を外す。確認できるまで楽天昇格から恒久除外（HOLD） |
| **R2 food_reptomin_tetra の統合/削除** | food_aquatic_premium と同一商品ライン（テトラ レプトミン）の重複。EQUIPMENT_MAP 未参照の孤児レコード | 削除しても参照切れは起きないことを Phase 0 で確認済み。統合 or 削除は Owner 判断（HOLD） |
| **R3 food_tortoise_herbs の昇格可否** | Phase 2 で Owner が△非承認（180g/400g併記出品）とした商品が、Phase 3 の日次レガシーゲートの正規条件（identity STRONG＋スコア9.1≧8.0＋成果対象URL）を満たして available 化された。商品自体はマルベリックドライで正しい | 非承認を維持するなら `rakutenIdentityHold: true` を1行付与（次回日次で自動降格）。昇格を認めるなら現状のまま。**Owner 判断** |

**旧 D1〜D9 はすべて CLOSE または BLOCKED へ着地済み**（COMPLETED 参照）。

### 判断待ちではないが未完了（次に楽天系工程を立てるときに拾う）

- **承認済みだが未昇格の2件**（Phase 5 で `shelter_small` と `basking_100w` は解消済み）:
  `food_tortoise_staple`（本適用時だけ候補を確保できない状態が**4回連続**。dry-run では毎回
  STRONG に到達するため、次回 `identity_promote` 実行で再挑戦する価値はある）／
  `heater_aqua_100w`（**SH55 も PT2752 も楽天の検索キーとして機能しないことが実測確定**。
  主クエリ「水中ヒーター 100W 亀 水槽」が汎用商品しか返さないため、
  **rakutenSearchTerm を商品名側へ寄せない限り自動救出は不可**）／
  `substrate_cypress`（PT2752 が使えないため型番ルートなし。別の識別手段がない限り救出不可）
- 楽天 △5件（basking_dual_150 / basking_hid_70w / food_aquatic_staple / food_tortoise_herbs /
  substrate_bottom_sand）は **Owner 非承認で search 維持が確定**。再提案しない。
- `ranking-beginner-top10.html` の 10位不整合（PR #115〜#117・#120）と guides の rel 未付与12本
  （PR #118）は**すべて解消済み**。9位（モンキヨコクビガメ）の species ページ不在だけが残るが、
  これは修正ではなく**新規コンテンツ制作**であり、CTA は species-list.html への一般導線として
  機能している（リンク切れではない）。**推測でデータを作らない**方針のため着手しない。
- **`scripts/gen_related_links.py` の乖離有無は未確認。** `--check` の出力
  （追加予定118 / 現状 species→guides 227・species→compare 15）から差分の有無を断定できなかった。
  **「差分なし」と書いてはならない。** 次に関連リンク工程を立てるときに、出力の意味から確認する。

### BLOCKED — 外部入力待ち。**受領したら即再開できる**

| ID | 不足しているもの | 受領後にすること |
|----|----------------|-----------------|
| **B1 GSC 成長分析** | Search Console → 検索パフォーマンス → エクスポート。**期間 直近3か月 / 検索タイプ ウェブ / フィルタなし**。①Pages.csv ②Queries.csv ③**ページ×クエリの組み合わせ**（最重要。ページタブでURL絞り込み→クエリタブでエクスポート、または Looker Studio で ディメンション=ページ+クエリ）。①②が別々だと紐付けできない | 成長候補TOP10を選定。優先度A=順位11〜20かつ表示上位／B=順位1〜10なのにCTRが期待値以下（title・meta の書換で伸びる）／C=3クエリ以上で表示が立ち始め。**species に限定せず guides / ranking / trouble / compare も同条件で評価**。<br>`shindan/index.html` の静的本文984字 / noscript なしの扱いもここで判断する（被リンク491本・159ページのサイト最大ハブだが、Google は JS を実行するため即時の順位影響は限定的） |
| **B10 GSC 5xx 未登録の対象URL** | Search Console の該当レポートに出ている**実URL一覧**（メール本文には URL が無く、**推測しない**）。加えて URL 検査ツールのライブテスト結果 | リポジトリ側の原因は7観点で除外済み（**判定C**）。本番へは egress ポリシーで到達できないため、**ローカル200を「本番5xxなし」の証拠にはしない／本番未確認で「現在5xxなし」と断定しない**。URL一覧を受領した時点で、そのURLだけを対象に再調査する |
| **B2 beginner TOP10 の2URL競合** | 同上（B1 の③で同時に解ける） | `guides/beginner-top10-turtles.html` と `ranking-beginner-top10.html` は title・h1・想定クエリが同型で両方とも自己 canonical。**構造上は黒に近いが GSC の実クエリを見るまで確定しない**。重複が実証されたら統合または canonical 集約 |
| **B3 H8「初心者」SEO運用 80行** | 同上 | `title` 6 / `meta`・OG 33 / JSON-LD 26 / 可視FAQ×JSON-LD 3 / 見出し 9 / パンくず 3。**トリガーが引いたページのみ・週最大3ページ。一斉置換は禁止。能動的に着手しない**。N10（`canton-reeves-turtle.html` の meta description 破損）もここに含む |
| **B9 species メイン写真の品質（12件）** | **種同定・商用可ライセンス・出典が確認できる代替写真**。本実行環境から iNaturalist / Commons へは到達できないため取得不可。**B4/B5/B7 の HOLD 4件とは別件**（それらは再探索しない） | 全107枚をコンタクトシートで目視した結果、以下がメイン写真として品質を落としている。差し替え候補が確認できた時点で 800×600 WebP 化し、クレジット4層（`credits_map.json` / `pc_parsed.json` / `photo-credits.html` / 種ページ figcaption）を同期する。<br>**最優先** `eastern-box-turtle`（手持ち＋背景に赤いピックアップトラックと人物）<br>**手持ち** `alabama-map-turtle` / `amazon-matamata` / `guerrero-wood-turtle` / `herrera-mud-turtle`（背景に車両）/ `loggerhead-musk-turtle` / `tunisian-greek-tortoise` / `spotted-turtle` / `stripe-necked-musk-turtle`<br>**被写体が判別しにくい** `chinese-stripe-necked-turtle`（濁った水中）/ `white-lipped-mud-turtle`（暗所）/ `ringed-map-turtle`（被写体が小さい）<br>**人工物が主役** `painted-turtle`（黄色い金網が画面を占める）<br>※**AIアップスケールによる「高解像度化」は禁止**。元画像が存在する場合のみ再書き出しする |
| **B4 写真HOLD 3件** | 亀好きさんが候補画像を見つけた時点。**能動的な定期探索は行わない**（`CLAUDE.md` 2026-08-24 恒久方針） | `Emydura subglobosa worrelli`（商用可3枚が全て同一個体の死骸）／`Malaclemys terrapin tequesta`（**入ればテラピン7亜種が完備＝掲載価値は最優先**）／`Graptemys nigrinoda delticola`（10枚全て CC-BY-NC。加えて Ennen et al. 2014 が形態的診断性を否定しており**亜種ページを作る価値から再判断が要る**） |
| **B5 オプストヒラセガメの生体写真** | **腹甲の放射状黒斑が写り、かつ産地が本亜種の分布域（トゥアティエン＝フエ〜ダクラク）と一致する**商用可・800×600以上の写真。両方そろわない限り亜種同定は成立しない | `species/obsti-hirase-turtle.html` は写真なしで公開済み。写真が入手できたら、ページの「写真を掲載していません」注記とFAQ「なぜ写真がないのですか？」を差し替え、クレジット4層を追加する。**旧候補 photo 134512961 は不採用で確定（再検討しない）** |
| **B6 カントンクサガメの CITES 区分** | CITES Species+ または EU規則 1332/2005 の確認（本実行環境は egress ポリシーで到達不可） | 現在 **附属書II** で全層統一済み。close した PR #35 は出典付きで **III** を主張しており、同日付の記録が食い違っている。**III が正しい場合に直すのは4箇所**（`species-master.json` の `cites.appendix.value` ／ `species-identification.json` の `houkisei` ／ `shindan/species.js` の `cites` ／ `SHINDAN-SPECIES.md` の CITES列）＋公開本文の「附属書II」3箇所 |
| **B7 ゴールデンギリシャリクガメの写真** | **良質な確定写真**（research grade × 商用可 × 800×600以上 × 自然な姿勢 × 種同定が証明できる）。**探索は打ち止め済**（FIXED_FACTS）。能動的に探しに行かない | 現候補は Owner 判断で不採用が確定。`species/golden-greek-tortoise.html` は写真なしのまま運用する |
| **B8 `ouachita-map-turtle-sp` の三名法/二名法** | **TTWG 第9版(2021)本文で *Graptemys ouachitensis sabinensis* の階級を確認できる資料**。本実行環境からは到達不可 | `data/species-identification.json:378` の HOLD を維持。**根拠が確定するまでどちらへも統一しない。** 解除する場合は identification だけでなく `species/ouachita-map-turtle-sp.html` の**4箇所**（meta description / og:description / JSON-LD description / `.latin`）も同時に直さないと不整合が増える（うち3箇所は SEO 層で B3 に触れる） |

### DROP — 今後やらない。**未解決リストから外す**

| 対象 | 理由 |
|------|------|
| **N23 `index.html` の孤立CSS 79ルール** | 価値ゼロに対し、JS が動的付与するクラスを誤削除する回帰リスクが実在。リスクがベネフィットを上回る |
| **N20 孤児キー（equipment 8 / CAT_OVERRIDE 3）** | 動作影響のない死にデータ。PR #90 の前から同数。触る利得がない |
| **テンプレ内のリンク切れ8件** | `_template-monetized.html` の `SLUG2/3/4.html` プレースホルダ等。**noindex・sitemap未掲載で公開画面に出ない**。テンプレとして正しい状態 |
| 旧 D1 / D2 / D3 / D4 / D5 / D6 / D7 / D8 / D9 | すべて CLOSE または BLOCKED へ着地済み |
| ~~N7~~ / ~~N24~~ / ~~N25~~ / ~~N26~~ / ~~N21~~ / ~~N27~~ / ~~N29~~ / 320px横スクロール / 旧H9 / 旧H3のobsti | 解消済み |

---

## NEXT — 次に実行する工程（**1つだけ**）

### CLAUDE.md 整理 PR-2 — ルール統合・リネーム・EVIDENCE GATE 追加

Owner 決定（2026-09-03）。PR-1 に続く整理の第2段。**3点をまとめて1PRで行う。**

1. **重複の統合** — 再調査4条件が CLAUDE.md「重複作業防止ゲート」・
   同「NO-REWORK GATE」・`.claude/rules/closeout-gate.md` の3箇所にほぼ同文で存在する。
   **CLAUDE.md の NO-REWORK GATE に一本化**し、他2箇所は参照に落とす。
   あわせて「引き継ぎ文書の役割」の表に `docs/AI-HANDOFF.md` が無い不整合を直す。
2. **リネーム** — `.claude/rules/chatgpt-handoff.md` → `.claude/rules/pm-handoff.md`。
   PM担当AIの交代が決まっているため、ChatGPT 名指しの記述を PM 非依存の表現に改める。
   CLAUDE.md 内の参照箇所も同時に修正する。
3. **EVIDENCE GATE の追加** — リネーム後の `pm-handoff.md` に §3-4 として追加する。
   実装側は raw URL と merge 後の実測 commit SHA を必ず添える。
   PM側は URL を開いてから VERIFIED / UNVERIFIED を明示し、
   開かずに「確認しました」と書かない。取り込み済みスナップショットを判定根拠にしない。

**ルールの内容判断はしない。** 既存ルールは追認済み（Owner 決定）であり、
統合・移動・表現の PM 非依存化のみを行う。ルールの新設・削除・意味変更をしない。

---

### （保留中）B1 — GSC 実測データの受領

> **B1 は 2026-08-30 に実測を試み、7経路すべてで取得不能を確認して STOP した（判定C）。**
> 加えて **要求された「直近3か月」の期間は存在しない**（データ収集開始は 2026-07-17）。
> 再取得を Claude 側で試行し直さない。**Owner が CSV をエクスポートして渡す**のが唯一の再開条件。
>
> **Species Scores の 119種拡張・6軸再設計は NEXT に置かない。** Phase 0 の判定Cのとおり、
> cost の価格根拠と「そもそも拡張する価値があるか」の Owner 判断が先に要る。

**デザイン工程は Phase 2 で CLOSE した。** CSSで解決できる視覚課題は残っていない。
再採点は **78 → 88/100**。90に届かない残り2点は、
**写真差し替え（B9）と写真の高解像度化**という素材待ちの項目に集約されている。
これらは AI 側の判断だけでは進められない。

次の一手は **B1（GSC 実測データの受領）**。B1 が解ければ B2 と B3 のトリガーも同時に決まる。
必要なものと受領後の処理は UNRESOLVED の B1 に固定済み。

**GSC が用意できない場合の代替工程は置かない。**
`docs/operations/DECISION_RULE.md`（実測がトリガーを引いたページのみ・週最大3ページ）に反するため。

---

## 更新ルール（作業終了時に必ず実施）

Claude Code は各作業の完了後、**同じPRの中で**本ファイルを更新する。

1. **CURRENT_BASE** — 基準・**サイトファイルの状態**・最終更新日を書き換える。
   merge commit は本ファイルを書く時点では確定しないため、**直前に merge 済みの commit を書く**
   （自分の merge commit は書けない。表が tip と1 commit ずれるのは正常）。
   **`docs/AI-HANDOFF.md` だけを変える同期PRでは「サイトファイルの状態」の行を動かさない。**
   次に作業する側は `git log --oneline -1 origin/main` で実測し、
   差が本ファイルだけなら BASE のズレとして扱わない
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
