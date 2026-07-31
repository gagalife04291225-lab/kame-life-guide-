# Project ODIN v2.0 — Autonomous Research Company（FREE Edition）

ODIN v1.0 の設計は**維持**。既存機能は書き換えず、追加テーブルと追加モジュールだけで構成した。
目的は機能追加ではなく、**研究会社として完成させること**。

作成: 2026-07-31
判断順序（不変）: 正確性 ＞ 信頼 ＞ ブランド ＞ 品質 ＞ 再生数 ＞ 利益

---

## 0. v2.0 の設計思想 — 「言わない」ことを機械に強制する

v2.0 で追加した8つのエンジンは、機能を増やすためではなく
**AI Company OS が推測を語れないようにするため**に作った。

| 仕組み | 何を禁止したか |
|--------|--------------|
| Knowledge Engine | 統計的裏づけの無い記録が「知識」を名乗ること |
| Experiment Engine | 「効果がなかった」と「まだ分からない」を混同すること |
| Benchmark Department | 取れなかった情報を推測で埋めること |
| Evidence Engine | **根拠のない提案を出すこと（コードレベルで例外）** |
| Memory Engine | 一度却下した施策を忘れて再提案すること |
| Design Lab | 理由なしに設計値を変えること |
| Self Review | 「たぶん健全」で済ませること |
| Research Dashboard | 都合の良い数字だけを見せること |

**追加した機能はすべて「できることを増やす」より「言えないことを増やす」方向に働く。**

---

## 1. Phase11 — Knowledge Engine

`knowledge_engine.py` / テーブル `knowledge_records` + `knowledge_refutations`

### 保持する項目（依頼どおり全項目）

タイトル / カテゴリ / 根拠となる動画ID / 根拠となる解析値 / 統計結果 /
確信度 / 作成日 / 更新日 / **否定された履歴**

### 「知識」を名乗れる条件（コードで強制）

```
status = "knowledge" になる条件（すべて必須）:
  1. 根拠動画が 5本以上          （stats.MIN_N と同じ）
  2. 統計結果があり、p<0.05 かつ q_fdr<0.05
  3. Evidence ID を持つ
→ 1つでも欠けたら status は自動的に "hypothesis"（仮説）に落ちる
```

人の裁量は入らない。`_judge_status()` が機械的に判定する。

### 実測結果（自作動画3本での登録）

```
KN-0001 「静止カード方式はカット0本になる」
        → hypothesis  理由: 根拠動画が1本（必要5本）/ 統計結果がない
KN-0002 「大面積の背景モーションで最長静止を1.5秒以内にできる」
        → hypothesis  理由: 根拠動画が2本（必要5本）/ 統計結果がない
KN-0003 「冒頭0.5秒の変化量を上げると3秒保持率が上がる」
        → hypothesis  理由: 根拠動画が1本（必要5本）/ 統計結果がない
```

**確定した知識は現在 0件。** 3件すべて仮説に落ちた。これが正しい状態。
「実測で v1→v3 が改善した」ことは事実だが、n=1〜2 では知識ではない。

### 否定は削除ではない

`refute()` は行を消さず、`knowledge_refutations` に理由と日付と誰がを残し、
status を `refuted` にする。**否定された履歴が残ることが Phase11 の要件。**

---

## 2. Phase12 — Benchmark Department（競合研究部）

`benchmark_dept.py` / テーブル `benchmark_sources` + `benchmark_observations`

### 到達可否は毎回**実測**する（前提を信じない）

| ソース | エンドポイント | 到達 | HTTP | APIキー | 無料枠 |
|--------|--------------|------|------|---------|--------|
| GitHub | api.github.com | 可 | 200 | 不要 | 認証時 5,000req/h |
| **YouTube** | googleapis.com/youtube/v3 | **可** | 403 | **必要** | **10,000ユニット/日まで無料** |
| TikTok | tiktok.com/oembed | **不可** | 000 | 不要 | 公式APIは審査制 |
| Instagram | graph.instagram.com | **不可** | 000 | 必要 | 要アプリ審査 |

**★重要な発見**: YouTube Data API v3 のエンドポイントは**到達できる**（403 =「キーを付けろ」）。
つまり **オーナーが無料APIキーを設定すれば、YouTube は実測対象になる。**
TikTok / Instagram はこの環境からは到達できない（接続拒否）。

