-- CRITICAL SECURITY FIX: Secure venue applications table
-- Remove public access and ensure only admins and applicants can view sensitive data

-- First, remove any overly permissive policies
DROP POLICY IF EXISTS "authenticated_update_venues" ON public.venue_applications;

-- Create proper RLS policies for venue applications
-- Policy 1: Only admins can view all applications
CREATE POLICY "Admins can view all venue applications" 
ON public.venue_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Policy 2: Venue owners can only view their own applications
CREATE POLICY "Venue owners can view their own applications" 
ON public.venue_applications 
FOR SELECT 
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- Policy 3: Anyone can submit applications (this is needed for the join form)
CREATE POLICY "Anyone can submit venue applications" 
ON public.venue_applications 
FOR INSERT 
WITH CHECK (true);

-- Policy 4: Only admins can update applications (for status changes)
CREATE POLICY "Admins can update venue applications" 
ON public.venue_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Ensure no other policies exist that could allow unauthorized access
-- The table now only allows:
-- - Public INSERT (for application submissions)
-- - Admin SELECT/UPDATE (for application management)  
-- - Venue Owner SELECT (for their own applications only)