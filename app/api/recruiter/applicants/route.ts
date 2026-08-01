import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');

    if (!jobId || !userId) {
      return NextResponse.json({ error: 'Missing jobId or userId' }, { status: 400 });
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, posted_by_user_id, screening_enabled')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.posted_by_user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to view applicants for this job' }, { status: 403 });
    }

    const { data: applications, error: appsError } = await supabase
      .from('applications')
      .select('id, applicant_id, cover_letter, created_at, screening_attempt_id')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (appsError) {
      return NextResponse.json({ error: 'Failed to load applicants' }, { status: 500 });
    }

    const applicantIds = (applications || []).map((a) => a.applicant_id);
    const attemptIds = (applications || [])
      .map((a) => a.screening_attempt_id)
      .filter(Boolean);

    const [{ data: profiles }, { data: attempts }] = await Promise.all([
      applicantIds.length > 0
        ? supabase.from('profiles').select('id, full_name, email, phone').in('id', applicantIds)
        : Promise.resolve({ data: [] as any[] }),
      attemptIds.length > 0
        ? supabase
            .from('screening_attempts')
            .select('id, mcq_score, written_score, passed, time_taken_seconds')
            .in('id', attemptIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
    const attemptMap = new Map((attempts || []).map((a: any) => [a.id, a]));

    const result = (applications || []).map((a: any) => ({
      id: a.id,
      applicantId: a.applicant_id,
      coverLetter: a.cover_letter,
      createdAt: a.created_at,
      applicant: profileMap.get(a.applicant_id) || null,
      screening: a.screening_attempt_id ? attemptMap.get(a.screening_attempt_id) || null : null,
    }));

    return NextResponse.json({ jobTitle: job.title, screeningEnabled: job.screening_enabled, applicants: result });
  } catch (err) {
    console.error('Recruiter applicants fetch error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
