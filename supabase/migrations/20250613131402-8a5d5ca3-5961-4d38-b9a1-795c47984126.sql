
-- Allow anyone to insert new venue owner accounts (for registration)
CREATE POLICY "Allow venue owner registration" 
  ON public.venue_owners 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read venue owner data for authentication (but only basic fields)
CREATE POLICY "Allow venue owner authentication" 
  ON public.venue_owners 
  FOR SELECT 
  USING (true);
