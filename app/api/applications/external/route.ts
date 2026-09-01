import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const VALID_METHODS = ['email', 'phone', 'link'] as const;
type ExternalMethod = (typeof VALID_METHODS)[number];

// Records that a signed-in user clicked through to apply externally
// (email / WhatsApp-phone / external website link) so it shows up
// alongside in-app applications on their profile. This is a best-effort
// "intent" record — we can't know if they actually completed the
// application on the external site — so it never overwrites an
// existing row (e.g. one created via the in-app apply flow with a
// cover letter already attached).
export async function POST(req: NextRequest) {
  try {
    const { jobId, userId, method } = await req.json();

    if (!jobId || !userId || !method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!VALID_METHODS.includes(method as ExternalMethod)) {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Don't clobber an existing application (e.g. in-app application with
    // a cover letter). Only insert if one doesn't already exist.
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('applicant_id', userId)
      .eq('job_id', jobId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ applicationId: existing.id, alreadyTracked: true });
    }

    const { data: application, error: insertError } = await supabase
      .from('applications')
      .insert({
        applicant_id: userId,
        job_id: jobId,
        application_method: method,
      })
      .select('id')
      .single();

    if (insertError || !application) {
      console.error('External application insert error:', insertError);
      return NextResponse.json({ error: 'Failed to record application' }, { status: 500 });
    }

    return NextResponse.json({ applicationId: application.id });
  } catch (err) {
    console.error('External application tracking error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
