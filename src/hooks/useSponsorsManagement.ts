import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SponsorManagement {
  id: string;
  company_name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export const useSponsorsManagement = () => {
  return useQuery({
    queryKey: ['sponsors-management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data as SponsorManagement[];
    },
  });
};

export const useCreateSponsor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sponsor: Omit<SponsorManagement, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sponsors')
        .insert(sponsor)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors-management'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
};

export const useUpdateSponsor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SponsorManagement> }) => {
      const { data, error } = await supabase
        .from('sponsors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors-management'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
};

export const useDeleteSponsor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors-management'] });
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
    },
  });
};

export const useUploadSponsorLogo = () => {
  return useMutation({
    mutationFn: async ({ file, sponsorId }: { file: File; sponsorId: string }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sponsorId}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { data, error } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(data.path);

      return publicUrl;
    },
  });
};