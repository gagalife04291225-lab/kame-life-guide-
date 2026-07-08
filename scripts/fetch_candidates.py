#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
差し替え候補取得 v3（商用利用可ライセンス限定・Termux用）
対象3スロット:
  giant-musk-turtle-mx  <- Staurotypus salvinii
  ornate-box-turtle     <- Terrapene ornata
  florida-mud-turtle    <- Kinosternon steindachneri (旧 subrubrum steindachneri)

【今回の修正点（重要）】
  ・photo_license は商用可のみ: cc0, cc-by, cc-by-sa （NCは絶対に取らない）
  ・各画像のライセンスコードをファイル名に埋め込み、取得段階で保証
  ・観察詳細から実際の photo.license_code を再確認して NC を弾く二重チェック

出力: ~/cand3/<slug>__obsID__<license>__NN.jpg
      ~/cand3_candidates.zip （これをチャットにアップ）

使い方(Termux):
  curl -s -o ~/fetch_candidates.py "https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/fetch_candidates.py"
  cd ~ && python fetch_candidates.py
"""
import json, os, time, urllib.request, urllib.parse, zipfile

TARGETS = [
    ("giant-musk-turtle-mx", "Staurotypus salvinii"),
    ("ornate-box-turtle",    "Terrapene ornata"),
    ("florida-mud-turtle",   "Kinosternon steindachneri"),
]
FALLBACK = {"florida-mud-turtle": "Kinosternon subrubrum steindachneri"}

OK_LIC = {"cc0", "cc-by", "cc-by-sa"}  # 商用可のみ
HOME = os.path.expanduser("~")
OUT = os.path.join(HOME, "cand3")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "kame-life-guide photo audit v3"}

def api(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def search(sciname, per=60):
    q = urllib.parse.urlencode({
        "taxon_name": sciname, "quality_grade": "research",
        "photo_license": "cc0,cc-by,cc-by-sa",   # 商用可限定
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
    print("  observations(commercial-ok):", len(results))
    saved = 0
    genus = sci.split()[0].lower()
    for obs in results:
        if saved >= 8: break
        taxon = (obs.get("taxon") or {}).get("name", "")
        if genus not in taxon.lower():
            continue
        photos = obs.get("photos", [])
        if not photos: continue
        p = photos[0]
        lic = (p.get("license_code") or "").lower()
        if lic not in OK_LIC:   # 二重チェック：NC等は弾く
            continue
        purl = p.get("url", "").replace("square", "large")
        if not purl: continue
        oid = obs.get("id")
        fn = os.path.join(OUT, "%s__obs%s__%s__%02d.jpg" % (slug, oid, lic, saved))
        try:
            req = urllib.request.Request(purl, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                open(fn, "wb").write(r.read())
            saved += 1
            print("    saved obs%s [%s] (%s)" % (oid, lic, taxon))
        except Exception as e:
            print("    dl err:", e)
        time.sleep(0.7)
    if saved == 0:
        print("  !! 商用可の候補ゼロ -> Wikimedia Commons を探す必要あり")
    print("  ->", saved, "commercial-ok candidates")

zp = os.path.join(HOME, "cand3_candidates.zip")
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(os.listdir(OUT)):
        z.write(os.path.join(OUT, f), f)
print("\nDONE. Upload to chat:", zp)
