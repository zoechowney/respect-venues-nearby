
-- Enable Row Level Security on the venue_applications table
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all venue applications (for admin purposes)
CREATE POLICY "Allow authenticated users to view applications" 
  ON public.venue_applications 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to update application status (for admin purposes)
CREATE POLICY "Allow authenticated users to update applications" 
  ON public.venue_applications 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Allow anyone to insert new applications (for public venue registration)
CREATE POLICY "Allow anyone to submit applications" 
  ON public.venue_applications 
  FOR INSERT 
  WITH CHECK (true);
