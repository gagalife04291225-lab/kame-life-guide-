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

---

## docs/AI-HANDOFF.md から分離した完了記録（2026-09-03）

> `docs/AI-HANDOFF.md` の COMPLETED 節が797行に肥大し、同ファイルの更新ルール
> 「現在状態だけを書く」に反していたため分離した。**本文は一切改変していない。**
> ここにあるものはすべて完了済みで、**固定入力・再調査禁止**（NO-REWORK GATE の対象）。

### Species Scores Phase 1A — 既存スコア基盤の安全化（2026-08-30 / 本PR）

Phase 0（READ ONLY・**判定C**）で確定した既知の危険だけを除去した。
**119種への拡張・6軸再設計・既存20件の再採点は一切していない。**

- **legacy 2件を隔離。** `data/species_scores.json` の `reimanns-side-neck` と
  `yellow-spotted-river-turtle` に `ranking_eligible: false` ＋ `quarantine_reason` を付与。
  **レコードは削除していない**（GA/履歴互換を保持）。評価値10軸は**差分0**
- **`has_page:false` を自動隔離条件にはしなかった。** `has_page` は掲載上の事実で
  スコアの妥当性とは別の軸。自動条件にすると両方向で誤る
- **`js/ranking-engine.js`**: `isQuarantined()` を追加し、`getTopByType` は `formula.filter`
  より**前**に隔離レコードを除外。`calculateScore` は隔離レコードで throw
- **type10 long_life を封鎖。** `unavailable: true` ＋ `weights: {}`。
  friendliness を寿命の代理に使う旧式を撤去し、`assertUsable()` が
  unavailable／weights空の type を必ず throw させる。**0点代入で計算できるように見せていない**
- **type0 の式・他typeの式・friendliness の値は無変更**
- QA に Check 13〜18 を追加（隔離フラグ / 全typeからの不在 / 61.90 の再生成不可 /
  type10 の失敗 / 利用可能11type / type0 重み不変）

**確定した事実（再調査しない）:**

- **61.90 の出所はキメラレコード `reimanns-side-neck`。** slug・species_name_ja は
  ライマンヘビクビガメだが、評価値と notes はヒメハコヨコクビガメ由来。
  **どちらの種の正解データにもならない。120値を修正・転用してはならない**
- **`ranking-engine.js` を読み込む HTML は0ページ**（現在も過去も）。公開ランキングは静的HTML。
  エンジンの出力変化は公開物に波及しない
- QA Check 6 は `species_page_url` に文字列を必須としており、PR #118/#123 で正当に null に
  した2件で **BASE 時点から exit 1** になっていた。null を許容するよう修正済み
- 実測: ranking QA **18/18 PASS** / validator MISMATCH 0・WARN 0・`--strict` exit 0 /
  `test_validate_species.py` 10 PASS / 公開HTML・ranking HTML・species-master 差分0 /
  楽天 available 36・search 65・pending 3 / Amazon 77本

### 公開データ整合・事実性の連続CLOSE（2026-08-29〜30 / PR #115〜#123）

`AI-HANDOFF.md` の同期が PR #114 で止まっていたため、以下をまとめて COMPLETED に記録する。

| PR | merge | 内容と確定した結論 |
|----|-------|------------------|
| #115 | `cd06642` | `ranking-beginner-top10.html` 10位カードのレイヤ不整合を1種へ統一（学名 `Elseya schultzei` → `Pelusios nanus`、GA識別子 `reimanns-side-neck` → `west-african-mud-turtle`）。9位の species.js 不在は**推測でデータを作らず**現状維持 |
| #116 | `1daefcb` | 10位の水槽サイズ 30cm → **60cm**。Owner 指摘「終生飼育で30cmは小さい」。自サイトの種ページが 60cm〜 と記載しており、45cm ではなく**自サイトの canonical に合わせた** |
| #117 | `c00189d` | 10位 Cons を「泳ぎが苦手で水深13〜15cmと逃げ場が必須・入手はイベント中心」へ是正 |
| #118 | `dbb4646` | モンキヨコクビガメの slug 二重化を解消。master は **113/113 で slug == ページのファイル名**という規則が成立していることを実測。GA履歴を壊さない範囲で統一し、`podocnemis-unifilis` は `page: null` と確定。あわせて guides 4ページのアフィリエイトリンク **rel 未付与12本**を付与（href・商品・表示文言・ID は無変更） |
| #119 | `5317a18` | `tools/validate_species.py` の TypeError を最小修正。**原因は `r["cites"]` ではなく `cites_label()` が返す `None`** だった。null を「CITES未掲載」等へ**意味変換していない**。WARN として可視化する。回帰テスト `tools/test_validate_species.py` を新設（10 PASS） |
| #120 | `40040b7` | 10位の**裏づけの無い公開数値を撤去**。score `61.90 / 100` → 表示削除、初期費用 `¥25,000〜` → `未算出`。**根拠のない価格を新しく推測していない** |
| #121 | `68a79c2` | チュウブニシキガメ・スワニークーターの CITES を **`not_listed` / CONFIRMED** で確定（Owner 提供の一次資料を固定入力として使用。egress 再試行はしていない） |
| #122 | `0d9f962` | `SHINDAN-SPECIES.md` に Phase B/C 亜種8件を独立行として追加。**推測値で埋めず**、親種の値を無条件コピーもしていない。validator WARN の抑制・除外もしていない |
| #123 | `640791d` | 汽水ガメの表記重複を解消（独立行になったマングローブを「その他」に重複させない）＋ `species_scores.json` の `species_page_url` 不整合4件を是正。**slug・GA識別子・score・6軸評価値は無変更。URLだけを是正** |

### RAKUTEN-ID Phase 5 — 型番検索の発火条件拡張（2026-08-29 / PR #114 / merge `e8bf58b`）

Phase 4 では型番単独クエリが「主検索0件」のときしか撃たれず、それが理由で救えていなかった
2件を回収した。**available 34 → 36。**

- **発火条件を2つ追加**（いずれも `rakutenModelNo` 宣言商品に限定・1商品につき最大1回）:
  ① 主検索が**非致命エラー**（BAD_RESPONSE / API_ERROR / NETWORK / 5xx retry 使い切り）で落ちた場合。
  **AUTH / RATE_LIMIT は従来どおり同期全体を中断**する（この2つは到達しない）。
  ② 主検索の候補が **AMBIGUOUS / REJECT にしかならない**場合。型番側で EXACT/STRONG を
  特定できたときだけ候補集合を差し替え、それ以外は Phase 4 までと完全に同一挙動
- 昇格条件は**不変**（allowlist ＋ EXACT/STRONG ＋ scoreCandidate ＋ 成果対象 affiliateUrl）。
  `CONFIDENCE_THRESHOLD` 8.0 と identity 定義は無変更。**型番一致だけでは昇格しない**
- PROMOTE_ALLOWLIST 30→31（`basking_100w`。Owner が Phase 5 の対象として明示指定）

**実昇格2件**（dry-run 33277758200 → 本適用 33277932962 / commit 36457ec）:

| ID | 判定 | 決め手 | 出品 |
|----|------|--------|------|
| `basking_100w` | EXACT / qual 4.9 | `rakutenModelNo: 'PT2138'` の宣言だけで**主検索の候補が AMBIGUOUS → EXACT に確定**。型番クエリは不要だった | GEX サングロー タイトビーム バスキングスポットランプ 100W PT2138 / プロツールショップヤブモト ¥2,280 |
| `shelter_small` | EXACT / qual 7.7 | 主検索が **API_ERROR** → 新設の①経路が型番 `RX-191` で回復 | ロックシェルターSP S RX-191 スドー / 爬虫類用品店 トップクリエイト ¥760 |

**昇格しなかったものと実測理由:**

| ID | 結果 | 理由 |
|----|------|------|
| `heater_aqua_100w` | 未昇格（search 維持） | 新設の②経路は正しく発火したが、**型番クエリ "SH55" の10件は「今治タオル 今治謹製至福タオル SH55030」等の無関係商品**だった。identity gate が AMBIGUOUS を返して差し替えを拒否し、誤リンクは発生していない。**SH55 の宣言は撤回済み**（commit a50eb1f） |
| `food_tortoise_staple` | 未昇格 | 本適用時に候補を確保できず（dry-run では STRONG qual 6.3 に到達）。Phase 2・3・4 と合わせ**4回連続**で本適用時だけ落ちる |
| `substrate_cypress` | 未昇格 | Phase 4 で PT2752 が使えないと確定済み。型番ルートなし |

**確定した事実（再調査しない）:**

- **`SH55` は楽天の検索キーとして機能しない。** 第2次救出調査の「SH55 → 67件」は
  PT2752 と同じく**件数だけを見た誤判定**だった。Phase 4 の教訓
  「候補件数だけで型番ルートの有効性を判定してはならない」が再確認された
- **`PT2138` は自サイト商品と同一SKU。** GEX公式製品DB「サングロータイトビームバスキング
  スポットランプ100W PT2138」と商品名・W数が一致。同シリーズ75W(PT2136)は watt 競合で REJECT、
  「PT2138用」アクセサリは適合表記で REJECT されることを fixture で確認済み
- **型番宣言が価値を持つのは2通り**: ①型番クエリが正商品を引く（RX-191）
  ②宣言そのものが identity の根拠になり主検索の候補を EXACT へ引き上げる（PT2138）。
  ②は追加のAPI呼び出しすら不要で、**①より確実**
- available **36** / search 65 / pending 3。available 36件すべて成果対象URL。
  既存 available の降格0。Amazon差分0（affiliateUrl / asin 行の変更0）。誤商品0

### RAKUTEN-ID Phase 4 — 型番ルートの追加と B確定5件の処理（2026-08-29 / PR #113 / merge `8c7cdca`）

第2次救出調査（READ-ONLY・確定済み）の B確定5件＋承認済み food_tortoise_staple を処理した。

- **`rakutenModelNo` を導入**。0件時の代替クエリ1本目に「型番単独」を置く。総本数の上限2本は据え置き。
  適用経路(main)へも配線したが**型番を宣言した商品に限定**したため、他101商品の代替クエリ・identity は
  旧実装と1件も差分なし（機械照合で確認）
- CATEGORY_GUARDS 最小追加: `enclosure` に パンテオン/テラリウム、`substrate` に デザートベース
- PROMOTE_ALLOWLIST 25→30（Owner承認のB確定5件）

