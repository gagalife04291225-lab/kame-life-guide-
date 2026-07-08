#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
upload_incoming.py — ~/_incoming_v3/ の候補画像を一括で GitHub リポジトリに push（Termux実行）

使い方:
  read -s KAME_PAT        # PATを貼ってEnter(表示されない)
  export KAME_PAT
  curl -sO https://raw.githubusercontent.com/gagalife04291225-lab/kame-life-guide-/main/scripts/upload_incoming.py
  python upload_incoming.py

動作:
  ~/_incoming_v3/<slug>/cand_N.jpg を リポジトリの _incoming_v3/<slug>/cand_N.jpg に PUT する。
  既に同じパスがあれば SHA を取得して上書き(409回避)。
  終わると Claude 側が api.github.com から候補を読めるようになる。
"""
import os, sys, json, base64, time
import urllib.request, urllib.error

REPO = "gagalife04291225-lab/kame-life-guide-"
HOME = os.path.expanduser("~")
SRC = os.path.join(HOME, "_incoming_v3")
API = "https://api.github.com/repos/%s/contents/%s"

PAT = os.environ.get("KAME_PAT", "").strip()
if not PAT:
    print("ERROR: 環境変数 KAME_PAT が未設定です。 read -s KAME_PAT; export KAME_PAT の後に実行してください。")
    sys.exit(1)

def api(method, path, payload=None):
    url = API % (REPO, path)
    data = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=data, method=method,
          headers={"Authorization": "token %s" % PAT,
                   "Accept": "application/vnd.github+json",
                   "User-Agent": "kame-upload"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.status, json.load(r)
    except urllib.error.HTTPError as e:
        try: body = json.load(e)
        except Exception: body = {}
        return e.code, body

def get_sha(path):
    st, body = api("GET", path)
    if st == 200 and isinstance(body, dict):
        return body.get("sha")
    return None

def put_file(local, remote):
    with open(local, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    payload = {"message": "add candidate %s" % remote, "content": content}
    sha = get_sha(remote)
    if sha:
        payload["sha"] = sha
    st, body = api("PUT", remote, payload)
    return st in (200, 201), st

def main():
    if not os.path.isdir(SRC):
        print("ERROR: %s がありません。先に fetch を実行してください。" % SRC)
        sys.exit(1)
    total = 0; ok = 0
    for slug in sorted(os.listdir(SRC)):
        sdir = os.path.join(SRC, slug)
        if not os.path.isdir(sdir):
            continue
        for fn in sorted(os.listdir(sdir)):
            if not fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                continue
            local = os.path.join(sdir, fn)
            remote = "_incoming_v3/%s/%s" % (slug, fn)
            total += 1
            good, st = put_file(local, remote)
            print("  [%s] %s" % ("OK" if good else "FAIL %s" % st, remote), flush=True)
            if good: ok += 1
            time.sleep(0.5)
    print("\n完了: %d/%d 枚アップロード。Claude側で読み取り可能。" % (ok, total))

if __name__ == "__main__":
    main()
