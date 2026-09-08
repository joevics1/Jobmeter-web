-- 'closed' was already the value app code uses (see api/jobs/close and
-- api/recruiter/my-jobs), but the CHECK constraint never included it —
-- meaning every "Close job" attempt was rejected at the database level with
-- a constraint violation. This is the actual root cause of the Close button
-- "not working": the API call was failing with a 500, not a frontend bug.
ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check
  CHECK (status = ANY (ARRAY['active'::text, 'closed'::text, 'expired'::text, 'cancelled'::text, 'expired_indexed'::text]));
