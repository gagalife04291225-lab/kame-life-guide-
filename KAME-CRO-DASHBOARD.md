# KAME LIFE GUIDE — GA4 CRO Dashboard & Weekly Review System
## Phase 12-B Step 2
## version: phase_12A / 2026-06

---

## 1. Dashboard Structure

### Layer 1 — Traffic (Denominator)

| Metric | GA4 Event / Dimension | Note |
|--------|----------------------|------|
| Homepage Views | `homepage_view` (custom) | `homepage_version = 'phase_12A'` でフィルター |
| Sessions | GA4 sessions | デフォルト指標 |
| New Users | GA4 new_users | |
| Avg Scroll Depth | derived: scroll_25/50/75 rate | |

**GA4 Explorer query:**
```
Event: homepage_view
Filter: homepage_version = phase_12A
Segment: Date range (weekly)
```

---

### Layer 2 — Hero KPI

| Metric | GA4 Event | Payload Filter |
|--------|-----------|---------------|
| Primary CTA clicks | `homepage_hero_primary_click` | `location = hero` |
| Secondary CTA clicks | `homepage_hero_secondary_click` | `location = hero` |
| Hero any-click | `hero_cta_click` | |

**Derived KPIs:**

```
Hero Primary CTR  = homepage_hero_primary_click / homepage_view
Hero Any CTR      = hero_cta_click / homepage_view
Hero Scroll Rate  = homepage_scroll_25 / homepage_view
```

**Target:** Hero Primary CTR > 20%

---

### Layer 3 — Scroll Depth

| Milestone | Event | Derived Rate |
|-----------|-------|-------------|
| 25% | `homepage_scroll_25` | scroll_25 / homepage_view |
| 50% | `homepage_scroll_50` | scroll_50 / homepage_view |
| 75% | `homepage_scroll_75` | scroll_75 / homepage_view |

**Target benchmarks:**

| Depth | Target | Below target action |
|-------|--------|-------------------|
| 25% | > 70% | Hero不満 → Hero copy改善 |
| 50% | > 45% | Emotional Hook離脱 → Hook強化 |
| 75% | > 25% | Species Universe離脱 → Universe改善 |

---

### Layer 4 — Species Discovery

| Metric | Event | Dimension |
|--------|-------|-----------|
| Universe total clicks | `homepage_universe_click` | |
| Aquatic panel CTR | `homepage_universe_click` | `category = aquatic` |
| Tortoise panel CTR | `homepage_universe_click` | `category = tortoise` |
| Box/Forest panel CTR | `homepage_universe_click` | `category = box_forest` |
| Rare/Exotic panel CTR | `homepage_universe_click` | `category = rare_exotic` |

**Derived KPI:**
```
Universe CTR       = homepage_universe_click / homepage_view
Category Share     = category_clicks / universe_total_clicks × 100
```

**Target:** Universe CTR > 12%

**Analysis use case:**
- カテゴリシェアが `rare_exotic` に偏っている → 上級者ユーザーが多い
- `aquatic` クリックが少ない → 水棲パネルのコピー・ビジュアル改善
- 全体 Universe CTR が低い → セクション配置・Hero連携を検討

---

### Layer 5 — Compare CTR

| Metric | Event | Dimension |
|--------|-------|-----------|
| Compare total clicks | `homepage_compare_species_click` | |
| Hermann vs Greek | `homepage_compare_species_click` | `pair = hermann_vs_greek` |
| Musk vs Razorback | `homepage_compare_species_click` | `pair = musk_vs_razorback` |
| Reeves vs Japanese Pond | `homepage_compare_species_click` | `pair = reeves_vs_japanese_pond` |

**Additional compare signals:**
```
live_compare_card_click   → Homepage Live Compare section
homepage_compare_diagnosis_click → Compare→Diagnosis transition
```

**Derived KPI:**
```
Compare CTR       = homepage_compare_species_click / homepage_view
Top pair          = max(pair breakdown)
```

**Target:** Compare CTR > 8%

---

### Layer 6 — Commerce CTR

