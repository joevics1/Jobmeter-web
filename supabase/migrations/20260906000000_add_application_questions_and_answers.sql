-- Recruiters can attach up to 10 custom questions to a job when applications
-- are handled in-app; candidates answer them as part of the Quick Apply form.
-- Stored as a JSON array of question strings, mirrored on both
-- user_submitted_jobs (draft/pending) and jobs (published) the same way
-- apply_in_app/screening_* already are, so any pipeline that copies a
-- submission over to jobs by column name carries it across too.
ALTER TABLE user_submitted_jobs ADD COLUMN IF NOT EXISTS application_questions jsonb DEFAULT '[]'::jsonb;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_questions jsonb DEFAULT '[]'::jsonb;

-- Candidate's answers to those questions, stored alongside their application.
-- Shape: [{ "question": "...", "answer": "..." }, ...]
ALTER TABLE applications ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '[]'::jsonb;

-- Candidates edit their pre-filled name/email/phone at application time;
-- persist what they actually submitted rather than only inferring from
-- their profile (which may change later).
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_name text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_email text;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applicant_phone text;

-- Prevent duplicate in-app applications to the same job by the same user.
CREATE UNIQUE INDEX IF NOT EXISTS applications_unique_applicant_job
  ON applications (applicant_id, job_id);
