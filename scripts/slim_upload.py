#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""slim_upload.py — 既存の _incoming_v3 候補を縮小し、各種2枚だけ選んで軽量アップロード

既にfetch済みの ~/_incoming_v3/<slug>/cand_*.jpg を使う(再fetch不要)。
各slugの先頭2枚を長辺1024pxにリサイズ&JPEG圧縮 → 1個のzipにまとめて1回でアップ。
これで数百MB → 数MB になり、遅い回線でも上がる。
"""
import os, sys, json, base64, zipfile, time, io
import urllib.request, urllib.error

REPO = "gagalife04291225-lab/kame-life-guide-"
HOME = os.path.expanduser("~")
SRC = os.path.join(HOME, "_incoming_v3")
ZIP = os.path.join(HOME, "incoming_slim.zip")
REMOTE = "_incoming_slim.zip"
API = "https://api.github.com/repos/%s/contents/%s" % (REPO, REMOTE)
TIMEOUT = 300
PER_SLUG = 2       # 各種2枚だけ
MAXLONG = 1024     # 長辺px
QUALITY = 82

PAT = os.environ.get("KAME_PAT","").strip()
if not PAT:
    print("ERROR: KAME_PAT 未設定。 export KAME_PAT=... の後に実行。"); sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Pillow を入れます..."); os.system("pip install pillow -q")
    from PIL import Image

if not os.path.isdir(SRC):
    print("ERROR: %s なし。" % SRC); sys.exit(1)

# 縮小してzipへ
n=0
with zipfile.ZipFile(ZIP,"w",zipfile.ZIP_DEFLATED) as z:
    for slug in sorted(os.listdir(SRC)):
        sdir=os.path.join(SRC,slug)
        if not os.path.isdir(sdir): continue
        cands=sorted([f for f in os.listdir(sdir) if f.lower().endswith((".jpg",".jpeg",".png",".webp"))])
        for fn in cands[:PER_SLUG]:
            try:
                im=Image.open(os.path.join(sdir,fn)).convert("RGB")
                w,h=im.size; scale=min(1.0, MAXLONG/max(w,h))
                if scale<1.0:
                    im=im.resize((int(w*scale),int(h*scale)))
                buf=io.BytesIO(); im.save(buf,"JPEG",quality=QUALITY)
                z.writestr("_incoming_slim/%s/%s" % (slug, fn.rsplit(".",1)[0]+".jpg"), buf.getvalue())
                n+=1
            except Exception as e:
                print("  skip %s/%s (%s)" % (slug,fn,str(e)[:40]))
size=os.path.getsize(ZIP)
print("slim zip: %d枚 / %.1f MB" % (n, size/1024/1024))

def api(method, payload=None):
    data=json.dumps(payload).encode() if payload else None
    req=urllib.request.Request(API,data=data,method=method,
        headers={"Authorization":"token %s"%PAT,"Accept":"application/vnd.github+json","User-Agent":"kame-slim"})
    with urllib.request.urlopen(req,timeout=TIMEOUT) as r:
        return r.status, json.load(r)

sha=None
try:
    st,body=api("GET")
    if st==200: sha=body.get("sha")
except urllib.error.HTTPError as e:
    if e.code!=404: print("GET warn",e.code)

with open(ZIP,"rb") as f:
    content=base64.b64encode(f.read()).decode()
payload={"message":"upload slim candidate zip","content":content}
if sha: payload["sha"]=sha

print("アップロード中...")
for a in range(1,5):
    try:
        st,body=api("PUT",payload)
        if st in (200,201):
            print("\n完了！ _incoming_slim.zip をアップしました。"); sys.exit(0)
        print("  retry %d (HTTP %s)"%(a,st))
        if st==401: print("  → PATが無効かも。export KAME_PAT=... を確認。"); break
    except Exception as e:
        print("  retry %d (%s)"%(a,str(e)[:60]))
    time.sleep(4*a)
print("失敗。")
