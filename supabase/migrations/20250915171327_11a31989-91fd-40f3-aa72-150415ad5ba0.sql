-- Security Fix: Clean up and rebuild application table security policies
-- This migration completely rebuilds the security policies for personal data protection

-- Create rate limiting function (replace if exists)
CREATE OR REPLACE FUNCTION public.check_application_rate_limit(table_name text, user_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer := 0;
BEGIN
  -- Check submissions from the same email in the last hour
  IF table_name = 'venue_applications' THEN
    SELECT COUNT(*) INTO recent_count
    FROM venue_applications
    WHERE email = user_identifier
    AND created_at > NOW() - INTERVAL '1 hour';
  ELSIF table_name = 'sponsor_applications' THEN
    SELECT COUNT(*) INTO recent_count
    FROM sponsor_applications
    WHERE email = user_identifier
    AND created_at > NOW() - INTERVAL '1 hour';
  END IF;
  
  -- Allow max 3 submissions per hour per email (rate limiting)
  RETURN recent_count < 3;
END;
$$;

-- Clean up all existing policies for venue_applications
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Authenticated users can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Public venue registration allowed" ON venue_applications;
DROP POLICY IF EXISTS "Deny unauthorized access to venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Admins can view all venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Venue owners can view their own applications" ON venue_applications;
DROP POLICY IF EXISTS "Admins can update venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Secure venue application submission" ON venue_applications;
DROP POLICY IF EXISTS "Admin only venue applications access" ON venue_applications;
DROP POLICY IF EXISTS "Venue owner self access" ON venue_applications;
DROP POLICY IF EXISTS "Admin only venue updates" ON venue_applications;

-- Clean up all existing policies for sponsor_applications
DROP POLICY IF EXISTS "Anyone can submit sponsor applications" ON sponsor_applications;
DROP POLICY IF EXISTS "Admins can view all sponsor applications" ON sponsor_applications;
DROP POLICY IF EXISTS "Admins can update sponsor applications" ON sponsor_applications;
DROP POLICY IF EXISTS "Secure sponsor application submission" ON sponsor_applications;
DROP POLICY IF EXISTS "Admin only sponsor applications access" ON sponsor_applications;
DROP POLICY IF EXISTS "Admin only sponsor updates" ON sponsor_applications;

-- Create secure INSERT policies with comprehensive validation
CREATE POLICY "Validated venue application submission"
ON venue_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting protection
  public.check_application_rate_limit('venue_applications', email)
  AND 
  -- Email format validation  
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required fields validation
  business_name IS NOT NULL AND trim(business_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  AND address IS NOT NULL AND trim(address) != ''
  -- Length constraints for security
  AND char_length(email) <= 254
  AND char_length(business_name) <= 200
  AND char_length(contact_name) <= 100
);

CREATE POLICY "Validated sponsor application submission"
ON sponsor_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting protection
  public.check_application_rate_limit('sponsor_applications', email)
  AND 
  -- Email format validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required fields validation
  company_name IS NOT NULL AND trim(company_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  -- Length constraints for security
  AND char_length(email) <= 254
  AND char_length(company_name) <= 200
  AND char_length(contact_name) <= 100
);

-- Strict SELECT policies - only authorized access to personal data
CREATE POLICY "Admin venue applications view"
ON venue_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Venue owners can only see their own applications
CREATE POLICY "Venue owner own applications view"
ON venue_applications
FOR SELECT
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id', true))::uuid
);

-- Sponsor applications - admin only access
CREATE POLICY "Admin sponsor applications view"
ON sponsor_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- UPDATE policies - admin only for both tables
CREATE POLICY "Admin venue applications update"
ON venue_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Admin sponsor applications update"
ON sponsor_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Create performance indexes for security queries
CREATE INDEX IF NOT EXISTS idx_venue_applications_email_time 
ON venue_applications(email, created_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_applications_email_time 
ON sponsor_applications(email, created_at);

-- Audit logging table for compliance
CREATE TABLE IF NOT EXISTS public.application_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  ip_address inet,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.application_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only access to audit logs
DROP POLICY IF EXISTS "Admin audit access" ON public.application_audit_log;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.application_audit_log;

CREATE POLICY "Admin audit log access"
ON public.application_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);