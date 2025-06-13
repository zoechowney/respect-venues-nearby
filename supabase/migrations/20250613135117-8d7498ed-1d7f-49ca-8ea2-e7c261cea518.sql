
-- Add approval status and admin fields to venue_reviews table
ALTER TABLE public.venue_reviews 
ADD COLUMN is_approved BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN approved_by UUID REFERENCES auth.users(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;

-- Update the public viewing policy to only show approved reviews
DROP POLICY "Anyone can view venue reviews" ON public.venue_reviews;

CREATE POLICY "Anyone can view approved venue reviews" 
  ON public.venue_reviews 
  FOR SELECT 
  USING (is_approved = true);

-- Create policy for admins to view all reviews (approved and pending)
CREATE POLICY "Admins can view all venue reviews" 
  ON public.venue_reviews 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for admins to update reviews (for approval/rejection)
CREATE POLICY "Admins can update venue reviews" 
  ON public.venue_reviews 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for admins to delete reviews
CREATE POLICY "Admins can delete venue reviews" 
  ON public.venue_reviews 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Update the rating calculation function to only count approved reviews
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the venue's average rating and review count (only approved reviews)
  UPDATE venues 
  SET 
    rating = (
      SELECT ROUND(AVG(rating::numeric), 1) 
      FROM venue_reviews 
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id) 
        AND is_approved = true
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM venue_reviews 
      WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id) 
        AND is_approved = true
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
