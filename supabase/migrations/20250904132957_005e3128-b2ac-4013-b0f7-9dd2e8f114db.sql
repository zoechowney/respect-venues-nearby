-- SECURITY FIX: Restrict access to venue_applications table
-- This fixes the issue where business application data could be stolen by competitors

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Venue owners can view their own applications" ON public.venue_applications;

-- Create secure policies that properly restrict access

-- 1. Allow authenticated users to submit applications (but not anonymous)
CREATE POLICY "Authenticated users can submit venue applications" 
ON public.venue_applications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- 2. Allow anonymous venue registration (public form submissions)
-- This is needed for the public venue registration form
CREATE POLICY "Public venue registration allowed" 
ON public.venue_applications 
FOR INSERT 
TO anon
WITH CHECK (
  -- Only allow basic application submission, no sensitive data exposure
  venue_owner_id IS NULL -- Ensures public submissions don't claim ownership
);

-- 3. Venue owners can ONLY view their own applications when properly authenticated
CREATE POLICY "Venue owners can view their own applications" 
ON public.venue_applications 
FOR SELECT 
TO authenticated
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id'::text, false))::uuid
);

-- 4. Ensure no public read access by default
-- (The existing admin policy is fine and remains unchanged)

-- Add audit logging trigger for security monitoring
CREATE OR REPLACE FUNCTION public.audit_venue_application_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when applications are accessed (for security monitoring)
  INSERT INTO auth.audit_log_entries (
    instance_id,
    id,
    payload,
    created_at,
    ip_address
  ) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    gen_random_uuid(),
    json_build_object(
      'table', 'venue_applications',
      'action', TG_OP,
      'application_id', COALESCE(NEW.id, OLD.id),
      'user_id', auth.uid(),
      'timestamp', now()
    ),
    now(),
    inet_client_addr()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger
DROP TRIGGER IF EXISTS audit_venue_applications ON public.venue_applications;
CREATE TRIGGER audit_venue_applications
  AFTER SELECT OR INSERT OR UPDATE OR DELETE 
  ON public.venue_applications
  FOR EACH ROW 
  EXECUTE FUNCTION public.audit_venue_application_access();