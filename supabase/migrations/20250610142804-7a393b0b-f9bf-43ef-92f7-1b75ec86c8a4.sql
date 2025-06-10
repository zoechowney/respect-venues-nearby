
-- Create a table to store venue applications
CREATE TABLE public.venue_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT NOT NULL,
  website TEXT,
  description TEXT,
  sign_style TEXT,
  agree_to_terms BOOLEAN NOT NULL DEFAULT false,
  agree_to_training BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.venue_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications (for public signup)
CREATE POLICY "Anyone can submit venue applications" 
  ON public.venue_applications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to view their own applications (if they're logged in)
CREATE POLICY "Users can view their own applications" 
  ON public.venue_applications 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create an index on email for better performance
CREATE INDEX idx_venue_applications_email ON public.venue_applications(email);
CREATE INDEX idx_venue_applications_status ON public.venue_applications(status);
