import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Lets a user close their own active job listing. We don't hard-delete —
// applicants and history stay intact — we just flip status so it stops
// counting against their active-job limit and drops off /jobs.
export async function POST(req: NextRequest) {
  try {
    const { jobId, userId } = await req.json();

    if (!jobId || !userId) {
      return NextResponse.json({ error: 'Missing jobId or userId' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, posted_by_user_id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.posted_by_user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to close this job' }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from('jobs')
      .update({
        status: 'closed',
        // A closed job shouldn't keep occupying a paid featured slot or
        // showing in the Featured strip.
        is_featured: false,
        featured_until: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to close job' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Close job error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
