# RUNBOOK — Sprint 1 動作確認手順

> 前提: 稼働にはオーナー作業（専用リポ / `ANTHROPIC_API_KEY` Secret / ラベル作成 / Actions有効化）が必要。
> これらは憲法上オーナー権限（H3/H5, Owner Merge）のため、実装者は実行していない。

## セットアップ（初回のみ）
1. 専用リポ `ai-tiktok-company` を作成（推奨）。本フォルダの中身をリポのルートへ配置。
2. リポ Settings → Secrets and variables → Actions → `ANTHROPIC_API_KEY` を登録。
3. `labels.md` のコマンドでラベルを作成。
4. Settings → Actions で Actions を有効化（workflows が既定ブランチにあること）。

## 実行手順（1本の通し）
1. Actions タブ → 「00 Idea (CEO)」→ Run workflow → `theme` にテーマを入力して実行。
   → CEO が Idea Issue を作成（`stage:idea`）。
2. 作成された Idea Issue を開き、内容を確認して **`stage:planning` ラベルを付ける（＝承認ゲート）**。
   → 「10 Planning」自動起動 → 企画コメント + plan-to-script JSON → `stage:script` へ。
3. 「20 Script」自動起動 → 台本コメント + script-to-qa JSON → `stage:qa` へ。
4. 「30 QA」自動起動 → 採点コメント + qa-to-ready JSON。
   - 合格 → `stage:ready` + `quality:pass`。
   - 不合格 → `quality:needs-fix` + `stage:script`（脚本へ差戻し。最大3回、超過で `status:waiting-owner`+`risk:high`）。
5. 「40 Ready Package」自動起動 → Ready Package コメント（キャプション2案/ハッシュタグ/投稿時間案）+ ready-to-owner JSON → `status:waiting-owner`。
6. オーナーが Ready Package を確認し、TikTok へ手動投稿。投稿後 `stage:published` を付ける（Sprint1 完了）。

## 確認ポイント（GitHub 上で見える状態遷移）
- Issue のラベルが idea→planning→script→qa→ready と遷移していること。
- 各工程のコメントに、人間可読の成果物と JSON ペイロードが残っていること。
- QA コメントに CLAIM/SOURCE/CONFIDENCE/DOUBT/RECONCILE と tech_score があること。
- Ready Package に captions×2 / hashtags / post_time_suggestion があること。

## トラブル時
- ワークフローが起動しない: ラベル名が完全一致しているか（`stage:planning` 等）、workflows が既定ブランチにあるか。
- Claude が失敗: Actions ログ確認。`ANTHROPIC_API_KEY` 未登録が最多要因。
- ラベル操作が失敗: ジョブ権限 `issues: write` と `GH_TOKEN` が渡っているか。
