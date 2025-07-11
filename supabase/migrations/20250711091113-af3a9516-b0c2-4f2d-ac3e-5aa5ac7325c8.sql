-- Remove artificial default rating for venues
ALTER TABLE public.venues 
ALTER COLUMN rating DROP DEFAULT;

-- Set existing venues with default 4.8 rating and 0 reviews back to NULL
UPDATE public.venues 
SET rating = NULL, reviews_count = NULL 
WHERE rating = 4.8 AND reviews_count = 0;