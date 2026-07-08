#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""差し替え確定3観察のメタデータ確認（Termux用）"""
import json, urllib.request
OBS = {
    "giant-musk-turtle-mx": 191693770,
    "ornate-box-turtle":    135081285,
    "florida-mud-turtle":   89981872,
}
UA = {"User-Agent": "kame-life-guide credit verify"}
for slug, oid in OBS.items():
    url = "https://api.inaturalist.org/v1/observations/%d" % oid
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            d = json.load(r)
        o = d.get("results", [{}])[0]
        taxon = (o.get("taxon") or {}).get("name", "?")
        photos = o.get("photos", [])
        lic = photos[0].get("license_code", "?") if photos else "?"
        attr = photos[0].get("attribution", "?") if photos else "?"
        user = (o.get("user") or {}).get("login", "?")
        name = (o.get("user") or {}).get("name", "")
        print("=== %s ===" % slug)
        print("  obs:", oid)
        print("  taxon:", taxon)
        print("  quality:", o.get("quality_grade","?"))
        print("  photo_license:", lic)
        print("  user_login:", user, "| name:", name)
        print("  attribution:", attr)
        print("  url: https://www.inaturalist.org/observations/%d" % oid)
    except Exception as e:
        print("%s obs%d ERR: %s" % (slug, oid, e))
