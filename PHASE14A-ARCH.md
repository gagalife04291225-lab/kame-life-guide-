# Phase 14-A: Real AI Concierge Architecture Design
## KAME LIFE — Hybrid AI Implementation Plan

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
│  │       ┌───────────────────┐                                  │  │
│  │       │  Intent Extractor  │  ← LLM の唯一の役割             │  │
│  │       │  (fetch → proxy)  │                                  │  │
│  │       └────────┬──────────┘                                  │  │
│  │                ↓ JSON (IntentSchema)                         │  │
│  │       ┌────────────────────┐                                 │  │
│  │       │  Rule Engine (JS)  │  ← 既存ロジックを再利用         │  │
│  │       │  calcScore()       │    species選択・安全ルール適用   │  │
│  │       │  safetyFilter()    │                                 │  │
│  │       └────────┬───────────┘                                 │  │
│  │                ↓ RecommendResult                             │  │
│  │       ┌────────────────────┐                                 │  │
│  │       │  Response Renderer │  ← 既存UI流用                   │  │
│  │       │  (aic-result card) │                                 │  │
│  │       └────────────────────┘                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                          ↕ HTTPS fetch
┌────────────────────────────────────────────────────────────────────┐
│                    Backend Proxy Layer                              │
│                                                                    │
│  Option A: Cloudflare Workers (推奨)                               │
│  Option B: Vercel Edge Function                                    │
│  Option C: GitHub Actions (非リアルタイム)                          │
│                                                                    │
│  役割:                                                              │
│  1. APIキーをクライアントから隠蔽                                   │
│  2. システムプロンプトを注入                                        │
│  3. レスポンスをJSONに強制                                         │
│  4. レートリミット・コスト制御                                      │
│  5. キャッシュ（同一入力への重複API呼び出し防止）                   │
│                                                                    │
│  Worker pseudo-code:                                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ POST /api/concierge                                          │  │
│  │ Body: { userMessage: string }                                │  │
│  │                                                              │  │
│  │ → LLM API (with SYSTEM_PROMPT + JSON schema enforcement)     │  │
│  │ → Parse JSON                                                 │  │
│  │ → Validate schema                                            │  │
│  │ → Return IntentJSON                                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                          ↕ HTTPS (server-side only)
┌────────────────────────────────────────────────────────────────────┐
│                      LLM API Layer                                 │
│                                                                    │
│  Role: INTENT EXTRACTION ONLY — species選択は絶対にしない          │
│                                                                    │
│  System Prompt 要点:                                               │
│  "あなたはカメ飼育の意図抽出器です。                               │
│   ユーザーの入力から飼育条件を抽出し、                             │
│   以下のJSONスキーマのみを返してください。                         │
│   JSON以外は絶対に返さないでください。"                            │
│                                                                    │
│  Input: userMessage (自由テキスト or ボタン選択文字列)             │
│  Output: IntentJSON (下記スキーマ)                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. JSON Schema (IntentSchema)

```json
{
  "$schema": "kame-life/intent/v1",
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
  "free_text_summary": {
    "type": "string",
    "maxLength": 200,
    "description": "LLMがユーザー意図を日本語で要約した文（rule engineに渡さない・UI表示用）",
    "default": ""
  }
}
```

**Rule Engine mapping (IntentSchema → 既存SPECIES weights):**
```
experience: beginner→beginner, some→some, expert→expert
size:       small→small, medium→medium, large→large
habitat:    aquatic→aquatic, land→land, semi→any
priority:   easy→easy, looks→looks, rare→rare
budget:     low → beginner_capped ON, high → cap解除
odor_sensitive: true → aquaticペナルティ軽減・陸棲ボーナス
available_space: under_60cm → large種除外
```

---

## 3. Recommended Stack

### 比較表