**実昇格2件**（run 33276960299 / commit 0ec4e46）:

| ID | 判定 | 決め手 | 出品 |
|----|------|--------|------|
| `enclosure_kayuso_90` | EXACT / qual 6.6 | ガード語彙「パンテオン」追加 | 三晃商会 パンテオン ブラック BK9045 E15 / ネオス ¥26,750 |
| `substrate_grassland_mix` | STRONG / qual 5.9 | ガード語彙「デザートベース」追加 | エキゾテラ デザートベース 細目 3L / アルメリア ¥1,994 |

**昇格しなかった4件と実測理由（推測ではなく実行ログ）:**

| ID | 結果 | 理由 |
|----|------|------|
| `substrate_cypress` | 未昇格 | **PT2752 は楽天の検索キーとして機能しない**。型番クエリの結果は「【中古】廣瀬裕子のしあわせになるDVD」等の無関係商品で、identity gate が AMBIGUOUS で正しく阻止。宣言を撤回済み（第2次調査の「PT2752→5件＝有効」は件数のみを見た誤判定で、本Phaseで訂正） |
| `heater_aqua_100w` | 未昇格 | 主クエリ「水中ヒーター 100W 亀 水槽」が4件返すため**0件フォールバックに到達しない**。→ Phase 5 で②経路を追加して到達させた結果、**SH55 自体が使えない**と判明（Phase 5 参照） |
| `shelter_small` | 未昇格 | 本適用時に主クエリが **API_ERROR**。main() の非致命エラー処理はその商品をスキップするため型番フォールバックに到達しなかった。→ **Phase 5 の①経路で解消・昇格済み** |
| `food_tortoise_staple` | 未昇格 | 本適用時に **NO_RESULT**（Phase 2・3・4 と3回連続。dry-run では毎回 STRONG に到達するため時間帯による在庫変動とみられる） |

**確定した事実（再調査しない）:**

- **型番検索の成否は「楽天の出店者が商品名に型番を併記するか」で決まる。** 件数がヒットしても
  正商品とは限らない（PT2752 が実例）。**候補件数だけで型番ルートの有効性を判定してはならない。**
- 実際に正商品へ到達した型番は **RX-191 のみ**（dry-run 実測）。
  ※ Phase 5 で **PT2138 が2例目**として追加された（ただし型番クエリ経由ではなく
  identity の根拠としての採用）。
- Phase 4 終了時点で available **34** / search 67 / pending 3。**現在値は Phase 5 を参照**。

### RAKUTEN-ID Phase 3 — 日次レガシー経路の identity gate 統一（2026-08-29 / PR #112 / merge `346bd57`）

日次 rakuten-sync の 8.0 経路にも identity gate を適用し、誤商品CTAが再発しない構造にした。

- **既存 available**: EXACT/STRONG を特定できれば検証済み出品で更新（誤商品CTAの是正差し替えを含む）。
  現CTAの出品（itemCode一致）が REJECT で代替を特定できなければ search へ安全降格。
  AMBIGUOUS/未確証は**勝手に更新しない**（無変更）。旧経路の「スコア<8.0のavailableを無条件降格」は
  廃止（この旧仕様のままだと identity 昇格済み24商品が次の日次で誤降格されるところだった）
- **search→available**: 従来の 8.0 閾値（据え置き）＋ identity EXACT/STRONG ＋ 成果対象URL を全要求
- 誤検出対策3件を実API dry-run で発見し修正: 消耗品/入数判定を itemName 限定（catchcopyの
  「ろ材」言及で本体を誤REJECT）／寸法「600×295×360」の×Nを入数と誤認／容量「リットル」表記の解析追加
- **本適用結果**（run 33254770061 / commit 026355a）: 降格3（filter_canister_medium・large =
  ろ材付セット出品 / substrate_soil = 容量不一致14L≠3L）、是正差し替え1（**filter_canister_premium**:
  ろ材セットCTA → 2217本体EXACT出品 charm ¥26,997）、昇格1（food_tortoise_herbs = STRONG・9.1 →
  下記 DECISION R3）、KEEP 4（tank_60/substrate_coco/thermometer_digital/analog = AMBIGUOUS）。
  **available 32 / search 69 / pending 3**。全32件が成果対象URL。fixture 41+38 PASS

### RAKUTEN-ID Phase 1＋Phase 2 — 楽天アフィリエイト自動収益化（2026-08-29）

| 工程 | 状態 | 確定した結論 |
|------|------|-------------|
| Phase 1（identity gate 実装＋dry-run） | **PR #110 / merge `fbefc1d`** | `scripts/rakuten-identity.js` 新規（EXACT/STRONG/AMBIGUOUS/REJECT）。既存 8.0 閾値・レガシー経路は無変更。実API dry-run 101件: 誤マッチ6件を特定し候補仕分け（◎24/△5/❌6）。Owner が ◎24＋thermostat 条件付き承認・△❌HOLD 非承認を決定 |
| Phase 2（本適用） | 本PR | **承認 allowlist 25ID を IDENTITY_PROMOTE の必須ゲート化**（承認外は EXACT/STRONG でも昇格禁止・昇格モードでは allowlist 外に API 照会もしない）。誤マッチ防止（消耗品/適合表記/照明系/変種SKU/series=itemName限定）を実装し fixture 38/38 PASS。再dry-run（run 33248746005）で ❌6件の PROMOTE 消滅と新規誤マッチ0を確認後、identity_promote 実行（run 33248895442）で **24商品を search→available 化**（commit `14e9ffd`・全件 `hb.afl.rakuten.co.jp` 成果対象URL・楽天API 返却値のみ使用） |

**再実行しない事実:**

- 昇格24: tank_90 / uvb_compact / uvb_t5_desert_12 / uvb_mvb_100 / basking_50w / basking_75w /
  basking_halogen_50w / heater_panel_30w / 45 / 60 / heater_radiant_panel / heater_cord_20w /
  thermostat_digital / **thermostat_kotobuki_hydra**（Phase 0 降格→EXACT+ガード通過で正規URLに復帰）/
  filter_submersible_medium / substrate_gex_terrarium_soil / shelter_medium /
  supplement_calcium_d3 / calcium_no_d3 / supplement_calcium_plus / supplement_multivitamin /
  thermometer_dual_probe / thermometer_wifi / hydrometer_tetra
- **food_tortoise_staple のみ承認済みだが未昇格**（promote 実行時に API 0件 = NO_RESULT。
  allowlist に残してあり、次回 identity_promote 実行で昇格できる）→ UNRESOLVED
- rakutenStatus: available 34 / search 67 / pending 3（計104。**この工程終了時点の値**。現在値は Phase 5 を参照）。Amazon 系フィールドの変更 0
- CATEGORY_GUARDS(heating) に「サーモスタット」を追加した（閾値 8.0 は数値・条件とも無変更）
- 日次 schedule 実行では identity_promote は構造的に無効（workflow の式が必ず 'false' になる）
- `data/rakuten-diag.json` に25件の診断記録（secret / affiliateUrl / itemUrl なし）

### VISUAL SYSTEM Phase 3 — 公開表示の欠陥CLOSE（2026-08-29 / PR #109 / merge `386f86e`）

デザインは作り直していない。**実在する表示欠陥だけ**を潰した。
配色・書体・トップ構成・写真は変更していない。

| 欠陥 | 原因 | 修正 |
|------|------|------|
| **トップのクリーム帯** | Phase 2 の `header.hero{padding:38px…!important}` が species 以外にも適用。**さらに `index.html` 自身に旧ナビ用 `padding-top:56px /* nav height */` が残り、`body.klg-has-nav` の 52px と二重**になっていた | CSSを `body.klg-species header.hero` へスコープ（generator が全 species に `klg-species` を付与）＋ index の旧ナビ補正を 0 に。**hero 上部の空白 56px → 0px** |
| **Kids の見出し異常折返し** | `.k-card h2` `.k-dont h2` `.k-link b` `.k-sec h1/h2` が `display:flex`。テキストと `<ruby>` が別々のフレックスアイテムになり、2行になった瞬間にベースラインが崩れて縦に散らばる | `display:block` に戻し、アイコンは `inline-block`、丸番号は `float:left`（2行目も右に回り込み横並びを維持）。**320/360/390px で再現していた破綻が解消** |
| **review系6ページの PC グリッド不一致** | `css/style.css` の `.article-hero-inner` が `max-width:840px` の左寄せ、本文 `.article-body-wrap` は `760px` 中央寄せ。1920px で h1=left48 / 本文=left645 | hero-inner を `760px` 中央寄せ＋内側 padding を本文と一致。狭幅の padding 二重も解消。**390/750/1440/1920 すべてで ずれ 0px** |

**同時に実測確認した8項目**（再現しなかったものは変更していない）:

| 項目 | 結果 |
|------|------|
| スマホナビの overflow | **再現せず**（360/390/412px で `scrollWidth == clientWidth`、右端余白 8〜12px）→ 変更なし |
| 種カード和名切れ | **再現せず**（119枚すべて `scrollWidth <= clientWidth`）→ 変更なし |
| フィルタチップ切れ | **再現せず**（21個すべて）→ 変更なし |
| 写真なしカード | 12件あるが「写真を準備中」プレースホルダが正常動作。**欠陥ではない**→ 変更なし |
| トップのブランドラベル重複 | **再現**。ナビロゴ「KAME LIFE」と `.h12-brand` が二重 → `.h12-brand` を非表示（DOM・文言は保持） |
| Care Module の絵文字 | **再現**（🐢🔬🌿📏🧒 の5件）→ SVG へ置換 |
| 「案内人に相談」の💬 | **再現** → SVG へ置換 |
| `Trouble Shooting` 表記 | **再現**。英語として誤り（正しくは1語）→ `Troubleshooting` へ（10ファイル） |

**検証**: 390 / 750 / 1440 / 1920px × 16ページ（トップ・種一覧・species2・guide・ranking・review2・compare・trouble・shindan・Kids5）で
横スクロール0 / はみ出し0 / 文字切れ0 / 異常折返し0 / 画像失敗0 / SVG欠落0 / ナビ重なり0 / JSエラー0。
全 generator 冪等（再実行で書き込み0）。回帰ゲート species→guides **113/113 維持**。

