
-- Allow public read access to approved venue applications
-- This enables unauthenticated users to view the directory and map
CREATE POLICY "Public can view approved venues" 
  ON public.venue_applications 
  FOR SELECT 
  USING (status = 'approved');
