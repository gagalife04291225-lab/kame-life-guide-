# 第3群 条件文クロスレビュー（2026-11-12）

コード変更なし。対象はland2種の自己再点検＋aquatic8種の別担当クロスレビュー。landは自身の作成物なので独立レビュー完了とは呼ばない。水棲6URLを本文取得し、対象と文脈を確認した。

## 判定
条件文そのものに明確な生態上のBLOCKERはない。ただし下記SHOULD-FIXと既存記事の矛盾を残したまま「整合済み」としない。

### 条件文の修正推奨
1. impressed items[2]：「キノコを中心に、葉物などの植物性の餌も組み合わせます。一般的なリクガメ用フードだけで食事がそろうとは考えないでください。」へ。現文も唯一食とは言っていないが、植物も明記すると誤読が減る。温度数値は追加しない。
2. leopard items[2]：「掘れる床材を用意し、清潔に保ちます。湿り気のある隠れ家も設け、水場などを置いた後にも歩ける場所を残します。」へ。全床を一律に湿らせ続けるように読める現文より、湿った隠れ家という資料の区別が明確。
3. florida-red-bellied noteの「大きい価格帯」は「高い価格帯」か「高価格帯」へ。価格と水槽寸法は別なので、全文は「高価格帯の候補でも、成体の体格に合うか確認が必要です」が自然。
4. penaltyではないが2クーターの「子ガメ用の水槽で終わりにせず」は小さい容器から開始する前提。最初から大きく始める方法もあるので「子ガメ時の体格だけで決めず、成体まで使える広さを見込むか、成長に合わせて広げる計画を立てます。」にすると既存growth方針と合う。

### 水棲出典の適用確認
- eastern/western-painted：Tree of Lifeは両亜種を明示。幼体/成体容器を区別し、完全に乾ける陸場、UVBと加温、ろ過と換水を案内。条件文は数値の横流しをしていない。
  https://treeoflifeexotics.vet/education-resource-center/for-clients/turtles/painted-turtle-care
- razorback/loggerhead：ATP各種本文は上陸場所と幼体の浮草、広い水域を案内。深水の記述を全幼体へ強制していないので妥当。水位に合うろ過器という文は製品個別の適合証明ではなく確認事項。ATPだけで国内照明SKUを適合済みとするのは不可。
  https://www.austinsturtlepage.com/Care/cs-razrbk.htm
  https://www.austinsturtlepage.com/Care/cs-logger.htm
- mississippi-mud：ATPは旧学名を明示、特に幼体の浅水と、成体の深め水域でも足場/上陸路が必要な文脈。条件文は成体の水深例を幼体に移植していない。
  https://austinsturtlepage.com/Care/cs-mismud.htm
- florida-red-bellied：P.nelsoni本文、雌雄差/広水域/UVBと陸場加温。水中ヒーターは水温が不足する場合という条件で、JSONも「加温する場合」としており妥当。
  https://www.austinsturtlepage.com/Care/cs-flredbelly.htm
- peninsula/river：Winter Parkの対象一覧に両種を含む。本文は水棲亀共通。成長に応じた広さ、全身が乾く安定した陸場、UVB、加温/換水を裏付けるが、種固有温湿度・寿命・全商品の適合に拡張しない。sourceNoteはその区別を明示済み。
  https://wpvet.com/exotic-pets-care-guides/aquatic-turtles/

## 同時是正すべき既存記事（行番号は確認時）
- eastern-painted 318「60cmでも十分」vs292「60開始・成体90」。FAQ114/331も成体サイズを理由に60から飼えるとし段階が曖昧。開始容器と成体目安を区別、長辺のみで十分と断定しない。FAQはJSON-LDも同時に。
- florida-red-bellied 233成体60～90、291終生90～120、306成体120。正本の目安と段階を合わせ、奥行/陸場を条件にする。海外gallon値をそのまま国内cmへ換算しない。
- peninsula FAQ117/420「90cm以上終生」vs375「成体メス120以上」。体格と性別の条件をそろえ、FAQ/JSON-LDを同時修正。
- river291「成体90～120」vs306「成体120」。開始/成体を区別し、同じページの目安を統一。
- razorback FAQ105/431の比較対象ミシシッピニオイ「終生45～60」は既修正musk方針と衝突。該当種の現行成体目安へ合わせる。291の「ニオイガメ属と近縁」は本種自身も同属なので分類上不自然。「ミシシッピニオイガメと同属」等へ。背甲高2～3倍の一律基準は今回のATPでは確認できない。
- loggerhead369/390、mississippi-mud248/273/276/435/516/537/542の「終生可」「十分」は条件文の個別確認と温度差がある。当サイト目安と明示し、陸場を置いた後の奥行/水量・体格の条件を合わせる。値そのものを別値へ一括変更する根拠ではない。
- western-painted293の「オス60可・メス90～120」も目安と条件を区別。今回取得病院の大きい容量を唯一基準に置換しない。
- impressedの同時修正はland-round3-temperature-diet-proposals-20261112.mdの一覧。生息地気温/夜の退避場所/孵卵温度は別。冷却専用のような説明、野草中心の食性、FAQ固定回数/衰弱断言を残さない。
- leopard401「タンパク質をほぼ必要とせず」は低タンパクと不要の混同。草・牧草中心という食材説明へ。温度既存数値の根拠問題は前のMDに記録。

## 限界
RVC leopard PDFはこの再確認で403（以前の取得報告と区別）。Tree of Life leopard本文は再取得し、湿った隠れ家/成長段階/加温退避所を確認した。水棲6URLに取得不能なし。10種の全用品SKU性能/幼体各齢/個体健康状態の保証、実画面回帰、全サイトの全文章監査は今回実施していない。

Concrete proposed copy: see group3-linked-copy-proposals-20261112.md (not implemented).
