#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""upload_incoming.py v2 — 回線が遅くても止まらない堅牢版(リトライ/スキップ/再実行可)"""
import os, sys, json, base64, time
import urllib.request, urllib.error

REPO = "gagalife04291225-lab/kame-life-guide-"
HOME = os.path.expanduser("~")
SRC = os.path.join(HOME, "_incoming_v3")
API = "https://api.github.com/repos/%s/contents/%s"
TIMEOUT = 120
RETRIES = 4

PAT = os.environ.get("KAME_PAT", "").strip()
if not PAT:
    print("ERROR: KAME_PAT 未設定。 read -s KAME_PAT; export KAME_PAT の後に実行。")
    sys.exit(1)

def api(method, path, payload=None):
    url = API % (REPO, path)
    data = json.dumps(payload).encode() if payload else None
    req = urllib.request.Request(url, data=data, method=method,
          headers={"Authorization": "token %s" % PAT,
                   "Accept": "application/vnd.github+json",
                   "User-Agent": "kame-upload"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.status, json.load(r)

def exists(path):
    try:
        st, body = api("GET", path)
        if st == 200 and isinstance(body, dict):
            return body.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
    except Exception:
        return None
    return None

def put_file(local, remote, sha=None):
    with open(local, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    payload = {"message": "add candidate %s" % remote, "content": content}
    if sha:
        payload["sha"] = sha
    for attempt in range(1, RETRIES+1):
        try:
            st, body = api("PUT", remote, payload)
            if st in (200, 201):
                return True
            if st in (409, 422):
                sha2 = exists(remote)
                if sha2: payload["sha"] = sha2
            print("     retry %d (HTTP %s)" % (attempt, st))
        except Exception as e:
            print("     retry %d (%s)" % (attempt, str(e)[:50]))
        time.sleep(3 * attempt)
    return False

def main():
    if not os.path.isdir(SRC):
        print("ERROR: %s なし。先に fetch を実行。" % SRC); sys.exit(1)
    total = 0; ok = 0; skipped = 0; failed = []
    for slug in sorted(os.listdir(SRC)):
        sdir = os.path.join(SRC, slug)
        if not os.path.isdir(sdir): continue
        for fn in sorted(os.listdir(sdir)):
            if not fn.lower().endswith((".jpg",".jpeg",".png",".webp")): continue
            local = os.path.join(sdir, fn)
            remote = "_incoming_v3/%s/%s" % (slug, fn)
            total += 1
            sha = exists(remote)
            if sha:
                skipped += 1
                print("  [skip] %s (既存)" % remote, flush=True)
                continue
            good = put_file(local, remote, sha)
            if good:
                ok += 1; print("  [OK] %s" % remote, flush=True)
            else:
                failed.append(remote); print("  [FAIL] %s" % remote, flush=True)
            time.sleep(0.5)
    print("\n=== 完了 ===")
    print("新規アップ: %d / 既存スキップ: %d / 失敗: %d / 合計: %d" % (ok, skipped, len(failed), total))
    if failed:
        print("失敗分(もう一度このスクリプトを流せば再挑戦):")
        for f in failed: print("  -", f)

if __name__ == "__main__":
    main()
