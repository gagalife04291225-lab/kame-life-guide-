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
