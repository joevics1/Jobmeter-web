import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin';
}

// List unverified companies along with the poster's email (for the admin
// to eyeball whether the domain plausibly matches) and how many jobs
// they've posted (a company with several live postings and no verification
// is a higher-priority review than one with zero).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: companies, error } = await supabase
    .from('companies')
    .select('id, name, slug, website_url, email, user_id, created_at')
    .eq('is_verified', false)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!companies || companies.length === 0) return NextResponse.json({ companies: [] });

  const userIds = [...new Set(companies.map((c) => c.user_id).filter(Boolean))];
  const posterEmailById = new Map<string, string>();
  await Promise.all(
    userIds.map(async (id) => {
      const { data } = await supabase.auth.admin.getUserById(id);
      if (data?.user?.email) posterEmailById.set(id, data.user.email);
    })
  );

  const companyIds = companies.map((c) => c.id);
  const { data: jobCounts } = await supabase.from('jobs').select('company_id').in('company_id', companyIds);
  const jobCountByCompany = new Map<string, number>();
  (jobCounts || []).forEach((j: any) => {
    jobCountByCompany.set(j.company_id, (jobCountByCompany.get(j.company_id) || 0) + 1);
  });

  return NextResponse.json({
    companies: companies.map((c) => ({
      ...c,
      posterEmail: posterEmailById.get(c.user_id) || null,
      jobCount: jobCountByCompany.get(c.id) || 0,
    })),
  });
}

export async function POST(req: NextRequest) {
  const { userId, companyId, action } = await req.json();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!companyId || !['verify', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const update =
    action === 'verify'
      ? { is_verified: true, verified_at: new Date().toISOString() }
      // "Reject" doesn't delete the company (its jobs still need to point
      // somewhere) — it unpublishes it so it stops showing publicly while
      // staying visible here for a second look.
      : { is_published: false };

  const { error } = await supabase.from('companies').update(update).eq('id', companyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
