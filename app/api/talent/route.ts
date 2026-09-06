import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { classifyTalentCategory, TALENT_FREE_DAILY_VIEW_LIMIT, TALENT_UNLIMITED_PLAN_TYPE } from '@/lib/talent';
import { isRecruiterAccount } from '@/lib/isRecruiterAccount';

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
  if (!(await isRecruiterAccount(admin, user.id))) return null;
  return { id: user.id, admin };
}

export async function GET(req: NextRequest) {
  try {
    const recruiter = await getRecruiter(req);
    if (!recruiter) {
      return NextResponse.json({ error: 'Only signed-in recruiters can browse the Talent Pool' }, { status: 403 });
    }
    const { admin } = recruiter;

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all'; // 'intern' | 'all'
    const keyword = (searchParams.get('keyword') || '').trim();
    const location = (searchParams.get('location') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = 50;

    // Is this recruiter on a paid plan? Any active job-posting subscription
    // (basic or unlimited) now also unlocks unlimited Talent Pool access —
    // there's no longer a separate talent-only plan to buy. The legacy
    // talent_unlimited plan_type is kept here too in case anyone already
    // holds one.
    const { data: subRows } = await admin
      .from('user_subscriptions')
      .select('id, expires_at')
      .eq('user_id', recruiter.id)
      .in('plan_type', [TALENT_UNLIMITED_PLAN_TYPE, 'job_posting_basic', 'job_posting_unlimited'])
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .limit(1);
    const isUnlimited = (subRows || []).length > 0;

    let viewsUsedToday = 0;
    if (!isUnlimited) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { data: viewRows } = await admin
        .from('talent_profile_views')
        .select('candidate_id')
        .eq('recruiter_id', recruiter.id)
        .gte('viewed_at', startOfDay.toISOString());
      viewsUsedToday = new Set((viewRows || []).map((r) => r.candidate_id)).size;
    }

    let query = admin
      .from('onboarding_data')
      .select(
        'user_id, cv_name, cv_roles, cv_skills, cv_location, cv_summary, experience_level, target_roles, sector, updated_at',
        { count: 'exact' }
      )
      .eq('talent_pool', true)
      .lte('talent_visible_from', new Date().toISOString());

    if (keyword) {
      // Match against name, roles, or skills — cheap OR filter across a
      // couple of likely-relevant text/array columns.
      query = query.or(
        `cv_name.ilike.%${keyword}%,cv_summary.ilike.%${keyword}%`
      );
    }
    if (location) query = query.ilike('cv_location', `%${location}%`);

    query = query.order('updated_at', { ascending: false });

    const { data: rows, count, error } = await query;
    if (error) throw error;

    let candidates = (rows || []).map((r) => ({
      id: r.user_id,
      name: r.cv_name || 'JobMeter Candidate',
      roles: r.cv_roles || r.target_roles || [],
      skills: (r.cv_skills || []).slice(0, 6),
      location: r.cv_location || '',
      summary: r.cv_summary || '',
      sector: r.sector || '',
      experienceLevel: r.experience_level || '',
      category: classifyTalentCategory(r.experience_level),
      lastUpdated: r.updated_at,
    }));

    // Keyword search on roles/skills arrays needs to happen in-memory since
    // Postgres array `ilike` isn't a simple column filter.
    if (keyword) {
      const kw = keyword.toLowerCase();
      candidates = candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          c.summary.toLowerCase().includes(kw) ||
          c.roles.some((r: string) => r.toLowerCase().includes(kw)) ||
          c.skills.some((s: string) => s.toLowerCase().includes(kw))
      );
    }

    if (category === 'intern') {
      candidates = candidates.filter((c) => c.category === 'intern');
    }

    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const pageItems = candidates.slice(start, start + pageSize);

    return NextResponse.json({
      candidates: pageItems,
      total,
      page,
      pageSize,
      isUnlimited,
      viewsUsedToday,
      dailyViewLimit: TALENT_FREE_DAILY_VIEW_LIMIT,
    });
  } catch (err: any) {
    console.error('GET /api/talent error:', err);
    return NextResponse.json({ error: 'Failed to load talent pool' }, { status: 500 });
  }
}
