# AI TikTok Company — 実装（Phase 2.0 / Sprint 1 MVP）

> 設計は確定済み（`../docs/ai-tiktok-company/` の Phase 0/0.5/1/1.5/1.6）。本フォルダはその**実装**。
> このフォルダ = 将来の専用リポジトリ `ai-tiktok-company` のルートに相当（Phase 0 ⑥ の設計に準拠）。

## Sprint 1 のスコープ
**言語系のみ**を最後まで通す: `Idea → Planning → Script → QA → Ready Package`。
画像/動画/音声/字幕生成・TikTok投稿・分析は**未実装**（Phase 2.1 以降 / `docs/NOT_IMPLEMENTED.md`）。

## 構成
```
ai-tiktok-company/
├── prompts/            AI社員6名の役割プロンプト（CEO/PM/企画/脚本/QA/投稿）
├── contracts/          AI社員間 JSON データ契約（envelope + 5ハンドオフ）
├── .github/
│   ├── ISSUE_TEMPLATE/idea.md   Idea(Epic) テンプレート
│   └── workflows/      00-idea / 10-planning / 20-script / 30-qa / 40-ready
├── labels.md           Sprint1 で使うラベルと状態遷移
└── docs/               RUNBOOK(動作確認) / TEST_SCENARIOS / NOT_IMPLEMENTED
```

## 仕組み（設計どおり）
- **頭脳** = Claude Code（`anthropics/claude-code-action@v1`）を各工程で役割プロンプト付きで起動。
- **記録・状態** = GitHub Issue（1動画=1 Epic、`stage:*` ラベルで遷移）。
- **実行** = GitHub Actions（`issues: labeled` でチェーン起動）。
- **受け渡し** = Issue コメント内の JSON（`contracts/` 準拠、最小情報のみ）。
- **人間ゲート** = Idea 承認（`stage:planning` 付与）と最終投稿（オーナーのみ）。

## 稼働化（オーナー作業・憲法 H3/H5/Owner Merge）
1. 専用リポ `ai-tiktok-company` を作成し、本フォルダの中身をルートに配置（推奨。カメのリポを汚さない）。
2. リポ Secrets に `ANTHROPIC_API_KEY` を登録。
3. `labels.md` のラベルを作成。
4. Actions を有効化し、`00-idea` を workflow_dispatch で実行 → 以降はラベルで自動連鎖。
詳細は `docs/RUNBOOK.md`。

## 不変原則（実装も従う）
正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益 / 推測禁止・実測優先・不明は不明 /
公開・支出・採用・Secretsはオーナーのみ / 全成果物は Issue に記録。
