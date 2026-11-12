# 分類依存4レコードの対象整理（2026-11-12）
読取調査のみ。repo変更なし。基準は親指定PR223相当共有repo。寿命・法令は調査/修正対象外。

## 結論
- ミスジ: 現在の学名と本文はC. trifasciataという種全体。TTWG2025の2亜種を含む対象と定義できる。記録最大は雄23.0/雌26.0cm、scalar最大26へ修正可能。23は基亜種の雌記録で、種全体の上限ではない。
- マレー: 現在の東南アジア広域という説明と2011資料は旧広義C. amboinensis群。これを明記して維持するのが最小修正。C. couroや狭義C. amboinensisに黙って再同定しない。分類対応表を置けば対象の曖昧さは説明で解消可能。
- シナスッポン: 学名P. sinensisを狭義種として解説する旨を明記し、TTWG掲載23.0cmを種の資料記録として扱える。ただし養殖・流通名から各個体の種を保証しない。旧USGS25cmは最大ではない（下記）。
- アルビノ: 色彩変異であって基亜種でも独立種でもない。ページ対象は「シナスッポン名で流通するアルビノ個体」の説明。色だけで狭義種の同定や固有最大サイズを確定しない。種の参考記録とアルビノ固有記録を別扱いにする。

## 1 malayan-box-turtle
現状: Latin Cuora amboinensis / 東南アジア広域 / 25cmを種の最大として紹介。master根拠Schoppe & Das2011は当時4亜種を含む広義種。
2011原典を直接取得: summary p053.1は4亜種とSCL25cm、分布は東インドからインドネシア・フィリピン。これ自体は引用誤りでないが分類の版が違う。
https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_053_amboinensis_v1_2011.pdf

TTWG2025 p242–247・注64 p436（ローカルPDF全文確認）:
- 狭義C. amboinensis: Sulawesi/Moluccas、amboinensisとaurantiaeの2亜種。種最大雄19.2/雌20.8cm。基亜種も同値、aurantiae雄15.5/雌20.1。
- C. couro: couro＋kamaroma。種最大雄21.9/雌27.8cm。旧C.a.couroとC.a.kamaromaを移す。基亜種couro雄21.3/雌25.0、kamaroma雄21.9/雌27.8。
- 旧lineata → C.lineata。雄22.1/雌25.7。
- フィリピン群C.philippinensis、インド等C.praschagiも種として区別。
注64は分類階級の置き方について多少不確実としつつ2023改訂を採用。『全研究者の合意で確定』と書かない。

推奨文案: 「このページでは、従来Cuora amboinensisと呼ばれてきたマレーハコガメの仲間を扱います。TTWG2025では複数種に分けられており、産地・学名によって資料上の大きさも違います。」
25cm箇所は「2011年の旧広義分類の資料値」とラベル付け。現行群全体の絶対上限としない。20.8へ一括変更不可。分類対応表は上記主要3対象を提示し、個体の産地/繁殖記録を確認する行動へ。
master scientific_nameにsensu lato/旧分類のscope note、maxのnoteも2011対象限定。scalarを現行狭義種の最大として機械利用しない設計が必要。27.8を群の代表値として採る場合も『群内C.couro kamaromaの掲載記録』であって全個体の将来値ではない。

## 2 three-striped-box-turtle
現状: C.trifasciata、中国南部。Hainanを除外する記載・基亜種限定なし。よって種全体と定義するのが自然。
TTWG2025 p257: 種全体最大雄23.0/雌26.0。基亜種trifasciata雄21.0/雌23.0、中国本土。p258 Hainan亜種luteocephala雄23.0/雌26.0。C.cyclornataは別種で混ぜない。
旧masterのBlanck2006PDFを直接取得: p29の15–23は旧広義で多くの著者が記す範囲。p50には雌23/雄18の地域群記録、p56にも雌23/雄19がある。しかし2017記載の海南亜種を含む2025種全体最大を23で固定する根拠にはならない。既存noteの『cyclornata・aurocapitataを分けて23』は今回の最大値選択の根拠として撤去/歴史メモへ。
https://iucn-tftsg.org/wp-content/uploads/file/Articles/Blanck_etal_2006a.pdf
修正箇所: master最大26、診断core/specs26(資料上限)、種ページ出典段落に種全体/基亜種の別。通常17〜21を26へ機械置換せず、独立した根拠がなければ通常範囲断定を保留。年齢予測10〜14/14〜18cmも別根拠なし、今回確認済み扱いにしない。
付随して本文『黄色い縦ライン』はTTWG語源説明three longitudinal dark stripesと反対。形態対象説明を直すなら『背甲の3本の暗色の縦帯』。

