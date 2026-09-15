# AGENTS.md — AIエージェント共通入口

このファイルは **どのAIエージェントでも最初に読む入口**（目次）です。
Claude Code / OpenAI Codex / GPT-6 Astra / その他、どれで作業しても同じ正本を読みます。

**このファイルに「今の状態」は書きません。** 進捗・未解決・次工程は
[`docs/AI-HANDOFF.md`](docs/AI-HANDOFF.md) を毎回読んで取得してください。

プロジェクト: カメライフガイド（https://kamelifeguide.com）
リポジトリ: `gagalife04291225-lab/kame-life-guide-` / GitHub Pages で配信

---

## 読む順序

毎回すべてを読まないこと。必要なものだけを、この順で読みます。

| 順 | 読むもの | いつ読むか |
|----|----------|-----------|
| 1 | このファイル（AGENTS.md） | 毎回 |
| 2 | [`docs/AI-HANDOFF.md`](docs/AI-HANDOFF.md) の `CURRENT_BASE` / `UNRESOLVED` / `NEXT` | 毎回 |
| 3 | 自分の役割のルール（下表） | 毎回（役割分） |
| 4 | 作業対象のファイル本体 | 変更前に必ず |
| 5 | `docs/fixed-facts/` / `DEVELOPMENT_CONSTITUTION.md` / `docs/archive/` | 該当時のみ |

### 役割別のルール（vendor-neutral 共通正本）

| 役割 | 読むファイル | 内容 |
|------|--------------|------|
| PM（RO-2） | [`docs/agent-rules/pm-conduct.md`](docs/agent-rules/pm-conduct.md) | PM 行動規範・作業開始前ゲート・Merge Gate |
| 実装（RO-3） | [`docs/agent-rules/handoff-gate.md`](docs/agent-rules/handoff-gate.md) | 引き継ぎ・重複作業防止・報告形式・EVIDENCE GATE |
| 実装（RO-3） | [`docs/agent-rules/closeout-gate.md`](docs/agent-rules/closeout-gate.md) | 残件を積み上げない CLOSE 規則・デプロイ検証 |

### 上位規範

[`DEVELOPMENT_CONSTITUTION.md`](DEVELOPMENT_CONSTITUTION.md) が上位規範です。
本ファイルおよび `docs/agent-rules/` 配下は憲法に準拠する Procedure 層であり、
矛盾した場合は憲法が優先します。

### エージェント固有の入口

| エージェント | 入口 | 備考 |
|--------------|------|------|
| Claude Code | [`CLAUDE.md`](CLAUDE.md) | Claude 用入口 ＋ KLG固有のコードベース解説・SKILL |
| Codex / GPT-6 Astra / その他 | 本ファイル（AGENTS.md） | ここから上表の共通正本へ |

`.claude/` 配下は Claude Code 固有の設定です。
`.claude/rules/*.md` は互換のため残していますが**正本ではなく**、
`docs/agent-rules/` への参照だけが書かれています。

---

## 全エージェント共通の運用ルール

詳細は上表の正本にあります。ここは要点だけです。

1. 作業開始時に [`docs/AI-HANDOFF.md`](docs/AI-HANDOFF.md) を読む。これが現在状態の**唯一の正本**。
2. `CURRENT_BASE` / `UNRESOLVED` / `NEXT` を必ず確認する。
3. `COMPLETED` / `FIXED_FACTS` は**固定入力**。原則として再調査・再監査・再検証しない。
   再調査してよいのは NO-REWORK GATE の4条件（① 新しい矛盾 ② 新証拠 ③ 対象データ／コードの変更
   ④ Owner の明示指示）のいずれかに該当する場合だけ。「念のため」は理由にならない。
4. [`DEVELOPMENT_CONSTITUTION.md`](DEVELOPMENT_CONSTITUTION.md) が上位規範。
5. 役割に応じて `docs/agent-rules/` の該当ルールを読む。
6. **対象作業に必要なものだけ読む。** 毎回全文書を読まない。
7. 変更前に対象ファイルの現在の内容を読む。既存実装を把握せずに書き始めない。
8. **最小変更。** 指示されていない「ついで」の修正・リファクタを混ぜない。
9. **検証していないものを「完了」としない。** 実測していないことを PASS 扱いしない。
10. 作業終了時は**同じPRの中で** `docs/AI-HANDOFF.md` を更新する。
    `NEXT` は実態に合わせて**1つだけ**設定し、古い状態記述を残さない。
11. `UNRESOLVED` を勝手に全部処理しない。今回実行するのは `NEXT` の1工程だけ。
    Owner の指示が `NEXT` と食い違う場合は Owner の指示を優先し、作業後に `NEXT` を更新する。
12. 全ゲート PASS かつ危険性がない場合は、
    [`docs/agent-rules/handoff-gate.md`](docs/agent-rules/handoff-gate.md) §2 の条件に従い merge まで進めてよい。
    条件を満たさない場合は Owner 判断へ戻す。
13. **`BLOCKED` / `NOT FOUND` / `NOT EVALUATED` を混同しない。**
    取得を試みて失敗したのか、存在しないのか、そもそも評価していないのかを区別して書く。
14. **証拠の強度を区別する。** 一次データ（公式・実測・API応答）と、二次情報と、推測を混ぜない。
15. **推測を検証済みとして記録しない。** 不明なものは「不明」「未確認」と明記する。

### 報告の証拠ルール（EVIDENCE GATE）

「実施した」「反映した」という主張には、必ず次を添えます。

- 変更したファイルの raw URL
- merge 後に**実測した** commit SHA（`main` や「最新」で代替しない）
- PR番号

受入判定する側は、報告文だけを根拠にせず raw URL を開いて確認し、
`VERIFIED` / `UNVERIFIED` を明示します。詳細は
[`docs/agent-rules/handoff-gate.md`](docs/agent-rules/handoff-gate.md) §3-4。

---

## Owner の作業条件

| 項目 | 内容 |
|------|------|
| Owner | ひでお（亀好きさん） |
| 主な作業環境 | Android / Termux。PC は時々 |
| merge 権限 | Owner。エージェントは憲法 §2.6-I1 の条件を満たす場合のみ merge 可 |
| 報告の形式 | まず結論を短く。技術的詳細は求められたときだけ出す |

Owner から明示的に指示された内容は、`NEXT` より優先します。
