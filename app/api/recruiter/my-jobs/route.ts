import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: submissions, error: subError } = await supabase
      .from('user_submitted_jobs')
      .select('id, title, status, rejection_reason, apply_in_app, screening_enabled, duplicate_check, created_at')
      .eq('user_id', userId)
      .eq('apply_in_app', true)
      .order('created_at', { ascending: false });

    if (subError) {
      return NextResponse.json({ error: 'Failed to load your submissions' }, { status: 500 });
    }

    const { data: liveJobs } = await supabase
      .from('jobs')
      .select('id, title, status, duplicate_check')
      .eq('posted_by_user_id', userId);

    const jobsByHash = new Map(
      (liveJobs || [])
        .filter((j: any) => j.duplicate_check?.hash)
        .map((j: any) => [j.duplicate_check.hash, j])
    );

    const jobIds = (liveJobs || []).map((j: any) => j.id);
    const applicantCounts: Record<string, number> = {};
    if (jobIds.length > 0) {
      const { data: apps } = await supabase
        .from('applications')
        .select('job_id')
        .in('job_id', jobIds);
      (apps || []).forEach((a: any) => {
        applicantCounts[a.job_id] = (applicantCounts[a.job_id] || 0) + 1;
      });
    }

    const result = (submissions || []).map((s: any) => {
      const matchedJob = s.duplicate_check?.hash ? jobsByHash.get(s.duplicate_check.hash) : null;

      let statusLabel: string;
      let statusColor: string;
      if (s.status === 'rejected') {
        statusLabel = 'Rejected';
        statusColor = '#DC2626';
      } else if (s.status === 'published' && matchedJob) {
        statusLabel = matchedJob.status === 'active' ? 'Live' : 'Expired';
        statusColor = matchedJob.status === 'active' ? '#16A34A' : '#6B7280';
      } else if (s.status === 'published') {
        // Approved but not yet linked to a live job row — rare transitional state
        statusLabel = 'Approved';
        statusColor = '#16A34A';
      } else {
        statusLabel = 'Pending review';
        statusColor = '#B45309';
      }

      return {
        submissionId: s.id,
        jobId: matchedJob?.id || null,
        title: s.title,
        statusLabel,
        statusColor,
        rejectionReason: s.rejection_reason,
        screeningEnabled: s.screening_enabled,
        applicantCount: matchedJob ? (applicantCounts[matchedJob.id] || 0) : 0,
        createdAt: s.created_at,
        canEdit: true,
      };
    });

    return NextResponse.json({ jobs: result });
  } catch (err) {
    console.error('recruiter/my-jobs error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
