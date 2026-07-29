# RUNBOOK — Sprint 1 動作確認手順（標準運用 = Claude Code ローカル）

> 標準実行は **Claude Code をローカルで実行 + GitHub へ記録**。
> GitHub Actions / `ANTHROPIC_API_KEY` は**不要**（`docs/OPERATIONS.md`）。

## セットアップ（初回のみ）
1. リポジトリ作成済み: `gagalife04291225-lab/ai-tiktok-company`。
2. ラベル作成済み（`labels.md` / `99-bootstrap-labels` で再生成可）。
3. **Secret 登録は不要**（Actions で Anthropic API を呼ばないため）。

## 標準運用での「1本の通し」
Claude Code（このセッション）に各工程を依頼する。各工程は役割プロンプト（`prompts/`）に従い、
成果物を GitHub Issue に記録し、`stage:*` ラベルを次工程へ進める（ラベル/コメントは MCP github 経由）。

1. **Idea (CEO)**: 「テーマ◯◯で Idea を作って」と依頼 → CEO 役割で Idea Issue を作成（`type:idea,stage:idea`）。
2. **承認ゲート（人間）**: オーナーが内容を確認し **`stage:planning` を付与**。
3. **Planning (企画)**: 企画コメント + `plan-to-script` JSON を Issue に記録 → `stage:script` へ。
4. **Script (脚本)**: 台本コメント + `script-to-qa` JSON（G1〜G4）→ `stage:qa` へ。
5. **QA (品質管理)**: 検証義務(CLAIM/SOURCE/CONFIDENCE/DOUBT/RECONCILE)＋100点採点。
   - 合格(≥80 & factuality=pass) → `stage:ready` + `quality:pass`。
   - 不合格 → `quality:needs-fix` + `stage:script`（差戻し、最大3回、超過で `status:waiting-owner`+`risk:high`）。
6. **Ready Package (投稿)**: キャプション2案/ハッシュタグ/投稿時間案 + `ready-to-owner` JSON → `status:waiting-owner`。
7. **投稿（人間）**: オーナーが Ready Package を確認し TikTok へ手動投稿 → `stage:published`。

## 確認ポイント（GitHub 上で見える状態遷移）
- Issue のラベルが idea→planning→script→qa→ready と遷移していること。
- 各工程のコメントに人間可読の成果物 + JSON ペイロードが残っていること。
- QA コメントに検証5項目と tech_score。Ready Package に captions×2/hashtags/post_time_suggestion。

## 【非標準・参考】GitHub Actions 実行モード
`optional/actions-mode/` に Actions + claude-code-action 版(00〜40)を保管。
**採用しない**（Anthropic API の常時課金を前提にしないため）。将来採用時の前提は
`optional/actions-mode/README.md` 参照（Secret 登録・課金許容＝オーナー決裁）。
