# カメライフガイド — AI アシスタント向けコードベース解説

> **This project is managed by AI Company OS.**
> Primary company rules: **MANIFEST.md** / **AGENTS.md**
> （リポジトリ: `gagalife04291225-lab/ai-company-os`。優先順位: MANIFEST > AGENTS > 本ファイル）
> This document contains **only project-specific rules**.
>
> **Conforms-to: Development Constitution v2.0**（本ファイルは Procedure 層。上位の憲法に準拠する）

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
| 運営者 | 亀好きさん（スペングラーヤマガメ・ヒラセガメ・ミツユビハコガメ飼育中） |

---

## リポジトリ構造

```
kame-life-guide-/
├── index.html              # サイトトップ（ハビタット別入口・診断ツール導線）
├── species-list.html       # 種一覧（絞り込みフィルター付き）
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
│   ├── species.js          # 全種データ（108種・ match/score 関数付き）
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

- **GitHub Pages が本番配信基盤**（カスタムドメイン `kamelifeguide.com`）。Netlify・Vercel は使用禁止。
- リポジトリ直下の `CNAME`（`kamelifeguide.com`）と `.nojekyll`（Jekyll 無効化）が現行の GitHub Pages 構成要素。
- Cloudflare 用の `_headers` / `_redirects` はリポジトリに存在するが、**GitHub Pages では利用されない**（無効な残置ファイル）。Cloudflare は DNS 管理等に関与する可能性はあるが、コンテンツ配信基盤ではない。
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

5 ルート構成、108種収録（all は land/aquatic/forest/exotic の連結）：

| ルート ID | 名前 | 問数 |
|---------|------|-----|
| `land` | リクガメルート | 7問 |
| `aquatic` | 水棲ガメルート | 10問 |
| `forest` | ヤマガメ・ハコガメルート | 7問 |
| `exotic` | マニアック・特殊ルート | 6問 |
| `all` | 全カテゴリルート | 8問 |

※ 問数は全ルート共通の追加2問（予算・臭い/手間）込み。さらに Readiness Gate 2問（TRUST-1・住まい/世話体制）が全ルート末尾に続くが、採点には加算されない（C判定=種を推薦しない・商品リンクなし）。

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
| 「Netlify でも同じでは？」 | GitHub Pages が本番配信基盤。Netlify・Vercel は使用禁止。（Cloudflare 用 `_headers`/`_redirects` はリポジトリに存在するが GitHub Pages では利用されない） |

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
| CITES I（ホシガメ・パンケーキ・モエギ等） | 診断から除外（マッコードナガクビガメは附属書II〔2005年掲載〕のため例示から削除） |
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
5. **STOP** — 問題があれば作業を止めて亀好きさんに報告する

---

## 全スキル共通ルール

会社共通の行動規範は **AGENTS.md §2（operating principles）** に統合済み。ここでは再定義しない。
Project固有の補足: 作業提案前に「今すぐ必要か」を亀好きさんに確認する（本プロジェクトは優先度P0案件が常在するため）。

### 成果物の出力形式（Constitution B ルール）

- 成果物（設計書・レポート・監査結果・ドキュメント等、ユーザーへ渡すもの）は、原則 **1 つのコピー可能なコードブロック**で出力する。
- 短い通常会話・確認のやり取りは対象外。

---

## Git・デプロイ操作

### 通常のファイル更新フロー

```bash
# 1. 変更してコミット
git add <ファイル名>
git commit -m "fix: ○○の説明を修正"

# 2. push（必ず -u origin <branch>）
git push -u origin <branch>   # 経路①: claude/<topic>-<id> 等。main 直 push は Automation 限定

