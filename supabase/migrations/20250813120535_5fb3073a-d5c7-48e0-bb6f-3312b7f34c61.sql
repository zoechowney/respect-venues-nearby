-- CRITICAL SECURITY FIX: Secure venues table modification permissions
-- Remove overly permissive policies and create proper access controls

-- Drop the dangerous policies that allow any authenticated user to modify venues
DROP POLICY IF EXISTS "Authenticated users can delete venues" ON public.venues;
DROP POLICY IF EXISTS "Authenticated users can insert venues" ON public.venues;
DROP POLICY IF EXISTS "Authenticated users can update venues" ON public.venues;
DROP POLICY IF EXISTS "Authenticated users can view all venues" ON public.venues;

-- Keep the existing secure policies:
-- - "Admins can view all venue data" (already exists and is secure)
-- - "Venue owners can view their own venues with contact info" (already exists and is secure)

-- Create new secure modification policies

-- Policy 1: Only admins can insert new venues (from approved applications)
CREATE POLICY "Admins can insert venues" 
ON public.venues 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Policy 2: Only admins can update any venue data
CREATE POLICY "Admins can update venues" 
ON public.venues 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Policy 3: Venue owners can update their own venues only
CREATE POLICY "Venue owners can update their own venues" 
ON public.venues 
FOR UPDATE 
USING (
  venue_owner_id IS NOT NULL 
  AND venue_owner_id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- Policy 4: Only admins can delete venues (soft delete preferred)
CREATE POLICY "Admins can delete venues" 
ON public.venues 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- The venues table is now properly secured:
-- 1. Public access only through secure get_public_venues() function
-- 2. Venue owners can only update their own venues
-- 3. Admins have full management access
-- 4. No unauthorized modifications possible