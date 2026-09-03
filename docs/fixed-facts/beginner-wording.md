# 「初心者」公開表現 — 固定入力

> `docs/AI-HANDOFF.md` の FIXED_FACTS 節から分離した参照表（2026-09-03）。
> **固定入力。再検証しない。** 本文は移動時に一切改変していない。
> 索引は `docs/AI-HANDOFF.md` の FIXED_FACTS にある。

---

### 「初心者」公開表現（Phase A の分類・**再分類しない**）

- 公開表示 **239件 / 87ファイル**（基準 `6bb2fb0`）
  `A 難易度 62 / B 飼育経験 52 / C おすすめ 22 / D 注意・警告 24 / E 見出し・CTA・ナビ 67 / F その他 12`
- 処理済 183件（B-1 37 + B-2 37 + A-1 26 + A-4 5 + H1 14 + A-5 3 + B18 1 + H2 2 + C 22 + D 24 + F 11 + H4 1）→ **残 56件**
- **A-1 は完了。** species 個別ページの quick-facts ラベルは `飼育難易度`。
  `初心者向き？` は species/ 配下に残っていない
- **B分類（飼育経験）52件は 52/52 完了・未処理0。** 冬眠まわりの可視文とJSON-LDは同期済み。
  **B分類はクローズ。再監査しない**
- **A-5 は完了。** 見出しは `はじめての1頭に向くか`。
  `初心者に向くか` はリポジトリ内に残っていない
- **C分類（おすすめ・選び方）22件は完了・未処理0。** 「初心者におすすめ／人気／飼いやすい」は
  「はじめて飼う方」「はじめてでも」「はじめての1頭」系へ置換済み。推薦強度は変えていない。
  **C分類はクローズ。再監査しない**
- **D分類（注意・警告）24件は完了・未処理0。** 抽象的な「初心者には難しい」を
  難所を名指しする文へ書き換え済み。難所の内訳は
  湿度・温度の同時管理9 / 情報・流通の乏しさ3 / 汽水・塩分管理2 / 終生サイズ2 /
  給餌・取り扱い1 / 除外リストの条件化2 / 冬眠4 / 主語削除1。
  **D分類はクローズ。再監査しない**
- **F分類（その他）12件は 12/12 完了・未処理0。** 残っていた H4 は PR #68 で解消済み。 読者層の指定・採点基準の説明・UI例文を
  「はじめて飼う方」「飼育経験が浅いうちは」系へ置換済み。**F分類はクローズ。再監査しない**
- **残る未処理は A分類の残り28件（62 − A-1 26 − A-4 5 − A-5 3）と
  E分類の残り28件（67 − B-2 37 − H2 2）の合計56件。**
  （旧記述の「E 30件」は内訳と合っていなかったため、固定入力どうしの差し引きで訂正した。
  Phase A の分類そのものはやり直していない）
- **`annainin` の公開表示から「初心者」は0件。** `js/annainin.js` に残る1件は
  `INTENT_RULES` の分類キーワードで**非表示・変更禁止**（N2 は解消済み）
- **未処理の HOLD は 0。** Phase B-1 / B-2 由来の HOLD 16件（JSON-LD複製14 + B18 1 + H2 1）は
  すべて解消済み。以後、これらを HOLD として扱わない
- **`shindan/index.html` の exit-capture カードは `はじめての亀 TOP3` 系で統一済み。**
  `ec-btn-guide` の `href` / `id` / GA4イベント（`exit_capture_click` / `target_type`）は無変更
- **A-4 は完了。** 対象5ページのFAQ問いは `はじめて飼う亀に向きますか？`。
  可視 `<summary>` と JSON-LD `"name"` は一致している。
  残る「初心者向けですか？」2件は**複合質問で対象外**
  （`guide-beginner.html`「リクガメと水棲ガメ、どちらが初心者向けですか？」／
  `species/razorback-musk-turtle.html`「ニオイガメとカブトニオイガメ、どちらが初心者向けですか？」。
  いずれも Phase A では E分類）
- **「初心者向け」→「入門向け」の一律置換は禁止。** 「入門」は既に難易度値として
  公開HTML内で128件使われており、件数の異なる集合が同じ語になる
- **商品スニペット（Product リッチリザルト）はサイトとして出さない方針**（PR #78）。
  本サイトは商品を販売しておらず Amazon へ送客する比較記事のため、Google の Product
  構造化データが想定する「自サイトの商品ページ」に当たらない。
  `offers`（価格・在庫）の追加は **Amazon アソシエイト規約リスクのため恒久的に禁止**。
  GSC 実測でも商品スニペットは **有効0**（一度もリッチリザルト表示に至っていない）
