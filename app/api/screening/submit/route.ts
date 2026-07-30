import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const {
      jobId,
      userId,
      timeTakenSeconds,
      mcqAnswers, // { [questionId]: 'a' | 'b' | 'c' | 'd' }
      writtenAnswers, // { [questionId]: string }
    } = body;

    if (!jobId || !userId || !mcqAnswers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(
        'id, sector, screening_enabled, screening_pass_mark, screening_includes_written'
      )
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job || !job.screening_enabled) {
      return NextResponse.json({ error: 'Screening quiz not available for this job' }, { status: 400 });
    }

    // ── Recompute MCQ score server-side from the answer key. Never trust a
    // client-submitted score — this is the one thing that must stay authoritative.
    const mcqIds = Object.keys(mcqAnswers);
    const { data: mcqQuestions, error: mcqError } = await supabase
      .from('screening_questions')
      .select('id, correct_option')
      .in('id', mcqIds)
      .eq('sector', job.sector)
      .eq('question_type', 'mcq');

    if (mcqError || !mcqQuestions || mcqQuestions.length === 0) {
      return NextResponse.json({ error: 'Could not verify quiz answers' }, { status: 400 });
    }

    let correctCount = 0;
    for (const q of mcqQuestions) {
      if (mcqAnswers[q.id] && mcqAnswers[q.id] === q.correct_option) {
        correctCount++;
      }
    }
    const mcqScore = Math.round((correctCount / mcqQuestions.length) * 100);

    // ── Grade written answers server-side via our own Gemini grading route.
    // We call it ourselves rather than accepting a client-reported AI score,
    // for the same reason we recompute the MCQ score ourselves.
    let writtenScore: number | null = null;
    const gradedWritten: any[] = [];

    if (job.screening_includes_written && writtenAnswers && Object.keys(writtenAnswers).length > 0) {
      const writtenIds = Object.keys(writtenAnswers);
      const { data: writtenQuestions } = await supabase
        .from('screening_questions')
        .select('id, question_text')
        .in('id', writtenIds)
        .eq('sector', job.sector)
        .eq('question_type', 'written');

      const origin = req.nextUrl.origin;
      let totalScore = 0;
      let gradedCount = 0;

      for (const wq of writtenQuestions || []) {
        const answerText = writtenAnswers[wq.id];
        if (!answerText || !answerText.trim()) {
          gradedWritten.push({ questionId: wq.id, answerText: '', aiScore: 0, aiFeedback: 'No answer provided.' });
          gradedCount++;
          continue;
        }
        try {
          const gradeRes = await fetch(`${origin}/api/gemini/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: wq.question_text, userAnswer: answerText }),
          });
          const gradeData = await gradeRes.json();
          const score = typeof gradeData.score === 'number' ? gradeData.score : 50;
          totalScore += score;
          gradedCount++;
          gradedWritten.push({
            questionId: wq.id,
            answerText,
            aiScore: score,
            aiFeedback: gradeData.feedback || '',
          });
        } catch (e) {
          console.error('Written grading error for question', wq.id, e);
          gradedWritten.push({ questionId: wq.id, answerText, aiScore: 50, aiFeedback: 'Grading unavailable.' });
          totalScore += 50;
          gradedCount++;
        }
      }
      writtenScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : null;
    }

    const overallScore =
      job.screening_includes_written && writtenScore !== null
        ? Math.round((mcqScore + writtenScore) / 2)
        : mcqScore;
    const passed = overallScore >= job.screening_pass_mark;

    const { data: attempt, error: insertError } = await supabase
      .from('screening_attempts')
      .upsert(
        {
          applicant_id: userId,
          job_id: jobId,
          mcq_score: mcqScore,
          written_answers: gradedWritten.length > 0 ? gradedWritten : null,
          written_score: writtenScore,
          passed,
          time_taken_seconds: timeTakenSeconds || null,
          answers: mcqAnswers,
        },
        { onConflict: 'applicant_id,job_id' }
      )
      .select()
      .single();

    if (insertError || !attempt) {
      console.error('Screening attempt insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save quiz attempt' }, { status: 500 });
    }

    return NextResponse.json({
      attemptId: attempt.id,
      mcqScore,
      writtenScore,
      overallScore,
      passMark: job.screening_pass_mark,
      passed,
    });
  } catch (err) {
    console.error('Screening submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
