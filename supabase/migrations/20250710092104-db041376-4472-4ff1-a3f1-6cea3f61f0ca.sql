-- Create saved_searches table for storing user search preferences
CREATE TABLE public.saved_searches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  filters jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- Create policies for saved searches
CREATE POLICY "Users can view their own saved searches"
ON public.saved_searches
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches"
ON public.saved_searches
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches"
ON public.saved_searches
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
ON public.saved_searches
FOR DELETE
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_saved_searches_updated_at
BEFORE UPDATE ON public.saved_searches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add venue coordinates column for location-based search
ALTER TABLE public.venues 
ADD COLUMN latitude decimal(10,8),
ADD COLUMN longitude decimal(11,8);

-- Create index for geospatial queries
CREATE INDEX idx_venues_coordinates ON public.venues (latitude, longitude);

-- Add index to saved_searches for faster queries
CREATE INDEX idx_saved_searches_user_id ON public.saved_searches (user_id);
CREATE INDEX idx_saved_searches_created_at ON public.saved_searches (created_at DESC);