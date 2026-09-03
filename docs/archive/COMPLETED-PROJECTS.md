# 完了プロジェクト記録（アーカイブ）

> このファイルは CLAUDE.md から分離した**過去の作業記録**である。
> 恒久ルールは CLAUDE.md 側にある。ここにあるものはすべて完了済みであり、
> **NO-REWORK GATE の対象**（再監査・再判定・再探索を行わない）。
> 本文は CLAUDE.md からの移動時に一切改変していない。

---

## 生体写真監査（2026-08-22 〜 2026-08-23・完了）

### 既存写真の全数監査（2026-08-22 実施済み）

対象123枚（`assets/species-photos` 102 / `images/trust` 10 /
`assets/species/*` 10 / `images/hero` 1）を1枚ずつ目視済み。
**同じ全数監査を再実行する必要はない。** 未処理の指摘だけが下に残っている。

要差し替え（基準に抵触）:

**4件すべて差し替え済み**（PR #34 / commit e9f3b23）。旧写真（出血個体・2個体伏せ・
腹甲のみ・甲羅のみ）はリポジトリから消えており、再監査で基準抵触は0件だった。
差し替え後の写真・出典・ライセンスは下記のとおり全層で一致している。

| slug | 差し替え後の出典 | 作者 | ライセンス |
|------|------------------|------|-----------|
| `ornate-box-turtle` | iNaturalist 観察 93671651 | Catherine C. Galley | CC BY 4.0 |
| `spiny-softshell-turtle` | iNaturalist 観察 30120195 | Rachel Stringham | CC BY 4.0 |
| `scorpion-mud-turtle` | iNaturalist 観察 63998380 | Hugo Hulsberg | CC0 1.0 |
| `florida-mud-turtle` | iNaturalist 観察 60847369 | mark-groeneveld | CC BY 4.0 |

残る確認事項:

- `florida-mud-turtle` は頭部のクローズアップで、識別点（腹甲2ヒンジ）が写っていない。
  背甲が無地（bauriiの3本条線がない）ことから steindachneri と整合するが、
  「識別点が写っていること」という採用基準は満たしきれていない。構図としても
  枯れ枝が顔を横切る。基準違反ではないため差し替えは保留し、亀好きさんの判断を待つ。
- `spiny-softshell-turtle` は背側からの構図で、mutica との決め手である前縁の棘と
  鼻孔の隔壁隆起を画像上で確認できない。甲のサンドペーパー状の質感は spinifera と
  整合。同定は iNaturalist のコミュニティ同定に依拠している。

亀好きさんの判断待ち:

| slug | 理由 |
|------|------|
| `greek-tortoise` | 真上から・頭も四肢も引っ込み・硬貨をスケールに並べた計測写真 |
| `collier-snake-necked-turtle` | 砂に平たく伏せ、目は閉じて見える。人の手が覆いかぶさる構図 |
| `wood-turtle` | 背甲のみ。手に持たれており生存は分かるが状態が見えない |

現状維持と決めたもの（代替候補なし・将来改善）:

| slug | 判断と根拠 |
|------|-----------|
| `pancake-tortoise` | 岩の隙間に挟まり暗くピントも合っておらず、識別点（極端に扁平な甲・暗色放射ライン）が写っていない。だが差し替え先が存在しないため現状維持とする。iNaturalist Open Data（S3・2026-07-27版）を全走査し、Malacochersus tornieri は該当観察109件・該当写真177枚。ライセンスは CC-BY-NC 165 / CC-BY 9 / CC-BY-NC-SA 2 / CC-BY-SA 1 で、CC0 はゼロ。quality_grade=research かつ商用利用可を満たすのは1枚のみで、それが現行写真そのもの（obs 56152762 / Matt Pilkington / CC BY 4.0）だった。視覚的に優れた写真は存在するがすべて casual grade の飼育（動物園）個体。将来 research grade の商用可写真が投稿されたら差し替える |

出典URL重複の監査で判明し、対処したもの:

