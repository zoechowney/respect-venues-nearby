-- Fix security issue: Remove public access to venue owner credentials
-- The "Allow venue owner authentication" policy with expression 'true' exposes all venue owner data

-- Drop the dangerous policy that allows anyone to read all venue owner data
DROP POLICY IF EXISTS "Allow venue owner authentication" ON public.venue_owners;

-- Create a secure authentication function that doesn't expose sensitive data
CREATE OR REPLACE FUNCTION public.authenticate_venue_owner(input_email text, input_password_hash text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  owner_id uuid;
BEGIN
  -- Verify credentials and return owner ID if valid
  SELECT id INTO owner_id
  FROM public.venue_owners
  WHERE email = input_email 
    AND password_hash = input_password_hash
    AND is_active = true;
  
  RETURN owner_id;
END;
$$;

-- Create a function to get venue owner by email for auth purposes (without exposing password)
CREATE OR REPLACE FUNCTION public.get_venue_owner_by_email(input_email text)
RETURNS TABLE(id uuid, email text, business_name text, contact_name text, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT vo.id, vo.email, vo.business_name, vo.contact_name, vo.is_active
  FROM public.venue_owners vo
  WHERE vo.email = input_email AND vo.is_active = true;
END;
$$;

-- The existing secure policies remain:
-- 1. "Allow venue owner registration" - allows new registrations
-- 2. "Venue owners can update their own profile" - owners can update only their data  
-- 3. "Venue owners can view their own profile" - owners can view only their data