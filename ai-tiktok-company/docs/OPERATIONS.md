# 標準運用ルール（実行方式 / 恒久・オーナー承認 2026-07-29）

> 位置づけ: **実行方式のルール**。設計（Phase 0/0.5/1/1.5/1.6）は不変更。
> KAME LIFE GUIDE / DCS プロジェクトと同じ運用方式に統一する。

## 1. 標準運用
- **Claude Code をローカル(セッション)で実行**し、AI社員の役割（CEO/PM/企画/脚本/QA/投稿…）を実行する。
- 成果物・状態は **GitHub へ commit / 必要に応じて push**。
- **結果を報告**（コピー可能形式・OUTPUT_RULES.md 準拠）。
- GitHub は「記録・状態の保管場所」。**Actions による自動実行は前提にしない**。

## 2. Anthropic API / 課金
- **GitHub Actions から Anthropic API を常時呼び出す構成は採用しない**（追加課金を前提にしない）。
- **Claude Code の通常運用を標準**とする。
- 副次効果: パイプラインが Actions/Anthropic API に依存しないため、**`ANTHROPIC_API_KEY` の Secret 登録は不要**。

## 3. GitHub 認証ルール
- GitHub 権限が**不要**な作業では PAT / API キーを要求しない。Actions 自動実行を前提にしない。
- GitHub 権限が**必要**な作業になった時だけ「**PATが必要です**」と理由を明確に報告する。
- PAT 提供までは、権限が必要な処理は実施しない。
- 実行できない前提条件がある場合は**最初に**報告する。
- 権限が不要な作業は、そのまま継続して進める。

## 4. PAT が必要になる代表例
- 新規リポジトリ作成 / GitHub Secrets 変更 / GitHub Settings 変更 / GitHub App 権限で不可の操作 / その他 GitHub 認証が必要な操作。
- 注: 本リモート環境では **git commit/push は事前設定のプロキシ経由で成功**するため、通常の push には PAT 不要。PAT が要るのは上記のような「現在の権限で 403 になる操作」。

## 5. PAT 運用
- 受け取ったら**必要な作業のみ**実施。**使い回し禁止**。
- 完了後は必ず「**PATを revoke（失効）してください**」と案内する。

## 6. Actions の位置づけ（実行方式の変更点）
- **標準実行 = Claude Code ローカル + commit/push**。
- `optional/actions-mode/` の Actions ワークフロー（`anthropics/claude-code-action` で Anthropic API を呼ぶ 00〜40）は**採用しない代替案**として保管（非標準・参考）。
- `.github/workflows/99-bootstrap-labels.yml`（GITHUB_TOKEN のみ・一度きり・Anthropic API 不使用）は setup 用途で保持可。

## 7. 標準運用での「1本の通し」（概略）
Claude Code(ローカル) が各役割を順に実行し、GitHub Issue(1動画=1 Epic)へ記録・ラベル遷移する:
Idea(CEO) → オーナー承認(stage:planning) → 企画 → 脚本 → QA(二重採点/差戻し) → 投稿(Ready Package) → status:waiting-owner → オーナー投稿。
- 各工程の成果物・JSON契約は Issue コメント/コミットに記録（`prompts/` `contracts/` は不変更）。
- ラベル操作・コメントは Claude Code が MCP(github) 経由で実施（Actions 不要）。
