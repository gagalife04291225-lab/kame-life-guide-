# カメライフガイド — AI アシスタント向けコードベース解説

> **This project is managed by AI Company OS.**
> Primary company rules: **MANIFEST.md** / **AGENTS.md**
> （リポジトリ: `gagalife04291225-lab/ai-company-os`。優先順位: MANIFEST > AGENTS > 本ファイル）
> This document contains **only project-specific rules**.

あなたはカメ・爬虫類の専門コンテンツ制作エージェントです。
会社共通の規範（正直・検証義務・Issue運用・セキュリティ等）は AI Company OS の MANIFEST.md / AGENTS.md に従い、
以下は Project-001（カメライフガイド）固有のルールとコードベース情報です。

---

## プロジェクト基本情報

| 項目 | 値 |
|------|-----|
| サイト URL | `https://gagalife04291225-lab.github.io/kame-life-guide-/` |
| リポジトリ | `https://github.com/gagalife04291225-lab/kame-life-guide-` |
| デプロイ方法 | **GitHub Pages のみ**（main ブランチ直デプロイ） |
| Amazon アソシエイト ID | `kamelife09-22` |
| Google Analytics | GA4: `G-QQTE5CVF3K` |
| note フッターリンク | `https://note.com/proper_bison2362` |
| 運営者 | TeTeさん（スペングラーヤマガメ・ヒラセガメ・ミツユビハコガメ飼育中） |

---

## リポジトリ構造

```
kame-life-guide-/
├── index.html              # サイトトップ（ハビタット別入口・診断ツール導線）
├── species-list.html       # 81種一覧（絞り込みフィルター付き）
│
├── # ──── ハビタット別飼育ガイド（guide-*.html）────
├── guide-dry.html          # 乾燥系リクガメ（ロシア・ヘルマン・ギリシャ等）
├── guide-moist.html        # ヤマガメ・ハコガメ（半陸生・森林性：スペングラー・ヒラセ・ミツユビハコガメ等）
├── guide-arid.html         # 多湿系リクガメ（熱帯・大型：アカアシ・ヒョウモン・ケヅメ等）
├── guide-semi.html         # 半水棲ガメ（ニオイガメ・ドロガメ等）
├── guide-water-full.html   # 完全水棲ガメ（ニオイガメ・チズガメ等）
├── guide-brackish.html     # 汽水ガメ（ダイヤモンドバックテラピン等）
├── guide-japan.html        # 日本在来種（ニホンイシガメ等）
├── guide-softshell.html    # ソフトシェル・特殊種（スッポン・マタマタ等）
│
├── # ──── 機材レビュー・ランキング（*-review.html, *-best10.html）────
├── cage-review.html        # ケージレビュー
├── cage-best10.html        # ケージランキング
├── substrate-review.html   # 床材レビュー
├── substrate-best10.html   # 床材ランキング
├── shelter-review.html     # シェルターレビュー
├── shelter-best10.html     # シェルターランキング
├── uvb-light-review.html   # UVBライトレビュー
├── uvb-light-best10.html   # UVBライトランキング
├── food-review.html        # 餌レビュー
├── food-best10.html        # 餌ランキング
├── water-filter-review.html# フィルターレビュー
├── water-filter-best10.html# フィルターランキング
├── dish-best10.html        # 水入れランキング
│
├── # ──── 亀診断ツール（shindan/）────
├── shindan/
│   ├── index.html          # 診断 UI（フルインライン CSS・JS）
│   ├── routes.js           # 5 ルートの質問データ
│   ├── species.js          # 全種データ（81種・ match/score 関数付き）
│   └── equipment.js        # 種別推奨機材 ASIN マップ
│
├── # ──── 共有 CSS（css/）────
├── css/
│   └── style.css           # 機材ページ用共通スタイル
│
├── # ──── その他────
├── privacy.html            # プライバシーポリシー
├── sitemap.xml             # サイトマップ
├── robots.txt              # クローラー制御
│
├── # ──── 引き継ぎ文書────
├── SHINDAN-SPEC.md         # 診断ツール仕様書・作業ルール
└── SHINDAN-SPECIES.md      # 全種データ管理（CITES・難易度・学名等）
```

---

## アーキテクチャ概要

### デプロイ・ホスティング

- **GitHub Pages のみ**。Netlify・Vercelは使用禁止。関連設定ファイルはPhase 34A-3で削除済み。
- main ブランチへの push で自動デプロイ（約60秒待機が必要）
- `.claude/settings.json` に `git push` 後の自動検証フックあり → push 後はデプロイ完了を待って WebFetch で検証する

### CSS 方針（ページ種別で異なる）

