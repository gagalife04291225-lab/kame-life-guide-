# KAME LIFE GUIDE — Development Constitution

- **Version:** 2.0
- **Status:** DRAFT（本文完成・F1/F2 確認待ち。批准・公開は未）
- **Last Updated:** 2026-07-16
- **Supersedes:** CLAUDE.md（開発運用ルール部分）／ SHINDAN-SPEC.md（作業ルール・GitHub API鉄則部分）
- **Conforms To:** MANIFEST.md ＞ AGENTS.md（`gagalife04291225-lab/ai-company-os`）

> **規範キーワード（RFC2119準拠）:** 本文の **MUST / MUST NOT** は絶対要件、**SHOULD / SHOULD NOT** は正当な理由なく逸脱してはならない推奨、**MAY** は許可を表す。「できれば」「なるべく」等の曖昧表現は本憲法では用いない。
> **プレースホルダ:** 【CONFIRM_REQUIRED】は Owner の確認が未完で、推測補完してはならない箇所を示す。

---

## Chapter 1 — Purpose & Governance

### 1.1 Purpose
- §1.1-R1: 本憲法は KAME LIFE GUIDE（Project-001）における開発運用の**唯一の最上位規範**であり、全 Role・全 Actor・全作業が準拠 MUST。
- §1.1-R2: 本サイトは「AIが作ったサイト」ではなく、**長年の飼育経験を持つ運営者による専門サイト**として制作 MUST。

### 1.2 Core Principles
- §1.2-R1: すべての主張は検証 MUST（CLAIM / SOURCE / CONFIDENCE / DOUBT / RECONCILE）。
- §1.2-R2: **「分からないことは分からない」と明記 MUST**。推測で空欄を埋めては MUST NOT。
- §1.2-R3: 変更は最小 SHOULD。Scope 外の変更を混在させては MUST NOT。
- §1.2-R4: 情報源は provenance（型）で区別 MUST。質の高い根拠同士の対立（conflict）とリスク報告（caution）を分離 MUST、デマは除外 MUST。
- §1.2-R5: 運営していない種を運営しているように見せては MUST NOT。

### 1.3 Hierarchy
- §1.3-R1: 規範の優先順位は **MANIFEST.md ＞ AGENTS.md ＞ 本憲法 ＞ 下位手順書** MUST。上位が競合時に優先 MUST。
- §1.3-R2: 各下位手順書はヘッダに `Conforms-to: Constitution v2.x` を記載 MUST。
- §1.3-R3: AGENTS.md §4（default branch 直 push 禁止）への Project-001 例外は、本憲法では **Automation の限定スコープ及び緊急修正の事後PRのみ**に縮小して継承 MUST（無制限の直 push は認め MUST NOT）。

### 1.4 Honesty Standard
- §1.4-R1: 実体験・専門資料・長期飼育情報を区別し、根拠を明示 MUST。
- §1.4-R2: 未確定事項は 【CONFIRM_REQUIRED】 として残す MUST。断定しては MUST NOT。

### 1.5 Scope
- §1.5-R1: 本憲法は **KAME LIFE GUIDE（Project-001）のみ**に適用 MUST。
- §1.5-R2: 他プロジェクトへ本憲法をそのまま適用しては MUST NOT。
- §1.5-R3: Chapter 2（Role/Actor）・Chapter 3/4（Git 運用）は将来の汎用テンプレートとして切り出し MAY。

### 1.6 Governance（文書階層）
- §1.6-R1: 文書は次の一方向依存に従う MUST。上位を変えずに下位で上位を上書きしては MUST NOT。

```
Rule       憲法の原則・Invariants（本憲法 Ch1–2）
  ↓ conform
Policy     products-master-policy / PAT Policy / Amendment Policy
  ↓ conform
Procedure  Git 4経路 / CLAUDE.md 手順 / SHINDAN-SPEC
  ↓ conform
Checklist  species_page_checklist
  ↓ conform
Template   qa_snapshot_template / species-template
```

