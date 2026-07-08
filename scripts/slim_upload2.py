#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""slim_upload2.py — 指定9種のフル解像度候補だけを軽くまとめてアップロード（取り直し用）"""
import os, sys, json, base64, zipfile, io, time
import urllib.request, urllib.error

REPO="gagalife04291225-lab/kame-life-guide-"
HOME=os.path.expanduser("~")
SRC=os.path.join(HOME,"_incoming_v3")
ZIP=os.path.join(HOME,"redo.zip")
REMOTE="_incoming_redo.zip"
API="https://api.github.com/repos/%s/contents/%s"%(REPO,REMOTE)

# 取り直し対象9種（フル解像度で全候補を上げる）
TARGETS=["carolina-diamondback-terrapin","chinese-softshell-turtle","eastern-mud-turtle",
"florida-mud-turtle","giant-musk-turtle","leopard-tortoise","giant-musk-turtle-mx",
"pig-nosed-turtle","ornate-diamondback-terrapin"]

MAXLONG=1600  # 本番800x600に十分な解像度を確保
QUALITY=88

PAT=os.environ.get("KAME_PAT","").strip()
if not PAT:
    print("ERROR: KAME_PAT 未設定。 export KAME_PAT=... の後に実行。"); sys.exit(1)
try:
    from PIL import Image
except ImportError:
    os.system("pip install pillow -q"); from PIL import Image

if not os.path.isdir(SRC):
    print("ERROR: %s なし。"%SRC); sys.exit(1)

n=0
with zipfile.ZipFile(ZIP,"w",zipfile.ZIP_DEFLATED) as z:
    for slug in TARGETS:
        sdir=os.path.join(SRC,slug)
        if not os.path.isdir(sdir):
            print("  (なし) %s"%slug); continue
        for fn in sorted(os.listdir(sdir)):
            if not fn.lower().endswith((".jpg",".jpeg",".png",".webp")): continue
            try:
                im=Image.open(os.path.join(sdir,fn)).convert("RGB")
                w,h=im.size; sc=min(1.0,MAXLONG/max(w,h))
                if sc<1.0: im=im.resize((int(w*sc),int(h*sc)))
                buf=io.BytesIO(); im.save(buf,"JPEG",quality=QUALITY)
                z.writestr("_incoming_redo/%s/%s"%(slug,fn.rsplit(".",1)[0]+".jpg"),buf.getvalue())
                n+=1
            except Exception as e:
                print("  skip %s/%s"%(slug,fn))
size=os.path.getsize(ZIP)
print("redo zip: %d枚 / %.1f MB"%(n,size/1024/1024))

def api(method,payload=None):
    data=json.dumps(payload).encode() if payload else None
    req=urllib.request.Request(API,data=data,method=method,
        headers={"Authorization":"token %s"%PAT,"Accept":"application/vnd.github+json","User-Agent":"redo"})
    with urllib.request.urlopen(req,timeout=300) as r: return r.status,json.load(r)
sha=None
try:
    st,b=api("GET")
    if st==200: sha=b.get("sha")
except urllib.error.HTTPError as e:
    if e.code!=404: print("GET",e.code)
with open(ZIP,"rb") as f: content=base64.b64encode(f.read()).decode()
payload={"message":"upload redo zip (full-res)","content":content}
if sha: payload["sha"]=sha
print("アップロード中...")
for a in range(1,5):
    try:
        st,b=api("PUT",payload)
        if st in (200,201): print("\n完了！ _incoming_redo.zip をアップしました。"); sys.exit(0)
        print("  retry %d (HTTP %s)"%(a,st))
        if st==401: print("  PAT無効？ export KAME_PAT=... 確認"); break
    except Exception as e: print("  retry %d (%s)"%(a,str(e)[:50]))
    time.sleep(4*a)
print("失敗。")
