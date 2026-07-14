# 種識別データ 配布用プロンプト（各担当AIへ）

このファイルは `docs/SPECIES-ID-WORKORDER.md` の実行版です。亀好きさん が各担当AIに、下記の該当セクションをコピペして渡します。
Claude が既に2属（Graptemys 7種・Kinosternon 11種）を `data/species-identification.json` に confirmed で入れています。**それを見本として同じ品質・同じスキーマで書いてください。**

---

## 全担当への共通ルール（必読）

1. **1ソース禁止**。最低3系統（①日英Wikipedia/Reptile Database/Animal Diversity Web ②IUCN/CITESの一次情報 ③飼育・流通記事）を確認し、`sources` にURLを残す。
2. **CITESは一次で確認**。「掲載」と書く前に CITES Appendices / チェックリストで実掲載を確認（附属書番号 or 未掲載）。掲載していないのに掲載と書くのは重大な誤り。
3. **学名は三名法・亜種まで**。slug・和名・学名の三者が一致するか必ず確認（隣の種からのコピペ貼り替え忘れ事故に注意）。
4. **混同種は相互一貫**。種Aに種Bを書いたら区別点は種Bの記述と矛盾させない。
5. **photo_hantei は「写真に何が写っていれば同定できるか」**（例:「首下面の黒帯が見えるカット必須」）。
6. **分からない種こそ徹底的に洗い出す（逃げ禁止）**。空欄で誤魔化さず、決着しない点は `unresolved` に「何が・どのソース間で・なぜ不明か」を具体的に書く。原記載・分類改訂（種の分割/統合）・標本写真まで当たる。
7. 提出は `status:"draft"`、自分の担当ファイル `data/_id-draft-<担当名>.json`（スキーマ配列）で。confirmed は Claude 検収後のみ。

スキーマと見本は `data/species-identification.json`（Graptemys/Kinosternon の26種）を必ず開いて真似ること。

---

## 担当A（ハコガメ類 Cuora — 7種）★難所：亜種取り違え多発
対象slug: chinese-box-turtle(Cuora flavomarginata), taiwan-box-turtle(C. flavomarginata evelynae), indochinese-box-turtle(C. galbinifrons), three-striped-box-turtle(C. trifasciata), malayan-box-turtle(C. amboinensis), hirase-turtle(C. mouhotii), ornate-cuora(C. ornata)

注意点:
- **CITESが厳格**。Cuora属の多くは附属書II、trifasciata(ミスジハコガメ)は特に厳格（CoP19以降の扱い・附属書I相当の議論）。必ず一次確認。
- chinese-box(flavomarginata) と taiwan-box(flavomarginata evelynae) は**同種の亜種**。区別点を相互一貫で。
- ornate-cuora(C. ornata) は近年 C. galbinifrons から分割された種。分類経緯を `unresolved`/`houkisei` に。
- 識別軸: 甲のヒンジ・頭部斑紋・背甲の色帯。

## 担当B（イシガメ類 Mauremys — 6種）★難所：重複ページ問題あり
対象slug: reeves-turtle(Mauremys reevesii), canton-reeves-turtle(M. reevesii 広東型), japanese-pond-turtle(M. japonica), yellow-pond-turtle(M. mutica), yaeyama-pond-turtle(M. mutica kami), chinese-stripe-necked-turtle(M. sinensis)

注意点:
- **reeves と canton-reeves は同一学名 M. reevesii**。canton-reeves は「広東型」系統で分類上は同種。両ページの差別化 or 統合可否を `unresolved` に所見を書く（最終判断はClaude/亀好きさん）。
- yellow-pond(M. mutica) と yaeyama-pond(M. mutica kami) は種と亜種。相互一貫で。
- **CITES III の記載漏れに注意**：M. reevesii・M. sinensis は CITES 附属書III掲載（要一次確認）。japonica(ニホンイシガメ)は非CITESだが国内で保全上重要。
- 交雑（japonica × reevesii 等）にも触れる。

## 担当C（北米ハコガメ Terrapene + スライダー/クーター Trachemys/Pseudemys — 12種）
Terrapene(5): eastern-box-turtle(T. carolina carolina), gulf-coast-box-turtle(T. c. major), three-toed は済, florida-box-turtle(T. bauri), desert-box-turtle(T. ornata luteola), ornate-box-turtle(T. ornata ornata)
Trachemys(3): red-eared-slider(T. scripta elegans), yellow-bellied-slider(T. s. scripta), cumberland-slider(T. s. troostii)
Pseudemys(4): river-cooter(P. concinna), peninsula-cooter(P. peninsularis), florida-red-bellied-turtle(P. nelsoni), rio-grande-cooter(P. gorzugi)