- §1.6-R2: 上位層を改定した場合、依存する下位層を再検証 MUST。

---

## Chapter 2 — Role, Actor & Authority

### 2.1 Roles（不変層）
- §2.1-R1: 本憲法本文は Role のみで責務を記述 MUST。具体的な AI/人物名（Actor）を本文に直書きしては MUST NOT。

| ID | Role | 責務 |
|----|------|------|
| RO-1 | Project Owner | 最終決定・Approve・Merge・Publish・憲法批准 |
| RO-2 | Architect / PM | 設計・提案・要件整理 |
| RO-3 | Implementer | 実装・テスト・commit・push・PR作成・事実検証 |
| RO-4 | Reviewer / Auditor | 事前レビュー・事後監査 |
| RO-5 | Automation | 宣言スコープ内の自動処理 |

### 2.2 Actor Mapping（可変層）
- §2.2-R1: Role への Actor 割当は Appendix B の Actor Mapping 表でのみ管理 MUST。AI の追加・変更時は当該表のみ更新 MUST、本文を改訂しては MUST NOT。
- §2.2-R2: 1 Role に複数 Actor を割当て MAY。その場合 **Lead Actor を 1 つ指定** MUST（指示の一次窓口）。
- §2.2-R3: 現行割当（2026-07）— Owner=**TeTe**、Architect/PM=ChatGPT、Implementer=Claude Code、Reviewer/Auditor=ChatGPT、Automation=rakuten-sync Bot。

### 2.3 AI責務マトリクス（RACI+）
- §2.3-R1: 各活動の責任は次に従う MUST。

| 活動 | 一次責任 | 最終責任 | 承認者 | 監査者 | レビュー者 |
|------|---------|---------|--------|--------|-----------|
| 設計 | RO-2 | RO-1 | RO-1 | RO-4※ | RO-1/RO-3※ |
| 実装 | RO-3 | RO-3 | RO-1 | RO-4 | RO-4 |
| テスト | RO-3 | RO-3 | — | RO-4 | RO-4 |
| commit | RO-3 | RO-3 | 自律 | RO-4 | — |
| push(branch) | RO-3 | RO-3 | 自律/指定branch | RO-4 | — |
| PR作成 | RO-3 | RO-1 | RO-1 | RO-4 | RO-4 |
| Merge | RO-1 | RO-1 | RO-1 | RO-4 | — |
| 公開 | RO-1 | RO-1 | RO-1 | — | — |
| 緊急修正 | RO-3 | RO-1 | RO-1(事後可) | RO-4 | RO-4(事後) |
| Bot同期 | RO-5 | RO-1(監督) | 自動 | RO-3/RO-1 | — |
| 憲法改定 | RO-2(起案) | RO-1 | RO-1 | RO-4 | RO-1 |

- §2.3-R2（※独立性）: RO-2 が著した設計成果物のレビュー者・監査者は、当該 Actor 以外（RO-1 又は RO-3）へ再割当 MUST。自著の自己レビューを行っては MUST NOT。

### 2.4 Design Authority
- §2.4-R1: 権限の所在は次のとおり MUST。

| 権限 | 保有 Role |
|------|----------|
| Architecture Proposal | RO-2 |
| Implementation Proposal | RO-3 |
| Final Decision | RO-1 |
| Approve / Merge / Publish | RO-1（単独） |

- §2.4-R2: Architect と Implementer で設計意見が対立した場合、両論を併記し RO-1 へエスカレーション MUST。**最終決定は常に RO-1** MUST。Actor 同士で Merge・公開を決しては MUST NOT。

### 2.5 Verification Duty
- §2.5-R1: 他 AI（Grok 等）の生成物は、事実未検証のまま採用しては MUST NOT。
- §2.5-R2: 製品名・ASIN は実在確認後にのみ記述 MUST。架空の製品・種名を記述しては MUST NOT。

