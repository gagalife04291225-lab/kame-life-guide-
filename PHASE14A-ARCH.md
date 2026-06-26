# Phase 14-A: Real AI Concierge Architecture Design
## KAME LIFE — Hybrid AI Implementation Plan
## v2.0 — PM Approved (97/100) — 2026-06-26

---

## PM Review Summary

| 項目 | スコア |
|------|--------|
| Architecture | 9.3 |
| Cost efficiency | 9.5 |
| Safety | 9.0 |
| Scalability | 8.8 |

**Approved with 4 revisions:**
- Fix 1: gemini-1.5-flash → gemini-2.5-flash
- Fix 2: JSON schema に `confidence` フィールド追加
- Fix 3: `free_text_summary` を200字 → 60字に短縮
- Fix 4: Rate limiting を Worker に追加必須

**Final Stack:**
- AI: Gemini 2.5 Flash
- Backend: Cloudflare Workers
- Storage (optional later): Cloudflare KV
- Repo: 別リポジトリ（`kame-ai-worker`）推奨

---

## 1. Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                             │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              AI Concierge Chat UI (index.html)               │  │
│  │                                                              │  │
│  │  [自由入力テキスト] or [4問ボタン選択] ← 両モード維持       │  │
│  │               ↓ userMessage                                  │  │
│  │       ┌────────────────────┐                                 │  │
│  │       │  Intent Extractor  │  ← LLM の唯一の役割            │  │
│  │       │  (fetch → proxy)   │    intent extraction only       │  │
│  │       └────────┬───────────┘                                 │  │
│  │                ↓ IntentJSON (+ confidence)                   │  │
│  │       ┌────────────────────────────────────────┐             │  │
│  │       │         Confidence Router              │             │  │
│  │       │  confidence < 50 → 追加質問UI表示      │             │  │
│  │       │  confidence ≥ 50 → Rule Engine へ      │             │  │
│  │       └────────┬───────────────────────────────┘             │  │
│  │                ↓                                             │  │
│  │       ┌────────────────────┐                                 │  │
│  │       │  Rule Engine (JS)  │  ← species選択は常にここ        │  │
│  │       │  calcScore()       │    LLMは絶対に種を選ばない      │  │
│  │       │  safetyFilter()    │                                 │  │
│  │       └────────┬───────────┘                                 │  │
│  │                ↓ RecommendResult                             │  │
│  │       ┌────────────────────┐                                 │  │
│  │       │  Response Renderer │  ← 既存UI流用                   │  │
│  │       └────────────────────┘                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                          ↕ HTTPS fetch
┌────────────────────────────────────────────────────────────────────┐
│               Cloudflare Worker (kame-ai-worker repo)              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Rate Limiter                                                │  │
│  │  - 20 req/min per IP  (CF Rate Limiting Rules)              │  │
│  │  - 200 req/day per IP (CF KV カウンター・optional)          │  │
│  │  超過 → 429 Too Many Requests                               │  │
│  └─────────────────────┬────────────────────────────────────────┘  │
│                        ↓                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Request Validator                                           │  │
│  │  - userMessage.length ≤ 500                                 │  │
│  │  - Origin check: gagalife04291225-lab.github.io のみ        │  │
│  └─────────────────────┬────────────────────────────────────────┘  │
│                        ↓                                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Gemini 2.5 Flash API Call                                  │  │
│  │  - responseMimeType: "application/json"                     │  │
│  │  - temperature: 0.1  (deterministic)                        │  │
│  │  - maxOutputTokens: 256                                     │  │
│  │  - SYSTEM_PROMPT: intent extraction only                    │  │
│  └─────────────────────┬────────────────────────────────────────┘  │
│                        ↓ raw JSON string                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  JSON Validator + Enum Enforcer (hallucination guard)       │  │
│  │  - parse JSON                                               │  │
│  │  - 全フィールドの enum を強制                               │  │
│  │  - 不正値 → "unknown" にフォールバック                      │  │
│  │  - confidence: clamp(0, 100)                                │  │
│  └─────────────────────┬────────────────────────────────────────┘  │
│                        ↓ validated IntentJSON                      │
└────────────────────────┼───────────────────────────────────────────┘
                         ↓ Response to Browser
