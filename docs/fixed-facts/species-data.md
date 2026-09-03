# 種データ — 固定入力

> `docs/AI-HANDOFF.md` の FIXED_FACTS 節から分離した参照表（2026-09-03）。
> **固定入力。再検証しない。** 本文は移動時に一切改変していない。
> 索引は `docs/AI-HANDOFF.md` の FIXED_FACTS にある。

---

### 種データ

- **difficulty 正本5値**（正本は `shindan/species.js` の `difficulty`）
  `入門 11 / 入門〜中級 7 / 中級 23 / 中〜上級 38 / 上級 39` = **118**、正本外の値 0
- 掲載種 **118**、うち個別ページを持つ種 **112**
- **6大分類**（正本は `tools/taxonomy.js` の `GENUS_CAT` / `CAT_ORDER`）
  `リクガメ 27 / ヤマガメ・ハコガメ 22 / 半水棲 18 / 水棲（淡水）29 / 汽水 6 / スッポン・曲頸 16` = 118
- **公開difficulty表示は正本と完全同期済み**
  `diff-badge 112 / quick-facts 26 / stat-item 111` = **249箇所・不一致0**
- badge の★は `入門★1 / 入門〜中級★2 / 中級★3 / 中〜上級★3 / 上級★4`
  （中級と中〜上級が★3で重なっている。UNRESOLVED を参照）

- **生成物の上流は `shindan/species.js`。`data/species-master.json` ではない**
  `tools/gen-species-list.js` / `gen-guide-species.js` はいずれも `shindan/species.js` の
  `name` / `latin` を唯一の入力とする（`gen-guide-species.js` 冒頭に明記）。
  したがって **master の `wamei` を変えても生成領域の表示名は変わらない**。
  公開表示の和名を変えるには `shindan/species.js` を変える必要があり、
  `shindan/equipment.js` は**その `name` 文字列を辞書キーにしている**ため、
  片方だけ変えると推奨機材のマッピングが壊れる。**和名変更は master 単独では完結しない。**
- **`species/stripe-necked-musk-turtle.html:195` の `Sternotherus minor` は誤りではない**
  「かつて *S. minor* の亜種 *S. minor peltifer* として扱われた」という**沿革の説明**であり、
  同ページは `Sternotherus peltifer` 5箇所・`minor` 1箇所。**この1箇所は残すのが正しい。**
  監査報告の「該当HTML箇所」は **false positive**。**再指摘しない。**
- **`loggerhead-musk-turtle` の `Sternotherus minor` は正しい**（別種）。
  クレジット層の `オオアタマヒメニオイガメ / Sternotherus minor / obs 203020925` を
  `peltifer` に巻き込んで置換してはならない。

- **マタマタ属の和名は確定した。再議論しない**
  `Chelus orinocensis`（slug `amazon-matamata`）= **オリノコマタマタ**、
  `Chelus fimbriata`（slug `matamata`）= **マタマタ／アマゾンマタマタ**。
  「アマゾンマタマタ」は fimbriata 側を指す名称であり、orinocensis の alias には残さない。
  `data/species-identification.json` の slug `matamata` = `マタマタ（アマゾンマタマタ）` は
  **正しいので変更しない**。`species/matamata.html` の `.latin` は
  `Chelus fimbriata — Amazon Mata Mata` のままで正しい。
  なお **slug は `amazon-matamata` のまま**（URL 互換のため変更しない。
  slug と和名がねじれている件は `data/species-identification.json:77` に記録済み）。
- **和名を変えるときに必ず同時に直す3箇所**（PR #88 で実証）
  ① `shindan/species.js` の `name`（生成領域の唯一の入力）
  ② `shindan/equipment.js` の `SPECIES_EQUIPMENT_MAP` のキー
     （`getEquipment(speciesName)` が `SPECIES_EQUIPMENT_MAP[speciesName]` で引く）
  ③ `species-list.html` の `CAT_OVERRIDE` のキー（`CAT_OVERRIDE[sp.name]` で引く手書きJS）
  この3つは同じ和名文字列で連結しており、**片方だけ変えると機能が壊れる**。
  生成領域（`BEGIN:species-index` / `BEGIN:guide-species`）は上流を直して
  generator を実行する。**生成物を手修正しない。**
- **`docs/phase2/baselines/*.json` は凍結スナップショット。追随させない**
  commit `0bb3185` 時点の Phase2 評価結果の記録であり、現在のデータと一致しなくてよい。
  和名変更で古い名前が残るが、**過去の評価記録を書き換えないため無変更が正しい**。
- **`tools/validate_species.py` は main の時点で既に落ちる**
  `SHINDAN-SPECIES.md` の CITES 列が `None` の行で `TypeError` → exit 1。
  **これは既存の不具合であり、個々の作業の失敗ではない。**
  検証では「変更前後で出力が完全一致すること」を確認すれば足りる。修正は別工程。
- **`scripts/verify_all.py` / `verify_credits.py` はこの実行環境では動かない**
  iNaturalist API へ到達できない（egress ポリシー）。**毎回試さない。**

- **カントンクサガメの実体は確定した。再議論・再調査しない**
  slug `canton-reeves-turtle` = **独立種 *Mauremys nigricans*** / `rank=species` /
  **CITES附属書II**（2026-08-26 亀好きさん確定・分類根拠は外部確認済み）。
  和名「カントンクサガメ」は維持。slug も維持（URL 互換）。
  旧扱い「クサガメ *Mauremys reevesii* の広東型・`rank=regional_form`・附属書III」は**廃止**。
  クサガメ（slug `reeves-turtle` / *Mauremys reevesii* / `rank=species` / **附属書III**）は
  **別種**であり、片方を直すときにもう片方を巻き込まない。
- **カントンクサガメの写真とクレジット4層は、いま書き換えてはいけない**
  掲載写真 `assets/species-photos/canton-reeves-turtle.webp` は iNaturalist photo 233939363
  （mami_t_t / CC BY 4.0 / 2022-09-30・東京都）で、***Mauremys reevesii* としてクレジットされている**。
  *M. nigricans* の写真ではない。クレジット4層（figcaption / `photo-credits.html` /
  `pc_parsed.json` / `credits_map.json`）は**写真の実体を正しく述べている**ので、
  学名を `Mauremys nigricans` に書き換えると**虚偽のクレジットになる**。
  公開ページには「この写真は *M. reevesii* のもの」と明記済み。
  **写真そのものを差し替えたときに、初めて4層を nigricans へ更新する。**
- **`docs/SPECIES-ID-ASSIGNMENTS.md` は古い。真として読まない**
  同ファイルは識別タスクの**担当割り当て記録**であり、
  「reeves と canton-reeves は同一学名 M. reevesii」「canton-reeves(M. reevesii 広東型)」と
  書かれているが、これは PR #89 で**廃止された旧扱い**。歴史的記録として残しているだけ。

- **B判定9件の和名は実装済み。再調査・再判定しない**（PR #90）
  `セオレガメ（ホメアナ）`→**ホームセオレガメ**／`アジアコガシラドロガメ`→**ホオジロクロガメ**／
  `コウキバラガメ`→**リバークーター**／`フロリダレッドベリータートル`→**フロリダアカハラガメ**／
  `スパイニースッポン`→**トゲスッポン**／`スムーススッポン`→**スベスッポン**／
  `ヘビクビガメ`→**オーストラリアナガクビガメ**／`アフリカヨコクビガメ`→**アフリカヌマヨコクビガメ**／
  `セグロヘビクビガメ`→**コウホソナガクビガメ**。slug・URL・学名は1つも変えていない。
- **「ヘビクビガメ」は文脈で意味が変わる。一括置換してはいけない**
  種名 *Chelodina longicollis* としての用法は PR #90 で オーストラリアナガクビガメ へ移した。
  残る50箇所は**すべて意図的残存**であり、次の12パターンのいずれかに当たる:
  `スッポン・ヘビクビガメ`（guide-softshell のカテゴリ名。nav／title／meta／h1／パンくず／
  `shindan/species.js` の links ラベル／`tools/gen-guide-nav.js` のラベル表）／`ヘビクビガメ科`（科名）／
  `ニシキヘビクビガメ`（*Chelodina mccordi* の旧表記・別種）／`ライマンヘビクビガメ`（別種）／
  `水棲のヘビクビガメ`・`水棲ヘビクビガメ`・`背腹二色型ヘビクビガメ`・
  `「ヘビクビガメはヒーターなしでも大丈夫」`（いずれも科レベルの総称）／
  `ヘビクビガメ・ナガクビガメ`・`ヘビクビガメ</span><span>ナガクビガメ`・
  `スッポン類・ヘビクビガメ`・`マタマタ・ヘビクビガメ`（分類群の並記）。
- **B9のうち equipment キーを持つのは4件だけ**（トゲスッポン／スベスッポン／
  オーストラリアナガクビガメ／アフリカヌマヨコクビガメ）。残る5件は**変更前から未マッピング**で、
  `getEquipment` の未解決46件に元から含まれる。**PR #90 は新しいキーを足していない**（劣化ゼロ）。

- **`wamei_aliases` の仕様（PR #91 で確認・確定）**
  所在は `data/species-master.json` **のみ**。形式は文字列配列で、`wamei` の直後に置く。
  **読んでいるコードは1つもない**（master を読むのは `tools/validate_species.py` だけで、
  それも `wamei_aliases` を参照しない）。つまり **FACT-CHECK 正本内の記録項目**であり、
  表示・検索・診断のどれにも接続されていない。
  `species-list.html` の検索は `haystack() = sp.name + sp.latin + sp.slug` で
  **`shindan/species.js` を入力**としており、master も alias も見ない。
  値に `（標準和名）`『（種の別名）』のような**注記を括弧で付ける先例がある**
  （`オオアタマドロガメ（当サイト旧表記・使用実績確認できず）`）。
- **C判定17件の alias は実装済み。再調査・再判定しない**（PR #91）
  保有レコード 7 → **23**、alias 総数 10 → **33**。
  `ロシアリクガメ`＝ヨツユビリクガメ（標準和名）/ホルスフィールドリクガメ、
  `フチゾリリクガメ`＝マルギナータリクガメ、`ヒョウモンガメ`＝ヒョウモンリクガメ、
  `インプレッサムツアシガメ`＝ベッコウムツアシガメ、`パンケーキリクガメ`＝パンケーキガメ、
  `ミシシッピアカミミガメ`＝アカミミガメ（条件付特定外来生物の指定名）、
  `サラドロガメ`＝メキシコドロガメ、`カンバーランドスライダー`＝カンバーランドキミミガメ、
  `ハナナガドロガメ`＝タバスコドロガメ（**既存。今回無変更**）、
  `オオアタマヒメニオイガメ`＝ヒメニオイガメ（種の和名）、
  `マンヤマガメ`＝コスタリカアカスジヤマガメ、
  ダイヤモンドバックテラピン5亜種＝キスイガメ（種の和名）/ダイヤモンドガメ（種の別名）、
  うち `オルナータ` のみ ニシキダイヤモンドガメ を追加、
  `ジーベンロックナガクビガメ`＝チリメンナガクビガメ。

- **別名検索のデータフロー（PR #92 で確立。二重管理しない）**
  正本 `data/species-master.json` の `wamei_aliases`
   → `tools/gen-species-list.js` が読む（キーは **`wamei`**。`slug` を持たない種があるため）
   → `species-list.html` の `// BEGIN:wamei-alias … // END:wamei-alias` へ `WAMEI_ALIAS` を焼き込む
   → `haystack()` が `sp.name + WAMEI_ALIAS[sp.name] + sp.latin + sp.slug` を返す。
  `species-list.html` は外部JSを増やさない方針なので、`taxonomy-data` と同じく**値を焼き込む**。
  **別名を追加したら master だけ直して `node tools/gen-species-list.js` を実行する。**
  `shindan/species.js` には別名を持たせない（二重管理をしない）。
  master の値は**加工せずそのまま**連結する。`（標準和名）` のような注記も一緒に入るが、
  部分一致検索なので注記を除いた別名そのものでもヒットする。
  master に別名があるのに `species.js` に該当種が無い場合、generator は**書き込みを中止する**
  （別名が検索から静かに消えるのを防ぐため）。
- **`キスイガメ` / `ダイヤモンドガメ` が5件ヒットするのは誤ヒットではない**
  どちらも種 *Malaclemys terrapin* の和名で、5亜種すべての別名として登録されているため。
