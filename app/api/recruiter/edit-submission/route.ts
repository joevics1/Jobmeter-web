import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing id or userId' }, { status: 400 });
    }

    const { data: submission, error } = await supabase
      .from('user_submitted_jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    if (submission.user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to edit this submission' }, { status: 403 });
    }

    return NextResponse.json({ submission });
  } catch (err) {
    console.error('edit-submission GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();
    const { id, userId, updates } = body;

    if (!id || !userId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from('user_submitted_jobs')
      .select('id, user_id, status')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    if (existing.user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to edit this submission' }, { status: 403 });
    }

    // Editing always sends it back for a fresh admin look — even if it was already
    // live, changes don't take effect until re-approved.
    const { error: updateError } = await supabase
      .from('user_submitted_jobs')
      .update({
        ...updates,
        status: 'pending',
        rejection_reason: null,
        admin_notes: null,
        admin_reviewed_at: null,
        approved_at: null,
        published_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      console.error('edit-submission update error:', updateError);
      return NextResponse.json({ error: 'Failed to save changes' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('edit-submission POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
