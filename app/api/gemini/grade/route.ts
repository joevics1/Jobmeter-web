import { NextRequest, NextResponse } from 'next/server';
import { callGeminiJSON } from '@/lib/gemini-client';

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

    let parsedResult: any;
    try {
      parsedResult = await callGeminiJSON(gradingPrompt, { temperature: 0.3, maxOutputTokens: 2048 });
    } catch (err) {
      console.error('Grading service error:', err);
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
