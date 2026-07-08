#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fetch_images_v3.py  —  Kame Life Guide 種写真 差し替え取得スクリプト（Termux実行）

方針:
  - 識別データ(species-identification.json)の学名で iNaturalist を検索
  - quality_grade=research のみ / ライセンスは CC0・CC BY・CC BY-SA のみ
  - 亜種(trinomial)がある種は亜種名で検索し、無ければ二名法にフォールバック
  - 1観測=1個体なので observation単位で重複排除(USED_OBS)、写真単位でもUSED_PHOTO排除
  - 各種 候補を最大 CANDIDATES 枚ダウンロード(_incoming_v3/<slug>/cand_N.jpg) して
    人間(TeTe)が後で目視選抜する運用。※このスクリプトは「候補集め」まで。
  - 腹甲除外方針: iNat側で腹甲/背甲の区別はできないため、機械では弾けない。
    候補を複数取り、TeTeが背甲・頭部が写ったものを選ぶ。qc_filter.pyを併用可。

使い方(Termux):
  pkg install python
  pip install requests
  export KAME_INAT_UA="kame-life-guide/1.0 (contact: you@example.com)"
  # inat-fetch.json と同じディレクトリで:
  python fetch_images_v3.py
  # → _incoming_v3/<slug>/ に候補jpgが溜まる。REPORT.md に取得ログ。

注意:
  - api.inaturalist.org へのアクセスが必要(Termux側で実行する理由)。
  - GitHubへのpushはこのスクリプトでは行わない(取得のみ)。
"""
import os, json, time, sys, hashlib
import requests

HERE = os.path.dirname(os.path.abspath(__file__))
TARGETS = os.path.join(HERE, "inat-fetch.json")
OUTDIR = os.path.join(HERE, "_incoming_v3")
REPORT = os.path.join(HERE, "REPORT.md")

CANDIDATES = 6          # 各種 何枚まで候補を落とすか
PER_PAGE   = 40         # iNat検索の1ページ件数
MAX_PAGES  = 3          # 1種あたり最大ページ数
SLEEP      = 1.2        # API礼儀(秒)。共有IPなので短くしすぎない
LICENSES   = "cc0,cc-by,cc-by-sa"
UA = os.environ.get("KAME_INAT_UA", "kame-life-guide/1.0 (turtle care site)")

API = "https://api.inaturalist.org/v1/observations"
HEADERS = {"User-Agent": UA}

USED_OBS = set()
USED_PHOTO = set()

def log(msg):
    print(msg, flush=True)

def search(term, rank_subspecies=False):
    """学名 term で research grade 観測を検索して写真URL群を返す"""
    results = []
    for page in range(1, MAX_PAGES+1):
        params = {
            "q": term,
            "search_on": "names",
            "quality_grade": "research",
            "photo_license": LICENSES,
            "per_page": PER_PAGE,
            "page": page,
            "order": "desc",
            "order_by": "votes",   # 人気(=良像の傾向)順
            "photos": "true",
        }
        try:
            r = requests.get(API, params=params, headers=HEADERS, timeout=30)
            if r.status_code != 200:
                log(f"    [warn] HTTP {r.status_code} for '{term}' p{page}")
                break
            data = r.json()
        except Exception as e:
            log(f"    [err] {term} p{page}: {e}")
            break
        obs = data.get("results", [])
        if not obs:
            break
        for o in obs:
            oid = o.get("id")
            if oid in USED_OBS:
                continue
            # 学名の一致確認(取り違え防止): 観測のtaxon名にtermの語が含まれるか
            taxon = (o.get("taxon") or {}).get("name","") or ""
            if term.split()[0].lower() not in taxon.lower():
                continue
            photos = o.get("photos", [])
            for p in photos:
                pid = p.get("id")
                if pid in USED_PHOTO:
                    continue
                url = p.get("url","")
                if not url:
                    continue
                # medium→original に置換して高解像度を狙う
                big = url.replace("square","original").replace("small","original").replace("medium","original")
                results.append({
                    "obs_id": oid, "photo_id": pid, "url": big,
                    "taxon": taxon,
                    "license": p.get("license_code",""),
                    "attribution": p.get("attribution",""),
                })
            USED_OBS.add(oid)
        time.sleep(SLEEP)
        if len(results) >= CANDIDATES*3:
            break
    return results

def download(url, path):
    try:
        r = requests.get(url, headers=HEADERS, timeout=60)
        if r.status_code == 200 and r.content:
            with open(path,"wb") as f:
                f.write(r.content)
            return len(r.content)
    except Exception as e:
        log(f"    [dl err] {e}")
    return 0

def main():
    targets = json.load(open(TARGETS, encoding="utf-8"))
    os.makedirs(OUTDIR, exist_ok=True)
    report = ["# fetch_images_v3 取得ログ\n"]
    for t in targets:
        slug = t["slug"]
        tri  = t.get("trinomial","")
        bino = t.get("binomial","")
        reason = t.get("reason","")
        log(f"\n=== {slug} | {t['gakumei']} | {reason} ===")
        sdir = os.path.join(OUTDIR, slug)
        os.makedirs(sdir, exist_ok=True)

        cands = []
        # 亜種名優先 → 無ければ/足りなければ二名法
        if tri:
            cands = search(tri)
            log(f"  trinomial '{tri}': {len(cands)}枚候補")
        if len(cands) < CANDIDATES and bino:
            more = search(bino)
            log(f"  binomial  '{bino}': +{len(more)}枚")
            cands += more

        # ダウンロード
        saved = 0
        lines = []
        for i, c in enumerate(cands):
            if saved >= CANDIDATES:
                break
            path = os.path.join(sdir, f"cand_{saved+1}.jpg")
            n = download(c["url"], path)
            if n > 5000:  # 極端に小さいものは除外
                USED_PHOTO.add(c["photo_id"])
                saved += 1
                lines.append(f"  - cand_{saved}.jpg | obs {c['obs_id']} | {c['license']} | {c['taxon']} | {c['attribution'][:60]}")
            time.sleep(0.4)

        status = "OK" if saved>0 else "NOT_FOUND"
        report.append(f"\n## {slug} ({t['gakumei']}) — {status} {saved}枚 [{reason}]")
        report.extend(lines if lines else ["  (候補なし)"])
        log(f"  → {saved}枚保存 [{status}]")

    open(REPORT,"w",encoding="utf-8").write("\n".join(report))
    log(f"\n完了。候補は {OUTDIR}/<slug>/ 、ログは {REPORT}")

if __name__ == "__main__":
    main()
