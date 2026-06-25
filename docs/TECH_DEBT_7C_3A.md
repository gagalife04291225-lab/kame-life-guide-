# Tech Debt: isAmazonUrl() 重複実装

**記録日:** 2026-06-25  
**フェーズ:** Phase 7-C Step 3-A 実装後  
**種別:** コード重複（Duplication）  
**優先度:** Low（動作上の問題なし・将来の保守コスト）

---

## 現状

`isAmazonUrl()` が以下2ファイルに同一実装で存在する。

### js/starter-kit.js（L22〜L26）
```js
// ── Phase 7-C Step 3-A: Amazon URL 判定ヘルパー ──────────────────
function isAmazonUrl(url) {
  if (!url) return false;
  return /amazon\.co\.jp|amzn\.to|amzn\.asia|tag=kamelife09-22/.test(url);
}
```

### shindan/index.html（L52〜L56、`<script>` ブロック内）
```js
// Phase 7-C Step 3-A: Amazon URL 判定ヘルパー
function isAmazonUrl(url) {
  if (!url) return false;
  return /amazon\.co\.jp|amzn\.to|amzn\.asia|tag=kamelife09-22/.test(url);
}
```

---

## 重複した理由

Phase 7-C Step 3-A の制約：

- `species/*.html` 98ページを触らない（共通JSを追加しても読み込ませられない）
- CSS・既存読み込み順を壊さない
- 最小差分優先

共通 JS ファイルを新設した場合、全98 species page への `<script src>` 追記が必要になるため、
Step 3-A のスコープ外と判断し重複実装を選択した。

---

## 影響範囲

現時点での影響：**なし**（動作は正常）

将来リスク：
- `isAmazonUrl()` のパターン変更時に2ファイルの同期更新が必要
- affiliate tag が `kamelife09-22` 以外に追加された場合、両ファイルを修正しなければ計測漏れが発生する
- `ga4Event()` ヘルパーも `shindan/index.html` に独自実装されており、同種の重複

---

## 同種の重複（参考）

| 関数名 | starter-kit.js | shindan/index.html | 備考 |
|---|---|---|---|
| `isAmazonUrl()` | ✅ L22 | ✅ L52 | 今回記録対象 |
| `ga4Event()` | ❌ なし（`gtag` 直呼び出し） | ✅ L46 | SK は gtag 直呼び出し |
| `amazon_outbound_click` payload | ✅ | ✅ | 発火ロジックは両方に存在 |

---

## 将来の改善候補（Phase 8 以降）

### Option A: js/analytics-utils.js（推奨）

```js
// js/analytics-utils.js
'use strict';

/** Amazon URL 判定 */
function isAmazonUrl(url) {
  if (!url) return false;
  return /amazon\.co\.jp|amzn\.to|amzn\.asia|tag=kamelife09-22/.test(url);
}

/** GA4 イベント送信（gtag 未定義時は無視） */
function ga4Event(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}

/** Amazon 外部遷移の統一計測 */
function trackAmazonOutbound(payload) {
  if (!isAmazonUrl(payload.click_url)) return;
  ga4Event('amazon_outbound_click', payload);
}
```

移行時の変更ファイル：
1. `js/analytics-utils.js`（新規作成）
2. `js/starter-kit.js`（isAmazonUrl / gtag 直呼び出し → analytics-utils 経由に変更）
3. `shindan/index.html`（isAmazonUrl / ga4Event → analytics-utils 経由に変更）
4. `species/*.html` 98ページ（`<script src="../js/analytics-utils.js">` を追加）
   → パッチスクリプトで一括対応可能（Phase 7-C Step 1-A の前例あり）

### Option B: js/quick-facts.js 内に統合

quick-facts.js はすでに全 species page に読み込まれているため、
analytics-utils 相当のユーティリティを quick-facts.js の先頭に追記する案。
デメリット：quick-facts.js の責務が広がる。

---

## 移行時の注意点

- `ga4Event()` の shindan/index.html 版と共通版でシグネチャを統一すること
- species page の読み込み順は `products.js → starter-kit.js` の順を維持
- analytics-utils.js は products.js より前に読み込む必要がある
  （starter-kit.js が analytics-utils の関数を参照するため）
- `tag=kamelife09-22` が将来変更された場合は `isAmazonUrl()` の正規表現も更新が必要

---

## 関連ファイル・SHA（記録時点）

| ファイル | SHA |
|---|---|
| `js/starter-kit.js` | `ad081500ee9e` |
| `shindan/index.html` | `eb5dd364a6cc` |
| `js/quick-facts.js` | `440248497a37` |
| `css/starter-kit.css` | `b046b125732b` |
