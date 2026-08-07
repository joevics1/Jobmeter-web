// Supabase Edge Function: ATS CV Review
// Simple AI proxy - just calls Gemini API with provided prompt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGeminiText } from "../_shared/gemini.ts";

interface RequestBody {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, temperature, maxTokens }: RequestBody = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get('GEMINI_API_KEY_CV') || Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Calling Gemini API for ATS CV Review...');
    const content = await callGeminiText(prompt, apiKey, { temperature: temperature || 0.2, maxTokens: maxTokens || 8192 });

    return new Response(
      JSON.stringify({
        success: true,
        data: content,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Error in ATS CV Review function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred during CV analysis',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
