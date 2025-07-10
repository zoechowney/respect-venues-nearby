import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  category: 'page' | 'policy' | 'resource' | 'announcement' | 'footer' | 'homepage';
  status: 'draft' | 'published' | 'archived';
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  author_id?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentRevision {
  id: string;
  content_page_id: string;
  title: string;
  content: string;
  excerpt?: string;
  revision_number: number;
  created_by?: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Content Pages Hooks
export const useContentPages = () => {
  return useQuery({
    queryKey: ['content-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContentPage[];
    },
  });
};

export const useContentPage = (slug: string) => {
  return useQuery({
    queryKey: ['content-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as ContentPage | null;
    },
    enabled: !!slug,
  });
};

export const useContentPageById = (id: string) => {
  return useQuery({
    queryKey: ['content-page-by-id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ContentPage;
    },
    enabled: !!id,
  });
};

export const useCreateContentPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contentData: Omit<ContentPage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('content_pages')
        .insert([contentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
      toast({
        title: 'Content Created',
        description: 'Content page created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create content page.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateContentPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContentPage> }) => {
      const { data, error } = await supabase
        .from('content_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
      queryClient.invalidateQueries({ queryKey: ['content-page', data.slug] });
      queryClient.invalidateQueries({ queryKey: ['content-page-by-id', data.id] });
      toast({
        title: 'Content Updated',
        description: 'Content page updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update content page.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteContentPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-pages'] });
      toast({
        title: 'Content Deleted',
        description: 'Content page deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete content page.',
        variant: 'destructive',
      });
    },
  });
};

// Content Revisions Hooks
export const useContentRevisions = (contentPageId: string) => {
  return useQuery({
    queryKey: ['content-revisions', contentPageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_revisions')
        .select('*')
        .eq('content_page_id', contentPageId)
        .order('revision_number', { ascending: false });

      if (error) throw error;
      return data as ContentRevision[];
    },
    enabled: !!contentPageId,
  });
};

// Site Settings Hooks
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data as SiteSetting[];
    },
  });
};

export const useSiteSetting = (key: string) => {
  return useQuery({
    queryKey: ['site-setting', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as SiteSetting | null;
    },
    enabled: !!key,
  });
};

export const useUpdateSiteSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-setting', data.key] });
      toast({
        title: 'Setting Updated',
        description: 'Site setting updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update site setting.',
        variant: 'destructive',
      });
    },
  });
};