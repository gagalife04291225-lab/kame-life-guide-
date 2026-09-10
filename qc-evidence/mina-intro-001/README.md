# ミナ 自己紹介クリップ — mina-intro-001

## できているもの

`audio/` に VOICEVOX で生成した音声3本。セリフは「こんにちは、ミナです。はじめまして。」

| ファイル | 話者 | 長さ |
|---|---|---|
| `mina-intro-speaker2.wav`  | 四国めたん（ノーマル） | 3.58秒 |
| `mina-intro-speaker20.wav` | もち子さん（ノーマル） | 4.06秒 |
| `mina-intro-speaker16.wav` | 九州そら（ノーマル）   | 6.11秒 |

初対面の照れ寄りに調整済み: speedScale 0.94 / intonationScale 0.92 / postPhonemeLength 0.55。

商用利用する場合は VOICEVOX の**キャラクター個別の利用規約**を確認すること。

## できていないもの

動画。**この試みは打ち切った。再開しないこと。**

## 打ち切った理由（DO_NOT_REPEAT）

GitHub Actions の CPU ランナー上で SadTalker を動かそうとして5回失敗した。
原因は毎回異なり、いずれも 2023年のコードを 2026年の環境で動かしたことによる経年劣化。

| 回 | 原因 |
|---|---|
| 1 | `basicsr` の import 自体が壊れており、パッチが当たらなかった |
| 2 | `np.float`（numpy 1.24 で削除） |
| 3 | 検証行が `set -o pipefail` で誤爆（実装側のミス） |
| 4 | スカラーと配列を混ぜた `np.array`（numpy 1.24 で厳格化） |
| 5 | 15分半走行後に失敗（未特定のまま打ち切り） |

**同じ方針で再挑戦しない。** 腐った研究コードの修理に時間を使わないこと。

## 動画が必要になったときの方針

自分でインストールして直す方向へ進まない。**他人が保守している動く環境を使う。**
HuggingFace Space の既存デモに MASTER 画像と wav を渡して mp4 を受け取る。

### 調査済みの Space 一覧（2026-09-10 実測）

HF の API を 20 個の検索語で引き、**469 件**の Space の稼働状態を取得した。

| 状態 | 件数 |
|---|---:|
| RUNNING | 93 |
| RUNTIME_ERROR | 173 |
| BUILD_ERROR | 94 |
| PAUSED | 62 |
| SLEEPING | 38 |

**過半数（57%）が壊れている。** RUNNING のものだけを対象にすること。

**画像1枚＋音声 → 喋る動画（用途一致・すべて RUNNING）**

| Space | ♥ | HW | 更新 |
|---|---:|---|---|
| `fffiloni/EchoMimic` | 161 | zero-a10g | 2026-05-13 |
| `multimodalart/MoDA-fast-talking-head` | 138 | zero-a10g | 2026-07-14 |
| `victor/LongCat-Video-Avatar-1.5` | 313 | zero-a10g | 2026-05-26 |
| `meituan-longcat/LongCat-Video-Avatar-1.5-Demo` | 16 | zero-a10g | 2026-06-23（公式） |
| `acvlab/FantasyTalking` | 152 | zero-a10g | 2025-05-12 |
| `fffiloni/echomimic-v2` | 84 | cpu-upgrade | 2026-05-08 |

推奨順: `fffiloni/EchoMimic` → `MoDA-fast-talking-head` → `LongCat-Video-Avatar-1.5`。
`zero-a10g` は ZeroGPU（無料GPU）。利用に HF の無料アカウントが要る。

**用途違いなので選ばないこと（いいね数は多いが罠）**

- `fffiloni/LatentSync`（♥622）… 既存**動画**の口を音声に合わせるもの。静止画1枚からは作れない
- `KlingTeam/LivePortrait`（♥3,788）… **音声では動かない**。駆動動画が別途必要。
  ただし自分で「照れた演技」を撮れるなら、表情の自然さはこれが最上

**この調査は済んでいる。同じ検索を再実行しないこと。**

人物参照は `brand/assets/mina/mina-master.png`（canonical path）。
生成物は派生物であり、MASTER にはしない。


---

## 音声なしで「画像から動かす」場合の調査（2026-09-10 実測）

要件が「音声不要・画像から動きと表情が変わればよい」に変わったため、
image-to-video / 表情エディタ系の 29 検索語で HF Spaces を取り直した。

**745 件**の稼働状態を取得。RUNNING 205 / RUNTIME_ERROR 311 / PAUSED 81 /
BUILD_ERROR 71 / SLEEPING 68 / CONFIG_ERROR 8。

### 推奨1位: `fffiloni/expression-editor`（♥1,663 / zero-a10g / 2026-05-25）

LivePortrait ベース。目の開き・瞳の向き・眉・口角・顔の pitch/yaw/roll を
スライダーで直接操作する。**元画像のピクセルを保ったまま表情パラメータだけ動かす**ため、
構造的に顔が変質しない。