- **`*-best10.html` 7ファイルの JSON-LD は `Article` + `BreadcrumbList` の2ノードで確定**（PR #78）。
  `ItemList` は再追加しない。best10 の商品リンクは `js/affiliate-track-static.js` が
  イベント委譲で計測しており、**静的HTMLに Amazon リンクは0本**（JSが生成）。
  したがって JSON-LD の変更は可視リンク・計測に一切影響しない
- **構造化データの実測（PR #78 の調査で確定・再走査しない）**
  Product は `*-review.html` 6ファイルのみ（`name` + `brand` + `review` のみで
  `image`/`offers`/`aggregateRating`/`sku` なし）／microdata 0 ／JSによる JSON-LD 動的注入 0 ／
  `offers`・`aggregateRating`・`price`・`sku`・`gtin` はサイト全体で 0 件
- **「初心者」表記整理プロジェクトは CLOSED**（PR #76）。**新しい調査フェーズを作らない。**
  公開HTMLに残る97行は全件が次のいずれかで説明できる（PR #76 で全件走査・再調査しない）:
  **SEO運用HOLD 80**（`title` 6 / `meta`・OG 33 / JSON-LD 26 /
  可視FAQ×JSON-LD 1対1 の3 / 見出し h1-h6 9 / パンくず 3）／
  **内部互換 5**（`?diff=初心者向け` の `href` 2 / `<option value="beginner">` 1 /
  GA4 `page_title` 1 / `species-list.html` の `LEGACY_DIFF` キー 1）／
  **明示HOLD 2**（`aria-label`（h1と対）1 / `compare/hermann-vs-greek.html` の `hero-sub`（title・OGと対）1）／
  **非表示コメント 10**
- **SEO系（`title`/`meta`/OG/JSON-LD/見出し/パンくず）80行は GSC/GA4 の実測トリガーなしに変更しない。**
  `CLAUDE.md` の「公開語彙ルール — 「初心者」」と `docs/operations/DECISION_RULE.md` が正本
- **U1 は「変更しない」で決着**（PR #76）。badge★の71ページ再割り当ては実施しない。
  ★・difficulty・色・アイコンは現状のまま**変更禁止**
- **H5 の6件は難易度軸へ統合しない**と決着（PR #76）。別軸として `はじめての方向け` を維持し、
  同じ表・カードの「飼育難易度」「難易度」行はそのまま残す
- **`js/` 配下の共有スクリプトの公開語彙は `はじめての方向け` で確定**（PR #75）。
  `quick-facts.js` の Sticky CTA（`isEasy` = difficulty に「入門」で長文/短文を出し分け）／
  `starter-kit.js` の `🔰` tierバッジ（food×budget と enclosure の既定）／
  `comparison-cta.js` の `points` 配列（比較の観点名）／`ranking-engine.js` の `label`。
  **`js/` に残る「初心者」は `annainin.js:127` の `INTENT_RULES` 1件のみで、非表示・恒久的に変更禁止**
- **`js/` 配下の共有スクリプトの影響範囲**（PR #75 実測・再調査しない）。
  `quick-facts.js` **111ページ** / `starter-kit.js` **113ページ** / `comparison-cta.js` **12ページ** /
  `ranking-engine.js` **0ページ**（どのHTMLからも読み込まれていない）
- **`shindan/species.js` の `reason` は表示専用フィールド**（PR #74 で全走査して確定・再調査しない）。
  `species.js` 内に `reason` の参照は0件で、`match(scores)` / `score(scores)` は
  スコアオブジェクトしか見ていない。消費するのは表示3箇所だけ:
  `shindan/index.html:2895`（`textContent`）／`shindan/index.html:3854`（`runnerup-desc`・48文字スライス）／
  **`species-list.html:677`（`<p class="sp-reason">`・118件）**。
  → `reason` を1箇所直すと診断結果と種一覧の両方に反映される
- **`shindan/` 配下の公開表示から「初心者」は0件**（PR #74）。
  `species.js` 0 / `index.html` 可視0 / `routes.js` 0 / `equipment.js` 0。
  `index.html` に残る8件はすべてコメントで画面に出ない（恒久的に対象外）
- **診断結果のメイン説明文（`#res-reason`）は `shindan/species.js` の `reason` を描画している**
  （PR #73 の実描画で確定・再調査しない）。`shindan/index.html` 側の `reason:` 2件
  （`:2668` の exotic 安全 fallback / `:2860` の fallback 種）は**通常経路では表示されない**
