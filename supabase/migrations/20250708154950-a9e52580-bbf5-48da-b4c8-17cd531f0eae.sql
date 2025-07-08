
-- Add logo upload field to sponsor applications
ALTER TABLE public.sponsor_applications 
ADD COLUMN logo_url TEXT;

-- Create storage bucket for sponsor logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sponsor-logos', 'sponsor-logos', true);

-- Create storage policies for sponsor logo uploads
CREATE POLICY "Anyone can view sponsor logos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Anyone can upload sponsor logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'sponsor-logos');

CREATE POLICY "Admins can update sponsor logos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'sponsor-logos');

CREATE POLICY "Admins can delete sponsor logos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'sponsor-logos');

-- Add payment status to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN payment_status TEXT DEFAULT 'pending';

-- Create function to auto-create sponsor when application is approved
CREATE OR REPLACE FUNCTION public.create_sponsor_from_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create sponsor if status changed to 'approved' and sponsor doesn't exist yet
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Check if sponsor already exists for this company
    IF NOT EXISTS (
      SELECT 1 FROM public.sponsors 
      WHERE company_name = NEW.company_name
    ) THEN
      INSERT INTO public.sponsors (
        company_name,
        logo_url,
        website_url,
        description,
        display_order,
        is_active,
        payment_status
      ) VALUES (
        NEW.company_name,
        NEW.logo_url,
        NEW.website,
        NEW.message,
        (SELECT COALESCE(MAX(display_order), 0) + 1 FROM public.sponsors),
        false, -- Start inactive until payment confirmed
        'pending'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-creating sponsors
CREATE TRIGGER create_sponsor_on_approval
  AFTER UPDATE ON public.sponsor_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_sponsor_from_application();
