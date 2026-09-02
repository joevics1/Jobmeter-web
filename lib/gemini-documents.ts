// lib/gemini-documents.ts
//
// Thin wrapper over the general shared client (lib/gemini-client.ts),
// preserving this module's original {systemPrompt, userPrompt} call shape
// so its existing callers (app/api/documents/generate, app/api/documents/research)
// didn't need to change. New code should import lib/gemini-client.ts directly.

import { callGemini as callGeminiShared, parseGeminiJSON, GeminiCallResult } from './gemini-client';

export type { GeminiCallResult };

export interface GeminiCallOptions {
  systemPrompt: string;
  userPrompt: string;
  grounding?: boolean;
  temperature?: number;
  maxOutputTokens?: number;
}

export async function callGemini(opts: GeminiCallOptions): Promise<GeminiCallResult> {
  return callGeminiShared(opts.userPrompt, {
    systemPrompt: opts.systemPrompt,
    grounding: opts.grounding,
    temperature: opts.temperature,
    maxOutputTokens: opts.maxOutputTokens,
  });
}

export { parseGeminiJSON };
