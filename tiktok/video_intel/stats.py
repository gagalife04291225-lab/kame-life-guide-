#!/usr/bin/env python3
"""
TITAN AI研究部 — 統計エンジン（推測禁止。統計で証明する）

実装している検定・指標（すべて自前実装。ライブラリ非導入）:
  - Welch の t 検定（等分散を仮定しない）＋ 両側 p 値（t分布のCDFを連分数展開で計算）
  - Cohen's d（効果量）と解釈
  - Pearson 相関係数と p 値
  - 外れ値検出（中央値絶対偏差 MAD による頑健な z 値）
  - 多重比較補正（Benjamini-Hochberg FDR）

原則:
  - **n が小さいときは「有意差なし」ではなく「判定不能」と表示する**（統計的検出力の問題）
  - 有意水準は既定 0.05。FDR 補正後の q 値も併記する
  - 相関は因果ではない。出力に必ずその注記を付ける
"""
import math

# ── 分布関数（標準ライブラリのみ） ──────────────────────────

def _betacf(a, b, x, itmax=200, eps=3e-12):
    qab, qap, qam = a+b, a+1.0, a-1.0
    c, d = 1.0, 1.0 - qab*x/qap
    if abs(d) < 1e-30: d = 1e-30
    d = 1.0/d; h = d
    for m in range(1, itmax+1):
        m2 = 2*m
        aa = m*(b-m)*x/((qam+m2)*(a+m2))
        d = 1.0+aa*d
        if abs(d) < 1e-30: d = 1e-30
        c = 1.0+aa/c
        if abs(c) < 1e-30: c = 1e-30
        d = 1.0/d; h *= d*c
        aa = -(a+m)*(qab+m)*x/((a+m2)*(qap+m2))
        d = 1.0+aa*d
        if abs(d) < 1e-30: d = 1e-30
        c = 1.0+aa/c
        if abs(c) < 1e-30: c = 1e-30
        d = 1.0/d; de = d*c; h *= de
        if abs(de-1.0) < eps: break
    return h

def betai(a, b, x):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    lb = (math.lgamma(a+b)-math.lgamma(a)-math.lgamma(b)
          + a*math.log(x) + b*math.log(1-x))
    bt = math.exp(lb)
    if x < (a+1)/(a+b+2):
        return bt*_betacf(a, b, x)/a
    return 1.0 - bt*_betacf(b, a, 1-x)/b

def t_pvalue_two_sided(t, df):
    if df <= 0 or not math.isfinite(t):
        return None
    return betai(df/2.0, 0.5, df/(df+t*t))

# ── 記述統計 ────────────────────────────────────────────

def _mean(xs): return sum(xs)/len(xs)
def _var(xs):
    if len(xs) < 2: return 0.0
    m = _mean(xs); return sum((x-m)**2 for x in xs)/(len(xs)-1)