| slug | 内容 |
|------|------|
| `mississippi-map-turtle` | 旧写真に第三者の「© Arthur Windsor」表示が焼き込まれていた一方、サイトのクレジットは Sam Kieschnick / CC BY 4.0 / obs 35213614 で、権利根拠を確認できなかった（この観察IDは false-map-turtle と共有され、両ページの実画像は別物）。iNaturalist Open Data を走査し、taxon 39849 (Graptemys pseudogeographica kohnii, subspecies) の research grade × 商用可 × 800×600以上の候補28枚を目視比較のうえ差し替えた。新写真は photo 170209451 / Schyler Brown / CC0 1.0。眼後の三日月斑・白い虹彩・首縞が眼に達しないことをすべて確認済み。※ 撮影地はテキサス州で位置精度29km。ミシシッピ川水系の域外にあたる可能性があり、同定は形態形質と iNaturalist のコミュニティ同定に依拠している |

出典URL重複9グループの一括処理（2026-08-23）:

同一観察IDを複数ページが共有していた9グループ21ページを、実画像・MD5・
一次データ（iNaturalist Open Data 2026-07-27版）で照合した。21ページとも
クレジット4層は一致していたが、グループ内の実画像はすべて別物で、
1観察=1個体という前提が成立していなかった。

一次データで出典を証明できた2件は現状維持（KEEP）:

| slug | 根拠 |
|------|------|
| `reeves-turtle` | photo 249782015 → observer `geologyistheway` = Samuele Papeschi / CC-BY / research / Mauremys reevesii。ページ表記と全一致 |
| `red-footed-tortoise` | photo 453340456 → observer `filipeprates` / CC-BY / research / Chelonoidis carbonarius。ページ表記と全一致 |

出典を証明できず差し替えた14件（すべて research grade・商用可・800×600以上・実画像を目視）:

| slug | 新出典 | 作者 | ライセンス |
|------|--------|------|-----------|
| `brown-wood-turtle-manni` | photo 414053415 | Michelle Monge-Velazquez | CC BY 4.0 |
| `painted-wood-turtle` | photo 13510207 | Dan Riley | CC BY 4.0 |
| `cumberland-slider` | photo 364092938 | Max G.W. Verheij | CC0 1.0 |
| `red-eared-slider` | photo 6777689 | Laura Clark | CC BY 4.0 |
| `yellow-bellied-slider` | photo 66948731 | Joshua Liverman | CC BY 4.0 |
| `northern-diamondback-terrapin` | photo 505897694 | aberkov | CC BY 4.0 |
| `ornate-diamondback-terrapin` | photo 377182688 | Matthew | CC BY 4.0 |
| `chinese-softshell-turtle` | photo 504765200 | Karen Offereins | CC BY 4.0 |
| `cherry-head-tortoise` | photo 342981503 | MadMagpie | CC0 1.0 |
| `yaeyama-pond-turtle` | photo 429295308 | Stefan Curth | CC BY 4.0 |
| `yellow-pond-turtle` | photo 484479287 | 許慶棠Ray | CC BY 4.0 |
| `eastern-mud-turtle` | photo 83968654 | stephen | CC BY 4.0 |
| `mississippi-mud-turtle` | photo 129563098 | Cody Stricker | CC BY 4.0 |
| `chinese-box-turtle` | photo 66931158 | 葉子 | CC0 1.0 |

差し替えできず HOLD とした5件:

| slug | 理由 |
|------|------|
| `nicaragua-wood-turtle` | Rhinoclemmys pulcherrima incisa は research×商用可×800×600 を満たす写真が0件 |
| `carolina-diamondback-terrapin` | 候補4枚のうち規格を満たすのは1枚で、水没して識別不能 |
| ~~`canton-reeves-turtle`~~ | **解消済み**。photo 233939363 / mami_t_t / CC BY 4.0 / research / Mauremys reevesii（2022-09-30・東京都）へ差し替えた。岩上でバスキング中の健全個体で、頭部の黄条線と背甲のキールを確認。これにより出典URL重複は 1グループ → 0 になった |
| `albino-chinese-softshell` | アルビノ個体の research grade 写真が存在しない |
| `taiwan-box-turtle` | 候補2枚のみ。1枚は甲片標本＋定規、1枚は撮影者名の透かし入り |

