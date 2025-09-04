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

-- 4. Create a restrictive policy to ensure no unauthorized access
CREATE POLICY "Deny unauthorized access to venue applications"
ON public.venue_applications
FOR SELECT
TO anon
USING (false); -- Explicitly deny all anonymous access to SELECT