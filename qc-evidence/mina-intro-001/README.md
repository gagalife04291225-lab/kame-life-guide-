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
具体的には、HuggingFace Space の既存デモ等に MASTER 画像と wav を渡して mp4 を受け取る。

人物参照は `brand/assets/mina/mina-master.png`（canonical path）。
生成物は派生物であり、MASTER にはしない。
