-- Fix security issue: Restrict venue_applications table access
-- Remove overly permissive policies that expose personal data

-- Drop the problematic policies that allow broad access to sensitive application data
DROP POLICY IF EXISTS "authenticated_all_venues" ON public.venue_applications;
DROP POLICY IF EXISTS "unauthenticated_approved_venues" ON public.venue_applications;

-- Keep the secure policies and add admin access
-- Policy for admins to view all applications (for management purposes)
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

-- Policy for admins to update applications (for approval/rejection)
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

-- The existing secure policies remain:
-- 1. "Venue owners can view their own applications directly" - allows venue owners to see only their applications
-- 2. "anyone_insert_applications" - allows submission of new applications (needed for public form)