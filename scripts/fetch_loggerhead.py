#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""fetch_loggerhead.py v4 — 除外なし・広く取得。Claudeが後で目視選抜。
Sternotherus minor をnames検索、写真ありは全部落とす。結果 ~/logger/cand_N.jpg"""
import os, json, time, urllib.request, urllib.parse
OUT=os.path.expanduser("~/logger")
API="https://api.inaturalist.org/v1/observations"
UA="kame-life-guide/1.0"; MAX=15
os.makedirs(OUT, exist_ok=True)
def search(term,page):
    params={"q":term,"search_on":"names","quality_grade":"research",
            "photo_license":"cc0,cc-by,cc-by-sa","per_page":50,"page":page,
            "order_by":"votes","order":"desc","photos":"true"}
    req=urllib.request.Request(API+"?"+urllib.parse.urlencode(params),headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=30) as r: return json.load(r)
def main():
    saved=0; log=[]; seen=set()
    for page in (1,2):
        if saved>=MAX: break
        try: d=search("Sternotherus minor",page)
        except Exception as e: print("検索err",e); break
        obs=d.get("results",[])
        print("page",page,"観察",len(obs))
        for o in obs:
            if saved>=MAX: break
            taxon=(o.get("taxon") or {}).get("name","")
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
                        log.append("cand_%d | obs %s | %s | %s"%(saved,o["id"],p.get("license_code",""),taxon))
                        print("  saved cand_%d (%s)"%(saved,taxon))
                except Exception as e: print("dl err",str(e)[:40])
                time.sleep(0.3)
        time.sleep(1)
    open(os.path.expanduser("~/logger_report.txt"),"w").write("\n".join(log))
    print("\n取得:",saved,"枚")
if __name__=="__main__": main()
