import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  const { data: applications, error } = await supabase
    .from('applications')
    .select('id, job_id, application_method, cover_letter, created_at')
    .eq('applicant_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!applications || applications.length === 0) return NextResponse.json({ applications: [] });

  const jobIds = applications.map((a) => a.job_id);
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, company, slug, country, status')
    .in('id', jobIds);

  const jobsById = new Map((jobs || []).map((j) => [j.id, j]));

  const result = applications.map((a) => {
    const job = jobsById.get(a.job_id);
    return {
      id: a.id,
      appliedAt: a.created_at,
      method: a.application_method,
      hasCoverLetter: !!a.cover_letter,
      job: job
        ? { id: job.id, title: job.title, company: job.company, slug: job.slug, country: job.country, status: job.status }
        : null,
    };
  });

  return NextResponse.json({ applications: result });
}
