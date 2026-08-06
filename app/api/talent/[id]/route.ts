import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TALENT_FREE_DAILY_VIEW_LIMIT, TALENT_UNLIMITED_PLAN_TYPE } from '@/lib/talent';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function getRecruiter(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;

  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user) return null;

  const admin = createClient(supabaseUrl, supabaseServiceKey);
  const { data: profile } = await admin
    .from('profiles')
    .select('id, user_type')
    .eq('id', user.id)
    .single();

  if (!profile || profile.user_type !== 'recruiter') return null;
  return { id: user.id, admin };
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recruiter = await getRecruiter(req);
    if (!recruiter) {
      return NextResponse.json({ error: 'Only signed-in recruiters can view talent profiles' }, { status: 403 });
    }
    const { admin } = recruiter;
    const candidateId = params.id;

    const { data: subRows } = await admin
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', recruiter.id)
      .eq('plan_type', TALENT_UNLIMITED_PLAN_TYPE)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .limit(1);
    const isUnlimited = (subRows || []).length > 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    if (!isUnlimited) {
      const { data: viewRows } = await admin
        .from('talent_profile_views')
        .select('candidate_id')
        .eq('recruiter_id', recruiter.id)
        .gte('viewed_at', startOfDay.toISOString());

      const viewedToday = new Set((viewRows || []).map((r) => r.candidate_id));
      const alreadyViewedThisCandidate = viewedToday.has(candidateId);

      if (!alreadyViewedThisCandidate && viewedToday.size >= TALENT_FREE_DAILY_VIEW_LIMIT) {
        return NextResponse.json(
          {
            error: 'daily_limit_reached',
            message: `You've viewed ${TALENT_FREE_DAILY_VIEW_LIMIT} profiles today. Upgrade for unlimited access.`,
          },
          { status: 402 }
        );
      }
    }

    const { data: row, error } = await admin
      .from('onboarding_data')
      .select('*')
      .eq('user_id', candidateId)
      .eq('talent_pool', true)
      .lte('talent_visible_from', new Date().toISOString())
      .single();

    if (error || !row) {
      return NextResponse.json({ error: 'Candidate not found in the Talent Pool' }, { status: 404 });
    }

    const { data: contactProfile } = await admin
      .from('profiles')
      .select('email, phone')
      .eq('id', candidateId)
      .single();

    // Log the view (best-effort, doesn't block the response). Insert is
    // harmless to repeat — daily count uses distinct candidate_id anyway.
    admin.from('talent_profile_views').insert({ recruiter_id: recruiter.id, candidate_id: candidateId }).then(
      () => {},
      (err) => console.error('talent_profile_views insert error:', err)
    );

    return NextResponse.json({
      candidate: {
        id: candidateId,
        name: row.cv_name || 'JobMeter Candidate',
        email: contactProfile?.email || row.cv_email || '',
        phone: contactProfile?.phone || row.cv_phone || '',
        location: row.cv_location || '',
        summary: row.cv_summary || '',
        roles: row.cv_roles || row.target_roles || [],
        skills: row.cv_skills || [],
        experienceLevel: row.experience_level || '',
        sector: row.sector || '',
        workExperience: row.cv_work_experience || [],
        education: row.cv_education || [],
        linkedin: row.cv_linkedin || '',
        github: row.cv_github || '',
        portfolio: row.cv_portfolio || '',
      },
    });
  } catch (err: any) {
    console.error('GET /api/talent/[id] error:', err);
    return NextResponse.json({ error: 'Failed to load candidate' }, { status: 500 });
  }
}
