-- CRITICAL SECURITY FIX: Clean up and secure venue applications table
-- Remove all existing policies and create proper ones

-- Drop all existing policies on venue_applications table
DROP POLICY IF EXISTS "Admins can update venue applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Admins can view all venue applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Venue owners can view their own applications directly" ON public.venue_applications;
DROP POLICY IF EXISTS "anyone_insert_applications" ON public.venue_applications;
DROP POLICY IF EXISTS "authenticated_update_venues" ON public.venue_applications;

-- Create new secure policies
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

-- Policy 2: Venue owners can only view their own applications when authenticated
CREATE POLICY "Venue owners can view their own applications" 
ON public.venue_applications 
FOR SELECT 
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- Policy 3: Anyone can submit applications (needed for the public join form)
CREATE POLICY "Anyone can submit venue applications" 
ON public.venue_applications 
FOR INSERT 
WITH CHECK (true);

-- Policy 4: Only admins can update applications (for approval/rejection)
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

-- No DELETE policy - applications should be preserved for audit purposes