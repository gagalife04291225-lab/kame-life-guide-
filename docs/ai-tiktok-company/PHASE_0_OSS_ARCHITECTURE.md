# AI TikTok Company — Phase 0 成果物：OSS調査・アーキテクチャ設計書
測定日: 2026-07-29 | 出典: GitHub API 実測 + 各公式ドキュメント | 実装なし・設計のみ

## 0. 調査方法（provenance）
- star/fork/open issues/言語/ライセンス/最終push は GitHub REST API (search_repositories) 実測値。
- ライセンスは spdx_id を一次情報とし "other" は公式LICENSEで補完。定性項目は公式Doc+Web検索(2026-07)で裏取り。
- 未確認は「※要検証」と明記。予測値は「推定」とラベル。

## ① OSS比較表（実測 / 2026-07-29）

| OSS | リポジトリ | ★star | fork | open issue | 言語 | ライセンス | 最終push |
|-----|-----------|-------|------|-----------|------|-----------|----------|
| Activepieces | activepieces/activepieces | 23,458 | 3,964 | 428 | TS | other → CE=MIT | 2026-07-29 |
| n8n | n8n-io/n8n | 198,475 | 59,734 | 1,394 | TS | other(Sustainable Use) | 2026-07-29 |
| MCP(servers) | modelcontextprotocol/servers | 89,007 | 11,316 | 697 | TS | other → MIT | 2026-07-26 |
| Claude Code | anthropics/claude-code | 139,448 | 22,391 | 13,709 | (issue/docs) | 本体は非OSS(独自) | 2026-07-25 |
| Claude Code Action | anthropics/claude-code-action | 8,493 | 2,008 | 640 | TS | MIT | 2026-07-25 |
| OpenHands | OpenHands/OpenHands | 82,453 | 10,577 | 248 | TS/Py | MIT | 2026-07-28 |
| LangGraph | langchain-ai/langgraph | 38,390 | 6,466 | 649 | Python | MIT | 2026-07-28 |
| CrewAI | crewAIInc/crewAI | 56,303 | 7,999 | 706 | Python | MIT | 2026-07-29 |
| AutoGen | microsoft/autogen | 60,069 | 9,046 | 977 | Python | CC-BY-4.0(repo) | 2026-04-15 ⚠ |
| Flowise | FlowiseAI/Flowise | 55,008 | 24,778 | 1,026 | TS | other → Apache-2.0系 | 2026-07-27 |
| Open WebUI | open-webui/open-webui | 147,157 | 21,387 | 320 | Python | other(Open WebUI License) | 2026-07-27 |
| ComfyUI | Comfy-Org/ComfyUI | 122,671 | 14,484 | 4,357 | Python | GPL-3.0 | 2026-07-29 |
| Dify | langgenius/dify | 150,634 | 23,732 | 949 | TS | other(Dify OSS License) | 2026-07-29 |
| GitHub Actions | (プラットフォーム機能) | — | — | — | — | 商用SaaS(無料枠) | 常時 |

- ⚠ AutoGen: 最終push 2026-04-15 停滞。Microsoft Agent Framework(GA 1.0, 2026-04-03)へ統合、maintenance mode。
- Claude Code の open issue 13,709 はバグ管理repoであり品質不良ではない（本体CLIは別・活発）。
- ライセンス補足: Activepieces CE=MIT(自己ホスト無制限無料)。n8n=Sustainable Use(内部利用無料・SaaS再販不可)。ComfyUI=GPL-3.0。

## ② 推奨ランキング（ゴール「確認と投稿だけ」基準）
コア必須: 1.Claude Code(頭脳) 2.GitHub+Actions(記録・無料実行) 3.MCP(連携規格) 4.ComfyUI(画像/動画)
連携の糊(任意): 5.Activepieces 6.n8n 7.Dify
状況特化(将来): 8.LangGraph 9.OpenHands 10.Open WebUI 11.CrewAI 12.Flowise
非推奨: 13.AutoGen(maintenance mode)

