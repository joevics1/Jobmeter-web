import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapOnboardingToCVData } from '@/lib/cv-template-pages/onboarding-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest, { params }: { params: { applicationId: string } }) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const applicationId = params.applicationId;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('id, job_id, applicant_id, cover_letter, answers, application_method, created_at, screening_attempt_id, applicant_name, applicant_email, applicant_phone')
      .eq('id', applicationId)
      .maybeSingle();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { data: job } = await supabase
      .from('jobs')
      .select('id, title, posted_by_user_id, screening_enabled')
      .eq('id', application.job_id)
      .maybeSingle();

    if (!job || job.posted_by_user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to view this applicant' }, { status: 403 });
    }

    // Same source of truth as the Settings "Edit Profile" page (onboarding_data,
    // select('*')) mapped through the same mapOnboardingToCVData(), so recruiters
    // see the exact same CV fields the candidate themselves can edit — not a
    // hand-picked subset.
    const [{ data: profile }, { data: onboarding }, { data: attempt }] = await Promise.all([
      supabase.from('profiles').select('id, full_name, email, phone').eq('id', application.applicant_id).maybeSingle(),
      supabase.from('onboarding_data').select('*').eq('user_id', application.applicant_id).maybeSingle(),
      application.screening_attempt_id
        ? supabase
            .from('screening_attempts')
            .select('id, mcq_score, written_score, passed, time_taken_seconds')
            .eq('id', application.screening_attempt_id)
            .maybeSingle()
        : Promise.resolve({ data: null as any }),
    ]);

    const cv = onboarding ? mapOnboardingToCVData(onboarding) : null;

    return NextResponse.json({
      jobTitle: job.title,
      applicant: {
        id: application.applicant_id,
        // The name/email/phone the candidate actually submitted with this
        // application take priority over their (possibly since-changed) profile/CV.
        name: application.applicant_name || profile?.full_name || cv?.personalDetails.name || 'Applicant',
        email: application.applicant_email || profile?.email || cv?.personalDetails.email || '',
        phone: application.applicant_phone || profile?.phone || cv?.personalDetails.phone || '',
        experienceLevel: onboarding?.experience_level || '',
        sector: onboarding?.sector || '',
        cv,
      },
      application: {
        id: application.id,
        applicationMethod: application.application_method,
        createdAt: application.created_at,
        coverLetter: application.cover_letter,
        answers: Array.isArray(application.answers) ? application.answers : [],
      },
      screening: attempt || null,
    });
  } catch (err) {
    console.error('GET /api/recruiter/applicants/[applicationId] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