### 未取得は行として残す

```
観測 33件（実測 0 / 未取得 33）
  GitHub    未取得 3   理由「HTTP 403（このセッションはリポジトリスコープ制限により
                             /search が使えない。GitHub Actions 上では実測可能）」
  YouTube   未取得 10  理由「到達可だがAPIキー未設定」
  TikTok    未取得 10  理由「この実行環境から到達不可（接続拒否）」
  Instagram 未取得 10  理由「この実行環境から到達不可（接続拒否）」
```

**「観測しなかった」と「観測して取れなかった」を区別する**ための設計。
監視項目は依頼どおり10項目（新着/更新/削除/再生数/動画時間/カテゴリ/編集手法/
サムネイル/字幕構成/投稿頻度）すべてを行として持つ。

---

## 3. Phase13 — Experiment Engine

`experiment_engine.py` / テーブル `experiments`

```
Experiment-001  冒頭0.5秒の変化量
  仮説    冒頭0.5秒の変化量を増やすと3秒保持率が上がる
  変数    open_0_5s_change（1つだけ変える）
  比較    群A: v3-ds  vs  群B: それ以外
  指標    retention_3s_pct
  結果    判定不能（各群 n>=5 が必要）
```

### 判定ルール（機械的。裁量なし）

| 判定 | 条件 |
|------|------|
| 判定不能 | いずれかの群が n<5 |
| 採用 | 有意（p<0.05）かつ 効果量が中以上 かつ **方向が仮説どおり** |
| 却下 | 有意だが **方向が仮説と逆** |
| 保留 | 有意でない |

**「保留」を用意しているのが要点。** 有意でないことは「効果がない」の証明ではない。
成功率は `採用/(採用+却下)` で計算し、保留・判定不能は分母に入れない
（結論が出ていないものを成功にも失敗にも数えない）。

### 実測結果

```
EX-001 冒頭0.5秒の変化量        → 判定不能
EX-002 カット密度と静止時間      → 判定不能
成功率: 判定不能 / 失敗率: 判定不能
```

---

## 4. Phase14 — Design System Laboratory

`design_lab.py` / テーブル `design_assets` + `design_history`

**資産 38件**を DESIGN-SYSTEM v1.0 から取り込み、全件に Evidence を付けた。

| カテゴリ | 件数 | 例 |
|---------|------|-----|
| フォント | 6 | font.size.hook = 104px |
| 字幕 | 5 | subtitle.words_per_line = 3-7語（研究レポート E1） |
| CTA | 3 | cta.words = 2-3語（E4） |
| 色 | 5 | color.warn = #e0705c（#c85a4a は 4.09:1 で不合格だったため変更） |
| BGM/効果音 | 4 | bgm.bpm = 80-100（G1）／ AI音声は不可（H2/H3） |
| 構図 | 3 | composition.safe_y = 288-1382px |
| 編集テンポ | 7 | tempo.longest_static_max = 1.5秒（D1/D2） |
| ブランドルール | 5 | brand.display_name = 亀好きさん（恒久ルール） |

`update()` は **理由が空だと例外を投げる**。理由なしの変更はできない。
変更は必ず `design_history` に old→new・理由・Evidence・日付を残す。

---

## 5. Phase15 — Memory Engine（会社の記憶）

`memory_engine.py` / テーブル `company_memory`

目的はただ一つ: **同じ失敗を繰り返さない。**

記録済み6件:
```
[失敗要因]          静止カード方式は使わない（v1: カット0本・最長静止39.97秒）
[成功要因]          全フレーム描画＋背景モーション（v3: 静止1.50秒・変化1.86回/秒）
[却下した仮説]      スキャンラインを増やせば静止判定を回避できる（1.73秒のまま。却下）
[却下した仮説]      ライトスイープを強くして動きを確保する（安っぽくなった。0.026へ戻した）
[失敗要因]          確度が中の数値を断定形で出さない（60個 → およそ50〜60個）
[再現できなかった]  カウントアップ演出の効果（削除したため未検証）
```

### `check_before_action()` — 行動前の関門