`brand/mina-fixed-rules.md` の「別人化禁止」「MASTER と同一人物に見えることを最優先」を
満たせる唯一の系統であり、この制約を理由に1位とする。
「初対面の照れ」も 視線を外す / 顎を引く / 口角をわずかに上げる を狙って作れる。

### 動画としての動きが要る場合（すべて RUNNING）

| Space | ♥ | HW | 更新 |
|---|---:|---|---|
| `alexnasa/ltx-2-TURBO` | 537 | zero-a10g | 2026-08-31 |
| `Lightricks/LTX-2.5` | 66 | zero-a10g | 2026-08-11（公式・最新） |
| `Lightricks/ltx-video-distilled` | 1,570 | zero-a10g | 2026-06-15（公式） |
| `alexnasa/Wan2.2-Animate-ZEROGPU` | 322 | zero-a10g | 2026-08-24 |
| `mediasynthesismuseum/stable-video-diffusion` | 2,032 | zero-a10g | 2026-07-15 |
| `Saravutw/WAN2.2_I2V_LIGHTNING_4-8step_custom` | 276 | zero-a10g | 2026-08-13 |

**この系統は拡散モデルであり、数秒動かすと顔が変質する。** 使う場合は生成後に
MASTER と並べた IDENTITY QC を必ず行い、別人に見えたら不採用にする。

### 駆動動画を撮れる場合

`KlingTeam/LivePortrait`（♥3,788・最多 / zero-a10g）。
3秒の演技を撮ってミナへ移す。表情の自然さは最上で、人物も壊れない。

### 推奨手順

1. `fffiloni/expression-editor` で狙った表情が作れるか確認する
2. 動きが足りなければ `alexnasa/ltx-2-TURBO` を試し、IDENTITY QC をかける
3. それでも不足なら `KlingTeam/LivePortrait` ＋ 自前の駆動動画

**この調査は済んでいる。同じ検索を再実行しないこと。**

---

## 実生成の結果（2026-09-10・実測・確定）

**`alexnasa/ltx-2-TURBO` で実際に動画を生成できた。** 調査ではなく実測である。

### 経路（これが唯一動く経路。再探索しない）

GitHub Actions ランナーから HF Space の Gradio API を **匿名で** 叩ける。
HF トークンは不要だった。ZeroGPU は匿名の predict を拒否しなかった。

```
POST https://alexnasa-ltx-2-turbo.hf.space/gradio_api/upload      （画像を上げる）
POST https://alexnasa-ltx-2-turbo.hf.space/gradio_api/call/generate_video
GET  https://alexnasa-ltx-2-turbo.hf.space/gradio_api/call/generate_video/<event_id>
```

引数配列は `/gradio_api/info` の `parameter_default` から組み立て、
**index 0 = 画像 FileData / index 2 = prompt** だけ差し替えれば通る。
実装は `.github/workflows/hf-gen-attempt.yml`（workflow run 34479887114 / job 102879746504）。

### 出力の実測値

| 項目 | 値 |
|---|---|
| 入力 | `brand/assets/mina/mina-master.png` 1枚のみ |
| 出力 | `mina-intro-001.mp4` |
| 解像度 | 960 × 1664（縦） |
| フレーム数 | 73 |
| 長さ | 3.041667 秒 |
| サイズ | 594,118 bytes |
| 生成時間 | 約 27 秒 |
| 音声 | なし |

`Height` / `Width` 引数（index 8 / 9 に 832 / 480 を渡した）は**反映されなかった**。
出力比率は入力画像の比率で決まる。**この引数の探索をやり直さない。**

### 目視QC の結果（全フレームを見た）

良い点 — 顔向きが自然に動き、まばたきし、カメラ目線から視線を伏せる。
MASTER と同一人物に見える。服・背景・照明・商品個体が一貫している。

**破綻 — t ≒ 2.0 秒から商品が溶けて消失し、t ≒ 2.25 秒で手が崩壊する。**

### 確定した制約

**LTX-2 TURBO は 1カット 2秒以内でしか使えない。** 長回しはできない。
商品を持たせたまま 2秒を超えさせない。超える必要がある場合は商品を画面外に置く。

使える区間だけを切り出したものが `mina-intro-001-clean.mp4`
（0〜1.9秒 / 388,493 bytes / 全12フレーム目視でクリーン）。

### 無料ツールの最終順位（この案件の結論）

| 用途 | 1番 | 理由 |
|---|---|---|
| 動きが必要 | `alexnasa/ltx-2-TURBO` | 実際に動いた唯一の実績。ただし2秒制約あり |
| 表情だけ変える | `fffiloni/expression-editor` | 元ピクセルを保持するため別人化が構造的に起きない |

**この結論は確定。同じ比較検討をやり直さない。**
