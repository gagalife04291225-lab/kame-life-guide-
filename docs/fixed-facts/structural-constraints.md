# 構造上の制約 — 固定入力

> `docs/AI-HANDOFF.md` の FIXED_FACTS 節から分離した参照表（2026-09-03）。
> **固定入力。再検証しない。** 本文は移動時に一切改変していない。
> 索引は `docs/AI-HANDOFF.md` の FIXED_FACTS にある。

---

### 構造上の制約（**再確認しない**）

- **JSON-LD の `FAQPage` が可視の `faq-body` / `h3` を1文字違わず複製している。**
  可視側だけを直すと構造化データと表示内容が乖離する。
  可視FAQを直すときは**同一commitでJSON-LDと完全同期**させる（PR #54 で条件付き許可済み）。
  **PR #59 / #60 でこの手順の成立を確認済み。**
  #59 は `"name"`、#60 は `acceptedAnswer.text` に適用。いずれも可視とJSON-LDを
  同時置換し、置換箇所以外に差分0・JSONパース成功を確認している
- 互換のため変更しない: `sort=beginner` / `?diff=初心者向け` / GA4イベント名 /
  `s.beginner` / beginner を含むURL・slug・ファイル名
- generator 5本（マーカー方式・`--check` で差分検出）
  `tools/taxonomy.js`（分類SSoT）/ `gen-category-ui.js` / `gen-species-list.js` /
  `gen-guide-species.js` / `gen-guide-nav.js`
- 本番URLの確認は本実行環境から不可（EGRESS_BLOCKED）。GitHub Pages 反映確認は亀好きさん側

#### `annainin`（亀の案内人チャット）の実測構造 — PR #66 / #68 で確定・**再調査しない**

- `js/annainin.js:347-349` のハンドラは `getAttribute('data-quick-reply')` **だけ**を読む。
  `.an-topic-btn` の可視ラベルは**一切読まれない**
- `submitUserText()` は送信テキストを**そのままユーザー発言バブルとして画面に描画**する。
  → 可視ラベルと `data-quick-reply` は**必ず同じ語彙に揃える**（PR #68 で揃えた）
- `TOPIC_QUICK_REPLIES`（`js/annainin.js`）は `data-quick-reply` と `textContent` の
  **両方**に同じ文字列を入れる。bot の返信ボタンは**可視表示**である
- bot 応答本文2件（`capability` / `unknown`）は **topic-btn 10個の可視ラベルを順に列挙**している。
  ラベルを変えたらこの2件も必ず同時に変える
- **`INTENT_RULES`（`js/annainin.js:127` 付近）は公開表示ではない分類語彙。**
  beginner キーワード `['初心者','はじめて','初めて','入門']` は**恒久的に変更しない**。
  「初心者」を削ると「初心者」と手入力したユーザーが `unknown` に落ちる
- **annainin の公開語彙は「はじめての方向け」で確定**（PR #68）。
  topic-btn 可視 `はじめての方向け` / `data-quick-reply` と `TOPIC_QUICK_REPLIES[0]` は
  `はじめての方向けの亀は？`。**この4箇所は今後ばらばらに変更しない**
- GA4 は `annainin_view` / `annainin_message_sent` / `annainin_intent_classified` /
  `annainin_feature_link_click` の4種。イベント名・パラメータ名は無変更。
  `message_length` は送信文の長さそのものなので、文言を変えれば値は変わる（9→12）。
  これは仕様どおりで、GA4 定義の変更ではない

#### sitemap.xml の運用構造（PR #79 で実測確定・**再調査しない**）

| 事実 | 実測値 |
|------|--------|
| `<url>` / `<loc>` / `<lastmod>` 件数 | いずれも **194**（1 URL = 1 loc = 1 lastmod） |
| URL → 実体の対応 | `https://kamelifeguide.com/<path>`。末尾 `/` は `<path>index.html`、ルートは `index.html`。**194件すべて実在ファイルへ解決する（欠損0）** |
| sitemap.xml を触った commit | 190 commit 中 **12**。すべて `feat(species): …追加` 系＝**新規 `<loc>` 追加時のみ** |
| sitemap.xml を書き出す generator / CI | **存在しない**（`tools/` `scripts/` `.github/` に sitemap を扱うコードなし）。手動更新のみ |
| 陳腐化の原因 | 上記2点の帰結。**既存ページを編集しても `<lastmod>` が更新されない**構造だった（PR #79 時点で 189/194 が実態より古かった） |

**再発防止は「提案のみ」で、今回は自動化していない。** 推奨は A案（generator 化）:
`tools/gen-sitemap.js --check` を追加し、`<loc>` の集合と順序を現行のまま固定したうえで
`<lastmod>` だけを `git log -1 --format=%cs` から生成・照合する。既存 generator 4本と同じ
`--check` 契約に揃えれば、PR ごとに差分0を確認できる。**実装は未着手。**

#### kids 導線と generator 管理領域（PR #80 で実測確定・**再調査しない**）

