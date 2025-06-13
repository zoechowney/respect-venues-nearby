
-- Create venue_owners table for venue owner authentication
CREATE TABLE public.venue_owners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.venue_owners ENABLE ROW LEVEL SECURITY;

-- Add venue_owner_id to venue_applications table
ALTER TABLE public.venue_applications 
ADD COLUMN venue_owner_id UUID REFERENCES venue_owners(id);

-- Add venue_owner_id to venues table
ALTER TABLE public.venues 
ADD COLUMN venue_owner_id UUID REFERENCES venue_owners(id);

-- Add pending_changes table to track venue updates awaiting approval
CREATE TABLE public.venue_pending_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  venue_owner_id UUID NOT NULL REFERENCES venue_owners(id),
  business_name TEXT,
  business_type TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  sign_style TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for venue_pending_changes
ALTER TABLE public.venue_pending_changes ENABLE ROW LEVEL SECURITY;

-- Policies for venue_owners
CREATE POLICY "Venue owners can view their own profile" 
  ON public.venue_owners 
  FOR SELECT 
  USING (id = current_setting('app.current_venue_owner_id', true)::uuid);

CREATE POLICY "Venue owners can update their own profile" 
  ON public.venue_owners 
  FOR UPDATE 
  USING (id = current_setting('app.current_venue_owner_id', true)::uuid);

-- Policies for venue_pending_changes
CREATE POLICY "Venue owners can view their own pending changes" 
  ON public.venue_pending_changes 
  FOR SELECT 
  USING (venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid);

CREATE POLICY "Venue owners can create pending changes for their venues" 
  ON public.venue_pending_changes 
  FOR INSERT 
  WITH CHECK (venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid);

CREATE POLICY "Admins can view all pending changes" 
  ON public.venue_pending_changes 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Update venues policies to allow venue owners to view their own venues
CREATE POLICY "Venue owners can view their own venues" 
  ON public.venues 
  FOR SELECT 
  USING (venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid);

-- Create indexes
CREATE INDEX idx_venue_owners_email ON public.venue_owners(email);
CREATE INDEX idx_venue_pending_changes_venue_id ON public.venue_pending_changes(venue_id);
CREATE INDEX idx_venue_pending_changes_status ON public.venue_pending_changes(status);