| 項目 | OpenAI API (gpt-4o-mini) | Gemini API (gemini-1.5-flash) | Cloudflare Workers AI |
|------|--------------------------|-------------------------------|----------------------|
| コスト | $0.15/1M tokens input | $0.075/1M tokens | $0.011/1K neurons |
| レイテンシ | 800〜1500ms | 600〜1200ms | 300〜800ms |
| JSON強制 | ✅ response_format対応 | ✅ JSON mode対応 | △ 追加処理必要 |
| 幻覚リスク | 低（JSON制約時） | 低 | 中 |
| 実装複雑度 | 低 | 低 | 中 |
| プロキシ必要 | ✅ 必須 | ✅ 必須 | △ 組み込み可 |
| 無料枠 | なし | あり（60req/分） | あり（10万req/日） |
| 日本語精度 | ◎ | ◎ | ○ |

### 推奨: **Gemini API (gemini-1.5-flash) + Cloudflare Workers**

理由:
1. **Gemini無料枠** = 60 req/分 → 月約200万回リクエスト無料、初期コストゼロ
2. **Cloudflare Workers** = GitHub Pages + CF Workers の組み合わせがシンプル
3. **JSON mode** = `responseMimeType: "application/json"` で hallucination を最小化
4. **レイテンシ** = Flash モデルは gpt-4o-mini より平均200ms速い
5. **プロキシ統合** = CF Workers にAPIキーを環境変数として安全に保持

代替: Gemini API + Vercel Edge Function（既存CI/CDがある場合）

---

## 4. Step-by-Step Implementation Plan

### Step 1: Architecture Only（本フェーズ）✅ 完了
- 設計書・スキーマ・スタック決定
- files touched: 0
- risk: none

---

### Step 2: Backend Proxy（次フェーズ）
**目的:** APIキー保護 + JSON強制 + レートリミット

**作成ファイル:**
```
workers/
  kame-concierge/
    index.js          ← Cloudflare Worker本体
    wrangler.toml     ← デプロイ設定
```

**Worker index.js 骨格:**
```javascript
// kame-concierge Worker
const SYSTEM_PROMPT = `
あなたはカメ飼育条件の意図抽出AIです。
ユーザーの入力から飼育条件を読み取り、
以下のJSONスキーマのみを返してください。
JSON以外は絶対に含めないでください。

スキーマ:
{"experience":"beginner|some|expert|unknown",
 "size":"small|medium|large|unknown",
 "habitat":"aquatic|land|semi|any|unknown",
 "budget":"low|medium|high|unknown",
 "odor_sensitive":true|false|null,
 "rare_interest":"none|low|high|unknown",
 "family_children":true|false|null,
 "available_space":"under_60cm|60cm|90cm|120cm_plus|outdoor|unknown",
 "priority":"easy|looks|rare|longevity|cost|unknown",
 "free_text_summary":"日本語200字以内の要約"}
`;

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', {status:405});

    const { userMessage } = await request.json();
    if (!userMessage || userMessage.length > 500) {
      return new Response(JSON.stringify({error:'invalid_input'}), {status:400});
    }

    // Rate limit: 1 req/sec per IP（CF Workers標準機能）
    
    const resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + env.GEMINI_API_KEY, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 256,
          temperature: 0.1
        }
      })
    });

    const data = await resp.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Validate + sanitize
    let intent;
    try { intent = JSON.parse(raw); }
    catch { intent = {}; }

    // Enforce enum values (hallucination guard)
    const VALID = {
      experience: ['beginner','some','expert','unknown'],
      size:       ['small','medium','large','unknown'],
      habitat:    ['aquatic','land','semi','any','unknown'],
      budget:     ['low','medium','high','unknown'],
      rare_interest: ['none','low','high','unknown'],
      available_space: ['under_60cm','60cm','90cm','120cm_plus','outdoor','unknown'],
      priority:   ['easy','looks','rare','longevity','cost','unknown'],
    };
    for (const [k, vals] of Object.entries(VALID)) {
      if (!vals.includes(intent[k])) intent[k] = 'unknown';
    }
    if (typeof intent.odor_sensitive !== 'boolean') intent.odor_sensitive = null;
    if (typeof intent.family_children !== 'boolean') intent.family_children = null;
    intent.free_text_summary = String(intent.free_text_summary || '').slice(0, 200);

    return new Response(JSON.stringify(intent), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://gagalife04291225-lab.github.io'
      }
    });
  }
};
```

