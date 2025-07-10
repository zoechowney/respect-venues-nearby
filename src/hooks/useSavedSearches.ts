import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SearchFilters } from '@/components/AdvancedSearch';

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
  user_id: string;
}

export const useSavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved searches
  const loadSavedSearches = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setSavedSearches(data.map(item => ({
          ...item,
          filters: JSON.parse(item.filters as string) as SearchFilters
        })));
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new search
  const saveSearch = async (name: string, filters: SearchFilters): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to save searches');
      }

      const { error } = await supabase
        .from('saved_searches')
        .insert({
          name,
          filters: JSON.stringify(filters),
          user_id: user.id
        });

      if (error) throw error;

      await loadSavedSearches(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error saving search:', error);
      return false;
    }
  };

  // Delete a saved search
  const deleteSearch = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSavedSearches(prev => prev.filter(search => search.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting search:', error);
      return false;
    }
  };

  // Update an existing search
  const updateSearch = async (id: string, name: string, filters: SearchFilters): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({
          name,
          filters: JSON.stringify(filters),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await loadSavedSearches(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating search:', error);
      return false;
    }
  };

  useEffect(() => {
    loadSavedSearches();
  }, []);

  return {
    savedSearches,
    isLoading,
    saveSearch,
    deleteSearch,
    updateSearch,
    refreshSearches: loadSavedSearches
  };
};