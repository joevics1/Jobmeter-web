// Shared Gemini API helper for Supabase Edge Functions.
//
// Previously every function (interview-prep, career-coach, ats-cv-review,
// scam-detector, keyword-checker, role-finder, ...) hardcoded its own copy of
// the model fallback list. That drift is exactly how interview-prep,
// career-coach, and ats-cv-review ended up stuck on gemini-2.0-flash-lite /
// gemini-2.0-flash / gemini-1.5-flash long after Google retired all three
// (June 1, 2026) -- some functions got updated, some didn't, and there was no
// single place to fix it. Import from here instead of hardcoding a list.

export const GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
];

export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiCallOptions {
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

/**
 * Returns true if this HTTP status means "try the next model" rather than
 * "give up". 404 is included because a retired/renamed model ID returns 404,
 * not 429/5xx -- the original per-function copies of this logic missed that,
 * which is why a single dead model ID could take a whole tool down instead of
 * falling through to the next one.
 */
function isRetryableStatus(status: number): boolean {
  return status === 404 || status === 429 || status >= 500;
}

/**
 * Calls Gemini with the given prompt, trying each model in GEMINI_MODELS in
 * order until one succeeds. Returns the raw text response.
 */
export async function callGeminiText(
  prompt: string,
  apiKey: string,
  options: GeminiCallOptions = {}
): Promise<string> {
  const { temperature = 0.7, maxTokens = 8192, timeoutMs = 60000 } = options;

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} failed (${response.status}):`, errorText);
        if (isRetryableStatus(response.status)) {
          lastError = new Error(`Gemini API error: ${response.status} ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (text) {
        return text;
      }

      lastError = new Error(`Empty response from model ${model}`);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Error with model ${model}:`, error);
      lastError = error as Error;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Same as callGeminiText, but also handles a multimodal file part (used for
 * CV/document extraction from PDFs and images).
 */
export async function callGeminiMultimodal(
  prompt: string,
  apiKey: string,
  file: { mimeType: string; base64Data: string },
  options: GeminiCallOptions = {}
): Promise<string> {
  const { temperature = 0.1, maxTokens = 16384, timeoutMs = 90000 } = options;

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: file.mimeType, data: file.base64Data } },
            ],
          }],
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Model ${model} failed (${response.status}):`, errorText);
        if (isRetryableStatus(response.status)) {
          lastError = new Error(`Gemini API error: ${response.status} ${errorText}`);
          continue;
        }
        throw new Error(`Gemini API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (text) {
        return text;
      }

      lastError = new Error(`Empty response from model ${model}`);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Error with model ${model}:`, error);
      lastError = error as Error;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}

/**
 * Same as callGeminiText, but extracts and parses a JSON object out of the
 * response (for functions that ask Gemini to "return a JSON object").
 */
export async function callGeminiJSON<T = any>(
  prompt: string,
  apiKey: string,
  options: GeminiCallOptions = {}
): Promise<T> {
  const text = await callGeminiText(prompt, apiKey, options);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No valid JSON in Gemini response');
  }
  return JSON.parse(jsonMatch[0]);
}
