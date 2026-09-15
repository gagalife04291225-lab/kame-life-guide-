# Owner ショートコマンドと GitHub Issue 作業命令書

このファイルは KAME LIFE GUIDE における Owner・ChatGPT PM・Codex Cloud 間の
**ゼロコピペ運用の正本**である。特定ベンダーの機能を前提にせず、GitHub の
`[CODEX-TASK]` Issue を1成果物単位の作業命令書として使う。

## 1. 正本の役割分離と優先順位

| 対象 | 役割 |
|---|---|
| `docs/AI-HANDOFF.md` | プロジェクト現在状態の唯一の正本 |
| OPEN `[CODEX-TASK]` Issue | 今回だけの完全な作業命令書 |
| `AGENTS.md` / `docs/agent-rules/` | 恒久運用ルール |
| PR | 実装成果物と検証証拠 |

Issue は `AI-HANDOFF.md` の代わりではない。Issue と `AGENTS.md`、`AI-HANDOFF.md`、
`docs/agent-rules/`、`DEVELOPMENT_CONSTITUTION.md` が矛盾する場合は repo 内の上位正本を
優先し、推測で解釈せず `BLOCKED` とする。

GitHub の `main` は作業開始時に読み取り専用で実測する。`origin/main` が利用可能なら
それを使い、なければ `git ls-remote <repo URL> refs/heads/main` や GitHub API 等を使う。
記録済みの値や推測値で代用しない。

## 2. Issue 契約

- 1 Issue = 1成果物。
- タイトルは **`[CODEX-TASK] <短い作業名>`** とする。
- `codex-task` label は任意。label がなくてもタイトルの `[CODEX-TASK]` を正式な識別子とする。
- 本文だけで作業が完結し、過去の会話や Owner の追加コピペを要求しない。
- 曖昧な「いい感じに直して」「全部確認して」「念のため再監査」は禁止する。
- 同じ成果物を目的とする OPEN Issue または OPEN PR があれば新規 Issue を作らない。

本文には次をすべて、値を伴って記載する。

```text
TASK_ID:
STATUS: READY | HOLD | DONE
CREATED_AT:
BASE:
PURPOSE:
TASK:
SCOPE:
DO_NOT:
SUCCESS_CONDITIONS:
VALIDATION:
CLOSEOUT:
```

`BASE` は Issue 作成時に実測した完全な commit SHA とする。`SCOPE`、`DO_NOT`、
`SUCCESS_CONDITIONS`、`VALIDATION`、`CLOSEOUT` を省略しない。

## 3. Codex の「見て」起動手順

Owner が Codex に「見て」と入力した場合、または「見てやって」「指示見て」
「GitHub見て」等の明らかに同じ意味の短い入力をした場合、Codex は
「何を見ればよいか」「プロンプトを貼ってほしい」「作業内容を教えてほしい」と質問せず、
次を順番に実行する。

1. `AGENTS.md` を読む。
2. `docs/AI-HANDOFF.md` の `CURRENT_BASE` / `UNRESOLVED` / `NEXT` を読む。
3. GitHub の OPEN Issue と OPEN PR を読み取り専用で取得する。
4. タイトルが `[CODEX-TASK]` で始まる OPEN Issue を抽出する。
5. §4 に従って候補を一意に決める。
6. GitHub の最新 `main` を読み取り専用で実測する。
7. Issue 本文の必須フィールドと `BASE` / `SCOPE` / `DO_NOT` /
   `SUCCESS_CONDITIONS` / `VALIDATION` を repo 正本および実測 main と照合する。
8. 矛盾がなければ、その Issue の作業だけを実行する。

Issue 一覧または本文を実際に取得できない環境では、利用可能だった経路、取得不能の経路と
実測エラー、再開条件を報告し、**ファイル変更0で `BLOCKED`** とする。「たぶん読める」で進めない。

## 4. Issue 選択規則

| OPEN `[CODEX-TASK]` 件数 | 動作 |
|---:|---|
| 0 | 「現在実行可能なCodexタスクはありません」と報告し、変更しない |
| 1 | その1件だけを候補とし、本文の `STATUS` を判定する |
| 2以上 | 勝手に選ばず `BLOCKED`。Issue番号一覧を報告し、作業を開始しない |

候補が1件の場合の `STATUS` は次のとおり扱う。

- `READY`: 実行可能。
- `HOLD`: 実行しない。
- `DONE`: 再実行しない。
- 欠落、複数記載、上記以外、構文が壊れている: 推測せず `BLOCKED`。

CLOSED Issue は `STATUS` にかかわらず絶対に再実行しない。merge 済み PR が対象 Issue を
完了している場合も `DONE` と扱い、同じ成果物の Issue を作成・再利用しない。

## 5. ChatGPT PM の挨拶起動手順

KAME LIFE GUIDE の作業文脈で Owner が ChatGPT PM に「おはよう」「こんにちは」
「こんばんは」のいずれかを入力した場合、3語を同じ **PM STARTUP COMMAND** として扱う。
挨拶だけを理由に不要な作業、再監査、Issue を作らず、PM は次を行う。

1. GitHub の最新 `main` を実測する。
2. `AI-HANDOFF.md` の `COMPLETED` / `FIXED_FACTS` / `UNRESOLVED` / `NEXT` を確認する。
3. OPEN `[CODEX-TASK]` Issue と OPEN PR を確認する。
4. 重複作業防止ゲートを適用し、現在の `NEXT` が実行可能か判定する。
5. 同じ成果物の OPEN Issue があれば再利用し、Owner へ
   「Issue #NNN が準備済み。Codexには『見て』でOK」と短く返す。
6. 同じ成果物の OPEN Issue がなく、`NEXT` が実行可能なら、§2を満たす
   `[CODEX-TASK]` Issue を**1件だけ**作り、Owner へ
   「Issue #NNN 作成済み。Codexには『見て』でOK」と短く返す。
7. `NEXT` が `BLOCKED` / `DECISION` / 外部入力待ちなら Issue を作らず、不足入力だけを伝える。

PM は Issue 作成前に `COMPLETED` / `FIXED_FACTS` / `UNRESOLVED` / `NEXT`、既存 OPEN
`[CODEX-TASK]`、既存 OPEN PR を確認する。Issue には実測 `BASE`、対象、Scope、変更禁止、
成功条件、検証方法、完了条件を明記する。

## 6. Codex の実装・closeout

有効な `READY` Issue を選択した後は、Issue確認 → BASE確認 → 対象ファイル確認 → 実装 →
検証 → commit → PR作成可能状態まで進める。PR本文には対象 Issue 番号を必ず記載し、可能なら
`Closes #<Issue番号>` を入れる。

シェルの `git push` が認証不足で失敗した場合は、PAT入力をOwnerへ要求せず、認証方法を
勝手に変更せず、同じpushを反復せず、再実装もしない。Codex Cloud UI の「PRを作成する」を
利用できる状態で終了し、その旨を報告する。

- PR がmergeされた場合: 対象 Issue は CLOSED / DONE。次回「見て」で再実行しない。
- PR が未mergeの場合: Issue は OPEN のまま。同じタスクの新規 Issue を作らない。
- `BLOCKED`: Issueを別作業として増殖させず、原因と具体的な再開条件を残す。
- closeout と証拠は `handoff-gate.md` / `closeout-gate.md` に従う。
