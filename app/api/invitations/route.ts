import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getCandidate(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCandidate(req);
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: invites, error } = await admin
      .from('job_invitations')
      .select('id, job_id, message, status, created_at')
      .eq('candidate_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobIds = [...new Set((invites || []).map((i) => i.job_id))];
    let jobsById: Record<string, any> = {};
    if (jobIds.length > 0) {
      const { data: jobs } = await admin
        .from('jobs')
        .select('id, title, company, short_code, status')
        .in('id', jobIds);
      jobsById = Object.fromEntries((jobs || []).map((j) => [j.id, j]));
    }

    const result = (invites || []).map((inv) => {
      const job = jobsById[inv.job_id];
      return {
        id: inv.id,
        status: inv.status,
        message: inv.message,
        createdAt: inv.created_at,
        job: job
          ? {
              id: job.id,
              title: job.title,
              companyName: job.company?.name || job.company?.company_name || '',
              shortCode: job.short_code,
              isLive: job.status === 'active',
            }
          : null,
      };
    });

    return NextResponse.json({ invitations: result });
  } catch (err: any) {
    console.error('GET /api/invitations error:', err);
    return NextResponse.json({ error: 'Failed to load invitations' }, { status: 500 });
  }
}
