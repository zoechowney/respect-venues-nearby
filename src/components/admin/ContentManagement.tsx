import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Site Settings Hooks
const useSiteSettings = () => {
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

const useUpdateSiteSetting = () => {
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

const ContentManagement = () => {
  const { data: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-brand-navy/70">Loading site settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-navy">Site Settings</h2>
      </div>

      {siteSettings && (
        <div className="grid gap-6">
          {Object.entries(
            siteSettings.reduce((acc, setting) => {
              acc[setting.category] = acc[setting.category] || [];
              acc[setting.category].push(setting);
              return acc;
            }, {} as Record<string, SiteSetting[]>)
          ).map(([category, settings]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category} Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-3 gap-4 items-center">
                    <div>
                      <Label className="font-medium">{setting.key.replace(/_/g, ' ')}</Label>
                      {setting.description && (
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      )}
                    </div>
                    <div>
                      <Input
                        value={setting.value}
                        onChange={(e) => {
                          updateSetting.mutate({
                            key: setting.key,
                            value: e.target.value
                          });
                        }}
                        disabled={updateSetting.isPending}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      Updated {formatDistanceToNow(new Date(setting.updated_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManagement;