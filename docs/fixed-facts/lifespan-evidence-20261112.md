# 寿命8種の根拠確認（2026-11-12）

Conforms-to: Constitution v2.x

BASE: e94ef55284f847eb845d46427701bd0307ea144a
状態: 調査結果に基づき本文・診断・共通表示・案内人のローカル候補へ反映済み。未公開。平均寿命の数値正本を確定する文書ではない。

対象は小型7種＋ヘルマン。全121種の寿命の確認ではない。平均寿命・飼育期間の記録・一般案内を区別し、数値範囲を一律で正本に流し込まない。

## 掲載可能な表現と根拠

|種|確認できた根拠|掲載文案|分類・限界|
|---|---|---|---|
|ミシシッピニオイガメ|カナダ管理計画2024は平均不明、飼育54年以上。Slavens原表にも54年9か月、成体入手|「平均寿命は不明ですが、飼育下で54年以上生きた記録が報告されています。」|記録。平均50年、上限54年とは書かない|
|カブトニオイガメ|Slavens原表29年4か月、雌、入手1968-08-14、報告時生存。AnAge29.3年|「29年以上にわたる飼育記録があります。一般的な寿命や上限を示す数字ではありません。」|飼育継続期間。出生年不明|
|シロクチドロガメ|Slavens原表19年2か月、雄、野生由来・成体入手、死亡、Snider1992。AnAge19.2年|「成体で迎えてから19年以上飼育された記録があります。」|生まれてからの年齢でも寿命上限でもない|
|フロリダハコガメ|Slavens原表にT. c. bauri固有の22年7か月、野生由来、死亡、Bowler1977。|「フロリダハコガメには22年以上の飼育記録があります。」|他亜種の50〜100年を転用しない。正確な平均未確立|
|ニホンイシガメ|福岡市動物園は雄約10〜15年・雌約20〜30年と案内。Slavens原表16年2か月は成体入手・生存中|「福岡市動物園では、寿命の目安を雄約10〜15年、雌約20〜30年と案内しています。」|動物園の案内値。野生/飼育や統計定義は未記載。平均・最大の確定値にしない|
|スペングラーヤマガメ|Cincinnati Zoo公式紹介はMore than 20 yrs|「シンシナティ動物園は寿命を20年以上と案内しています。」|一般案内。平均・上限や野生/飼育区分は示されない|
|ロシアリクガメ|Highfield/Tortoise Trustの記事2024（更新2025）で1960年代初頭輸入の雌が2024年時点で生存|「Tortoise Trustは、1960年代初頭から2024年まで飼育されている個体を紹介しています。数十年先まで世話を続けられる計画が必要です。」|専門家の具体例。約60年の飼育で年齢・平均・最大ではない|
|ヘルマンリクガメ|IUCN TFTSG種アカウント2011は野外で数十年、最大不確実。AnAge最大未確立|「数十年単位で世話を続けることを見込む種です。寿命の上限は十分に分かっていません。」|生存率から寿命を計算しない。31.7年を最大寿命、逸話90年以上を確定値にしない|

## 直接確認した出典

1. Slavens飼育記録原表（動物園・私設コレクションの集計。更新停止済み、最新世界記録ではない）
https://www.pondturtle.com/lturtle.html
方法・定義 https://www.pondturtle.com/longev.html
更新終了の告知 https://www.pondturtle.com/welcome.html
原表は入手日・入手時成体/幼体・報告時生存/死亡を分ける。ここを落とすと寿命に誤変換される。

2. カナダ政府管理計画2024（同一調査の直接取得資料）
https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/management-plans/eastern-musk-turtle-2024.html

3. AnAge（比較・出典追跡用の二次DB、原表優先）
https://genomics.senescence.info/species/entry.php?species=Sternotherus_carinatus
https://genomics.senescence.info/species/entry.php?species=Kinosternon_leucostomum
https://genomics.senescence.info/species/entry.php?species=Mauremys_japonica
https://genomics.senescence.info/species/entry.php?species=Testudo_hermanni

4. 福岡市動物園
https://zoo.city.fukuoka.lg.jp/animals/detail/117

5. Cincinnati Zoo
https://cincinnatizoo.org/animals-archive/black-breasted-leaf-turtle/

6. Tortoise Trust / A. C. Highfield（本文冒頭、2024年の生存例）
https://www.tortoisetrust.com/post/captive-care-of-the-russian-tortoise-testudo-horsfieldii

7. IUCN TFTSGヘルマン種アカウント2011（同一調査の直接取得資料を再利用）
https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_059_hermanni_v1_2011.pdf

## 解消したこと / 残ること
- 上記8種で「根拠なしの寿命範囲」の代わりに記載できる資料付き文案が得られた。すべての平均寿命が確立した、という意味ではない。
- フロリダを他亜種の寿命で代用する必要はなくなった。
- Slavensの原表まで到達したが、Bowler1977/Snider1992の刊本そのものや各園の飼育台帳は今回未閲覧。一次飼育台帳まで照合済みとは言わない。
- 日本の環境省 https://ikilog.biodic.go.jp/rl_rdb/a/952.html は検索本文に「正確な寿命は不明」とあるが直接取得503。主たる根拠にせず福岡市動物園本文を採用。
- 寿命欄のデータモデルは `typical_estimate / captivity_duration_record / institutional_guidance / unknown` など意味を保存する必要がある。数字だけのmin/maxへの機械的転記や診断での比較は誤解を生む。
- 調査時点では文書のみ追加。その後、同一候補で対象8種の表示経路と案内人を修正。公開は未実施。
