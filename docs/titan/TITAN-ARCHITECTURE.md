# Project TITAN — システム設計書 v1.0

OSS Video Intelligence Platform ／ AI Company OS を「動画研究会社」へ拡張する基盤

作成: 2026-07-31
判断順序（不変）: 正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益

---

## 1. 設計原則（すべての実装判断がここから導かれる）

| # | 原則 | 実装への帰結 |
|---|------|------------|
| P1 | **有料サービスを前提にしない** | LLM API を必須にしない。提案生成はルールエンジン。DBはSQLite。WebUIは標準ライブラリ |
| P2 | **GPUを前提にしない** | 必須経路は numpy のみ。重いモデルはすべて「任意依存」 |
| P3 | **測っていない値を出さない** | 測定不能な項目は `null` を返し、`not_measured` に理由を残す |
| P4 | **統計で証明する** | n<5 は「有意差なし」ではなく **「判定不能」**。多重比較はFDR補正 |
| P5 | **決定的であること** | 同じ入力 → 同じ出力。提案は必ずルールIDに紐づく（「AIが考えた」にしない） |
| P6 | **依存を増やさない** | 新規OSSは「必要になってから」入れる。ベクトルDBは現時点で不要と判断 |
| P7 | **ライセンスを先に見る** | AGPL/GPL はWebUI提供時に公開義務が及びうる。既定で読み込まない |
| P8 | **規約と法令を守る** | 動画取得はプラットフォーム規約の範囲内。違法取得は行わない |

---

## 2. 全体構成

```
                       ┌──────────────────────────────────────────┐
   入力                │            TITAN Platform v1.0           │        出力
                       └──────────────────────────────────────────┘
 動画ファイル ─┐
              │   ┌────────────┐    ┌──────────────┐   ┌──────────┐
 D&D (WebUI) ─┼──▶│  engine.py │───▶│    db.py     │──▶│report.py │──▶ JSON
              │   │ 映像+音声  │    │  SQLite      │   │          │──▶ CSV
 CLI          ─┤   │ 40指標超   │    │ videos       │   │          │──▶ HTML→印刷でPDF
              │   └─────┬──────┘    │ outcomes     │   └──────────┘
 MCP client  ─┘         │           │ metrics      │
                        │           └──────┬───────┘
                  ┌─────▼──────┐           │
                  │adapters    │      ┌────▼──────┐   ┌──────────────┐
                  │(任意/OSS)  │      │ stats.py  │──▶│ director.py  │──▶ 改善提案
                  │OCR/ASR/    │      │ Welch t   │   │ ルールエンジン │    企画・構成
                  │detect/pose │      │ Pearson   │   │ 14ルール      │    編集指示
                  └────────────┘      │ BH-FDR    │   └──────────────┘    投稿計画
                                      │ MAD外れ値 │
                                      └───────────┘
        ┌──────────────┐                                ┌──────────────────┐
        │ oss/rank.py  │◀── registry.json (104 OSS実測) │ GitHub Actions   │
        │ OSSランキング│                                │ titan-oss-watch  │──▶ Issue通知
        └──────────────┘                                └──────────────────┘
```

---

## 3. モジュール

| ファイル | 役割 | 依存 |
|---------|------|------|
| `engine.py` | 映像・音声の実測。40指標超。測定不能は null | numpy / imageio-ffmpeg |
| `db.py` | SQLite スキーマ（videos / outcomes / metrics）と検索 | 標準ライブラリ |
| `stats.py` | Welch t検定・Pearson・BH-FDR・MAD外れ値（**全て自前実装**） | 標準ライブラリ |
| `director.py` | 診断14ルール＋企画/構成/編集/字幕/BGM/CTA/投稿計画の生成 | 標準ライブラリ |
| `report.py` | JSON / CSV / HTML 出力（PDFはブラウザ印刷） | 標準ライブラリ |
| `server.py` | ダッシュボード（D&D解析・一覧・比較・提案・出力） | 標準ライブラリ |
| `mcp_server.py` | MCP (JSON-RPC 2.0 / stdio)。5ツール公開 | 標準ライブラリ |
| `cli.py` | analyze / list / outcome / compare / correlate / export / oss / serve | 標準ライブラリ |
| `oss/registry.json` | 調査した104 OSS の実測値 | — |
| `oss/rank.py` | 実測フィールドのみでスコアリング | 標準ライブラリ |

**外部ネットワーク接続を必要とするのは OSS Watch（GitHub Actions）だけ。**
解析・統計・提案・WebUI はすべてオフラインで動く。

---

