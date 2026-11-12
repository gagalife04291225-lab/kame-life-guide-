# 分類依存3件：調査結果・修正案（2026-11-12）
対象: greek-tortoise / cherry-head-tortoise / red-cheeked-mud-turtle
基準: main 8518b01b。調査後、承認範囲の種ページ3枚と識別データの分類注記を候補修正。master・診断・SHINDAN-SPECIES.mdは別担当。commit・pushなし。
共通資料: TTWG 2025 第10版（ローカル全文を直接確認）
https://iucn-tftsg.org/wp-content/uploads/crm.10.checklist.atlas_.v10.2025.pdf

## 結論とデータ設計
|対象|推奨 max_shell_length_cm.value / verification|診断欄のラベルと表示|閉じられる範囲|
|---|---|---|---|
|greek|46 / NEEDS_REVIEW（数値はTTWG掲載記録。LIKELYより疑義を明示）|「報告最大甲長（疑義あり）」→「46cm（オス・原記録に誤りの可能性）」|資料が何を述べるかは確定、46という測定自体は確定しない。研究上の疑義を保持し、記事/診断/masterの意味を統一して表示上の不整合は閉じられる|
|cherry|null / UNPROVEN（チェリーヘッド固有上限として）|「甲長の飼育記録」→「30cmの雌の記録（上限ではない）」|流通名であって独立した種・亜種の上限ではないことを明記。記録30cmは別 evidence/captive_record フィールドへ。nullだけにして読者への情報を削らない|
|red-cheeked|16.6 / CONFIRMED（TTWG2025の狭義K.cruentatum掲載値として）|「資料に記録された最大甲長」→「オス16.6cm・メス14.8cm」|ページ対象を現行の大西洋側K.cruentatumと明記し5層同期すれば閉じられる。旧流通名の全個体が狭義cruentatumだとは保証しない|

注意: 集計がvalueだけを見る場合、greekのNEEDS_REVIEW46やcherryの個体記録30を確定上限に混ぜないこと。現行スキーマがNEEDS_REVIEWで数値を許容しないならgreekもvalue:null＋reported_maximum:46＋疑義注記が適切。最大欄に無理に単一の「確定数値」を要求しない。

## 1. Greek / Testudo graeca
### 現行との対照
- サイト学名は種全体Testudo graeca。イベラだけの記事ではない。
- master.value30は旧TFTSG記述の通常範囲をmaxとして扱っており、同じnoteの例外46と意味が衝突。
- TTWG2025 p354-355: 種全体に11亜種、最大SCL雄46.0/雌31.5cm。
- 11亜種はgraeca, armeniaca, buxtoni, cyrenaica, ibera, marokkensis, nabeulensis, terrestris, tripolitania, whitei, zarudnyi。anamurensisはterrestrisの異名欄であり、現行有効亜種として別枠に数えない。
- 現行の亜種表「ムーア（アルジェリア）T.g.graeca」はTTWG2025の狭義graeca（Morocco）と範囲がずれる。総称/流通名と現行学名を分ける必要がある。

### 原典の重要な留保
TFTSG東側種概説2023のPDFを直接取得。
https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm.5.120.eastern.graeca.v1.2023.pdf
DOI:10.3854/crm.5.120.eastern.graeca.v1.2023
120.6（PDF7枚目）: buxtoni節でRezazadeh et al.2014のArdabilの雄46cm報告を取り上げ、誤りの可能性があると明記。TTWG2025が採用してもこの疑義を隠さない。
原著Rezazadeh2014自体の測定表・標本は今回未取得。資料値46を生物学的確定上限とはしない。

### 自然な掲載文
「このページはギリシャリクガメ全体を扱っています。大きさは亜種や産地によって異なります。TTWG（2025）にはオス46cm、メス31.5cmの記録が載っていますが、46cmの原記録には誤りの可能性も指摘されています。一般的な成体サイズや飼育容器の目安とは分けて見てください。」

### 修正箇所案
master最大値とnote/出典、species.js coreSpecs.size＋specs最大甲長＋sizeNote、greek種ページの最大表現・亜種表・対象範囲説明。亜種表は「分類上の亜種／流通名」を区別。飼育温度・冬眠を分類名だけで新しい数値へ換算しない。サイズ15〜25cm等を一般範囲として残す場合は独立した根拠が必要。

## 2. Cherry-head / Chelonoidis carbonarius内の流通名
### 分類・旧出典
- TTWG2025 p310-311はC.carbonariusを種として扱い、cherry-headという独立種/亜種を認めていない。
- 種全体の最大SCL雄59.3/雌44.2cmをチェリーヘッド固有上限へ流用してはいけない。
- TTWG注77 p438はコロンビア東西系統のESU研究を論じるが、チェリーヘッドの正式分類確定ではない。
- 現行master.rank=varietyは正式な動物分類階級と誤読される。scientific_nameはC.carbonarius（species）、display/trade_nameは「チェリーヘッド」と別に保持する案。
- 旧Chewy本文を再取得できた。2026-02-11更新、成体9〜14inという獣医監修ケアシート。これは計測標本付きの最大記録ではない。35cmは14in=35.56cmを丸めた一般案内であって分類群の上限根拠ではない。
https://www.chewy.com/education/reptile-and-amphibian/general/cherry-head-red-footed-tortoise-care-sheet
- 旧PetGuideは直接取得不能(non-retryable)。存在しないとは判定しない。
- Tortoise Library（一般飼育資料、一次分類研究ではない）もこの名称が販売呼称であり、矮小個体の保証にならないことを説明。
https://tortoiselibrary.com/species-information-2/chelonoidis/red-footed-cherry-head/

### 新たに取得した直接飼育報告
Carl May (2012), An Incident of Triplets in the Red-footed Tortoise, Chelonoidis carbonaria (Spix, 1824). Schildkröten im Fokus Online 1:1–10.
https://chelonia-science.de/images/artikel/2012_1may_en.pdf
PDF本文p1: 飼育者の雌1頭が1999年にSCL15cmの幼体として入手され、2002年末に26cm超、報告時30cm。ブラジル輸入という来歴はallegedly（伝聞）とされる。
→ 掲載できるのは「チェリーヘッドとして飼育された雌に直線甲長30cmの記録」。この1頭から平均・最大・成長カレンダー・確定産地を算出しない。

### 自然な掲載文
「チェリーヘッドは、アカアシリクガメの一部に使われる流通名です。正式な別種・亜種名ではなく、この呼び名だけで産地や成体の大きさは決まりません。飼育報告には直線甲長30cmの雌も記録されていますが、チェリーヘッド全体の上限を示す数字ではありません。」

### 修正箇所案
master:35を上限として維持せずnull、分類rank整理、具体的飼育記録を別note/evidenceに保持。species.jsと種ページは最大欄を上記ラベルへ。
ページlead/向いている人/10年後/分布/FAQ可視＋JSON-LDにある「小型なので管理しやすい」「ブラジル北東部・ガイアナに分布」「通常型と同一飼育」を確定事項として扱わない。販売名で断定せず来歴確認の案内へ。餌や容器寸法は本調査から新規設定しない。

## 3. Red-cheeked / 狭義 Kinosternon cruentatum
### 分類を閉じられる証拠
TTWG2025 p133、注37-38 p431-432を直接確認。
- K.scorpioidesの亜種ではなくK.cruentatumを採用。
- 旧広義cruentatumの太平洋側をK.mexicanum、大西洋側をK.cruentatumとする。
- 狭義cruentatumの最大SCL雄16.6/雌14.8cm（Iverson2010; Berry & Iverson2011）。分布はMexico/Belize/Guatemalaの大西洋側。
- 参考: K.mexicanumはp138-139、雄14.3/雌14.5cm（Iverson & Berry2024）。これを新しいページとして作成する必要はない。
- 旧master20は広義K.scorpioides値の転用、出典URLはK.dunni論文で対象不一致。

### 一次研究本文の取得結果
1. Hurtado-Gómez et al.2024 DOI10.1016/j.ympev.2024.108083
ScienceDirect直接取得403、PubMed直接取得は内容が欠けたが、ResearchGate上の著者Uwe Fritz公開全文（2024-05-11 upload）を取得し、本文4.2/結論のcruentatum独立種支持を確認した。抄録だけの確認ではない。
https://www.researchgate.net/publication/380132166_Diversity_and_biogeography_of_South_American_mud_turtles_elucidated_by_multilocus_DNA_sequencing_Testudines_Kinosternidae
2. Iverson & Berry2024 DOI10.2744/CCB-1589.1, CCB23(1):13–22
ResearchGate全文を取得し、形態計測方法・大西洋型cruentatum/太平洋型mexicanumへのタイプ割当と分布を確認。
https://www.researchgate.net/publication/381973945_Morphometric_Variation_in_the_Red-Cheeked_Mud_Turtle_Kinosternon_cruentatum_and_its_Taxonomic_Implications
補足標本計測データS1自体は未取得。TTWG記録16.6/14.8の元のIverson2010の標本台帳まで遡ったとは言わない。

### 自然な掲載文
「このページでは、TTWG（2025）が独立種として扱うKinosternon cruentatumを紹介します。以前はサソリドロガメの亜種K. scorpioides cruentatumとされていました。現在は太平洋側の個体群をK. mexicanumと分けるため、古い販売名や資料では範囲が異なることがあります。」

### 同期が必要な箇所
data/species-master.json scientific_name/max_shell_length_cm、shindan/species.js latin/最大/注記、SHINDAN-SPECIES.md学名、species/red-cheeked-mud-turtle.html meta/Latin/本文/構造化情報、data/species-identification.jsonのgakumeiとunresolved（5層）。後者の「原典またはTTWG2025本文到達待ち」は今回取得により解消可能。
CITESの規制上の名称と科学分類は別。既存の法令掲載区分や購入書類の名称を自動的に書き換えない。既存写真が狭義cruentatumかは今回判別しておらず、流通個体の同定保証はしない。

## 今回の候補実装・検証
- 3種HTMLのカード・本文・比較表・meta・FAQ/JSON-LDを調整。greek46cmは数値直近に疑義。cherryは飼育雌30cmの記録に限定し、35cm上限・確定産地・小型だから容易という説明を撤去。red-cheekは狭義大西洋側K.cruentatumを説明し16.6/14.8cm表示。
- 全3ページの年齢別甲長/体重予測を種・個体差と記録の説明へ変更。寿命・CITESの掲載内容・購入先URLは保持。
- species-identification.jsonはred-cheek対象のサイズ・分布・分類注記を同期。追加指示に従いthree-toedの学名・旧分類採用方針注記もT.triunguisへ変更し旧名を保持。CITESの掲載区分は不変。
- 3ページのJSON-LD解析、可視FAQと構造化FAQ全文一致、購入/法令出典リンク順序のHEAD一致、lifespan引数HEAD一致、ID重複なし、年齢別甲長予測なしを検査PASS。identification JSON parseとgit diff --check PASS。
- 実ブラウザ確認は統合後の担当へ。

### 独立レビュー指摘の追加修正
- チェリーヘッドの適性欄から「最終サイズ20〜30cm」を撤去し、成長時に飼育場所を広げられるかという条件へ変更。赤い頭部の魅力の重複を解消。
- 識別データのミツユビハコガメは現行の独立種説明へ同期。旧名は文献・流通上の名称として保持。通常成体11.3〜15cmと最大記録17.9cmを分離し、指の数だけでの種断定を避けた。法令記載は変更していない。
