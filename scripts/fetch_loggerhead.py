#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fetch_loggerhead.py v2 — Sternotherus minor を種レベルで広く取得(peltifer/depressus除外)
亜種未同定でも拾う。Claude側で頭部が斑点/暗タン(=minor minor)の個体を目視選抜する。
結果: ~/logger/cand_N.jpg (最大12枚) PAT不要。
"""
import os, json, time, urllib.request, urllib.parse
OUT=os.path.expanduser("~/logger")
API="https://api.inaturalist.org/v1/observations"
UA="kame-life-guide/1.0"; MAX=12
os.makedirs(OUT, exist_ok=True)
def get(url):
    req=urllib.request.Request(url,headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=30) as r: return json.load(r)
# 種 Sternotherus minor の taxon_id
def tid():
    d=get("https://api.inaturalist.org/v1/taxa?"+urllib.parse.urlencode({"q":"Sternotherus minor","rank":"species"}))
    for t in d.get("results",[]):
        if t.get("name","").lower()=="sternotherus minor":
            print("taxon:",t["id"],t["name"]); return t["id"]
    if d.get("results"): return d["results"][0]["id"]
    return None
def main():
    t=tid()
    if not t: print("taxon見つからず"); return
    params={"taxon_id":t,"quality_grade":"research","photo_license":"cc0,cc-by,cc-by-sa",
            "per_page":80,"order_by":"votes","order":"desc","photos":"true"}
    d=get(API+"?"+urllib.parse.urlencode(params))
    obs=d.get("results",[])
    print("該当観察:",len(obs))
    saved=0; log=[]; seen=set()
    for o in obs:
        if saved>=MAX: break
        taxon=(o.get("taxon") or {}).get("name","").lower()
        # peltifer / depressus を明示除外。minor か minor minor のみ通す
        if "peltifer" in taxon or "depressus" in taxon: continue
        if "sternotherus minor" not in taxon: continue
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
    open(os.path.expanduser("~/logger_report.txt"),"w").write("\n".join(log))
    print("\n取得:",saved,"枚")
    for l in log: print("  ",l)
if __name__=="__main__": main()