`chinese-box-turtle` は実画像の出所が photo 96478948（brentwhite1213 / CC-BY-SA /
Cuora flavomarginata evelynae）だったのに対し、ページ表記は「祐 / CC BY 4.0 /
obs 373535988」で作者・ライセンス・観察ID・亜種のすべてが食い違っていた。

基準には触れないが別の問題:

| slug | 理由 |
|------|------|
| `albino-chinese-softshell` | 通常個体に見える。観察ID 245665 をスッポンのページと共用 |
| `european-pond-turtle` | 全身黄色のアルビノ個体で、種の代表写真として誤解を招く |
| `marginated-tortoise` / `russian-tortoise` | 交尾中の個体。禁止事項ではないが代表写真としての適否は要判断 |

差し替えが済んだ行はこの表から削除する。表が空になったら監査結果の節ごと畳んでよい。

### 生体写真監査の完了（2026-08-23・クローズ）

**生体写真の監査・差し替えプロジェクトはここで完了とする。**

- 出典URL重複: 10グループ24ページ → **0グループ**
- 画像MD5重複: 0件（全100枚）
- 権利上の危険（第三者の著作権表示）: 解消済み
- 差し替え実績: 16件（mississippi-map-turtle ＋ 一括14件 ＋ canton-reeves-turtle）
- KEEP: 2件（reeves-turtle / red-footed-tortoise。一次データで出典を証明済み）

HOLD 5件は **新しい利用可能ソースが出るまで再調査しない**:

| slug | 理由 |
|------|------|
| `nicaragua-wood-turtle` | R. p. incisa は research×商用可×800×600 を満たす写真が0件 |
| `carolina-diamondback-terrapin` | 規格を満たす候補が1枚のみで、水没して識別不能 |
| `albino-chinese-softshell` | アルビノ個体の research grade 写真が存在しない |
| `taiwan-box-turtle` | 候補2枚のみ。甲片標本＋定規 / 撮影者名の透かし入り |
| `pancake-tortoise` | research×商用可が現行写真1枚のみ（前述） |

いずれも iNaturalist Open Data の全走査で「素材が実在しない」ことを確認済み。
調査を再開する条件は、iNaturalist に新規投稿が出るか、別出典を開拓した場合のみ。

**次工程（写真プロジェクトとは分離）**: 既存10ページのクレジット表記ゆれ。
figcaption が Wikimedia Commons 由来で検証スクリプトがライセンスを拾えないもの5件
（`eastern-painted-turtle` / `mississippi-diamondback-terrapin` /
`texas-diamondback-terrapin` / `tunisian-greek-tortoise` / `western-painted-turtle`）と、
alt の和名がクレジット見出しと異なる表記のもの5件（`amazon-matamata` /
`eastern-hermann-tortoise` / `pink-bellied-side-necked-turtle` /
`west-african-mud-turtle` / `western-hermann-tortoise`）。実害は小さい。

---

## 亜種PROJECT Phase B の完了記録（2026-08-23）

Phase B 候補11件を repo 状態と照合して確定した。**再監査は不要。**

既に実装済みだったもの 5件（commit 1421bf9）:
`eastern-painted-turtle` / `western-painted-turtle` / `tunisian-greek-tortoise` /
`mississippi-diamondback-terrapin` / `texas-diamondback-terrapin`

DROP 3件 — iNaturalist taxonomy で **active=false**（廃止済みタクソン）:

| 候補 | taxon | 理由 |
|------|-------|------|
| `Cuora amboinensis amboinensis` | 39897 | active=false |
| `Cuora amboinensis couro` | 39896 | active=false |
| `Kinosternon scorpioides albogulare` | 39727 | active=false。`Kinosternon albogulare`（taxon 1642141）が独立種として active のため、亜種ではなく別種扱い。亜種PROJECTの対象外 |

IMPLEMENT 1件:

| slug | 学名 | 写真 |
|------|------|------|
| `moroccan-greek-tortoise` | Testudo graeca graeca（taxon 1629023 / subspecies / active） | photo 463181313 / Valentin Moser / CC BY 4.0 / research / モロッコ産 |

HOLD 2件 — タクソンは有効だが写真が条件を満たさない:

| 候補 | 理由 |
|------|------|
| `Testudo graeca cyrenaica` | taxon 40030 は active だが research grade 観察が世界で3件のみ。商用可の候補は1枚で代替なし。飼育情報の一次資料も乏しく、流通実態がほぼない |
| `Emydura subglobosa worrelli` | taxon 607063 は active だが候補1枚のみ。乾いた地面での頭部クローズアップで皮膚が乾燥し眼も暗く、生死・健康状態が判断しづらい。識別形質も写っていない |

HOLD 2件は **新しい利用可能ソースが出るまで再探索しない**。

---

## 亜種PROJECT Phase C の完了記録（2026-08-23）

Phase C は「以前の全件監査で C判定された亜種候補」を扱う工程だが、
**その C判定リストはリポジトリに残っていなかった**。推測で一覧を作ると漏れも混入も出るため、
一次データから候補集合を作り直した。**この候補作成と判定はやり直さない。**

候補の作り方（機械列挙）:
`data/species-master.json` の掲載86種の二名法名を鍵に、iNaturalist Open Data の
`taxa.csv.gz`（1,650,967行）を1パス走査し、カメ目（ancestry に 39532）に属する亜種を全件抽出。
149件がヒットし、そこから **active=false / 既実装29件 / Phase B 決着済み6件** を除いた
**56件**が Phase C の候補集合になった。C判定候補はこの集合の部分集合にあたる。

判定: **IMPLEMENT 5 / HOLD 3 / DROP 48**

IMPLEMENT 5件（すべて rank=subspecies・active=true。写真は research grade × 商用可 ×
800×600以上を満たし、1枚ずつ実物を目視した）:

| slug | 和名 | 学名 | 追加価値 | 写真 |
|------|------|------|---------|------|
| `midland-painted-turtle` | チュウブニシキガメ | Chrysemys picta marginata | ニシキガメ3亜種で唯一欠けていた中間亜種。腹甲 figure が「中央に収まる」識別点 | photo 365358288 / Robert Roach / CC BY 4.0 / Ontario |
| `suwannee-cooter` | スワニークーター | Pseudemys concinna suwanniensis | クーター類でもとくに大型（メス40cm級）。設備要求が親種より一段重い | photo 592142792 / Ashwin Srinivasan / CC BY 4.0 / Florida |
| `sonora-wood-turtle` | ソノラクジャクガメ | Rhinoclemmys pulcherrima rogerbarbouri | アカスジヤマガメ4亜種で最も北・最も地味。購入前に知る価値のある差 | photo 222282044 / Francisco Farriols Sarabia / CC BY 4.0 / Sinaloa |
| `guerrero-wood-turtle` | ゲレーロクジャクガメ | Rhinoclemmys pulcherrima pulcherrima | 基亜種。これで R. pulcherrima 4亜種が完備 | photo 90079125 / Jalil R. / CC BY-SA 4.0 / Guerrero |
| `mangrove-diamondback-terrapin` | マングローブダイヤモンドバックテラピン | Malaclemys terrapin rhizophorarum | SHINDAN-SPECIES.md が「その他の亜種（マングローブ等）」として未着手を明記していた1件 | photo 13445385 / Simon Tonge / CC0 1.0 / Florida |

HOLD 3件 — **新しい利用可能ソースが出るまで再探索しない**:

| 候補 | 理由 |
|------|------|
| `Malaclemys terrapin tequesta` | taxon 39837 は active で、掲載価値の判断も IMPLEMENT 相当（これが入ればテラピン7亜種が完備する）。だが採用条件を満たす写真が1観察6枚しかなく、6枚とも屋内・人の手の上の同一幼体で、亜種の識別点が写っていない。写真だけ揃えば実装できる |
| `Cuora mouhotii obsti` | taxon 115579 は active だが research grade 観察が世界で1件のみ（ベトナム北部）。採用条件を満たす写真素材が存在しない |
| `Graptemys nigrinoda delticola` | taxon 39857 は active だが research grade 観察が3件のみ。採用条件を満たす写真素材が事実上ない。国内流通も極小 |

DROP 48件の内訳（同じ理由でまとまるものは束ねた）:

| 理由 | 件数 | 例 |
|------|------|-----|
| 法規制で飼育不可・診断除外 | 4 | `Cuora flavomarginata evelynae`（天然記念物）／`Pyxis arachnoides` 3亜種（CITES I） |
| サイトの確定済み分類方針と衝突 | 2 | `Terrapene ornata` 2亜種（commit ad6bbb7 で単型種へ同期済み） |
| 基亜種で、既存の種ページと重複 | 12 | `Mauremys mutica mutica`／`Pseudemys concinna concinna` 等 |
| 亜種指定の流通・識別の実態がない | 30 | `Aldabrachelys` 4／`Apalone` 6／`Emys orbicularis` 6／`Testudo graeca` 6／`Testudo horsfieldii` 4 等 |

基亜種の扱いは次の規則で統一した:
**「同種の亜種ページが既に2枚以上あり、基亜種だけが欠けている場合にのみ基亜種ページを作る」**。
`Chrysemys picta picta`（トウブニシキガメ）が既にこの形で実装されており、
`Rhinoclemmys pulcherrima pulcherrima` を今回追加したのは同じ理由。それ以外の基亜種は
種ページと内容が重複するため DROP とした。

飼育数値は Phase B と同じく親種のレコードを継承し、master の note に継承であることを明記した。
分布はページ本文・identification とも iNaturalist の research grade 観察の実測範囲に整合する
範囲でだけ書き、断定していない。和名は既存の亜種ページと同じく英名の音写または産地にもとづく
当サイト表記で、国内で定着した和名ではないことを各ページの「まだ分かっていないこと」に明記した。

`guerrero-wood-turtle` の写真だけライセンスが **CC BY-SA 4.0**（継承条件つき）。
該当タクソンの採用可能な写真が1観察5枚しかなく、5枚とも CC BY-SA だったため。
サイトには既に CC BY-SA の写真があり前例に沿うが、把握しておくこと。

### title 重複の修正（解消済み・2026-08-24）

Phase B / C で追加したページの `<title>` と `og:title` に語の重複があり、全6件とも解消した。
**再監査しない。**

| 対象 | 誤 | 正 | 解消 |
|------|----|----|------|
| `eastern-painted-turtle` / `western-painted-turtle` / `mississippi-diamondback-terrapin` / `texas-diamondback-terrapin` | 水温・餌・設備・**餌・設備**・難易度 | 水温・餌・設備・難易度 | PR #37（merge 793f859） |
| `moroccan-greek-tortoise` / `tunisian-greek-tortoise` | 温度・餌・ケージ・**餌・設備**・難易度 | 温度・餌・ケージ・難易度 | 本コミット |

いずれも `<title>` と `og:title` の2行のみの修正で、本文・写真・学名・和名・CITES・
飼育情報・構造化データは無変更。修正後、サイト全体でこの重複パターンは0件。

---

---

## HOLD案件の外部ソース調査と写真素材の最終確定（2026-08-24）

### HOLD案件の外部ソース完全調査（2026-08-24・亀好きさん指示で実施済み）

明示指示にもとづき、HOLD 5件について iNaturalist 以外の外部ソース
（Wikimedia Commons / GBIF / ALA / OZCAM / naturepl / pbase / NASA / USFWS /
Outdoor Alabama / TFTSG / 論文 / theTurtleRoom 等を WebSearch で追跡）と
最新の分類学的有効性（TTWG / Reptile Database / USFWS / ITIS / 査読論文）を
調査した。**この外部調査を同じ範囲でやり直さない。** 結果:

| 候補 | 分類 | 写真調査の結論 | 判定 |
|------|------|---------------|------|
| `Testudo graeca cyrenaica` | 有効（TTWG西側クレード） | iNat obs f20d8af2（Arthur Gelling / CC BY / 2048×1536 / リビア・キュレネ近郊）が基準を満たすと目視確定。Wikimedia Commons も同観察の写真を採用済み | **IMPLEMENT（`libyan-greek-tortoise` として実装済み）** |
| `Emydura subglobosa worrelli` | 有効（亜種として維持。2025 bioRxiv で種昇格が再検討中だが確定変更なし） | 唯一の採用条件通過候補（photo 175567334）は**乾燥した死骸**と亀好きさんが目視確定。ALA/OZCAM は生体画像なし、naturepl は有償ストック、pbase は©個人 | HOLD |
| `Malaclemys terrapin tequesta` | 有効 | iNat は屋内・手のひら幼体の1観察のみ（S3データ7/27版から更新なし）。NASA KSC の PD 写真は発見できず。Stolen et al. 2024 (Ecology and Evolution, CC BY) は調査手法論文で生体写真の確証なし | HOLD |
| `Cuora mouhotii obsti` | 有効（Fritz et al. 1998・TTWG承認） | **合法候補を発見**: Wikimedia Commons `File:Pyxidea mouhotii obsti Male.jpg`・同 `Male ventral.jpg`（Torsten Blanck / GFDL または CC BY-SA 3.0）。ただし本実行環境からは Commons が遮断されており取得・解像度確認が不可能 | HOLD（下記Owner経路あり） |
| `Graptemys nigrinoda delticola` | 形式上有効だが Ennen et al. 2014 が診断性を否定（クリナル変異） | 公開ライセンスの写真は皆無（TFTSG=©Godwin、theTurtleRoom=©、iNat 3観察に該当なし） | HOLD |

~~**Ownerが取得すれば動く経路（obsti のみ）**~~ … **この経路は無効と確定した**。
Commons の2ファイルは実測で `Male.jpg` 500×349 / `Male ventral.jpg` 500×359 と判明し、
800×600 基準を満たさない。詳細は下記「HOLD 4件の写真素材 最終確定」を参照。
なお Blanck 本人への依頼を含む個別連絡も行わない方針が確定している。

---

## HOLD 4件の写真素材 最終確定（2026-08-24・調査クローズ）

**HOLD 4件の写真調査はここで完了とする。以後、同じ探索を繰り返さない。**

`photos.csv.gz`（19.6GB）を対象43観察のパターンで **1パス完走**し、
紐づく写真レコード90枚を全件照合。条件通過9枚は全枚を原寸取得して目視した。
以下はすべて一次データの実測値であり、推論ではない。

| 亜種 | 観察数 | 写真総数 | 商用可×800×600 | 目視 | 障害（実測） | 判定 |
|------|-------|---------|----------------|------|-------------|------|
| `Cuora mouhotii obsti` | 1 | 7 | 7（CC-BY-SA / 1536×2048 / Chris Oldnall） | 7枚 | 写真素材は存在する。だが産地20.20N は obsti の分布域（Thua Thien-Hue 16.3N〜Dak Lak 12.7N）の約400km北で、intergradation zone（Quang Tri〜Nghe An）よりさらに北＝基亜種の分布域。腹甲もほぼ無地で obsti の識別形質「放射状の黒斑」と一致しない。**亜種同定を証明できない** | HOLD |
| `Emydura subglobosa worrelli` | 19 | 34 | 3（CC-BY / 2048×1536 / Nathan Ruser） | 3枚 | 3枚すべて同一個体の**死骸**（四肢硬直・腹甲漂白・体腔空洞化）。残る31枚は CC-BY-NC で商用不可。**採用可能写真0** | HOLD |
| `Malaclemys terrapin tequesta` | 21 | 46 | 6（CC-BY / 1536×2048 / Lexi Amico） | 6枚 | 6枚すべて同一の孵化直後幼体を屋内（キッチンカウンター）で手のひらに乗せた写真。自然な姿勢ではなく、幼体のため亜種の識別形質が未発達で確認できない。残る40枚は NC 系。**採用可能写真0**。ただし**掲載価値の判断は IMPLEMENT 相当**（写真さえ揃えばテラピン7亜種が完備する） | HOLD |
| `Graptemys nigrinoda delticola` | 3 | 10 | **0**（10枚すべて CC-BY-NC） | ─ | iNaturalist 内に商用利用可能な写真が1枚も存在しない。加えて Ennen et al. 2014 が本亜種の形態的診断性を否定（クリナル変異）しており、写真が出ても掲載価値の再判断が必要 | HOLD |