| Metric | Event | Dimension |
|--------|-------|-----------|
| Cost CTA (total) | `homepage_cost_cta_click` | |
| Cost CTA by tab | `homepage_cost_cta_click` | `tab` |
| Top Gear clicks | `homepage_topgear_click` | `event_label` |
| Starter Kit CTA | `starter_kit_cta_click` (js/starter-kit.js) | |
| Amazon outbound | `amazon_outbound_click` (js/starter-kit.js) | |
| Affiliate (all) | `affiliate_click` (js/starter-kit.js) | `provider` |

**Derived KPI:**
```
Commerce CTR (homepage)  = homepage_cost_cta_click / homepage_view
Top Gear CTR             = homepage_topgear_click / homepage_view
Affiliate CTR            = affiliate_click / homepage_view (approximate)
```

**Tab breakdown:**
- `small_aquatic` vs `box_forest` vs `tortoise` → ユーザー関心の分布
- `*_diag` suffix click = 「診断して最適化」secondary CTAのクリック

**Target:** Commerce CTR > 15%

---

## 2. Funnel Definition

```
Step 1: Homepage View
  event: homepage_view
  denominator: all homepage sessions

  ↓ [Drop-off A: 即離脱率 = 1 - scroll_25/homepage_view]

Step 2: Hero Engagement
  event: homepage_hero_primary_click or hero_cta_click
  expected: > 20% of Step 1
  signal: ユーザーが診断に価値を感じているか

  ↓ [Drop-off B: Hero見るが行動しない]

Step 3: Content Engagement (Scroll 50%)
  event: homepage_scroll_50
  expected: > 45% of Step 1
  signal: Emotional Hook / Problem Gridが機能しているか

  ↓ [Drop-off C: Species Universeに到達しない]

Step 4: Species Discovery OR Compare Usage
  event: homepage_universe_click OR homepage_compare_species_click
  expected: Universe > 12% / Compare > 8% of Step 1
  signal: ユーザーが「選ぶ体験」に入ったか

  ↓ [Drop-off D: Discovery後に行動しない]

Step 5: Starter Kit / Commerce Entry
  event: homepage_cost_cta_click OR starter_kit_cta_click
  expected: > 15% of Step 1
  signal: 購入意欲・環境構築意欲があるか

  ↓ [Drop-off E: Commerce入口で離脱]

Step 6: Affiliate Click (Revenue Signal)
  event: affiliate_click (provider: amazon | rakuten)
  expected: > 8% of Step 1 (homepage-attributable)
  signal: 収益化ファネルの到達
```

**Funnel Drop-off Calculation (GA4 Funnel Explorer):**

```
Funnel type: Open / Closed (どちらでも可)
Steps:
  1. event_name = homepage_view
  2. event_name = hero_cta_click
  3. event_name = homepage_scroll_50
  4. event_name IN (homepage_universe_click, homepage_compare_species_click)
  5. event_name IN (homepage_cost_cta_click, starter_kit_cta_click)
  6. event_name = affiliate_click
Window: Same session
```

---

## 3. Weekly Review Template

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KAME LIFE GUIDE — Weekly CRO Review
Period: YYYY-MM-DD 〜 YYYY-MM-DD
Prepared: TeTe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## TRAFFIC
  homepage_view     : _____ (WoW: +__%)
  Sessions          : _____ (WoW: +__%)
  New Users         : _____ (WoW: +__%)

## SCROLL DEPTH
  Scroll 25%        : ____% (target: >70%) [STATUS: ✅ / ⚠️ / ❌]
  Scroll 50%        : ____% (target: >45%) [STATUS: ✅ / ⚠️ / ❌]
  Scroll 75%        : ____% (target: >25%) [STATUS: ✅ / ⚠️ / ❌]

## HERO KPI
  Hero Primary CTR  : ____% (target: >20%) [STATUS: ✅ / ⚠️ / ❌]
  Hero Any CTR      : ____%
  WoW change        : +__pp

## SPECIES DISCOVERY
  Universe CTR      : ____% (target: >12%) [STATUS: ✅ / ⚠️ / ❌]
  ├ aquatic         : ____% of universe clicks
  ├ tortoise        : ____%
  ├ box_forest      : ____%
  └ rare_exotic     : ____%

## COMPARE
  Compare CTR       : ____% (target: >8%)  [STATUS: ✅ / ⚠️ / ❌]
  Top pair          : _______________

## COMMERCE
  Commerce CTR      : ____% (target: >15%) [STATUS: ✅ / ⚠️ / ❌]
  Cost CTA (Aquatic): ____%
  Cost CTA (Tortoise): ____%
  Top Gear CTR      : ____%
  Affiliate clicks  : _____