### VISUAL SYSTEM Phase 2 / DESIGN CLOSEOUT（2026-08-29 / 本PR）

Phase 1（54→78点）の残課題をCSS側で解消した。
**SEO・分類・CITES・内部リンク・本文内容・著者情報は変更していない。**

| 項目 | 実測（前 → 後） |
|------|----------------|
| 11.4px未満のテキスト | species 113ページで **16種類・1ページあたり最大93個 → 0** |
| species ヒーロー高さ | 370〜904px（中央値429） → **300〜700px（中央値355）** |
| 写真がFVに入らないページ | 1 → **0** |
| stats-bar 列数 | 4列（元から統一。前回の「2/3/4列」は表示上の誤認） |

**タイポグラフィは機械的な一律15px化をしていない。** 用途を確認し、
識別情報（学名・サイズ・法規制）／購入判断（必須・推奨バッジ・価格注記）／
FAQ分類タグなど「読ませる必要があるもの」だけ引き上げた。
装飾的な eyebrow は小さいままとし、下限 11.5px に揃えただけ。
**Kids は対象読者が違うため対象外**（M PLUS Rounded と独自サイズを維持）。

**修正は正本CSSで行った** — `css/system.css` の後に読まれる
`starter-kit.css` `quick-facts.css` `life-preview.css` `species.css`、
および実行時にCSSを注入する `js/comparison-cta.js` が上書きしていたため、
それぞれの定義元を直した（`!important` での押し切りはしていない）。

**species ファーストビューは CSS のみで解決した。**
リード文の削除・要約は一切していない。hero の padding、行間、
hero 内 note-box の圧縮、stats-bar の行高・文字サイズ統一で
高さのばらつきを圧縮した。

**残りUI**: species-list の生息環境フィルタに右端フェードを追加して
横スクロール可能であることを示した。Photo Credits を
「写真の出典を見る」のアウトラインボタンにし、信頼設計の一部として
埋没させないようにした。

#### 作業中に自己検出して修正した回帰

**`scripts/gen_related_links.py` が自動生成リンクを絵文字へ差し戻していた。**
Phase 1 で rel-btn を SVG 化したが、generator 内のラベル定義は絵文字のままだったため、
再実行するたびに ⚖️🔰🔄☀️ に戻っていた。
ラベルを `[[icon-id]] テキスト` 形式に変え、出力時に SVG へ展開するようにして修正。
**これで generator は冪等になり、Phase 1 の成果を壊さない。**

### VISUAL SYSTEM Phase 1（2026-08-29 / 本PR）

見た目監査 54/100 の最大原因「デザインシステム不統一」を一工程で解消した。
**SEO・分類・CITES・本文内容・著者情報は変更していない。**

| 項目 | 実測（前 → 後） |
|------|----------------|
| ナビの種類 | mini-nav / site-header / なし の3系統（7ページはナビ皆無） → **klg-nav 1種類**（Kids は専用バンド） |
| 主要ボタンの角丸 | 0 / 7 / 8 / 10 / 24 / 9999px の6種 → **pill 1種**（トークン化） |
| 主要ボタンの色 | ゴールド / forest / 白 / 透明 / **Amazonオレンジ** の5種 → **ブランドゴールド 1色** |
| species ヒーロー配色 | 種ごとにバラバラ（濃緑/濃赤/茶橙/紺…） → **6生態カテゴリ配色に集約** |
| species ヒーローのアイコン | 🔬顕微鏡 / 🦏サイ / 🔴赤丸 など69種類の絵文字 → **カテゴリ6種のSVG** |
| UI絵文字→SVG | 0 → **rel-btn / species-nav 774箇所** ＋ shindanルート5 ＋ トップカード4 ＋ compareバッジ |

**新規ファイル**: `css/system.css`（トークン・共通ナビ・アイコン）／
`tools/gen_visual_system.py`（冪等generator）

**アイコン仕様**: 独自に描いた単色ラインSVG20種。ロゴ・型番は使っていない。
`currentColor` 着色でブランドゴールドに追従。インラインスプライト＋`<use>`で参照。

**判定はhrefで行う**: rel-btn の置換は絵文字の見た目ではなくリンク先URLから
意味を判定しているため、誤対応が起きにくい。対応先が無い場合は
無理にアイコンを当てず、絵文字を外してテキストのみにする。

**本文中の意味補助絵文字は残している**（FAQタグ・比較表・Life Preview 等）。
機械的な全廃はしていない。

**Kids は世界観を維持**。本体と同じ濃色ナビは入れず、
細いブランドバンド（KAME LIFE GUIDE ロゴ＋「おとなのページへ」）のみ追加した。

**数字矛盾の解消**: `index.html` の信頼バー 118→**119** 掲載種 / 112→**113** 種別ページ、
`species-list.html` の filter-apply-n 118→**119**。
（119種化の際に文字列「118種」だけを置換し、単独数字を取りこぼしていた）

#### 作業中に自己検出して修正した回帰

**共通ナビが `scripts/gen_related_links.py` を壊していた。**
klg-nav は全ページに `guides/` `trouble/` へのリンクを持つため、
generator が「既に手書きリンクがある」と誤判定し、
**PR #103 で結線した species→guides 112本を削除していた**（113→2ページに後退）。
generator の判定からナビを除外するよう修正し、**113/113 に復旧済み**。
このPRに修正を含めている。

### CLOSEOUT COMPLETE（2026-08-29 / 本PR）

#### D3 オプストヒラセガメの亜種ページを新規作成（写真なし・A案）

`species/obsti-hirase-turtle.html` を新規作成。**旧候補写真（iNat photo 134512961 / Chris Oldnall）は使用していない。**
`CLAUDE.md`（2026-08-24 調査クローズ）が「産地20.20N は本亜種の分布域から約400km北の基亜種分布域、腹甲もほぼ無地で識別形質と不一致 → 亜種同定を証明できない」と確定しているため、写真なしで公開した。**この判断を再検討しない。**

**ページに書いた内容の根拠範囲を明示している** ―― 確定事実として使ったのは分類（Fritz et al. 1998・TTWG承認）／分布（トゥアティエン＝フエ 16.3N〜ダクラク 12.7N・移行帯はクアンチ〜ゲアン付近）／識別形質（腹甲の放射状黒斑・基亜種はほぼ無地）／CITES II（親種からの種単位継承）のみ。**飼育情報はすべて「親種ヒラセガメに準じる」と明記**し、親種の UNPROVEN 値（最大甲長・寿命）を亜種固有の事実として書いていない。**運営者は本亜種を飼育していない旨もページ内に明記した。**

**同一工程で同期した全層:**

| 層 | 内容 |
|----|------|
| ページ | `species/obsti-hirase-turtle.html` 新規 |
| `shindan/species.js` | `forest` ルートへ1件追加（`all` は連結で自動反映）。`availability: 'reference_only'`、`match` は常に false（診断で推薦しない） |
| `data/species-master.json` | 121件へ。`photo` に不採用理由を記録 |
| `data/species-identification.json` | 114件へ。`photo_chuui` に「本亜種として掲載しないこと」を明記 |
| `tools/taxonomy.js`（**掲載区分の正本**） | `REFERENCE_ONLY` に追加 → generator 経由で `species-list.html` へ反映。**species-list.html を手編集していない** |
| `sitemap.xml` | 195 URL へ |
| 相互リンク | 親種 `species/hirase-turtle.html` → 新ページ、新ページ → 親種 |
| 内部リンク generator | `scripts/gen_related_links.py` が新ページを自動で結線（species→ 117→118本） |

#### 119種化の全面同期

新規追加により **118種 → 119種**。固定値を残さないため機械抽出して一括同期した。

- 公開層の `118種` **151ファイル / 349箇所 → 119種**。**`118種` の残存 0ファイル**
- `tools/gen-species-list.js` `gen-category-ui.js` `taxonomy.js` および `species-list.html` のコメント内 `118件` も `119件` へ（説明が実態と食い違う状態を残さない）
- 内訳は **通常一覧 115 ＋ 参考掲載 4**（参考掲載＝国内で流通している個体を確認できなかった種。「法的に飼えない」意味ではない）
- generator 再実行で件数バー初期値 119 / noscript 119件を確認

#### D7 スペングラーヤマガメの写真 → B案（自前写真へ差し替え）

候補5枚を実画像で確認し、**`face-close.jpg` を採用**。

| 候補 | 判定 |
|------|------|
| **face-close.jpg**（1599×1600） | **採用**。頭部が鮮明で目にピントが合い、甲も判別できる。自然な姿勢（自分のテラリウム内）。4:3 トリミング後もカードサイズ160px相当で亀と判別できることを実測 |
| water-dish.jpg（1201×1600） | 甲は見えるが頭部が小さい。縦位置で 800×600 への切り出し損失が大きい |
| hiding-cork.jpg / rock-cave.jpg | 個体が暗所・遮蔽で判別しにくい。メイン写真に不適 |
| setup-full.jpg | 環境全体のカット。個体がほぼ見えずメイン写真に不適 |
| 旧・Commons 画像（Viva.Chelonia） | 個体は最も鮮明だが**人の手に持たれた構図**。`CLAUDE.md`「採用する写真＝自然な姿勢」に照らして不採用 |

800×600 WebP（75KB）へ変換して差し替え、**クレジット4層を自前写真へ更新**（`credits_map.json` ／ `pc_parsed.json` ／ `photo-credits.html` ／ 種ページ figcaption）。出典は Real Setup 記事へリンク。**外部ライセンス依存が1件減り、E-E-A-T の一次性が上がった。**

#### PR #35 → close 済み

写真とクレジットの救出は PR #105 で完了済み。コードは merge せず GitHub 上で close し、CITES の論点は BLOCKED B6 へ引き継いだ旨をコメントで残した。

### DECISION CLOSEOUT（2026-08-29 / 本PR）

DECISION 9件を確定処理した。**CLOSE したものは UNRESOLVED に残していない。**

| ID | 確定 | 内容 |
|----|------|------|
| **D1 PR #35** | **CLOSE**（写真救出完了 → #35 は close 可） | N13 の写真候補を **PR #35 のブランチ `claude/konnichiha-fnoxtn`（`a38ee76`）から救出**。`assets/species-photos/canton-reeves-turtle.webp`（800×600 / Greg Hume / Wikimedia Commons / CC BY-SA 4.0）と**クレジット4層**（`credits_map.json` ／ `pc_parsed.json` ／ `photo-credits.html` ／ 種ページ figcaption）を同期。**これで H9／B5 も同時に解消**（別種 *M. reevesii* 写真の流用が解消され、観察ID共用も解消）。**CITES・分類は一切触っていない**（B6 の BLOCKED を侵さないため） |
| **D2 テキサスチズガメ** | **CLOSE**（現状維持） | 通常一覧のまま。sitemap 掲載済・被リンク3で破綻なし。**再判断しない** |
| **D6 カントンクサガメの `legal`** | **CLOSE**（変更しない） | `legal: null` のまま。立てても種一覧の表示は変わらず、影響は診断の注意文だけで価値が小さい。**D1/B5 の写真差し替えとは別件**（写真は上記で解決済み、`legal` は据え置き） |
| **D8 species→compare 15/112** | **CLOSE**（仕様として確定） | 15 は構造上の上限。**被覆率を上げる目的だけの compare 新規作成は禁止**。今後この数値を欠陥として再指摘しない |

### CLOSEOUT PHASE — 残件棚卸しと一括クローズ（2026-08-29 / 本PR）

`.claude/rules/closeout-gate.md` に従い、全残件を CLOSE NOW / BLOCKED / DECISION / DROP に分類し、
CLOSE NOW を同一工程内で実装・検証まで完了した。**以下は再監査しない。**

| CLOSE した項目 | 内容 | 実測 |
|---------------|------|------|
| **guides→species 逆方向結線** | 機材ガイド4本に代表種カードを自動生成。対象種は恣意的に選ばず、サイト自身のランキング掲載種 × 生態カテゴリ一致で決定 | リンク有 **8/17 → 12/17**、中央値 **0 → 3**、総数 **47 → 59** |
| **N27 テンプレの「100種」8件** | `_template-monetized` 4 / `hermann-dry-template` 2 / `three-toed-box-template` 2 を 118種へ | サイト全体の `100種` 残存 **0ファイル** |
| **N7 `ouachita-map-turtle-sp` の表示名ゆれ** | `northern-map-turtle` 2件＋`alabama-map-turtle` 1件の「オウアチタチズガメ」を、正本 master・当該ページ title/h1 と一致する **フトマユチズガメ** へ統一。**学名の三名法/二名法 HOLD とは独立**（和名表示のみ・学名は一切触れていない） | 表記ゆれ残存 **0ファイル** |
| **320px 横スクロール** | 真因は `species-list.html` の `.sp-cat .sp-cat-count{white-space:nowrap}`。件数＋注記が 315px に伸び、ページ全体が 9px 横スクロールしていた。既存の `@media(max-width:360px)` 内で折り返しを許可 | `scrollWidth` **329 → 320**（clientWidth 320 と一致）。360/390px も回帰なし |
| **N24 `index.html` の meta「100種」** | PR #102（`5a16951`）で 118種へ統一済み。UNRESOLVED に残っていたのは記載漏れ | 解消済み・リストから削除 |

**guides のうち species リンクを意図的に付けなかった5ページ**（未完了ではなく設計判断）:
`guides/index.html`（ハブ）／`turtle-not-eating` `turtle-runny-nose` `turtle-shell-white` `turtle-trouble-guide`
の症状4ページは**全種共通の症状解説**であり、特定種へのリンクは関連性が無い。
同様に `compare/index.html` `trouble/index.html` もハブのため対象外。**これらを「0件」として再指摘しない。**

以下は結論が確定している。**再調査・再監査・再実装しない。**
再開できるのは「重複作業防止ゲート」の4条件を満たす場合のみ。

### TOP DESIGN — トップページ「引き算の再設計」（2026-08-28）

| Phase | 作業 | 状態 | 確定した結論 |
|-------|------|------|-------------|
| Phase 2 | 現行トップの全構造棚卸しと KEEP/MERGE/MOVE/REMOVE-FROM-HOME 判定 | 設計のみ（ファイル変更0） | `index.html` の可視コンテンツブロック **22**・固定UI 2・hidden 1・章見出し4・`<details>` 3 を表示順に全件棚卸しし、**KEEP 9 / MERGE 9 / MOVE 6 / REMOVE-FROM-HOME 7** に判定。新トップ骨格（主要8ブロック＋Header＋Footer）を確定。**この棚卸しと判定は再実行しない** |
| Phase 3 | 新骨格への一括再構成 | **PR #95 / merge `412e23b`** | `index.html` **1ファイル・+344/−2,861行**。旧22ブロック → **①Header ②Hero ③信頼表示 ④3目的入口 ⑤写真付き種探索 ⑥飼う前に知っておきたいこと ⑦飼育情報入口 ⑧著者・編集方針 ⑨Final CTA ⑩Footer** へ再構成。**title / meta description / og: / twitter: / JSON-LD 3ノードは1バイトも変更していない**（diff 0 を機械確認） |

| Phase 4 | MOVE 7件を移設先ページへ実装 | **PR #96 / merge `f9b5be0`** | 移設先**4ファイル・+1,181/−0行（純粋な追加）**。移設元の正本は `54bd27b:index.html`。`index.html` は1バイトも変更していない |

| N25 修正 | 診断開始画面の可視「100種」を正本 118 へ | **PR #97 / merge `cd6f086`** | `shindan/index.html` **2行のみ**（`.species-count`「100種対応」→「118種対応」／`.jp-step-copy`「100種から…」→「118種から…」）。**`<script>` 6ブロック・CSS・`title`/`meta`/OG/twitter/JSON-LD はすべて差分0。** 診断5ルートを実操作して全て結果画面へ到達（JSエラー0）。**ただし `shindan/routes.js:169` の `全100種・8問で診断` は本工程の変更禁止指定に含まれていたため未修正 → `UNRESOLVED` の N26 へ** |

| 種数表記の統一 | 公開UIの掲載種数を全ページ 118 へ | **PR #98 / merge `c4f2542`** | **143ファイル・319行**（`100種` → `118種`）。repo 全体を機械抽出して分類（総計334件 = 公開本文/UI 323 ／ SEO層 7 ／ 未公開テンプレート 4）。**公開本文/UIの「100種」は0件になった。** 差分は数字の置換のみで、319行すべて「`100種`→`118種`」以外の変化がないことを機械照合済み |

### ② species-list.html の再設計（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 監査 | 現状棚卸しと新デザイン案 | 完了（ファイル変更0） | 実測: 全長 64,175px ／ カード526px ／ フィルタバーが ≤480px で `position:static`（sticky無効）／ 見出し62個（6大分類6・属40・種グループ16）で**40属中20属が1種のみ**／ 実写真107・絵文字フォールバック11 ／ カード内絵文字118個（`species.js` の `emoji`・ユニーク78種類）。**この棚卸しは再実行しない** |
| 実装1 | 監査結果の実装 | **PR #99 / merge `4e2b584`**（commit `223481a`） | `species-list.html` **1ファイル・+287/−119行**。下表のとおり |

**実装1で確定し、再実行しない事実:**

| 項目 | before | after |
|------|--------|-------|
| ページ全長（390px） | 64,175px | **19,243px（−70%）** |
| ページ全長（360px / 1280px） | — | 18,600px / 20,905px |
| カード1枚の高さ | 526px | **202px** |
| ≤480px の列数 | 1列 | **2列** |
| 操作バー | ≤480px で sticky 解除 | **全幅で sticky 維持**（12,000px 地点でも画面内・top=0） |
| 一覧開始Y | 1,035px | **569px** |
| 属見出し | 40 | **20**（1種しかない属は出さない） |
| カード内の絵文字 | 118 | **0** |
| `sp-reason`（3行説明） | 118 | **0**（詳細ページで読む） |
| 全幅の `sp-link` ボタン | 118 | **0**（カード全体を `<a>` 化） |
| 写真なし11種 | 絵文字フォールバック | **深緑のプレースホルダ「写真を準備中」** |

- **カードの表示情報は「実写真 / 和名 / 学名 / 難易度 / 甲長（最大◯cm）」の5点＋法規制ラベルで確定。**
  実装1で 118種すべてに出ていた CITES バッジ（`legalBadge()`）は削除した。**その代わり、
  `legal` フラグを持つ14種にだけ出る法規制ラベルを PR #99 の2コミット目で入れた**（下の「法規制表示の回帰修正」）。
  CITES II / III の一般表示（95種）には戻していない。
- **N29 解消**: 個別ページを持たない6種（エジプトリクガメ / インドホシガメ / ビルマホシガメ /
  マダガスカルクモノスガメ / ヒラタニオイガメ / テキサスチズガメ）は、カード内に
  **「飼育ガイドへ」**を小さく表示する。遷移先は `guide-dry.html` / `guide-semi.html` /
  `guide-water-full.html` の3本。残り112件は `species/*.html`。**全118件の遷移先が実在することを確認済み。**
- **難易度・サイズ・KLGクイックは絞り込みシート（bottom sheet）の中**。生息環境6ボタンは
  操作バーに1行の横スクロールで残す（`BEGIN:hab-buttons` の生成領域はそのまま）。
- **適用中の条件はチップで表示し、× で1条件だけ外せる。** シートには「条件をすべて外す」と
  「◯種を見る」を置いた。
- **単独の種は連続するぶんを1つのグリッドにまとめる**（種ごとにグリッドを分けると
  カード1枚で1行を使ってしまい、これが全長の主因だった）。亜種を持つ種だけ小見出し＋専用グリッド。
- サムネイルは **3:2**（元画像は 800×600 の 4:3 なので上下がわずかに切れる）。
  全身と識別点は詳細ページの 4:3 写真で見せる。
- **生成領域4つ（`hab-buttons` / `taxonomy-data` / `wamei-alias` / `species-index`）は
  変更前後で完全一致。** `title` / `meta` / OG / twitter / canonical / JSON-LD も差分0。

### archive・reference_only 8種の掲載仕様監査 ＋ 法規制表示の回帰修正（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 履歴調査 | エジプトリクガメはいつ消え、いつ戻ったか | 完了（ファイル変更0） | `2589573`(06-19) 初回追加 → **`200dc03`(06-22) 削除** → **`d150d66`(06-24) CITES I / `hasPage:false` として意図的に再追加** → `d57594a`(06-24) `availability:'archive'` → `a38ee76`(08-22) `match:()=>false` → **`512ebc2`(08-25) 一覧の自動生成化で初めて一覧に出現**。`512ebc2` の親 `cdc1de1` の手書き `species-list.html` には出現数**0**。**一覧掲載は編集判断ではなく自動生成化の副作用**。再調査しない |
| 掲載仕様監査 | archive 6種・reference_only 2種を1件ずつ判定 | 完了（ファイル変更0） | **NORMAL 4 / REFERENCE 3 / HOLD 1**（下表）。再監査しない |
| 回帰修正 | 実装1で消えた法規制表示の復旧 | **PR #99 / merge `4e2b584`**（commit `872cdfd`） | `species-list.html` 1ファイル。`legal` を持つ**14種だけ**にラベルを出す |

**8種の判定（流通は実測。再調査しない）:**

| 種 | CITES / 国内法 | 流通の実測 | 判定 |
|----|---------------|-----------|------|
| パンケーキリクガメ | CITES I（CoP18・2019）／国際希少野生動植物種・登録票で国内譲渡可（master に official 出典） | 複数の専門店で登録票付き 19.8〜49.8万円 | **NORMAL** |
| インドホシガメ | CITES I（CoP18・2019） | 国内CB＋マイクロチップ登録票付き 29.8〜89.8万円・複数店在庫 | **NORMAL** |
| ビルマホシガメ | CITES I（2013） | 自家繁殖を含む国内CB 20〜80万円・複数店在庫 | **NORMAL** |
| ミスジハコガメ | CITES II（`cites_ii_cb_only`）／国内法規制なし | 一般ペットショップに中国CB 10.8〜16.8万円 | **NORMAL** |
| モエギハコガメ | CITES I（CoP19・2023-02-23発効）／登録票必要 | 販売実績は EUCB 2022・49.9万円の1件のみで SOLD OUT。I化後の在庫は確認できず | **REFERENCE** |
| エジプトリクガメ | CITES I（1995-02-16・CoP9） | 専門店の在庫0。二次情報も「事実上市場から消えた」で一致 | **REFERENCE** |
| マダガスカルクモノスガメ | CITES I（master は LIKELY・原文未確認） | 販売実績を確認できず。二次情報が互いに矛盾しており根拠に使えない | **REFERENCE** |
| テキサスチズガメ | CITES III（2006-06-14・米国の Graptemys 属一括）／**国内法規制なし・`legal:null`** | 日本の販売記録を確認できず。archive 設定の個別根拠も repo に無い | **HOLD** |

**「CITES I だから除外」は成り立たない。** NORMAL 4種のうち3種が CITES I で、HOLD 1種は CITES 規制の外。
`availability` / CITES / 入手性は**三者とも別概念**として扱う。

**法規制表示の回帰修正で確定し、再実装しない事実:**

- **`legal` フラグを持つのは 118種中 14種だけ**（`cites_i` 6 ／ `cites_ii_cb_only` 4 ／
  `conditional_invasive` 3 ／ `unknown_hold` 1）。**残り104種にはラベルを出さない。**
- ラベルは4種類。文言は `shindan/index.html` の確定済み法規制文を一覧カード用に短縮したもので、
  新しい法解釈は足していない。**「CITES I ＝ 購入不可」とは書いていない。**

| `legal` | 件数 | 表示（2行） | 種 |
|---------|------|------------|-----|
| `conditional_invasive` | 3 | 条件付特定外来 ／ **新規購入不可** | ミシシッピアカミミガメ・キバラガメ・カンバーランドスライダー |
| `unknown_hold` | 1 | 特定外来生物 ／ **新規購入不可** | ハナガメ |
| `cites_i` | 6 | CITES I ／ **登録票が必要** | パンケーキ・インドホシ・ビルマホシ・エジプト・マダガスカルクモノス・モエギ |
| `cites_ii_cb_only` | 4 | CITES II ／ **CB個体・要書類確認** | ヒラセガメ・タイワンセマル・チュウゴクセマル・ミスジ |

- **区分と帰結を2行に分けている。** 狭いカードで語の途中から折り返るのを防ぎ、帰結の行を読み落としにくくするため。
  14件すべて 2行・高さ40px で揃い、はみ出し0（360/390/480/768/1200px で確認）。
- **色は薄めない。** `opacity:.85` は doc 系のコントラストを 4.04 まで落として AA を割るため採用しなかった。
  実測 **stop 6.09 / doc 5.50**（いずれも AA 4.5 超）。区分と帰結の差は字送りと太さで付けている。
- **CITES II / III の一般表示（95種）には戻さない。** `sp-reason` も絵文字も戻していない。
- 390px の全長は 19,243px → **19,720px**（+477px / +2.5%）。21,000px の上限内。

### ③ species-list.html の掲載区分 — 通常一覧115種 ＋ 参考掲載3種（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 掲載区分の実装 | 参考データを通常一覧から分離 | **PR #100 / merge `d81ccc7`**（commit `36dc057`） | 5ファイル。**通常一覧115 / 参考掲載3 / 合計118**。`shindan/species.js` は1バイトも触っていない |

**再実装・再測定しない事実:**

- **掲載区分の正本は `tools/taxonomy.js` の `REFERENCE_ONLY`**（エジプトリクガメ / マダガスカルクモノスガメ /
  モエギハコガメ の3件）。`tools/gen-species-list.js` が `BEGIN:taxonomy-data` へ焼き込み、
  ページ内 JS はその写しを読む。**生成物は手で編集していない**（generator を実行して生成した）。
- **`splitListing()` は `REFERENCE_ONLY` に `species.js` へ無い和名が混ざると例外で止まる。**
  和名が変わったときに参考掲載が静かに0件へ落ちるのを防ぐため。
- **診断への影響はゼロ。** 診断は `shindan/species.js` の `availability` と `match` だけを見ており
  （`shindan/index.html` L1413 / L2700）、`REFERENCE_ONLY` を参照しない。
  `availability` / `match` / `score` は無変更。
- **絞り込みは118件全体にかけてから通常／参考に分ける。** 参考掲載3種も検索・絞り込みの対象に残す。
  和名・別名（ソマリア）・学名（`kleinmanni` / `Pyxis`）・slug（`indochinese`）のすべてでヒットを確認済み。
- **通常一覧の分類件数はリクガメ25 / ヤマガメ・ハコガメ21 / 半水棲18 / 水棲（淡水）29 / 汽水6 /
  スッポン・曲頸16 ＝ 115。** 生息環境ボタンは掲載区分で絞らないので、
  ボタンのマークアップ（`BEGIN:hab-buttons`）は無変更。
- **件数バーは「118 種」＋「通常一覧 115 / 参考掲載 3」の2行。**
  1行に並べると390pxで並び替えが折り返り sticky バーが縦に伸びるため分けた（バー高 148px → 152px）。
  参考掲載が0件になる絞り込みでは内訳行を隠す。**総数118は減らないので「118種」表記は変更していない。**
- **noscript の `species-index` は118件のまま。** 通常一覧の6分類のあとに「参考掲載（3種）」の見出しと
  説明文を置き、クローラー向けリンクは1本も減らしていない。
- **参考掲載セクションの文言**: 「国内で流通している個体を確認できなかった種です。記録として残していますが、
  これから飼う種を選ぶときの候補には入れていません。」**「飼育禁止」「購入不可」とは書いていない**
  （監査の実測は「流通を確認できなかった」であって禁止ではないため）。
- **PR #99 で確定した legal 14種のラベルは無変更。** 参考掲載3種はいずれも `cites_i` なので
  「CITES I ／ 登録票が必要」を保持したまま参考セクションへ移った（通常11 ＋ 参考3 ＝ 14）。
- **テキサスチズガメは HOLD のまま通常一覧に残した。** 除外根拠がないため動かしていない。
- 390px の全長は 19,720px → **19,837px**（+117px）。21,000px の上限内。

### ④ species-list.html —「暮らしから選ぶ」6大分類の写真タイル（2026-08-28）

| 工程 | 作業 | 状態 | 確定した結論 |
|------|------|------|-------------|
| 写真タイルの実装 | 操作バーと一覧の間に6分類の写真タイルを置く | 本PR | `species-list.html` **1ファイル・+111/−0行**。**② species-list の再設計はこれで完了。** |

**採用した6写真（1枚ずつ実物を目視して選んだ。再選定しない）:**

| 分類 | 通常一覧の件数 | 写真 slug | 写っている種 | 採用理由 |
|------|--------------|-----------|-------------|---------|
| リクガメ | 25 | `hermann-tortoise` | ヘルマンリクガメ | 草地を歩く健全個体。頭と四肢が出ており甲の模様も出ている。国内で最も多く飼われるリクガメ |
| ヤマガメ・ハコガメ | 21 | `three-toed-box-turtle` | ミツユビハコガメ | 下草を歩く健全個体。人の手が写らず、ドーム状の甲とヒンジが見える。亀好きさんの飼育種 |
| 半水棲 | 18 | `musk-turtle` | ミシシッピニオイガメ | 水際の倒木でバスキング中。水と陸場という半水棲の要件がそのまま写っている |
| 水棲（淡水） | 29 | `reeves-turtle` | クサガメ | 頭部を出した健全個体。首の黄条線という識別点が明瞭で、写真の出所も一次データで証明済み（KEEP 2件のうち1件） |
| 汽水 | 6 | `ornate-diamondback-terrapin` | オルナータダイヤモンドバックテラピン | 正面から。斑点のある頭部と淡色の顎という識別点が出ている。枝の上に乗っており「埋もれて閉じ込められた構図」には当たらない |
| スッポン・曲頸 | 16 | `pig-nosed-turtle` | スッポンモドキ | 遊泳中の全身。ヒレ状の四肢と豚鼻という他に似ないシルエットが1枚で伝わる |

**目視して不採用にしたもの（再確認しない）:** `eastern-box-turtle`（人の手＋背景に赤いピックアップトラック）／
`spotted-turtle`（人の手の上）／`painted-turtle`（背景に黄色いプラ製フェンス）／
`northern-diamondback-terrapin`（板の上の真上からの構図・頭部と四肢が引っ込み気味）／
`japanese-pond-turtle`（逆光でピントが甘く甲が白飛び）。

**再実装・再測定しない事実:**

