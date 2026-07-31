# Project ODIN v1.0 — OSS Continuous Video Research System（FREE Edition）

AI Company OS を「動画制作会社」ではなく **「動画研究会社」** にするための継続学習基盤。
TITAN v1.0（解析プラットフォーム）の上に、**Research Department（研究部）** と
**継続的な自己進化ループ** を載せたもの。

作成: 2026-07-31
判断順序（不変）: 正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益

---

## 0. 絶対条件の充足状況（全項目・実測）

| 絶対条件 | 状態 | 根拠 |
|---------|------|------|
| 有料サービス禁止 | **充足** | 必須依存は numpy / imageio-ffmpeg / Pillow のみ。すべてOSS |
| 月額課金禁止 | **充足** | 課金要素なし |
| API課金前提禁止 | **充足** | LLM API を必須にしない。提案はルールエンジン（決定的） |
| 商用ライセンス購入禁止 | **充足** | AGPL の ultralytics / essentia は購入せず**既定オフ**にして回避 |
| OSSのみ採用 | **充足** | 203件を実測調査。採用構成は §4 |
| 無料で構築 | **充足** | GitHub Actions 無料枠 + 標準 GITHUB_TOKEN のみ |
| ローカル動作 | **充足** | 解析・統計・提案・WebUI はすべてオフラインで動く |
| Windows対応 | **充足** | `odin.cmd`（PYTHONUTF8対策込み）。POSIX固有APIを使っていない |
| Docker対応 | **充足** | `Dockerfile`（GPU不要・OCRは任意ビルド引数） |
| GitHub Actions対応 | **充足** | 日次 `odin-daily-research.yml` / 週次 `titan-oss-watch.yml` |
| MCP対応 | **充足** | `mcp_server.py`（JSON-RPC 2.0 / stdio）**8ツール** |
| AI Agent対応 | **充足** | MCP経由でAgentから全機能を呼べる |

---

## 1. Phase1 — OSS徹底調査（203件）

`tiktok/video_intel/oss/registry.json`（schema: `odin-oss-registry/2.0`）

### 実測できた項目

| 項目 | 状態 | カバレッジ |
|------|------|-----------|
| Stars / Fork数 / Issue数 | **実測** | 203/203 (100%) |
| 更新日 / 作成日 / アーカイブ状態 | **実測** | 203/203 (100%) |
| 主要言語 | **実測** | 203/203 |
| topics（自己申告メタデータ） | **実測** | 117/203 (57.6%) |
| ライセンス | **実測** | 7/203 (3.4%) — 採否を分ける候補を優先 |
| Windows / Docker / GPU / CPU / Python / CLI / API 対応 | **topicsからの導出** | topics保有分のみ |
| 保守状況 | **導出（実測フィールドのみ）** | 203/203 |
| 導入難易度 | **代理指標** | 203/203 |
| コミュニティ活動 | forks / issues で代理 | 203/203 |

### ★ capability 判定の性質（ここを誤解すると危険）

`oss/capabilities.py` は **三値** を返す。

```
True  … 対応の申告あり（topics/language に根拠がある）
False … 構造的に非対応が明らか（例: GPU必須topicがあり CPU可の申告が無い）
None  … 未測定。**「非対応」ではなく「申告が無いだけ」**
```

topics はリポジトリ作者の自己申告なので、
**「Windows対応と書いていない」＝「Windowsで動かない」ではない。**
実際にインストールして動かす検証は行っていない（Phase B の作業）。
出力の凡例に必ず `—=未測定` と明記している。

### ★ ライセンス上の注意（実測済み）

| repo | ライセンス | 分類 | ODIN の扱い |
|------|-----------|------|------------|
| ultralytics/ultralytics | **AGPL-3.0** | network-copyleft | **既定オフ**。WebUI提供でソース公開義務が及びうる |
| MTG/essentia | **AGPL-3.0** | network-copyleft | **不採用**。BPMは numpy の自己相関で代替 |
| roboflow/supervision | MIT | permissive | 採用可 |
| SYSTRAN/faster-whisper | MIT | permissive | 任意依存として採用 |
| serengil/deepface | MIT | permissive | 任意依存として採用 |
| google-ai-edge/mediapipe | Apache-2.0 | permissive | **AGPL回避の主力** |
| Breakthrough/PySceneDetect | BSD-3-Clause | permissive | 精度比較用の候補 |

