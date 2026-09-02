// lib/gemini-client.ts
//
// General-purpose Gemini caller, used across job submission parsing,
// document generation, onboarding CV/OCR parsing, screening grading, and
// anywhere else in the app that needs a Gemini call. One place to update
// when Google changes or retires a model, instead of N copies drifting out
// of sync (that's exactly how several routes ended up stuck on
// gemini-2.5-* / gemini-1.5-* / gemini-2.0-* long after they should have
// moved on).
//
// Model waterfall: gemini-3.1-flash-lite (primary) -> gemini-3-flash-preview (fallback)
// Key rotation: GEMINI_API_KEY -> GEMINI_API_KEY_2 -> GEMINI_API_KEY_3
// Every (model, key) pair is tried in order until one succeeds — this
// covers both "model unavailable/retired" and "this key is rate-limited"
// failures without giving up early on either axis.

export const GEMINI_MODELS = ['gemini-3.1-flash-lite', 'gemini-3-flash-preview'] as const;

export function getGeminiApiKeys(): string[] {
  return [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(
    (k): k is string => !!k
  );
}

export interface GeminiFile {
  mimeType: string;
  base64Data: string;
}

export interface GeminiCallOptions {
  systemPrompt?: string;
  temperature?: number;
  maxOutputTokens?: number;
  grounding?: boolean;
  timeoutMs?: number;
  /** Attach a file (image/PDF) for multimodal calls — CV/document OCR, etc. */
  file?: GeminiFile;
}

export interface GeminiCallResult {
  text: string;
  modelUsed: string;
  sources: { title: string; uri: string }[];
}

/** 404 covers a retired/renamed model ID (which fails this way, not 429/5xx),
 * 429 covers per-key rate limits, 5xx covers transient upstream errors. All
 * three mean "try the next (model, key) pair", not "give up". */
function isRetryableStatus(status: number): boolean {
  return status === 404 || status === 429 || status >= 500;
}

export async function callGemini(userPrompt: string, options: GeminiCallOptions = {}): Promise<GeminiCallResult> {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) {
    throw new Error('No Gemini API keys configured (GEMINI_API_KEY / GEMINI_API_KEY_2 / GEMINI_API_KEY_3)');
  }

  const { systemPrompt, temperature = 0.3, maxOutputTokens = 8192, grounding = false, timeoutMs = 60000, file } = options;

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    for (const key of keys) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const parts: any[] = [{ text: userPrompt }];
        if (file) {
          parts.push({ inlineData: { mimeType: file.mimeType, data: file.base64Data } });
        }

        const body: any = {
          ...(systemPrompt ? { system_instruction: { parts: [{ text: systemPrompt }] } } : {}),
          contents: [{ parts }],
          generationConfig: { temperature, maxOutputTokens },
        };
        if (grounding) body.tools = [{ google_search: {} }];

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          const message = err?.error?.message || `Gemini API error: ${response.status}`;
          console.warn(`[gemini-client] ${model} failed (${response.status}):`, message);
          if (!isRetryableStatus(response.status)) throw new Error(message);
          lastError = new Error(message);
          continue;
        }

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const text = candidate?.content?.parts?.map((p: any) => p.text || '').join('') || '';
        if (!text) {
          lastError = new Error(`Empty response from ${model}`);
          continue;
        }

        const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
          .map((c: any) => ({ title: c?.web?.title || '', uri: c?.web?.uri || '' }))
          .filter((s: any) => s.uri);

        return { text, modelUsed: model, sources };
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err;
        console.warn(`[gemini-client] ${model} failed with a key:`, err?.message || err);
        continue;
      }
    }
  }

  throw new Error(lastError?.message || 'All Gemini models/keys failed.');
}

export async function callGeminiJSON<T = any>(userPrompt: string, options: GeminiCallOptions = {}): Promise<T> {
  const { text } = await callGemini(userPrompt, options);
  return parseGeminiJSON<T>(text);
}

// Strips ```json fences and extracts the first {...} block if the model
// wraps its JSON in prose despite instructions not to.
export function parseGeminiJSON<T = any>(rawText: string): T {
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error('AI returned invalid JSON.');
  }
}