| ページ種別 | CSS 方針 |
|-----------|---------|
| `index.html` | インライン CSS |
| `guide-*.html` | インライン CSS |
| `shindan/index.html` | インライン CSS（完全自己完結） |
| 機材レビュー・ランキング | `css/style.css` 共有外部 CSS |

**新規ページ作成前に CSS 方針を決定してから実装すること。**

### フォント

- `Playfair Display`（serif 英字・見出し）
- `Noto Serif JP`（日本語 serif・記事系）
- `Noto Sans JP`（日本語 sans・機材系）

### カラーパレット（ブランドカラー）

```css
--forest-deep: #0d1f1a   /* ヘッダー背景 */
--forest:      #2f4a3c   /* ナビ・セクション見出し */
--parchment:   #f4efe2   /* 背景 */
--accent:      #d4a96a   /* アクセント・ボーダー */
```

機材ページ系（`css/style.css`）では変数名が異なる（`--forest`, `--forest-mid`, `--moss`, `--sage` 等）。

### 亀診断ツール（shindan/）

5 ルート構成、81種収録：

| ルート ID | 名前 | 問数 |
|---------|------|-----|
| `land` | リクガメルート | 5問 |
| `aquatic` | 水棲ガメルート | 8問 |
| `mountain` / `box` | ヤマガメ・ハコガメルート | 4問 |
| `special` | マニアック・特殊ルート | 3問 |
| `all` | 全カテゴリルート | 6問 |

各種は `match(scores)` と `score(scores)` 関数を持つ。`equipment.js` の ASIN は `web_search` で実在確認済み。

---

## 基本原則

会社共通の原則（正直・検証・記録・最小変更）は **AI Company OS: MANIFEST.md Core Principles / AGENTS.md §2・§8** に従う。ここでは再定義しない。

---

## SKILL: HTMLページ制作（カメライフガイド）

### 適用場面
カメライフガイド（GitHub Pages）のHTMLファイルを新規作成・編集する時。

### デプロイルール（必ず守る）

- **GitHub Pages のみ**（Netlify・Vercel 禁止）
- 公開前にHTMLを完成させる
- ファイル名は英語、フラット構造（`shindan/` 以外は posts フォルダなし）
- インライン CSS vs 外部 CSS は作業前に決定する

### ファイル命名規則

```
guide-{habitat}.html        # ハビタット別飼育ガイド
{equipment}-review.html     # 機材レビュー記事
{equipment}-best10.html     # 機材ランキング
```

### プロセス

1. **仕様確認** — ページの目的・対象種・アフィリエイトリンクの有無を確認する
2. **設計** — HTML 構造・CSS 方針・リンク先を先に提示し承認を得る
3. **実装** — 承認された設計通りに実装する。勝手に変えない
4. **品質確認** — 以下をすべてチェックする：
   - Amazon 追跡 ID（`kamelife09-22`）が正しく入っているか
   - GA4 タグ（`G-QQTE5CVF3K`）が入っているか
   - WCAG AA コントラスト比を満たしているか（目視NG・数値で確認）
   - note フッターリンク（`https://note.com/proper_bison2362`）があるか
   - ファイル名が英語かつフラット構造か
   - `sitemap.xml` への追記が必要か確認する
5. **push & 検証** — `git push` 後 60秒待ってデプロイ確認。自動フックが検証を促す

### Anti-rationalization

| 言い訳 | 反論 |
|--------|------|
| 「小さい変更だから確認不要」 | 追跡 ID・GA4 は収益と分析に直結する。必ず確認する |
| 「だいたい合ってるコントラスト」 | 数値で確認する。目視は信用しない |
| 「追跡IDは後で確認」 | 収益に直結する。今確認する |
| 「Netlify でも同じでは？」 | GitHub Pages のみ。Netlify・Vercelは使用禁止。関連設定ファイルはPhase 34A-3で削除済み。 |

---

## SKILL: 亀診断ツール（shindan/）の修正

### ファイル構成と役割

| ファイル | 役割 | 変更頻度 |
|---------|------|---------|
| `shindan/index.html` | UI・CSS・メインロジック | 低 |
| `shindan/routes.js` | 質問データ・ルート定義 | 中 |
| `shindan/species.js` | 全種データ | 高（種追加時） |
| `shindan/equipment.js` | 推奨機材 ASIN | 中（機材更新時） |

### 種追加・修正時の鉄則

1. `SHINDAN-SPECIES.md` を正として学名・CITES 規制を確認する
2. 除外種リスト（CITES I・特定外来・天然記念物）には絶対に追加しない
3. **種数は減らさない**。増やす方向で
4. 製品名・ASIN は `web_search` で実在確認してから記述する
5. 学名の間違えやすい種は `SHINDAN-SPEC.md` の「修正済み学名」を必ず参照する

### 法規制の扱い（重要）

