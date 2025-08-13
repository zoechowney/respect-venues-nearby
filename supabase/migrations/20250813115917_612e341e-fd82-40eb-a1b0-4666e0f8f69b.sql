-- CRITICAL SECURITY FIX: Remove ALL public access to venues table
-- This ensures contact information (email, phone) cannot be accessed by anonymous users
-- Public access will ONLY be available through the secure get_public_venues() function

-- Remove the public access policy that still allows direct table access
DROP POLICY IF EXISTS "Allow public access through secure function" ON public.venues;

-- The venues table should now have NO public access policies
-- Only authenticated users (admins, venue owners) can access it directly
-- Public users can only get venue data through the secure function which excludes contact info

-- Verify current policies (these should remain):
-- 1. "Admins can view all venue data" - for authenticated admin users
-- 2. "Venue owners can view their own venues with contact info" - for authenticated venue owners  
-- 3. "Authenticated users can insert/update/delete venues" - for authenticated operations

-- The get_public_venues() function uses SECURITY DEFINER to bypass RLS
-- and only returns business information WITHOUT contact details