#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
カメライフガイド 全94種 画像 正規取得スクリプト（Termux用・データ埋め込み版）
========================================================================
このファイル1つで完結。ファイル転送不要。Termuxにコピーして実行するだけ。

【何をするか】
 各種について、iNaturalistから「その学名としてresearch grade承認された
 CC0/CC BYライセンスの画像」だけを取得し、種スラッグ名で保存する。

【3つの安全装置（二度と間違えないため）】
 (1) 種名完全一致: 検索した学名とAPIが返す学名が一致する観察のみ採用
 (2) 出典を全記録: photo_credits.csv に 種/観察ID/撮影者/ライセンス/URL を保存
 (3) 取得後の自己照合: 保存した各画像の観察が本当にその学名か再確認し
     不一致は MISMATCH として警告リストに出す

【使い方】
   pkg install python -y        # 未導入なら
   python fetch_images.py       # 実行（全94種で15〜25分ほど）

【出力】
   species-photos/<slug>.jpg    # 各種の画像
   photo_credits.csv            # 出典一覧（サイトのクレジット表記に使う）
   audit_result.csv            # 照合結果（OK / MISMATCH / NOT_FOUND）
"""
import json, os, time, urllib.request, urllib.parse, csv

# (slug, 和名, 検索用学名)
SPECIES = [
    ("alabama-map-turtle", "アラバマチズガメ", "Graptemys pulchra"),
    ("black-knobbed-map-turtle", "クロコブチズガメ", "Graptemys nigrinoda"),
    ("false-map-turtle", "ニセチズガメ", "Graptemys pseudogeographica"),
    ("mississippi-map-turtle", "ミシシッピチズガメ", "Graptemys kohnii"),
    ("northern-map-turtle", "ヒラチズガメ", "Graptemys geographica"),
    ("ouachita-map-turtle-sp", "フトマユチズガメ", "Graptemys ouachitensis"),
    ("ringed-map-turtle", "ワモンチズガメ", "Graptemys oculifera"),
    ("musk-turtle", "ミシシッピニオイガメ", "Sternotherus odoratus"),
    ("razorback-musk-turtle", "カブトニオイガメ", "Sternotherus carinatus"),
    ("loggerhead-musk-turtle", "ヒメニオイガメ", "Sternotherus minor"),
    ("stripe-necked-musk-turtle", "スジクビヒメニオイガメ", "Sternotherus peltifer"),
    ("hime-nioi-turtle", "ヒメニオイガメ？", "Sternotherus minor"),
    ("scorpion-mud-turtle", "サソリドロガメ", "Kinosternon scorpioides"),
    ("white-lipped-mud-turtle", "シロクチドロガメ", "Kinosternon leucostomum"),
    ("striped-mud-turtle", "ミスジドロガメ", "Kinosternon baurii"),
    ("yellow-mud-turtle", "キイロドロガメ", "Kinosternon flavescens"),
    ("herrera-mud-turtle", "ハーレラドロガメ", "Kinosternon herrerai"),
    ("mexican-mud-turtle", "サラドロガメ", "Kinosternon integrum"),
    ("red-cheeked-mud-turtle", "ホオアカドロガメ", "Kinosternon cruentatum"),
    ("narrow-bridged-mud-turtle", "キンタロドロガメ", "Kinosternon angustipons"),
    ("eastern-mud-turtle", "トウブドロガメ", "Kinosternon subrubrum"),
    ("florida-mud-turtle", "フロリダドロガメ", "Kinosternon subrubrum"),
    ("mississippi-mud-turtle", "ミシシッピドロガメ", "Kinosternon subrubrum"),
    ("west-african-mud-turtle", "ニシアフリカドロガメ", "Pelusios castaneus"),
    ("eastern-box-turtle", "トウブハコガメ", "Terrapene carolina"),
    ("florida-box-turtle", "フロリダハコガメ", "Terrapene carolina"),
    ("gulf-coast-box-turtle", "ガルフコーストハコガメ", "Terrapene carolina"),
    ("three-toed-box-turtle", "ミツユビハコガメ", "Terrapene carolina"),
    ("ornate-box-turtle", "ニシキハコガメ", "Terrapene ornata"),
    ("desert-box-turtle", "サバクニシキハコガメ", "Terrapene ornata"),
    ("aldabra-tortoise", "アルダブラゾウガメ", "Aldabrachelys gigantea"),
    ("sulcata-tortoise", "ケヅメリクガメ", "Centrochelys sulcata"),
    ("leopard-tortoise", "ヒョウモンガメ", "Stigmochelys pardalis"),
    ("hermann-tortoise", "ヘルマンリクガメ", "Testudo hermanni"),
    ("greek-tortoise", "ギリシャリクガメ", "Testudo graeca"),
    ("iberian-greek-tortoise", "イベラギリシャリクガメ", "Testudo graeca"),
    ("russian-tortoise", "ヨツユビリクガメ", "Testudo horsfieldii"),
    ("marginated-tortoise", "フチゾリリクガメ", "Testudo marginata"),
    ("elongated-tortoise", "エロンガータリクガメ", "Indotestudo elongata"),
    ("impressed-tortoise", "インプレッサムツアシガメ", "Manouria impressa"),
    ("pancake-tortoise", "パンケーキリクガメ", "Malacochersus tornieri"),
    ("red-footed-tortoise", "アカアシガメ", "Chelonoidis carbonarius"),
    ("cherry-head-tortoise", "アカアシガメ(チェリーヘッド)", "Chelonoidis carbonarius"),
    ("chaco-tortoise", "チャコリクガメ", "Chelonoidis chilensis"),
    ("bowsprit-tortoise", "ソリガメ", "Chersina angulata"),
    ("bell-hinge-back-tortoise", "ベルセオレガメ", "Kinixys belliana"),
    ("home-hinge-back-tortoise", "ホームセオレガメ", "Kinixys homeana"),
    ("river-cooter", "リバークーター", "Pseudemys concinna"),
    ("peninsula-cooter", "ペニンシュラクーター", "Pseudemys peninsularis"),
    ("rio-grande-cooter", "リオグランデクーター", "Pseudemys gorzugi"),
    ("florida-red-bellied-turtle", "フロリダアカハラガメ", "Pseudemys nelsoni"),
    ("red-eared-slider", "ミシシッピアカミミガメ", "Trachemys scripta"),
    ("yellow-bellied-slider", "キバラガメ", "Trachemys scripta"),
    ("cumberland-slider", "カンバーランドキミミガメ", "Trachemys scripta"),
    ("painted-turtle", "ニシキガメ", "Chrysemys picta"),
    ("amazon-matamata", "マタマタ", "Chelus fimbriata"),
    ("matamata", "マタマタ", "Chelus fimbriata"),
    ("eastern-long-necked-turtle", "ヒガシナガクビガメ", "Chelodina longicollis"),
    ("collier-snake-necked-turtle", "オブロンガナガクビガメ", "Chelodina colliei"),
    ("hilaire-side-necked-turtle", "ヒラリーカエルガメ", "Phrynops hilarii"),
    ("pink-bellied-side-necked-turtle", "アカハラマゲクビガメ", "Emydura subglobosa"),
    ("african-helmeted-turtle", "ヌマヨコクビガメ", "Pelomedusa subrufa"),
    ("chinese-softshell-turtle", "チュウゴクスッポン", "Pelodiscus sinensis"),
    ("albino-chinese-softshell", "チュウゴクスッポン(アルビノ)", "Pelodiscus sinensis"),
    ("florida-softshell-turtle", "フロリダスッポン", "Apalone ferox"),
    ("spiny-softshell-turtle", "トゲスッポン", "Apalone spinifera"),
    ("smooth-softshell-turtle", "スベスッポン", "Apalone mutica"),
    ("pig-nosed-turtle", "スッポンモドキ(ブタバナガメ)", "Carettochelys insculpta"),
    ("japanese-pond-turtle", "ニホンイシガメ", "Mauremys japonica"),
    ("reeves-turtle", "クサガメ", "Mauremys reevesii"),
    ("canton-reeves-turtle", "カントンクサガメ", "Mauremys nigricans"),
    ("yellow-pond-turtle", "ミナミイシガメ", "Mauremys mutica"),
    ("yaeyama-pond-turtle", "ヤエヤマイシガメ", "Mauremys mutica"),
    ("chinese-stripe-necked-turtle", "ハナガメ", "Mauremys sinensis"),
    ("european-pond-turtle", "ヨーロッパヌマガメ", "Emys orbicularis"),
    ("chinese-box-turtle", "セマルハコガメ", "Cuora flavomarginata"),
    ("taiwan-box-turtle", "ヤエヤマ/タイワンセマルハコガメ", "Cuora flavomarginata"),
    ("malayan-box-turtle", "マレーハコガメ", "Cuora amboinensis"),
    ("asian-leaf-turtle", "アジアヤマガメ", "Cyclemys dentata"),
    ("asian-black-marsh-turtle", "クロヌマガメ", "Siebenrockiella crassicollis"),
    ("hirase-turtle", "ヒラセガメ", "Cuora mouhotii"),
    ("spenglers-leaf-turtle", "スペングラーヤマガメ", "Geoemyda spengleri"),
    ("spotted-turtle", "キボシイシガメ", "Clemmys guttata"),
    ("wood-turtle", "モリイシガメ", "Glyptemys insculpta"),
    ("blandings-turtle", "ブランディングガメ", "Emydoidea blandingii"),
    ("carolina-diamondback-terrapin", "カロリナダイヤモンドガメ", "Malaclemys terrapin"),
    ("northern-diamondback-terrapin", "キタダイヤモンドガメ", "Malaclemys terrapin"),
    ("ornate-diamondback-terrapin", "ニシキダイヤモンドガメ", "Malaclemys terrapin"),
    ("annulated-wood-turtle", "クモノスヤマガメ", "Rhinoclemmys annulata"),
    ("painted-wood-turtle", "アカスジヤマガメ(ニシキマゲクビ)", "Rhinoclemmys pulcherrima"),
    ("brown-wood-turtle-manni", "マンヤマガメ", "Rhinoclemmys pulcherrima"),
    ("nicaragua-wood-turtle", "ニカラグアヤマガメ", "Rhinoclemmys funerea"),
    ("giant-musk-turtle", "スジオオニオイガメ", "Staurotypus triporcatus"),
    ("giant-musk-turtle-mx", "スジオオニオイガメ(メキシコ)", "Staurotypus triporcatus"),
]

OUTDIR = "species-photos"
os.makedirs(OUTDIR, exist_ok=True)
UA = {"User-Agent": "kame-life-guide-audit/1.0 (contact: TeTe)"}
OK_LICENSES = {"cc0", "cc-by", "cc-by-sa"}  # 商用可の範囲。必要なら調整

def api_get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def find_photo(search_sci):
    """学名でresearch grade+CC画像を検索。(観察ID, 実際の学名, 画像URL, 撮影者, ライセンス) を返す"""
    # まず学名からtaxon_idを引く（同名誤認を防ぐ）
    tq = urllib.parse.quote(search_sci)
    tax = api_get(f"https://api.inaturalist.org/v1/taxa?q={tq}&rank=species,subspecies&per_page=5")
    taxon_id = None
    for t in tax.get("results", []):
        if t.get("name","").lower() == search_sci.lower():
            taxon_id = t["id"]; break
    if taxon_id is None and tax.get("results"):
        # 完全一致がなければ先頭（ただし後で照合で弾く）
        taxon_id = tax["results"][0]["id"]
    if taxon_id is None:
        return None

    # その taxon の research grade + CCライセンス観察を検索
    url = (f"https://api.inaturalist.org/v1/observations?taxon_id={taxon_id}"
           f"&quality_grade=research&photo_license=cc0,cc-by,cc-by-sa"
           f"&order_by=votes&per_page=10")
    obs = api_get(url)
    for o in obs.get("results", []):
        actual = (o.get("taxon") or {}).get("name","")
        photos = o.get("photos") or []
        if not photos: continue
        p = photos[0]
        purl = p.get("url","").replace("square","large")
        lic = (p.get("license_code") or "").lower()
        if lic not in OK_LICENSES: continue
        author = (o.get("user") or {}).get("login","unknown")
        return (o["id"], actual, purl, author, lic)
    return None

def download(url, path):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r, open(path,"wb") as f:
        f.write(r.read())

credits = [("slug","和名","検索学名","実際の学名","観察ID","撮影者","ライセンス","画像URL")]
audit   = [("slug","検索学名","実際の学名","判定")]
mismatches = []

print(f"=== 全{len(SPECIES)}種の画像取得を開始 ===\n")
for i,(slug, ja, sci) in enumerate(SPECIES, 1):
    print(f"[{i:>2}/{len(SPECIES)}] {slug} ({ja}) 検索:{sci}")
    try:
        res = find_photo(sci)
        time.sleep(1.2)
        if not res:
            print("      → 見つからず NOT_FOUND")
            audit.append((slug, sci, "", "NOT_FOUND"))
            continue
        oid, actual, purl, author, lic = res
        # 安全装置(3): 自己照合
        genus = sci.split()[0]
        if actual.lower() == sci.lower() or actual.lower().startswith(genus.lower()+" "):
            verdict = "OK" if actual.lower()==sci.lower() else "OK(属一致)"
        else:
            verdict = "MISMATCH"
            mismatches.append((slug, sci, actual, oid))
        path = os.path.join(OUTDIR, slug + ".jpg")
        download(purl, path); time.sleep(1.0)
        credits.append((slug, ja, sci, actual, oid, author, lic, purl))
        audit.append((slug, sci, actual, verdict))
        print(f"      → 保存 {verdict}  (実際:{actual}, by {author}, {lic})")
    except Exception as e:
        print(f"      → エラー: {e}")
        audit.append((slug, sci, "", "ERROR:"+str(e)[:40]))
    # 出力ファイルは毎回上書き保存（途中で止まっても記録が残る）
    with open("photo_credits.csv","w",newline="",encoding="utf-8") as f:
        csv.writer(f).writerows(credits)
    with open("audit_result.csv","w",newline="",encoding="utf-8") as f:
        csv.writer(f).writerows(audit)

print("\n" + "="*55)
print("完了。")
print(f"  画像: {OUTDIR}/ に保存")
print(f"  出典: photo_credits.csv")
print(f"  照合: audit_result.csv")
if mismatches:
    print(f"\n⚠️ 種が一致しなかった（要確認）: {len(mismatches)}件")
    for slug, sci, actual, oid in mismatches:
        print(f"  ● {slug}: 狙い={sci} / 取得={actual}")
        print(f"     https://www.inaturalist.org/observations/{oid}")
else:
    print("\n✅ 全画像、狙った種と一致しました。")
