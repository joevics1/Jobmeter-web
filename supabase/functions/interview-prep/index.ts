// Supabase Edge Function: Interview Prep
// Simple AI proxy - just calls Gemini API with provided prompt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { callGeminiText } from "../_shared/gemini.ts";

interface RequestBody {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
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
    const { prompt, temperature, maxTokens }: RequestBody = await req.json();

    console.log('Received request with prompt length:', prompt?.length);
    console.log('Temperature:', temperature);
    console.log('Max tokens:', maxTokens);

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

    console.log('Calling Gemini API for interview prep...');
    const responseText = await callGeminiText(prompt, apiKey, { temperature: temperature || 0.7, maxTokens: maxTokens || 4096 });
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
