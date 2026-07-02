// workers/kame-ai-worker/src/index.js
// Phase 14-A Step 2 — Kame AI Worker
//
// Role: Intent extraction ONLY via Gemini 2.5 Flash.
//       This Worker NEVER selects a species.
//       Species selection always happens in the frontend rule engine.
//
// Endpoint: POST /intent
// Auth:     GEMINI_API_KEY via `wrangler secret put GEMINI_API_KEY`

'use strict';

// ── Constants ──────────────────────────────────────────────────────────
const ALLOWED_ORIGIN  = 'https://kamelifeguide.com';
const MAX_MSG_BYTES   = 500;   // message character limit
const GEMINI_MODEL    = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// System prompt: intent extraction only, JSON output enforced.
// Temperature 0.1 keeps output deterministic for enum fields.
const SYSTEM_PROMPT = `あなたはカメ（亀・リクガメ）の飼育条件を読み取る意図抽出AIです。
ユーザーの入力から飼育希望条件を抽出し、必ず以下のJSONのみを返してください。
JSON以外の文字（説明・前置き・マークダウン・コードブロック記号）は絶対に含めないでください。

重要なルール:
1. あなたは種の推薦をしてはいけません。
2. あなたの仕事は「意図の抽出」のみです。
3. 不明な項目は "unknown" または null を使ってください。
4. confidence はユーザー入力の情報量から 0〜100 の整数で評価してください。
   - 0〜49: 情報不足（追加質問が必要）
   - 50〜79: ある程度抽出可能
   - 80〜100: 十分な情報あり
5. free_text_summary は 60 字以内の日本語でユーザー意図を要約してください。

返すJSON（このフォーマット厳守・それ以外は返さない）:
{
  "experience": "beginner または some または expert または unknown",
  "size": "small または medium または large または unknown",
  "habitat": "aquatic または land または semi または any または unknown",
  "budget": "low または medium または high または unknown",
  "odor_sensitive": true または false または null,
  "rare_interest": "none または low または high または unknown",
  "family_children": true または false または null,
  "available_space": "under_60cm または 60cm または 90cm または 120cm_plus または outdoor または unknown",
  "priority": "easy または looks または rare または longevity または cost または unknown",
  "confidence": 0から100の整数,
  "free_text_summary": "60字以内の日本語要約"
}`;

// ── Enum validation map ────────────────────────────────────────────────
const VALID_ENUMS = {
  experience:      ['beginner', 'some', 'expert', 'unknown'],
  size:            ['small', 'medium', 'large', 'unknown'],
  habitat:         ['aquatic', 'land', 'semi', 'any', 'unknown'],
  budget:          ['low', 'medium', 'high', 'unknown'],
  rare_interest:   ['none', 'low', 'high', 'unknown'],
  available_space: ['under_60cm', '60cm', '90cm', '120cm_plus', 'outdoor', 'unknown'],
  priority:        ['easy', 'looks', 'rare', 'longevity', 'cost', 'unknown'],
};

// ── Intent validator ───────────────────────────────────────────────────
// Enforces all enum values. Invalid → 'unknown'. Prevents hallucination bleed.
function validateIntent(raw) {
  const out = {};

  for (const [key, validVals] of Object.entries(VALID_ENUMS)) {
    out[key] = validVals.includes(raw[key]) ? raw[key] : 'unknown';
  }

  // Boolean fields
  out.odor_sensitive  = typeof raw.odor_sensitive  === 'boolean' ? raw.odor_sensitive  : null;
  out.family_children = typeof raw.family_children === 'boolean' ? raw.family_children : null;

  // confidence: integer, clamped 0–100
  const rawConf = parseInt(raw.confidence, 10);
  out.confidence = Number.isFinite(rawConf) ? Math.max(0, Math.min(100, rawConf)) : 0;

  // free_text_summary: string, max 60 chars
  out.free_text_summary = String(raw.free_text_summary || '').slice(0, 60);

  return out;
}

