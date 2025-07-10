import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { Coordinates } from '@/lib/geolocation';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
  userLocation: Coordinates | null;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  userLocation
}) => {
  const { savedSearches, saveSearch, deleteSearch } = useSavedSearches();

  const handleFiltersChange = (filters: SearchFilters) => {
    onSearch(filters);
  };

  const handleLoadSearch = (filters: SearchFilters) => {
    onSearch(filters);
    onClose();
  };

  const handleSaveSearch = async (name: string, filters: SearchFilters) => {
    await saveSearch(name, filters);
  };

  const handleDeleteSearch = async (id: string) => {
    await deleteSearch(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search & Filters</DialogTitle>
        </DialogHeader>
        <AdvancedSearch
          onFiltersChange={handleFiltersChange}
          savedSearches={savedSearches}
          onSaveSearch={handleSaveSearch}
          onLoadSearch={handleLoadSearch}
          onDeleteSearch={handleDeleteSearch}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;