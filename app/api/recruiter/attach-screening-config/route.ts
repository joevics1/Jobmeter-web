import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { userId, applyInApp, screeningEnabled, screeningMode, screeningIncludesWritten } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Most recent submission for this user — the one /submit just created.
    const { data: submission, error: findError } = await supabase
      .from('user_submitted_jobs')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError || !submission) {
      return NextResponse.json({ error: 'Could not find the submission to update' }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from('user_submitted_jobs')
      .update({
        apply_in_app: !!applyInApp,
        screening_enabled: !!screeningEnabled,
        screening_mode: screeningMode === 'speed' ? 'speed' : 'standard',
        screening_includes_written: !!screeningIncludesWritten,
      })
      .eq('id', submission.id);

    if (updateError) {
      console.error('attach-screening-config update error:', updateError);
      return NextResponse.json({ error: 'Failed to attach screening config' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('attach-screening-config error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
