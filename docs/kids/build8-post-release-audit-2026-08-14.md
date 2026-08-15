# BUILD-8 公開後監査 — カメふしぎ島 / おうちの方へ

更新日: 2026-08-14
対象: PR #15（merge commit `3a03e49`）
状態: 公開済み（GitHub Pages デプロイ success / run 31781227577）

## 公開したもの

| 区分 | 内容 |
|---|---|
| kids/ | index（p1 いりぐち）／fushigi（p2）／mori（p3）／mizube（p4）／kawaita（p5）／yakusoku（p6）／chuui（p7）／quiz（p8）／otona（おうちの方へ） 計9ページ |
| css/ | kids.css / otona.css |
| js/ | kids.js / kids-quiz.js |
| assets/kids/ | webp 15枚 |
| index.html | Kids 導線4本（Heroバナー／entry-card／problem-grid 05／Care Module 05）＋ `.pc-card-s2-num` のコントラスト修正 |
| sitemap.xml | Kids 9URL 追加（169 → 178件） |

## 公開時点の実測

360 / 390 / 412 / 1280px、全9ページ。

- CLS 0.0000
- 横スクロール 0ページ
- 文字切れ 0件
- JSエラー 0件
- コントラスト（WCAG AA）NG 0件
- 画像19枚すべて読み込み成功
- 内部リンク・アセットの欠落 0件

未実施: **公開URLでの実測**。作業環境のエグレスポリシーが
`kamelifeguide.com` / `*.github.io` への接続を 403 で拒否するため。
以後のリリースでも同じ制約が続く。

---

## 改善案の再監査

公開版を基準に、提案した改善案を1件ずつ判定した結果。

### やるべき（3件）

| # | 内容 | 根拠 |
|---|---|---|
| 1 | `kids/mori.html` の `foot-b2-eastern-box-turtle.webp` に alt を付ける | figure 外・figcaption なし・`alt=""`。本文「この カメの 足だよ。よく 見て みよう。」が指す画像が読み上げで伝わらない。19枚中ここだけ |
| 2 | kids 9ページの `twitter:card` を `summary_large_image` へ | 本体は 60ページ中 55ページが `summary_large_image`。kids のみ `summary` |
| 3 | `kids/index.html` の canonical を `/kids/` へ | sitemap は `/kids/`。本体も compare・trouble・guides はディレクトリ形式。kids のみ不一致 |

いずれも1〜2行の変更。1 は p3 の FROZEN 解除が必要。

### やらなくてよい（6件）

| 内容 | 判定理由 |
|---|---|
| og:image をバナー画像に差し替える | 本体は全ページ共通で `images/hero/eastern-box-turtle-hero.jpg` を使用。kids p1・otona も同じ。**サイトの統一仕様どおり**で誤用ではない |
| 画像の圧縮（合計1.9MB） | 1.9MB は全ページ合計。初期表示は最大205KB（p1）、他は lazy。CLS 0.0000。**性能問題は実測されていない** |
| AI背景・図の差し替え | `bg-mori.webp` は倒木・シダ・落ち葉の広い風景画で、p3 の「落ち葉の中に何かいる。見つけられる？」という探す遊びは広い画角でしか成立しない。`k-01.webp` は甲羅の断面図で写真では撮れない内容 |
| `face-close.jpg` を p3 バンドに使う | 写真は 1599×1600（1:1）、`.k-banner` は `aspect-ratio:16/9` + `object-fit:cover`。上下44%が切れて主題の落ち葉が消える。またテラリウム（コルク・観葉植物・管理ラベル）が写り、「島の森」という設定と合わない |
| 「図：」ラベルの追加 | `.k-photo` の figcaption が既に「しゃしん：トウブハコガメ」。写真と図の区別は既存の表記で付いている |
| クイズ Q2→Q3 の 39px ずれ | 本文の行高 ≒41px より小さく、1行未満の移動で知覚できない |

### 判断保留（5件）

GA4 / Search Console のデータが出てから決める。

- p2〜p8 への og:* 追加 — 入口以外が共有される実績が出たら
- GA4 カスタムイベント — otona → 本体は同一ドメインのため `page_view` + `page_referrer` で追跡可能。追加は利便性の向上にとどまる。取得できないのは「ふりがなトグルの使用率」のみ
- p1 の長さ（390px で 4,123px ≒ 4.9画面）— スクロール到達率と離脱を見てから
- `otona.html` 出典リンクのタップ高（16〜17px、WCAG 2.5.8 インライン例外に該当）
- `kid/` と `kids/` の相互案内 — 誤アクセスが観測されたら

---

## 既存の GA4 イベント

| イベント | 送信元 | 内容 |
|---|---|---|
| `page_view` | 全ページ | `gtag('config')` が自動送信 |
| `kids_stop_view` | `js/kids.js` | `{ stop, visited }` |
| `kids_zone_quiz` | 各ゾーン | ミニクイズの回答 |
| `kids_quiz_complete` | `js/kids-quiz.js` | `{ score, total }` |
| `homepage_kids_click` | `index.html` | `{ slot: hero_band / problem_grid }` |
| `homepage_entry_card_click` | `index.html` | `{ path: kids }` |

---

## 残件

1. 公開URLでの表示確認（作業環境からアクセス不可。別環境または GitHub Actions でのリンク検査が必要）
2. 厚生労働省・環境省へのリンク先の生存確認
3. 上記「やるべき3件」の実施
4. GSC で `kids/` の表示回数を4週間観測してから次の判断をする
