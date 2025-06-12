
-- First, let's check for any triggers that might be causing issues
-- and remove any problematic database objects

-- Check if there are any triggers on venue_applications that might access users table
DROP TRIGGER IF EXISTS on_venue_application_insert ON public.venue_applications;
DROP TRIGGER IF EXISTS on_venue_application_update ON public.venue_applications;

-- Drop any functions that might be causing issues
DROP FUNCTION IF EXISTS public.handle_venue_application_insert();
DROP FUNCTION IF EXISTS public.handle_venue_application_update();

-- Now completely reset the RLS policies with a clean slate
ALTER TABLE public.venue_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to ensure clean state
DROP POLICY IF EXISTS "Anyone can submit venue applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Public can view approved venues" ON public.venue_applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.venue_applications;

-- Create the minimal required policies
-- Policy 1: Allow public (unauthenticated) users to view ONLY approved venues
CREATE POLICY "unauthenticated_approved_venues" 
  ON public.venue_applications 
  FOR SELECT 
  TO anon
  USING (status = 'approved');

-- Policy 2: Allow authenticated users to view all venues
CREATE POLICY "authenticated_all_venues" 
  ON public.venue_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Policy 3: Allow anyone to insert new applications
CREATE POLICY "anyone_insert_applications" 
  ON public.venue_applications 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 4: Allow authenticated users to update venues
CREATE POLICY "authenticated_update_venues" 
  ON public.venue_applications 
  FOR UPDATE 
  TO authenticated
  USING (true);