- **分類と順序の正本は `CAT_ORDER`**（`BEGIN:taxonomy-data` の生成値）。タイルは `CAT_ORDER` を回して描く。
  `HAB_PHOTO` が持つのは「どの分類にどの写真を使うか」だけで、分類を定義していない。
  写真が未定の分類はタイルを出さない。
- **件数は描画時に通常一覧から数える**（`habCount()`）。数字を焼き込んでいないので、
  種が増減しても generator を回さずに追随する。参考掲載3種は数に入れない。
- **新しい絞り込みロジックは足していない。** タップは既存の `#hab-btns .fbtn` を `click()` するだけ。
  選択中の分類をもう一度タップすると「すべて」へ戻る。
- **選択状態は `render()` から `syncHabTiles()` を呼んで同期する。** タイル・生息環境ボタン・
  条件チップの ×・条件リセット・URLパラメータのどこから変えても表示が食い違わない（実測で確認済み）。
- **`img` に `height:auto` が要る。** 書かないと `height="600"` 属性が UA スタイル経由で効いて
  `aspect-ratio:3/2` が無視され、タイル1枚が672pxになる（実装中に踏んで修正した）。
- 写真は `alt=""`（ボタン自体がラベルを持つ装飾画像）。ただし**写っている種名はキャプションに出す**ので、
  どの亀の写真かは隠れない。
- 390px の全長は 19,837px → **20,506px**（+669px）。21,000px の上限内。タイル部の高さは 669px。
- **320px の横スクロール（328 > 320）は本変更の前から出ている。** 原因は `.filter-btns`（生息環境チップの行）で、
  main の時点で同じ 328 > 320。本PRでは触っていない。

**公開UIの掲載種数について、今後は再調査しない事実:**

- **公開画面に出る掲載種数は「118種」で確定。** 正本は `shindan/species.js`（118件）／
  `hasPage:true` = 112／6大分類 27・22・18・29・6・16 = 118。
- **`title` / `meta description` / `og:` / `twitter:` / JSON-LD の「100種」7件は意図的に据え置き**
  （`index.html` 3 ／ `shindan/index.html` 4）。**H8（SEO運用HOLD）** の対象で、
  GSC/GA4 の実測がトリガーを引いたときにだけ扱う。**取りこぼしではない。**
- **未公開テンプレート3ファイルの「100種」8件も意図的に据え置き**
  （`species/_template-monetized.html` 4 ／ `species/hermann-dry-template.html` 2 ／
  `species/three-toed-box-template.html` 2）。いずれも **sitemap 未掲載・被リンク0** で
  公開画面には出ない。ただし**このテンプレートから新しい species ページを作ると 100種 が復活する**
  ため、次に species ページを新規作成する工程の冒頭で直すこと（→ `UNRESOLVED` の N27）。
- **`trouble/` 6ページの「全種一覧（100種以上）」は「全種一覧（118種）」にした。**
  実数が118で確定しているため「以上」を落とした。これが唯一「数字以外」に手を入れた箇所。
- `shindan/routes.js:169` の `desc`（ルートカードの説明文）と `js/annainin.js` の
  連携ラベル・bot応答文も 118 へ。**どちらも表示文字列のみで、`qCount` や判定ロジックは無変更。**

**Phase 4 で確定し、再実行しない事実（MOVE 7件は完了。移設元は二度と参照しなくてよい）:**

| 移設元（`54bd27b:index.html`） | 移設先 | 実装の要点 |
|------------------------------|--------|-----------|
| `lead-in` L3745-3750 | `guides/index.html`（hero 直下 `.gh-lead`） | 本文2段落を逐語 |
| `discover` 8カード L3752-3819 | `guides/index.html`「飼育環境 — 種類別ガイド」の冒頭 `.gh-hab-grid` | **リンクは重複させていない**。8本の `guide-*.html` へのリンクは直下の生成カード（`BEGIN:guides-hub-env`）が既に持つため、移設先に無かった情報（生態の説明文・代表種・英字ラベル）だけを置いた。生成領域は1バイトも変更していない |
| `gear-index` 7カード L4417-4433 | `guides/index.html`「まず揃えるべき飼育用品ガイド」内 `.gh-gear-grid` | best10 7本は移設先に未掲載だったので実追加。既存4枚（`*-guide.html`）とリンク先が重ならない |
| `live-compare` 3枚 L4037-4150 | `compare/index.html` の**既存 ch-card 3枚の中**（`.lc-badge` + `.lc-metrics`） | **カードを増やしていない**。3ペアとも移設先に既存のため、移設先に無かった数値（難易度・初期費用・においリスク等）とバッジだけを既存カードへ足した |
| `compare-engine` 表 L4151-4261 | `compare/index.html` の `ch-bottom` 直前 `#compare-engine` | 表を**逐語**移設。`<th>難易度</th>` と `<th>はじめての方向け</th>` は**別軸のまま**（H5 確定・統合も改名もしていない）。末尾にあった `ce-cta-box`（診断CTA）は直下の `ch-bottom` と同義のため持ち込まず、caveat だけ `.ce-note` として残した |
| `journey-preview` L4527-4572 | `shindan/index.html` の `#screen-start` 内 `.jp-block` | 文言は逐語。**`<script>` 6ブロックは変更前後で完全一致**（診断ロジック無変更）。CSS は移設先のダークテーマに合わせて配色のみ書き下ろした |
| `readiness-score` L4585-4758 ＋ JS L4935-5170 | `before-keeping.html`（チェックリスト直後・「すべて確認できたら」の直前） | 質問5・選択肢15・配点列 `210210210210210`・バンド境界 `0-3 / 4-7 / 8-10`・`TOTAL_Q=5` が移設元と**完全一致**。本診断と別物であることを `.trs-scope` で明示 |

**Phase 4 で加えた必要な変更（推測ではなく、移設先の事情による確定事項）:**

- Readiness Score の高得点バンドの CTA リンク先を `#top-gear-picks` → **`./shindan/`** に変更した。
  `#top-gear-picks` は `index.html` にあったアンカーで、`before-keeping.html` には存在せず**リンク切れになる**ため。
  Starter Kit は診断結果の機能なので `./shindan/` が実体と一致する。**質問・配点・判定ロジックは無変更。**
- `before-keeping.html` の汎用 `h2`（下線）と `a`（下線）のスタイルが移設ブロックへ漏れていたのを
  `.trs-heading` / `.trs-result-cta` で打ち消した（移設元には無かった装飾のため）。
- **`guides/index.html` の `.gh-featured-*` に CSS が1つも無く、素のリンク列として描画されていた既存不具合を是正した**
  （main の時点からの不具合。移設した機材カードの直上にあたるため同Phase内で修正）。
  配色・角丸・余白は同ページの `.gh-card` 系に合わせた。**HTML は1行も変えていない。**

**Phase 3 で確定し、二度と問い直さない事実:**

- **トップの `<details>`（もっと見る）は 0。** 実写真グリッドは `<details>` の外＝**初期表示**になった
  （実測: スマホ390px で開始Y **7,626px → 1,383px**）
- **固定UIは `mini-nav` の1本だけ。** `#sticky-diagnosis-cta` は markup / CSS / JS を撤去済み
- **診断への導線は 12本 → 6本**（mini-nav リンク・mini-nav CTA・Hero・④の①カード・⑥・⑨）
- **Kids のトップ露出は 4箇所 → 1箇所**（⑦ Care Module 05 ＋ 同ブロック内の `kids/otona.html` 副リンク）。
  `kids/` 本体と `assets/kids/` の画像は**削除していない**
- **公開UIの種数は 118 に統一**（可視「100種」は 0 件）。6大分類チップは正本
  （`tools/taxonomy.js` × `shindan/species.js`）の実数 **27 / 22 / 18 / 29 / 6 / 16 = 118** と一致
- **「10K+ Data Points」「98 Care Pages」はトップから除外**（根拠不明・正本不一致）。
  信頼表示に載せるのは正本と一致する **118 掲載種 / 112 種別ページ / 6 暮らしタイプ** のみ
- **ページ全長: スマホ390px 12,418px → 8,736px（−29.6%）／PC1280px 9,990px → 7,098px（−29.0%）**
- **`index.html` のインライン CSS から、今回の撤去で孤立した 340ルールを削除**した。
  削除は「旧ファイルでは使われていて、新ファイルで未使用になったセレクタ」に限定し、
  **旧ファイル時点ですでに孤立していた 79ルールには触れていない**（機械判定・再スキャンで新規孤立 0 を確認）

### 和名↔学名↔分類階級 監査の是正（2026-08-26）

