-- CRITICAL SECURITY FIX: Secure venue_owners table completely
-- Ensure only venue owners can access their own data and admins can manage all records

-- First, let's examine what policies exist and clean them up
-- Then create comprehensive security policies

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow venue owner registration" ON public.venue_owners;
DROP POLICY IF EXISTS "Venue owners can update their own profile" ON public.venue_owners;
DROP POLICY IF EXISTS "Venue owners can view their own profile" ON public.venue_owners;

-- Create secure policies for venue_owners table

-- Policy 1: Allow venue owner registration (needed for signup)
CREATE POLICY "Allow venue owner registration" 
ON public.venue_owners 
FOR INSERT 
WITH CHECK (true);

-- Policy 2: Venue owners can only view their own profile
CREATE POLICY "Venue owners can view their own profile" 
ON public.venue_owners 
FOR SELECT 
USING (
  id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- Policy 3: Venue owners can only update their own profile
CREATE POLICY "Venue owners can update their own profile" 
ON public.venue_owners 
FOR UPDATE 
USING (
  id = (current_setting('app.current_venue_owner_id'::text, true))::uuid
);

-- Policy 4: Admins can view all venue owner profiles (for management)
CREATE POLICY "Admins can view all venue owners" 
ON public.venue_owners 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Policy 5: Admins can update venue owner profiles (for management)
CREATE POLICY "Admins can update venue owners" 
ON public.venue_owners 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Policy 6: Admins can delete venue owners if needed (soft delete is preferred)
CREATE POLICY "Admins can delete venue owners" 
ON public.venue_owners 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- The venue_owners table is now fully secured:
-- 1. Anyone can register (needed for signup)
-- 2. Venue owners can only access their own data
-- 3. Admins have full management access
-- 4. No public or unauthorized access to passwords/emails