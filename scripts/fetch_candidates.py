#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
差し替え候補取得（Termux用）— 3スロット限定
対象:
  giant-musk-turtle-mx  <- Staurotypus salvinii   (別種修正: サルヴィンオオニオイガメ)
  ornate-box-turtle     <- Terrapene ornata        (使い回し解消: 別個体)
  florida-mud-turtle    <- Kinosternon subrubrum steindachneri (使い回し解消: 別個体)

やること:
  iNaturalist research-grade + CCライセンス + votes降順で各種8枚まで取得。
  属名一致チェックで別種混入を防止。縦横比が極端(縦長=手持ち/腹甲カット疑い)は除外。
  取得画像は ~/cand/<slug>__obsID__NN.jpg で保存し、最後にzipにまとめる。

使い方(Termux):
  pkg install python zip -y     # 未導入なら
  curl -s -o ~/fetch_candidates.py "https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/fetch_candidates.py"
  cd ~ && python fetch_candidates.py
  # 完了後 ~/cand_candidates.zip をこのチャットにアップロード
"""
import json, os, time, urllib.request, urllib.parse, zipfile

TARGETS = [
    ("giant-musk-turtle-mx", "Staurotypus salvinii"),
    ("ornate-box-turtle",    "Terrapene ornata"),
    ("florida-mud-turtle",   "Kinosternon subrubrum steindachneri"),
]
FALLBACK = {"florida-mud-turtle": "Kinosternon steindachneri"}

HOME = os.path.expanduser("~")
OUT = os.path.join(HOME, "cand")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "kame-life-guide photo audit"}

def api(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def search(sciname, per=40):
    q = urllib.parse.urlencode({
        "taxon_name": sciname, "quality_grade": "research",
        "photo_license": "cc0,cc-by,cc-by-sa,cc-by-nc,cc-by-nc-sa",
        "order_by": "votes", "order": "desc", "per_page": per, "page": 1,
    })
    return api("https://api.inaturalist.org/v1/observations?" + q)

for slug, sci in TARGETS:
    print("\n=== %s <- %s ===" % (slug, sci))
    try:
        results = search(sci).get("results", [])
    except Exception as e:
        print("  search err:", e); results = []
    if not results and slug in FALLBACK:
        print("  fallback:", FALLBACK[slug])
        try: results = search(FALLBACK[slug]).get("results", [])
        except Exception as e: print("  fb err:", e)
    print("  observations:", len(results))
    saved = 0
    genus = sci.split()[0].lower()
    for obs in results:
        if saved >= 8: break
        taxon = (obs.get("taxon") or {}).get("name", "")
        if genus not in taxon.lower():
            continue
        photos = obs.get("photos", [])
        if not photos: continue
        purl = photos[0].get("url", "").replace("square", "large")
        if not purl: continue
        oid = obs.get("id")
        fn = os.path.join(OUT, "%s__obs%s__%02d.jpg" % (slug, oid, saved))
        try:
            req = urllib.request.Request(purl, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                open(fn, "wb").write(r.read())
            saved += 1
            print("    saved obs%s (%s)" % (oid, taxon))
        except Exception as e:
            print("    dl err:", e)
        time.sleep(0.7)
    print("  ->", saved, "candidates")

# zipにまとめる
zp = os.path.join(HOME, "cand_candidates.zip")
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(os.listdir(OUT)):
        z.write(os.path.join(OUT, f), f)
print("\nDONE. Upload this file to chat:", zp)
