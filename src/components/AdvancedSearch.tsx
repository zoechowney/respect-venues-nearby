import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Filter, Bookmark, X, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  getCurrentLocation, 
  geocodeAddress, 
  getPopularCities, 
  calculateDistance,
  type Coordinates,
  type LocationResult 
} from '@/lib/geolocation';
import { supabase } from '@/integrations/supabase/client';
import { useToastNotifications } from '@/hooks/useToastNotifications';
import LoadingSpinner from './LoadingSpinner';

export interface SearchFilters {
  query: string;
  location: LocationResult | null;
  distance: number; // in km
  businessTypes: string[];
  features: string[];
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onFiltersChange
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: null,
    distance: 25,
    businessTypes: [],
    features: []
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationResult[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  const { showError, showSuccess } = useToastNotifications();

  // Prevent auto-focus on mobile
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const businessTypes = [
    'Pub / bar', 'Restaurant / café', 'Shop / retail', 
    'Gym / fitness', 'Cinema / theatre', 'Office / workplace', 'Other'
  ];

  const venueFeatures = [
    'Gender Neutral Toilets', 'LGBTQ+ Events', 'Free WiFi', 'Wheelchair Accessible'
  ];

  // Update parent when filters change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Search locations with debounce
  useEffect(() => {
    const searchLocations = async () => {
      if (locationSearch.length < 2) {
        setLocationSuggestions([]);
        return;
      }

      setIsLoadingLocation(true);
      try {
        // Use Supabase Edge Function for geocoding
        const { data, error } = await supabase.functions.invoke('geocode', {
          body: { query: locationSearch }
        });

        if (error) {
          console.warn('Geocoding service error:', error);
          // Fallback to popular cities
          const cities = getPopularCities().filter(city =>
            city.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
            city.address.toLowerCase().includes(locationSearch.toLowerCase())
          );
          setLocationSuggestions(cities);
        } else {
          setLocationSuggestions(data.results || []);
        }
      } catch (error) {
        console.warn('Location search failed:', error);
        // Fallback to popular cities
        const cities = getPopularCities().filter(city =>
          city.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
          city.address.toLowerCase().includes(locationSearch.toLowerCase())
        );
        setLocationSuggestions(cities);
        showError('Search Info', 'Using popular cities. For full location search, Mapbox API key needed.');
      } finally {
        setIsLoadingLocation(false);
      }
    };

    const timeoutId = setTimeout(searchLocations, 300);
    return () => clearTimeout(timeoutId);
  }, [locationSearch, showError]);

  const handleGetCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    try {
      const coords = await getCurrentLocation();
      const locationResult: LocationResult = {
        name: 'Your Current Location',
        coordinates: coords,
        address: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
      };
      
      setFilters(prev => ({ ...prev, location: locationResult }));
      setLocationSearch('Current Location');
      setLocationSuggestions([]);
      showSuccess('Location Found', 'Using your current location for search');
    } catch (error) {
      showError('Location Error', error instanceof Error ? error.message : 'Failed to get location');
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  const handleLocationSelect = (location: LocationResult) => {
    setFilters(prev => ({ ...prev, location }));
    setLocationSearch(location.name);
    setLocationSuggestions([]);
  };

  const handleBusinessTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };


  const clearFilters = () => {
    setFilters({
      query: '',
      location: null,
      distance: 25,
      businessTypes: [],
      features: []
    });
    setLocationSearch('');
    setLocationSuggestions([]);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Basic Search */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                ref={searchInputRef}
                placeholder="Search venues..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-10"
                autoFocus={false}
              />
            </div>
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Location Search */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Enter location, postcode, or city..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10"
                />
                {isLoadingLocation && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={isGettingCurrentLocation}
              >
                {isGettingCurrentLocation ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Target className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Location Suggestions */}
            {locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                {locationSuggestions.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-sm">{location.name}</div>
                    <div className="text-xs text-gray-500">{location.address}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance Filter */}
          {filters.location && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Distance: {filters.distance}km from {filters.location.name}
              </label>
              <Slider
                value={[filters.distance]}
                onValueChange={([value]) => setFilters(prev => ({ ...prev, distance: value }))}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Filters</h3>
          
          {/* Business Types */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Types</label>
            <div className="flex flex-wrap gap-2">
              {businessTypes.map(type => (
                <Badge
                  key={type}
                  variant={filters.businessTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleBusinessTypeToggle(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Features</label>
            <div className="grid grid-cols-2 gap-2">
              {venueFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <label htmlFor={feature} className="text-sm">{feature}</label>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;