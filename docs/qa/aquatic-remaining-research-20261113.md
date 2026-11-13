# 水棲・特殊群の残り40行：用品条件と根拠範囲（2026-11-13）

## 到達点
- 既存44件の条件を再実装せず、coverageのinventory-onlyから水棲32・特殊8を抽出。公開slug38件に条件案、slugなし2件はアーカイブ扱い。
- 18件は種向け飼育記事、1件は種向け繁殖者記事、1件は種専門家総説、1件は救護団体文書の転載。他は旧分類2・種から亜種への共通条件1・総説自身の群推定1・科/群一般条件13。
- 全40件について何を確認したかは整理済み。ただし38件すべてを「種別商品適合検証済み」と数えない。器具の実測・実飼育試験は0件。
- JSONは提案データのみ。species.js・商品・URL・GA・法規・公開状態は変更していない。

## 明確に直すべき点
- canton-reeves-turtle: master care.enclosure_jp.japan_fit.basis の「Mauremys reevesii と同種」は誤り。学名正本のM. nigricansとは別種。既存90cmをこの誤った同種換算で確認済みにしない。
- 商品ルートnormal/all/pageKeysの相違は元監査のフラグを維持。成人大型種がallでsemi_aquatic_smallへ落ちることがあるが、分類キーを変えるだけで現品適合済みとはしない。
- 45〜60cm「終生可」等は外部資料で全個体向けに確認できていない。本文条件を追加しても、これらの既存数値を外部検証済みへ格上げしない。

## 取得と採用の境界
- ATPアラバマチズは検索要旨では容器記述を取得したが、本文は認証待ち画面／別ホスト取得不可。検索要旨だけでは種直接確認にせず群一般条件。
- TFTSGのリオグランデクーターは詳細な飼育研究不足と明記。広い成体容器・ろ過・陸場は著者の群推定と分けて採用。白熱球によるビタミンD形成の旧記述は不採用。
- カントンクサはTFTSG2012飼育項を本文確認。隠れ場所・同種間攻撃の観察だけを短く採用。保温値、冷却繁殖例、汚水耐性を一般条件にしない。
- SIGS2004のミナミイシガメはプールとプラスチック陸場を用いる実際の飼育繁殖例。容器の代用品を一律不適としない。ヤエヤマの冬季条件に転用しない。
- ニシキマゲクビ記事のUVB不要・塩素への耐性・混泳保証を採用しない。
- シナ/アルビノは旧広義Pelodiscus資料として示し、アルビノ系統固有の性能/光量保証にしない。塩・固定pH・深水一律推奨を採用しない。
- ドロガメ科総説は属・種差も記す古い資料。陸場不要、分類、年齢、繁殖、薬剤の記述は採用せず、共通的な構造と成体サイズの考慮に限定。
- コウホソはTurtle Oblonga Network 2013の転載本文を取得。原配布元最新版の照合ではない。集団必須・寿命・池の固定寸法を採用しない。

## 種ごとの記録

### ヒラタニオイガメ (`None`)
根拠範囲: archive_no_page_slug
公開ページslugなし。通常の公開条件追加対象ではない。テキサスチズの既存資料は再取得せず、ヒラタニオイの新規個別検証は未実施。

### ミスジドロガメ (`striped-mud-turtle`)
根拠範囲: species_keeper
- 水場だけでなく、上がって休める陸地や隠れ場所を設けます。水面と陸場へ無理なく移れるようにします。
- 子ガメは、空の深い水槽に入れるのではなく、水面近くで休める足場を用意します。水深は体格と動き方を見て調整します。
- 浅い水位では動かせないろ過器やヒーターもあります。使う水位が器具の使用条件に合うか確かめます。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.austinsturtlepage.com/Care/caresheet-3_striped_mud.htm

### スジクビニオイガメ (`stripe-necked-musk-turtle`)
根拠範囲: species_keeper
- 水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。
- 上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。
- 成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。
資料は旧名Sternotherus minor peltiferで記述。本種の飼育条件を参照し、旧分類を現行分類の根拠にはしません。
https://www.zierschildkroete.de/nackenstreifen-moschusschildkroeten-sternotherus-minor-peltifer/

