#!/usr/bin/env python3
"""
validate_species.py の回帰テスト。

固定する仕様:
  cites.appendix の値が null / キーごと欠損 / 通常値（I・II・III・not_listed）の
  いずれであっても validator がクラッシュせず最後まで走り切ること。

背景:
  cites.appendix.value が null かつ verification が CONFIRMED のレコードで
  cites_label() が None を返し、`None not in r["cites"]` が TypeError になって
  validator が途中停止していた（midland-painted-turtle / suwannee-cooter）。

このテストは validator の判定内容そのものは検証しない。
「落ちないこと」と「通常値の照合が従来どおり行われること」だけを固定する。

使い方:
  python3 tools/test_validate_species.py
"""
import json, os, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# validator が ROOT 直下に要求するもの。data/ だけは master を差し替えるため実体を作る。
LINK_ENTRIES = ["shindan", "species", "SHINDAN-SPECIES.md"]

passed = failed = 0


def check(cond, label, detail=""):
    global passed, failed
    print(("PASS " if cond else "FAIL ") + label + (" | " + detail if detail else ""))
    if cond:
        passed += 1
    else:
        failed += 1


def run_with_master(master_obj):
    """master を差し替えた一時ルートで validator を実行し、(returncode, 出力) を返す。"""
    tmp = tempfile.mkdtemp(prefix="validate-species-test-")
    try:
        os.makedirs(os.path.join(tmp, "tools"))
        shutil.copy(os.path.join(ROOT, "tools", "validate_species.py"),
                    os.path.join(tmp, "tools", "validate_species.py"))
        for name in LINK_ENTRIES:
            src = os.path.join(ROOT, name)
            if os.path.exists(src):
                os.symlink(src, os.path.join(tmp, name))
        os.makedirs(os.path.join(tmp, "data"))
        with open(os.path.join(tmp, "data", "species-master.json"), "w", encoding="utf-8") as f:
            json.dump(master_obj, f, ensure_ascii=False)
        p = subprocess.run([sys.executable, os.path.join(tmp, "tools", "validate_species.py")],
                           capture_output=True, text=True)
        return p.returncode, p.stdout + p.stderr
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def load_master():
    with open(os.path.join(ROOT, "data", "species-master.json"), encoding="utf-8") as f:
        return json.load(f)


def first_confirmed_index(master):
    """CITES照合が実際に走るレコード（appendix が通常値・CONFIRMED）の位置を返す。"""
    for i, sp in enumerate(master["species"]):
        ap = (sp.get("cites") or {}).get("appendix") or {}
        if ap.get("verification") == "CONFIRMED" and ap.get("value") in ("I", "II", "III"):
            return i
    raise AssertionError("通常値かつCONFIRMEDのレコードが master に存在しない")


def main():
    base = load_master()
    idx = first_confirmed_index(base)
    target = base["species"][idx]["slug"]

    # --- 1. cites.appendix.value = null ---
    m = load_master()
    m["species"][idx]["cites"]["appendix"]["value"] = None
    m["species"][idx]["cites"]["appendix"]["verification"] = "CONFIRMED"
    rc, out = run_with_master(m)
    check(rc == 0 and "Traceback" not in out,
          "cites.appendix.value = null でクラッシュしない", "exit=%d" % rc)
    check("TypeError" not in out, "cites=null で TypeError が出ない")
    check("結果: MISMATCH" in out, "cites=null でも最後まで走り切る")
    check(("WARN %s の cites.appendix" % target) in out,
          "cites=null は WARN として可視化される（黙って握りつぶさない）")

    # --- 2. cites キーごと欠損 ---
    m = load_master()
    del m["species"][idx]["cites"]
    rc, out = run_with_master(m)
    check(rc == 0 and "Traceback" not in out,
          "cites キーごと欠損でクラッシュしない", "exit=%d" % rc)
    check("結果: MISMATCH" in out, "cites 欠損でも最後まで走り切る")

    # --- 2b. appendix キーだけ欠損 ---
    m = load_master()
    m["species"][idx]["cites"] = {}
    rc, out = run_with_master(m)
    check(rc == 0 and "Traceback" not in out,
          "appendix キー欠損でクラッシュしない", "exit=%d" % rc)

    # --- 3. 通常値（現行データそのまま）---
    rc, out = run_with_master(base)
    check(rc == 0 and "Traceback" not in out,
          "通常値（現行master）でクラッシュしない", "exit=%d" % rc)
    check("結果: MISMATCH" in out, "通常値で最後まで走り切る")
    # 通常値の照合仕様が維持されていること: CONFIRMED かつ I/II/III のレコードは
    # スキップWARNの対象にならない
    check(("WARN %s の cites.appendix" % target) not in out,
          "通常値のレコードは CITES照合をスキップしない（既存仕様を変更していない）")

    print("\nRESULT: %d PASS / %d FAIL" % (passed, failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