| PR | 作業 | merge | 確定した結論 |
|----|------|-------|-------------|
| #87 | 監査で誤り確定した3件のうち **1件だけを是正** | `93ee426` | `stripe-necked-musk-turtle` のクレジット層 `gakumei` を `Sternotherus minor` → **`Sternotherus peltifer`**（`data/pc_parsed.json` / `data/credits_map.json` 各1エントリ）。これで **master・`photo-credits.html`・species HTML・クレジットJSON2本の全層が `Sternotherus peltifer` で一致**。残る2件は着手前に**指示と main の矛盾**が判明したため STOP（UNRESOLVED 参照） |
| #16 | 旧PRを **merge せず CLOSE** | close のみ | 「旧PRを merge せず、最新 main 上で必要差分を救出実装し **PR #80** で反映済み」を理由として記録。**ブランチ `claude/kame-life-guide-elementary-gidu7i` は無変更**（merge / rebase / push なし・head `863ee7c` のまま）。close 前に現 main で救出実装を実測確認: kids リンク **167ページ** / `site_kids_click` **168** / `index.html` Care Module 05 の CTA と `gl-sub-link` / `guide-*` は `END:guide-nav` の外側 / generator 4本 差分0 |
| #88 | `amazon-matamata` の和名を **オリノコマタマタ** へ完全統一 | `d4c30c7` | 12ファイル・14行。上流 3本（`shindan/species.js` の `name`／`shindan/equipment.js` の辞書キー／`species-list.html` の `CAT_OVERRIDE` キー）を同時改名し、生成領域2箇所は generator で再生成。**「アマゾンマタマタ」は `Chelus fimbriata` 側を指す名称として扱い、`orinocensis` の alias には残さない**（`wamei_aliases` は `null` のまま） |
| #89 | カントンクサガメの分類を **独立種 Mauremys nigricans** へ確定 | `9b31cec` | 旧 PR #35 は merge/rebase せず、現 main へ必要差分だけを新規実装。`Mauremys reevesii`（広東型・rank=regional_form・CITES附属書III）という扱いを廃止し、**`Mauremys nigricans` / rank=species / CITES附属書II** へ全層統一。クサガメ（`reeves-turtle`）は1バイトも変更していない。**写真だけは差し替えていない**（下記 FIXED_FACTS と H9 を参照） |
| #90 | 和名118件監査で **B判定＝修正確定の9件**を実装 | `3ddbf65` | 43ファイル・+334/−334行。`shindan/species.js` の `name` を正とし、`equipment.js` の辞書キー・`species-list.html` の `CAT_OVERRIDE` キーを同時改名（PR #88 の3点セット）。master／identification／`photo-credits.html`／`pc_parsed`／`credits_map`／`SHINDAN-SPECIES.md`／対象 species HTML も追従し、生成領域は generator 出力と一致。**和名が変わったのは B9 の9件だけで、A74・C17・D12・E1・F5 は全件不変**。`latin` は118件すべて不変 |
| #91 | 和名118件監査の **C判定17件**に `wamei_aliases` を実装 | `46efe39` | `data/species-master.json` **1ファイル・+55行/−0行**（純粋な追加）。16レコードに `wamei_aliases` を新設し、1件（`narrow-bridged-mud-turtle`）は既存値を保持。**primary 和名（`wamei`）は120レコードすべて不変**、学名・`cites`・`slug`・`page` も不変で、値が変化したキーは `wamei_aliases` だけ。公開ページ・`shindan/`・生成物は1バイトも変えていない |
| #92 | **N21 解消** — 登録済みの別名を `species-list.html` の検索で引けるようにした | `0e8449e` | `tools/gen-species-list.js` が `data/species-master.json` の `wamei_aliases` を読み、`species-list.html` の新マーカー `BEGIN:wamei-alias` へ `WAMEI_ALIAS` を焼き込む。`haystack()` は `name + 別名 + latin + slug` を見る。**正本は master の1箇所のまま**で、`shindan/species.js` に別名を二重登録していない。別名33件すべてで検索到達を確認し、既存の検索（primary和名118 / 学名118 / slug112）は**1件も減っていない** |

### 直近の連続作業（difficulty ／「初心者」表現）

