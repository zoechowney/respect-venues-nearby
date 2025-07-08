import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SponsorApplication {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useSponsorApplications = () => {
  return useQuery({
    queryKey: ['sponsor-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sponsor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as SponsorApplication[];
    },
  });
};

export const useUpdateSponsorApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('sponsor_applications')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsor-applications'] });
    },
  });
};