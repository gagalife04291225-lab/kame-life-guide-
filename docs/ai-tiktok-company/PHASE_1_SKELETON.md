# AI TikTok Company — Phase 1 詳細設計書：システム骨格設計（実装なし・設計のみ）
前提: Phase 0 コア「Claude Code × GitHub + Actions × MCP × ComfyUI」採用

## 1. 目的とスコープ
- 目的: 「言語系（企画→台本→品質チェック→投稿文→ハッシュタグ）だけ」を GitHub 上で自動で通し、end-to-end の骨格を人手検証できる状態にする。
- INスコープ: repo の器、AI社員(CEO/企画/脚本/品質管理/投稿)役割プロンプト設計、Issueライフサイクル、Actionsによる起動と記録。
- OUTスコープ(Phase2以降): ComfyUI実生成、字幕/音声/BGM、無人量産、分析FB、自動投稿。
- Exit条件: 1本の企画Issueが 脚本PR→品質チェック→投稿パッケージ まで進み、オーナーが「この台本と投稿文なら動画化してよい」と承認できる品質。

## 2. リポジトリ・ブートストラップ設計（器のみ・中身は承認後）
README / MANIFEST・AGENTS / CLAUDE.md / docs/(ROLES,DECISION_RULE) / prompts/(ceo,planner,scriptwriter,qa,publisher) /
.github/(ISSUE_TEMPLATE: idea,improvement / pull_request_template / workflows blueprint) / pipelines/quality_gates.md / content/(ideas...) 。
二層データ: GitHub=軽量テキストの真実の記録、Drive(将来)=重い素材。

## 3. AI社員プロンプト設計（役割契約: ①役割 ②入力 ③出力形式 ④品質基準 ⑤禁止事項 ⑥エスカレーション）
- CEO: 週次制作計画を宣言。週次上限超・オーナー承認代行を禁止。
- 企画(planner): 企画Issue本文(構成/尺/ターゲット/訴求/サムネ方向)。カニバリ確認必須。
- 脚本(scriptwriter): 台本PR(ナレ+カット割り+字幕原稿+秒数割り)。文体規約準拠、年数記載禁止、AI臭NG。
- 品質管理(qa): 合否+修正指示。CLAIM/SOURCE/CONFIDENCE/DOUBT/RECONCILE を各主張に付与(必須)。
- 投稿(publisher): 投稿パッケージ(キャプション×2/ハッシュタグ/投稿時間案)。投稿はしない。
- ※Phase1では画像/動画は「プレースホルダ社員」＝映像指示書のみ出す。

## 4. 品質ゲート（Phase1=言語系のみ）
G1 事実性(全主張にSOURCE/CONFIDENCE、なし/低確信の断定は不合格) / G2 文体(AI臭なし・年数なし・通称名先行) /
G3 構成整合(企画と一致) / G4 尺(±10%) / G5 規約(誇大/断定/禁止トピックなし) / G6 投稿文(TikTok推奨内 ※具体値は要検証)。
判定: G1〜G5全通過で ready-for-review。

## 5. GitHub Actions 設計図（blueprint / 実行YAMLは未生成）
- A: plan — 手動起動→planner人格→カニバリ確認→企画Issueドラフト(idea)→Ownerがplanned化(承認)。
- B: script — planned時→scriptwriter→台本PR(scripting)→qa人格でセルフレビュー(CLAIM/SOURCE…記録)。
- C: package — qa合格時→publisher→投稿パッケージをPRに追記(ready-for-review)→オーナー通知。
- 共通ガード: Merge=Owner のみ、1実行1本(並列禁止)、Secretsで鍵管理・PAT都度発行/即revoke。

## 6. Issueライフサイクル
idea →(Owner承認)→ planned →(Bot)→ scripting →(PR)→ qa →(合格)→ ready-for-review →(Owner GO)→ [Phase2: generating…]

## 7. Phase1 手動検証チェックリスト（Exit判定）
企画妥当 / 台本が企画と整合・文体規約充足 / QAレビューに検証5項目付与 / 事実性G1クリア / 投稿パッケージ生成 / 全遷移が記録されMerge=Owner / オーナーが動画化GOと判断できる。

## 8. Phase1 バックログ
[P0]#1 repo+規範ファイル器 / #2 docs/ROLES / #3 prompts 5役割 / #4 Issue/PRテンプレ+ラベル
[P1]#5 quality_gates(G6実値は要検証) / #6 Actions A/B/C実装(別途承認) / #7 通しテスト
[P2]#8 DECISION_RULE / #9 Drive接続準備(MCP疎通確認)

## 9. リスクと対策
台本誤情報→QA検証義務ゲート / AI臭→G2機械判定+文体サンプル固定 / Actions権限過多→最小権限+Owner Merge / 過剰生成→1実行1本・週次上限 / Secrets漏洩→GitHub Secrets+PAT即revoke / G6未確定→#5で公式仕様要検証。

## 10. Phase1→Phase2 引き継ぎ
映像指示書フォーマットを ComfyUIワークフロー(JSON)入力へマッピング / Drive接続(MCP)を#9で疎通確認済みに / quality_gatesに映像品質ゲート枠を予約。
