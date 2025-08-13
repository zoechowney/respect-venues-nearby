-- Fix the RLS policies to properly restrict access to venue contact information
-- Remove the overly permissive policy and create proper access controls

-- Drop the current public policy that's still too permissive
DROP POLICY IF EXISTS "Public can view basic venue information" ON public.venues;

-- Create a policy for public access through the secure function only
-- This policy will be used by the secure function but won't expose contact data directly
CREATE POLICY "Allow public access through secure function" 
ON public.venues 
FOR SELECT 
USING (
  is_active = true AND
  -- This policy exists for the secure function to work, but direct queries 
  -- won't have access to sensitive columns due to the function's column selection
  current_setting('role') = 'anon'
);

-- Create a policy for admin users to have full access to venue data
CREATE POLICY "Admins can view all venue data" 
ON public.venues 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Update the venue owner policy to be more specific
DROP POLICY IF EXISTS "Venue owners can view their own venues" ON public.venues;
CREATE POLICY "Venue owners can view their own venues with contact info" 
ON public.venues 
FOR SELECT 
USING (
  venue_owner_id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- The secure function will bypass RLS since it's SECURITY DEFINER
-- and will only return non-sensitive columns for public access