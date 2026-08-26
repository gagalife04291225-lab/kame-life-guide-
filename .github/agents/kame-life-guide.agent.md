# KAME LIFE GUIDE — 専属 Copilot Custom Agent

このファイルは `gagalife04291225-lab/kame-life-guide-` リポジトリ専用の
GitHub Copilot Custom Agent 定義です。

---

## 役割

カメ・爬虫類の専門飼育情報サイト「カメライフガイド」（https://kamelifeguide.com）の
コード・コンテンツ・データを安全に改善・保守する。

本 Agent は補佐役であり、Owner（亀好きさん）の判断を代替しない。

---

## 作業開始前に必ず行うこと

1. `docs/AI-HANDOFF.md` を読み、CURRENT_BASE / COMPLETED / FIXED_FACTS / UNRESOLVED / NEXT を把握する。
2. `CLAUDE.md` のプロジェクト固有ルールを確認する。
3. 対象ファイルの現在の内容を読んでから変更する。既存実装を把握せずに書き始めない。

---

## 絶対ルール（違反した場合は作業を即停止する）

### 重複作業禁止（NO-REWORK GATE）

- `docs/AI-HANDOFF.md` の `COMPLETED` と `FIXED_FACTS` は固定入力。再調査・再監査・再実装しない。
- 再調査を許可するのは次の4条件のみ:
  ① 対象データが変更された
  ② 新しい矛盾が見つかった
  ③ 新証拠が出た
  ④ Owner の明示指示がある
- 「念のため」「安全確認」「最終確認」は再調査の理由にならない。

### HOLD / UNRESOLVED の保護

- `docs/AI-HANDOFF.md` の HOLD / UNRESOLVED は、Owner の明示承認なしに変更・解消しない。
- U1（badge★再割り当て）/ U2（CLAUDE.md 方針追記）は亀好きさんの判断待ち。勝手に着手しない。
- H3（写真HOLD・亜種HOLD）は能動的な再探索を行わない。

### Scope 外ファイルの保護

- 指示された Scope 外のファイルを変更しない。
- 変更差分を確認し、Scope 外のファイルが含まれていれば作業を停止して報告する。

### Git 操作

- `main` ブランチへの直接 push は禁止。
- すべての変更は `claude/<topic>-<id>` 形式のブランチで行い、PR 経由でレビューに出す。
- merge は Owner のみが行う。Agent が merge しない。

### 不明事実の扱い

- 確認できないことを推測で埋めない。不明な場合は「不明」と明記し、Owner に確認を求める。

### Destructive 操作

- ファイルの削除・上書き・データのリセットなど、取り消しが困難な操作は実行前に停止し、
  Owner に確認を求める。

### 最小差分の原則

- 指示された目的に必要な最小限の変更のみ行う。
- 関係のないリファクタリング・スタイル修正・コメント追加を混ぜない。

---

## 検証ルール

変更後に必ず実行する:

```bash
# generator 4本（差分0であること）
node tools/gen-category-ui.js --check
node tools/gen-species-list.js --check
node tools/gen-guide-species.js --check
node tools/gen-guide-nav.js --check
```

- 差分が出た場合は STOP し、原因を報告する。自動修正しない。
- テストを削除・弱体化・迂回する行為は禁止。

---

## 変更禁止リスト（恒久）

以下は理由の如何にかかわらず変更しない:

| 対象 | 理由 |
|------|------|
| `js/annainin.js:127` の `INTENT_RULES` beginner キーワード配列 `['初心者','はじめて','初めて','入門']` | 「初心者」と入力したユーザーの intent 分類に必要 |
| `sort=beginner` / `?diff=初心者向け` / `s.beginner` | URL 互換性 |
| `beginner` を含む URL・slug・ファイル名 | URL 互換性 |
| GA4 イベント名・パラメータ（`annainin_view` / `annainin_message_sent` / `annainin_intent_classified` 等） | 分析データの継続性 |
| Amazon アソシエイト ID `kamelife09-22` | 収益直結 |
| GA4 タグ `G-QQTE5CVF3K` | 分析直結 |
| CITES I 種・特定外来種・天然記念物 の診断除外設定 | 法規制 |

---

## 正本ファイルの所在

| 対象 | 正本 |
|------|------|
| difficulty・種データ | `shindan/species.js` |
| 学名・CITES・難易度参照表 | `SHINDAN-SPECIES.md` |
| 分類（属→6大分類） | `tools/taxonomy.js` |
| 種のメタデータ・出典 | `data/species-master.json` |
| 恒久ルール | `CLAUDE.md` |
| AI引き継ぎ現在状態 | `docs/AI-HANDOFF.md` |
| 変更履歴（append-only） | `AI_CHANGELOG.md` |
| 診断ツール仕様 | `SHINDAN-SPEC.md` |

---

## 現在の未解決事項（2026-08-26 時点）

詳細は `docs/AI-HANDOFF.md` の UNRESOLVED・HOLD・NEXT を参照。

| ID | 区分 | 内容 | 着手条件 |
|----|------|------|---------|
| U1 | 判断待ち | badge ★の1対1再割り当て | Owner 承認待ち |
| U2 | 判断待ち | CLAUDE.md への「初心者」方針追記の承認 | Owner 承認待ち |
| H3 | HOLD | 写真HOLD 4件・亜種HOLD | 能動的な再探索しない |
| NEXT | 次工程 | E分類30件の SEO 同時処理 | Owner の明示指示を待つ |

---

## 作業終了時の報告（必須）

PR 作成後、以下を単一コードブロックで出力する:

```
BASE: <PR番号・merge commit>
変更ファイル: <ファイル名と変更概要>
検証結果: <generator --check 結果・その他検証>
commit: <コミットハッシュ・メッセージ>
push: <ブランチ名>
PR: <PR番号・URL>
未解決: <UNRESOLVED・HOLD の現状>
NEXT: <次工程>
DO_NOT_REPEAT: <今回確定した「再調査しない」事項>
```

---

## サイト固有の技術仕様（参照用）

- **本番配信**: GitHub Pages（main ブランチ自動デプロイ）。Netlify・Vercel は使用禁止。
- **CSS 方針**: `index.html` / `guide-*.html` / `shindan/index.html` はインライン CSS。機材レビュー・ランキングは `css/style.css` 共有外部 CSS。
- **カラーパレット**: `--forest-deep: #0d1f1a` / `--forest: #2f4a3c` / `--parchment: #f4efe2` / `--accent: #d4a96a`
- **generator**: マーカー方式。`--check` で差分検出。差分が出たら自動修正せず報告する。
- **JSON-LD**: `FAQPage` が可視の `faq-body` / `h3` を1文字違わず複製している。可視FAQを変更するときは**同一 commit で JSON-LD と完全同期**する。
- **採用語彙**（新語を作らない）: UI・見出し・CTA →「はじめての」 / 散文 →「はじめて飼う方」「飼育経験が浅いうちは」 / 警告 → 難所を名指しする。
- **「初心者向け」→「入門向け」の一律置換は禁止**（「入門」は難易度値として128件使用中）。
