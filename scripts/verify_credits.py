#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
verify_credits.py  (Termux実行用)

目的:
  photo-credits.html から抽出した全96エントリの obs 番号を iNaturalist API で照合し、
  「クレジットに書かれた学名(gakumei)」と「iNat 上の実際の taxon」が一致するか検証する。
  a591c694 の大量汚染により信頼性が揺らいだため、全件を再verifyする。

入力:
  同じディレクトリに pc_parsed.json を置く
  (各要素: {"wamei","gakumei","author","obs","license"})

出力:
  verify_report.md   … 人が読むレポート（OK / 学名不一致 / ライセンス非商用 / 取得失敗）
  verify_result.json … 機械可読の全結果

実行:
  cd ~ && python verify_credits.py

注意:
  - api.inaturalist.org へアクセスするため Termux で実行すること
    (Claudeサンドボックスからは到達不可)
  - iNat API はレート制限があるため各リクエスト間に sleep を入れている
  - 学名の一致判定は「属+種」レベルで比較。亜種(trinomial)は属種一致でOK扱いにし、
    参考として iNat 側の完全名を併記する
"""

import json
import time
import sys
import urllib.request
import urllib.error

INPUT = "pc_parsed.json"
API = "https://api.inaturalist.org/v1/observations/{}"

# 商用可とみなすライセンス(iNatのphoto license表記)
COMMERCIAL_OK = {"cc0", "cc-by", "cc-by-sa"}


def fetch_obs(obs_id):
    """iNat から観察1件を取得。(taxon_name, rank, photo_licenses, error) を返す"""
    url = API.format(obs_id)
    req = urllib.request.Request(url, headers={"User-Agent": "kame-life-guide-verify/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        return None, None, [], f"HTTP {e.code}"
    except Exception as e:
        return None, None, [], f"ERR {e}"

    results = data.get("results", [])
    if not results:
        return None, None, [], "NO_RESULT"
    obs = results[0]
    taxon = obs.get("taxon") or {}
    taxon_name = taxon.get("name")            # 例 "Geoemyda spengleri"
    rank = taxon.get("rank")                  # 例 "species" / "subspecies"
    # 写真ライセンス(複数枚ありうる)
    photo_licenses = []
    for p in obs.get("photos", []):
        lc = p.get("license_code")            # 例 "cc-by" / None(=all rights)
        photo_licenses.append(lc if lc else "all-rights-reserved")
    return taxon_name, rank, photo_licenses, None


def genus_species(name):
    """学名から属+種の2語だけ取り出す(亜種名は落とす)。小文字化して比較用に返す"""
    if not name:
        return ""
    parts = name.strip().split()
    return " ".join(parts[:2]).lower()


def main():
    try:
        records = json.load(open(INPUT, encoding="utf-8"))
    except FileNotFoundError:
        print(f"[FATAL] {INPUT} が見つかりません。pc_parsed.json を同じ場所に置いてください。")
        sys.exit(1)

    results = []
    n = len(records)
    print(f"verifying {n} entries against iNaturalist ...\n")

    for i, rec in enumerate(records, 1):
        obs_id = rec.get("obs")
        wamei = rec.get("wamei", "")
        cred_gakumei = rec.get("gakumei", "")
        cred_license = (rec.get("license") or "").lower()

        line = f"[{i}/{n}] obs{obs_id} {wamei} ({cred_gakumei}) ... "

        if not obs_id:
            results.append({**rec, "verdict": "NO_OBS", "inat_taxon": None,
                            "inat_rank": None, "inat_licenses": []})
            print(line + "NO_OBS(skip)")
            continue

        taxon_name, rank, photo_licenses, err = fetch_obs(obs_id)
        time.sleep(1.1)  # レート制限対策

        if err:
            results.append({**rec, "verdict": f"FETCH_FAIL:{err}",
                            "inat_taxon": None, "inat_rank": None, "inat_licenses": []})
            print(line + f"FETCH_FAIL({err})")
            continue

        # 学名照合(属+種レベル)
        cred_gs = genus_species(cred_gakumei)
        inat_gs = genus_species(taxon_name)
        name_match = (cred_gs == inat_gs) and cred_gs != ""

        # ライセンス照合(観察写真のどれかが商用可か)
        lic_ok = any((lc in COMMERCIAL_OK) for lc in photo_licenses)

        if not name_match:
            verdict = "NAME_MISMATCH"
        elif not lic_ok:
            verdict = "LICENSE_NONCOMMERCIAL"
        else:
            verdict = "OK"

        results.append({
            **rec,
            "verdict": verdict,
            "inat_taxon": taxon_name,
            "inat_rank": rank,
            "inat_licenses": photo_licenses,
        })
        print(line + f"{verdict}  (iNat: {taxon_name} / {rank} / {photo_licenses})")

    # ---- レポート出力 ----
    json.dump(results, open("verify_result.json", "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)

    def block(title, items):
        out = [f"## {title} ({len(items)})", ""]
        for r in items:
            out.append(
                f"- **{r['wamei']}** / cred:`{r['gakumei']}` obs{r['obs']} "
                f"→ iNat:`{r.get('inat_taxon')}` ({r.get('inat_rank')}) "
                f"lic:{r.get('inat_licenses')}"
            )
        out.append("")
        return "\n".join(out)

    mism = [r for r in results if r["verdict"] == "NAME_MISMATCH"]
    lic = [r for r in results if r["verdict"] == "LICENSE_NONCOMMERCIAL"]
    fail = [r for r in results if r["verdict"].startswith("FETCH_FAIL") or r["verdict"] == "NO_OBS"]
    ok = [r for r in results if r["verdict"] == "OK"]

    report = []
    report.append("# photo-credits 全件 iNat 照合レポート\n")
    report.append(f"総数 {len(results)} / OK {len(ok)} / 学名不一致 {len(mism)} "
                  f"/ 非商用ライセンス {len(lic)} / 取得失敗 {len(fail)}\n")
    report.append(block("🔴 学名不一致（要差し替え or クレジット訂正）", mism))
    report.append(block("🟡 非商用ライセンス（商用サイト使用不可・要差し替え）", lic))
    report.append(block("⚠️ 取得失敗 / obs無し", fail))
    report.append(block("✅ OK（学名一致・商用可）", ok))

    open("verify_report.md", "w", encoding="utf-8").write("\n".join(report))

    print("\n=== 完了 ===")
    print(f"OK={len(ok)}  学名不一致={len(mism)}  非商用={len(lic)}  取得失敗={len(fail)}")
    print("→ verify_report.md と verify_result.json を確認してください。")
    print("→ verify_report.md をチャットにアップすれば、差し替え要否を判定します。")


if __name__ == "__main__":
    main()
