# kame-ai-worker

Cloudflare Worker — Intent extraction proxy for [カメライフガイド](https://gagalife04291225-lab.github.io/kame-life-guide-/).

## Role

**Intent extraction only.**  
This Worker calls Gemini 2.5 Flash and returns a structured JSON of the user's turtle-keeping intent.  
**Species selection always happens in the frontend rule engine — never here.**

## Endpoint

```
POST /intent
Content-Type: application/json
Origin: https://gagalife04291225-lab.github.io

{
  "message": "初心者で小型の水棲ガメを探しています",
  "source":  "homepage_shindan_funnel"
}
```

### Response (200 OK)

```json
{
  "experience":       "beginner",
  "size":             "small",
  "habitat":          "aquatic",
  "budget":           "unknown",
  "odor_sensitive":   null,
  "rare_interest":    "unknown",
  "family_children":  null,
  "available_space":  "unknown",
  "priority":         "easy",
  "confidence":       72,
  "free_text_summary": "初心者、小型水棲ガメ希望"
}
```

`confidence < 50` → frontend shows clarification buttons  
`confidence ≥ 50` → frontend passes intent to rule engine

### Error responses

| Status | code | 説明 |
|--------|------|------|
| 400 | `invalid_json` | リクエストボディが JSON でない |
| 400 | `missing_message` | `message` フィールドが空 |
| 403 | `forbidden_origin` | 許可されていない Origin |
| 404 | `not_found` | `/intent` 以外のパス |
| 405 | `method_not_allowed` | POST 以外のメソッド |
| 413 | `payload_too_large` | ボディが 4096 bytes 超 |
| 429 | *(CF Rate Limiting)* | 20 req/min 超過 |
| 500 | `server_misconfigured` | GEMINI_API_KEY 未設定 |
| 502 | `upstream_network_error` | Gemini に接続できない |
| 502 | `gemini_api_error` | Gemini が 4xx/5xx を返した |
| 502 | `gemini_parse_error` | Gemini レスポンスが JSON でない |

---

## Deploy Steps

### 1. Prerequisites

```bash
# Node.js 18+ required
node -v

# Install wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 2. Set API key (secret — never commit this)

```bash
cd workers/kame-ai-worker
wrangler secret put GEMINI_API_KEY
# Prompt: paste your Gemini API key from https://aistudio.google.com/
```

**Gemini API key の取得:**
1. [Google AI Studio](https://aistudio.google.com/) にアクセス
2. 「Get API key」→「Create API key」
3. 発行されたキーをコピーして上記コマンドに貼り付け

### 3. Local test

```bash
wrangler dev
```

```bash
# 別ターミナルでテスト
curl -X POST http://localhost:8787/intent \
  -H "Content-Type: application/json" \
  -H "Origin: https://gagalife04291225-lab.github.io" \
  -d '{"message":"初心者で小型の水棲ガメを探しています","source":"test"}'
```

期待するレスポンス:
```json
{"experience":"beginner","size":"small","habitat":"aquatic",...,"confidence":72}
```

### 4. Deploy to production

```bash
wrangler deploy
```

デプロイ後に表示される Worker URL をメモ:
```
https://kame-ai-worker.<YOUR_SUBDOMAIN>.workers.dev
```

この URL を Phase 14-A Step 3（frontend 実装）で使用します。

### 5. Configure Rate Limiting (Cloudflare Dashboard)

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → `kame-ai-worker`
2. Settings → Rate Limiting → Add Rule
3. 設定:
   - Condition: IP ごと
   - Threshold: 20 requests / 60 seconds
   - Action: Block (429)

---

## Security

| 対策 | 実装 |
|------|------|
| APIキー非露出 | `wrangler secret put` のみ。コードに記載なし |
| Origin 制限 | `https://gagalife04291225-lab.github.io` のみ許可 |
| Method 制限 | POST のみ許可（OPTIONS は preflight 用） |
| Body サイズ制限 | Content-Length > 4096 bytes → 413 |
| Message 長制限 | 500 文字でスライス |
| Enum 強制 | 全フィールドをバリデーション。不正値 → `unknown` |
| confidence clamp | `Math.max(0, Math.min(100, value))` |
| summary 長制限 | `slice(0, 60)` |
| Rate limiting | CF Rules: 20 req/min per IP |
| JSON 強制 | Gemini `responseMimeType: "application/json"` |
| Fallback | JSON パース失敗 → all-unknown、confidence=0 |

---

## File Structure

```
workers/kame-ai-worker/
  src/
    index.js        ← Worker 本体
  wrangler.toml     ← デプロイ設定（APIキー記載なし）
  README.md         ← このファイル
```

---

## Architecture Note

```
Frontend (index.html)
  ↓ POST /intent  { message, source }
Cloudflare Worker  ← このWorker
  ↓ Gemini 2.5 Flash (intent extraction only)
  ↓ JSON validate + enum enforce
  ↑ IntentJSON { experience, size, habitat, ..., confidence }
Frontend Rule Engine (JS)
  ↓ calcScore() + safetyFilter()  ← LLMは種を選ばない
Result Card
```

---

*Phase 14-A Step 2 — 2026-06-26*
