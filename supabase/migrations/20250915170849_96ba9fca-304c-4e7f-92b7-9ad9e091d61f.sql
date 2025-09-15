-- Enhanced Security for Application Tables with Personal Data Protection (Fixed)
-- This migration tightens RLS policies and adds security measures to protect personal data

-- First, let's create a function to check if a user has made recent submissions (rate limiting)
CREATE OR REPLACE FUNCTION public.check_application_rate_limit(table_name text, user_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Check submissions from the same IP/identifier in the last hour
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

-- Create audit log table for tracking changes to sensitive application data
CREATE TABLE IF NOT EXISTS public.application_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  created_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.application_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.application_audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Drop existing overly permissive INSERT policies
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Anyone can submit sponsor applications" ON sponsor_applications;

-- Create new, more secure INSERT policies with rate limiting and validation
CREATE POLICY "Rate-limited venue application submission"
ON venue_applications
FOR INSERT
WITH CHECK (
  -- Allow submission only if rate limit check passes
  public.check_application_rate_limit('venue_applications', email)
  AND 
  -- Ensure email format is valid
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Ensure required fields are not empty
  business_name IS NOT NULL AND trim(business_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  AND address IS NOT NULL AND trim(address) != ''
);

CREATE POLICY "Rate-limited sponsor application submission"
ON sponsor_applications
FOR INSERT
WITH CHECK (
  -- Allow submission only if rate limit check passes
  public.check_application_rate_limit('sponsor_applications', email)
  AND 
  -- Ensure email format is valid
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Ensure required fields are not empty
  company_name IS NOT NULL AND trim(company_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
);

-- Strengthen SELECT policies - replace broad "anyone" policies with strict restrictions
DROP POLICY IF EXISTS "Deny unauthorized access to venue applications" ON venue_applications;

CREATE POLICY "Strict admin access to venue applications"
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
CREATE POLICY "Venue owners limited access to own applications"
ON venue_applications
FOR SELECT
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id', true))::uuid
);

-- Ensure sponsor applications remain admin-only for SELECT
DROP POLICY IF EXISTS "Admins can view all sponsor applications" ON sponsor_applications;

CREATE POLICY "Strict admin access to sponsor applications"
ON sponsor_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Create function to log sensitive data changes (for INSERT/UPDATE)
CREATE OR REPLACE FUNCTION public.log_application_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log changes to applications containing personal data
  INSERT INTO application_audit_log (
    user_id,
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    ip_address
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(OLD) END,
    CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers for data changes (INSERT/UPDATE/DELETE)
CREATE TRIGGER audit_venue_applications_changes
  AFTER INSERT OR UPDATE OR DELETE ON venue_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_changes();

CREATE TRIGGER audit_sponsor_applications_changes
  AFTER INSERT OR UPDATE OR DELETE ON sponsor_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_changes();

-- Add validation constraints to prevent malicious data injection
ALTER TABLE venue_applications 
ADD CONSTRAINT IF NOT EXISTS check_email_length CHECK (char_length(email) <= 254),
ADD CONSTRAINT IF NOT EXISTS check_phone_format CHECK (phone IS NULL OR phone ~* '^[\+]?[0-9\s\-\(\)\.]{7,20}$'),
ADD CONSTRAINT IF NOT EXISTS check_business_name_length CHECK (char_length(business_name) <= 200),
ADD CONSTRAINT IF NOT EXISTS check_contact_name_length CHECK (char_length(contact_name) <= 100);

ALTER TABLE sponsor_applications 
ADD CONSTRAINT IF NOT EXISTS check_sponsor_email_length CHECK (char_length(email) <= 254),
ADD CONSTRAINT IF NOT EXISTS check_sponsor_phone_format CHECK (phone IS NULL OR phone ~* '^[\+]?[0-9\s\-\(\)\.]{7,20}$'),
ADD CONSTRAINT IF NOT EXISTS check_company_name_length CHECK (char_length(company_name) <= 200),
ADD CONSTRAINT IF NOT EXISTS check_sponsor_contact_name_length CHECK (char_length(contact_name) <= 100);

-- Create indexes for better performance on security-related queries
CREATE INDEX IF NOT EXISTS idx_venue_applications_email_created 
ON venue_applications(email, created_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_applications_email_created 
ON sponsor_applications(email, created_at);

-- Strengthen UPDATE policies to ensure only admins can modify applications
DROP POLICY IF EXISTS "Admins can update venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Admins can update sponsor applications" ON sponsor_applications;

CREATE POLICY "Strict admin update venue applications"
ON venue_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Strict admin update sponsor applications"
ON sponsor_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);