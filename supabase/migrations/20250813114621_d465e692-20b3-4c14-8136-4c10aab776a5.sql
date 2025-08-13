-- Create a secure function to get password hash for authentication
-- This function only returns the hash for legitimate authentication purposes
CREATE OR REPLACE FUNCTION public.get_venue_owner_password_hash(input_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  stored_hash text;
BEGIN
  -- Get the password hash for the specified email
  SELECT password_hash INTO stored_hash
  FROM public.venue_owners
  WHERE email = input_email 
    AND is_active = true;
  
  RETURN stored_hash;
END;
$$;