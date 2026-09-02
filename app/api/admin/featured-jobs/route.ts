import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin';
}

// List jobs that are currently featured or were featured recently (30 days),
// so an admin can see who's live and who just rolled off.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, company, posted_by_user_id, status, is_featured, featured_at, featured_until')
    .not('featured_at', 'is', null)
    .gt('featured_at', cutoff)
    .order('featured_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  return NextResponse.json({
    jobs: (data || []).map((j) => ({
      ...j,
      currentlyFeatured: j.is_featured && j.featured_until && new Date(j.featured_until) > now,
    })),
  });
}

// Manually feature a job (admin comp, promo, etc.) for N days.
export async function POST(req: NextRequest) {
  const { userId, jobId, days = 7 } = await req.json();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 });

  const featuredAt = new Date();
  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + Number(days));

  const { error } = await supabase
    .from('jobs')
    .update({ is_featured: true, featured_at: featuredAt.toISOString(), featured_until: featuredUntil.toISOString() })
    .eq('id', jobId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// Revoke a featured placement immediately, regardless of remaining days.
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const jobId = searchParams.get('jobId');
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!jobId) return NextResponse.json({ error: 'jobId is required' }, { status: 400 });

  const { error } = await supabase
    .from('jobs')
    .update({ is_featured: false, featured_until: new Date().toISOString() })
    .eq('id', jobId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