「商用ライセンス購入禁止」という絶対条件があるため、
AGPL は**購入で回避できない**。よって構成そのものを変える判断をした。

---

## 2. Phase2 — 完全無料の構成

| 領域 | 採用 | ライセンス | 費用 | GPU |
|------|------|-----------|------|-----|
| 動画取得 | yt-dlp | Unlicense系 | 0 | 不要 |
| 復号/フレーム抽出 | FFmpeg（imageio-ffmpeg同梱） | LGPL/BSD | 0 | 不要 |
| 数値計算 | numpy | BSD-3 | 0 | 不要 |
| 画像描画 | Pillow | HPND | 0 | 不要 |
| シーン/カット解析 | **自前実装** | — | 0 | 不要 |
| 色解析 | **自前実装** | — | 0 | 不要 |
| 統計解析 | **自前実装**（Welch t / Pearson / BH-FDR / MAD） | — | 0 | 不要 |
| DB | SQLite（標準ライブラリ） | Public Domain | 0 | 不要 |
| WebUI | http.server（標準ライブラリ） | PSF | 0 | 不要 |
| CLI | argparse（標準ライブラリ） | PSF | 0 | 不要 |
| MCP | **自前実装**（JSON-RPC 2.0） | — | 0 | 不要 |
| OCR（任意） | tesseract + pytesseract | Apache-2.0 | 0 | 不要 |
| 音声解析（任意） | faster-whisper | MIT | 0 | CPU可 |
| 被写体解析（任意） | mediapipe | Apache-2.0 | 0 | CPU可 |
| ベクトル検索 | **未導入** | — | 0 | — |

**ベクトル検索を入れていない理由**: 現在の検索要件（ジャンル・尺・再生数・字幕有無）は
SQL で完全に足りる。Research Department は txtai / turbovec / claude-mem を
「未充足領域の候補」として保持しており、**必要になった時点で**評価して導入する。
必要になる前に依存を増やさない。

---

## 3. Phase3 — Research Department（自動研究システム）

`tiktok/video_intel/research_dept.py` + `.github/workflows/odin-daily-research.yml`

### 毎日の処理

```
06:00 JST
  1. OSS新着調査      直近14日 / 18トピック / star>300 の新規リポジトリ
  2. OSS更新監視      主要リポジトリの star 変化（±500以上）とアーカイブ化を検出
  3. 採用候補の評価    実測フィールドのみでスコアリング
  4. ライセンス確認    AGPL/GPL・GPU必須・アーカイブ済 を**自動除外**
  5. 既存構成との比較  現行スタックの穴（GAPS）を埋める場合のみ「採用候補」
  6. レポート生成      変化があるときだけ Issue 通知（無ければ静かに終わる）
```

### 採用判定のルール（star数では採用しない）

```
自動除外:
  - archived（開発終了）
  - AGPL系（★絶対条件「商用ライセンス購入禁止」と衝突するため回避不能）
  - GPL系（要検討として除外）
  - GPU必須の申告があり CPU可の申告が無い
  - 1年以上更新なし

採用候補になる条件（いずれか）:
  (a) 現行構成に無い領域（未充足領域 GAPS）を埋める
  (b) 同カテゴリの現行より score が +10 超

それ以外はすべて「保留（現行で足りている）」
```

### 現在の未充足領域（GAPS）

| 領域 | 状況 |
|------|------|
| ベクトル検索 | 現時点は SQL で足りる。動画本数が増えたら評価 |
| AI生成判定 | 実写/CG/AI生成の割合が未測定。分類器が必要 |
| ロゴ検出 | 学習済みロゴモデルが無い |
| 音楽解析 | BPM推定の確度が低い。主要OSS(essentia)がAGPLで不適合 |
| 感情解析 | 感情変化・驚きの位置が未測定 |

### 実行結果（2026-07-31 実測）

```
調査対象 203件 / カテゴリ 58種
採用候補（未充足領域）  12件   ← txtai, turbovec, audioFlux, madmom, deepfake検出5件 など
比較検証の対象           0件
保留（現行で足りている） 186件
不採用（自動除外）        5件   ← archived 2 / AGPL 2 / GPU必須 1
```

---

