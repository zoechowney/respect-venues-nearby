
-- Create a table for venue reviews
CREATE TABLE public.venue_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.venue_reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view reviews (public access)
CREATE POLICY "Anyone can view venue reviews" 
  ON public.venue_reviews 
  FOR SELECT 
  USING (true);

-- Create policy to allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON public.venue_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.venue_reviews 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.venue_reviews 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_venue_reviews_venue_id ON public.venue_reviews(venue_id);
CREATE INDEX idx_venue_reviews_user_id ON public.venue_reviews(user_id);
CREATE INDEX idx_venue_reviews_rating ON public.venue_reviews(rating);

-- Create a function to update venue ratings automatically
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the venue's average rating and review count
  UPDATE venues 
  SET 
    rating = (
      SELECT ROUND(AVG(rating::numeric), 1) 
      FROM venue_reviews 
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM venue_reviews 
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update venue ratings
CREATE TRIGGER update_venue_rating_on_insert
  AFTER INSERT ON venue_reviews
  FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

CREATE TRIGGER update_venue_rating_on_update
  AFTER UPDATE ON venue_reviews
  FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

CREATE TRIGGER update_venue_rating_on_delete
  AFTER DELETE ON venue_reviews
  FOR EACH ROW EXECUTE FUNCTION update_venue_rating();
