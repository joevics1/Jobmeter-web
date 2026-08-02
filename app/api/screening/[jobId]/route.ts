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

// Finds the most specific role group for this job (sector + role/title match),
// so a broad sector like "Healthcare & Medical" doesn't hand a nurse the same
// questions as a doctor. Falls back to sector-wide (no group) if nothing matches.
async function findMatchingRoleGroup(
  supabase: any,
  sector: string,
  jobTitle: string,
  jobRoleCategory: string
) {
  const { data: groups } = await supabase
    .from('role_groups')
    .select('id, roles')
    .eq('sector', sector);

  if (!groups || groups.length === 0) return null;

  const haystacks = [jobTitle, jobRoleCategory].filter(Boolean).map((s) => s.toLowerCase());
  if (haystacks.length === 0) return null;

  for (const group of groups as any[]) {
    const roles: string[] = group.roles || [];
    const matched = roles.some((role) =>
      haystacks.some((h) => h.includes(role.toLowerCase()) || role.toLowerCase().includes(h))
    );
    if (matched) return group.id as string;
  }
  return null;
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
        'id, sector, title, role_category, apply_in_app, screening_enabled, screening_mode, screening_pass_mark, screening_mcq_count, screening_duration_minutes, screening_includes_written, screening_written_count'
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

    const roleGroupId = await findMatchingRoleGroup(
      supabase,
      job.sector,
      job.title || '',
      job.role_category || ''
    );

    // Fetch a question pool for a given type: try the matched role group first,
    // fall back to sector-wide (role_group_id null) if that group has none yet.
    async function fetchPool(questionType: 'mcq' | 'written', columns: string) {
      if (roleGroupId) {
        const { data } = await supabase
          .from('screening_questions')
          .select(columns)
          .eq('sector', job!.sector)
          .eq('question_type', questionType)
          .eq('role_group_id', roleGroupId)
          .eq('is_active', true);
        if (data && data.length > 0) return data;
      }
      const { data: fallback } = await supabase
        .from('screening_questions')
        .select(columns)
        .eq('sector', job!.sector)
        .eq('question_type', questionType)
        .is('role_group_id', null)
        .eq('is_active', true);
      return fallback || [];
    }

    const mcqPool = await fetchPool('mcq', 'id, question_text, option_a, option_b, option_c, option_d');

    let writtenPool: any[] = [];
    if (job.screening_includes_written) {
      writtenPool = await fetchPool('written', 'id, question_text');
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