### 2.6 Invariants
- **I1:** Merge は RO-1 のみが実施 MUST。Actor は Merge しては MUST NOT。
- **I2:** 人手・Web版の変更は PR 経由 MUST。protected branch への直 push は RO-5 の限定スコープに限る MUST。
- **I3:** 収益ゲート（Amazon `kamelife09-22` / GA4 `G-QQTE5CVF3K`）と法令ゲート（CITES 等の除外規則）は全経路で必須 MUST。Actor はこれらを無効化しては MUST NOT。
- **I4:** 各活動の最終責任は単一主体 MUST。公開物の最終責任は常に RO-1 MUST。
- **I5:** Actor は自著の Artifact の Reviewer/Auditor になっては MUST NOT。

---

## Chapter 3 — Git Operations

### 3.1 Operation Paths
- §3.1-R1: すべての Git 変更は次の 4 経路のいずれかに属す MUST。

| 経路 | 用途 | 実行 Role |
|------|------|-----------|
| ① Claude Code on the Web | 通常の実装 | RO-3 |
| ② Automation | 定期自動同期 | RO-5 |
| ③ 人手作業 | Owner による直接編集 | RO-1 |
| ④ 緊急修正 | 本番障害の即時対応 | RO-3/RO-1 |

### 3.2 Branch Strategy
- §3.2-R1: ブランチ命名は MUST — `claude/<topic>-<id>`（経路①）／`edit/<topic>`（経路③）／`hotfix/<issue>`（経路④）。経路② は default branch を直更新 MUST。
- §3.2-R2: 経路①④は default branch へ直 push しては MUST NOT（PR 経由 MUST。④は事後PR MUST）。

### 3.3 Scope Lock
- §3.3-R1: push 前に `git status` で差分を確認し、宣言 Scope 外のファイルを変更していないこと MUST。
- §3.3-R2: RO-5 は宣言スコープ（`data/products.js`）以外を変更しては MUST NOT。

### 3.4 Commit Rules & Branch Terminology
- §3.4-R1: コミットメッセージは `type(scope): 要約` 形式 MUST。
- §3.4-R2: 本憲法は Platform 固有語を避け、抽象語 **default branch / protected branch** を用いる MUST（具体名は Chapter 6 の Platform Matrix で解決 MUST）。

---

## Chapter 4 — Branch, PR, Merge, Review, Emergency

### 4.1 Pull Request
- §4.1-R1: 経路①③④の変更は PR で記録 MUST（③の軽微直編集を除き、④は事後PR MUST）。
- §4.1-R2: PR は RO-3 が作成 MAY（明示依頼時）、RO-1 のみが Merge MUST。

### 4.2 Review Layers（二層）
- §4.2-R1: **設計承認（チャット層）** と **Merge承認（Platform層）** は別物として扱う MUST。
- §4.2-R2: チャット層のレビューは RO-4 が行う MUST。Platform 層の Merge 承認は RO-1 のみ MUST。RO-2/RO-4 は Platform 上で Merge 権を持た MUST NOT。

### 4.3 Merge & Publish
- §4.3-R1: Merge・公開は RO-1 が実施 MUST（Invariant I1）。

### 4.4 Emergency（緊急修正）
- §4.4-R1: 本番障害時、RO-3/RO-1 は `hotfix/<issue>` で即時修正し push MAY。
- §4.4-R2: 緊急修正は事後に PR で正規化し記録 MUST。無記録の直 push は MUST NOT。
- §4.4-R3: protected branch 設定を恒久的に無効化しては MUST NOT。

---

## Chapter 5 — Quality Assurance, Review, Audit & Compliance

### 5.1 Fact Verification
- §5.1-R1: すべての事実主張に CLAIM/SOURCE/CONFIDENCE/DOUBT/RECONCILE を適用 MUST。

### 5.2 Page QA
- §5.2-R1: species ページ制作時は `species_page_checklist` を全項目実施 MUST。
- §5.2-R2: 完成の要件は「チェックリスト全項目 PASS ＋ QA Snapshot 提出」MUST（実行不能な比喩基準は用いない）。
- §5.2-R3: 種数を減らしては MUST NOT。

