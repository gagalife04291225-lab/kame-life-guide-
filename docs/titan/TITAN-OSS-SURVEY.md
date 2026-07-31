# Project TITAN — OSS調査レポート v1.0

作成: 2026-07-31 ／ 実行: AI Company OS Research部
原典データ: `tiktok/video_intel/oss/registry.json`（GitHub API 実測）
ランキング実装: `tiktok/video_intel/oss/rank.py`

---

## 0. この調査で「測った値」と「測っていない値」

依頼された評価項目のうち、**実測できたものとできなかったものを最初に分ける。**

| 評価項目 | 状態 | 出所 |
|---------|------|------|
| GitHub Stars / Fork数 / Issue数 | **実測** | GitHub Search API |
| 更新頻度（最終更新日） | **実測** | 同上 |
| 開発継続性（作成日〜最終更新・アーカイブ状態） | **実測** | 同上 |
| 主要言語 | **実測** | 同上 |
| ライセンス | **一部実測**（採否を分ける8件のみ） | GitHub `license:` 修飾子で照合 |
| Python対応 | 言語フィールドから推定可（実測は言語のみ） | 同上 |
| CLI / API / Docker / GPU / Windows / Linux / Mac 対応 | **未測定** | 各READMEの機械的判定が必要 |
| 速度 / 精度 | **未測定** | 共通ベンチマークを走らせていない |
| 保守性 / 拡張性 / 学習コスト / 将来性 | **未測定** | 定量化の定義が未確定 |
| コミュニティ | **一部**（forks/issuesで代理） | — |

**未測定の項目はスコアに含めていない。** 含めた瞬間に「推測でランキングを作った」ことになるため。
スコアは実測フィールドだけで構成している（式は §2）。

調査規模: **104リポジトリ / 32カテゴリ**（依頼の「最低100個」を満たす）

---

## 1. 調査カテゴリと件数

動画取得 / 動画解析 / OCR / 音声解析 / 字幕解析 / シーン解析 / カット解析 /
人物認識 / 動物認識 / 姿勢推定 / 物体認識 / ロゴ検出 / 色解析 / 音楽解析 /
ダッシュボード / AI Agent / MCP / LLM / ベクトルDB / RAG / Web UI / AI生成判定
（実際のカテゴリ分類は registry.json の `category` フィールド。複合カテゴリを含め32分類）

---

## 2. スコア式（実測フィールドのみ・決定的）

```
popularity   = log10(stars+1) / log10(300000)
adoption     = log10(forks+1) / log10(60000)
freshness    = 1 - min(最終更新からの日数, 365)/365
maturity     = min(作成からの日数, 3650)/3650
issue_health = 1 - min(open_issues / (stars/100 + 1), 1)
alive        = 0 if archived else 1

score = 100 * alive * (0.30*popularity + 0.20*adoption
                     + 0.25*freshness + 0.10*maturity + 0.15*issue_health)
```

- **archived は乗算ゲートで0点**（mozilla/DeepSpeech と so-vits-svc がこれに該当し実測で0点）
- issue_health は star 数に対する未解決 Issue 比。規模の大きい repo が不利にならないよう正規化

---

## 3. ★最重要の発見 — ライセンスが採否を変える

`license:` 修飾子による照合で、以下を**実測**した。

| repo | ライセンス（実測） | 分類 | 意味 |
|------|------------------|------|------|
| roboflow/supervision | MIT | permissive | 商用利用可・制約軽 |
| SYSTRAN/faster-whisper | MIT | permissive | 同上 |
| serengil/deepface | MIT | permissive | 同上 |
| google-ai-edge/mediapipe | Apache-2.0 | permissive | 同上 |
| Breakthrough/PySceneDetect | BSD-3-Clause | permissive | 同上 |
| **ultralytics/ultralytics** | **AGPL-3.0** | **network-copyleft** | **★WebUIで提供するだけで公開義務が発生しうる** |
| **MTG/essentia** | **AGPL-3.0** | **network-copyleft** | **★同上** |
| yt-dlp/yt-dlp | 上記4種のいずれでもない（Unlicense系。要最終確認） | — | — |

### なぜこれが重要か

依頼は「商用利用可能OSSのみ採用」だった。AGPL-3.0 は商用利用**自体**は可能だが、
**ネットワーク越しにサービス提供した時点でソース公開義務が発生しうる**。
TITAN は Phase8 で **WebUI（ダッシュボード）を持つ**。つまり:

