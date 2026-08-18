// Supabase Edge Function: Interview Prep
// Simple AI proxy - just calls Gemini API with provided prompt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGeminiText, callGeminiMultimodal } from "../_shared/gemini.ts";

interface RequestBody {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  audioData?: string;
  mimeType?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, temperature, maxTokens, audioData, mimeType }: RequestBody = await req.json();

    console.log('Received request with prompt length:', prompt?.length);
    console.log('Temperature:', temperature);
    console.log('Max tokens:', maxTokens);
    console.log('Has audio data:', !!audioData, 'mimeType:', mimeType);

    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt:', prompt);
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get API key
    const apiKey = Deno.env.get('GEMINI_API_KEY_CV') || Deno.env.get('GEMINI_API_KEY');
    console.log('API key found:', !!apiKey);
    if (!apiKey) {
      console.error('No Gemini API key found');
      throw new Error('Gemini API key not configured');
    }

    // If audio was sent (spoken answer), it MUST be attached to the Gemini
    // call as actual audio content. Previously this was silently dropped and
    // only the text prompt was sent, so Gemini had no real audio to
    // transcribe and would hallucinate a plausible-sounding "transcript" and
    // answer instead of using what the candidate actually said.
    let responseText: string;
    if (audioData && mimeType) {
      console.log('Calling Gemini API (multimodal) with attached audio for interview prep...');
      responseText = await callGeminiMultimodal(
        prompt,
        apiKey,
        { mimeType, base64Data: audioData },
        { temperature: temperature || 0.7, maxTokens: maxTokens || 4096 }
      );
    } else {
      console.log('Calling Gemini API for interview prep...');
      responseText = await callGeminiText(prompt, apiKey, { temperature: temperature || 0.7, maxTokens: maxTokens || 4096 });
    }
    console.log('Gemini API response length:', responseText?.length);
    console.log('Gemini API response preview:', responseText?.substring(0, 200));

    return new Response(
      JSON.stringify({
        success: true,
        data: responseText,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in interview prep function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to process interview prep request',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