### ホオアカドロガメ (`red-cheeked-mud-turtle`)
根拠範囲: species_keeper
- 水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。
- 上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。
- 成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。
資料は旧広義Kinosternon scorpioidesの各亜種を明示。水面への足場・隠れ場所・陸場だけを参照し、全分類群同一の容器寸法や固定水深にはしません。
https://www.zierschildkroete.de/rotwangen-klappschildkroeten-kinosternon-scorpioides-cruentatum/

### ニシキガメ (`painted-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
資料はChrysemys picta picta/bellii/marginataを対象とします。dorsalisの温度条件には転用しません。
https://www.zierschildkroete.de/zierschildkroeten-chrysemys-picta-bellii-marginata/

### チュウブニシキガメ (`midland-painted-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
資料はChrysemys picta picta/bellii/marginataを対象とします。dorsalisの温度条件には転用しません。
https://www.zierschildkroete.de/zierschildkroeten-chrysemys-picta-bellii-marginata/

### ミシシッピチズガメ (`mississippi-map-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.austinsturtlepage.com/Care/caresheet-mississippi_map.htm

### ニセチズガメ (`false-map-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
G. pseudogeographicaの2亜種を扱う飼育記事。特定商品・ワット数・固定水深・混泳の推奨は転用していません。
https://www.zierschildkroete.de/falsche-landkarten-mississippi-hoeckerschildkroeten-graptemys-pseudogeographica-kohnii/

### ヤエヤマイシガメ (`yaeyama-pond-turtle`)
根拠範囲: species_group_not_subspecies_test
- 水中の隠れ場所と、上がって休める陸場を用意します。陸場へは登りやすい道を設けます。
- ろ過器を使っていても、汚れ方を見て水換えと容器の掃除を続けます。
種Mauremys muticaの飼育例から共通条件だけを参照。亜種kamiの同一温度・同一水深・越冬耐性の検証ではありません。
https://www.sigs.ch/clubdesk/fileservlet?id=1000072

### ミナミイシガメ (`yellow-pond-turtle`)
根拠範囲: species_keeper
- 水中の隠れ場所と、上がって休める陸場を用意します。陸場へは登りやすい道を設けます。
- ろ過器を使っていても、汚れ方を見て水換えと容器の掃除を続けます。
SIGS TESTUDO 13(2), Urs Jost 2004のMauremys mutica飼育繁殖例。プールやプラスチック箱の実用例を確認。屋外・混泳・越冬方法や寸法は全個体の基準にしていません。
https://www.sigs.ch/clubdesk/fileservlet?id=1000072

### ニシキマゲクビガメ（ピンクベリー） (`pink-bellied-side-necked-turtle`)
根拠範囲: species_breeder
- 泳ぐ場所に加え、水中で休める足場や隠れ場所を用意します。流木や岩の間に体が挟まる隙間を作らないようにします。
- 子ガメの容器は成長に合わせて広げます。陸場や設備を置いた後の遊泳スペースも確かめます。
Emydura subglobosaの繁殖者による記事。UVB不要・塩素水への耐性・混泳の一般化は採用していません。
https://reptilesmagazine.com/pink-bellied-side-necked-turtle-care-sheet/

### スワニークーター (`suwannee-cooter`)
根拠範囲: group_only
- 陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。
- 保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。
水棲ガメの共通用品条件。種専用の容器寸法・水深・温度や現行商品の適合確認ではありません。
https://tortoisetrust.org/articles/aquatic.html

### ブランディングガメ (`blandings-turtle`)
根拠範囲: group_only
- 陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。
- 保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。
水棲ガメの共通用品条件。種専用の容器寸法・水深・温度や現行商品の適合確認ではありません。
https://tortoisetrust.org/articles/aquatic.html

### サラドロガメ (`mexican-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### ヨーロッパヌマガメ (`european-pond-turtle`)
根拠範囲: species_keeper
- 水場と日光浴できる陸場を用意し、屋内では陸場の保温とUVB照明を整えます。
- ろ過だけに頼らず水換えを続けます。登って脱走できるため、陸場や設備から容器の縁に届かない配置にします。
Tortoise TrustのEmys orbicularis繁殖記録。使用器具の型番・換水間隔は一例で、現行商品性能の保証にはしません。
https://www.tortoisetrust.org/articles/orbicularis.htm

