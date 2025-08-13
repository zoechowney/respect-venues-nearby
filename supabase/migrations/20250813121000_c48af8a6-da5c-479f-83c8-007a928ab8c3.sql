-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs every 6 days to keep the database active
-- This prevents the free Supabase account from pausing due to inactivity
SELECT cron.schedule(
  'database-keep-alive',
  '0 0 */6 * *', -- At midnight every 6 days
  $$
  SELECT
    net.http_post(
      url := 'https://unehnuoczenmcyqmvsvf.supabase.co/functions/v1/keep-alive',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZWhudW9jemVubWN5cW12c3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NjEyMDAsImV4cCI6MjA2NTEzNzIwMH0.jA4ftRwehwfMcI6Vuw92MAwBhK85Kgs51YrtH4Oz5e8"}'::jsonb,
      body := '{"source": "cron_job", "purpose": "keep_alive"}'::jsonb
    ) as request_id;
  $$
);

-- Add a comment to document what this cron job does
COMMENT ON EXTENSION pg_cron IS 'Used to schedule automatic database keep-alive tasks to prevent account pausing';