| PR | 作業 | merge | 確定した結論 |
|----|------|-------|-------------|
| #51 | 難易度体系5段階化 STEP 1 | `e4b3992` | `species-list.html` の難易度UIを正本5値へ。`LEGACY_DIFF` で旧URL互換。`?diff=初心者向け`=18件を維持 |
| #52 | 「初心者」公開表現 Phase B-1（B分類） | `eae8d6e` | 冬眠まわり37件を修正。**HOLD 15件**（内訳は UNRESOLVED） |
| #53 | 「初心者」公開表現 Phase B-2（E分類） | `5fa7c9c` | CTA・関連リンク・ナビ37件を「はじめての亀」系へ。**HOLD 1件** |
| #54 | difficulty 公開表現整合 Gate | `61ceb48` | 既知5件を**すべて判定A（正本が正しい）**で確定。「非推奨」を廃止 |
| #55 | difficulty 表示層の完全同期 | `e51fc09` | badge/stat-item の不一致28件を解消。**公開difficulty表示249箇所の不一致0** |
| #56 | AI引継ぎ・重複作業防止システムの整備 | `4fc0952` | 本ファイルを現在状態の単一正本として新設。`CLAUDE.md` と `.claude/rules/chatgpt-handoff.md` に読取ゲート・更新義務・NEXT HANDOFF ブロック・プロンプト生成規則を追加 |
| #57 | AI-HANDOFF の CURRENT_BASE を同期 | `ed14074` | 本ファイル自身を merge 後の main へ同期 |
| #58 | A-1 quick-facts のラベル置換 | PR #58 | species 26ページの `初心者向き？` → **`飼育難易度`**。値・理由文・色・アイコンは無変更。HOLD 0件。`compare/hermann-vs-greek.html` の「どっちが初心者向き？」3件（title / OG / hero-sub）は `<strong>` 形ではなく**対象外**として維持 |
| #59 | A-4 FAQ問いの可視・JSON-LD同期 | PR #59 | 5ページの `初心者向けですか？` → **`はじめて飼う亀に向きますか？`**。可視 `<summary>` と JSON-LD `"name"` を同一commitで完全一致。回答本文は無変更。HOLD 0件。**可視FAQとJSON-LDの同時修正を初めて適用し、成立を確認した** |
| #60 | H1 B分類の JSON-LD複製14件を同期 | PR #60 | 可視FAQ（`faq-body` / `h3`）と JSON-LD（`acceptedAnswer.text` / `"name"`）を同一commitで完全一致。14件×2箇所=28箇所。意味・安全性・推奨強度は不変。HOLD 0件。**B分類は 51/52 に到達**（残る B18 は A-5 と不可分のため NEXT へ） |
| #61 | A-5 見出し3件 ＋ B18 本文1件 | PR #61 | `<h2>初心者に向くか</h2>` → **`はじめての1頭に向くか`**（3件）と、`むしろ初心者と相性の良い面があります` → **`むしろはじめての1頭として相性の良い面があります`**（1件）。JSON-LD複製なし。HOLD 0件。**B分類 52/52 完了** |
| #62 | H2 shindan の「初心者TOP3」＋説明文を同時処理 | PR #62 | `初心者TOP3` → **`はじめての亀 TOP3`** と、それを名指しする `ec-text-sub`「初心者向けTOP3や比較ページも…」→ **`はじめての亀 TOP3や比較ページも…`** を同一commitで変更。JSON-LD複製なし。`href`・`id`・GA4・診断ロジックは無変更。**未処理HOLDが0になった** |
| #63 | N1 AI_CHANGELOG の欠落補完 | PR #63 | `AI_CHANGELOG.md` に **Merge済み PR 47件（#13〜#62）** を1エントリ1件で追記。既存2エントリは1文字も変更していない（append-only）。**想定の「#44〜#62 の19件」ではなく47件が欠落**していた（既存2エントリは PR ではなく branch commit を指していた）。Automation 31件・直push 5件は merge ではないため §9.3-R1 の対象外と判断 |
| #64 | C分類22件「初心者におすすめ」系の置換 | PR #64 | 22件 / 15ファイルを「はじめて飼う方」系へ。推薦強度・意味は不変。HOLD 0件。`species/mississippi-map-turtle.html` の1件のみ JSON-LD 複製があり可視と同一commitで同期（可視1 + LD1） |
| #65 | D分類24件「初心者には難しい」の理由明示化 | PR #65 | 24件 / 22ファイル。抽象的な警告を**その種で実際に難しい理由**へ書き換え。理由は各ページ本文・`species.js` の reason・「向いていない人」欄から取得（推測なし）。警告強度は不変。HOLD 0件。JSON-LD複製2件（`hermann-dry-template` / `three-toed-box-template`）は可視と同一commitで同期 |
| #66 | F分類12件（読者層・採点基準・UI例文） | PR #66 | 12件中 **11件を置換・1件を HOLD**。F1 3件は「初心者向けに解説します」→「はじめて飼う方に向けて解説します」、F2 6件は「初心者が〜」→「はじめて飼う方が〜」（1件のみ「初心者には見逃しやすい」→「飼育経験が浅いうちは見逃しやすい」）、F3 は `annainin` の placeholder のみ置換。**JSON-LD複製は0件**（4ファイルの JSON-LD に `初心者` は残るが、すべて `headline`/`description`/`name` = SEO②領域で F の対象文ではない）。**HOLD 1件 = F3-2 `annainin/index.html:74` の topic-btn 可視ラベル「初心者向け」**（理由は FIXED_FACTS 参照） |
| #68 | annainin の語彙統一（H4 + N2） | PR #68 | `annainin` 内の公開語彙を**「はじめての方向け」系へ統一**し、**H4 と N2 を同時に解消**。可視ラベル / `data-quick-reply` / `TOPIC_QUICK_REPLIES` / bot応答本文2件の**計4箇所**を同一commitで整合。`INTENT_RULES` の beginner キーワード `['初心者','はじめて','初めて','入門']` は**1文字も変更していない**（「初心者」と手入力するユーザーは beginner のまま）。`annainin` 配下の公開表示から「初心者」は**0件**になり、リポジトリに残るのは非表示の分類キーワード1件のみ |
| #69 | A分類28件の着手ゲート → **STOP（サイト変更0）** | PR #69 | `NEXT` の「A分類の残り28件」を現mainから再抽出しようとしたが、**28件を機械的に特定できないことが判明**して STOP した。原因は **Phase A の per-item 分類リストがリポジトリのどこにも保存されていない**こと（残っているのは分類ごとの件数だけ）。28件を確定するには Phase A の分類をやり直すしかなく、それは `DO_NOT_REPEAT` で禁止されている。**公開HTMLの「初心者」155行の分布を実測して記録し、代わりに機械判定できる `NEXT` を再設定した。** サイトファイルの変更は0件 |
| #70 | A-6 難易度の軸ラベル18行 | PR #70 | 機械条件で18行を再抽出し**行番号まで完全一致**。1件ずつ文脈確認し、**compare の `<td>初心者適性</td>` 6件を `<td>飼育難易度</td>` へ**。**セルの値は1文字も変更していない**（各ファイルで変化した `<td>` はラベル1個のみ）。**残り12件は HOLD**（内訳は UNRESOLVED の H5〜H7）。JSON-LD複製0件。`species/` の difficulty 表示227件は変更前後で完全一致、`species/` `shindan/` の変更0 |
| #71 | H7 解消 — スコア表の軸名を表と導入文で統一 | PR #71 | 5行を再抽出して完全一致を確認し、`初心者向け度`／`初心者向き度` → **`はじめての方向け度`**、`<th>初心者向け</th>` → **`<th>はじめての方向け</th>`** へ。同一ページの導入文と `<th>` を同一commitで揃えた。**`score-dots` の `filled` 数は前後で完全一致**（低臭 152/48・小型 80/20）＝値は無変更。`method-sub`「情報量・飼育データの豊富さ」と他の列ラベルも無変更。**対象2ファイルの「初心者」は0件**になった。`index.html:4156` の同一文字列は H5 のため無変更 |
| #72 | E-2 `shindan/index.html` の関連リンクカード15行 | PR #72 | 15行を再抽出して行番号まで一致を確認し、**`name: '初心者向け亀'` → `'はじめての亀'`（11件）／`name: '初心者向け亀比較'` → `'はじめての亀比較'`（1件）／`desc: '初心者おすすめ比較'` → `'はじめて飼う方におすすめ'`（3件）／`desc: '丈夫で初心者向き'` → `'丈夫ではじめてでも飼える'`（3件）**。**`url:` 66件の並びは完全一致**、キー名の並び・カード総数66も不変。`COMPARE_MAP`（17 slug）と `ROUTE_FALLBACK`（5キー）を構造比較し **url / 件数 / 順序の差分0・ラベル変化15**。5ルート＋変更カードを含む4シナリオを実描画し href・件数・順序が一致、JSエラー 0/0 |
| #73 | E-3 `shindan/index.html` の可視6行 | PR #73 | バッジ2件 `'🎯 初心者向き'` → **`'🎯 はじめての方向け'`**／生成文2件 `初心者向けの回答…` → **`はじめての方向けの回答…`**／`reason:` 2件 `初心者に最も適した` → **`はじめての1頭に最も適した`**。**`shindan/index.html` の「初心者」はコメント8件のみ**になった。変数名・キー名・`url` 66件・`difficulty`・`beginner` 識別子45件は不変。**新発見: `shindan/species.js` の `reason` に可視の「初心者」が3件残っている**（変更禁止指定のため対象外。詳細は `N4`） |
| #74 | N4 解消 — `shindan/species.js` の `reason` 3件 | PR #74 | **安全ゲート通過**（`species.js` 内に `reason` 参照0件＝`match()`/`score()` 未使用。消費は表示3箇所のみ）。ロシアリクガメ `初心者にも人気` → **`はじめて飼う方にも人気`**／クサガメ `初心者にも飼いやすい` → **`はじめてでも飼いやすい`**／トウブドロガメ `初心者にも向く` → **`はじめての1頭にも向く`**。**difficulty 118件と分布（入門11 / 入門〜中級7 / 中級23 / 中〜上級38 / 上級39）は完全不変**、`reason` 以外の全フィールド（name/latin/slug/cites/size/match/score/priority/availability/emoji/legal/hasPage）も不変。**`shindan/` の公開表示から「初心者」が0件**になった（残るのは `index.html` のコメント8件のみ） |
| #75 | N5 解消 — `js/` 配下の共有スクリプト8件 | PR #75 | **安全ゲート PASS・HOLD 0件**（8件とも比較・分岐 / GA4 / href / キー参照のいずれにも未使用）。8件すべてを **`はじめての方向け`** に統一。`js/quick-facts.js` 2（CTA・111ページ）／`js/starter-kit.js` 2（`🔰` tierバッジ・113ページ）／`js/comparison-cta.js` 2（`points` 配列・12ページ）／`js/ranking-engine.js` 2（ランキング名）。キー名・`icon`・`tier`/`cat` 判定条件・`weights`・`comparePage`・配列要素数・`href` はすべて不変。**`js/` 配下の「初心者」は `annainin.js:127` の非表示キーワード1件のみ**になった |
| #76 | 最終フェーズ — U2 + H5 + H6 + N3 | PR #76 | **「初心者」表記整理プロジェクトを CLOSED**。U1 は変更しないと決定してクローズ（★の71ページ再割り当ては実施しない）。U2 = `CLAUDE.md` に「公開語彙ルール — 「初心者」」を新設（18行の最小差分）。H5 6件 = 難易度軸へ統合せず別軸のまま `はじめての方向け` / `はじめての1頭◎` へ。**既存の「飼育難易度」行は無変更**。H6 3件 = E扱いで一般公開コピーとして置換（勝者バッジ / hero-stat / gh-card-tag）。N3 29件 = **変更17 / 内部互換HOLD 1 / SEO不可分HOLD 11** に分類し、17件を同工程で実装。**公開HTMLの「初心者」は 123 → 97 行になり、説明不能な公開表示は0件** |
| #78 | 商品スニペット無効108件の解消 | `34889c0` | GSC 実測エラー「offers、review、または aggregateRating を指定する必要があります」の解消。`*-best10.html` 7ファイルの JSON-LD `@graph` から **`ItemList` ノードのみ削除**（108アイテム）。`Article` / `BreadcrumbList` は1バイトも変更せず、**JSON-LD 以外の全文が7ファイルとも完全一致**。実描画で Amazon リンク109本・アフィリID付き109本・本文長・h1 が変更前と一致、JSエラー 0/0。**削除のみ（683行削除 / 追加0行）** |
| #79 | sitemap.xml の lastmod 194件を実態へ同期 | `12346ed` | `<lastmod>` は**新規ページ追加時にしか書かれていなかった**（sitemap.xml を触った commit は 190 中 **12** で、すべて種ページ追加の `feat(species)`）。既存ページを編集しても更新されず陳腐化していた。194件すべてを対応HTMLの `git log -1 --format=%cs` へ一致させ、**189件を更新 / 5件は既に一致 / 日付が古くなったものは0件**。`<loc>` の追加・削除・変更・順序変更なし、sitemap.xml 以外の変更なし。生成日は8種類（07-26 17 / 08-14 2 / 08-18 23 / 08-22 7 / 08-23 7 / 08-24 10 / 08-25 73 / 08-26 55）で、**全件同日への一括書き換えではない**。generator 4本 `--check` 差分0 |
| #77 | PR #67 救出 — agent 定義の新規追加と種名誤混入5箇所の修正 | `2cebce4` | `.github/agents/kame-life-guide.agent.md` を新規追加（状態は毎回 `docs/AI-HANDOFF.md` を読む設計）。`species/razorback-musk-turtle.html` の別種「ミスジドロガメ」誤混入5箇所を「カブトニオイガメ」へ。main 上で誤混入0件を確認。**PR #67 は merge せず close 済み**（内容は #68 と #77 に移植済み） |
| #80 | PR #16 救出 — カメふしぎ島への導線を全公開ページへ | `e81be51` | 旧ブランチを merge/rebase せず、現 main へ必要差分だけを実装し直した。**167ページに1本ずつ導線を追加**（hub-links 150 / related-links 9 / フッター6 / hint-links 1 / 404 1）＋ `index.html` の Care Module 05 を更新（8ページ版の説明文・CTA・`kids/otona.html` への副リンク新設）。新規GA4イベント `site_kids_click`。**対象外36ページ**（kids本体9 / 商品レビュー6 / 規約・運営者4 / 診断 / 相談窓口 / kid/ / 実飼育記録3 / テンプレート4 / リダイレクトスタブ3 / before-keeping・photo-credits・updates）。検証は全PASS（Scope外差分0・漏れ0・重複0・リンク切れ0・開閉収支不変・SEO7項目不変・ItemList 0維持・「初心者」97行と「はじめての方向け」24行が不変・generator 4本 --check 差分0・実描画と実クリックでJSエラー0） |
| #81 | パンケーキリクガメの写真差し替え | `5c25a1e` | HOLD 解消。**候補C採用**（photo 263266953 / Julien Lepage / CC BY 4.0 / スイス・飼育個体）。casual grade を許容する判断で決着 |
| #82 | タイワンセマルハコガメの写真差し替え | `6efbba6` | HOLD 解消。**臺北翡翠水庫管理局 / 台北市政府許諾**（CC ではない。出典明記のみで商用可・継承なし・撤回不可）。原寸 2400×1800。産地は出典機関からの推定 |
| #83 | ニカラグアクジャクガメの写真差し替え | `5f70b8d` | HOLD 解消。**Tornadohalt / CC BY-SA 3.0**（File:RPincisa-02c.jpg）。ファイル名と説明の両方に `incisa` が明記され亜種を特定できた。飼育個体 |
| #84 | クロコブチズガメの写真差し替え | `484f93b` | HOLD 外の改善。**OpenCage / CC BY-SA 2.5**。旧写真は川の遠景に2匹が豆粒大で識別点が皆無だった。種レベル同定のため delticola は未解消 |
| #85 | ニシキマゲクビガメの写真差し替え | `1a6ed76` | HOLD 外の改善。**Petra Karstedt / CC BY-SA 2.0 DE**。腹甲の橙色（アカハラの由来）が現行写真に写っていなかった。**原寸 780×520 で 800×600 基準に未達のため、亀好きさん判断で本件に限り基準を緩和**（1.15倍拡大）。種レベル同定のため worrelli は未解消 |

**PR #54 / #55 で確定し、二度と問い直さない判定:**

- `yellow-bellied-slider` = **入門**（公開側の「入門〜中級」が誤りだった）
- `hirase-turtle` = **中〜上級**（公開側の「上級」「非推奨」が誤りだった）
- `matamata` / `sulcata-tortoise` = **上級**（「非推奨」は難易度値ではなかった）
- **「非推奨」「最上級」は難易度値として廃止。** 正本5値以外を公開難易度欄に置かない
- 括弧付き難易度（`中級（入手性は上級並み）` 等）4件は削除済み。補足は既存本文がカバー
- `SHINDAN-SPECIES.md` の *Cuora mouhotii* 二重登録は**解消済み**。
  「モンホットハコガメ」はヒラセガメの**別名**（`species-master.json` の `wamei_aliases`）

### その前の連続作業（種一覧・分類・ガイド同期）

| PR | 作業 | merge |
|----|------|-------|
| #41〜#44 | PR監査／内部リンク残件／species一覧のグループ化／ガイド9本のspecies同期 | `c3b00c1` `1e86385` `07fbd28` `cdc1de1` |
| #45 | 種一覧の4重管理を解消し `species.js` から自動生成 | `f917ebe` |
| #46 | ガイド相互ナビを8本×7リンクの完全メッシュに | `e2126d2` |
| #47 | `species-list` のSEO件数表記を実態に合わせる | `ae54182` |
| #48 | `guides/index.html` のカテゴリを 3/8 → 8/8 に | `9ffbb9d` |
| #49 | 生息環境フィルタを6大分類へ統一（Phase 1C・`LEGACY_HAB` 互換） | `4aed4f0` |
| #50 | 6大分類UIを生成管理へ（Phase 1D） | `838c79f` |
