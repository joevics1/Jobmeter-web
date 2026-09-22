-- Lets a recruiter trim their applicants list without deleting data.
-- hidden_at is null for a normal (visible) application; setting it hides
-- the applicant from the default view, and clearing it restores them.
ALTER TABLE applications ADD COLUMN IF NOT EXISTS hidden_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_applications_job_hidden
  ON applications (job_id, hidden_at);
