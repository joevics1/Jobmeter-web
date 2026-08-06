import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const authClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const { status } = await req.json();
    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'status must be accepted or declined' }, { status: 400 });
    }

    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // Ownership check happens implicitly: the eq('candidate_id', user.id)
    // clause means this update matches zero rows for an invite that isn't
    // this user's — same effect as the RLS policy, enforced again here
    // since this route uses the service-role client.
    const { data, error } = await admin
      .from('job_invitations')
      .update({ status })
      .eq('id', params.id)
      .eq('candidate_id', user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, invitation: data });
  } catch (err: any) {
    console.error('POST /api/invitations/[id]/respond error:', err);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}
