-- Enhanced Security for Application Tables - Simplified Version
-- This migration tightens RLS policies and adds core security measures

-- Create rate limiting function for application submissions
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
  
  -- Allow max 3 submissions per hour per email
  RETURN recent_count < 3;
END;
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Anyone can submit sponsor applications" ON sponsor_applications;
DROP POLICY IF EXISTS "Authenticated users can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Public venue registration allowed" ON venue_applications;
DROP POLICY IF EXISTS "Deny unauthorized access to venue applications" ON venue_applications;

-- Create new secure INSERT policies with validation and rate limiting
CREATE POLICY "Secure venue application submission"
ON venue_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting check
  public.check_application_rate_limit('venue_applications', email)
  AND 
  -- Email format validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required field validation
  business_name IS NOT NULL AND trim(business_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  AND address IS NOT NULL AND trim(address) != ''
  AND char_length(email) <= 254
  AND char_length(business_name) <= 200
  AND char_length(contact_name) <= 100
);

CREATE POLICY "Secure sponsor application submission"
ON sponsor_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting check
  public.check_application_rate_limit('sponsor_applications', email)
  AND 
  -- Email format validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required field validation
  company_name IS NOT NULL AND trim(company_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  AND char_length(email) <= 254
  AND char_length(company_name) <= 200
  AND char_length(contact_name) <= 100
);

-- Tighten SELECT policies to ensure only authorized access to personal data
CREATE POLICY "Admin only venue applications access"
ON venue_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Allow venue owners to see their own applications only
CREATE POLICY "Venue owner self access"
ON venue_applications
FOR SELECT
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id', true))::uuid
);

-- Ensure sponsor applications are admin-only for viewing
CREATE POLICY "Admin only sponsor applications access"
ON sponsor_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Strengthen UPDATE policies - admin only
CREATE POLICY "Admin only venue updates"
ON venue_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Admin only sponsor updates"
ON sponsor_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Create indexes for better security query performance
CREATE INDEX IF NOT EXISTS idx_venue_app_email_time 
ON venue_applications(email, created_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_app_email_time 
ON sponsor_applications(email, created_at);

-- Create audit log table for tracking sensitive data access
CREATE TABLE IF NOT EXISTS public.application_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  ip_address inet,
  created_at timestamp with time zone DEFAULT NOW()
);

ALTER TABLE public.application_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin audit access"
ON public.application_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);