import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  return data?.role === 'admin';
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const q = searchParams.get('q') || '';

  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (q.trim().length < 2) return NextResponse.json({ jobs: [] });

  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, company, status, is_featured')
    .eq('status', 'active')
    .ilike('title', `%${q}%`)
    .limit(10);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ jobs: data || [] });
}
