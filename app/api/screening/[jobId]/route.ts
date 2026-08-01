import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { jobId } = params;

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(
        'id, sector, apply_in_app, screening_enabled, screening_mode, screening_pass_mark, screening_mcq_count, screening_duration_minutes, screening_includes_written, screening_written_count'
      )
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (!job.apply_in_app || !job.screening_enabled) {
      return NextResponse.json(
        { error: 'This job does not have a screening quiz' },
        { status: 400 }
      );
    }

    const { data: mcqPool, error: mcqError } = await supabase
      .from('screening_questions')
      .select('id, question_text, option_a, option_b, option_c, option_d')
      .eq('sector', job.sector)
      .eq('question_type', 'mcq')
      .eq('is_active', true);

    if (mcqError) {
      return NextResponse.json({ error: 'Failed to load quiz questions' }, { status: 500 });
    }

    let writtenPool: any[] = [];
    if (job.screening_includes_written) {
      const { data, error: writtenError } = await supabase
        .from('screening_questions')
        .select('id, question_text')
        .eq('sector', job.sector)
        .eq('question_type', 'written')
        .eq('is_active', true);

      if (writtenError) {
        return NextResponse.json({ error: 'Failed to load quiz questions' }, { status: 500 });
      }
      writtenPool = data || [];
    }

    if (!mcqPool || mcqPool.length === 0) {
      return NextResponse.json(
        { error: 'No screening questions are set up for this job yet' },
        { status: 404 }
      );
    }

    const mcq = shuffle(mcqPool).slice(0, job.screening_mcq_count);
    const written = job.screening_includes_written
      ? shuffle(writtenPool).slice(0, job.screening_written_count)
      : [];

    return NextResponse.json({
      jobId: job.id,
      mode: job.screening_mode,
      durationMinutes: job.screening_duration_minutes,
      passMark: job.screening_pass_mark,
      includesWritten: job.screening_includes_written,
      mcq,
      written,
    });
  } catch (err) {
    console.error('Screening fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
