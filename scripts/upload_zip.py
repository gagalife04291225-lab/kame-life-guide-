#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""upload_zip.py — _incoming_v3 を1個のzipにまとめてGitHubに1回でアップロード"""
import os, sys, json, base64, zipfile, time
import urllib.request, urllib.error

REPO = "gagalife04291225-lab/kame-life-guide-"
HOME = os.path.expanduser("~")
SRC = os.path.join(HOME, "_incoming_v3")
ZIP = os.path.join(HOME, "incoming_v3.zip")
REMOTE = "_incoming_v3.zip"
API = "https://api.github.com/repos/%s/contents/%s" % (REPO, REMOTE)
TIMEOUT = 300

PAT = os.environ.get("KAME_PAT", "").strip()
if not PAT:
    print("ERROR: KAME_PAT 未設定。 read -s KAME_PAT; export KAME_PAT の後に実行。"); sys.exit(1)

# 1) zip作成（jpg/png/webpのみ）
if not os.path.isdir(SRC):
    print("ERROR: %s なし。先にfetch実行。" % SRC); sys.exit(1)
n = 0
with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk(SRC):
        for fn in files:
            if fn.lower().endswith((".jpg",".jpeg",".png",".webp")):
                full = os.path.join(root, fn)
                arc = os.path.relpath(full, HOME)  # _incoming_v3/<slug>/cand_N.jpg
                z.write(full, arc)
                n += 1
size = os.path.getsize(ZIP)
print("zip作成: %d枚 / %.1f MB" % (n, size/1024/1024))
if size > 45*1024*1024:
    print("警告: zipが45MB超。Contents APIの上限に近い。分割が必要かも。")

# 2) base64化してPUT（既存あればsha付き）
def api(method, payload=None):
    data = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(API, data=data, method=method,
        headers={"Authorization":"token %s"%PAT,"Accept":"application/vnd.github+json","User-Agent":"kame-zip"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.status, json.load(r)

sha = None
try:
    st, body = api("GET")
    if st == 200: sha = body.get("sha")
except urllib.error.HTTPError as e:
    if e.code != 404: print("GET warn:", e.code)

with open(ZIP,"rb") as f:
    content = base64.b64encode(f.read()).decode()
payload = {"message":"upload _incoming_v3.zip (candidate photos)","content":content}
if sha: payload["sha"] = sha

print("アップロード中... (少し待つ)")
for attempt in range(1,5):
    try:
        st, body = api("PUT", payload)
        if st in (200,201):
            print("\n完了！ _incoming_v3.zip をアップロードしました。Claude側で展開できます。")
            sys.exit(0)
        print("  retry %d (HTTP %s)" % (attempt, st))
    except Exception as e:
        print("  retry %d (%s)" % (attempt, str(e)[:60]))
    time.sleep(5*attempt)
print("失敗。もう一度実行してみてください。")
