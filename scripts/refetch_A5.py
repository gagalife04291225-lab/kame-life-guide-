#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
refetch_A5.py  (Termux実行用)

目的:
  誤同定が確定した5 slug について、正しい種の iNaturalist 画像候補を取得する。
  - 商用可ライセンス(cc0/cc-by/cc-by-sa)限定  ← 前回のNC混入失敗を厳守回避
  - 取得候補が本当に狙った種か API応答で再verify
  - 既知の誤りobsは除外
  - 各slug 最大8候補まで、単写真URL・作者・ライセンス・obsを一覧出力

対象と正しい種:
  spenglers-leaf-turtle : Geoemyda spengleri   (現119989784=japonica誤り)
  greek                 : Testudo graeca       (現10389032=hermanni誤り)
  iberian-greek         : Testudo graeca       (graeca亜種ibera。種はgraecaで取得)
  bell-hinge            : Kinixys belliana      (現9879873=zombensis誤り)
  florida-box           : Terrapene bauri       (現12051904=carolina誤り)

出力:
  refetch_A5_report.md  … slugごとの候補一覧(人が選ぶ用)
  refetch_A5_result.json… 機械可読の全候補

実行:
  cd ~ && python refetch_A5.py
  → refetch_A5_report.md をチャットにアップ → Claudeが目視選定
"""

import json, time, sys, urllib.request, urllib.parse, urllib.error

COMMERCIAL = "cc0,cc-by,cc-by-sa"   # iNat photo_license パラメータ(商用可のみ)

# slug -> (検索taxon_name, 期待する属+種, 除外obsリスト)
TARGETS = [
    ("spenglers-leaf-turtle", "Geoemyda spengleri", "geoemyda spengleri", [119989784]),
    ("greek",                 "Testudo graeca",     "testudo graeca",     [10389032]),
    ("iberian-greek",         "Testudo graeca",     "testudo graeca",     [10389032]),
    ("bell-hinge",            "Kinixys belliana",   "kinixys belliana",   [9879873]),
    ("florida-box",           "Terrapene bauri",    "terrapene bauri",    [12051904]),
]

SEARCH_API = "https://api.inaturalist.org/v1/observations"


def genus_species(name):
    if not name:
        return ""
    return " ".join(name.strip().split()[:2]).lower()


def taxon_id_for(name):
    """種名から iNat taxon_id を引く(検索を種で厳密化するため)"""
    url = "https://api.inaturalist.org/v1/taxa?" + urllib.parse.urlencode({"q": name, "rank": "species"})
    req = urllib.request.Request(url, headers={"User-Agent": "kame-refetch/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            d = json.load(r)
        for t in d.get("results", []):
            if genus_species(t.get("name","")) == genus_species(name):
                return t.get("id")
    except Exception as e:
        print(f"    [taxon lookup fail] {name}: {e}")
    return None


def fetch_candidates(taxon_name, expect_gs, exclude_obs):
    tid = taxon_id_for(taxon_name)
    time.sleep(1.1)
    params = {
        "photo_license": COMMERCIAL,
        "quality_grade": "research",
        "per_page": 30,
        "order_by": "votes",     # 支持の多い=同定が固い観察を優先
        "order": "desc",
    }
    if tid:
        params["taxon_id"] = tid
    else:
        params["taxon_name"] = taxon_name  # フォールバック

    url = SEARCH_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": "kame-refetch/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            d = json.load(r)
    except Exception as e:
        print(f"    [fetch fail] {taxon_name}: {e}")
        return []

    out = []
    for obs in d.get("results", []):
        oid = obs.get("id")
        if oid in exclude_obs:
            continue
        taxon = obs.get("taxon") or {}
        # 種の再verify: 属+種が期待と一致するもののみ採用
        if genus_species(taxon.get("name","")) != expect_gs:
            continue
        for p in obs.get("photos", []):
            lc = p.get("license_code")
            if lc not in ("cc0","cc-by","cc-by-sa"):
                continue
            # 中サイズURL(square url を large に置換)
            purl = (p.get("url") or "").replace("square","large")
            attr = p.get("attribution","")
            out.append({
                "obs": oid,
                "taxon": taxon.get("name"),
                "rank": taxon.get("rank"),
                "license": lc,
                "author": attr,
                "photo_url": purl,
                "obs_url": f"https://www.inaturalist.org/observations/{oid}",
            })
            break  # 1obsにつき代表1枚
        if len(out) >= 8:
            break
    return out


def main():
    all_res = {}
    md = ["# A5件 再fetch候補（商用可・種verify済み）\n"]
    for slug, tname, expect_gs, excl in TARGETS:
        print(f"=== {slug}  ({tname}) ===")
        cands = fetch_candidates(tname, expect_gs, excl)
        time.sleep(1.2)
        all_res[slug] = cands
        md.append(f"## {slug} — 正:{tname}  除外obs:{excl}")
        if not cands:
            md.append("  ⚠️ 候補ゼロ（商用可が少ない種。Wikimedia Commons を検討）\n")
            print("  候補ゼロ")
            continue
        for i,c in enumerate(cands,1):
            md.append(f"{i}. obs{c['obs']} | {c['taxon']}({c['rank']}) | {c['license']} | {c['author']}")
            md.append(f"   {c['obs_url']}")
            md.append(f"   img: {c['photo_url']}")
        md.append("")
        print(f"  {len(cands)} 候補")

    json.dump(all_res, open("refetch_A5_result.json","w",encoding="utf-8"),
              ensure_ascii=False, indent=1)
    open("refetch_A5_report.md","w",encoding="utf-8").write("\n".join(md))
    print("\n=== 完了 ===")
    print("refetch_A5_report.md をチャットにアップしてください。")


if __name__ == "__main__":
    main()