| 事実 | 実測値 |
|------|--------|
| 導線を入れた対象 | **167ページ**（hub-links 150 / related-links 9 / フッター 6 / hint-links 1 / 404 1）＋ `index.html` |
| 対象外 | **36ページ**。kids本体9 / 商品レビュー6（`*-review.html`）/ 規約・運営者4 / `shindan/` / `annainin/` / `kid/` / 実飼育記録3 / テンプレート4 / リダイレクトスタブ3（`meta refresh` + `noindex`）/ `before-keeping` `photo-credits` `updates` |
| 新規GA4イベント | `site_kids_click`（`from`: `hub` / `related` / `hub_footer` / `explore` / `404` / `guide_module_otona`）。既存イベント名・件数は不変 |
| **`guide-*.html` 8本の `hub-links` は generator 管理領域** | `tools/gen-guide-nav.js` が `<!-- BEGIN:guide-nav -->` 〜 `<!-- END:guide-nav -->` を丸ごと再生成する。**内側を手で編集すると `--check` が差分を出す。** マーカーの外に独立した `hub-links` を置くこと |
| `guides/index.html` の「カテゴリから探す」も同様 | `<!-- BEGIN:guides-hub-env -->` 〜 `<!-- END:guides-hub-env -->` が生成対象 |
| `.gl-cta`（`index.html`） | `::after` が `"→"` を付与する。**CTA本文に矢印を書くと二重になる。** 5枚とも本文に矢印なし |
| リダイレクトスタブ3件 | `species/ornate-cuora.html` / `species/hime-nioi-turtle.html` / `species/ouachita-map-turtle.html` |
| テンプレート4件 | `species/_template-monetized.html` / `hermann-dry-template` / `pink-bellied-template` / `three-toed-box-template` |

`explore.html` の `.hint-links` は既存3リンクとも**タップ高27px**で、追加した1本も同値。
`guides/index.html` のフッターは既存リンク14pxに対し追加分は34px。いずれも既存設計に合わせた結果で、
PR #80 が持ち込んだ劣化ではない。

#### 写真の出典・和名（2026-08-26 実測確定・**再調査しない**）

**Wikimedia Commons 経路が使えるようになった。** この実行環境から Commons・Wikipedia・
fws.gov・nps.gov・GBIF・Flickr はすべて egress proxy で遮断（CONNECT 403）されており、
到達できるのは `inaturalist-open-data.s3.amazonaws.com` のみ。
**亀好きさんがファイルページのスクリーンショットと画像を送る形で運用が成立した。**
必要なのは ①ファイル名 ②説明（学名・亜種名）③ライセンス ④著者 ⑤原寸 ⑥画像本体 の6点。

| 対象 | 確定した出典 |
|------|-------------|
| `pancake-tortoise` | photo 263266953 / Julien Lepage / CC BY 4.0 / 飼育個体 |
| `taiwan-box-turtle` | File:Chineseboxturtle 2006.jpg / 臺北翡翠水庫管理局 / **台北市政府許諾（CC ではない）** / 帰属表示「台北市政府」 |
| `nicaragua-wood-turtle` | File:RPincisa-02c.jpg / Tornadohalt / CC BY-SA 3.0 / 飼育個体 |
| `black-knobbed-map-turtle` | File:Graptemys_nigrinoda_by_OpenCage.jpg / OpenCage / CC BY-SA 2.5 / 飼育個体 |
| `pink-bellied-side-necked-turtle` | File:Rotbauchspitzkopfschildkroete-07.jpg / Petra Karstedt / CC BY-SA 2.0 DE / 飼育個体 |
| `carolina-diamondback-terrapin` | **現状維持で決着**（Simon Tonge / CC0 / obs 9822014） |

**解像度基準の運用**: 800×600 は原則維持。PR #85 で **1.15倍拡大を1件だけ許容**した
（識別上もっとも重要な形質が旧写真に写っていなかったため）。
Commons の obsti 候補（500×349・1.72倍拡大が必要）は**基準未達として不採用**。
緩和は自動適用しない。拡大率と得られる情報を都度天秤にかける。

**私（Agent）が誤っていた和名 — 正本は `data/species-master.json`:**

| 学名 | 誤 | 正 |
|------|----|----|
| `Cuora mouhotii obsti` | ~~オオヤマガメ~~ | 親種 = **ヒラセガメ**（`hirase-turtle`・別名モンホットハコガメ） |
| `Graptemys nigrinoda delticola` | ~~デルタコクロスジチズガメ~~ | 親種 = **クロコブチズガメ**（`black-knobbed-map-turtle`） |
| `Emydura subglobosa worrelli` | ~~ジーベンロックナガクビガメ近縁~~ | 親種 = **ニシキマゲクビガメ**（`pink-bellied-side-necked-turtle`） |

`ジーベンロックナガクビガメ` はサイトに実在する**別種** *Chelodina rugosa*（`siebenrocks-snake-necked-turtle`）。
`Malaclemys terrapin tequesta` の和名は **ヒガシフロリダキスイガメ**（2026-08-26 亀好きさん決定・A案）。

**`scripts/verify_credits.py` は元から FATAL。** `pc_parsed.json` を cwd 直下で探す設計だが
実体は `data/` にあり、加えて iNaturalist への通信が必要。本セッションの変更とは無関係。