## 4. 測定指標（Phase4 対応表）

### 実測できる（engine.py が数値を返す）

| 依頼項目 | 実装 |
|---------|------|
| 解像度 / FPS / 尺 | `format.*` |
| 平均カット長 / 中央値 / 分散 | `video.shot_length.{mean,median,variance,stdev,min,max}` |
| 静止時間 | `video.screen_change.longest_static_run_sec` + 上位3区間の開始秒 |
| 画面変化量 | `video.screen_change.per_sec` / `video.motion.motion_timeline_per_sec`（秒単位の時系列） |
| ズーム回数 | `video.camera.zoom_events`（周辺/中心の動きエネルギー比） |
| パン回数 | `video.camera.pan_events`（水平/垂直の差分非対称性） |
| 色温度 | `video.color.color_temperature_r_b_ratio` + ラベル |
| 平均輝度 / 彩度 / コントラスト | `video.color.*` |
| 字幕位置 | `video.text_layout.band_share_pct_top_to_bottom`（縦5分割） |
| 構図 / 三分割構図 | `video.composition.rule_of_thirds_energy_ratio` / `center_weight_ratio` |
| CTA位置 | 最終カット群の位置として `cuts.times` から導出可能 |
| BGMテンポ | `audio.estimated_bpm`（オンセット包絡の自己相関。確度は低と明記） |
| SE数 | `audio.onset_count` / `onset_per_sec` |
| 音量・無音率 | `audio.loudness_*` / `silence_ratio` |
| ループ適性 | `video.loop.first_last_frame_diff` |
| 冒頭0.5/1/3秒の挙動 | `video.opening.*` |

### 任意依存を入れれば測れる

| 依頼項目 | 必要OSS | ライセンス |
|---------|--------|-----------|
| 字幕数 / 字幕サイズ / 字幕色 / OCR精度 | pytesseract + tesseract | Apache-2.0 |
| ナレーション速度 | faster-whisper | **MIT（実測）** |
| 人物数 / 動物数 / 亀出現時間 / 商品出現時間 / ロゴ出現時間 | ultralytics | **AGPL-3.0（実測）★既定オフ** |
| 表情 / 視線 / 姿勢 | mediapipe | **Apache-2.0（実測）** |
| AI生成判定 | registry の AI生成判定カテゴリ5件 | 未測定 |

### 現時点で測れない（空欄のまま残す）

- 感情変化 / 驚きの位置 / 笑いの位置 → 意味理解が必要。人手アノテーション
- 離脱ポイント → プラットフォームの Analytics からのみ取得可能
- 実写 / CG / AI生成の**割合** → 分類器を評価してから

---

## 5. データモデル

```sql
videos    -- 1本1行。よく検索する指標はカラム化。全解析結果は raw_json
          -- sha1(主キー) / label / 尺 / カット統計 / 変化 / カメラ / 色 / 構図 / 冒頭 / 音
outcomes  -- 公開後の実績（複数時点を保持）
          -- views / retention_3s_pct / completion_pct / saves / shares / profile_visits ...
metrics   -- 縦持ちの汎用テーブル。新指標を足してもスキーマ変更不要
```

**ベクトルDBを入れていない理由**: 現行の検索要件
（教育だけ / 30秒以内 / 100万再生以上 / 字幕あり）は構造化クエリで完全に足りる。
埋め込み検索が必要になった時点で registry の milvus / meilisearch を評価する。
**必要になる前に入れない**（原則P6）。

---

## 6. 統計の扱い（Phase6）

| 手法 | 目的 | 実装 |
|------|------|------|
| Welch t検定 | 成功群と失敗群の差 | `stats.welch_t`（t分布CDFを連分数展開で自前計算） |
| Cohen's d | 効果量（差の大きさ） | 無視できる/小/中/大 に分類 |
| Pearson相関 | 指標と実績の関係 | `stats.pearson` |
| BH-FDR | 多重比較補正 | 28指標を一度に比較するため必須 |
| MAD外れ値 | 異常値検出 | 平均・標準偏差は外れ値に引きずられるため使わない |

**n < 5 の群は「有意差なし」ではなく「判定不能」を返す。**
検出力が足りない状態で「差がない」と結論するのは誤りだから。
実際、現在DBに入っている自作動画3本では **28指標すべてが「判定不能」** と表示される。これが正しい挙動。

---

## 7. AI Director（Phase7）

LLMを必須にしない。14ルールの決定的なエンジン。

