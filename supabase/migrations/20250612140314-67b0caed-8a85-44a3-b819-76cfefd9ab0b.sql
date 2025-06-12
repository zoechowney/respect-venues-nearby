
-- Drop the existing policies first
DROP POLICY IF EXISTS "Allow authenticated users to view applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Allow authenticated users to update applications" ON public.venue_applications;
DROP POLICY IF EXISTS "Allow anyone to submit applications" ON public.venue_applications;

-- Create corrected policies using auth.uid() instead of auth.role()
-- Allow authenticated users to view all venue applications (for admin purposes)
CREATE POLICY "Allow authenticated users to view applications" 
  ON public.venue_applications 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to update application status (for admin purposes)
CREATE POLICY "Allow authenticated users to update applications" 
  ON public.venue_applications 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Allow anyone to insert new applications (for public venue registration)
CREATE POLICY "Allow anyone to submit applications" 
  ON public.venue_applications 
  FOR INSERT 
  WITH CHECK (true);
