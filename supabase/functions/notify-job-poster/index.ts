// Supabase Edge Function: notify-job-poster
// Called by the applications_after_insert_notify DB trigger when a job
// gets its 1st applicant, then every 5th after that (1, 6, 11, 16, ...).
// Sends one email to the job poster via Resend.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FROM_EMAIL = Deno.env.get('NOTIFY_FROM_EMAIL') || 'JobMeter <no-reply@jobmeter.app>';
const SITE_URL = Deno.env.get('NEXT_PUBLIC_SITE_URL') || 'https://www.jobmeter.app';

interface RequestBody {
  jobId: string;
  applicationCount: number;
}

function subjectAndHeading(jobTitle: string, count: number): { subject: string; heading: string; blurb: string } {
  if (count === 1) {
    return {
      subject: `You've got your first applicant for ${jobTitle}`,
      heading: `Your first applicant is in`,
      blurb: `Someone just applied to <strong>${jobTitle}</strong> on JobMeter.`,
    };
  }
  return {
    subject: `${jobTitle} just passed ${count} applicants`,
    heading: `${count} applicants and counting`,
    blurb: `<strong>${jobTitle}</strong> has now received ${count} applications on JobMeter.`,
  };
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errText}`);
  }

  return res.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { jobId, applicationCount }: RequestBody = await req.json();
    if (!jobId || !applicationCount) {
      return new Response(JSON.stringify({ error: 'Missing jobId or applicationCount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('id, title, posted_by_user_id')
      .eq('id', jobId)
      .maybeSingle();

    if (jobError || !job || !job.posted_by_user_id) {
      // Jobs pulled in from external sources have no posted_by_user_id —
      // nothing to notify, this isn't an error condition.
      return new Response(JSON.stringify({ skipped: true, reason: 'No poster to notify' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: poster, error: posterError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', job.posted_by_user_id)
      .maybeSingle();

    if (posterError || !poster?.email) {
      return new Response(JSON.stringify({ skipped: true, reason: 'Poster has no email on file' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { subject, heading, blurb } = subjectAndHeading(job.title, applicationCount);
    const applicantsUrl = `${SITE_URL}/dashboard/recruiter/jobs/${jobId}/applicants`;

    const html = `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
        <h2 style="margin-bottom: 8px;">${heading}</h2>
        <p style="font-size: 15px; line-height: 1.5;">${blurb}</p>
        <a href="${applicantsUrl}"
           style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #1D4ED8; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          View applicants
        </a>
        <p style="font-size: 12px; color: #6B7280; margin-top: 32px;">
          You're receiving this because you posted this job on JobMeter.
        </p>
      </div>
    `;

    await sendResendEmail(poster.email, subject, html);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('notify-job-poster error:', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
