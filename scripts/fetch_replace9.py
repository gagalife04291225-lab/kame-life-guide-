#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
種同定不一致9スロットの差し替え候補取得（Termux実行）
photo credit監査(verify_all.py)で種/亜種不一致が確定した9 slugについて、
正しい学名で iNaturalist から商用可ライセンスの候補を取得する。

仕様:
  - trinomial(三名法)対応: 亜種は "属 種 亜種" で厳密検索
  - research grade のみ
  - 商用可ライセンス限定: cc0 / cc-by / cc-by-sa（NC/ND は除外）
  - USED_OBS / USED_PHOTO で重複排除
  - 各slugにつき候補を最大6件ダウンロード（TeTeが目視選定）
  - 死骸・損傷キーワード(dead/roadkill/carcass等)を含む観察は除外

使い方(Termux):
  curl -sL https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/fetch_replace9.py -o fetch_replace9.py
  python3 fetch_replace9.py
  # → ~/replace9/<slug>/ に候補画像が入る。zipにしてチャットへ:
  cd ~/replace9 && zip -r ~/replace9.zip . && echo "done: ~/replace9.zip"
"""
import json, os, re, time, urllib.request, urllib.parse

OUT = os.path.expanduser("~/replace9")
COMMERCIAL = "cc0,cc-by,cc-by-sa"
UA = {"User-Agent": "kame-life-guide replace9 fetch"}
PER_SLUG = 6
BAD = re.compile(r"dead|roadkill|carcass|road[\s\-]?kill|deceased|remains|死|轢", re.I)

# (slug, 正しい学名, 亜種フラグ)
TARGETS = [
    ("african-helmeted-turtle",   "Pelomedusa subrufa",              False),
    ("loggerhead-musk-turtle",    "Sternotherus minor",              False),
    ("stripe-necked-musk-turtle", "Sternotherus peltifer",           False),
    ("bell-hinge-back-tortoise",  "Kinixys belliana",                False),
    ("florida-box-turtle",        "Terrapene bauri",                 False),
    ("three-toed-box-turtle",     "Terrapene carolina triunguis",    True),
    ("gulf-coast-box-turtle",     "Terrapene carolina major",        True),
    ("greek-tortoise",            "Testudo graeca",                  False),
    ("iberian-greek-tortoise",    "Testudo graeca",                  False),
]

USED_OBS = set()
USED_PHOTO = set()

def api(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)

def taxon_id(name):
    q = urllib.parse.quote(name)
    d = api("https://api.inaturalist.org/v1/taxa?q=%s&per_page=5" % q)
    for t in d.get("results", []):
        if t.get("name", "").lower() == name.lower():
            return t["id"], t.get("rank", "")
    res = d.get("results", [])
    return (res[0]["id"], res[0].get("rank","")) if res else (None, None)

def fetch_slug(slug, name, is_ssp):
    tid, rank = taxon_id(name)
    if not tid:
        print("  ! taxon not found:", name); return 0
    url = ("https://api.inaturalist.org/v1/observations"
           "?taxon_id=%d&photo_license=%s&quality_grade=research"
           "&photos=true&order_by=votes&per_page=40" % (tid, COMMERCIAL))
    d = api(url)
    obs = d.get("results", [])
    outdir = os.path.join(OUT, slug)
    os.makedirs(outdir, exist_ok=True)
    got = 0
    manifest = []
    for o in obs:
        if got >= PER_SLUG: break
        oid = o.get("id")
        if oid in USED_OBS: continue
        # 亜種厳密一致（is_ssp時はtaxon名が三名法で一致すること）
        tn = (o.get("taxon") or {}).get("name","")
        if is_ssp and tn.lower() != name.lower():
            continue
        desc = ((o.get("description") or "") + " " + (o.get("place_guess") or ""))
        if BAD.search(desc):
            continue
        photos = o.get("photos", [])
        if not photos: continue
        p = photos[0]
        pid = p.get("id")
        if pid in USED_PHOTO: continue
        lic = p.get("license_code","")
        if lic not in ("cc0","cc-by","cc-by-sa"): continue
        purl = p.get("url","").replace("square","original")
        if not purl: continue
        ext = ".jpg" if ".jpg" in purl.lower() else (".png" if ".png" in purl.lower() else ".jpg")
        fn = "%s_obs%d%s" % (slug, oid, ext)
        try:
            req = urllib.request.Request(purl, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            open(os.path.join(outdir, fn), "wb").write(data)
        except Exception as e:
            print("    dl err obs%d: %s" % (oid, e)); continue
        USED_OBS.add(oid); USED_PHOTO.add(pid)
        user = (o.get("user") or {})
        manifest.append({
            "file": fn, "obs": oid, "taxon": tn,
            "license": lic,
            "author_login": user.get("login",""),
            "author_name": user.get("name","") or "",
            "obs_url": "https://www.inaturalist.org/observations/%d" % oid,
        })
        got += 1
        time.sleep(0.5)
    json.dump(manifest, open(os.path.join(outdir,"_manifest.json"),"w"),
              ensure_ascii=False, indent=1)
    print("  %s (%s): %d候補" % (slug, name, got))
    return got

def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for slug, name, is_ssp in TARGETS:
        print("[%s]" % slug)
        total += fetch_slug(slug, name, is_ssp)
        time.sleep(1.0)
    print("\n合計 %d候補 取得 -> %s" % (total, OUT))
    print("zip: cd ~/replace9 && zip -r ~/replace9.zip . ")

if __name__ == "__main__":
    main()
