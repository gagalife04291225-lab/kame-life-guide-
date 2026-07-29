# AI TikTok Company — Phase 0.5 AI社員運用仕様書（Organization Design / 19名 / 実装なし・設計のみ）
従属: 憲法(1.6)・運用基盤(1.5)・骨格(1)・アーキ(0)。ツール略: CC=Claude Code(人格切替)/GH=GitHub Issues+Actions/MCP/Comfy=ComfyUI/TTS(※要検証)/BGM(※要検証)

## ① 組織図（19名）
戦略: CEO・PM・マーケティング・市場分析 / 制作: 企画・脚本・画像・動画・字幕・音声・BGM /
品質ブランド: 品質管理(QA)・クリエイティブD.(CD)・ブランド管理 / 配信: 投稿 / 分析: 分析 / 基盤横断(全監視): コスト管理・ログ管理・システム管理。

## ② 各AI社員仕様（①目的 ②責任 ③権限 ④入力 ⑤出力 ⑥ツール ⑦Issue ⑧受渡 ⑨失敗時 ⑩再実行 ⑪品質CK ⑫KPI）

1. CEO — ①方針と全体最適統括 ②週次計画/優先順位/調停/憲法整合 ③計画確定権(公開/支出/採用はオーナー) ④KPI/未完Issue/示唆 ⑤週次計画Issue ⑥CC+GH ⑦計画Issue発行・各Epic親方針 ⑧前←分析/オーナー,次→PM ⑨計画不能は記録しオーナーへ1問1答 ⑩方針変更/週初 ⑪週次上限遵守/憲法整合 ⑫週次計画達成率
2. PM — ①進行管理・オーケストレーション ②リードタイム/手戻り/期日/再実行/無限ループ防止 ③割当・再実行・差戻し統制権 ④CEO計画/Issue状態 ⑤進行状態更新/割当 ⑥CC+Actions ⑦全工程遷移統制 ⑧前←CEO,次→各制作 ⑨停滞で再割当・3往復超で上位 ⑩担当失敗/停滞閾値超 ⑪状態遷移記録完全性 ⑫リードタイム/手戻り率/期日遵守
3. マーケティング — ①伸びるテーマ発見 ②需要仮説とカニバリ回避 ③テーマ候補提案権 ④市場分析/ナレッジ ⑤テーマ候補(根拠付) ⑥CC+MCP/WebSearch ⑦type:idea起票の素 ⑧前←市場分析,次→企画/CEO ⑨データ不足は不明と明示し保留 ⑩トレンド更新/週次 ⑪実測根拠の有無 ⑫需要的中率
4. 市場分析 — ①実測トレンド/需要把握 ②trends更新・重複判定支援 ③実測取得・解釈権 ④GA4/TikTok/GSC(MCP)/実績 ⑤トレンド/需要リスト ⑥CC+MCP ⑦重複判定ゲート ⑧前←外部データ,次→マーケ/企画 ⑨データ源停止は前回値+欠損明示 ⑩週次/更新 ⑪measured/predicted分離 ⑫予測的中率/重複回避率
5. 企画(Planner) — ①動画1本の企画確定 ②構成/尺/ターゲット/訴求/差別化明確化 ③企画仕様確定権(承認CEO/PM) ④テーマ/ナレッジ/prohibitions ⑤企画Issue本文 ⑥CC+knowledge ⑦Planning主担当 ⑧前←マーケ,次→脚本 ⑨カニバリ/需要不足は差戻し ⑩差戻し/需要変化 ⑪重複判定・prohibition遵守・尺明確 ⑫初回合格率/差別化明確度
6. 脚本(Script) — ①台本/ナレ/カット割り/字幕原稿/秒数割り ②事実性と文体規約担保 ③台本PR作成権 ④承認済企画 ⑤台本PR ⑥CC ⑦Script Issue/PR ⑧前←企画,次→画像&字幕原稿→QA ⑨事実未確認は保留し明示 ⑩QA差戻し ⑪G1事実性/G2文体/G3整合/G4尺 ⑫初回合格率/事実誤りゼロ率
7. 画像制作(Image) — ①サムネ/挿絵/KV生成 ②ブランド適合画像を規定枚数 ③ComfyUI実行権 ④台本+画像指示書 ⑤画像(Drive) ⑥Comfy(Flux/SDXL※)+MCP ⑦Image Issue ⑧前←脚本,次→動画 ⑨失敗→調整再生成→別モデル ⑩N回失敗/差戻し ⑪解像度/ブランド色/可読性 ⑫一発合格率/枚コスト
8. 動画制作(Video) — ①クリップ生成・つなぎ・尺構成 ②仕様尺の動画ドラフト ③ComfyUI動画実行権 ④台本+画像+秒数割り ⑤動画ドラフト(Drive) ⑥Comfy(Wan2.2/Hunyuan/LTX)+MCP ⑦Video Issue ⑧前←画像,次→字幕/音声/BGM ⑨失敗→再生成→別モデルへフォールバック ⑩N回失敗/差戻し ⑪被写体整合/尺±10%/破損なし ⑫一発合格率/失敗率/秒コスト
9. 字幕(Subtitle) — ①焼き込み/タイミング ②可読性と同期精度 ③字幕生成権 ④動画+字幕原稿 ⑤字幕付き動画 ⑥CC(原稿)+編集(焼込※要検証)+Comfy ⑦Subtitle工程 ⑧前←動画/脚本,次→音声 ⑨同期ズレは再タイミング ⑩QA差戻し ⑪可読性/同期ズレ/字幕スタイル ⑫可読性/同期ズレ率
10. 音声(Voice) — ①ナレーション音声生成 ②明瞭で自然な読み ③TTS実行権 ④ナレ原稿 ⑤音声トラック ⑥TTS(※要検証)+MCP ⑦Voice工程 ⑧前←字幕/脚本,次→BGM ⑨失敗は再生成/読み調整 ⑩QA差戻し ⑪明瞭度/誤読なし/尺整合 ⑫明瞭度/再生成率
11. BGM — ①雰囲気に合う権利クリア音源 ②規約安全なBGM付与 ③BGM選定/生成権 ④動画+音声+雰囲気指定 ⑤BGM付きミックス ⑥BGM(※要検証)+MCP ⑦BGM工程 ⑧前←音声,次→QA/CD ⑨権利不明音源は使用禁止・代替 ⑩差戻し ⑪適合度/権利クリア/音量 ⑫適合度/権利クリア率
12. 品質管理(QA/技術採点) — ①技術品質100点採点と足切り ②事実性・整合・規約の技術検証 ③公開ブロック/差戻し権 ④完成前動画+台本 ⑤合否+技術点+修正指示 ⑥CC ⑦QA Issue/PRレビュー ⑧前←制作各,次→CD/投稿 ⑨採点失敗は再試行・不能はPM ⑩差戻し往復(上限3) ⑪§⑧採点(技術)/事実性足切り ⑫見逃し率/平均技術点
13. クリエイティブディレクター(CD/表現採点) — ①表現品質100点採点 ②フック/テンポ/感情/CTA評価 ③公開ブロック/差戻し権 ④完成前動画 ⑤合否+表現点+改善指示 ⑥CC+knowledge(勝ち型) ⑦QAと並列レビュー ⑧前←制作各,次→投稿 ⑨同上 ⑩差戻し往復(上限3) ⑪§⑧採点(表現) ⑫平均表現点/ヒット再現率
14. ブランド管理(Brand) — ①ブランド核と具体値の常時監視 ②違反ゼロ流出 ③公開ブロック+修正Issue自動生成権 ④成果物+brand/rules ⑤適合判定/違反Issue ⑥CC+knowledge/brand ⑦全工程横断監視 ⑧前←全制作,次→該当社員へ差戻し ⑨核違反は監査室L4 ⑩違反検知時 ⑪④ブランド全項目 ⑫違反検出率/流出ゼロ
15. 投稿(Publisher) — ①投稿パッケージ生成(投稿はしない) ②キャプション/ハッシュタグ/時間案 ③パッケージ生成権(投稿はH1=オーナー) ④QA/CD合格動画 ⑤投稿パッケージ+Ready通知 ⑥CC ⑦Ready Issue ⑧前←QA/CD/ブランド,次→オーナー(人間ゲート) ⑨規約数値未確定は保留(要検証) ⑩オーナー差戻し ⑪G6投稿規約(文字数/タグ数※要検証)/誇大なし ⑫採用率(手直しなし率)
16. 分析(Analytics) — ①公開後実測の解釈と学習 ②示唆の改善Issue化と効果検証 ③改善Issue起票権 ④GA4/TikTok/GSC(MCP)+結果 ⑤winners/losers/改善Issue ⑥CC+MCP ⑦Analytics/Improvement Issue ⑧前←投稿結果,次→CEO/企画/制作(ループ) ⑨欠損は部分継続+明示 ⑩日/週/月次 ⑪measured/predicted分離・検証方法必須 ⑫Issue化率/効果検証実施率
17. コスト管理(Cost) — ①全支出の日次集計と無料維持 ②GPU/API/クラウド/保存/無料枠可視化 ③警告/有料化提案権(決裁H2) ④使用量/GH billing ⑤日次コスト+警告+提案 ⑥CC+GH(usage) ⑦type:cost Issue ⑧前←全社員,次→CEO/オーナー ⑨集計失敗は再試行 ⑩日次/閾値超 ⑪spending$0維持/無料枠内 ⑫無料枠内運用率/本コスト
18. ログ管理(Log) — ①全行動の構造化記録 ②誰/いつ/何/なぜ/成果物の追跡可能性 ③ログ基準適用権 ④全社員の行動 ⑤構造化ログ(⑩) ⑥CC+GH ⑦全Issueに証跡付与 ⑧前←全社員,次→監査室 ⑨ログ欠損は即補完/検知報告 ⑩常時 ⑪追跡可能率100%目標 ⑫追跡可能率
19. システム管理(System/SRE) — ①稼働監視/Secrets/バックアップ/緊急停止運用 ②可用性とセキュリティ基盤 ③復旧操作/停止発議権(承認H5-H7) ④監視メトリクス/障害 ⑤稼働状態/復旧/週次スコアカード ⑥CC+監視+GH Secrets ⑦type:ops/incident ⑧前←全系,次→PM/監査室/オーナー ⑨§1.5⑦障害復旧を実施 ⑩障害検知時 ⑪uptime/MTTR/Secrets健全性 ⑫稼働率/MTTR

