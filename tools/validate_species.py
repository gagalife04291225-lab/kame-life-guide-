#!/usr/bin/env python3
"""
species-master.json（FACT-CHECK正本）と、サイト内の種データの照合。

照合対象:
  shindan/species.js   … latin / cites / 最大甲長
  SHINDAN-SPECIES.md   … 学名列 / CITES列
  species/<slug>.html  … 学名の記載 / 保全表記のラベル
  master 内部        … scientific_name.rank の語彙・学名の一意性

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
            # CONFIRMEDのみ・±1cmの許容（表記の丸め差を誤検出しないため）
            if mx.get("verification") == "CONFIRMED" and e["max_cl"] and mx.get("value"):
                got = re.search(r"(\d+)", e["max_cl"])
                if got and abs(int(got.group(1)) - round(float(mx["value"]))) > 1:
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
                if "×" in r["gakumei"]:
                    warns.append("WARN MD:%s は交雑個体の行だが、species.jsでは同じ和名が %s に使われている（和名衝突）"
                                 % (w, sci["value"]))
                    continue
                if binomial(sci["value"]).split()[0:2] != binomial(r["gakumei"]).split()[0:2]:
                    mismatch("MD:" + w, "学名", sci["value"], r["gakumei"])
            if cit["verification"] == "CONFIRMED":
                if cit["value"] == "not_listed":
                    # 「なし」または備考列運用（CITES列が無い表）を許容
                    if "CITES" in r["cites"]:
                        mismatch("MD:" + w, "CITES", "なし", r["cites"])
                else:
                    want = cites_label(cit["value"])
                    # CITES列が無い表では備考列(c[5])にCITES表記が入るため部分一致で照合
                    if want not in r["cites"]:
                        mismatch("MD:" + w, "CITES", want, r["cites"])

        # --- 国内規制（species.js の legal と master の domestic_law）---
        law = sp.get("domestic_law", {})
        if e and law.get("verification") == "CONFIRMED" and law.get("value"):
            lv = law["value"]
            js_raw = open(os.path.join(ROOT, "shindan", "species.js"), encoding="utf-8").read()
            m = re.search(r"\{ name: '%s'.*?legal: ('([^']*)'|null)" % re.escape(e["name"]), js_raw, re.S)
            js_legal = m.group(2) if m and m.group(2) else None
            if lv.startswith("条件付特定外来") and js_legal != "conditional_invasive":
                mismatch("species.js:" + slug, "国内規制", "conditional_invasive", js_legal)
            if lv.startswith("特定外来生物") and js_legal not in ("unknown_hold", "designated_invasive"):
                mismatch("species.js:" + slug, "国内規制", "診断除外相当（特定外来）", js_legal)

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
            # --- care照合（自動修正なし・検出のみ）---
            care = sp.get("care", {})
            wt = care.get("water_temp_c", {})
            if isinstance(wt, dict) and wt.get("verification") in ("CONFIRMED", "LIKELY") \
               and isinstance(wt.get("value"), str):
                mrange = re.search(r"(\d+)〜(\d+)", wt["value"])
                prange = re.search(r"水温[^0-9]{0,20}(\d+)〜(\d+)℃", raw)
                if mrange and prange:
                    mlo, mhi = int(mrange.group(1)), int(mrange.group(2))
                    plo, phi = int(prange.group(1)), int(prange.group(2))
                    if phi < mlo or plo > mhi:  # レンジが全く重ならない場合のみ
                        mismatch(page, "水温", wt["value"], "%d〜%d℃" % (plo, phi))
            wd = care.get("water_depth_cm", {})
            if isinstance(wd, dict) and wd.get("verification") in ("CONFIRMED", "LIKELY") \
               and isinstance(wd.get("value"), str) and "浅" in wd["value"]:
                if "甲長の2〜3倍" in raw:
                    mismatch(page, "水深", "浅め（care準拠）", "「甲長の2〜3倍」の深水推奨が残存")

            # RL/IUCN のラベルなし表記（ページ内にどちらのラベルも無い場合のみ）
            if re.search(r"準絶滅危惧|絶滅危惧", raw) \
               and "環境省" not in raw and "IUCN" not in raw and "レッドリスト" not in raw:
                warns.append("WARN %s: 保全表記があるが 環境省/IUCN のどちらの評価か明記なし" % page)

    # --- scientific_name.rank の一意性検査（2026-08 追加）---
    # 既存の照合には手を触れず、集合としての整合だけを見る。
    RANK_VOCAB = ("species", "subspecies", "regional_form", "variety")

    def rank_of(sp):
        """rank 未指定なら value の語数から推論する（value が一意な場合のみ有効）"""
        r = sp["scientific_name"].get("rank")
        if r:
            return r, True
        v = binomial(sp["scientific_name"].get("value") or "")
        return ("subspecies" if len(v.split()) >= 3 else "species"), False

    groups = {}
    for sp in master:
        val = sp["scientific_name"].get("value")
        if not val:
            continue
        rank, explicit = rank_of(sp)
        # E3: 語彙外の rank
        if rank not in RANK_VOCAB:
            mismatch("master:" + sp["wamei"], "rank", "/".join(RANK_VOCAB), rank)
            continue
        # W2: 学名欄に日本語の括弧が混入
        if re.search(r"[（(][^)）]*[ぁ-んァ-ヶ一-龠]", val):
            warns.append("WARN master:%s 学名欄に日本語が混入しています: %s" % (sp["wamei"], val))
        groups.setdefault(binomial(val), []).append((sp, rank, explicit))

    for val, members in sorted(groups.items()):
        if len(members) == 1:
            continue
        # W1: value が重複しているのに rank を省略しているメンバーがいる
        implicit = [sp["wamei"] for sp, _, ex in members if not ex]
        if implicit:
            warns.append("WARN 学名 %s が重複しています。rank を明示してください: %s"
                         % (val, " / ".join(implicit)))
        # E1 / E2: 重複を認めない rank が2件以上
        for kind in ("species", "subspecies"):
            same = [sp["wamei"] for sp, r, _ in members if r == kind]
            if len(same) > 1:
                mismatch("master:" + val, "学名重複",
                         "rank=%s は1件のみ" % kind, " / ".join(same))
        # E4: 同一 (value, rank) 内で slug が重複
        for kind in RANK_VOCAB:
            slugs = [sp["slug"] for sp, r, _ in members if r == kind]
            dup = sorted({x for x in slugs if slugs.count(x) > 1})
            if dup:
                mismatch("master:" + val, "slug重複",
                         "rank=%s 内で一意" % kind, " / ".join(dup))

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