| 規制種別 | 対応 |
|---------|------|
| CITES I（ホシガメ・マッコード等） | 診断から除外 |
| CITES II | 掲載可・「国内CB飼育可・輸入に書類必要」と明記 |
| 条件付特定外来（アカミミガメ） | 掲載するが「新規購入不可」を強調 |
| 特定外来（ワニガメ・カミツキガメ） | 診断から除外 |
| 天然記念物（リュウキュウヤマガメ等） | 診断から除外 |

---

## SKILL: 記事・コンテンツ制作

### 適用場面
note記事、カメライフガイドのHTML記事を書く時。

### 文体ルール

- 温かく知的好奇心あふれる日本語文体
- AI 臭のある表現を避ける（「〜となります」「〜について解説します」等NG）
- 初心者にわかりやすい説明を心がける
- 年数は一切記載しない（「2年以上」等はNG）
- 種名は**日本語の通称名を先に出す**。英名・専門用語は括弧で補足

### プロセス

1. **仕様確認** — 対象種・ターゲット読者・文字数・トーンを先に確認する
2. **構成設計** — 章立てと各セクションの役割を先に提示し、承認を得てから本文を書く
3. **事実検証** — すべての主張に対して以下を実行する：
   - CLAIM：主張を明示する
   - SOURCE：根拠（学術文献・海外専門家情報・実飼育経験）を明示する
   - CONFIDENCE：高 / 中 / 低 でラベルを付ける
   - DOUBT：反証・例外・不確実性を列挙する
   - RECONCILE：主張を修正するか維持するかを判断する
4. **完成チェック** — 誤情報・誇張・未確認情報がないか最終確認する

### Anti-rationalization

| 言い訳 | 反論 |
|--------|------|
| 「よく知られた事実だから検証不要」 | 広く信じられている誤情報が爬虫類界には多い。必ず根拠を示す |
| 「後で事実確認する」 | 後でやらない。書きながらやる |
| 「Grokが生成したから正確なはず」 | AIは自信を持って誤情報を生成する。必ず検証する |

---

## SKILL: 要件が曖昧な時（interview-me）

### 適用場面
依頼内容が不明確、または複数の解釈ができる時。

### プロセス
- 一度に1つだけ質問する
- 回答を受けて次の質問を決める
- 確信度が約95%になるまで続ける
- 確信できたら「確認した内容」を整理して提示し、作業を始める

---

## SKILL: 生成物の疑念検証（doubt-driven-development）

### 適用場面
重要な記事・コード・判断を行う前。特にGrokや他のAIが生成したコンテンツのレビュー時。

### プロセス
1. **CLAIM** — 検証対象の主張・コードを明示する
2. **EXTRACT** — 前提となっている事実・仮定を列挙する
3. **DOUBT** — 各前提に反証・例外・リスクを当てる
4. **RECONCILE** — 修正が必要か、そのままでよいかを判断する
5. **STOP** — 問題があれば作業を止めてTeTeさんに報告する

---

## 全スキル共通ルール

会社共通の行動規範は **AGENTS.md §2（operating principles）** に統合済み。ここでは再定義しない。
Project固有の補足: 作業提案前に「今すぐ必要か」をTeTeに確認する（本プロジェクトは優先度P0案件が常在するため）。

---

## Git・デプロイ操作

### 通常のファイル更新フロー

```bash
# 1. 変更してコミット
git add <ファイル名>
git commit -m "fix: ○○の説明を修正"

# 2. push（必ず -u origin <branch>）
git push -u origin main

# 3. 60秒待ってデプロイ確認（自動フックが促す）
# WebFetch で変更ページを確認する
```

### push 失敗時の再試行

ネットワークエラーの場合のみ指数バックオフで最大4回再試行：2s → 4s → 8s → 16s

### ブランチ運用

- **main**: 本番ブランチ。GitHub Pages から直接デプロイされる
- 機能追加は原則 main 直接（小規模静的サイトのため）
- **注**: これは AGENTS.md §4（main直接push禁止）に対する **Project-001の明示的例外**（TeTe承認済みの確立運用）。
  例外の範囲はこのリポジトリのみ。大規模変更・高リスク変更ではブランチ+PRを使う

---

## 引き継ぎ文書の役割

| ファイル | 用途 |
|---------|------|
| `SHINDAN-SPEC.md` | 診断ツールの仕様・ルート設計・法規制対応・GitHub API 鉄則・作業ルール |
| `SHINDAN-SPECIES.md` | 全81種のデータ管理（学名・CITES・難易度・備考） |
| `CLAUDE.md`（本ファイル） | AI アシスタント向けコードベース全体解説 |

**コンテキストが切れた場合は `SHINDAN-SPEC.md` と `SHINDAN-SPECIES.md` を読めば作業を継続できる。**