```
ルール例
R01 BLOCKER 最長静止 > 1.5秒        ← 根拠 D1/D2（1.5-2.0秒ごとに再判断）
R02 BLOCKER カット密度 < 2.5/10秒   ← 根拠 D3（ジャンプカットで完走率+26%）
R06 BLOCKER 冒頭3秒のカット < 2回   ← 根拠 A3（n=34,635で約90%が冒頭3秒で失敗）
R11 HIGH    音声トラックが無い       ← 根拠 G1
...
スコア = 100 - (BLOCKER×20 + HIGH×10 + MEDIUM×5)
BLOCKERが1つでもあれば「公開不可」
```

しきい値の出所は `tiktok/DESIGN-SYSTEM.md`、その根拠は `tiktok/research/RESEARCH-REPORT.md`。
**提案は必ずルールIDと根拠IDに紐づく。** ollama があれば文章化するが、必須ではない。

### 実測による検証（自作動画3本）

| 動画 | スコア | 判定 | 主な指摘 |
|------|-------|------|---------|
| v1 静止カード版 | **5** | 要修正 | 最長静止39.97秒 / カット0本 / 冒頭3秒カット0回（BLOCKER×3） |
| v2 モーション版 | **25** | 要修正 | 最長静止4.27秒 / カット密度1.03（BLOCKER×2） |
| v3 DS準拠版 | **90** | 公開可 | 音声トラックなし（HIGH×1のみ） |

ルールエンジンが v1→v3 の改善を正しく段階評価している。

---

## 8. 部署との対応（Phase3）

| 部署 | TITAN での役割 | 使うモジュール |
|------|--------------|--------------|
| Research | OSS調査・新規候補評価 | `oss/rank.py` / OSS Watch |
| Analytics | 指標の実測・統計検証 | `engine.py` / `stats.py` |
| Marketing | 実績データとの相関分析 | `db.outcomes` / `stats.correlate_with_outcome` |
| Creative | 企画・構成・編集指示の生成 | `director.plan` |
| QA | 公開可否の判定（BLOCKER基準） | `director.diagnose` |
| Knowledge | 解析結果の永続化・再利用 | `db.py`（raw_json 全保存） |
| Automation | 定期監視・自動通知 | GitHub Actions |
| Director | 全体の統合・意思決定 | CLI / WebUI / MCP |

---

## 9. 使い方

```bash
# 依存（必須はこの3つだけ）
pip install numpy imageio-ffmpeg Pillow

# 解析してDBへ
python3 tiktok/video_intel/cli.py analyze video.mp4 --genre 教育 --source self

# 検索（教育・30秒以内）
python3 tiktok/video_intel/cli.py list --where "genre='教育' AND duration_sec<=30"

# 公開後の実績を登録
python3 tiktok/video_intel/cli.py outcome <sha1> --views 1200000 --retention3s 74 --completion 52

# 成功群と失敗群を統計比較
python3 tiktok/video_intel/cli.py compare --where-a "views>=1000000" --where-b "views<10000"

# 指標と完走率の相関
python3 tiktok/video_intel/cli.py correlate --outcome completion_pct

# 出力（JSON/CSV/HTML）
python3 tiktok/video_intel/cli.py export --out out/

# ダッシュボード
python3 tiktok/video_intel/cli.py serve --port 8765

# OSSランキング
python3 tiktok/video_intel/cli.py oss OCR

# Docker
docker build -t titan -f tiktok/video_intel/Dockerfile .
docker run --rm -p 8765:8765 -v "$PWD":/work titan serve
```

MCP 設定（`.mcp.json`）:
```json
{"mcpServers":{"titan":{"command":"python3","args":["tiktok/video_intel/mcp_server.py"]}}}
```

---

## 10. 既知の制約（隠さない）

1. **他者動画を取得できない環境がある。** 本リポジトリの実行環境は TikTok/YouTube へ到達不可（gateway 403 実測）。取得はオーナー環境で規約を守って行う
2. **BPM推定の確度は低い。** オンセット包絡の自己相関のみ。音楽解析OSSは AGPL(essentia) のため未導入
3. **色パレットは粗い。** 4×4×4=64バケットの量子化。細かい配色分析には不足
4. **ズーム/パンは代理指標。** オプティカルフローではなく差分エネルギーの偏りで推定している
5. **ライセンスは104件中8件しか実測していない。** 採用候補を優先した
6. **速度・精度のベンチマークは未実施。** よってスコアに含めていない

---

## 改訂履歴

| Version | 日付 | 内容 |
|---------|------|------|
| 1.0 | 2026-07-31 | 初版。OSS104件を実測調査し、engine/db/stats/director/report/server/mcp を実装 |
