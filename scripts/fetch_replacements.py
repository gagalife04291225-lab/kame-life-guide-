#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
カメライフガイド 画像 差し替え候補取得スクリプト（Termux用）
======================================================================
図鑑写真として不適切だった21種について、iNaturalistから
research-grade + CC の候補を「各種5枚ずつ」取得する。
Claudeがコンタクトシートで最良の1枚を選ぶための候補集め。

使い方: python fetch_replacements.py
出力:   replace-photos/<slug>_1.jpg ... _5.jpg / replace_credits.csv
"""
import json, os, time, urllib.request, urllib.parse, csv

# 差し替え対象21種 (slug, 検索学名)  ※亜種は三名法
TARGETS = [
    ("red-eared-slider", "Trachemys scripta elegans"),
    ("ringed-map-turtle", "Graptemys oculifera"),
    ("scorpion-mud-turtle", "Kinosternon scorpioides"),
    ("russian-tortoise", "Testudo horsfieldii"),
    ("pig-nosed-turtle", "Carettochelys insculpta"),
    ("mexican-mud-turtle", "Kinosternon integrum"),
    ("herrera-mud-turtle", "Kinosternon herrerai"),
    ("home-hinge-back-tortoise", "Kinixys homeana"),
    ("hilaire-side-necked-turtle", "Phrynops hilarii"),
    ("ornate-box-turtle", "Terrapene ornata ornata"),
    ("ornate-diamondback-terrapin", "Malaclemys terrapin macrospilota"),
    ("stripe-necked-musk-turtle", "Sternotherus peltifer"),
    ("giant-musk-turtle", "Staurotypus triporcatus"),
    ("spotted-turtle", "Clemmys guttata"),
    ("yellow-mud-turtle", "Kinosternon flavescens"),
    ("wood-turtle", "Glyptemys insculpta"),
    ("peninsula-cooter", "Pseudemys peninsularis"),
    ("hime-nioi-turtle", "Sternotherus minor"),
    ("loggerhead-musk-turtle", "Sternotherus minor"),
    ("white-lipped-mud-turtle", "Kinosternon leucostomum"),
    ("albino-chinese-softshell", "Pelodiscus sinensis"),
]

OUTDIR="replace-photos"
os.makedirs(OUTDIR, exist_ok=True)
UA={"User-Agent":"kame-life-guide-replace/1.0 (contact: TeTe)"}
OK={"cc0","cc-by","cc-by-sa"}

def api(url):
    req=urllib.request.Request(url,headers=UA)
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)

def taxon_id(sci):
    q=urllib.parse.quote(sci)
    d=api(f"https://api.inaturalist.org/v1/taxa?q={q}&rank=species,subspecies&per_page=8")
    for t in d.get("results",[]):
        if t.get("name","").lower()==sci.lower():
            return t["id"]
    return d["results"][0]["id"] if d.get("results") else None

def candidates(tid):
    url=(f"https://api.inaturalist.org/v1/observations?taxon_id={tid}"
         f"&quality_grade=research&photo_license=cc0,cc-by,cc-by-sa"
         f"&order_by=votes&per_page=40")
    return api(url).get("results",[])

def dl(url,path):
    req=urllib.request.Request(url,headers=UA)
    with urllib.request.urlopen(req,timeout=60) as r,open(path,"wb") as f:
        f.write(r.read())

rows=[("slug","idx","観察ID","撮影者","ライセンス","画像URL")]
print(f"=== {len(TARGETS)}種の差し替え候補を各5枚取得 ===\n")
for slug,sci in TARGETS:
    print(f"[{slug}] {sci}")
    try:
        tid=taxon_id(sci); time.sleep(0.8)
        if not tid:
            print("   taxon見つからず"); continue
        obs=candidates(tid); time.sleep(0.8)
        got=0
        for o in obs:
            if got>=5: break
            photos=o.get("photos") or []
            if not photos: continue
            p=photos[0]
            lic=(p.get("license_code") or "").lower()
            if lic not in OK: continue
            purl=p.get("url","").replace("square","large")
            got+=1
            path=os.path.join(OUTDIR,f"{slug}_{got}.jpg")
            try:
                dl(purl,path); time.sleep(0.5)
                author=(o.get("user") or {}).get("login","unknown")
                rows.append((slug,got,o["id"],author,lic,purl))
                print(f"   {got}: obs {o['id']} by {author} ({lic})")
            except Exception as e:
                print(f"   dl失敗: {e}"); got-=1
        if got==0: print("   候補なし")
    except Exception as e:
        print(f"   エラー: {e}")
    print()

with open("replace_credits.csv","w",newline="",encoding="utf-8") as f:
    csv.writer(f).writerows(rows)
print("完了。replace-photos/ に候補、replace_credits.csv に出典")