// ── CORS headers ───────────────────────────────────────────────────────
function corsHeaders(origin) {
  // Restrict to the production site only.
  // Do NOT use '*' — this protects against cross-origin API key abuse.
  const allowedOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '';
  return {
    'Access-Control-Allow-Origin':  allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

// ── JSON response helpers ──────────────────────────────────────────────
function jsonOk(data, origin) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

function jsonError(status, code, message, origin) {
  return new Response(JSON.stringify({ error: code, message }), {
    status,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });
}

// ── Main handler ───────────────────────────────────────────────────────
export default {
  async fetch(request, env /*, ctx */) {
    const origin = request.headers.get('Origin') || '';
    const method = request.method.toUpperCase();

    // ── OPTIONS preflight ────────────────────────────────────────────
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // ── Method guard ─────────────────────────────────────────────────
    if (method !== 'POST') {
      return jsonError(405, 'method_not_allowed', 'POST only', origin);
    }

    // ── Origin guard ─────────────────────────────────────────────────
    // Allow requests with no Origin header only in local dev (wrangler dev).
    // In production, reject unknown origins.
    if (origin && origin !== ALLOWED_ORIGIN) {
      return jsonError(403, 'forbidden_origin', 'Origin not allowed', origin);
    }

    // ── Path guard ───────────────────────────────────────────────────
    const url      = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '');   // strip trailing slash
    if (pathname !== '/intent') {
      return jsonError(404, 'not_found', 'Use POST /intent', origin);
    }

    // ── Body size guard ──────────────────────────────────────────────
    // Content-Length check (fast path). Actual length verified after parse.
    const contentLength = parseInt(request.headers.get('Content-Length') || '0', 10);
    if (contentLength > 4096) {
      return jsonError(413, 'payload_too_large', 'Request body too large', origin);
    }

    // ── Parse body ───────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError(400, 'invalid_json', 'Request body must be valid JSON', origin);
    }

    // ── Input validation ─────────────────────────────────────────────
    const rawMessage = body.message;
    if (typeof rawMessage !== 'string' || rawMessage.trim().length === 0) {
      return jsonError(400, 'missing_message', '"message" field is required', origin);
    }

    // 500-character limit (Japanese text)
    const message = rawMessage.trim().slice(0, MAX_MSG_BYTES);

    // source is logged but not required
    // const source = String(body.source || 'unknown').slice(0, 64);

    // ── Rate limiting hook ───────────────────────────────────────────
    // Cloudflare Rate Limiting Rules (configured in wrangler.toml or CF dashboard)
    // handle 20 req/min per IP at the edge — no code needed here.
    //
    // Optional KV-based daily limit (200 req/day per IP):
    //
    // if (env.KV) {
    //   const ip    = request.headers.get('CF-Connecting-IP') || 'unknown';
    //   const today = new Date().toISOString().slice(0, 10);
    //   const kvKey = `rate:${ip}:${today}`;
    //   const count = parseInt(await env.KV.get(kvKey) || '0', 10);
    //   if (count >= 200) {
    //     return jsonError(429, 'daily_limit_exceeded', 'Too many requests today', origin);
    //   }
    //   await env.KV.put(kvKey, String(count + 1), { expirationTtl: 86400 });
    // }

    // ── Gemini API call ───────────────────────────────────────────────
    // APIキーは絶対にコードに書かない。
    // デプロイ前に `wrangler secret put GEMINI_API_KEY` で設定すること。
    if (!env.GEMINI_API_KEY) {
      return jsonError(500, 'server_misconfigured', 'API key not set', origin);
    }

    const geminiUrl =
      `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

    const geminiBody = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        { parts: [{ text: message }] },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 256,
        temperature: 0.1,
        topP: 0.9,
      },
    };

    let geminiResp;
    try {
      geminiResp = await fetch(geminiUrl, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(geminiBody),
      });
    } catch (networkErr) {
      // Network failure (Gemini unreachable)
      return jsonError(502, 'upstream_network_error', 'Failed to reach Gemini API', origin);
    }

    if (!geminiResp.ok) {
      // Gemini returned 4xx/5xx
      const errText = await geminiResp.text().catch(() => '');
      return jsonError(
        502,
        'gemini_api_error',
        `Gemini ${geminiResp.status}: ${errText.slice(0, 120)}`,
        origin,
      );
    }

    // ── Parse Gemini response ─────────────────────────────────────────
    let geminiData;
    try {
      geminiData = await geminiResp.json();
    } catch {
      return jsonError(502, 'gemini_parse_error', 'Gemini returned non-JSON', origin);
    }

    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // ── Validate + sanitize intent ────────────────────────────────────
    let intent;
    try {
      const parsed = JSON.parse(rawText);
      intent = validateIntent(parsed);
    } catch {
      // JSON parse failed → all-unknown fallback with confidence=0
      // Frontend will show the button-selection flow.
      intent = validateIntent({});
    }

    return jsonOk(intent, origin);
  },
};
