-- Add missing features column to venue_applications table
ALTER TABLE public.venue_applications 
ADD COLUMN features text[] DEFAULT ARRAY['Transgender Friendly'::text, 'Staff Trained'::text, 'Safe Space'::text];