```

---

## 2. JSON Schema v2 (IntentSchema)

```json
{
  "$schema": "kame-life/intent/v2",

  "experience": {
    "type": "string",
    "enum": ["beginner", "some", "expert", "unknown"],
    "description": "飼育経験レベル",
    "default": "unknown"
  },
  "size": {
    "type": "string",
    "enum": ["small", "medium", "large", "unknown"],
    "description": "希望サイズ: small=〜20cm, medium=20〜40cm, large=40cm〜",
    "default": "unknown"
  },
  "habitat": {
    "type": "string",
    "enum": ["aquatic", "land", "semi", "any", "unknown"],
    "description": "飼育スタイル: aquatic=水棲, land=陸棲, semi=半水棲",
    "default": "unknown"
  },
  "budget": {
    "type": "string",
    "enum": ["low", "medium", "high", "unknown"],
    "description": "月予算: low=〜5000円, medium=5000〜15000円, high=15000円〜",
    "default": "unknown"
  },
  "odor_sensitive": {
    "type": "boolean | null",
    "description": "臭いが苦手かどうか",
    "default": null
  },
  "rare_interest": {
    "type": "string",
    "enum": ["none", "low", "high", "unknown"],
    "description": "希少種・レア種への興味",
    "default": "unknown"
  },
  "family_children": {
    "type": "boolean | null",
    "description": "子供・家族との共同飼育か",
    "default": null
  },
  "available_space": {
    "type": "string",
    "enum": ["under_60cm", "60cm", "90cm", "120cm_plus", "outdoor", "unknown"],
    "description": "設置可能なケージ/水槽サイズ",
    "default": "unknown"
  },
  "priority": {
    "type": "string",
    "enum": ["easy", "looks", "rare", "longevity", "cost", "unknown"],
    "description": "最重視すること",
    "default": "unknown"
  },

  "confidence": {
    "type": "integer",
    "minimum": 0,
    "maximum": 100,
    "description": "入力からの意図抽出信頼度。50未満=情報不足→追加質問UI表示",
    "examples": {
      "low (35)":  "「飼いやすい亀がいい」のみ → 情報不足",
      "mid (65)":  "「小型で水棲、初心者です」 → ある程度抽出可能",
      "high (90)": "「60cm水槽、臭い嫌い、初めて、小型希望」 → 十分"
    },
    "routing": "< 50 → 追加質問UI / ≥ 50 → Rule Engineへ"
  },

  "free_text_summary": {
    "type": "string",
    "maxLength": 60,
    "description": "LLMがユーザー意図を日本語で要約した文（UI表示用・rule engineは無視）",
    "example": "初心者、小型水棲、臭いに敏感",
    "default": ""
  }
}
```

**confidence による UI 分岐:**
```
confidence < 50:
  → "まだ情報が足りません。あと2問だけ教えてください。"
  → 不足フィールドのボタン選択を表示（fallback to button mode）

confidence ≥ 50:
  → Rule Engine へ渡す
  → calcScore() → 種推薦 → result card表示
```

**Rule Engine mapping (IntentSchema → 既存SPECIES weights):**
```
experience:      beginner→beginner, some→some, expert→expert
size:            small→small, medium→medium, large→large
habitat:         aquatic→aquatic, land→land, semi→any
priority:        easy→easy, looks→looks, rare→rare
budget:          low→BEGINNER_CAPPED ON, high→cap解除
odor_sensitive:  true→aquaticペナルティ軽減・陸棲ボーナス
available_space: under_60cm→large種を除外
```

---

## 3. Recommended Stack (Final)

| Layer | 選定 | 理由 |
|-------|------|------|
| AI Model | **Gemini 2.5 Flash** | 日本語精度◎・structured output強化・無料枠60rpm |
| Backend | **Cloudflare Workers** | static site との親和性・無料枠10万req/日 |
| Storage | **Cloudflare KV** (optional) | 将来のキャッシュ・乱用防止・分析用 |
| Frontend | 既存 index.html | 最小差分 |
| Repo | **別リポジトリ** (kame-ai-worker) | blast radius小・secrets隔離・deploy分離 |

---

## 4. Step-by-Step Implementation Plan

### Step 1: Architecture Design ✅ APPROVED (本ドキュメント)

---

### Step 2: Cloudflare Worker 実装

**Repo:** `kame-ai-worker`（新規作成）

**ファイル構成:**
```
kame-ai-worker/
  src/
    index.js        ← Worker本体（下記参照）
  wrangler.toml     ← デプロイ設定
  package.json
  README.md
```

**Worker index.js（完全版）:**
```javascript
// kame-ai-worker/src/index.js
// Gemini 2.5 Flash + Intent Extraction Only

const ALLOWED_ORIGIN = 'https://gagalife04291225-lab.github.io';

