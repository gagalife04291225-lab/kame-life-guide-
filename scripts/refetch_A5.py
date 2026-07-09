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
    # spenglers: G.japonica(リュウキュウ)混入を弾くため属+種 geoemyda spengleri で厳密verify
    ("spenglers-leaf-turtle", "Geoemyda spengleri", "geoemyda spengleri", [119989784]),
    # florida-box: iNatは亜種階級 Terrapene carolina bauri で登録。3語なので完全名verifyされる
    ("florida-box", "Terrapene carolina bauri", "terrapene carolina", [12051904]),
]
# 注: greek / iberian-greek / bell-hinge は前回の refetch_A5 で候補取得済み(report参照)

SEARCH_API = "https://api.inaturalist.org/v1/observations"


def genus_species(name):
    if not name:
        return ""
    return " ".join(name.strip().split()[:2]).lower()


def taxon_id_for(name):
    """学名(種 or 亜種)から iNat taxon_id を引く。完全名一致を優先、無ければ属+種一致"""
    url = "https://api.inaturalist.org/v1/taxa?" + urllib.parse.urlencode({"q": name})
    req = urllib.request.Request(url, headers={"User-Agent": "kame-refetch/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            d = json.load(r)
        results = d.get("results", [])
        want_full = name.strip().lower()
        # 1) 完全名一致(亜種名まで含めて)
        for t in results:
            if (t.get("name","") or "").strip().lower() == want_full:
                return t.get("id")
        # 2) 属+種一致
        for t in results:
            if genus_species(t.get("name","")) == genus_species(name):
                return t.get("id")
    except Exception as e:
        print(f"    [taxon lookup fail] {name}: {e}")
    return None


def fetch_candidates(taxon_name, expect_gs, exclude_obs):
    # 亜種を狙う場合(3語)は完全名一致で厳密verifyする
    want_full = taxon_name.strip().lower() if len(taxon_name.split()) >= 3 else None
    tid = taxon_id_for(taxon_name)
    time.sleep(1.1)

    # 希少種は votes順だけだと空になるので複数の並び順を順に試して集める
    orders = [("votes","desc"), ("created_at","desc"), ("id","desc")]
    collected = {}
    for ob, od in orders:
        params = {
            "photo_license": COMMERCIAL,
            "quality_grade": "research",
            "per_page": 50,
            "order_by": ob,
            "order": od,
        }
        if tid:
            params["taxon_id"] = tid
        else:
            params["taxon_name"] = taxon_name

        url = SEARCH_API + "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={"User-Agent": "kame-refetch/1.0"})
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                d = json.load(r)
        except Exception as e:
            print(f"    [fetch fail order={ob}] {taxon_name}: {e}")
            time.sleep(1.1)
            continue

        for obs in d.get("results", []):
            oid = obs.get("id")
            if oid in exclude_obs or oid in collected:
                continue
            taxon = obs.get("taxon") or {}
            tname = (taxon.get("name","") or "").strip().lower()
            if want_full:
                if tname != want_full:
                    continue
            else:
                if genus_species(taxon.get("name","")) != expect_gs:
                    continue
            for p in obs.get("photos", []):
                lc = p.get("license_code")
                if lc not in ("cc0","cc-by","cc-by-sa"):
                    continue
                purl = (p.get("url") or "").replace("square","large")
                attr = p.get("attribution","")
                collected[oid] = {
                    "obs": oid,
                    "taxon": taxon.get("name"),
                    "rank": taxon.get("rank"),
                    "license": lc,
                    "author": attr,
                    "photo_url": purl,
                    "obs_url": f"https://www.inaturalist.org/observations/{oid}",
                }
                break
        time.sleep(1.1)
        if len(collected) >= 8:
            break

    return list(collected.values())[:8]


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
