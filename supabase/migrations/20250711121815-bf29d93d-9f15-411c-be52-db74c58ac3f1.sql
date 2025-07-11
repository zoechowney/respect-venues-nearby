-- Add a new RLS policy for venue owners to see their own applications
CREATE POLICY "Venue owners can view their own applications directly"
ON public.venue_applications
FOR SELECT
USING (venue_owner_id IS NOT NULL);