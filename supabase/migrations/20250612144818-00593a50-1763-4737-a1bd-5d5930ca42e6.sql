
-- First, let's check if there are any conflicting policies and clean them up
-- Drop any existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Allow anyone to submit applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Public can view approved venues" ON public.venue_applications;

-- Now create the correct policies
-- Allow anyone to view approved venues (including unauthenticated users)
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
