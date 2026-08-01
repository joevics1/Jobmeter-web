// lib/gemini-documents.ts
//
// Shared Gemini caller for the Document Generator.
//
// Uses the raw v1beta REST endpoint (not the @google/generative-ai SDK)
// because grounding on 2.5-series models needs the `google_search` tool,
// which the SDK version pinned in this repo (0.24.1) doesn't expose —
// it only knows the older `googleSearchRetrieval` tool built for 1.5.
//
// Model waterfall: gemini-2.5-flash-lite (primary) -> gemini-2.5-flash (backup)
// Key rotation: GEMINI_API_KEY -> GEMINI_API_KEY_2 -> GEMINI_API_KEY_3 -> GEMINI_API_KEY_4
// Every (model, key) pair is tried in order until one succeeds — this
// covers both "model unavailable" and "this key is rate-limited" failures.

const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

function getApiKeys(): string[] {
  return [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
  ].filter((k): k is string => !!k);
}

export interface GeminiCallOptions {
  systemPrompt: string;
  userPrompt: string;
  grounding?: boolean;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiCallResult {
  text: string;
  modelUsed: string;
  sources: { title: string; uri: string }[];
}

export async function callGemini(opts: GeminiCallOptions): Promise<GeminiCallResult> {
  const keys = getApiKeys();
  if (keys.length === 0) {
    throw new Error('No Gemini API keys configured (GEMINI_API_KEY / GEMINI_API_KEY_2 / GEMINI_API_KEY_3)');
  }

  let lastError: any = null;

  for (const model of MODELS) {
    for (const key of keys) {
      try {
        const body: any = {
          system_instruction: { parts: [{ text: opts.systemPrompt }] },
          contents: [{ parts: [{ text: opts.userPrompt }] }],
          generationConfig: {
            temperature: opts.temperature ?? 0.3,
            maxOutputTokens: opts.maxOutputTokens ?? 8192,
          },
        };
        if (opts.grounding) {
          body.tools = [{ google_search: {} }];
        }

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.map((p: any) => p.text || '').join('') || '';

        if (!text) throw new Error('Empty response from Gemini');

        const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
          .map((c: any) => ({ title: c?.web?.title || '', uri: c?.web?.uri || '' }))
          .filter((s: any) => s.uri);

        return { text, modelUsed: model, sources };
      } catch (err: any) {
        lastError = err;
        console.warn(`[gemini-documents] ${model} failed with a key:`, err?.message || err);
        continue;
      }
    }
  }

  throw new Error(lastError?.message || 'All Gemini models/keys failed.');
}

// Strips ```json fences and extracts the first {...} block if the model
// wraps its JSON in prose despite instructions not to.
export function parseGeminiJSON<T = any>(rawText: string): T {
  let cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]) as T;
    }
    throw new Error('AI returned invalid JSON.');
  }
}
