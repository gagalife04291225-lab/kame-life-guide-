#!/usr/bin/env python3
"""
species-master.json（FACT-CHECK正本）と、サイト内の種データの照合。

照合対象:
  shindan/species.js   … latin / cites / 最大甲長
  SHINDAN-SPECIES.md   … 学名列 / CITES列
  species/<slug>.html  … 学名の記載 / 保全表記のラベル

原則:
  ・検出のみ。**自動修正は絶対にしない。**
  ・master 側が UNPROVEN / NEEDS_REVIEW の項目は照合しない
    （未検証の値を基準に既存記述を「誤り」と断じないため）
  ・環境省レッドリストとIUCNの混同を疑う箇所は WARN として出す

使い方:
  python3 tools/validate_species.py            # 検出結果を表示（常に exit 0）
  python3 tools/validate_species.py --strict   # MISMATCH があれば exit 1
"""
import argparse, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTER = os.path.join(ROOT, "data", "species-master.json")


def load_master():
    return json.load(open(MASTER, encoding="utf-8"))["species"]


def binomial(name):
    """『Testudo (Agrionemys) horsfieldii』『…（色変個体）』→ 二名法部分に正規化"""
    name = re.sub(r"\s*[（(][^)）]*[)）]\s*", " ", name)
    return re.sub(r"\s+", " ", name).strip()


def parse_species_js():
    raw = open(os.path.join(ROOT, "shindan", "species.js"), encoding="utf-8").read()
    out = {}
    for m in re.finditer(r"\{ name: '([^']+)', latin: '([^']+)'.*?(?=\n  \{ name: '|\Z)",
                         raw, re.S):
        seg = m.group(0)
        slug = re.search(r"slug: '([^']*)'", seg)
        cites = re.search(r"cites: ('([^']*)'|null)", seg)
        size = re.search(r"'最大甲長': '([^']*)'", seg)
        out.setdefault(slug.group(1) if slug else m.group(1), {
            "name": m.group(1), "latin": m.group(2),
            "cites": (cites.group(2) if cites and cites.group(2) else None),
            "max_cl": size.group(1) if size else None,
        })
    return out


def parse_md():
    """SHINDAN-SPECIES.md の表: | 和名 | 学名 | サイズ | 難易度 | CITES | 備考 |"""
    rows = {}
    for line in open(os.path.join(ROOT, "SHINDAN-SPECIES.md"), encoding="utf-8"):
        c = [x.strip() for x in line.split("|")]
        if len(c) >= 7 and c[2] and c[2] not in ("学名", "---", ":---"):
            rows[c[1]] = {"gakumei": c[2], "cites": c[5]}
    return rows


def cites_label(appendix):
    return {"I": "CITES I", "II": "CITES II", "III": "CITES III"}.get(appendix)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true")
    a = ap.parse_args()

    master = load_master()
    js = parse_species_js()
    md = parse_md()
    issues, warns = [], []

    def mismatch(where, what, expect, got):
        issues.append("MISMATCH %-22s %-10s 正=%s / 現=%s" % (where, what, expect, got))

    for sp in master:
        slug, wamei = sp["slug"], sp["wamei"]
        sci = sp["scientific_name"]
        cit = sp["cites"]["appendix"]

        # --- shindan/species.js ---
        e = js.get(slug)
        if e:
            if sci["verification"] in ("CONFIRMED", "LIKELY"):
                if binomial(e["latin"]) != binomial(sci["value"]):
                    mismatch("species.js:" + slug, "学名", sci["value"], e["latin"])
            if cit["verification"] == "CONFIRMED":
                want = None if cit["value"] == "not_listed" else cites_label(cit["value"])
                if e["cites"] != want:
                    mismatch("species.js:" + slug, "CITES", want, e["cites"])
            mx = sp["max_shell_length_cm"]
            if mx.get("verification") in ("CONFIRMED", "LIKELY") and e["max_cl"]:
                got = re.search(r"(\d+)", e["max_cl"])
                if got and int(got.group(1)) != int(mx["value"]):
                    mismatch("species.js:" + slug, "最大甲長",
                             "%scm" % mx["value"], e["max_cl"])
        elif sp.get("page"):
            warns.append("WARN species.js に slug=%s のエントリなし" % slug)

        # --- SHINDAN-SPECIES.md ---
        hits = [(w, r) for w, r in md.items() if w.startswith(wamei)]
        if not hits and sci["verification"] in ("CONFIRMED", "LIKELY"):
            # 和名が食い違っている場合に備えて学名でも探す
            want2 = " ".join(binomial(sci["value"]).split()[:2])
            hits = [(w, r) for w, r in md.items()
                    if " ".join(binomial(r["gakumei"]).split()[:2]) == want2]
            if hits:
                warns.append("WARN SHINDAN-SPECIES.md の和名が %s ではなく %s"
                             % (wamei, " / ".join(w for w, _ in hits)))
        if not hits and sp["slug"] != "podocnemis-unifilis":
            warns.append("WARN SHINDAN-SPECIES.md に %s の行なし" % wamei)
        for w, r in hits:
            if sci["verification"] in ("CONFIRMED", "LIKELY"):
                if binomial(sci["value"]).split()[0:2] != binomial(r["gakumei"]).split()[0:2]:
                    mismatch("MD:" + w, "学名", sci["value"], r["gakumei"])
            if cit["verification"] == "CONFIRMED":
                want = "なし" if cit["value"] == "not_listed" else cites_label(cit["value"])
                if r["cites"] != want:
                    mismatch("MD:" + w, "CITES", want, r["cites"])

        # --- species/<slug>.html ---
        page = sp.get("page")
        if page and os.path.exists(os.path.join(ROOT, page)):
            raw = open(os.path.join(ROOT, page), encoding="utf-8").read()
            if sci["verification"] in ("CONFIRMED", "LIKELY"):
                base = binomial(sci["value"])
                # 亜種名はページ側で種名のみの場合も許容（前2語で判定）
                if " ".join(base.split()[:2]) not in raw.replace("(Agrionemys) ", ""):
                    mismatch(page, "学名", sci["value"], "（ページ内に記載なし）")
            env = sp["conservation"].get("env_redlist", {})
            if env.get("verification") == "CONFIRMED" and env.get("value", "").startswith("絶滅危惧II類"):
                if "準絶滅危惧" in raw:
                    mismatch(page, "環境省RL", env["value"], "準絶滅危惧（旧RL表記が残存）")
            # RL/IUCN のラベルなし表記（ページ内にどちらのラベルも無い場合のみ）
            if re.search(r"準絶滅危惧|絶滅危惧", raw) \
               and "環境省" not in raw and "IUCN" not in raw:
                warns.append("WARN %s: 保全表記があるが 環境省/IUCN のどちらの評価か明記なし" % page)

    print("=== validate_species: master %d種を照合 ===" % len(master))
    for i in issues:
        print(" ", i)
    for w in warns:
        print(" ", w)
    print("結果: MISMATCH %d件 / WARN %d件" % (len(issues), len(warns)))
    if a.strict and issues:
        sys.exit(1)


if __name__ == "__main__":
    main()