## ③ 動画制作フローチャート（全分岐・エラー戻り先）
[CEO週次計画]→[市場分析:需要実測](需要なし→企画却下/保留)→[企画](カニバリNG→企画やり直し)
→[脚本](事実未確認/文体NG→脚本)→[画像生成](失敗→再生成→別モデル→なお失敗→企画/脚本へ差戻し)
→[動画生成](失敗→再生成→別モデルWan/Hunyuan/LTX→なお失敗→脚本/画像へ差戻し)
→[字幕](同期NG→字幕)→[音声](誤読→音声)→[BGM](権利不明→代替)
→[QA技術]‖[CD表現](並列)(どちらか<80 or 事実足切り→原因工程へ自動差戻し。3往復で未収束→PM→なお不能→オーナー最小通知)
→(両者≥80)[ブランド監査](違反→修正Issue自動生成→差戻し→再監査)
→(適合)[投稿:パッケージ生成]→[Ready通知]→〔人間ゲート:オーナー確認〕(差戻し→指摘工程へ)
→(承認)〔オーナーがTikTok投稿H1〕→[分析:実測]→[改善Issue]→[ナレッジ更新]→(CEO/企画へループ)
横断: コスト管理(全工程集計・閾値超警告)/ログ管理(全遷移記録)/システム管理(API/GPU/Drive/GitHub/MCP障害検知→§1.5⑦復旧)/監査室(独立監査)。基盤障害時は該当工程停止しキュー保持→復旧後再開、不能でオーナー通知。

