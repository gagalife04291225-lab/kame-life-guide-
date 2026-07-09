#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
フロリダハコガメ(bauri)・ミツユビハコガメ(triunguis) 再取得（Termux実行）
商用可ライセンス限定。前回は種同定が甘くトウブ/ニシキ混入 → 今回は候補を多めに取り、
Claudeが頭部の黄色2本帯・細い黄色放射線・産地で目視判定する前提。

商用可ライセンス限定: cc0 / cc-by / cc-by-sa
research grade のみ。死骸/損傷除外。各種12候補まで。

使い方(Termux):
  curl -sL https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/fetch_box2.py -o fetch_box2.py
  python3 fetch_box2.py
  cd ~/box2 && zip -r ~/box2.zip . && echo done ~/box2.zip
"""
import json, os, re, time, urllib.request, urllib.parse

OUT = os.path.expanduser("~/box2")
COMMERCIAL = "cc0,cc-by,cc-by-sa"
UA = {"User-Agent": "kame-life-guide box2 fetch"}
PER = 12
BAD = re.compile(r"dead|roadkill|carcass|deceased|remains|shell only|死|轢", re.I)

# (slug, taxon_id, ラベル)  taxon_idはiNat確定値
#  Terrapene carolina bauri = 39819
#  Terrapene triunguis(種) = 1544605 / subspecies triunguis = 39818 両方取る
TARGETS = [
    ("florida-box-turtle", 39819, "Terrapene carolina bauri"),
    ("three-toed-box-turtle", 1544605, "Terrapene triunguis"),
    ("three-toed-box-turtle", 39818, "Terrapene carolina triunguis"),
]

USED_OBS=set(); USED_PHOTO=set()

def api(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=40) as r:
        return json.load(r)

def fetch(slug, tid, label):
    url=("https://api.inaturalist.org/v1/observations"
         "?taxon_id=%d&photo_license=%s&quality_grade=research"
         "&photos=true&order_by=votes&per_page=40"%(tid,COMMERCIAL))
    try: d=api(url)
    except Exception as e:
        print("  ! api err",label,e); return 0
    outdir=os.path.join(OUT,slug); os.makedirs(outdir,exist_ok=True)
    mani_path=os.path.join(outdir,"_manifest.json")
    manifest=json.load(open(mani_path)) if os.path.exists(mani_path) else []
    got=0
    for o in d.get("results",[]):
        if len([m for m in manifest])>=PER: break
        oid=o.get("id")
        if oid in USED_OBS: continue
        desc=((o.get("description") or "")+" "+(o.get("place_guess") or ""))
        if BAD.search(desc): continue
        photos=o.get("photos",[])
        if not photos: continue
        p=photos[0]; pid=p.get("id")
        if pid in USED_PHOTO: continue
        lic=p.get("license_code","")
        if lic not in ("cc0","cc-by","cc-by-sa"): continue
        purl=p.get("url","").replace("square","original")
        if not purl: continue
        ext=".jpg" if ".jp" in purl.lower() else (".png" if ".png" in purl.lower() else ".jpg")
        fn="%s_obs%d%s"%(slug,oid,ext)
        try:
            with urllib.request.urlopen(urllib.request.Request(purl,headers=UA),timeout=60) as r:
                open(os.path.join(outdir,fn),"wb").write(r.read())
        except Exception as e:
            print("    dl err",oid,e); continue
        USED_OBS.add(oid); USED_PHOTO.add(pid)
        u=o.get("user") or {}
        manifest.append({"file":fn,"obs":oid,"taxon":(o.get("taxon") or {}).get("name",""),
            "place":o.get("place_guess",""),"license":lic,
            "author_login":u.get("login",""),"author_name":u.get("name","") or "",
            "obs_url":"https://www.inaturalist.org/observations/%d"%oid})
        got+=1; time.sleep(0.4)
    json.dump(manifest,open(mani_path,"w"),ensure_ascii=False,indent=1)
    print("  %s <- %s : +%d (計%d)"%(slug,label,got,len(manifest)))
    return got

def main():
    os.makedirs(OUT,exist_ok=True)
    for slug,tid,label in TARGETS:
        print("[%s]"%label); fetch(slug,tid,label); time.sleep(1)
    print("\n完了 ->",OUT,"\nzip: cd ~/box2 && zip -r ~/box2.zip .")

if __name__=="__main__":
    main()