const SYSTEM_PROMPT = `あなたはカメ（亀・リクガメ）の飼育条件を読み取る意図抽出AIです。
ユーザーの入力から飼育希望条件を抽出し、必ず以下のJSONのみを返してください。
JSON以外の文字（説明・前置き・マークダウン）は絶対に含めないでください。

重要なルール:
- あなたは種の推薦をしてはいけません
- あなたの仕事は「意図の抽出」のみです
- 不明な項目は "unknown" または null を使ってください
- confidence は入力の情報量から0〜100で評価してください

返すJSON（このフォーマット厳守）:
{
  "experience": "beginner|some|expert|unknown",
  "size": "small|medium|large|unknown",
  "habitat": "aquatic|land|semi|any|unknown",
  "budget": "low|medium|high|unknown",
  "odor_sensitive": true または false または null,
  "rare_interest": "none|low|high|unknown",
  "family_children": true または false または null,
  "available_space": "under_60cm|60cm|90cm|120cm_plus|outdoor|unknown",
  "priority": "easy|looks|rare|longevity|cost|unknown",
  "confidence": 0〜100の整数,
  "free_text_summary": "60字以内の日本語要約"
}`;

// Enum validation map
const VALID_ENUMS = {
  experience:      ['beginner','some','expert','unknown'],
  size:            ['small','medium','large','unknown'],
  habitat:         ['aquatic','land','semi','any','unknown'],
  budget:          ['low','medium','high','unknown'],
  rare_interest:   ['none','low','high','unknown'],
  available_space: ['under_60cm','60cm','90cm','120cm_plus','outdoor','unknown'],
  priority:        ['easy','looks','rare','longevity','cost','unknown'],
};