## 3 chinese-softshell-turtle
現状: Latin P.sinensis、分布中国/日本外来/東南アジア、食用養殖流通説明、本文25〜35cm、診断最大35、master25。
TTWG2025 p403: 狭義P.sinensisのMax SCL23.0cm(Farkas2019)。native China/Taiwan、Japanなどintroduced。『東南アジアに広く分布』だけでは自然分布と移入混同。注21:104 p490は養殖/野生標本の不明・系統混合のため安易な分布結論を避ける。注92はP.variegatusを別種扱いする理由を記す。
USGS旧出典https://nas.er.usgs.gov/Queries/FactSheet.aspx?SpeciesID=1278
直接取得403、大小文字URL変更でも403。検索インデックス本文は『carapace ... length averaging112–250mm』、典拠Mao1971/Ernst&Barbour1989/Ernst1994。25を最大記録へ変換するのは不適切。これは今回の資料差以前に平均的範囲と最大の意味の違い。
Farkas2019 DOI https://doi.org/10.3897/zookeys.824.31376
原著PDF403、PMCはreCAPTCHA画面で本文未取得。23cmはTTWG本文で確認済み、元論文表の独立確認とは区別。
推奨: 『ここでは学名P.sinensisとして扱われるシナスッポンを説明します。古い資料や養殖・流通名には他のPelodiscusが混在することがあり、販売名だけで個体の分類は確定できません。』記録欄を『TTWG2025がP.sinensisについて掲載する最大SCL23cm。流通個体すべての成長上限ではない』に。旧25〜35/将来25〜35/年齢数値をこの資料で正当化しない。

## 4 albino-chinese-softshell
master rank varietyは色変ラベルとしてなら分かるが、note『基亜種P.sinensisと同値』は誤り（P.sinensisは種名）。『アルビノは色彩変異で体サイズは変わらない』という同一サイズ保証にも今回資料なし。
対象を『シナスッポンの名で流通するアルビノ個体（色彩変異）』とし、種の参考記録23cmとアルビノ系統固有の最大記録未取得を分ける。単純にmaster25→23としてアルビノの最大確認済み扱いにしない。数値フィールドしかない場合null＋説明、または明示的な種由来reference値フィールドを追加する。
直せる箇所: 基亜種の誤用、固有種/品種であるかの混同、体サイズ同一保証、通常25〜35の出典不明断定。アルビノ名から現在の野生分類を再同定する必要はない。

## 共通根拠
https://iucn-tftsg.org/wp-content/uploads/crm.10.checklist.atlas_.v10.2025.pdf
印刷ページ+18がPDF1始まりページ。該当本文と前後のtaxon見出しをローカルrawtextで読んだ。元研究すべての独立取得・実物同定はしていない。今回4件は『対象の説明と資料の意味の整理』まで閉じられる。飼育者個体の分類/アルビノ系統最大は依然販売記録・同定資料を要するが、記事編集を止める理由ではない。

## 実装用具体案（親へ共有）
|slug|master.value|診断core/specs|scope|
|---|---:|---|---|
|malayan-box-turtle|27.8|27.8cm（旧広義群内の資料記録）|旧C.amboinensis s.l.に含まれたkamaroma。現C.couro kamaroma雌の記録。狭義種最大ではない|
|three-striped-box-turtle|26|26cm（種全体の資料上限）|trifasciata+luteocephalaの種全体|
|chinese-softshell-turtle|23|23cm（狭義P.sinensisの資料記録）|狭義種の編纂資料。販売名/養殖個体すべての上限保証ではない|
|albino-chinese-softshell|null|色彩型固有の記録なし|アルビノ固有記録は未取得。sizeNoteに種の23cmは参考とする|

マレーについて旧広義群内の最大を置く根拠: 2011旧種にkamaromaが明示的に含まれ、その再配置先が2025 C.couro kamaroma。旧広義群に属する現5種の掲載最大はC.amboinensis20.8、C.couro27.8、C.lineata25.7、C.philippinensis17.3、C.praschagi25.0。したがって今回確認した群内記録として27.8は使える。ただし新しい同定/『あらゆる流通マレーの絶対上限』は主張しない。TTWG値の一部は未発表データを含むためLIKELY相当、学術編纂資料引用であることを維持。

## 実装・検証追記
2026-11-12: 親承認後、担当4種HTMLに上記対象範囲を反映したローカル候補を作成。冒頭の読取調査のみは調査時点の記録。commit・push・公開なし。
- マレーのtitle/OG/h1/Latin/説明/追加FAQとJSON-LDは旧広義群を明示。
- 4種HTMLの年齢からサイズを予測する文と未裏付け通常範囲を撤去。寿命の文と数値は変更なし。
- JSON-LD全ブロック解析、ID重複なし、マレー追加FAQ可視/構造化一致を機械確認。
- HEAD比で商品URL、lifespan設定、寿命を含む文、CITES/附属書の文を抽出比較し不変。
- git diff --check PASS。画面検証は親のPC工程へ。
- 外部の旧比較値25〜35cm: species/smooth-softshell-turtle.html、spiny-softshell-turtle.html、florida-softshell-turtle.html 各278行。担当範囲外のため親へ報告、変更なし。
