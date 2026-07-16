# Phase2 Variable-A — Method Definition（normalize 方式の中身）

Status: WORKING（Variable-A 評価用）
Scope: Variable-A（候補間 normalize）のみ。**Variable-B（タイブレーク）は本書の対象外。**
参照（変更しない・DESIGN FROZEN）: 05-variable-a-evaluation-plan-v1.0.md ／ 07-effective-method-definition-v1.0.md

本書は Variable-A の各 normalize 方式の数式・性質を確定する。挿入位置は 07 と同一
（順位決定スコア確定後・順序決定前）。normalize 対象は選抜済み候補集合の順位決定スコア `raw = sp.score(scores)` のみ。
Multiplier（availMult 等）の意味・値、tie 判定（round6）、sort 順、Golden18、Phase1 Stable、none baseline は変更しない。

各ケースの選抜済み候補集合の raw 列を `R = {r_1,…,r_n}`、`min=min(R)`、`max=max(R)`、`range=max−min` とする。

---

## Candidate1 — none（基準線）

正規化しない。`fs = raw × availMult × diffMult × legalMult × budgetMult × odorMult`。Phase1 Stable と同一。

## Candidate2 — effective（min-max）※ Step7 で Reject 済み

`norm_rel(r) = (range=0) ? 1 : (r − min) / range`（0..1、最小→0・最大→1）
`fs = norm_rel(raw) × Mult積`

Step7 判定: 改善の実証ゼロ・同点+1・availMult 希釈（rare/上級が #1 化）→ **不採用**。
失敗要因: 最小値を 0 に潰す（min 減算）ため raw の絶対的大小比が消え、乗算補正との相互作用が反転する。

---

## Candidate3 — hybrid（相対 × 絶対比の凸結合）

### 目的
raw の絶対差（大小比）を完全には失わず、候補集合内の相対位置も利用する。
effective が「min を 0 に潰す」ことで生じた絶対情報の消失を、絶対比成分の併用で緩和する。

### 数式

2 成分を定義する（いずれも raw に単調・同点保存）:

- 相対成分（effective と同一の min-max）:
  `rel(r) = (range = 0) ? 1 : (r − min) / range`      … 0..1、最小→0・最大→1
- 絶対比成分（min を減算しない・最大で正規化）:
  `abs(r) = (range = 0) ? 1 : ((max > 0) ? (r / max) : rel(r))`   … 最大→1、最小→ min/max（>0 で 0 に潰れない）

hybrid の正規化値（raw 保持割合 `1 − α`、`α ∈ [0,1]`）:

```
H(r) = α · rel(r) + (1 − α) · abs(r)
fs_hybrid = H(raw) × availMult × diffMult × legalMult × budgetMult × odorMult
```

本評価の確定パラメータ: **α = 0.5**（相対 50% ＋ 絶対比 50%、**raw 保持割合 = 0.5**）。
退化ケース（range=0、候補数1を含む）: `rel=abs=1` より `H=1`。

### effective との差
- effective は `rel` のみ（α=1 相当）で、最小 raw を 0 に潰す。
- hybrid は `abs = r/max`（min 非減算）を `1−α` の割合で併用するため、最小 raw も正の成分 `min/max` を保持し、
  raw の大小比（例: 9 対 12 → 0.75 対 1.0）が消えない。これが availMult 等との相互作用反転を抑える設計意図。

### 数学的性質（自己矛盾がないこと）
- P1 順序保存（単調）: `rel`,`abs` はともに r の単調増加関数（分母は正の定数）。凸結合（α,1−α ≥ 0）も単調増加。∴ H は raw の順序を保存。
- P2 同点保存: 同一 raw → 同一 rel・同一 abs → 同一 H。厳密値で新たな同点を作らず既存を分離しない（round6 後の増減は観測値として別途記録）。
- P3 値域健全: raw ≥ 0 かつ range>0 のとき max>0 ゆえ `abs ∈ [min/max, 1] ⊆ [0,1]`、`rel ∈ [0,1]`、凸結合 `H ∈ [0,1]`。range=0 は 1 に定義。ゼロ割・未定義・無限大を生じない。
- P4 候補数非依存: 候補数1（range=0）→ H=1。大規模でも各成分は有界。
- P5 決定性: R のみの純関数。乱数・時刻・順序・外部状態に非依存。
- P6 非負・符号不変: H ≥ 0 のため正の乗算補正との合成で符号反転を生じない。

### Variable-A 制約の遵守（07 §7）
- match 非後退・足切り不可侵: hybrid は選抜済み pool の fs にのみ作用し、pool 選抜・match・H1〜H6 を変更しない（POOL MISMATCH=0 で検証）。
- 中立性: hybrid は自らを有利にする観測項目を要求しない。