## FUNNEL SUMMARY
  View → Hero       : ____% (last week: ___%)
  Hero → Scroll50   : ____%
  Scroll50 → Discovery: ____%
  Discovery → Commerce: ____%
  Commerce → Affiliate: ____%

## OBSERVATIONS
  1.
  2.
  3.

## ACTION ITEMS
  [ ] Priority 1: _________________________ (due: MM-DD)
  [ ] Priority 2: _________________________ (due: MM-DD)
  [ ] Priority 3: _________________________ (due: MM-DD)

## NOTES / HYPOTHESES
  -
  -

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Decision Rules

### Tier 1 — Immediate Action (❌ Critical)

```
IF Hero Primary CTR < 10%
→ Hero copyの根本見直し。H1・emotion copy・CTA文言を3パターンA/Bテスト。
→ 優先度: P0 / 対応期限: 翌週

IF Scroll 25% < 50%
→ Heroの下に強い引力がない。E-E-A-T ribbonまたはEmotional Hookを前に移動。
→ 優先度: P0 / 対応期限: 翌週

IF Universe CTR + Compare CTR 合計 < 5%
→ セクション配置・コントラスト・CTAの視認性問題。
   スクロール位置・scallop接続・モバイル表示を確認。
→ 優先度: P0 / 対応期限: 翌週
```

### Tier 2 — Optimization Needed (⚠️ Warning)

```
IF Hero Primary CTR 10〜15%
→ CTAコピー A/B テスト対象。「30秒診断を始める」→「相性を診断する」等を検討。
→ 優先度: P1 / 対応期限: 2週間以内

IF Scroll 50% < 40%
→ Emotional Hook または Problem Grid の離脱が多い。
   コピー tone・セクション高さ・reveal-soft タイミングを調整。
→ 優先度: P1 / 対応期限: 2週間以内

IF Commerce CTR < 10%
→ cost-sim タブ UIの改善、または Starter Kit へのリンク強化。
   tab breakdown を確認して「どのタイプで離脱が多いか」を特定。
→ 優先度: P1 / 対応期限: 2週間以内

IF rare_exotic シェア > 50% (Universe breakdown)
→ 上級者ユーザーが多い。Species Universeのコピーを中上級者向けに調整。
   または Rare/Exotic ページへの導線を強化。
→ 優先度: P2 / 対応期限: 1ヶ月以内

IF Compare CTR < 5%
→ Compare section のスクロール到達率を確認。
   Scroll 50% が低ければ「そもそも見ていない」問題。
   Scroll 50% は高いが Compare CTR が低い → セクション design 改善。
→ 優先度: P1 / 対応期限: 2週間以内
```

### Tier 3 — Opportunity (✅ Good, Expand)

```
IF Hero Primary CTR > 25%
→ Hero copy は機能している。診断ページ内の completion rate を次の計測対象に。
→ Action: shindan/完了率 の計測強化

IF Compare CTR > 15%
→ 比較需要が高い。compare/ ページを拡充（4〜6ペア）。
   または Homepage に「3ペア比較」→「全比較へ」の誘導を追加。
→ Action: compare/ページ 追加作成 (Phase 13提案)

IF Scroll 75% > 35%
→ コンテンツへの深い関与が高い。guide-links / Readiness Score の活用促進。
→ Action: guide section CTR を次の計測対象に追加

IF rare_exotic + tortoise シェア合計 > 60%
→ 上〜中上級者志向が強い。note.com記事との連携を強化。
→ Action: 上級者向けコンテンツ・スペングラー等の記事強化
```

### Tier 4 — Diagnostic Rules (原因特定フロー)

```
DIAGNOSIS 1: "Hero CTR が低いが Scroll 25% は高い"
→ Heroを見ているが行動しない
→ CTA文言・ボタンデザイン・「何ができるか」の明確度を改善

DIAGNOSIS 2: "Scroll 50% が低いが Scroll 25% は高い"
→ Emotional Hook または Problem Grid で離脱
→ コピーのトーンが重い / セクション高さが長すぎる可能性

DIAGNOSIS 3: "Universe CTR は高いが Commerce CTR が低い"
→ 「探す」行動には乗っているが「環境・機材」への関心が薄い
→ Species Universe → Starter Kit への直接導線を追加検討

DIAGNOSIS 4: "Compare CTR は高いがAffiliate click が少ない"
→ 比較で迷っているが購買決断に至っていない
→ compare/ ページ内のCTA・Starter Kit誘導を強化

DIAGNOSIS 5: "全体的にCTRは高いがセッション数が少ない"
→ 質は高いが量が不足
→ SEO・note.com・SNS流入を強化
```

