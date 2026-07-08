#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_images_v3_standalone.py  —  Kame Life Guide 種写真 差し替え取得（自己完結版）

これ1ファイルだけで動く。外部JSON不要。
使い方(Termux):
  pip install requests -q
  python fetch_images_v3_standalone.py
結果: ~/_incoming_v3/<slug>/cand_N.jpg  と  ~/REPORT.md
PAT不要(iNatは認証なしで読める)。腹甲/背甲はiNat側で区別できないため候補を複数取り後で選抜。
"""
import os, json, time
import requests

TARGETS = json.loads(r"""[
 {
  "slug": "canton-reeves-turtle",
  "reason": "A_別種(M.nigricans/クサガメ使い回し)",
  "gakumei": "Mauremys nigricans",
  "binomial": "Mauremys nigricans",
  "trinomial": ""
 },
 {
  "slug": "reeves-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Mauremys reevesii",
  "binomial": "Mauremys reevesii",
  "trinomial": ""
 },
 {
  "slug": "giant-musk-turtle-mx",
  "reason": "A_別種(salvinii/triporcatus使い回し)",
  "gakumei": "Staurotypus salvinii",
  "binomial": "Staurotypus salvinii",
  "trinomial": ""
 },
 {
  "slug": "giant-musk-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Staurotypus triporcatus",
  "binomial": "Staurotypus triporcatus",
  "trinomial": ""
 },
 {
  "slug": "false-map-turtle",
  "reason": "A_kohnii寄り誤同定疑い",
  "gakumei": "Graptemys pseudogeographica pseudogeographica",
  "binomial": "Graptemys pseudogeographica",
  "trinomial": "Graptemys pseudogeographica pseudogeographica"
 },
 {
  "slug": "mississippi-map-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Graptemys pseudogeographica kohnii",
  "binomial": "Graptemys pseudogeographica",
  "trinomial": "Graptemys pseudogeographica kohnii"
 },
 {
  "slug": "hermann-tortoise",
  "reason": "A_別種(hermanni/greek群使い回し)",
  "gakumei": "Testudo hermanni",
  "binomial": "Testudo hermanni",
  "trinomial": ""
 },
 {
  "slug": "greek-tortoise",
  "reason": "A_使い回し相手",
  "gakumei": "Testudo graeca",
  "binomial": "Testudo graeca",
  "trinomial": ""
 },
 {
  "slug": "iberian-greek-tortoise",
  "reason": "A_使い回し相手",
  "gakumei": "Testudo graeca ibera",
  "binomial": "Testudo graeca",
  "trinomial": "Testudo graeca ibera"
 },
 {
  "slug": "three-toed-box-turtle",
  "reason": "A_別種(mexicana/carolina群使い回し)",
  "gakumei": "Terrapene mexicana triunguis",
  "binomial": "Terrapene mexicana",
  "trinomial": "Terrapene mexicana triunguis"
 },
 {
  "slug": "eastern-box-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Terrapene carolina carolina",
  "binomial": "Terrapene carolina",
  "trinomial": "Terrapene carolina carolina"
 },
 {
  "slug": "florida-box-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Terrapene carolina bauri",
  "binomial": "Terrapene carolina",
  "trinomial": "Terrapene carolina bauri"
 },
 {
  "slug": "gulf-coast-box-turtle",
  "reason": "A_使い回し相手",
  "gakumei": "Terrapene carolina major",
  "binomial": "Terrapene carolina",
  "trinomial": "Terrapene carolina major"
 },
 {
  "slug": "carolina-diamondback-terrapin",
  "reason": "B_terrapin3亜種使い回し",
  "gakumei": "Malaclemys terrapin centrata",
  "binomial": "Malaclemys terrapin",
  "trinomial": "Malaclemys terrapin centrata"
 },
 {
  "slug": "northern-diamondback-terrapin",
  "reason": "B_terrapin3亜種使い回し",
  "gakumei": "Malaclemys terrapin terrapin",
  "binomial": "Malaclemys terrapin",
  "trinomial": "Malaclemys terrapin terrapin"
 },
 {
  "slug": "ornate-diamondback-terrapin",
  "reason": "B_terrapin3亜種使い回し",
  "gakumei": "Malaclemys terrapin macrospilota",
  "binomial": "Malaclemys terrapin",
  "trinomial": "Malaclemys terrapin macrospilota"
 },
 {
  "slug": "cumberland-slider",
  "reason": "B_Trachemys3亜種使い回し",
  "gakumei": "Trachemys scripta troostii",
  "binomial": "Trachemys scripta",
  "trinomial": "Trachemys scripta troostii"
 },
 {
  "slug": "red-eared-slider",
  "reason": "B_Trachemys3亜種使い回し",
  "gakumei": "Trachemys scripta elegans",
  "binomial": "Trachemys scripta",
  "trinomial": "Trachemys scripta elegans"
 },
 {
  "slug": "yellow-bellied-slider",
  "reason": "B_Trachemys3亜種使い回し",
  "gakumei": "Trachemys scripta scripta",
  "binomial": "Trachemys scripta",
  "trinomial": "Trachemys scripta scripta"
 },
 {
  "slug": "eastern-mud-turtle",
  "reason": "B_Kinosternon subrubrum3亜種使い回し",
  "gakumei": "Kinosternon subrubrum subrubrum",
  "binomial": "Kinosternon subrubrum",
  "trinomial": "Kinosternon subrubrum subrubrum"
 },
 {
  "slug": "florida-mud-turtle",
  "reason": "B_使い回し",
  "gakumei": "Kinosternon subrubrum steindachneri",
  "binomial": "Kinosternon subrubrum",
  "trinomial": "Kinosternon subrubrum steindachneri"
 },
 {
  "slug": "mississippi-mud-turtle",
  "reason": "B_使い回し",
  "gakumei": "Kinosternon subrubrum hippocrepis",
  "binomial": "Kinosternon subrubrum",
  "trinomial": "Kinosternon subrubrum hippocrepis"
 },
 {
  "slug": "chinese-box-turtle",
  "reason": "B_C.flavomarginata亜種使い回し",
  "gakumei": "Cuora flavomarginata flavomarginata",
  "binomial": "Cuora flavomarginata",
  "trinomial": "Cuora flavomarginata flavomarginata"
 },
 {
  "slug": "taiwan-box-turtle",
  "reason": "B_使い回し",
  "gakumei": "Cuora flavomarginata evelynae",
  "binomial": "Cuora flavomarginata",
  "trinomial": "Cuora flavomarginata evelynae"
 },
 {
  "slug": "loggerhead-musk-turtle",
  "reason": "B_S.minor亜種使い回し",
  "gakumei": "Sternotherus minor minor",
  "binomial": "Sternotherus minor",
  "trinomial": "Sternotherus minor minor"
 },
 {
  "slug": "stripe-necked-musk-turtle",
  "reason": "B_使い回し",
  "gakumei": "Sternotherus minor peltifer",
  "binomial": "Sternotherus minor",
  "trinomial": "Sternotherus minor peltifer"
 },
 {
  "slug": "yaeyama-pond-turtle",
  "reason": "B_M.mutica亜種使い回し",
  "gakumei": "Mauremys mutica kami",
  "binomial": "Mauremys mutica",
  "trinomial": "Mauremys mutica kami"
 },
 {
  "slug": "yellow-pond-turtle",
  "reason": "B_使い回し",
  "gakumei": "Mauremys mutica",
  "binomial": "Mauremys mutica",
  "trinomial": ""
 },
 {
  "slug": "painted-wood-turtle",
  "reason": "B_R.pulcherrima3亜種使い回し",
  "gakumei": "Rhinoclemmys pulcherrima",
  "binomial": "Rhinoclemmys pulcherrima",
  "trinomial": ""
 },
 {
  "slug": "nicaragua-wood-turtle",
  "reason": "B_使い回し",
  "gakumei": "Rhinoclemmys pulcherrima incisa",
  "binomial": "Rhinoclemmys pulcherrima",
  "trinomial": "Rhinoclemmys pulcherrima incisa"
 },
 {
  "slug": "brown-wood-turtle-manni",
  "reason": "B_使い回し",
  "gakumei": "Rhinoclemmys pulcherrima manni",
  "binomial": "Rhinoclemmys pulcherrima",
  "trinomial": "Rhinoclemmys pulcherrima manni"
 },
 {
  "slug": "chinese-softshell-turtle",
  "reason": "C_使い回し相手",
  "gakumei": "Pelodiscus sinensis",
  "binomial": "Pelodiscus sinensis",
  "trinomial": ""
 },
 {
  "slug": "red-footed-tortoise",
  "reason": "C_使い回し相手",
  "gakumei": "Chelonoidis carbonarius",
  "binomial": "Chelonoidis carbonarius",
  "trinomial": ""
 },
 {
  "slug": "marginated-tortoise",
  "reason": "Q_動眼シールのジョーク写真",
  "gakumei": "Testudo marginata",
  "binomial": "Testudo marginata",
  "trinomial": ""
 },
 {
  "slug": "peninsula-cooter",
  "reason": "Q_動眼シールのジョーク写真",
  "gakumei": "Pseudemys peninsularis",
  "binomial": "Pseudemys peninsularis",
  "trinomial": ""
 },
 {
  "slug": "leopard-tortoise",
  "reason": "Q_黄格子(網)越し構図不良",
  "gakumei": "Stigmochelys pardalis",
  "binomial": "Stigmochelys pardalis",
  "trinomial": ""
 },
 {
  "slug": "painted-turtle",
  "reason": "Q_黄格子(網)越し構図不良",
  "gakumei": "Chrysemys picta",
  "binomial": "Chrysemys picta",
  "trinomial": ""
 },
 {
  "slug": "pancake-tortoise",
  "reason": "Q_暗所でカメ不可視",
  "gakumei": "Malacochersus tornieri",
  "binomial": "Malacochersus tornieri",
  "trinomial": ""
 },
 {
  "slug": "pig-nosed-turtle",
  "reason": "Q_濁水中シルエットのみ",
  "gakumei": "Carettochelys insculpta",
  "binomial": "Carettochelys insculpta",
  "trinomial": ""
 }
]""")

HOME = os.path.expanduser("~")
OUTDIR = os.path.join(HOME, "_incoming_v3")
REPORT = os.path.join(HOME, "REPORT.md")

CANDIDATES = 6
PER_PAGE   = 40
MAX_PAGES  = 3
SLEEP      = 1.2
LICENSES   = "cc0,cc-by,cc-by-sa"
UA = os.environ.get("KAME_INAT_UA", "kame-life-guide/1.0 (turtle care site)")
API = "https://api.inaturalist.org/v1/observations"
HEADERS = {"User-Agent": UA}

USED_OBS = set()
USED_PHOTO = set()

def log(m): print(m, flush=True)

def search(term):
    results = []
    for page in range(1, MAX_PAGES+1):
        params = {"q": term, "search_on": "names", "quality_grade": "research",
                  "photo_license": LICENSES, "per_page": PER_PAGE, "page": page,
                  "order": "desc", "order_by": "votes", "photos": "true"}
        try:
            r = requests.get(API, params=params, headers=HEADERS, timeout=30)
            if r.status_code != 200:
                log("    [warn] HTTP %s for %r p%d" % (r.status_code, term, page)); break
            data = r.json()
        except Exception as e:
            log("    [err] %s p%d: %s" % (term, page, e)); break
        obs = data.get("results", [])
        if not obs: break
        for o in obs:
            oid = o.get("id")
            if oid in USED_OBS: continue
            taxon = (o.get("taxon") or {}).get("name","") or ""
            if term.split()[0].lower() not in taxon.lower(): continue
            for p in o.get("photos", []):
                pid = p.get("id")
                if pid in USED_PHOTO: continue
                url = p.get("url","")
                if not url: continue
                big = url.replace("square","original").replace("small","original").replace("medium","original")
                results.append({"obs_id": oid, "photo_id": pid, "url": big,
                                "taxon": taxon, "license": p.get("license_code",""),
                                "attribution": p.get("attribution","")})
            USED_OBS.add(oid)
        time.sleep(SLEEP)
        if len(results) >= CANDIDATES*3: break
    return results

def download(url, path):
    try:
        r = requests.get(url, headers=HEADERS, timeout=60)
        if r.status_code == 200 and r.content:
            open(path,"wb").write(r.content); return len(r.content)
    except Exception as e:
        log("    [dl err] %s" % e)
    return 0

def main():
    os.makedirs(OUTDIR, exist_ok=True)
    report = ["# fetch_images_v3 取得ログ\n"]
    total_ok = 0
    for t in TARGETS:
        slug = t["slug"]; tri = t.get("trinomial",""); bino = t.get("binomial","")
        reason = t.get("reason","")
        log("\n=== %s | %s | %s ===" % (slug, t.get("gakumei",""), reason))
        sdir = os.path.join(OUTDIR, slug); os.makedirs(sdir, exist_ok=True)
        cands = []
        if tri:
            cands = search(tri); log("  trinomial %r: %d候補" % (tri, len(cands)))
        if len(cands) < CANDIDATES and bino:
            more = search(bino); log("  binomial  %r: +%d" % (bino, len(more))); cands += more
        saved = 0; lines = []
        for c in cands:
            if saved >= CANDIDATES: break
            path = os.path.join(sdir, "cand_%d.jpg" % (saved+1))
            n = download(c["url"], path)
            if n > 5000:
                USED_PHOTO.add(c["photo_id"]); saved += 1
                lines.append("  - cand_%d.jpg | obs %s | %s | %s | %s" % (saved, c["obs_id"], c["license"], c["taxon"], c["attribution"][:60]))
            time.sleep(0.4)
        status = "OK" if saved>0 else "NOT_FOUND"
        if saved>0: total_ok += 1
        report.append("\n## %s (%s) — %s %d枚 [%s]" % (slug, t.get("gakumei",""), status, saved, reason))
        report.extend(lines if lines else ["  (候補なし)"])
        log("  → %d枚保存 [%s]" % (saved, status))
    open(REPORT,"w",encoding="utf-8").write("\n".join(report))
    log("\n完了。%d/%d種で候補取得。%s/<slug>/ とログ %s" % (total_ok, len(TARGETS), OUTDIR, REPORT))

if __name__ == "__main__":
    main()
