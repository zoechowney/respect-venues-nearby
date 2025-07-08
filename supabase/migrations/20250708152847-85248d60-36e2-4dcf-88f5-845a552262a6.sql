-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a table for sponsor applications
CREATE TABLE public.sponsor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sponsor_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for sponsor applications
-- Allow anyone to submit applications
CREATE POLICY "Anyone can submit sponsor applications" 
ON public.sponsor_applications 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view all sponsor applications" 
ON public.sponsor_applications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Only admins can update applications
CREATE POLICY "Admins can update sponsor applications" 
ON public.sponsor_applications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create trigger for sponsor applications
CREATE TRIGGER update_sponsor_applications_updated_at
BEFORE UPDATE ON public.sponsor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create a table for approved sponsors to display on the page
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for sponsors
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active sponsors
CREATE POLICY "Anyone can view active sponsors" 
ON public.sponsors 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage sponsors
CREATE POLICY "Admins can manage sponsors" 
ON public.sponsors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create trigger for sponsors updated_at
CREATE TRIGGER update_sponsors_updated_at
BEFORE UPDATE ON public.sponsors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();