## 4. Phase4-6 — 解析エンジン・知識DB・統計（TITAN v1.0 を継承）

`engine.py` が実測する指標は40超。詳細は `docs/titan/TITAN-ARCHITECTURE.md` §4。

### ODIN で追加した知識DB（Phase5）

```sql
knowledge     -- 成功要因 / 失敗要因 / 仮説 / メモ
              -- kind, text, evidence(実測値または統計結果), confidence, created_at
improvements  -- 改善履歴。指標の before/after/delta を自動計算して保存
```

`evidence` には**実測値または統計結果のみ**を入れる規約にしている。感想は入れない。

**記録済みの実例（自作動画3本）**

```
[failure_factor] 静止カード方式は構造的にスライドショーになる
    根拠: 実測 カット0本 / 最長静止39.97秒 / 有意な画面変化0.00回/秒   確度: 高

[success_factor] 全フレーム描画＋大面積の背景モーションで最長静止を1.5秒以内に抑えられる
    根拠: 実測 最長静止1.50秒 / 変化1.86回/秒 / カット密度6.04/10秒    確度: 高

[hypothesis]     冒頭0.5秒の変化量が全体平均を上回ると3秒保持率が上がる
    根拠: 未検証。実績データ0本のため統計的裏づけなし                    確度: 低
```

仮説を「仮説」として、確度「低」で、**裏づけが無いことを明記して**保存している。
これが ODIN の記録規約。

**改善履歴（自動計算された指標差分）**

| 遷移 | 変更内容 | カット | 中央値 | 変化/秒 | 最長静止 |
|------|---------|-------|--------|---------|---------|
| v1→v2 | 静止カード→モーション方式へ全面書き換え | 0→3 | 40.00→7.60s | 0.00→0.72 | 39.97→4.27s |
| v2→v3 | Design System v1.0 準拠へ | 3→25 | 7.60→1.80s | 0.72→1.86 | 4.27→1.50s |

### 統計（Phase6）

n<5 の群は「有意差なし」ではなく **「判定不能」** を返す。
現在DBの3本では28指標すべてが判定不能。**これが正しい挙動。**

---

## 5. Phase7 — AI Director のデータ充足ゲート（ODIN の核心）

```python
db.data_sufficiency(con, min_videos=10, min_outcomes=5)
```

**データが足りないとき、AI Director は台本・編集方針・字幕・CTA・投稿戦略を生成しない。**

```
現在の判定（実測）:
  sufficient: False
  videos: 3 (必要 10)
  videos_with_outcome: 0 (必要 5)
  → 「**データ不足。台本・投稿戦略の提案は行わない。**」
```

### ただし「診断」は常に返す — この区別が設計上の核心

| 種別 | データ不足時 | 理由 |
|------|------------|------|
| **診断**（quality） | **返す** | 実測値としきい値の照合。予測ではない |
| **戦略生成**（台本・投稿計画） | **返さない** | 統計的裏づけが必要。無いまま出すと推測を事実として渡すことになる |

実際の応答:
```json
{ "generation": "withheld",
  "reason": "データ不足のため台本・編集方針・字幕・CTA・投稿戦略は生成しない",
  "missing": ["解析済み動画が 3本（必要 10本）", "実績データ付き動画が 0本（必要 5本）"],
  "quality": { "score": 90, "verdict": "公開可", "findings": [...] } }
```

このゲートは CLI / WebUI / MCP のすべての経路に適用済み。

---

## 6. Phase8 — 自己進化ループ

```
       ┌──────────────────────────────────────────────┐
       │  毎日 06:00 JST  ODIN Daily Research         │
       └──────────────────────────────────────────────┘
                    │
   新着調査 ─┬─ 更新監視 ─┬─ 評価 ─┬─ ライセンス確認 ─┬─ 現行比較
             │            │        │                  │
             └────────────┴────────┴──────────────────┘
                    │
        ┌───────────┴────────────┐
        │ 変化あり               │ 変化なし
        ▼                        ▼
   Issue で通知              静かに終了（通知しない）
   （採用候補・star変化・      ※ ノイズを出さないことも設計要件
     アーカイブ化）
        │
        ▼
   オーナーが判断 ──▶ registry.json 更新 ──▶ 次回から比較の基準が変わる
                                              （＝システムが学習する）

       ┌──────────────────────────────────────────────┐
       │  毎週月曜 09:00 JST  TITAN OSS Watch         │
       │  90日以内の新規・star500以上をより広く探索    │
       └──────────────────────────────────────────────┘
```

