
-- Create a table for venue owner replies to reviews
CREATE TABLE public.review_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES venue_reviews(id) ON DELETE CASCADE,
  venue_owner_id UUID NOT NULL REFERENCES venue_owners(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view replies (public access like reviews)
CREATE POLICY "Anyone can view review replies" 
  ON public.review_replies 
  FOR SELECT 
  USING (true);

-- Create policy to allow venue owners to create replies for their venues
CREATE POLICY "Venue owners can create replies for their venues" 
  ON public.review_replies 
  FOR INSERT 
  WITH CHECK (
    venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid
    AND EXISTS (
      SELECT 1 FROM venues v
      JOIN venue_reviews vr ON v.id = vr.venue_id
      WHERE vr.id = review_id 
        AND v.venue_owner_id = venue_owner_id
        AND vr.is_approved = true
    )
  );

-- Create policy to allow venue owners to update their own replies
CREATE POLICY "Venue owners can update their own replies" 
  ON public.review_replies 
  FOR UPDATE 
  USING (venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid);

-- Create policy to allow venue owners to delete their own replies
CREATE POLICY "Venue owners can delete their own replies" 
  ON public.review_replies 
  FOR DELETE 
  USING (venue_owner_id = current_setting('app.current_venue_owner_id', true)::uuid);

-- Create policy for admins to view all replies
CREATE POLICY "Admins can view all review replies" 
  ON public.review_replies 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_review_replies_review_id ON public.review_replies(review_id);
CREATE INDEX idx_review_replies_venue_owner_id ON public.review_replies(venue_owner_id);

-- Ensure only one reply per review per venue owner
ALTER TABLE public.review_replies 
ADD CONSTRAINT unique_reply_per_review_owner 
UNIQUE (review_id, venue_owner_id);