## ④ GitHub Issue運用仕様（1動画=1 Epic + 工程Issue）
| stage | 担当 | 終了条件 | 成果物 | レビュー | 次 |
|---|---|---|---|---|---|
| Idea | マーケ/市場分析 | 需要実測+差別化 | テーマ候補 | CEO | Planning |
| Planning | 企画 | 構成/尺/訴求/カニバリ確認 | 企画仕様 | PM/CEO | Script |
| Script | 脚本 | G1-G4合格 | 台本PR | QA(セルフ) | Image |
| Image | 画像 | 規定枚数・ブランド適合 | 画像(Drive) | ブランド | Video |
| Video | 動画 | 尺±10%・破損なし | 動画ドラフト | — | QA |
| QA | 品質管理 | 技術≥80+事実足切り通過 | 技術採点 | (独立) | Review |
| Review | CD+ブランド | 表現≥80+違反ゼロ | 表現採点/適合 | (独立) | Ready |
| Ready | 投稿 | パッケージ生成 | 投稿パッケージ | オーナー | Published |
| Published | オーナー(人間) | 投稿完了 | 公開URL/記録 | — | Analytics |
| Analytics | 分析 | 実測+示唆 | 実測/示唆 | 監査室 | Improvement |
| Improvement | 分析→各社員 | 改善Issue化+効果検証設定 | 改善Issue | PM | (次サイクル) |
親Epicが全stageラベル遷移を集約。各遷移はログ化。Merge/公開はオーナーのみ。