### カントンクサガメ (`canton-reeves-turtle`)
根拠範囲: species_specialist_review
- 落ち着いて隠れられる場所を用意します。設備を並べすぎず、出入りできる広さを残します。
- 同じ種でもかみ合いが起こるため、複数飼育を前提に用品を選ばず、個別に分けられる環境を用意します。
Anders & Iverson 2012のMauremys nigricans飼育項。クサガメM. reevesiiと同種という既存換算根拠は誤りです。
https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_068_nigricans_v1_2012.pdf

### キイロドロガメ (`yellow-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### ハーレラドロガメ (`herrera-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### シロクチドロガメ (`white-lipped-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### クロコブチズガメ (`black-knobbed-map-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.austinsturtlepage.com/Care/cs-bkmap.htm

### ワモンチズガメ (`ringed-map-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.zierschildkroete.de/pracht-hoeckerschildkroeten-graptemys-oculifera/

### フトマユチズガメ (`ouachita-map-turtle-sp`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
資料はGraptemys ouachitensis ouachitensis向け。サイトのsp表記から別種まで対象を広げません。
https://www.austinsturtlepage.com/Care/cs-ouamap.htm

### サルヴィンオオニオイガメ (`giant-musk-turtle-mx`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### ハナガメ (`chinese-stripe-necked-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
Mauremys sinensis向け資料。特定のランプ出力・設置距離、集団飼育や越冬条件は一般化していません。
https://www.zierschildkroete.de/chinesische-streifenschildkroeten-ocadia-mauremys-sinensis/

### トウブドロガメ (`eastern-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### キタチズガメ (`northern-map-turtle`)
根拠範囲: species_keeper
- 泳ぐ場所と、腹側まで水から出て乾く陸場を用意します。陸場は体重を支えられ、甲羅をこすらず上れるものを選びます。
- 屋内では日光浴のための保温とUVB照明を整えます。ろ過器を使っていても、水換えと掃除は続けます。
- メスはオスより大きくなるため、子ガメ用の容器や陸場をそのまま使い続けられるとは限りません。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.austinsturtlepage.com/Care/caresheet-northern_map.htm

### テキサスチズガメ (`None`)
根拠範囲: archive_no_page_slug
公開ページslugなし。通常の公開条件追加対象ではない。テキサスチズの既存資料は再取得せず、ヒラタニオイの新規個別検証は未実施。

### アラバマチズガメ (`alabama-map-turtle`)
根拠範囲: group_only
- 陸場や隠れ場所を置いた後に、動き回れる広さと水面へ出る道が残るか確認します。
- 保温器具は体が触れたり動かしたりして破損しないように設置します。ろ過器だけに頼らず、汚れを取り除き水換えを続けます。
水棲ガメの共通用品条件。種専用の容器寸法・水深・温度や現行商品の適合確認ではありません。
https://tortoisetrust.org/articles/aquatic.html

### ホオジロクロガメ (`asian-black-marsh-turtle`)
根拠範囲: species_keeper
- 隠れ場所のある陸地と水場を設け、水面へ登って出られる足場を用意します。
- ろ過器を使っていても、水換えは続けます。容器は陸地を入れた後に水中を動ける広さがあるか確認します。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.zierschildkroete.de/schwarze-dickkopf-schildkroete-siebenrockiella-crassicollis/

### ハナナガドロガメ (`narrow-bridged-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### フロリダドロガメ (`florida-mud-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### リオグランデクーター (`rio-grande-cooter`)
根拠範囲: species_review_explicit_group_inference
- 成体まで使うなら、大きな容器と日光浴できる陸場を置く場所を先に確保します。幼体用水槽を終生用とは考えません。
- 水量に見合う循環とろ過を整え、陸場は成長後の体を支えられるものを選びます。
TFTSG 2016は本種の詳細な飼育条件未記載と明示し、Pseudemys共通条件を推定しています。その区別を維持。通常白熱球でD合成可能とする旧記述は採用しません。
https://iucn-tftsg.org/wp-content/uploads/file/Accounts/crm_5_100_gorzugi_v1_2016.pdf

### トゲスッポン (`spiny-softshell-turtle`)
根拠範囲: species_keeper
- 水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。
- 使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。
- 成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://austinsturtlepage.com/Care/caresheet-spiny_softshell.htm

