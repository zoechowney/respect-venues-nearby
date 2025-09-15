-- Security Fix for Application Tables - Simplified Approach
-- This migration focuses on the core security improvements to protect personal data

-- Create rate limiting function for application submissions
CREATE OR REPLACE FUNCTION public.check_application_rate_limit(table_name text, user_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
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

-- Create audit log table for tracking access to sensitive data
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

-- Replace overly permissive policies with secure, rate-limited ones
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Anyone can submit sponsor applications" ON sponsor_applications;

-- Secure INSERT policy for venue applications with rate limiting
CREATE POLICY "Secure venue application submission"
ON venue_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting check
  public.check_application_rate_limit('venue_applications', email)
  AND 
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required fields validation
  business_name IS NOT NULL AND trim(business_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
  AND address IS NOT NULL AND trim(address) != ''
);

-- Secure INSERT policy for sponsor applications with rate limiting  
CREATE POLICY "Secure sponsor application submission"
ON sponsor_applications
FOR INSERT
WITH CHECK (
  -- Rate limiting check
  public.check_application_rate_limit('sponsor_applications', email)
  AND 
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND
  -- Required fields validation
  company_name IS NOT NULL AND trim(company_name) != ''
  AND contact_name IS NOT NULL AND trim(contact_name) != ''
);

-- Tighten SELECT policies to protect personal data
DROP POLICY IF EXISTS "Deny unauthorized access to venue applications" ON venue_applications;

-- Only admins can view venue applications 
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

-- Venue owners can view their own applications
CREATE POLICY "Venue owners own applications only"
ON venue_applications
FOR SELECT
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id', true))::uuid
);

-- Ensure sponsor applications are admin-only for viewing
DROP POLICY IF EXISTS "Admins can view all sponsor applications" ON sponsor_applications;

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
DROP POLICY IF EXISTS "Admins can update venue applications" ON venue_applications;
DROP POLICY IF EXISTS "Admins can update sponsor applications" ON sponsor_applications;

CREATE POLICY "Admin only venue applications update"
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

CREATE POLICY "Admin only sponsor applications update"
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

-- Create audit function for logging sensitive data access
CREATE OR REPLACE FUNCTION public.log_application_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log all changes to application data
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
    CASE WHEN OLD IS NOT NULL THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN NEW IS NOT NULL THEN to_jsonb(NEW) ELSE NULL END,
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Add audit triggers
DROP TRIGGER IF EXISTS audit_venue_applications_changes ON venue_applications;
DROP TRIGGER IF EXISTS audit_sponsor_applications_changes ON sponsor_applications;

CREATE TRIGGER audit_venue_applications_changes
  AFTER INSERT OR UPDATE OR DELETE ON venue_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_changes();

CREATE TRIGGER audit_sponsor_applications_changes
  AFTER INSERT OR UPDATE OR DELETE ON sponsor_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_changes();

-- Create performance indexes for security queries
CREATE INDEX IF NOT EXISTS idx_venue_applications_email_time 
ON venue_applications(email, created_at);

CREATE INDEX IF NOT EXISTS idx_sponsor_applications_email_time 
ON sponsor_applications(email, created_at);