- **`shindan/index.html` の可視文字列は確定**（PR #73）。バッジ `🎯 はじめての方向け`／
  生成文 `はじめての方向けの回答…`／fallback `はじめての1頭に最も適した`。
  **`shindan/index.html` に残る「初心者」8件はすべてコメントで画面に出ない。恒久的に対象外**
- **バッジは3系統**（PR #73 で実行時に確認）。`BARRIER_BADGE_ADVANCED`（difficulty に「上級」）/
  `BARRIER_BADGE_MAP`（8キー・equipKey 一致）/ `BARRIER_BADGE_BEGINNER`（difficulty に「入門」）。
  **変数名・キー名は互換のため変更しない**（`beginner` を含む識別子は45件あり、いずれも内部識別子）
- **`shindan/index.html` の関連リンクカードは2つのマップで定義されている**（PR #72 で確定・再調査しない）。
  `COMPARE_MAP`（種 slug 別・**17 slug**）と `ROUTE_FALLBACK`（`land` / `aquatic` / `forest` /
  `exotic` / `all` の5キー）。**カード定義は合計66件**で、描画は
  `res-compare-card-name` / `-desc` / `-btn`（`href`）の単純な文字列連結。
  `.res-compare-card-name` / `-desc` に**省略（ellipsis / line-clamp）や固定幅はない**ため、
  ラベルの文字数が増えても折り返すだけで切れない
- **診断の関連リンクカードの語彙は確定**（PR #72）。`はじめての亀` / `はじめての亀比較` /
  `はじめて飼う方におすすめ` / `丈夫ではじめてでも飼える`。**`url:` は1件も変更していない**
- **スコア表（`cmp-table` + `score-dots`）の列は「ドットが多いほど良い」向きで統一されている**
  （PR #71 で確定・再確認しない）。ニオイ管理／排泄量少なさ／掃除頻度少なさ／ニオイ管理しやすさ／
  **はじめての方向け**。**この軸に `飼育難易度` を使わない** — 使うと多いほど難しい＝悪い、と読めて
  列の向きが反転する。値（`dot filled` の数）は変更禁止なので、ラベル側を反転させない語に揃える
- **スコア表の軸名は `はじめての方向け`（表の `<th>`）/ `はじめての方向け度`（導入文・`method-label`）で確定**（PR #71）。
  導入文と `<th>` は**常に同一commitで揃える**
- **compare 系の★は「多いほどやさしい」**（PR #70 で全 compare ページを実測して確定・再調査しない）。
  `飼育難易度 ★★★★★ 入門向き` / `★★★★☆ 初中級` / `★★★☆☆ 中級` /
  `★★☆☆☆（中〜上級者向け）`。**species 個別ページの diff-badge とは向きが逆**なので、
  compare の★を species の★と同じ規則で読み替えない（★の統一は U1 の範囲）
- **compare の比較表の難易度軸ラベルは `飼育難易度` で統一済み**（PR #70）。
  値（★・◎・○・―・括弧の補足）は一切変更していない
- **Phase A の per-item 分類リストは repo に存在しない**（PR #69 で確定・再探索しない）。
  残っているのは分類ごとの件数（A62 / B52 / C22 / D24 / E67 / F12）だけで、
  「どの行がA分類か」の一覧は `docs/` にも `AI_CHANGELOG.md` にも `CLAUDE.md` にも無い。
  **したがって「A分類の残り28件」は機械的に再現できない。** 件数からの差し引き（62−26−5−3=28）は
  合計としては正しいが、対象行を一意に決めるだけの情報がない
- **公開HTMLの「初心者」分布（main `3e84381` 実測・155行）**
  変更禁止 66行（`title` 6 / `meta`・OG 33 / JSON-LD の `headline`・`description`・`name` 21 /
  パンくず 2 / `href` 2 / `<option value="beginner">` 1 / GA4 `page_title` 1）／
  E分類側の見出し（h1-h6）9行／**本文・ラベル 80行**
- **本文・ラベル80行のうち、難易度の軸ラベルとして機械判定できるのは18行**（PR #69 で実測）。
  `<td>` 9 / `<th>` 3 / `.wb-badge` 1 / `.rank-badge-pill` 1 / `.gh-card-tag` 1 /
  `.method-label` 1 / `.stat-label` 1 / `index.html` の hero-stat 1。
  残る62行は A（難易度）か C（おすすめ）か D（警告）か E（見出し・CTA）かを
  **文脈判断しないと分けられない** = Phase A の再分類にあたる
- 採用する語彙（サイトに既に定着しているもののみ。新語を作らない）
  UI・見出し・CTA →「はじめての」／散文 →「はじめて飼う方」「飼育経験が浅いうちは」／
  条件・除外 →「飼育経験が中級までの方」／警告 → 難所を名指しする
