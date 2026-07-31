#!/usr/bin/env python3
"""
TITAN / OSS ランキング（実測値のみで算出）

原則:
  - スコアは **実測できたフィールドだけ** で算出する。
  - 速度・精度・保守性・学習コスト・将来性は本バージョンでは測定していないため、
    スコアに含めない（重み0）。含めた瞬間に推測になるため。
  - ライセンスは採否を分けるので、未測定は「要確認」として減点せず、フラグで表す。

スコア式（すべて実測フィールド由来）:
  popularity   = log10(stars+1) / log10(300000)           … 0-1
  adoption     = log10(forks+1) / log10(60000)            … 0-1
  freshness    = 1 - min(days_since_update, 365)/365      … 0-1
  maturity     = min(age_days, 3650)/3650                 … 0-1
  issue_health = 1 - min(issues/(stars/100+1), 1)         … 0-1（star比の未解決Issue）
  alive        = 0 if archived else 1                     … 乗算ゲート

  score = 100 * alive * (0.30*popularity + 0.20*adoption +
                         0.25*freshness + 0.10*maturity + 0.15*issue_health)
"""
import json, math, os, sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
TODAY = date(2026, 7, 31)          # 測定日を固定（再現性のため）

def _days(d):
    y, m, dd = (int(x) for x in d.split("-"))
    return (TODAY - date(y, m, dd)).days

def score_repo(r):
    pop = math.log10(r["stars"] + 1) / math.log10(300000)
    ado = math.log10(r["forks"] + 1) / math.log10(60000)
    fresh = 1 - min(_days(r["updated"]), 365) / 365.0
    mat = min(_days(r["created"]), 3650) / 3650.0
    denom = r["stars"] / 100.0 + 1
    health = 1 - min(r["issues"] / denom, 1.0)
    alive = 0.0 if r.get("archived") else 1.0
    s = 100 * alive * (0.30*pop + 0.20*ado + 0.25*fresh + 0.10*mat + 0.15*health)
    return dict(score=round(s, 1), popularity=round(pop, 3), adoption=round(ado, 3),
                freshness=round(fresh, 3), maturity=round(mat, 3),
                issue_health=round(health, 3), alive=bool(alive))

# 商用利用の観点でのライセンス分類（実測できたものだけ判定する）
LICENSE_CLASS = {
    "mit": "permissive", "apache-2.0": "permissive", "bsd-3-clause": "permissive",
    "bsd-2-clause": "permissive", "isc": "permissive", "unlicense": "permissive",
    "mpl-2.0": "weak-copyleft", "lgpl-3.0": "weak-copyleft", "lgpl-2.1": "weak-copyleft",
    "gpl-3.0": "strong-copyleft", "gpl-2.0": "strong-copyleft",
    "agpl-3.0": "network-copyleft",
}
LICENSE_NOTE = {
    "permissive": "商用利用可。制約が軽い",
    "weak-copyleft": "商用利用可。改変部の公開義務あり",
    "strong-copyleft": "商用利用可だが、リンクした成果物全体に公開義務が及ぶ可能性",
    "network-copyleft": "★注意: ネットワーク越しに提供するだけで公開義務が発生しうる（SaaS/WebUIで要注意）",
    "unknown": "未測定。採用前に必ず確認する",
}

def load():
    return json.load(open(os.path.join(HERE, "registry.json"), encoding="utf-8"))

def rank(category=None, top=None):
    reg = load()
    out = []
    for r in reg["repos"]:
        if category and category not in r["category"]:
            continue
        sc = score_repo(r)
        lic = r.get("license")
        cls = LICENSE_CLASS.get(lic, "unknown")
        out.append({**r, **sc, "license_class": cls, "license_note": LICENSE_NOTE[cls]})
    out.sort(key=lambda x: -x["score"])
    return out[:top] if top else out

def main():
    cat = sys.argv[1] if len(sys.argv) > 1 else None
    rows = rank(cat)
    print("# TITAN OSS ランキング（実測値のみ）%s" % ("／カテゴリ: " + cat if cat else ""))
    print("| # | repo | カテゴリ | score | stars | forks | issues | 更新 | ライセンス |")
    print("|---|------|---------|-------|-------|-------|--------|------|-----------|")
    for i, r in enumerate(rows, 1):
        print("| %d | %s | %s | %.1f | %d | %d | %d | %s | %s |" % (
            i, r["full_name"], r["category"], r["score"], r["stars"], r["forks"],
            r["issues"], r["updated"], r["license"] or "未測定"))
    n_arch = sum(1 for r in rows if not r["alive"])
    print("\n合計 %d件 / アーカイブ済 %d件 / ライセンス実測済 %d件" %
          (len(rows), n_arch, sum(1 for r in rows if r["license"])))
    warn = [r for r in rows if r["license_class"] == "network-copyleft"]
    if warn:
        print("\n★ネットワークコピーレフト（WebUI提供時に要注意）:")
        for r in warn:
            print("  - %s (%s)" % (r["full_name"], r["license"]))

if __name__ == "__main__":
    main()