**通知しない条件を持つのが重要**。毎日Issueが立つと誰も読まなくなり、
「監視しているつもり」になる。変化があるときだけ通知する。

---

## 7. インターフェース

### CLI（Linux / macOS / Windows）

```bash
python3 tiktok/video_intel/cli.py analyze video.mp4 --genre 教育
python3 tiktok/video_intel/cli.py list --where "genre='教育' AND duration_sec<=30"
python3 tiktok/video_intel/cli.py outcome <sha1> --views 1200000 --retention3s 74
python3 tiktok/video_intel/cli.py compare --where-a "views>=1000000" --where-b "views<10000"
python3 tiktok/video_intel/cli.py correlate --outcome completion_pct
python3 tiktok/video_intel/cli.py research                 # Research Department 日次レポート
python3 tiktok/video_intel/cli.py caps 音声解析             # OSS対応表
python3 tiktok/video_intel/cli.py sufficiency              # データ充足判定
python3 tiktok/video_intel/cli.py knowledge --sha1 X --kind success_factor --add "..." --evidence "..."
python3 tiktok/video_intel/cli.py improvement --from A --to B --change "..."
python3 tiktok/video_intel/cli.py export --out out/
python3 tiktok/video_intel/cli.py serve --port 8765
```

Windows:
```cmd
odin.cmd analyze video.mp4
odin.cmd serve
```
（`PYTHONUTF8=1` を自動設定して cp932 での文字化け・例外を防ぐ）

### Docker

```bash
docker build -t odin -f tiktok/video_intel/Dockerfile .
docker run --rm -p 8765:8765 -v "$PWD":/work odin serve
docker build --build-arg WITH_OCR=1 -t odin-ocr -f tiktok/video_intel/Dockerfile .   # OCR込み
```

### MCP（8ツール）

```json
{"mcpServers":{"odin":{"command":"python3","args":["tiktok/video_intel/mcp_server.py"]}}}
```

| ツール | 用途 |
|-------|------|
| titan_analyze_video | 動画を解析してDBへ登録 |
| titan_query_videos | 条件検索 |
| titan_compare_groups | 統計比較（n<5は判定不能） |
| titan_diagnose | 診断＋提案（**データ不足時は戦略部分を保留**） |
| odin_research_report | Research Department 日次レポート |
| odin_oss_capabilities | OSS対応表（Windows/Docker/GPU/CPU/…） |
| odin_data_sufficiency | データ充足判定 |
| titan_oss_rank | OSSランキング |

---

## 8. 既知の制約（隠さない）

1. **ライセンス実測は203件中7件（3.4%）**。採用候補を優先した。残りは未測定のまま
2. **capability は topics 由来の導出**。実際にインストールして動かした検証ではない
3. **topics カバレッジは57.6%**。残りは capability がすべて未測定
4. **速度・精度のベンチマーク未実施**。よってスコアに含めていない
5. **統計はまだ何も証明していない**。n=3では全指標が判定不能
6. **他者動画を取得できない環境がある**。本リポジトリの実行環境は TikTok/YouTube へ到達不可（gateway 403 実測）。取得はオーナー環境で規約を守って行う
7. **BPM推定の確度は低い**。オンセット自己相関のみ（essentia が AGPL のため未導入）
8. **Windows は実機検証していない**。POSIX固有APIは使っていないが、実行確認はオーナー環境で必要

---

## 9. 次にやること（優先順）

1. オーナー環境で成功動画・失敗動画を各10本以上解析 → 各群 n≥5 で統計が動き出す
2. 実績（再生・3秒保持・完走・保存）を `outcome` で登録 → `data_sufficiency` が満たされ、AI Director のゲートが開く
3. 残り196件のライセンス実測（Research Department に自動収集させる）
4. capability の実行検証（Docker で実際に入れて動かす）
5. 速度・精度ベンチマーク（同一動画10本での処理時間と検出一致率）

---

## 改訂履歴

| Version | 日付 | 内容 |
|---------|------|------|
| 1.0 | 2026-07-31 | 初版。OSS203件調査、Research Department、知識DB、データ充足ゲート、日次自動研究を実装 |