### 5.3 Revenue & Legal Gates
- §5.3-R1: 全 Amazon リンクに `tag=kamelife09-22` を付与 MUST。
- §5.3-R2: 全ページに GA4 `G-QQTE5CVF3K` を設置 MUST。
- §5.3-R3: CITES I・特定外来・天然記念物は診断・掲載から除外 MUST。CITES II は「国内CB可・輸入書類要」を明記 MUST。条件付特定外来（アカミミガメ等）は「新規購入不可」を強調 MUST。

### 5.4 Audit Cycle
- §5.4-R1: 監査は RO-4 が実施 MUST。重大変更時は RO-1 が二次監査に入る MUST。

### 5.5 Constitution Compliance
- §5.5-R1: 遵守確認は次のマトリクスに従う MUST。

| 対象 | 確認方法 | 実施箇所 | 担当 |
|------|---------|----------|------|
| Amazonタグ | 文字列存在 | push前Checklist＋CI(将来) | RO-3→RO-4 |
| GA4 | 存在チェック | Checklist＋CI(将来) | RO-3 |
| 法規制 | 種追加時突合 | 手動レビュー＋監査 | RO-4 |
| Git | 保護設定＋`git status` | Platform＋push前 | RO-3/RO-1 |
| QA | checklist＋Snapshot | 手動 | RO-3→RO-4 |
| 診断 | golden-18 等 dry-run | 手動/検証 | RO-4 |

- §5.5-R2: 上表の「CI(将来)」は現時点で未実装であり、現状は push 後フック＋手動確認で代替している事実を記録 MUST（未実装を実装済みと記載しては MUST NOT）。

---

## Chapter 6 — Platform Layer

### 6.1 Platform Matrix
- §6.1-R1: Platform は Actor では**ない**。責任ではなく役割・機能・管理対象で定義 MUST。

| ID | Platform | 役割 | 機能 | 管理対象 | 管理 Role |
|----|----------|------|------|----------|-----------|
| PF-1 | GitHub | Source of Truth・リポジトリ基盤 | 版管理・PR・保護・履歴 | コード/履歴/PR | RO-1(設定)/RO-3(利用) |
| PF-2 | 配信基盤 【CONFIRM_REQUIRED: F1】 | 公開配信・DNS | ドメイン・キャッシュ・リダイレクト | 公開配信/DNS | RO-1 |
| PF-3 | GitHub Actions | CI・自動化実行基盤 | workflow実行（rakuten-sync） | 自動処理環境 | RO-5 |
| PF-4 | Claude Code on the Web | 開発実行環境 | ブラウザ実装・git操作 | 実装作業環境 | RO-3 |
| PF-5 | Termux | 非常時ローカル実行（歴史的） | 端末からのgit操作 | 予備手段 | RO-3/RO-1 |
| PF-6 | Codespaces 等（将来） | 予備クラウド開発環境 | クラウドIDE | 予備手段 | RO-3 |

### 6.2 Platform Independence
- §6.2-R1: 本憲法本文は Platform 固有名に依存しては MUST NOT。Platform の変更・追加は本表の更新のみで完結 MUST。
- §6.2-R2: Platform が変わっても Rule・Role・Invariants は不変 MUST。

---

## Chapter 7 — Deployment

### 7.1 Source of Truth
- §7.1-R1: 本番デプロイ経路は 【CONFIRM_REQUIRED: F1】。確定するまで本節を推測で記述しては MUST NOT。
- §7.1-R2（証拠メモ・非確定）: リポジトリには Cloudflare Pages 用 `_headers`/`_redirects` と CNAME `kamelifeguide.com`、及び `.nojekyll` が存在する。これは事実の記録であり、正式なデプロイ経路の断定では**ない**。

### 7.2 Domain & Canonical URL
- §7.2-R1: 正規URL（canonical）は 【CONFIRM_REQUIRED: F2】。確定まで各文書の canonical 記述を更新しては MUST NOT。