## ③ 採用理由（要旨）
- Claude Code: 既存 AI Company OS で運用中＝学習コスト最小。MCPネイティブで各職能を1頭脳で兼務。
- GitHub+Actions: 既存規範と地続き。Issue=タスク/状態、PR=成果物、Actions=無料スケジューラ。
- MCP: 事実上の業界標準。ベンダーロック回避、部品差し替え可能。
- ComfyUI: 動画生成OSSの共通フロントエンド。ワークフローJSON固定で品質再現性。
- Activepieces/n8n: 生成AI以外の地味な配管をノーコードで。まずCE=MIT無料のActivepieces。

## ④ 不採用理由（要旨）
- AutoGen: 停滞・maintenance mode → 不採用。
- CrewAI: 破壊的変更が速く保守性注意。Claude Codeで代替可。
- LangGraph: Pythonコード必須で学習コスト高、ゴールに過剰。将来オプション。
- OpenHands: 自律コード開発用途で方向性がずれる。将来の自己改善用に保留。
- Open WebUI/Flowise/Dify: UI/可視化は非必須。分析拡張で再評価。
- フル自動TikTok投稿を組まない: 規約/BANリスク＋本ゴールは人間が最終ゲート。

## ⑤ システム構成図（レイヤ）
- L4 統治: GitHub Issues/PR = 単一の記録・承認ゲート（Constitution/AGENTS準拠）
- L3 頭脳: Claude Code（人格切替で各職能）→ MCP で下位ツール呼び分け
- L2 実行: GitHub Actions（定期起動/無人実行・無料枠）
- L1 生成/連携(MCP経由・差し替え可): ComfyUI(動画/画像) / 画像API / Google Drive / Activepieces・n8n
- L0 分析: GA4 / TikTok Analytics / Search Console → Claude が読み取り → 改善Issue化
- 動画1本のライフサイクル: 企画→台本→画像/動画生成→編集/字幕/BGM→品質→投稿文+タグ→オーナー確認→手動投稿→分析→改善

## ⑥ GitHubフォルダ構成（設計案）
ai-tiktok-company/ に README / MANIFEST・AGENTS / CLAUDE.md / docs/ / .github/(workflows,ISSUE_TEMPLATE,PR template) /
prompts/(各AI社員) / pipelines/(comfyui,subtitle,bgm,quality_gates) / content/(ideas,scripts,drafts,final) / analytics/(KPI,reports)。
重い素材は Google Drive、GitHubには台本/設定/記録/指標を置く二層構成。

## ⑥-b AI社員の役割（初期版）
CEO/マーケティング/企画/脚本/画像/動画/品質管理/投稿/分析 — 大半は Claude Code が人格切替で兼務、重い生成のみ ComfyUI 等へ委譲。

## ⑦ Issue運用ルール（要旨）
1動画=1企画Issue。ラベルでライフサイクル管理。成果物はPR経由、Merge=Owner のみ。検証義務(CLAIM/SOURCE/CONFIDENCE/DOUBT/RECONCILE)。週次上限で暴走防止。

## ⑧ 開発ロードマップ
Phase0(完了)設計 → Phase1 骨格(言語系) → Phase2 生成統合(ComfyUI) → Phase3 字幕/音声/BGM → Phase4 無人量産 → Phase5 分析FB → Phase6+ 拡張。

## ⑨ リスク一覧（要旨）
AI誤情報/著作権※要検証/TikTok規約/ComfyUI GPUコスト/OSS破壊的変更/停滞レガシー化/品質ばらつき/自動化暴走/Secrets漏洩/再販ライセンス※要確認。

## ⑩ 将来拡張
多チャンネル(YouTube/Reels)/多言語/ダッシュボード(Dify/Open WebUI)/自己改善ループ(OpenHands/LangGraph)/ノーコード配管拡充/音声BGM内製化。

## ★ 結論（唯一の推奨構成）
**Claude Code（頭脳）× GitHub + GitHub Actions（記録・無料実行基盤）× MCP（連携規格）× ComfyUI（画像・動画生成）** をコアとし、必要段階で Activepieces（→将来 n8n）を追加。人間（オーナー）を最終ゲートに残す。
