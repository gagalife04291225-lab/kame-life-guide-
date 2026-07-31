# TITAN Video Intelligence Platform v1.0

動画を実測し、統計で検証し、改善提案を出すための基盤。
**有料サービス不要・GPU不要・オフライン動作。**

- 設計書: `docs/titan/TITAN-ARCHITECTURE.md`
- OSS調査: `docs/titan/TITAN-OSS-SURVEY.md`（104件を実測）
- しきい値の根拠: `tiktok/DESIGN-SYSTEM.md` → `tiktok/research/RESEARCH-REPORT.md`

## 最小構成

```bash
pip install numpy imageio-ffmpeg Pillow      # 必須はこれだけ
python3 tiktok/video_intel/cli.py analyze video.mp4
python3 tiktok/video_intel/cli.py serve      # → http://127.0.0.1:8765
```

## 大原則

1. **測っていない値は出さない。** 未測定は `null` を返し、理由を `not_measured` に残す
2. **n<5 は「判定不能」。** 「有意差なし」と言わない
3. **提案は必ずルールIDと根拠IDに紐づく。** 「AIが考えた」にしない
4. **AGPL に注意。** ultralytics / essentia は AGPL-3.0（実測）。既定で読み込まない

## ファイル

```
engine.py       映像・音声の実測（40指標超）
db.py           SQLite（videos / outcomes / metrics）
stats.py        Welch t / Pearson / BH-FDR / MAD外れ値（全て自前実装）
director.py     診断14ルール + 企画・構成・編集・字幕・BGM・CTA・投稿計画
report.py       JSON / CSV / HTML 出力
server.py       ダッシュボード（標準ライブラリのみ）
mcp_server.py   MCP (JSON-RPC 2.0 / stdio) — 5ツール
cli.py          コマンドライン
oss/registry.json  調査した104 OSS の実測値
oss/rank.py        実測フィールドのみでスコアリング
```

## 動作確認済みの実測結果（自作動画3本）

| 動画 | 尺 | カット | 中央値 | 変化/秒 | 最長静止 | Directorスコア |
|------|----|-------|--------|---------|---------|---------------|
| v1 静止カード版 | 40.0s | 0 | 40.00s | 0.00 | 39.97s | **5**（要修正） |
| v2 モーション版 | 29.0s | 3 | 7.60s | 0.72 | 4.27s | **25**（要修正） |
| v3 DS準拠版 | 41.4s | 25 | 1.80s | 1.86 | 1.50s | **90**（公開可） |

目視QCでは見つからなかった欠陥（v1のカット0本、v2の静止4.27秒）を数値が先に検出した。