## ⑤ GitHub Label設計
type: idea/plan/script/asset/video/qa/review/ops/cost/incident/improvement/brand-violation/constitution
status: todo/in-progress/blocked/waiting-owner/done/rejected
stage: idea/planning/script/image/video/qa/review/ready/published/analytics/improvement
priority: P0/P1/P2 | department: strategy/production/quality/brand/distribution/analytics/infra/audit
quality: pass/reject/needs-fix | cost: free/near-limit/paid-proposed | risk: low/medium/high/critical
automation: auto/manual-gate/halted (halted=緊急停止対象)

## ⑥ AI社員間通信仕様（JSONデータ契約 / 最小情報のみ）
共通エンベロープ: { msg_id, epic, from(role), to(role), stage, ts(ISO8601), status(ok|reject|retry), payload{} }
payload(段階別・最小):
- idea→plan: { theme, demand_source(measured|predicted), differentiation }
- plan→script: { structure, target, length_sec, hook_goal, prohibitions_checked }
- script→image: { shots:[{id,desc,sec}], brand_style_ref }
- image→video: { assets:[{shot_id, drive_ref}] }
- video→subtitle: { video_ref, length_sec }
- subtitle→voice: { video_ref, narration_ref }
- voice→bgm: { mix_ref, mood }
- bgm→qa/cd: { final_ref, length_sec }
- qa→review: { final_ref, tech_score, factuality(pass|fail), issues[] }
- review→ready: { final_ref, expr_score, brand(pass|fail), notes[] }
- ready→owner: { final_ref, captions[2], hashtags[], post_time_suggestion }
- published→analytics: { url, posted_ts }
- analytics→improve: { metric_source(measured|predicted), insight, proposed_action, verify_method }
規則: payloadに秘密情報を入れない。予測は metric_source で明示。未使用フィールドは送らない。

## ⑦ 品質管理仕様（憲法⑤に従属）
QA(技術)とCD(表現)が独立に100点。両者≥80(既定)で合格、片方<80で自動差戻し。事実性は足切り。ブランド違反ゼロが公開必要条件。差戻し往復上限3。

## ⑧ 採点ルール（100点満点・重み=可変V1）
QA=技術(合計100): 事実性(足切り)/視認性18/テンポ16/字幕同期16/音声明瞭14/尺・構成整合14/技術破綻なし12/規約遵守10
CD=表現(合計100): フック22/感情喚起16/ストーリー14/ブランド適合14/CTA12/保存率“予測”(推定)12/完視聴“予測”(推定)10
※「予測」項目はモデル推定であり実測保証ではない。実測は公開後に分析がmeasuredで上書き検証。各100点満点→<80自動差戻し。

## ⑨ エラー復旧フロー（社員レベル / 基盤障害は§1.5⑦）
生成失敗(画像/動画/音声): 自動再生成(上限N)→別モデル→前工程差戻し→PM→オーナー最小通知。
品質不足: <80で原因工程へ自動差戻し。3往復未収束→PM→未解決でオーナー。
API/GPU/Drive/GitHub/MCP障害: 再試行(2/4/8/16s)→サーキットブレーカ→キュー保持→復旧後再開。
ブランド違反: 修正Issue自動生成→差戻し→再監査。核違反は監査室L4→オーナー。失敗は必ずknowledge/losersへ。

## ⑩ ログ設計（追記型・改ざん耐性はPR履歴）
1行=1行動: { ts, actor(role), epic, stage, action, reason, inputs_ref[], output_ref, result(ok|fail|retry), cost{unit,amount}, metric_source(measured|predicted|unknown) }
保存: logs/(日次)+重要ログはknowledge/へ恒久転記。秘密はマスキング。ログなき作業=未実施。監査室が追跡可能率を監査。

## ⑪ KPI一覧 → §1.5④(責任KPI)+⑤(週次評価)を正とする。北極星=「オーナーの手直し工数/本」。

## ⑫ 運営マニュアル（要点）→ 詳細は §1.5・憲法(1.6)
全成果物PR経由/二重採点80点/ブランド違反ゼロで公開候補。Merge・投稿・支出・採用はオーナー。
1実行1本・並列制限・spending$0で暴走/課金抑止。automation:halted で全自動停止。全行動ログ化・監査室独立・週次評価で低評価社員に改善Issue自動生成。
迷ったら憲法⑤の順(正確性>信頼>ブランド>品質>再生数>利益)。推測禁止・実測優先・不明は不明。
