
-- Create a dedicated venues table for live, published venues
CREATE TABLE public.venues (
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
  -- Additional venue-specific fields
  rating DECIMAL(2,1) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT ARRAY['Transgender Friendly', 'Staff Trained', 'Safe Space'],
  hours TEXT,
  is_active BOOLEAN DEFAULT true,
  -- Metadata
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_from_application_id UUID REFERENCES venue_applications(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view active venues (for public map/directory)
CREATE POLICY "Anyone can view active venues" 
  ON public.venues 
  FOR SELECT 
  USING (is_active = true);

-- Create policy to allow authenticated users to view all venues (for admin)
CREATE POLICY "Authenticated users can view all venues" 
  ON public.venues 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update venues (for admin)
CREATE POLICY "Authenticated users can update venues" 
  ON public.venues 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert venues (for admin approval workflow)
CREATE POLICY "Authenticated users can insert venues" 
  ON public.venues 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete venues (for admin)
CREATE POLICY "Authenticated users can delete venues" 
  ON public.venues 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_venues_business_type ON public.venues(business_type);
CREATE INDEX idx_venues_is_active ON public.venues(is_active);
CREATE INDEX idx_venues_published_at ON public.venues(published_at);
