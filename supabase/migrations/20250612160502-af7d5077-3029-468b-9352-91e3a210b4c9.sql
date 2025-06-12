
-- First, let's check and ensure the correct RLS policies are in place
-- Drop any existing policies that might be conflicting
DROP POLICY IF EXISTS "Public can view approved venues" ON public.venue_applications;
DROP POLICY IF EXISTS "Authenticated users can view all applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.venue_applications;

-- Create the correct policies
-- Allow anyone (including unauthenticated users) to view approved venues
CREATE POLICY "Public can view approved venues" 
  ON public.venue_applications 
  FOR SELECT 
  USING (status = 'approved');

-- Allow authenticated users to view all applications (for admin purposes)
CREATE POLICY "Authenticated users can view all applications" 
  ON public.venue_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users to update applications (for admin purposes)  
CREATE POLICY "Authenticated users can update applications" 
  ON public.venue_applications 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Allow anyone to submit new applications
CREATE POLICY "Anyone can submit applications" 
  ON public.venue_applications 
  FOR INSERT 
  WITH CHECK (true);
