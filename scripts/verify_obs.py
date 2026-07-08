#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
差し替えた3観察の正確なメタデータ確認（Termux用）
出力: 観察ID / 確定種名(iNat) / 作者ログイン名 / 写真ライセンス / 観察URL
使い方:
  curl -s -o ~/verify_obs.py "https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/verify_obs.py"
  python ~/verify_obs.py
結果を丸ごとチャットに貼る。
"""
import json, urllib.request

OBS = {
    "giant-musk-turtle-mx": 7634139,
    "ornate-box-turtle":    38640685,
    "florida-mud-turtle":   195397750,
}
UA = {"User-Agent": "kame-life-guide credit verify"}

for slug, oid in OBS.items():
    url = "https://api.inaturalist.org/v1/observations/%d" % oid
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            d = json.load(r)
        res = d.get("results", [])
        if not res:
            print("%s obs%d: NO RESULT" % (slug, oid)); continue
        o = res[0]
        taxon = (o.get("taxon") or {}).get("name", "?")
        rank  = (o.get("taxon") or {}).get("rank", "?")
        grade = o.get("quality_grade", "?")
        photos = o.get("photos", [])
        lic = photos[0].get("license_code", "?") if photos else "?"
        attr = photos[0].get("attribution", "?") if photos else "?"
        user = (o.get("user") or {}).get("login", "?")
        name = (o.get("user") or {}).get("name", "")
        print("=== %s ===" % slug)
        print("  obs:", oid)
        print("  taxon:", taxon, "(", rank, ")")
        print("  quality:", grade)
        print("  photo_license:", lic)
        print("  user_login:", user, "| name:", name)
        print("  attribution:", attr)
        print("  url: https://www.inaturalist.org/observations/%d" % oid)
    except Exception as e:
        print("%s obs%d ERR: %s" % (slug, oid, e))