---

## 5. Tool Recommendation

### 推奨: Looker Studio + GA4 接続 (Hybrid)

#### 比較表

| ツール | コスト | セットアップ | リアルタイム | カスタム | 共有 | Kame向き? |
|--------|--------|-------------|-------------|---------|------|----------|
| **GA4 Explore のみ** | 無料 | 不要 | ✅ | △ | △ | 週次レビューには不便 |
| **Looker Studio** | 無料 | 2〜3h | △ (1日遅れ) | ✅ | ✅ URL共有 | **◎ 推奨** |
| Google Sheets Export | 無料 | 1h/週 | ❌ 手動 | ✅ | ✅ | △ 手間がかかる |
| BigQuery | 無料枠あり | 高コスト | ✅ | ✅✅ | ✅ | ❌ Kameには過剰 |

---

#### 推奨構成: Looker Studio + GA4

**理由:**

1. **無料** — Kame Life Guide のフェーズで BigQuery は不要
2. **GA4 直接接続** — `homepage_version = 'phase_12A'` フィルターが画面上で設定可能
3. **URL共有** — ChatGPT PM との週次レビューを URL 一本で共有できる
4. **テンプレート化** — 一度作れば毎週ほぼゼロコストで更新

---

#### Looker Studio セットアップ手順

```
Step 1: https://lookerstudio.google.com → 新規レポート

Step 2: データソース追加
  Google Analytics 4 → KAME LIFE GUIDE (G-QQTE5CVF3K)

Step 3: フィルター作成
  名前: Phase 12A
  条件: event_parameter[homepage_version] = phase_12A

Step 4: ページ構成 (3ページ)
  Page 1: KPI サマリー (スコアカード × 6)
  Page 2: Funnel 可視化 (棒グラフ × 段階)
  Page 3: Commerce 内訳 (表 + pie chart)

Step 5: 日付フィルター設定
  コントロール: 日付範囲 → デフォルト「過去7日間」
```

---

#### 代替: GA4 Explore (簡易版 for 初期)

Looker Studio 設定前の暫定として、GA4 の「探索」機能で以下を作成：

```
探索 1: KPI Overview
  種類: 空白
  指標: eventCount
  ディメンション: eventName
  フィルター: eventName IN (homepage_view, homepage_hero_primary_click,
                            homepage_scroll_50, homepage_universe_click,
                            homepage_compare_species_click,
                            homepage_cost_cta_click)

探索 2: Funnel
  種類: ファネル
  Steps: 前章 Funnel Definition 参照

探索 3: Universe Breakdown
  種類: 空白
  指標: eventCount
  ディメンション: eventName, customEvent:category
  フィルター: eventName = homepage_universe_click
```

---

#### 週次レビューのワークフロー

```
毎週月曜 09:00 JST (推奨)

1. Looker Studio を開く (2分)
2. 日付を「先週」に設定
3. KPI サマリーページでステータス確認 (5分)
4. Decision Rules を適用して Action Items を決定 (10分)
5. Weekly Review Template を記入 → CLAUDE.md or notion に保存 (5分)
6. P0/P1 Action Items があれば即日実装タスクに
```

---

## 6. Self-Score

| 評価軸 | スコア | 根拠 |
|--------|--------|------|
| **Analytics usefulness** | **9.4** | 5 KPIに対してevent→derived KPI→decision ruleまで完全に定義。診断ルール（Diagnosis 1〜5）により「数値が悪い原因」の特定フローも設計済み |
| **Actionability** | **9.2** | Tier 1/2/3/4 の decision rules により「見た瞬間に何をすべきか」が明確。週次ワークフロー込みで運用コストが低い |
| **Tool fit** | **9.0** | Looker Studio 推奨はKameのフェーズ・予算・共有ニーズに最適。GA4 Explore 暫定案も用意しており段階的に移行できる |
