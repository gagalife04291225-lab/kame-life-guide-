# AI TikTok Company — フォルダ規範（長期記憶エントリポイント）

このフォルダは **AI TikTok Company**（カメライフガイドとは別プロジェクト、AI Company OS の正式プロジェクトの1つ）の設計・長期記憶を格納する。

## 最初に読むもの
**`PROJECT_MEMORY.md`** — 標準仕様の索引・開始位置・継続ルール。本プロジェクトの相談では必ず最初に読む。

## 絶対ルール（要約 / 正典は各設計ファイル）
- **設計は完了済み。毎回ゼロから設計し直さない。既存設計を標準仕様として利用する。**
- **開始フェーズ = Phase 2（MVP実装・検証）。** 設計の再提案より実装への落とし込みを優先。
- 決定済みアーキテクチャ: Claude Code + GitHub + GitHub Actions + MCP + ComfyUI。
- 最高位文書 = `PHASE_1.6_CONSTITUTION.md`（憲法）。不変原則 I1〜I12 を最優先、可変ルール V は実測で更新。
- 品質判断の絶対順序: 正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益。
- 公開ゲート: QA(技術)+CD(表現) 各100点・両者80点以上で合格・片方未満は自動差戻し・ブランド違反ゼロ。
- 推測禁止・実測優先・不明は不明（未確定は「※要検証」）。変更提案は憲法§⑫の改訂手順に従う。

## ファイル一覧
- `PROJECT_MEMORY.md` — 長期記憶/索引
- `PHASE_0_OSS_ARCHITECTURE.md` — OSS調査・アーキテクチャ
- `PHASE_0.5_ORG_DESIGN.md` — AI社員運用仕様（19名）
- `PHASE_1_SKELETON.md` — システム骨格設計
- `PHASE_1.5_OPERATION_FOUNDATION.md` — 運用基盤設計
- `PHASE_1.6_CONSTITUTION.md` — 会社憲法・監査・ガバナンス
