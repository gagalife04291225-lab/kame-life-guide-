# （非標準・不採用）GitHub Actions 実行モード — 参考保管

このフォルダの `workflows/00-idea.yml`〜`40-ready.yml` は、
**GitHub Actions + `anthropics/claude-code-action`（Anthropic API を Actions から呼び出す）** による
代替の自動実行案です。

## 位置づけ
- **標準運用ではありません（不採用）。** 標準は `docs/OPERATIONS.md` のとおり
  「**Claude Code をローカルで実行 + commit/push**」です。
- 理由: GitHub Actions から Anthropic API を常時呼び出す構成は**追加課金を前提**とするため採用しない
  （2026-07-29 オーナー承認の標準運用ルール）。
- 設計（AI社員の役割・JSON契約・Issueライフサイクル）は `prompts/` `contracts/` `docs/` にあり不変更。
  これらのワークフローは「そういう自動化も可能」という**参考・将来オプション**として保管します。

## もし将来 Actions モードを採用する場合の前提（オーナー決裁事項）
- リポ Secrets に `ANTHROPIC_API_KEY` 登録（憲法 H5）。
- 追加課金（Anthropic API 従量）の許容（憲法 H2・コスト管理の有料化提案→オーナー決裁）。
- これらが無い限り、標準運用（ローカル Claude Code）を使うこと。
