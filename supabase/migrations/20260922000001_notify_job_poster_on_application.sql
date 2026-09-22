-- Notifies a job poster by email on their 1st applicant, then every 5th
-- after that (1, 6, 11, 16, ...). Fires once per qualifying insert via
-- pg_net so the INSERT into `applications` never blocks on the HTTP call.

CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION notify_job_poster_on_application()
RETURNS TRIGGER AS $$
DECLARE
  app_count integer;
  function_url text := current_setting('app.settings.notify_job_poster_url', true);
  service_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  -- Counts every application ever received for the job, regardless of
  -- whether the recruiter has since hidden some from their own view —
  -- hiding is just a display filter and shouldn't skew the milestone count.
  SELECT count(*) INTO app_count
  FROM applications
  WHERE job_id = NEW.job_id;

  -- Only the 1st application, and every 5th one after that.
  IF app_count = 1 OR (app_count > 1 AND (app_count - 1) % 5 = 0) THEN
    IF function_url IS NOT NULL AND service_key IS NOT NULL THEN
      PERFORM net.http_post(
        url := function_url,
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || service_key
        ),
        body := jsonb_build_object(
          'jobId', NEW.job_id,
          'applicationCount', app_count
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions;

DROP TRIGGER IF EXISTS applications_after_insert_notify ON applications;
CREATE TRIGGER applications_after_insert_notify
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_job_poster_on_application();

-- One-time setup (run manually, not via this migration, since these are
-- project secrets rather than schema):
--   ALTER DATABASE postgres SET app.settings.notify_job_poster_url =
--     'https://qyuzuooxenyjqnjplrya.supabase.co/functions/v1/notify-job-poster';
--   ALTER DATABASE postgres SET app.settings.service_role_key = '<service_role_key>';
