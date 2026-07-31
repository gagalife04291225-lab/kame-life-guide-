# ODIN Research Dashboard（Phase18） — 2026-07-31

## 会社の状態

| 指標 | 値 |
|------|-----|
| 知識数（確定） | **0** |
| 仮説数 | 3 |
| 否定済み知識 | 0（否定履歴 0件） |
| 実験数 | 2（解析済み 2） |
| 成功率 | **判定不能** |
| 失敗率 | **判定不能** |
| 統計成立数 | 0 |
| 判定不能数 | 2 |
| Evidence 総数 | 59 |
| 解析済み動画 | 3本（実績付き 0本） |
| デザイン資産 | 38件（変更履歴 38件） |
| 会社の記憶 | 6件 |

## OSS

| 区分 | 件数 |
|------|------|
| 調査済み合計 | 203 |
| 採用候補 | 12 |
| 比較検証 | 0 |
| 保留 | 186 |
| 除外 | 5 |

### ライセンス警告

| repo | ライセンス | 内容 |
|------|-----------|------|
| ultralytics/ultralytics | agpl-3.0 | ★注意: ネットワーク越しに提供するだけで公開義務が発生しうる（SaaS/WebUIで要注意） |
| MTG/essentia | agpl-3.0 | ★注意: ネットワーク越しに提供するだけで公開義務が発生しうる（SaaS/WebUIで要注意） |

## Benchmark（競合監視）

観測 33件（実測 0 / 未取得 33）

| ソース | 到達 | HTTP | APIキー |
|--------|------|------|---------|
| GitHub | 可 | 200 | 不要 |
| YouTube | 可 | 403 | 必要 |
| TikTok | **不可** | 000 | 不要 |
| Instagram | **不可** | 000 | 必要 |

## 最新研究

- [knowledge] KN-0003 冒頭0.5秒の変化量を上げると3秒保持率が上がる — hypothesis（2026-07-31）
- [knowledge] KN-0002 大面積の背景モーションで最長静止を1.5秒以内にできる — hypothesis（2026-07-31）
- [knowledge] KN-0001 静止カード方式はカット0本になる — hypothesis（2026-07-31）
- [experiment] EX-002 Experiment-002 カット密度と静止時間 — 判定不能（2026-07-31）
- [experiment] EX-001 Experiment-001 冒頭0.5秒の変化量 — 判定不能（2026-07-31）

## 更新履歴（デザイン資産）

- 2026-07-31 brand.species: — → 飼育していない種を飼育しているように見せない — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 brand.unknown: — → 分からないことは分からないと書く — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 brand.ai_imagery: — → AI生成の実写風映像は使わない — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 brand.priority: — → 正確性＞信頼＞ブランド＞品質＞再生数＞利益 — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 brand.display_name: — → 亀好きさん — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 tempo.open_3s_cuts_min: — → 2 — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 tempo.change_per_sec_min: — → 0.8 — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 tempo.longest_static_max: — → 1.5 — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 tempo.over2s_ratio_max: — → 35 — 初期登録（DESIGN-SYSTEM v1.0より）
- 2026-07-31 tempo.shot_median_max: — → 2.0 — 初期登録（DESIGN-SYSTEM v1.0より）

## データ充足

```
{
  "sufficient": false,
  "videos": 3,
  "videos_with_outcome": 0,
  "required": {
    "videos": 10,
    "outcomes": 5
  },
  "missing": [
    "解析済み動画が 3本（必要 10本）",
    "実績データ付き動画が 0本（必要 5本）"
  ],
  "note": "**データ不足。台本・投稿戦略の提案は行わない。** 解析と実績登録を先に行うこと。"
}
```
