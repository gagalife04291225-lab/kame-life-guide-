#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fetch_loggerhead.py — Sternotherus minor minor(亜種厳密)のみを取得

iNat の taxon 名が正確に 'Sternotherus minor minor' の観察だけを拾う。
peltifer/depressus/binomial止まりは除外。
結果: ~/logger/cand_N.jpg （最大8枚）とログ。PAT不要。
"""
import os, json, time, urllib.request, urllib.parse

TARGET_TAXON = "Sternotherus minor minor"  # 亜種まで厳密一致を要求
OUT = os.path.expanduser("~/logger")
API = "https://api.inaturalist.org/v1/observations"
LICENSES = "cc0,cc-by,cc-by-sa"
UA = "kame-life-guide/1.0"
MAX = 8

os.makedirs(OUT, exist_ok=True)

def get(url):
    req=urllib.request.Request(url, headers={"User-Agent":UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

# taxon_id を厳密に引く
def find_taxon_id():
    q=urllib.parse.urlencode({"q":TARGET_TAXON,"rank":"subspecies"})
    d=get("https://api.inaturalist.org/v1/taxa?"+q)
    for t in d.get("results",[]):
        if t.get("name","").lower()==TARGET_TAXON.lower():
            print("taxon_id:",t["id"],t["name"])
            return t["id"]
    # 見つからなければ最上位
    if d.get("results"):
        t=d["results"][0]; print("近似taxon:",t["id"],t.get("name")); return t["id"]
    return None

def main():
    tid=find_taxon_id()
    if not tid:
        print("taxon見つからず"); return
    params={"taxon_id":tid,"quality_grade":"research","photo_license":LICENSES,
            "per_page":50,"order_by":"votes","order":"desc","photos":"true"}
    d=get(API+"?"+urllib.parse.urlencode(params))
    obs=d.get("results",[])
    print("該当観察:",len(obs))
    saved=0; log=[]
    seen=set()
    for o in obs:
        if saved>=MAX: break
        taxon=(o.get("taxon") or {}).get("name","")
        # 亜種名まで厳密一致のみ
        if taxon.lower()!=TARGET_TAXON.lower(): continue
        for p in o.get("photos",[]):
            if saved>=MAX: break
            pid=p.get("id")
            if pid in seen: continue
            seen.add(pid)
            url=p.get("url","").replace("square","original").replace("medium","original").replace("small","original")
            if not url: continue
            try:
                req=urllib.request.Request(url,headers={"User-Agent":UA})
                with urllib.request.urlopen(req,timeout=60) as r:
                    b=r.read()
                if len(b)>5000:
                    saved+=1
                    open(os.path.join(OUT,"cand_%d.jpg"%saved),"wb").write(b)
                    log.append("cand_%d | obs %s | %s | %s | %s"%(saved,o["id"],p.get("license_code",""),taxon,p.get("attribution","")[:50]))
            except Exception as e:
                print("dl err",e)
            time.sleep(0.4)
    open(os.path.expanduser("~/logger_report.txt"),"w").write("\n".join(log))
    print("\n取得:",saved,"枚 →",OUT)
    for l in log: print("  ",l)

if __name__=="__main__":
    main()