**complexity:** 低  **files touched:** 2新規  **risk:** 低

---

### Step 3: Frontend Chat Input（フリーテキスト入力追加）

**変更ファイル:** `index.html`（AI Conciergeセクションのみ）

**UI変更:**
```
[現状] 4問ボタン選択のみ
[追加] テキスト入力欄 → Workerへfetch → IntentJSON → 既存calcScore()へ
[維持] ボタン選択モードはfallbackとして残す
```

**追加コード（概算100行）:**
```javascript
async function fetchIntent(userMsg) {
  // Typing indicator ON
  showTyping(true);
  try {
    const res = await fetch('https://kame-concierge.YOUR_SUBDOMAIN.workers.dev', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userMessage: userMsg})
    });
    if (!res.ok) throw new Error('api_error');
    const intent = await res.json();
    if (intent.error) throw new Error(intent.error);
    // IntentJSON → answers オブジェクトへマッピング
    answers.experience = intent.experience !== 'unknown' ? intent.experience : answers.experience;
    answers.size       = intent.size       !== 'unknown' ? intent.size       : answers.size;
    answers.habitat    = intent.habitat    !== 'unknown' ? intent.habitat    : answers.habitat;
    answers.priority   = intent.priority   !== 'unknown' ? intent.priority   : answers.priority;
    // 拡張フィールドは新しいcalcScoreV2()に渡す
    answersV2 = intent;
    showResult();
  } catch(e) {
    // フォールバック: ボタン選択モードへ切り替え
    showFallbackMode();
  } finally {
    showTyping(false);
  }
}
```

**complexity:** 中  **files touched:** 1（index.html）  **risk:** 中（fallbackで安全担保）

---

### Step 4: Production Launch

**チェックリスト:**
- [ ] CF Workers デプロイ確認（ステージング → 本番）
- [ ] Gemini APIキー本番用発行・CF Secrets設定
- [ ] レートリミット設定（1ユーザー=5req/分）
- [ ] コスト上限アラート設定（Gemini $5/月上限）
- [ ] GA4: `ai_concierge_mode` キー追加（`text` vs `button`）
- [ ] フォールバック動作確認（Worker down時でもボタン選択は動く）
- [ ] Lighthouse計測（追加JSは最小限）

**complexity:** 低  **files touched:** 0（設定のみ）  **risk:** 低

---

## 5. Risks

| リスク | 重大度 | 対策 |
|--------|--------|------|
| APIキー漏洩 | Critical | Workerの環境変数にのみ保持。frontendには絶対に露出しない |
| LLMが誤った種名を選ぶ | High | LLMは意図抽出のみ。species選択は常にJS rule engineが行う |
| LLMのJSON破損（malformed） | Medium | Worker側でtry/catchしてenumバリデーション後にフォールバック |
| レイテンシ増加（2〜3秒） | Medium | typing animationで体感遅延を隠す。ボタン選択はゼロレイテンシ維持 |
| Workerダウン | Medium | fetchがfailしたらボタン選択モードへ自動フォールバック |
| 月額コスト増加 | Low | Gemini無料枠内（60req/分）で十分。超過しても$0.075/1M tokens |
| 「AIが診断した」誤認 | Low | UIに明記: 「AIが意図を読み取り、ルールエンジンが候補提案」 |
| species DBとの不整合 | Low | IntentSchema → JS weights mappingをV2 calcScoreで一元管理 |

---

## 6. Decision Point（今すぐやるか確認が必要なこと）

Step 2の実装に入る前に確認:

1. **Cloudflare Workers アカウント** をお持ちか？（無料枠あり）
2. **Gemini API key** をお持ちか？（Google AI Studio で即時発行可能・無料）
3. **ドメイン**：Workers のURLをindex.htmlにハードコードしてよいか、
   またはCNAMEで独自ドメイン配置するか？
4. Step 2 のWorkerファイルをGitHub Pagesリポジトリに置くか、別リポジトリにするか？

---
*作成: Phase 14-A Step 1 / 2026-06-26*
