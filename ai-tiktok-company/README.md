# AI TikTok Company — 実装（Phase 2.0 / Sprint 1 MVP）

> 設計は確定済み（`../docs/ai-tiktok-company/` の Phase 0/0.5/1/1.5/1.6）。本リポはその**実装**。
> **実行方式は標準運用（Claude Code ローカル + commit/push）**。詳細 → `docs/OPERATIONS.md`。

## Sprint 1 のスコープ
**言語系のみ**を最後まで通す: `Idea → Planning → Script → QA → Ready Package`。
画像/動画/音声/字幕生成・TikTok投稿・分析は**未実装**（`docs/NOT_IMPLEMENTED.md`）。

## 標準の実行方式（重要）
- **頭脳** = Claude Code を**ローカル(セッション)で実行**し、各AI社員の役割プロンプトを実行。
- **記録・状態** = GitHub Issue（1動画=1 Epic、`stage:*` ラベルで遷移）＋ commit。
- **受け渡し** = Issue コメント内の JSON（`contracts/` 準拠、最小情報のみ）。
- **人間ゲート** = Idea 承認（`stage:planning` 付与）と最終投稿（オーナーのみ）。
- **GitHub Actions による自動実行・Anthropic API の常時呼び出しは採用しない**（追加課金を前提にしない）。
  → よって **`ANTHROPIC_API_KEY` の Secret 登録は不要**。

## 構成
```
ai-tiktok-company/
├── prompts/            AI社員6名の役割プロンプト（CEO/PM/企画/脚本/QA/投稿）
├── contracts/          AI社員間 JSON データ契約（envelope + 5ハンドオフ）
├── .github/
│   ├── ISSUE_TEMPLATE/idea.md       Idea(Epic) テンプレート
│   └── workflows/99-bootstrap-labels.yml   ラベル一括作成(GITHUB_TOKENのみ・setup)
├── optional/actions-mode/           【非標準・不採用】Actions実行案(00〜40)を参考保管
├── labels.md           ラベルと状態遷移
└── docs/               OPERATIONS(標準運用) / OUTPUT_RULES / RUNBOOK / TEST_SCENARIOS / NOT_IMPLEMENTED
```

## 使い方（標準運用）
`docs/RUNBOOK.md` 参照。要約: Claude Code に各工程を実行させ、GitHub Issue に記録・ラベル遷移する。
ラベル体系は `labels.md`（作成済み。`99-bootstrap-labels` で再生成も可）。

## 不変原則（実装も従う）
正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益 / 推測禁止・実測優先・不明は不明 /
公開・支出・採用・Secretsはオーナーのみ / 全成果物は Issue に記録 /
報告はコピー可能形式（`docs/OUTPUT_RULES.md`）。