```
ultralytics（AGPL）を TITAN の WebUI から呼ぶ
  → TITAN 全体に AGPL の公開義務が及ぶ可能性がある
```

**この1点だけで、star数60,069の最有力候補が「そのままでは採用不可」になる。**
star数だけでランキングしていたら、この判断は絶対に出てこなかった。

### 対処（3案。オーナー判断が必要）

| 案 | 内容 | 影響 |
|----|------|------|
| A | **社内研究専用に閉じる**（WebUIを外部公開しない） | AGPLの公開義務は発生しない。現状の運用と一致 |
| B | Apache-2.0 の **mediapipe** を人物・姿勢・顔の検出に使う | 物体検出の汎用性は落ちる |
| C | Ultralytics の商用ライセンスを購入 | **有料。本プロジェクトの前提（無料）に反するため不採用** |

**v1.0の決定: 案A + 案B。** ultralytics は「任意依存」に留め、既定では読み込まない。
requirements.txt に AGPL の警告を明記済み。

---

## 4. v1.0 採用構成（無料・GPU不要・追加課金なし）

| 層 | 採用 | ライセンス | 採用理由 |
|----|------|-----------|---------|
| 動画取得 | **yt-dlp** | Unlicense系（要確認） | star 181,416 / forks 15,533 / 当日更新。この領域の事実上の標準。**利用規約遵守は運用側の責任** |
| 復号・フレーム抽出 | **FFmpeg（imageio-ffmpeg同梱）** | LGPL/BSD | バイナリ同梱でapt不要。Docker イメージが軽くなる |
| 数値計算 | **numpy** | BSD-3 | 依存が軽い。GPU不要 |
| 画像生成 | **Pillow** | HPND | 図解の手続き描画に使用済み（実績あり） |
| カット検出 | **自前実装**（PySceneDetectは参考） | — | OpenCV依存を避けるため自前。PySceneDetect(BSD-3)は精度比較用に候補保持 |
| 統計 | **自前実装** | — | scipy を入れずに Welch t / Pearson / BH-FDR を実装。依存ゼロ |
| DB | **SQLite（標準ライブラリ）** | Public Domain | サーバ不要・追加課金なし。現行の検索要件は構造化クエリで足りる |
| WebUI | **標準ライブラリ http.server** | PSF | 依存ゼロ・オフライン動作。Streamlit/Gradio は依存が重いため不採用 |
| MCP | **自前実装（JSON-RPC 2.0）** | — | SDK非導入。標準ライブラリのみ |
| OCR（任意） | tesseract + pytesseract | Apache-2.0 | 導入時のみ字幕文字数を測定 |
| ASR（任意） | faster-whisper | **MIT（実測）** | CPUで動く。ナレーション速度の測定に必要 |
| 姿勢・表情（任意） | mediapipe | **Apache-2.0（実測）** | AGPL回避の主力 |
| 物体検出（任意・条件付き） | ultralytics | **AGPL-3.0（実測）** | **既定オフ。社内研究用途に限定** |

### 不採用としたもの（理由つき）

| OSS | 不採用理由 |
|-----|-----------|
| MTG/essentia | AGPL-3.0（実測）。BPM推定は numpy の自己相関で代替した |
| OpenCV | 依存が重くDockerイメージが肥大。現行の測定要件は numpy で足りる |
| Streamlit / Gradio / Reflex | WebUIのためだけに依存を増やす必要がない |
| Milvus / Meilisearch | 現行の検索要件（ジャンル・尺・再生数）は SQL で足りる。**必要になってから入れる** |
| LangChain / LlamaIndex | 現在の提案生成はルールエンジンで決定的に行う方が監査可能 |
| mozilla/DeepSpeech | **archived（実測）**。スコア0 |
| svc-develop-team/so-vits-svc | **archived（実測）**。スコア0 |

---

## 5. 総合ランキング 上位20（実測値のみ）

