import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch';
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
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    query: '',
    location: null,
    distance: 25,
    businessTypes: [],
    features: []
  });

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    // Don't auto-search, just update the local state
  };

  const handleSearch = () => {
    onSearch(currentFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Search & Filters</DialogTitle>
        </DialogHeader>
        <AdvancedSearch
          onFiltersChange={handleFiltersChange}
        />
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSearch} className="bg-trans-blue hover:bg-trans-blue/90 text-white">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearchModal;