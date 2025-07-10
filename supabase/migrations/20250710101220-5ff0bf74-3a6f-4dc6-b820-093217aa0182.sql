-- Create content management system tables

-- Content categories enum
CREATE TYPE public.content_category AS ENUM (
  'page',
  'policy', 
  'resource',
  'announcement',
  'footer',
  'homepage'
);

-- Content status enum  
CREATE TYPE public.content_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Main content table
CREATE TABLE public.content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category content_category NOT NULL DEFAULT 'page',
  status content_status NOT NULL DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Content revisions for version history
CREATE TABLE public.content_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_page_id UUID NOT NULL REFERENCES public.content_pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  revision_number INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Site settings table for global configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for content_pages
CREATE POLICY "Anyone can view published content" 
ON public.content_pages 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can view all content" 
ON public.content_pages 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Admins can manage content" 
ON public.content_pages 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for content_revisions
CREATE POLICY "Admins can manage revisions" 
ON public.content_revisions 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage settings" 
ON public.site_settings 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for performance
CREATE INDEX idx_content_pages_slug ON public.content_pages(slug);
CREATE INDEX idx_content_pages_category ON public.content_pages(category);
CREATE INDEX idx_content_pages_status ON public.content_pages(status);
CREATE INDEX idx_content_pages_published_at ON public.content_pages(published_at);
CREATE INDEX idx_content_revisions_content_page_id ON public.content_revisions(content_page_id);
CREATE INDEX idx_site_settings_key ON public.site_settings(key);
CREATE INDEX idx_site_settings_category ON public.site_settings(category);

-- Trigger for updating updated_at
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON public.content_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create content revision
CREATE OR REPLACE FUNCTION public.create_content_revision()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create revision if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content OR 
     OLD.title IS DISTINCT FROM NEW.title OR 
     OLD.excerpt IS DISTINCT FROM NEW.excerpt THEN
    
    INSERT INTO public.content_revisions (
      content_page_id,
      title,
      content,
      excerpt,
      revision_number,
      created_by
    ) VALUES (
      NEW.id,
      OLD.title,
      OLD.content,
      OLD.excerpt,
      COALESCE((
        SELECT MAX(revision_number) + 1 
        FROM public.content_revisions 
        WHERE content_page_id = NEW.id
      ), 1),
      auth.uid()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for content revisions
CREATE TRIGGER create_content_revision_trigger
  BEFORE UPDATE ON public.content_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_content_revision();

-- Insert default content and settings
INSERT INTO public.content_pages (slug, title, content, category, status, published_at) VALUES
('privacy-policy', 'Privacy Policy', 'This privacy policy will be updated by admins.', 'policy', 'published', now()),
('terms-of-service', 'Terms of Service', 'These terms will be updated by admins.', 'policy', 'published', now()),
('code-of-conduct', 'Code of Conduct', 'Our code of conduct will be managed here.', 'policy', 'published', now()),
('cookie-policy', 'Cookie Policy', 'Cookie policy content managed by admins.', 'policy', 'published', now()),
('data-rights', 'Data Rights', 'Data rights information managed by admins.', 'policy', 'published', now()),
('resources', 'Resources', 'Resources content will be managed by admins.', 'resource', 'published', now()),
('homepage-hero', 'Homepage Hero Section', 'Find transgender-friendly venues and help create inclusive spaces for everyone.', 'homepage', 'published', now()),
('about-section', 'About Section', 'Rest with Respect helps you discover and share transgender-friendly venues, creating a network of safe and inclusive spaces.', 'homepage', 'published', now());

INSERT INTO public.site_settings (key, value, description, category) VALUES
('site_name', 'Rest with Respect', 'The name of the website', 'general'),
('site_description', 'Find transgender-friendly venues and help create inclusive spaces for everyone', 'Default site description for SEO', 'seo'),
('contact_email', 'hello@restwithrespect.org', 'Main contact email address', 'contact'),
('social_twitter', '@restwithrespect', 'Twitter handle', 'social'),
('maintenance_mode', 'false', 'Enable/disable maintenance mode', 'system'),
('max_venues_per_user', '10', 'Maximum venues a user can submit', 'limits'),
('review_moderation', 'true', 'Enable review moderation', 'moderation'),
('auto_approve_venues', 'false', 'Automatically approve venue applications', 'moderation');