# 3. 60秒待ってデプロイ確認（自動フックが促す）
# WebFetch で変更ページを確認する
```

### push 失敗時の再試行

ネットワークエラーの場合のみ指数バックオフで最大4回再試行：2s → 4s → 8s → 16s

### ブランチ運用

- **main**: 本番ブランチ。GitHub Pages から直接デプロイされる
- Git 運用は **Development Constitution v2.0 Chapter 3 / Chapter 4** に準拠する。すべての変更は以下の 4 経路のいずれかに属すること。

| 経路 | ブランチ | push | PR |
|------|----------|------|-----|
| ① Claude Code on the Web | `claude/<topic>-<id>` | 指定ブランチへ | PR 経由（Merge は Owner） |
| ② Automation（rakuten-sync） | main 直 | `data/products.js` 限定で main 直 push | なし |
| ③ 人手作業 | `edit/<topic>` | ブランチ（main 例外可） | 任意 |
| ④ 緊急修正 | `hotfix/<issue>` | 即 push 可 | 事後 PR で記録 |

- **main（default／protected branch）への直接 push は Automation（②）の限定スコープのみ許可**。①③④は原則 PR 経由（④は事後 PR）。
- push 前に `git status` で差分を確認し、宣言 Scope 外のファイルを変更していないこと（Scope Lock）。
- Merge は Owner のみが実施する（Constitution Invariant I1）。
- **注**: これは AGENTS.md §4（main直接push禁止）に対する Project-001 の運用であり、憲法 §1.3-R3 により **Automation の限定スコープ及び緊急修正の事後PRのみ**に縮小して継承する。

---

## 引き継ぎ文書の役割

| ファイル | 用途 |
|---------|------|
| `SHINDAN-SPEC.md` | 診断ツールの仕様・ルート設計・法規制対応・GitHub API 鉄則・作業ルール |
| `SHINDAN-SPECIES.md` | 全種データ管理（126行・学名・CITES・難易度・備考。species.js より広い参照表） |
| `CLAUDE.md`（本ファイル） | AI アシスタント向けコードベース全体解説 |

**コンテキストが切れた場合は `SHINDAN-SPEC.md` と `SHINDAN-SPECIES.md` を読めば作業を継続できる。**


---

## Kame Life Guide 恒久運用ルール（2026-07 亀好きさん承認）

これはこのプロジェクトの最優先運用ルール。他の記述と矛盾する場合はこちらを優先する。

### ① GitHub・PAT 運用

時間を無駄にする押し問答を禁止する。

- GitHub作業開始前に、現在の権限で実行可能かを確認する。
- PAT認証が本当に必要と判断したら、**最初に「PATが必要です」と伝える**。
- 「PATは不要」と意地になって作業を止めたり、同じやり取りを繰り返したりしない。
- 認証不要で実行できる方法があれば、それを優先する。
- すべて試した結果PATが必要なら、速やかに依頼する。
- ユーザーは一時的にPATを発行し、作業完了後すぐに失効（revoke）する運用を前提とする。**一度使ったPATは使い回さない。**
- PATを受け取ったら、不要な説明を続けず、目的のGitHub作業を優先して進める。

### ② 問題解決の基本方針

- 最初から「できない」と結論を出さない。
- 利用可能な方法（GitHub / Web検索 / 連携機能）をすべて試してから結論を出す。
- 作業を止める前に、必ず代替手段を検討する。
- 不明点があれば推測ではなく確認する。

### ③ プロジェクト共通方針

- Kame Life Guide を最優先プロジェクトとして扱う。
- 「AIが作ったサイト」ではなく、**長年の飼育経験を持つ運営者が作る専門サイト**を目標とする。
- **「分からないことは分からない」と明記することを品質基準とする。**
- 運営者が飼育していない種は、飼育しているように見せない。
- 実体験・専門資料・信頼できる長期飼育情報を区別し、根拠を重視する。
- 情報源の型（provenance）を持ち、質の高い根拠同士の対立（conflict）とリスク報告（caution）を区別する。デマは対立ではなく除外する。

### 最重要原則

時間を無駄にしないこと。押し問答や思い込みではなく、利用可能な手段をすべて試し、必要な認証は最初に伝え、最短で目的を達成すること。

### 挨拶トリガー（対話アシスタント運用）

- **「おはよう」= 朝モード**: 前回作業の続きとプロジェクト全体の文脈を読み込み、優先順位整理・未完了タスク確認・進行計画を提案して開始する。
- **「こんばんは」= 夜モード**: 前回の続きと文脈を読み込み、今日の進捗確認・残作業整理・夜の優先順位を提案して開始する。

---

## 運営フェーズへ移行済み（2026-07）

本プロジェクトは **開発フェーズ（Phase1〜Phase4-A）を完了し、運営・改善フェーズへ移行済み**。
今後は新機能開発中心ではなく、実ユーザーの行動データ（Search Console / GA4 / TikTok / ASPレポート）に基づく継続改善を行う。

- 運営ルールは **`docs/operations/`** に正式ドキュメントとして整備済み：
  - `OPERATIONS_MANUAL.md`（毎日/毎週/毎月/四半期/年次）
  - `WEEKLY_REVIEW.md` / `MONTHLY_REVIEW.md`（レビュー手順）
  - `KPI.md`（固定KPI・取得元・更新頻度）
  - `DECISION_RULE.md`（改善判断ツリー・P0/P1/P2）
- 改善は **GSC/GA4の実測値がトリガーを引いたページのみ**（週最大3ページ）。推測で直さない。
- コンテンツ追加は **週1〜2本・GSCで需要が実在するテーマのみ**。着手前にカニバリ監査必須。

---

## サイト名称・ブランディング憲法（恒久ルール・2026-07 亀好きさん承認）

これは恒久ルール。他の記述と矛盾する場合はこちらを優先する。

### ① 公開表示名（Public Display Name）

- 公開サイト上での運営者表示は **すべて「亀好きさん」に統一** する。
- 以下の表記は **禁止**：`Tete` / `TeTe` / `tete` / その他 Tete 系表記。
- 対象：公開UI・記事・プロフィール・見出し・紹介文・CTA・案内文など、
  **ユーザーの目に触れる表示はすべて「亀好きさん」** を使用する。

### ② 内部識別子（Internal Identifiers）は変更しない

- ファイル名・URL・slug・画像ファイル名・内部変数・既存ID は **互換性維持のため変更しない**。
  - 例：`about-tete.html` / `tete-profile.webp` / `assets/tete/` / `id="tete"`
- **表示名だけ**を「亀好きさん」にする（技術的識別子はそのまま）。

### ③ 改名の再提案を禁止（Do Not Suggest Renaming Again）

- 本ルールは恒久ルール。今後、
  「Teteに戻す」「ファイル名も変更する」「URLも変更する」等の **提案は禁止**。
- レビュー・改善提案でも、このルールを **前提** として扱う。

---

## 生体写真の選定基準（恒久ルール・亀好きさん指示）

これは恒久ルール。写真を選ぶときは毎回この基準で実物を見てから採用する。

### 適用範囲

- **これから追加する写真に適用する。** 亜種の追加など、新しく写真を入れるときは
  この基準で目視してから採用する。
- **既存写真も対象。** 2026-08-22 に公開中の生体写真123枚を全数目視したところ、
  基準に抵触する写真が4件残っていた（下記「既存写真の全数監査」）。
  「既存は確認済みだから見なくてよい」という前提は取らない。
- 既存写真を差し替える作業をするときは、その差し替え分にこの基準を適用する。

### 既存写真の全数監査（2026-08-22 実施済み）

対象123枚（`assets/species-photos` 102 / `images/trust` 10 /
`assets/species/*` 10 / `images/hero` 1）を1枚ずつ目視済み。
**同じ全数監査を再実行する必要はない。** 未処理の指摘だけが下に残っている。

要差し替え（基準に抵触）:

**4件すべて差し替え済み**（PR #34 / commit e9f3b23）。旧写真（出血個体・2個体伏せ・
腹甲のみ・甲羅のみ）はリポジトリから消えており、再監査で基準抵触は0件だった。
差し替え後の写真・出典・ライセンスは下記のとおり全層で一致している。

| slug | 差し替え後の出典 | 作者 | ライセンス |
|------|------------------|------|-----------|
| `ornate-box-turtle` | iNaturalist 観察 93671651 | Catherine C. Galley | CC BY 4.0 |
| `spiny-softshell-turtle` | iNaturalist 観察 30120195 | Rachel Stringham | CC BY 4.0 |
| `scorpion-mud-turtle` | iNaturalist 観察 63998380 | Hugo Hulsberg | CC0 1.0 |
| `florida-mud-turtle` | iNaturalist 観察 60847369 | mark-groeneveld | CC BY 4.0 |

残る確認事項:

- `florida-mud-turtle` は頭部のクローズアップで、識別点（腹甲2ヒンジ）が写っていない。
  背甲が無地（bauriiの3本条線がない）ことから steindachneri と整合するが、
  「識別点が写っていること」という採用基準は満たしきれていない。構図としても
  枯れ枝が顔を横切る。基準違反ではないため差し替えは保留し、亀好きさんの判断を待つ。
- `spiny-softshell-turtle` は背側からの構図で、mutica との決め手である前縁の棘と
  鼻孔の隔壁隆起を画像上で確認できない。甲のサンドペーパー状の質感は spinifera と
  整合。同定は iNaturalist のコミュニティ同定に依拠している。

亀好きさんの判断待ち:

| slug | 理由 |
|------|------|
| `greek-tortoise` | 真上から・頭も四肢も引っ込み・硬貨をスケールに並べた計測写真 |
| `collier-snake-necked-turtle` | 砂に平たく伏せ、目は閉じて見える。人の手が覆いかぶさる構図 |
| `wood-turtle` | 背甲のみ。手に持たれており生存は分かるが状態が見えない |

現状維持と決めたもの（代替候補なし・将来改善）:

| slug | 判断と根拠 |
|------|-----------|
| `pancake-tortoise` | 岩の隙間に挟まり暗くピントも合っておらず、識別点（極端に扁平な甲・暗色放射ライン）が写っていない。だが差し替え先が存在しないため現状維持とする。iNaturalist Open Data（S3・2026-07-27版）を全走査し、Malacochersus tornieri は該当観察109件・該当写真177枚。ライセンスは CC-BY-NC 165 / CC-BY 9 / CC-BY-NC-SA 2 / CC-BY-SA 1 で、CC0 はゼロ。quality_grade=research かつ商用利用可を満たすのは1枚のみで、それが現行写真そのもの（obs 56152762 / Matt Pilkington / CC BY 4.0）だった。視覚的に優れた写真は存在するがすべて casual grade の飼育（動物園）個体。将来 research grade の商用可写真が投稿されたら差し替える |

出典URL重複の監査で判明し、対処したもの:

| slug | 内容 |
|------|------|
| `mississippi-map-turtle` | 旧写真に第三者の「© Arthur Windsor」表示が焼き込まれていた一方、サイトのクレジットは Sam Kieschnick / CC BY 4.0 / obs 35213614 で、権利根拠を確認できなかった（この観察IDは false-map-turtle と共有され、両ページの実画像は別物）。iNaturalist Open Data を走査し、taxon 39849 (Graptemys pseudogeographica kohnii, subspecies) の research grade × 商用可 × 800×600以上の候補28枚を目視比較のうえ差し替えた。新写真は photo 170209451 / Schyler Brown / CC0 1.0。眼後の三日月斑・白い虹彩・首縞が眼に達しないことをすべて確認済み。※ 撮影地はテキサス州で位置精度29km。ミシシッピ川水系の域外にあたる可能性があり、同定は形態形質と iNaturalist のコミュニティ同定に依拠している |

出典URL重複9グループの一括処理（2026-08-23）:

同一観察IDを複数ページが共有していた9グループ21ページを、実画像・MD5・
一次データ（iNaturalist Open Data 2026-07-27版）で照合した。21ページとも
クレジット4層は一致していたが、グループ内の実画像はすべて別物で、
1観察=1個体という前提が成立していなかった。

一次データで出典を証明できた2件は現状維持（KEEP）:

| slug | 根拠 |
|------|------|
| `reeves-turtle` | photo 249782015 → observer `geologyistheway` = Samuele Papeschi / CC-BY / research / Mauremys reevesii。ページ表記と全一致 |
| `red-footed-tortoise` | photo 453340456 → observer `filipeprates` / CC-BY / research / Chelonoidis carbonarius。ページ表記と全一致 |

出典を証明できず差し替えた14件（すべて research grade・商用可・800×600以上・実画像を目視）:

| slug | 新出典 | 作者 | ライセンス |
|------|--------|------|-----------|
| `brown-wood-turtle-manni` | photo 414053415 | Michelle Monge-Velazquez | CC BY 4.0 |
| `painted-wood-turtle` | photo 13510207 | Dan Riley | CC BY 4.0 |
| `cumberland-slider` | photo 364092938 | Max G.W. Verheij | CC0 1.0 |
| `red-eared-slider` | photo 6777689 | Laura Clark | CC BY 4.0 |
| `yellow-bellied-slider` | photo 66948731 | Joshua Liverman | CC BY 4.0 |
| `northern-diamondback-terrapin` | photo 505897694 | aberkov | CC BY 4.0 |
| `ornate-diamondback-terrapin` | photo 377182688 | Matthew | CC BY 4.0 |
| `chinese-softshell-turtle` | photo 504765200 | Karen Offereins | CC BY 4.0 |
| `cherry-head-tortoise` | photo 342981503 | MadMagpie | CC0 1.0 |
| `yaeyama-pond-turtle` | photo 429295308 | Stefan Curth | CC BY 4.0 |
| `yellow-pond-turtle` | photo 484479287 | 許慶棠Ray | CC BY 4.0 |
| `eastern-mud-turtle` | photo 83968654 | stephen | CC BY 4.0 |
| `mississippi-mud-turtle` | photo 129563098 | Cody Stricker | CC BY 4.0 |
| `chinese-box-turtle` | photo 66931158 | 葉子 | CC0 1.0 |

差し替えできず HOLD とした5件:

| slug | 理由 |
|------|------|
| `nicaragua-wood-turtle` | Rhinoclemmys pulcherrima incisa は research×商用可×800×600 を満たす写真が0件 |
| `carolina-diamondback-terrapin` | 候補4枚のうち規格を満たすのは1枚で、水没して識別不能 |
| ~~`canton-reeves-turtle`~~ | **解消済み**。photo 233939363 / mami_t_t / CC BY 4.0 / research / Mauremys reevesii（2022-09-30・東京都）へ差し替えた。岩上でバスキング中の健全個体で、頭部の黄条線と背甲のキールを確認。これにより出典URL重複は 1グループ → 0 になった |
| `albino-chinese-softshell` | アルビノ個体の research grade 写真が存在しない |
| `taiwan-box-turtle` | 候補2枚のみ。1枚は甲片標本＋定規、1枚は撮影者名の透かし入り |

`chinese-box-turtle` は実画像の出所が photo 96478948（brentwhite1213 / CC-BY-SA /
Cuora flavomarginata evelynae）だったのに対し、ページ表記は「祐 / CC BY 4.0 /
obs 373535988」で作者・ライセンス・観察ID・亜種のすべてが食い違っていた。

基準には触れないが別の問題:

| slug | 理由 |
|------|------|
| `albino-chinese-softshell` | 通常個体に見える。観察ID 245665 をスッポンのページと共用 |
| `european-pond-turtle` | 全身黄色のアルビノ個体で、種の代表写真として誤解を招く |
| `marginated-tortoise` / `russian-tortoise` | 交尾中の個体。禁止事項ではないが代表写真としての適否は要判断 |

差し替えが済んだ行はこの表から削除する。表が空になったら監査結果の節ごと畳んでよい。

### 生体写真監査の完了（2026-08-23・クローズ）

**生体写真の監査・差し替えプロジェクトはここで完了とする。**

- 出典URL重複: 10グループ24ページ → **0グループ**
- 画像MD5重複: 0件（全100枚）
- 権利上の危険（第三者の著作権表示）: 解消済み
- 差し替え実績: 16件（mississippi-map-turtle ＋ 一括14件 ＋ canton-reeves-turtle）
- KEEP: 2件（reeves-turtle / red-footed-tortoise。一次データで出典を証明済み）

HOLD 5件は **新しい利用可能ソースが出るまで再調査しない**:

| slug | 理由 |
|------|------|
| `nicaragua-wood-turtle` | R. p. incisa は research×商用可×800×600 を満たす写真が0件 |
| `carolina-diamondback-terrapin` | 規格を満たす候補が1枚のみで、水没して識別不能 |
| `albino-chinese-softshell` | アルビノ個体の research grade 写真が存在しない |
| `taiwan-box-turtle` | 候補2枚のみ。甲片標本＋定規 / 撮影者名の透かし入り |
| `pancake-tortoise` | research×商用可が現行写真1枚のみ（前述） |

いずれも iNaturalist Open Data の全走査で「素材が実在しない」ことを確認済み。
調査を再開する条件は、iNaturalist に新規投稿が出るか、別出典を開拓した場合のみ。

**次工程（写真プロジェクトとは分離）**: 既存10ページのクレジット表記ゆれ。
figcaption が Wikimedia Commons 由来で検証スクリプトがライセンスを拾えないもの5件
（`eastern-painted-turtle` / `mississippi-diamondback-terrapin` /
`texas-diamondback-terrapin` / `tunisian-greek-tortoise` / `western-painted-turtle`）と、
alt の和名がクレジット見出しと異なる表記のもの5件（`amazon-matamata` /
`eastern-hermann-tortoise` / `pink-bellied-side-necked-turtle` /
`west-african-mud-turtle` / `western-hermann-tortoise`）。実害は小さい。

### 絶対に使わない写真

- **甲羅が割れている・欠けている個体**
- **何かに押しつぶされている、圧迫されているように見える個体**
- 死んでいる個体、死骸、甲羅だけが残っている写真
- 衰弱・負傷しているように見える個体
- 生死や健康状態が判断できない姿勢（四肢を投げ出して伏せている等）
- 落ち葉・枝・瓦礫などに埋もれていて、閉じ込められているように見える構図

飼育を考えている人が最初に見る写真である。痛々しい写真、かわいそうに見える
写真は、種の魅力を伝えないどころかサイトの信頼を損なう。

### 採用する写真

- 健康な生体が、自然な姿勢でいること
- 甲羅・四肢・頭部に損傷がないこと
- その種・亜種の識別点が写っていること

### 手順（省略しない）

1. 候補を検索する（`mode=search` は読み取り専用）
2. **必ず画像を1枚ずつ開いて実物を目視する。**
   ログの学名・ライセンス・解像度が通っていても、それは「何が写っているか」を
   保証しない。検索が返す候補には、割れた甲羅・営巣跡・死骸が普通に混ざる。
3. 上の「絶対に使わない」に1つでも当たれば、その候補は捨てて次を見る
4. 見ていない画像を「確認した」と書かない

## 亜種PROJECT Phase B の完了記録（2026-08-23）

Phase B 候補11件を repo 状態と照合して確定した。**再監査は不要。**

既に実装済みだったもの 5件（commit 1421bf9）:
`eastern-painted-turtle` / `western-painted-turtle` / `tunisian-greek-tortoise` /
`mississippi-diamondback-terrapin` / `texas-diamondback-terrapin`

DROP 3件 — iNaturalist taxonomy で **active=false**（廃止済みタクソン）:

| 候補 | taxon | 理由 |
|------|-------|------|
| `Cuora amboinensis amboinensis` | 39897 | active=false |
| `Cuora amboinensis couro` | 39896 | active=false |
| `Kinosternon scorpioides albogulare` | 39727 | active=false。`Kinosternon albogulare`（taxon 1642141）が独立種として active のため、亜種ではなく別種扱い。亜種PROJECTの対象外 |

IMPLEMENT 1件:

| slug | 学名 | 写真 |
|------|------|------|
| `moroccan-greek-tortoise` | Testudo graeca graeca（taxon 1629023 / subspecies / active） | photo 463181313 / Valentin Moser / CC BY 4.0 / research / モロッコ産 |

HOLD 2件 — タクソンは有効だが写真が条件を満たさない:

| 候補 | 理由 |
|------|------|
| `Testudo graeca cyrenaica` | taxon 40030 は active だが research grade 観察が世界で3件のみ。商用可の候補は1枚で代替なし。飼育情報の一次資料も乏しく、流通実態がほぼない |
| `Emydura subglobosa worrelli` | taxon 607063 は active だが候補1枚のみ。乾いた地面での頭部クローズアップで皮膚が乾燥し眼も暗く、生死・健康状態が判断しづらい。識別形質も写っていない |

HOLD 2件は **新しい利用可能ソースが出るまで再探索しない**。

## NO-REWORK GATE（恒久ルール・2026-08 亀好きさん承認）

重複作業の再発防止ルール。全スキル・全作業に適用する。

- 完了済み・監査確定済みの工程を再実行しない。
- 既存の確定結果（監査表・判定・取得済み一次データ）は固定入力として使う。
- 再調査を許可するのは次の場合のみ:
  ① 対象データが変更された ② 新しい矛盾が見つかった
  ③ 新証拠が出た ④ ユーザーの明示指示がある
- 「念のため」「安全確認」「最終確認」は再調査の理由にしない。
- 再調査する場合は、前回結果を再利用できない具体的理由を開始前に示す。
  理由を示せなければ再調査をスキップし、未解決工程へ進む。
- 1件ずつ承認待ちにせず、同一スコープの作業は可能な限り一括処理する。
- 横断検証（全種スキャン等）は全修正が終わった後に1回だけ行う。
  検証で新しい問題が見つかった場合は、その問題だけを修正して再確認する。
  正常と確認済みの項目を最初から再監査しない。

## KAME LIFE GUIDE 改善方針（恒久・完成度を磨くフェーズ）

現在の KAME LIFE GUIDE は「新機能を増やすフェーズ」ではなく
**「完成度を磨くフェーズ」** である。新機能追加は原則として優先しない。

### 優先順位

1. 第一印象の改善
2. ブランドの強化
3. 実写写真の充実
4. ホームページの適切な簡素化
5. 信頼性・品質の継続的な向上

### 改善提案の基本方針

- 次を優先し、**既存資産を磨く**ことを基本とする：
  UX / UI / ブランド / 写真品質 / 導線 / 可読性 / 操作性 / 信頼性
- ホームページ戦略は **「Rebuild」ではなく「Re-orchestrate」**。
  既存資産を活かしながら完成度を高めることを原則とする。
- 今後の **全レビュー・実装・改善提案** は、上記2憲法（名称・改善方針）を
  基準として適用する。

## 亜種PROJECT Phase C の完了記録（2026-08-23）

Phase C は「以前の全件監査で C判定された亜種候補」を扱う工程だが、
**その C判定リストはリポジトリに残っていなかった**。推測で一覧を作ると漏れも混入も出るため、
一次データから候補集合を作り直した。**この候補作成と判定はやり直さない。**

候補の作り方（機械列挙）:
`data/species-master.json` の掲載86種の二名法名を鍵に、iNaturalist Open Data の
`taxa.csv.gz`（1,650,967行）を1パス走査し、カメ目（ancestry に 39532）に属する亜種を全件抽出。
149件がヒットし、そこから **active=false / 既実装29件 / Phase B 決着済み6件** を除いた
**56件**が Phase C の候補集合になった。C判定候補はこの集合の部分集合にあたる。

判定: **IMPLEMENT 5 / HOLD 3 / DROP 48**

IMPLEMENT 5件（すべて rank=subspecies・active=true。写真は research grade × 商用可 ×
800×600以上を満たし、1枚ずつ実物を目視した）:

| slug | 和名 | 学名 | 追加価値 | 写真 |
|------|------|------|---------|------|
| `midland-painted-turtle` | チュウブニシキガメ | Chrysemys picta marginata | ニシキガメ3亜種で唯一欠けていた中間亜種。腹甲 figure が「中央に収まる」識別点 | photo 365358288 / Robert Roach / CC BY 4.0 / Ontario |
| `suwannee-cooter` | スワニークーター | Pseudemys concinna suwanniensis | クーター類でもとくに大型（メス40cm級）。設備要求が親種より一段重い | photo 592142792 / Ashwin Srinivasan / CC BY 4.0 / Florida |
| `sonora-wood-turtle` | ソノラクジャクガメ | Rhinoclemmys pulcherrima rogerbarbouri | アカスジヤマガメ4亜種で最も北・最も地味。購入前に知る価値のある差 | photo 222282044 / Francisco Farriols Sarabia / CC BY 4.0 / Sinaloa |
| `guerrero-wood-turtle` | ゲレーロクジャクガメ | Rhinoclemmys pulcherrima pulcherrima | 基亜種。これで R. pulcherrima 4亜種が完備 | photo 90079125 / Jalil R. / CC BY-SA 4.0 / Guerrero |
| `mangrove-diamondback-terrapin` | マングローブダイヤモンドバックテラピン | Malaclemys terrapin rhizophorarum | SHINDAN-SPECIES.md が「その他の亜種（マングローブ等）」として未着手を明記していた1件 | photo 13445385 / Simon Tonge / CC0 1.0 / Florida |

HOLD 3件 — **新しい利用可能ソースが出るまで再探索しない**:

| 候補 | 理由 |
|------|------|
| `Malaclemys terrapin tequesta` | taxon 39837 は active で、掲載価値の判断も IMPLEMENT 相当（これが入ればテラピン7亜種が完備する）。だが採用条件を満たす写真が1観察6枚しかなく、6枚とも屋内・人の手の上の同一幼体で、亜種の識別点が写っていない。写真だけ揃えば実装できる |
| `Cuora mouhotii obsti` | taxon 115579 は active だが research grade 観察が世界で1件のみ（ベトナム北部）。採用条件を満たす写真素材が存在しない |
| `Graptemys nigrinoda delticola` | taxon 39857 は active だが research grade 観察が3件のみ。採用条件を満たす写真素材が事実上ない。国内流通も極小 |

DROP 48件の内訳（同じ理由でまとまるものは束ねた）:

| 理由 | 件数 | 例 |
|------|------|-----|
| 法規制で飼育不可・診断除外 | 4 | `Cuora flavomarginata evelynae`（天然記念物）／`Pyxis arachnoides` 3亜種（CITES I） |
| サイトの確定済み分類方針と衝突 | 2 | `Terrapene ornata` 2亜種（commit ad6bbb7 で単型種へ同期済み） |
| 基亜種で、既存の種ページと重複 | 12 | `Mauremys mutica mutica`／`Pseudemys concinna concinna` 等 |
| 亜種指定の流通・識別の実態がない | 30 | `Aldabrachelys` 4／`Apalone` 6／`Emys orbicularis` 6／`Testudo graeca` 6／`Testudo horsfieldii` 4 等 |

基亜種の扱いは次の規則で統一した:
**「同種の亜種ページが既に2枚以上あり、基亜種だけが欠けている場合にのみ基亜種ページを作る」**。
`Chrysemys picta picta`（トウブニシキガメ）が既にこの形で実装されており、
`Rhinoclemmys pulcherrima pulcherrima` を今回追加したのは同じ理由。それ以外の基亜種は
種ページと内容が重複するため DROP とした。

飼育数値は Phase B と同じく親種のレコードを継承し、master の note に継承であることを明記した。
分布はページ本文・identification とも iNaturalist の research grade 観察の実測範囲に整合する
範囲でだけ書き、断定していない。和名は既存の亜種ページと同じく英名の音写または産地にもとづく
当サイト表記で、国内で定着した和名ではないことを各ページの「まだ分かっていないこと」に明記した。

`guerrero-wood-turtle` の写真だけライセンスが **CC BY-SA 4.0**（継承条件つき）。
該当タクソンの採用可能な写真が1観察5枚しかなく、5枚とも CC BY-SA だったため。
サイトには既に CC BY-SA の写真があり前例に沿うが、把握しておくこと。

### title 重複の修正（解消済み・2026-08-24）

Phase B / C で追加したページの `<title>` と `og:title` に語の重複があり、全6件とも解消した。
**再監査しない。**

| 対象 | 誤 | 正 | 解消 |
|------|----|----|------|
| `eastern-painted-turtle` / `western-painted-turtle` / `mississippi-diamondback-terrapin` / `texas-diamondback-terrapin` | 水温・餌・設備・**餌・設備**・難易度 | 水温・餌・設備・難易度 | PR #37（merge 793f859） |
| `moroccan-greek-tortoise` / `tunisian-greek-tortoise` | 温度・餌・ケージ・**餌・設備**・難易度 | 温度・餌・ケージ・難易度 | 本コミット |

いずれも `<title>` と `og:title` の2行のみの修正で、本文・写真・学名・和名・CITES・
飼育情報・構造化データは無変更。修正後、サイト全体でこの重複パターンは0件。

---

## 亜種PROJECT 正式クローズ（2026-08-24）

**亜種PROJECT は Phase A / B / C をもって完了した。以後は再開しない。**

- **候補集合を使い切った。** Phase C で `taxa.csv.gz` を全走査し、サイト掲載86種に属する
  カメ目の亜種149件を機械列挙。そこから active=false・既実装29件・Phase B 決着6件を
  除いた56件を全件判定した（Phase C: IMPLEMENT 5 / HOLD 3 / DROP 48）。
  Phase B の11候補は別途決着済み（実装済み5 / IMPLEMENT 1 / HOLD 2 / DROP 3）。
  **未判定はゼロ。新規の亜種候補探索は行わない。**
- **HOLD 5件は再探索禁止。** Phase B 2件（`Testudo graeca cyrenaica` /
  `Emydura subglobosa worrelli`）＋ Phase C 3件（`Malaclemys terrapin tequesta` /
  `Cuora mouhotii obsti` / `Graptemys nigrinoda delticola`）。
  いずれも「タクソンは有効だが採用条件を満たす写真素材が存在しない」ことを
  一次データで確認済み。**iNaturalist に新規投稿が出たときだけ再開する。定期チェックは不要。**
  うち `Malaclemys terrapin tequesta` だけは掲載価値の判断が IMPLEMENT 相当で、
  写真さえ揃えば即実装できる（これが入ればテラピン7亜種が完備する）。
- **本プロジェクト全体が NO-REWORK GATE の対象。** Phase A / B / C の再監査、
  候補の再判定、HOLD 案件の再探索、title 重複の再点検は行わない。
  再開できるのは NO-REWORK GATE の4条件（データ変更／新しい矛盾／新証拠／明示指示）を
  満たす場合のみ。

**次工程は運営・成長フェーズ。** `docs/operations/` の
`OPERATIONS_MANUAL.md` / `WEEKLY_REVIEW.md` / `MONTHLY_REVIEW.md` / `KPI.md` /
`DECISION_RULE.md` に従い、GSC/GA4 の実測値がトリガーを引いたページのみを改善する
（週最大3ページ）。