def describe(xs):
    xs = [float(x) for x in xs if x is not None]
    if not xs: return None
    s = sorted(xs); n = len(s)
    med = s[n//2] if n % 2 else (s[n//2-1]+s[n//2])/2
    return dict(n=n, mean=round(_mean(xs), 4), median=round(med, 4),
                variance=round(_var(xs), 4), stdev=round(math.sqrt(_var(xs)), 4),
                min=round(min(xs), 4), max=round(max(xs), 4))

# ── 検定 ───────────────────────────────────────────────

MIN_N = 5   # これ未満は「判定不能」とする

def welch_t(a, b):
    a = [float(x) for x in a if x is not None]
    b = [float(x) for x in b if x is not None]
    if len(a) < MIN_N or len(b) < MIN_N:
        return dict(verdict="判定不能", reason="標本が小さい（各群 n>=%d が必要／実際 n=%d,%d）" % (MIN_N, len(a), len(b)),
                    n_a=len(a), n_b=len(b))
    ma, mb = _mean(a), _mean(b)
    va, vb = _var(a), _var(b)
    na, nb = len(a), len(b)
    se2 = va/na + vb/nb
    if se2 <= 0:
        return dict(verdict="判定不能", reason="分散ゼロ", n_a=na, n_b=nb)
    t = (ma-mb)/math.sqrt(se2)
    df = se2**2 / ((va/na)**2/(na-1) + (vb/nb)**2/(nb-1))
    p = t_pvalue_two_sided(t, df)
    sp = math.sqrt(((na-1)*va + (nb-1)*vb)/(na+nb-2)) if na+nb > 2 else 0
    d = (ma-mb)/sp if sp else 0.0
    ad = abs(d)
    mag = "無視できる" if ad < 0.2 else "小" if ad < 0.5 else "中" if ad < 0.8 else "大"
    return dict(verdict="有意" if (p is not None and p < 0.05) else "有意差なし",
                mean_a=round(ma, 4), mean_b=round(mb, 4), diff=round(ma-mb, 4),
                n_a=na, n_b=nb, t=round(t, 4), df=round(df, 2),
                p=None if p is None else round(p, 6),
                cohens_d=round(d, 4), effect_size=mag)

def pearson(xs, ys):
    pairs = [(float(x), float(y)) for x, y in zip(xs, ys) if x is not None and y is not None]
    n = len(pairs)
    if n < MIN_N:
        return dict(verdict="判定不能", reason="標本が小さい（n=%d）" % n, n=n)
    mx = _mean([p[0] for p in pairs]); my = _mean([p[1] for p in pairs])
    sxy = sum((x-mx)*(y-my) for x, y in pairs)
    sxx = sum((x-mx)**2 for x, _ in pairs); syy = sum((y-my)**2 for _, y in pairs)
    if sxx <= 0 or syy <= 0:
        return dict(verdict="判定不能", reason="分散ゼロ", n=n)
    r = sxy/math.sqrt(sxx*syy)
    r = max(-0.999999, min(0.999999, r))
    t = r*math.sqrt((n-2)/(1-r*r))
    p = t_pvalue_two_sided(t, n-2)
    return dict(verdict="有意" if (p is not None and p < 0.05) else "有意差なし",
                r=round(r, 4), n=n, p=None if p is None else round(p, 6),
                note="相関は因果ではない。介入で検証すること")

def outliers(xs, labels=None, z=3.5):
    """MAD による頑健な外れ値検出（平均・標準偏差は外れ値に引きずられるため使わない）"""
    vals = [(i, float(x)) for i, x in enumerate(xs) if x is not None]
    if len(vals) < MIN_N:
        return dict(verdict="判定不能", reason="標本が小さい（n=%d）" % len(vals))
    s = sorted(v for _, v in vals); n = len(s)
    med = s[n//2] if n % 2 else (s[n//2-1]+s[n//2])/2
    dev = sorted(abs(v-med) for _, v in vals)
    mad = dev[n//2] if n % 2 else (dev[n//2-1]+dev[n//2])/2
    if mad == 0:
        return dict(verdict="判定不能", reason="MAD=0")
    out = []
    for i, v in vals:
        mz = 0.6745*(v-med)/mad
        if abs(mz) > z:
            out.append(dict(index=i, label=(labels[i] if labels else None),
                            value=round(v, 4), modified_z=round(mz, 2)))
    return dict(verdict="判定可", median=round(med, 4), mad=round(mad, 4), outliers=out)

def fdr_bh(pvals):
    """Benjamini-Hochberg。多数の指標を一度に比較すると偽陽性が増えるため必須。"""
    idx = [i for i, p in enumerate(pvals) if p is not None]
    m = len(idx)
    if m == 0: return [None]*len(pvals)
    order = sorted(idx, key=lambda i: pvals[i])
    q = [None]*len(pvals)
    prev = 1.0
    for rank, i in enumerate(reversed(order), 1):
        k = m - rank + 1
        val = min(prev, pvals[i]*m/k)
        q[i] = round(val, 6); prev = val
    return q

# ── 成功/失敗パターン抽出 ─────────────────────────────────

NUMERIC_KEYS = [
    "duration_sec", "cuts", "cuts_per_10sec", "shot_mean", "shot_median", "shot_variance",
    "over_2sec_ratio_pct", "change_per_sec", "longest_static_sec", "mean_frame_diff",
    "zoom_ratio", "zoom_events", "pan_events", "brightness", "contrast", "saturation",
    "color_temp", "dominant_band", "bottom_band_pct", "thirds_ratio", "center_weight",
    "open_0_5s_change", "open_1s_changes", "open_3s_cuts", "loop_gap",
    "bpm", "onset_per_sec", "silence_ratio",
]

def compare_groups(rows_a, rows_b, name_a="成功群", name_b="失敗群"):
    """2群の全指標を比較し、有意なものだけを効果量順に返す。"""
    results, ps = [], []
    for k in NUMERIC_KEYS:
        r = welch_t([r.get(k) for r in rows_a], [r.get(k) for r in rows_b])
        r["metric"] = k
        results.append(r); ps.append(r.get("p"))
    for r, q in zip(results, fdr_bh(ps)):
        r["q_fdr"] = q
    sig = [r for r in results if r.get("p") is not None and r["q_fdr"] is not None and r["q_fdr"] < 0.05]
    sig.sort(key=lambda r: -abs(r.get("cohens_d") or 0))
    undecidable = [r for r in results if r.get("verdict") == "判定不能"]
    return dict(group_a=name_a, group_b=name_b,
                n_a=len(rows_a), n_b=len(rows_b),
                significant=sig, all_results=results,
                undecidable_count=len(undecidable),
                note=("標本が各群 %d 本未満の指標は『判定不能』。"
                      "本数を増やすまで結論を出さない。" % MIN_N))

def correlate_with_outcome(rows, outcome_key="completion_pct"):
    out, ps = [], []
    ys = [r.get(outcome_key) for r in rows]
    for k in NUMERIC_KEYS:
        r = pearson([x.get(k) for x in rows], ys)
        r["metric"] = k; r["outcome"] = outcome_key
        out.append(r); ps.append(r.get("p"))
    for r, q in zip(out, fdr_bh(ps)):
        r["q_fdr"] = q
    sig = [r for r in out if r.get("p") is not None and r["q_fdr"] is not None and r["q_fdr"] < 0.05]
    sig.sort(key=lambda r: -abs(r.get("r") or 0))
    return dict(outcome=outcome_key, n=len(rows), significant=sig, all_results=out,
                note="相関は因果ではない。強い相関が出た指標は1変数だけ変えて検証する。")
