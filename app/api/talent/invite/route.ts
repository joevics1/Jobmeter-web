import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: profile } = await admin.from('profiles').select('user_type').eq('id', user.id).single();
    if (!profile || profile.user_type !== 'recruiter') {
      return NextResponse.json({ error: 'Only recruiters can send invites' }, { status: 403 });
    }

    const { candidateId, jobId, message } = await req.json();
    if (!candidateId || !jobId) {
      return NextResponse.json({ error: 'candidateId and jobId are required' }, { status: 400 });
    }

    // Must be this recruiter's own job.
    const { data: job } = await admin
      .from('jobs')
      .select('id, title, posted_by_user_id, apply_in_app')
      .eq('id', jobId)
      .single();

    if (!job || job.posted_by_user_id !== user.id) {
      return NextResponse.json({ error: 'You can only invite candidates to your own jobs' }, { status: 403 });
    }
    if (!job.apply_in_app) {
      return NextResponse.json({ error: 'This job is not set up for in-app applications' }, { status: 400 });
    }

    const { data: invite, error: insertError } = await admin
      .from('job_invitations')
      .upsert(
        { recruiter_id: user.id, candidate_id: candidateId, job_id: jobId, message: message || null },
        { onConflict: 'recruiter_id,candidate_id,job_id' }
      )
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, invite });
  } catch (err: any) {
    console.error('POST /api/talent/invite error:', err);
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 });
  }
}