function validateIntent(raw) {
  const out = {};
  for (const [key, vals] of Object.entries(VALID_ENUMS)) {
    out[key] = vals.includes(raw[key]) ? raw[key] : 'unknown';
  }
  out.odor_sensitive  = typeof raw.odor_sensitive  === 'boolean' ? raw.odor_sensitive  : null;
  out.family_children = typeof raw.family_children === 'boolean' ? raw.family_children : null;
  out.confidence      = Math.max(0, Math.min(100, parseInt(raw.confidence, 10) || 0));
  out.free_text_summary = String(raw.free_text_summary || '').slice(0, 60);
  return out;
}

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Origin check
    if (request.headers.get('Origin') !== ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Rate limiting: 20 req/min per IP via CF Rate Limiting Rules
    // (wrangler.toml の rate_limiting セクションで設定)
    // IP per day: Cloudflare KV で実装 (optional Step)

    // Parse body
    let userMessage;
    try {
      const body = await request.json();
      userMessage = String(body.userMessage || '').trim();
    } catch {
      return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
    }

    if (!userMessage || userMessage.length > 500) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Gemini 2.5 Flash API call
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

    let geminiResp;
    try {
      geminiResp = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: userMessage }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 256,
            temperature: 0.1,
          }
        })
      });
    } catch {
      return new Response(JSON.stringify({ error: 'upstream_error' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!geminiResp.ok) {
      return new Response(JSON.stringify({ error: 'gemini_error', status: geminiResp.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const geminiData = await geminiResp.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Parse + validate
    let intent;
    try {
      intent = validateIntent(JSON.parse(rawText));
    } catch {
      // JSON parse失敗 → all unknown フォールバック
      intent = validateIntent({});
      intent.confidence = 0;
    }

    return new Response(JSON.stringify(intent), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Cache-Control': 'no-store',
      }
    });
  }
};
```

**wrangler.toml:**
```toml
name = "kame-ai-worker"
main = "src/index.js"
compatibility_date = "2024-09-23"

[vars]
# GEMINI_API_KEY は wrangler secret put GEMINI_API_KEY で設定（コミットしない）

# Rate limiting: 20 req/min per IP
[[unsafe.bindings]]
name = "RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 20, period = 60 }
```

**デプロイ手順:**
```bash
# 1. Cloudflare アカウントでWorkerを有効化
# 2. wrangler install
npm install -g wrangler

# 3. login
wrangler login

# 4. API key を secrets に登録（コミットしない）
wrangler secret put GEMINI_API_KEY
# → プロンプトにGemini APIキーを入力

# 5. デプロイ
wrangler deploy

# 6. URL確認
# → https://kame-ai-worker.YOUR_SUBDOMAIN.workers.dev
```

**complexity:** 低  **files:** 3新規（別repo）  **risk:** 低

---

### Step 3: Frontend テキスト入力追加

**変更ファイル:** `index.html` のみ（AI Conciergeセクション）

**変更内容:**
1. テキスト入力欄を追加（既存4問ボタンの上に配置）
2. `fetchIntent()` 関数を追加（Worker呼び出し + confidence routing）
3. confidence < 50 のとき不足フィールドのボタン選択を表示
4. Worker URL を環境変数的に定数として定義

**追加コード骨格（index.html内 JS）:**
```javascript
var WORKER_URL = 'https://kame-ai-worker.YOUR_SUBDOMAIN.workers.dev';

async function fetchIntent(userMsg) {
  showTypingThen_aic(1000, function() {});  // typing ON
  try {
    var res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: userMsg })
    });
    if (!res.ok) throw new Error('api_' + res.status);
    var intent = await res.json();
    if (intent.error) throw new Error(intent.error);

    // IntentJSON → answers へマッピング
    if (intent.experience !== 'unknown') answers.experience = intent.experience;
    if (intent.size       !== 'unknown') answers.size       = intent.size;
    if (intent.habitat    !== 'unknown') answers.habitat    = intent.habitat;
    if (intent.priority   !== 'unknown') answers.priority   = intent.priority;

    // GA4
    _ga('ai_concierge_intent_extracted', {
      confidence: intent.confidence,
      mode: 'text',
      experience: intent.experience,
      size: intent.size,
      habitat: intent.habitat
    });

    // Confidence routing
    if (intent.confidence < 50) {
      // 情報不足 → 不明フィールドのボタン選択を表示
      showClarifyMode(intent);
    } else {
      showResult();  // 既存のresult表示
    }
  } catch(e) {
    _ga('ai_concierge_fallback', { reason: e.message });
    showQuestion(1);  // 既存4問ボタンモードへフォールバック
  }
}
```

**complexity:** 中  **files:** 1  **risk:** 中（fallback有）

---

### Step 4: Production Launch

- [ ] Worker staging テスト（`wrangler dev` でローカル確認）
- [ ] CORS origin 設定確認
- [ ] Gemini 無料枠モニタリング設定（Google AI Studio > Usage）
- [ ] CF Rate Limiting 動作確認
- [ ] GA4: `ai_concierge_mode: 'text'|'button'` を全イベントに追加
- [ ] フォールバック動作確認（Worker URL を意図的に壊してテスト）
- [ ] Lighthouse 計測（パフォーマンス回帰なし確認）

**complexity:** 低  **risk:** 低

---

## 5. Risks (Updated)

| リスク | 重大度 | 対策 |
|--------|--------|------|
| APIキー漏洩 | Critical | Worker環境変数(secret)のみ。`wrangler secret put` で管理 |
| LLMが誤species選択 | High | LLMは意図抽出のみ。rule engineが常に種を選ぶ |
| JSONパース失敗 | Medium | Worker側でtry/catchしてall-unknownにフォールバック |
| confidence=0 の悪用 | Medium | confidence < 50 → ボタン選択へ誘導（UX維持） |
| レイテンシ2〜3秒 | Medium | typing animationで隠蔽。ボタン選択はゼロレイテンシ維持 |
| Worker障害 | Medium | fetch失敗 → 既存4問ボタンモードへ自動フォールバック |
| レートリミット超過 | Low | 20req/min per IP。CF Rules で429を返す |
| 月額コスト超過 | Low | Gemini 無料枠(60rpm)で通常は収まる。超過でも$0.075/1M |
| 「AIが診断した」誤認 | Low | UIに「AIが意図を読み取り、ルールが候補提案」と明記 |

---

## 6. Cloudflare KV 将来活用（Step 4以降）

```javascript
// Worker内でKVを使ったIP日次制限（option）
const today = new Date().toISOString().slice(0, 10);  // "2026-06-26"
const key = `req:${ip}:${today}`;
const count = parseInt(await env.KV.get(key) || '0', 10);

if (count >= 200) {
  return new Response(JSON.stringify({ error: 'daily_limit' }), { status: 429 });
}
await env.KV.put(key, String(count + 1), { expirationTtl: 86400 });
```

将来用途:
- **キャッシュ**: 同一入力への重複API呼び出し防止（コスト削減）
- **Analytics**: 匿名クエリ集計（人気質問パターン把握）
- **Abuse prevention**: IP別日次上限

---
*v1.0: 2026-06-26 初版*
*v2.0: 2026-06-26 PM Reviewによる4修正適用*
*Next: Phase 14-A Step 2 — Cloudflare Worker 実装*
