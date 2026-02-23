import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';

export async function POST(req: NextRequest) {
  try {
    const { question, userAnswer, customPrompt } = await req.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const gradingPrompt = customPrompt || `You are an expert evaluator. Evaluate the following answer to the question.
    
Question: ${question}

User's Answer: ${userAnswer}

Provide your evaluation in the following JSON format:
{
  "score": (a number from 0-100 representing the quality of the answer),
  "feedback": (constructive feedback explaining the score and areas for improvement)
}

Consider the following criteria:
- Relevance to the question
- Depth of understanding
- Clarity of expression
- Accuracy of information
- Completeness of the answer

Return ONLY valid JSON, no additional text.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: gradingPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to grade answer' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response from grading service' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsedResult;
    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      // Return a default response if parsing fails
      return NextResponse.json({
        score: 50,
        feedback: 'Unable to evaluate answer. Please review the question and provide a more detailed response.',
      });
    }

    // Ensure score is a number between 0-100
    const score = Math.min(100, Math.max(0, parseInt(parsedResult.score) || 50));
    
    // Pass/Fail threshold is 75%
    const passed = score >= 75;

    return NextResponse.json({
      score,
      passed,
      feedback: parsedResult.feedback || 'Good effort!',
    });

  } catch (error) {
    console.error('Grading error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
