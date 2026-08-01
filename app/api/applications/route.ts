import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { jobId, userId, coverLetter, screeningAttemptId } = body;

    if (!jobId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, apply_in_app, screening_enabled')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!job.apply_in_app) {
      return NextResponse.json(
        { error: 'This job does not accept in-app applications' },
        { status: 400 }
      );
    }

    if (job.screening_enabled) {
      if (!screeningAttemptId) {
        return NextResponse.json(
          { error: 'You need to complete the screening quiz before applying' },
          { status: 400 }
        );
      }

      const { data: attempt, error: attemptError } = await supabase
        .from('screening_attempts')
        .select('id, applicant_id, job_id, passed')
        .eq('id', screeningAttemptId)
        .maybeSingle();

      if (
        attemptError ||
        !attempt ||
        attempt.applicant_id !== userId ||
        attempt.job_id !== jobId
      ) {
        return NextResponse.json({ error: 'Invalid quiz attempt' }, { status: 400 });
      }

      if (!attempt.passed) {
        return NextResponse.json(
          { error: 'You did not pass the screening quiz for this job' },
          { status: 403 }
        );
      }
    }

    const { data: application, error: insertError } = await supabase
      .from('applications')
      .upsert(
        {
          applicant_id: userId,
          job_id: jobId,
          cover_letter: coverLetter || null,
          screening_attempt_id: job.screening_enabled ? screeningAttemptId : null,
        },
        { onConflict: 'applicant_id,job_id' }
      )
      .select()
      .single();

    if (insertError || !application) {
      console.error('Application insert error:', insertError);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    return NextResponse.json({ applicationId: application.id });
  } catch (err) {
    console.error('Application submit error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
