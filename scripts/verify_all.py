#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
全写真クレジット監査（Termux実行）
data/credits_map.json の各 obs ID を iNaturalist API に問い合わせ、
photo-credits.html の記載内容と突き合わせて不一致を検出する。

チェック項目:
  1. taxon    : API taxon と 記載学名（属名レベル一致 / 亜種差は許容）
  2. license  : API 実 photo license と 記載license、かつ商用可(cc0/cc-by/cc-by-sa)
  3. author   : API user(login/name) と 記載author
  4. quality  : research グレードか

使い方(Termux):
  curl -sL https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/verify_all.py -o verify_all.py
  curl -sL https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/data/credits_map.json -o credits_map.json
  python3 verify_all.py credits_map.json
"""
import json, sys, time, urllib.request

COMMERCIAL_OK = {"cc0", "cc-by", "cc-by-sa"}
UA = {"User-Agent": "kame-life-guide credit audit"}

def norm_lic(code):
    if not code:
        return ""
    return code.strip().lower()

def genus(name):
    return (name or "").strip().split(" ")[0].lower()

def fetch(oid):
    url = "https://api.inaturalist.org/v1/observations/%d" % oid
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        d = json.load(r)
    res = d.get("results", [])
    return res[0] if res else None

def main(path):
    rows = json.load(open(path, encoding="utf-8"))
    problems = []
    ok = 0
    for i, r in enumerate(rows, 1):
        oid = r.get("obs")
        wamei = r.get("wamei", "")
        cred_lat = r.get("gakumei", "")
        cred_au = r.get("author", "")
        cred_lic = norm_lic(r.get("credited_license", ""))
        tag = "[%d/%d] %s (obs%s)" % (i, len(rows), wamei, oid)
        if not oid:
            problems.append(tag + " :: obs ID欠落")
            print("SKIP", tag); continue
        try:
            o = fetch(oid)
        except Exception as e:
            problems.append(tag + " :: API ERR %s" % e)
            print("ERR ", tag, e)
            time.sleep(1.0); continue
        if not o:
            problems.append(tag + " :: 観察が存在しない/削除")
            print("GONE", tag)
            time.sleep(0.7); continue

        api_taxon = (o.get("taxon") or {}).get("name", "")
        photos = o.get("photos", [])
        api_lic = norm_lic(photos[0].get("license_code", "")) if photos else ""
        api_login = (o.get("user") or {}).get("login", "")
        api_name = (o.get("user") or {}).get("name", "") or ""
        quality = o.get("quality_grade", "")

        issues = []
        # 1. taxon（属一致で判定、種/亜種差は WARN 扱い）
        if genus(api_taxon) != genus(cred_lat):
            issues.append("TAXON不一致 記載=%s / API=%s" % (cred_lat, api_taxon))
        elif api_taxon.strip().lower() != cred_lat.strip().lower():
            issues.append("種/亜種差 記載=%s / API=%s" % (cred_lat, api_taxon))
        # 2. license
        if api_lic not in COMMERCIAL_OK:
            issues.append("★商用不可ライセンス API=%s" % (api_lic or "none"))
        if api_lic != cred_lic:
            issues.append("license記載相違 記載=%s / API=%s" % (cred_lic, api_lic))
        # 3. author
        if cred_au and cred_au not in (api_login, api_name):
            issues.append("作者相違 記載=%s / API login=%s name=%s" % (cred_au, api_login, api_name))
        # 4. quality
        if quality != "research":
            issues.append("非researchグレード=%s" % quality)

        if issues:
            for it in issues:
                problems.append(tag + " :: " + it)
            print("NG  ", tag)
            for it in issues:
                print("      -", it)
        else:
            ok += 1
            print("OK  ", tag)
        time.sleep(0.7)

    print("\n" + "=" * 50)
    print("検証 %d件 / OK %d件 / 要確認 %d件" % (len(rows), ok, len(rows) - ok))
    print("=" * 50)
    if problems:
        print("\n--- 要確認一覧 ---")
        for p in problems:
            print(p)
        open("verify_problems.txt", "w", encoding="utf-8").write("\n".join(problems))
        print("\n(verify_problems.txt に保存)")
    else:
        print("全件クリア。")

if __name__ == "__main__":
    p = sys.argv[1] if len(sys.argv) > 1 else "credits_map.json"
    main(p)
