#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fetch_loggerhead.py v3 — 学名クエリ直接検索方式(v3スクリプトと同じ実績ある方式)
Sternotherus minor を names検索し、peltifer/depressus を除外。
結果: ~/logger/cand_N.jpg (最大12枚) PAT不要。
"""
import os, json, time, urllib.request, urllib.parse
OUT=os.path.expanduser("~/logger")
API="https://api.inaturalist.org/v1/observations"
UA="kame-life-guide/1.0"; MAX=12
os.makedirs(OUT, exist_ok=True)

def search(term, page):
    params={"q":term,"search_on":"names","quality_grade":"research",
            "photo_license":"cc0,cc-by,cc-by-sa","per_page":50,"page":page,
            "order_by":"votes","order":"desc","photos":"true"}
    req=urllib.request.Request(API+"?"+urllib.parse.urlencode(params),headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=30) as r:
        return json.load(r)

def main():
    saved=0; log=[]; seen=set()
    for page in (1,2,3):
        if saved>=MAX: break
        try:
            d=search("Sternotherus minor", page)
        except Exception as e:
            print("検索err",e); break
        obs=d.get("results",[])
        print("page",page,"観察",len(obs))
        if not obs: break
        for o in obs:
            if saved>=MAX: break
            taxon=(o.get("taxon") or {}).get("name","").lower()
            if "sternotherus minor" not in taxon: continue
            if "peltifer" in taxon or "depressus" in taxon: continue
            for p in o.get("photos",[]):
                if saved>=MAX: break
                pid=p.get("id")
                if pid in seen: continue
                seen.add(pid)
                url=p.get("url","").replace("square","original").replace("medium","original").replace("small","original")
                if not url: continue
                try:
                    req=urllib.request.Request(url,headers={"User-Agent":UA})
                    with urllib.request.urlopen(req,timeout=60) as r: b=r.read()
                    if len(b)>5000:
                        saved+=1
                        open(os.path.join(OUT,"cand_%d.jpg"%saved),"wb").write(b)
                        log.append("cand_%d | obs %s | %s | %s | %s"%(saved,o["id"],p.get("license_code",""),taxon,p.get("attribution","")[:50]))
                except Exception as e: print("dl err",e)
                time.sleep(0.4)
        time.sleep(1)
    open(os.path.expanduser("~/logger_report.txt"),"w").write("\n".join(log))
    print("\n取得:",saved,"枚")
    for l in log: print("  ",l)
if __name__=="__main__": main()