| # | repo | カテゴリ | score | stars | forks | issues | 最終更新 | ライセンス |
|---|------|---------|-------|-------|-------|--------|---------|-----------|
| 1 | ultralytics/yolov5 | 物体認識 | 89.3 | 57779 | 17469 | 30 | 2026-07-31 | 未測定 |
| 2 | affaan-m/ECC | AI Agent | 88.4 | 236434 | 35946 | 107 | 2026-07-31 | 未測定 |
| 3 | cmusatyalab/openface | 人物認識 | 87.6 | 15431 | 3563 | 1 | 2026-07-29 | 未測定 |
| 4 | naptha/tesseract.js | OCR | 87.5 | 38582 | 2376 | 46 | 2026-07-31 | 未測定 |
| 5 | harry0703/MoneyPrinterTurbo | 動画制作Agent | 87.1 | 100723 | 14999 | 11 | 2026-07-31 | 未測定 |
| 6 | PaddlePaddle/PaddleOCR | OCR | 86.3 | 86639 | 11110 | 226 | 2026-07-31 | 未測定 |
| 7 | n8n-io/n8n | AI Agent/自動化 | 85.6 | 198810 | 59799 | 1402 | 2026-07-31 | 未測定 |
| 8 | langchain-ai/langchain | AI Agent/LLM | 85.6 | 143069 | 23824 | 455 | 2026-07-31 | 未測定 |
| 9 | ocrmypdf/OCRmyPDF | OCR | 84.6 | 34323 | 2370 | 100 | 2026-07-31 | 未測定 |
| 10 | sansan0/TrendRadar | AI Agent/MCP | 84.6 | 61040 | 24838 | 52 | 2026-07-31 | 未測定 |
| 11 | D4Vinci/Scrapling | AI Agent/MCP | 84.5 | 71913 | 7136 | 3 | 2026-07-31 | 未測定 |
| 12 | serengil/deepface | 人物認識/表情 | 84.3 | 23170 | 3147 | 12 | 2026-07-31 | **MIT** |
| 13 | tesseract-ocr/tesseract | OCR | 84.1 | 75647 | 10712 | 479 | 2026-07-31 | 未測定 |
| 14 | paperless-ngx/paperless-ngx | OCR | 83.9 | 43772 | 2964 | 14 | 2026-07-31 | 未測定 |
| 15 | opendatalab/MinerU | OCR | 83.7 | 76342 | 6411 | 73 | 2026-07-31 | 未測定 |
| 16 | ultralytics/ultralytics | 物体認識 | 83.3 | 60069 | 11487 | 151 | 2026-07-31 | **AGPL-3.0 ★** |
| 17 | firecrawl/firecrawl | AI Agent/取得 | 82.9 | 158487 | 9009 | 463 | 2026-07-31 | 未測定 |
| 18 | cyrus-and/gdb-dashboard | ダッシュボード | 82.3 | 12230 | 821 | 19 | 2026-07-31 | 未測定 |
| 19 | pathwaycom/llm-app | RAG | 82.2 | 58935 | 1439 | 9 | 2026-07-31 | 未測定 |
| 20 | roboflow/supervision | 動画解析 | 82.1 | 48509 | 4521 | 82 | 2026-07-31 | **MIT** |

> **重要**: このランキングは「人気・活発さ・健全さ」の順位であって、
> **TITAN における有用性の順位ではない。** 実際の採用構成は §4 の通りで、
> ランキング1位の yolov5 も、16位の ultralytics も、ライセンスと依存の重さから既定では使わない。
> **ランキングを鵜呑みにしないこと** が本調査の結論のひとつ。

カテゴリ別ランキングは付録A（`docs/titan/TITAN-OSS-SURVEY-APPENDIX.md`）。

---

## 6. 法令・規約の遵守

- **違法取得は禁止。** yt-dlp は「取得できる」だけであり、
  TikTok / YouTube の利用規約に反する取得は行わない。
- 本リポジトリの実行環境からは **TikTok/YouTube に到達できない**（gateway 403 を実測）。
  他者動画の取得・解析は、規約を遵守できる環境でオーナーの責任において実行する。
- AGPL / GPL の OSS は、ネットワーク提供時の公開義務を確認してから使う。
- 学習済みモデルの重みは、コードとは**別のライセンス**が付くことがある
  （例: 一部の顔認識モデルは非商用限定）。モデル単位で確認する。

---

## 7. 次の調査で埋めるべき空欄

1. 全104件のライセンス実測（現状8件のみ）
2. CLI / API / Docker / GPU 対応の機械判定（README とリポジトリ構造の走査）
3. 速度・精度の共通ベンチマーク（同一動画10本での処理時間と検出一致率）
4. 学習コストの代理指標（README の長さ、サンプル数、Issue の平均クローズ日数）

これらが埋まるまで、該当項目は**空欄のまま**にする。