### スベスッポン (`smooth-softshell-turtle`)
根拠範囲: group_only
- 水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。
- 使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。
水棲ガメ案内中のスッポン類の共通条件。Apalone muticaの専用容器・照明・水深を検証したものではありません。
https://tortoisetrust.org/articles/aquatic.html

### フロリダスッポン (`florida-softshell-turtle`)
根拠範囲: species_keeper
- 水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。
- 使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。
- 成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。
本種向けの飼育案内から、用品を選ぶ際の条件を参照しています。掲載商品の性能や組合せを実測したものではありません。
https://www.austinsturtlepage.com/Care/cs-flsoft.htm

### スッポン（シナスッポン） (`chinese-softshell-turtle`)
根拠範囲: historical_species_group
- 水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。
- 使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。
- 成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。
旧分類のPelodiscus sinensis飼育記事を参照。現行の狭義種やアルビノ系統すべてへの製品適合証明ではありません。塩分添加・固定pH・最深水位の一律推奨は採用していません。
https://www.austinsturtlepage.com/Care/caresheet-chinese_softshell.htm

### アルビノシナスッポン (`albino-chinese-softshell`)
根拠範囲: historical_species_group
- 水中に潜って隠れられる砂場と、休める場所を用意します。皮膚や甲羅をこする鋭い装飾・ざらついた足場は避けます。
- 使いやすい陸場も設け、体が挟まらず水面へ出られるようにします。汚れをためず、ろ過と水換えで水を清潔に保ちます。
- 成長後、とくに大きなメスでは一般的な水槽に収まらないことがあります。横幅だけでなく奥行きと設備を置いた後の広さを考えます。
旧分類のPelodiscus sinensis飼育記事を参照。現行の狭義種やアルビノ系統すべてへの製品適合証明ではありません。塩分添加・固定pH・最深水位の一律推奨は採用していません。
https://www.austinsturtlepage.com/Care/caresheet-chinese_softshell.htm

### サソリドロガメ (`scorpion-mud-turtle`)
根拠範囲: species_keeper
- 水中を歩いたり登ったりできる足場と隠れ場所を用意します。水面まで登って息継ぎできる道も残します。
- 上がって休める陸場を設けます。子ガメの水深は、体格と泳ぎ方を見ながら調整します。
- 成長に合わせて、容器の長さだけでなく奥行きや、設備を置いた後に動ける広さも見直します。
資料は旧広義Kinosternon scorpioidesの各亜種を明示。水面への足場・隠れ場所・陸場だけを参照し、全分類群同一の容器寸法や固定水深にはしません。
https://www.zierschildkroete.de/rotwangen-klappschildkroeten-kinosternon-scorpioides-cruentatum/

### スジオオニオイガメ (`giant-musk-turtle`)
根拠範囲: family_group_only
- 水場に加え、上がって休める陸場や隠れ場所を用意します。体が挟まらず行き来できる配置にします。
- 小型種の容器サイズをそのまま当てはめず、成長後の体格と設備を置いた後の広さで選びます。
David T. Kirkpatrickのドロガメ・ニオイガメ科の共通飼育案内。本種単独の寸法・温度・深さや各商品の性能を確認したものではありません。分類・寿命・陸場不要という旧記述は採用していません。
https://www.turtlerescues.com/mud_and_musk_turtles.htm

### コウホソナガクビガメ (`collier-snake-necked-turtle`)
根拠範囲: species_rescue_document_mirror
- 皮膚や腹側をこすらず上り下りできる陸場と、水中で落ち着ける場所を用意します。
- ろ過器に任せきりにせず、水の汚れや温度を確認します。水中ヒーターは接触や破損を防ぐカバー付きのものを使います。
Turtle Oblonga Network 2013文書の転載本文を確認。原配布元の最新版は未照合。飼育条件の一部のみ参照し、集団飼育必須・寿命・固定池寸法を採用していません。
https://paperzz.com/doc/9451149/care-and-husbandry-of-captive-oblong-turtles

## 残る確認の正確な意味
器具の実内寸、使用水位、陸場荷重・面積、ヒーター/ろ過能力、UVIと距離、個体の性別・体格ごとの最終適合は、この文章調査では測れない。条件案は比較時の確認点を提供するものであり、未測定を否定材料にも適合保証にも変えない。