注意点:
- Terrapene carolina の亜種群(carolina/major/bauri/triunguis済)は**後肢の指数・甲模様・分布**で相互一貫に区別。ornata群(ornata/luteola)は別種系統。
- Trachemys scripta 3亜種は**眼後斑の形・色**（elegans=赤い帯、scripta=黄の縦斑、troostii=細い縦条）で区別。相互一貫で。
- Pseudemys は腹甲模様・頬の矢印模様(nelsoni)で区別。
- **CoP2025でPseudemys各種・painted turtleがCITES附属書II編入提案中**（要一次確認、`unresolved`に）。

## 担当D（リクガメ類 Testudo/Chelonoidis/Kinixys/Indotestudo/Manouria他 — 約15種）
Testudo(4): greek-tortoise(T. graeca), iberian-greek-tortoise(T. graeca ibera), marginated-tortoise(T. marginata), russian-tortoise(T. horsfieldii) ※hermann済
Chelonoidis(3): red-footed-tortoise(C. carbonarius), cherry-head-tortoise(C. carbonarius 色型), chaco-tortoise(C. chilensis)
Kinixys(2): bell-hinge-back-tortoise(K. belliana), home-hinge-back-tortoise(K. homeana)
単独: elongated-tortoise(Indotestudo elongata), impressed-tortoise(Manouria impressa), aldabra-tortoise(Aldabrachelys gigantea), sulcata-tortoise(Centrochelys sulcata), leopard-tortoise(Stigmochelys pardalis), pancake-tortoise(Malacochersus tornieri), bowsprit-tortoise(Chersina angulata)

注意点:
- **CITES最重要グループ**。多くが附属書II、一部（Kinixys homeana=CoP2025でII→I提案、Indotestudo・Manouria等）は要一次確認。Astrochelys等は附属書I。
- red-footed(carbonarius) と cherry-head(carbonarius色型)は**同学名の色型**。別種ではない旨を相互一貫で（マタマタのHigh Red型と同じ扱い）。
- greek(graeca) と iberian-greek(graeca ibera)は種と亜種。hermann済との識別（尾端スパー vs 大腿結節）も。
- 識別軸: 甲のスパー位置・セオレガメ(Kinixys)は後部甲のヒンジ。

## 担当E（ナガクビ/曲頸/スッポン/ヤマガメ/イシガメ他 — 残り全部 約22種）
Chelodina/Macrochelodina(4): eastern-long-necked(C. longicollis), collier-snake-necked(C. colliei), mccords-snake-necked(C. mccordi), siebenrocks-snake-necked(Macrochelodina rugosa)
Malaclemys(3): northern-diamondback(M. terrapin terrapin), carolina-diamondback(M. t. centrata), ornate-diamondback(M. t. macrospilota)
Rhinoclemmys(4): painted-wood(R. pulcherrima), brown-wood-manni(R. p. manni), nicaragua-wood(R. p. incisa), annulated-wood(R. annulata)
Apalone/Pelodiscus(5): florida-softshell(A. ferox), smooth-softshell(A. mutica), spiny-softshell(A. spinifera), chinese-softshell(Pelodiscus sinensis), albino-chinese-softshell(P. sinensis アルビノ)
Sternotherus(2): musk-turtle(S. odoratus), stripe-necked-musk-turtle(S. minor peltifer) ※loggerhead/razorback済
単独: african-helmeted(Pelomedusa subrufa), west-african-mud(Pelusios castaneus), asian-black-marsh(Siebenrockiella crassicollis), asian-leaf(Cyclemys dentata), blandings(Emydoidea blandingii), european-pond(Emys orbicularis), hilaire-side-necked(Phrynops hilarii), pink-bellied-side-necked済, spenglers-leaf済, spotted(Clemmys guttata), wood(Glyptemys insculpta), pig-nosed(Carettochelys insculpta)

注意点:
- **mccords-snake-necked(C. mccordi)は附属書I（CITES最厳格）**。siebenrocks(Macrochelodina rugosa)は学名の属変更(Chelodina rugosaとも)に注意。
- Malaclemys terrapin 3亜種は甲の同心円模様・皮膚色で相互一貫に区別。
- Rhinoclemmys pulcherrima の3亜種(pulcherrima/manni/incisa)は**頭部の赤条・甲模様**で区別。painted-wood済のマタマタ監査で確認済み。
- albino-chinese-softshell(P. sinensis アルビノ)は色素変異で別種でない。
- **CoP2025でblandings/spotted/painted等がII→I提案**、多数の北米種がII編入提案中（要一次確認、`unresolved`に）。
- stripe-necked-musk(S. minor peltifer)は2017年に独立種S. peltiferに格上げの経緯を記録（loggerhead済と相互一貫）。

---

## 検収フロー（Claude）
各担当が `data/_id-draft-<担当名>.json` を提出 → Claude が共通ルール1〜6を照合 → CITES等を一次で再確認 → unresolvedをClaudeが追加調査で決着 → status:confirmed にして本番 `species-identification.json` にマージ・push。
不備は「どのRに反したか」を明示して差し戻し。

## 進め方
各担当まず2〜3種で草案 → Claude検収でフォーマット・品質OKを確認 → 残りを展開。難種は放置せず掘り切る。