実測（実際の応答）:
```
提案「ライトスイープを強くして画面の動きを増やす」
  → 過去の失敗・却下と衝突する可能性あり
     ⚠ MEM-0004 [却下した仮説] ライトスイープを強くして動きを確保する
        （類似 0.72 / 共通句『ライトスイープを強くして』）

提案「静止カードを並べて説明する構成にする」
  → 衝突あり  ⚠ MEM-0001 [失敗要因] 静止カード方式は使わない（共通句『静止カード』）

提案「カウントアップ演出を復活させる」
  → 衝突あり  ⚠ MEM-0010 [再現できなかった知見] カウントアップ演出の効果

提案「ナレーションを録音してBGMを重ねる」
  → 衝突なし
```

**実装上の失敗と修正（記録として残す）**: 最初は空白区切りのトークン化で実装したが、
日本語は分かち書きされないため**まったく検出できなかった**。
文字2-gram の Jaccard 類似度＋最長共通部分文字列（5文字以上）に変更して解決した。

**限界（正直に）**: 語の一致による照合なので、
「骨の数を60個と断定して表示する」と「確度が中の数値を断定形で出さない」のような
**意味は同じだが語が違う**衝突は検出できない。最終判断は人が行う。

---

## 6. Phase16 — Evidence Engine

`evidence.py` / テーブル `evidence`

**すべての提案は Evidence ID を持たなければならない。** コードで強制する。

```python
EV.create(con, kind, ...)  # 参照が1つも無ければ EvidenceError を投げる
EV.require(proposal)       # evidence_id が無ければ EvidenceError
```

Evidence が参照できるもの:
`video_ids` / `metric_refs` / `stat_refs` / `experiment_ids` / `knowledge_ids` / `source_docs`

### AI Director への適用（実測）

```
GET /api/suggest?sha1=<v2>
  evidence_policy: すべての指摘に Evidence ID を付与済み。根拠のない提案は返さない。
  R01 BLOCKER -> Evidence EV-0054 / 記憶照合: 衝突なし
  R02 BLOCKER -> Evidence EV-0055 / 記憶照合: 衝突なし
  R03 HIGH    -> Evidence EV-0056 / 記憶照合: 衝突なし
```

指摘1件ごとに Evidence が作られ、そこには
**その動画の sha1 / 実際に判定に使った実測値 / ルールID / 出典ドキュメント**が入る。
Evidence を付けられない指摘は**返却前に落とす**。

現在の Evidence 総数: **59件**（design_asset 38 / memory 10 / knowledge 3 / experiment 2 / director_finding 6）

---

## 7. Phase17 — Self Review（自己監査）

`self_review.py` / テーブル `self_reviews` / 毎週月曜 07:00 JST 自動実行

実測結果（2026-07-31）:

| # | 監査項目 | 結果 | 内容 |
|---|---------|------|------|
| C1 | 推測が混入していないか | PASS | 『知識』はすべて有意な統計結果を持っている（＝現在0件なので自明に成立） |
| C2 | 統計不足ではないか | **WARN** | 判定不能の実験 2件 / 仮説のまま 3件 |
| C3 | 古い知識を使っていないか | PASS | 180日以上放置された知識はない |
| C4 | 重複知識がないか | PASS | 同カテゴリ・同タイトルの重複はない |
| C5 | ライセンス違反がないか | PASS | AGPL/GPL の2件はすべてコメントアウト（任意依存）のまま |
| C6 | OSS更新漏れがないか | PASS | レジストリ最終測定 2026-07-31（0日前 / 203件） |
| C7 | Evidence欠落がないか | PASS | 知識・実験・デザイン資産はすべて Evidence を持つ |
| C8 | 未取得の放置がないか | **WARN** | 未取得 33件 |

判定: **要注意**（PASS 6 / WARN 2 / FAIL 0）

自動生成された修正案:
- C2 → 動画と実績データを増やして再実行する。各群 n>=5 が必要
- C8 → APIキーで解決できるものはオーナーに設定を依頼する（YouTube Data API v3 は無料枠あり）

**C5 は実際にコードを見て判定している**（requirements.txt を読み、
AGPL パッケージが有効行に入っていないかを検査）。宣言を信じない。

---

## 8. Phase18 — Research Dashboard

`company.py` + `server.py`（`/research` と `/api/company`）

依頼された表示項目をすべて実装:

```
知識数 0 / 仮説数 3 / 否定済み 0 / 実験数 2 / 成功率 判定不能 / 失敗率 判定不能 /
統計成立数 0 / 判定不能数 2 / Evidence 59 / デザイン資産 38 / 会社の記憶 6 /
解析済み動画 3本（実績付き 0本）

OSS: 調査済み 203 / 採用候補 12 / 比較検証 0 / 保留 186 / 除外 5
ライセンス警告: ultralytics(AGPL-3.0) / essentia(AGPL-3.0)
Benchmark: 観測33件（実測0 / 未取得33）
最新研究・更新履歴・自己監査履歴・データ充足
```

**成功率を「0%」ではなく「判定不能」と表示する**のが重要。
分母が0のときに0%と書くのは嘘になる。

---

## 9. 使い方（追加分）

```bash
python3 tiktok/video_intel/cli.py kn                     # 知識一覧
python3 tiktok/video_intel/cli.py kn --add "..." --category 編集テンポ --videos sha1,sha1
python3 tiktok/video_intel/cli.py kn --refute KN-0001 --reason "..."
python3 tiktok/video_intel/cli.py ex                     # 実験一覧
python3 tiktok/video_intel/cli.py ex --design "..." --metric longest_static_sec \
        --direction decrease --group-a "cuts_per_10sec>=2.5" --group-b "cuts_per_10sec<2.5" --run
python3 tiktok/video_intel/cli.py benchmark --run        # 競合監視（到達可否を実測）
python3 tiktok/video_intel/cli.py design                 # デザイン資産
python3 tiktok/video_intel/cli.py design --set tempo.duration --value "40-50" --reason "..."
python3 tiktok/video_intel/cli.py memory                 # 会社の記憶
python3 tiktok/video_intel/cli.py memory --check "ライトスイープを強くする"   # ★行動前の照会
python3 tiktok/video_intel/cli.py review                 # 自己監査
python3 tiktok/video_intel/cli.py dashboard              # 会社全体
python3 tiktok/video_intel/cli.py serve                  # → /research でWeb表示
```

MCP は **13ツール**（v1.0 の8 + v2.0 の5）:
`odin_company_overview` / `odin_knowledge` / `odin_experiments` /
`odin_memory_check` / `odin_self_review`

自動実行:
- 毎日 06:00 JST `odin-daily-research.yml`（OSS調査）
- 毎週月曜 07:00 JST `odin-weekly-selfreview.yml`（自己監査＋競合監視）
- 毎週月曜 09:00 JST `titan-oss-watch.yml`（新着OSS探索）

---

## 10. 既知の制約（隠さない）

1. **確定した知識は 0件。** 3件すべて仮説。n が足りないため。これは欠陥ではなく設計どおり
2. **実験は2件とも判定不能。** 各群 n>=5 が必要
3. **成功率・失敗率は算出できない。** 分母が0
4. **TikTok / Instagram は到達不可。** 環境のネットワークポリシー（接続拒否を実測）
5. **YouTube は APIキーがあれば実測可能**（無料枠 10,000ユニット/日）。未設定
6. **GitHub /search はこのセッションでは 403**（リポジトリスコープ制限）。Actions 上では可
7. **記憶の衝突照合は語の一致のみ。** 意味的に同じで語が違う衝突は取り逃す
8. **ライセンス実測は203件中7件（3.4%）。** 残りは未測定
9. **Windows は実機検証していない。** POSIX固有APIは不使用だが確認は必要

---

## 11. 次にやること（この順に効く）

1. **動画を各群5本以上そろえる** → 実験の「判定不能」が「採用/却下/保留」に変わる
2. **実績データ（3秒保持・完走・保存）を登録** → 仮説が知識へ昇格できるようになる
3. **YouTube Data API のキーを設定**（無料）→ Benchmark の未取得10件が実測に変わる
4. 残り196件のライセンス実測
5. Windows 実機での動作確認

---

## 改訂履歴

| Version | 日付 | 内容 |
|---------|------|------|
| 2.0 | 2026-07-31 | Phase11-18 を実装。v1.0 のテーブル・モジュールは無変更、追加のみ |
| 1.0 | 2026-07-31 | OSS203件調査、Research Department、知識DB、データ充足ゲート |