### 7.3 Publishing & Verification
- §7.3-R1: push 後は自動検証フック（`.claude/settings.json`）の指示に従い、デプロイ完了を待って対象ページを検証 MUST。
- §7.3-R2: 公開は RO-1 が最終決定 MUST（Invariant I1）。

---

## Chapter 8 — Mobile-First Development

### 8.1 Claude Code on the Web（正）
- §8.1-R1: 通常の実装・git 操作は Claude Code on the Web（PF-4）を正の手段とする MUST。認証は環境のプロキシで行い、通常運用で PAT 手入力を前提とし MUST NOT。

### 8.2 Termux（歴史的・非常時）
- §8.2-R1: Termux（PF-5）は Web 版が使用不能な非常時にのみ用いる MAY。旧「/tmp不可→~/」「echoで1行ずつ」等の逐次手順は歴史的経緯として Appendix に退避 MUST、常用手順として記載しては MUST NOT。

### 8.3 PAT Policy
- §8.3-R1: PAT は原則不要とし、必要と判断した時点で **最初に「PATが必要」と明示** MUST。
- §8.3-R2: PAT は最小権限・短命（作業完了後に即 revoke）とし、**再利用しては MUST NOT**。

---

## Chapter 9 — Exception Policy

### 9.1 Automation（Bot）
- §9.1-R1: RO-5（rakuten-sync）は `data/products.js` のみを更新 MUST。監査モードでは書込み・commit・push を行っては MUST NOT。

### 9.2 Constitution Amendment
- §9.2-R1: バージョンは semver に従う MUST — MAJOR=責務再定義/互換性破壊、MINOR=章追加/運用調整、PATCH=誤字/リンク。
- §9.2-R2: 改定は誰でも起案 MAY。成立は **RO-1 の承認のみ** MUST。
- §9.2-R3: 改定時、依存する下位手順書の `Conforms-to` を更新し再検証 MUST。

### 9.3 AI_CHANGELOG
- §9.3-R1: Merge 済み変更 1 件につき `AI_CHANGELOG.md` に 1 エントリを追記 MUST（append-only、改ざん MUST NOT）。
- §9.3-R2: エントリは Date / Actor / Change / Reason / PR・Commit / Approver / Conforms を含む MUST。

---

## Appendix

### A. Glossary
- **Role / Actor / Platform / conform / provenance / conflict / caution / Scope Lock / Lead Actor** ほか（Chapter 内定義に準拠）。

### B. Actor Mapping（2026-07）

| Role | Current Actor | Lead |
|------|---------------|------|
| RO-1 Project Owner | TeTe | ○ |
| RO-2 Architect / PM | ChatGPT | ○ |
| RO-3 Implementer | Claude Code | ○ |
| RO-4 Reviewer / Auditor | ChatGPT（自著物は RO-1/RO-3 へ移譲） | ○ |
| RO-5 Automation | rakuten-sync Bot | ○ |

### C. Version History

| Version | Date | 概要 | 承認 |
|---------|------|------|------|
| 2.0 | 2026-07-16 | 初版（Role/Actor/Platform/Governance/Authority/Compliance 導入） | 【CONFIRM_REQUIRED: 批准】 |

### D. Referenced Documents
MANIFEST.md ／ AGENTS.md ／ CLAUDE.md ／ SHINDAN-SPEC.md ／ SHINDAN-SPECIES.md ／ docs/products-master-policy.md ／ docs/species_page_checklist.md ／ docs/qa_snapshot_template.md ／ .claude/settings.json ／ .github/workflows/rakuten-sync.yml

### E. 歴史的経緯（Termux運用・非常時のみ参照）
> 旧 SHINDAN-SPEC.md「GitHub API操作の鉄則」に由来。現行は Claude Code on the Web（PF-4）を正とし、以下は Web 版が使用不能な非常時の予備手順として保存する。
> - ファイル更新は 認証付きGET で SHA 取得 → base64 エンコード → PUT で更新。
> - Termux では作業ディレクトリに `/tmp` を用いず `~/` を用いる。
> - ヒアドキュメントが不可な環境では、内容を分割して書き込む。
