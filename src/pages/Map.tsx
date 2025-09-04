
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Heart, Star, MapPin, ExternalLink, Eye, Navigation as NavigationIcon, RotateCcw, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InteractiveMap from '@/components/InteractiveMap';
import Navigation from '@/components/Navigation';
import ContactModal from '@/components/ContactModal';
import Footer from '@/components/Footer';
import VenueDetailModal from '@/components/VenueDetailModal';
import AdvancedSearchModal from '@/components/AdvancedSearchModal';
import { useApprovedVenues, ApprovedVenue } from '@/hooks/useApprovedVenues';
import { getCurrentLocation, filterVenuesByDistance, Coordinates } from '@/lib/geolocation';
import { useToast } from '@/hooks/use-toast';
import { getBusinessTypeColor } from '@/lib/utils';

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState<ApprovedVenue | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVenueDetailOpen, setIsVenueDetailOpen] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [filteredVenues, setFilteredVenues] = useState<ApprovedVenue[]>([]);
  const [hasAdvancedFilters, setHasAdvancedFilters] = useState(false);
  
  const { venues, isLoading, error } = useApprovedVenues();
  const { toast } = useToast();
  
  // Get venue center coordinates from URL params, or use user location if available
  const centerLat = searchParams.get('lat');
  const centerLng = searchParams.get('lng');
  const centerZoom = searchParams.get('zoom');
  
  console.log('🌍 Map: Computing map center - URL params:', { centerLat, centerLng, centerZoom });
  console.log('🌍 Map: User location:', userLocation);
  
  const hasUrlCenter = centerLat && centerLng;
  
  const mapCenter = hasUrlCenter
    ? { lat: parseFloat(centerLat), lng: parseFloat(centerLng), zoom: centerZoom ? parseInt(centerZoom) : 16 }
    : userLocation 
    ? { lat: userLocation.latitude, lng: userLocation.longitude, zoom: 14 }
    : null; // Will default to Surrey in the map component
    
  console.log('🌍 Map: Final map center:', mapCenter, 'fromUrl:', !!hasUrlCenter);

  // Automatically get user's location when the page loads
  useEffect(() => {
    console.log('🌍 Map: Auto-requesting user location on page load');
    getUserLocation();
  }, []);

  // Get user's current location
  const getUserLocation = async () => {
    try {
      console.log('🌍 Map: Requesting user location...');
      const location = await getCurrentLocation();
      console.log('🌍 Map: Location received:', location);
      setUserLocation(location);
      toast({
        title: "Location Found",
        description: "Map centered on your location. Venues are now sorted by distance.",
      });
    } catch (error) {
      console.log('🌍 Map: Location access denied or failed:', error);
      // Silently fail - map will use default Surrey location
    }
  };

  // Center map on user's current location
  const centerOnUserLocation = async () => {
    // Clear URL parameters to remove venue-specific centering
    setSearchParams(new URLSearchParams());
    
    // Get fresh location and update map
    try {
      console.log('🌍 Map: Centering on user location...');
      const location = await getCurrentLocation();
      setUserLocation(location);
      toast({
        title: "Map Centered",
        description: "Map centered on your current location.",
      });
    } catch (error) {
      console.log('🌍 Map: Location access failed:', error);
      toast({
        title: "Location Unavailable",
        description: "Unable to access your location. Please enable location services.",
        variant: "destructive"
      });
    }
  };

  // Handle advanced search - only called when user clicks "Apply Filters"
  const handleAdvancedSearch = (filters: any) => {
    console.log('🔍 Advanced Search Filters:', filters);
    let results = [...venues];
    
    // Create mapping from display names to database values
    const businessTypeMapping: { [key: string]: string } = {
      'Pub / bar': 'pub',
      'Restaurant / café': 'restaurant', 
      'Shop / retail': 'shop',
      'Gym / fitness': 'gym',
      'Cinema / theatre': 'cinema',
      'Office / workplace': 'office',
      'Other': 'other'
    };
    
    // Basic search filter
    if (filters.query) {
      results = results.filter(venue => 
        venue.name.toLowerCase().includes(filters.query.toLowerCase()) ||
        venue.address.toLowerCase().includes(filters.query.toLowerCase())
      );
    }
    
    // Business type filter  
    if (filters.businessTypes && filters.businessTypes.length > 0) {
      console.log('🏷️ Filtering by business types:', filters.businessTypes);
      console.log('📊 Sample venue type before filtering:', results[0]?.type);
      
      results = results.filter(venue => {
        // Convert display names to database values for comparison
        const dbValues = filters.businessTypes.map((displayName: string) => 
          businessTypeMapping[displayName] || displayName.toLowerCase()
        );
        
        const matches = dbValues.includes(venue.type.toLowerCase());
        console.log(`🏢 Venue "${venue.name}" type: "${venue.type}", matches:`, matches);
        return matches;
      });
      
      console.log('✅ Venues after business type filtering:', results.length);
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
      console.log('🏷️ Filtering by features:', filters.features);
      console.log('📊 Sample venue features before filtering:', results[0]?.features);
      
      results = results.filter(venue => {
        if (!venue.features || !Array.isArray(venue.features)) {
          console.log(`❌ Venue "${venue.name}" has no features or invalid features:`, venue.features);
          return false;
        }
        
        const hasMatchingFeature = filters.features.every((selectedFeature: string) => 
          venue.features.includes(selectedFeature)
        );
        
        console.log(`🏢 Venue "${venue.name}" features:`, venue.features, 'matches:', hasMatchingFeature);
        return hasMatchingFeature;
      });
      
      console.log('✅ Venues after feature filtering:', results.length);
    }
    
    // Location and distance filtering
    if (filters.location && userLocation && filters.distance) {
      const venuesWithCoords = results.map(venue => ({
        ...venue,
        coordinates: {
          latitude: venue.address.toLowerCase().includes('godalming') || venue.address.toLowerCase().includes('surrey')
            ? 51.1858 + (Math.random() - 0.5) * 0.02
            : venue.address.toLowerCase().includes('guildford')
            ? 51.2362 + (Math.random() - 0.5) * 0.02
            : 51.1858 + (Math.random() - 0.5) * 0.02,
          longitude: venue.address.toLowerCase().includes('godalming') || venue.address.toLowerCase().includes('surrey') 
            ? -0.6149 + (Math.random() - 0.5) * 0.02
            : venue.address.toLowerCase().includes('guildford')
            ? -0.5704 + (Math.random() - 0.5) * 0.02
            : -0.6149 + (Math.random() - 0.5) * 0.02
        }
      }));
      
      results = filterVenuesByDistance(venuesWithCoords, userLocation, filters.distance);
    }
    
    setFilteredVenues(results);
    setHasAdvancedFilters(true);
    // Don't close the modal here - it's handled in the modal component
  };

  // Apply basic filters
  useEffect(() => {
    if (!hasAdvancedFilters) {
      let results = venues.filter(venue => {
        const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             venue.address.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesType = false;
        if (selectedType === 'all') {
          matchesType = true;
        } else if (selectedType === 'other') {
          const standardTypes = ['pub', 'restaurant', 'shop', 'gym', 'cinema', 'office'];
          matchesType = !standardTypes.includes(venue.type.toLowerCase());
        } else {
          matchesType = venue.type.toLowerCase() === selectedType.toLowerCase();
        }
        
        return matchesSearch && matchesType;
      });
      
      setFilteredVenues(results);
    }
  }, [venues, searchTerm, selectedType, hasAdvancedFilters]);

  // Reset advanced filters when basic search changes
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setHasAdvancedFilters(false);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setHasAdvancedFilters(false);
  };

  const handleVenueSelect = (venue: any) => {
    setSelectedVenue(venue);
    setIsVenueDetailOpen(true);
    console.log('Selected venue:', venue);
  };

  const handleViewDetails = (venue: ApprovedVenue) => {
    setSelectedVenue(venue);
    setIsVenueDetailOpen(true);
  };

  const handleShowOnMap = (venue: ApprovedVenue) => {
    // Center the map on the selected venue
    if (venue.latitude && venue.longitude) {
      // Update search params to trigger re-render
      const newParams = new URLSearchParams(searchParams);
      newParams.set('lat', venue.latitude.toString());
      newParams.set('lng', venue.longitude.toString());
      newParams.set('zoom', '16'); // Zoom in closer to the venue
      
      // Use setSearchParams to properly update the URL and trigger re-render
      setSearchParams(newParams);
      
      // Show success message
      toast({
        title: "Map Centered",
        description: `Map centered on ${venue.name}`,
      });
    } else {
      toast({
        title: "Location Unavailable",
        description: "This venue doesn't have location coordinates available.",
        variant: "destructive"
      });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedType !== 'all' || hasAdvancedFilters;

  // Clear all filters and show all venues
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setHasAdvancedFilters(false);
    toast({
      title: "Filters Cleared",
      description: "Now showing all venues",
    });
  };

  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'pub', label: 'Pubs / bars' },
    { value: 'restaurant', label: 'Café / restaurants' },
    { value: 'shop', label: 'Shops / retail' },
    { value: 'gym', label: 'Gyms / sports' },
    { value: 'cinema', label: 'Cinema / theatre' },
    { value: 'office', label: 'Office / workplace' },
    { value: 'other', label: 'Other' }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation currentPage="map" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-4">Find Friendly Venues</h1>
          <p className="text-brand-navy/70">Discover transgender-friendly establishments near you</p>
        </div>

        {/* Search Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/40 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedSearch(true)}
              className="border-trans-blue text-trans-blue hover:bg-trans-blue hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Search
            </Button>
            <Button
              variant="outline"
              onClick={getUserLocation}
              className="border-trans-blue text-trans-blue hover:bg-trans-blue hover:text-white"
              disabled={!!userLocation}
            >
              <NavigationIcon className="w-4 h-4 mr-2" />
              {userLocation ? 'Location Active' : 'Use My Location'}
            </Button>
            {hasUrlCenter && userLocation && (
              <Button
                variant="default"
                onClick={centerOnUserLocation}
                className="bg-trans-blue hover:bg-trans-blue/90 text-white"
              >
                <NavigationIcon className="w-4 h-4 mr-2" />
                Center on My Location
              </Button>
            )}
            {hasActiveFilters && (
              <Button
                variant="destructive"
                onClick={clearAllFilters}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters - Tabs on desktop, Select on mobile */}
        <div className="mb-8">
          {/* Mobile Select */}
          <div className="lg:hidden">
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <Tabs value={selectedType} onValueChange={handleTypeChange}>
              <TabsList className="grid w-full grid-cols-8 max-w-5xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pub">Pubs / bars</TabsTrigger>
                <TabsTrigger value="restaurant">Café / restaurants</TabsTrigger>
                <TabsTrigger value="shop">Shops / retail</TabsTrigger>
                <TabsTrigger value="gym">Gyms / sports</TabsTrigger>
                <TabsTrigger value="cinema">Cinema / theatre</TabsTrigger>
                <TabsTrigger value="office">Office / workplace</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Map - Now receives filtered venues with stored coordinates */}
          <InteractiveMap 
            venues={filteredVenues.map(venue => ({
              id: parseInt(venue.id.split('-')[0], 16),
              name: venue.name,
              type: venue.type,
              address: venue.address,
              rating: venue.rating,
              openNow: venue.openNow,
              features: venue.features,
              coordinates: (venue.latitude && venue.longitude) 
                ? [venue.longitude, venue.latitude] as [number, number]
                : [-0.6149, 51.1858] as [number, number], // Default Godalming coordinates
              originalId: venue.id // Preserve original UUID for reviews
            }))}
            onVenueSelect={(venue) => {
              // Find the original venue data using the map venue
              const originalVenue = filteredVenues.find(v => v.name === venue.name && v.address === venue.address);
              if (originalVenue) {
                handleVenueSelect(originalVenue);
              }
            }}
            center={mapCenter}
            userLocation={userLocation}
            centerFromUrl={!!(centerLat && centerLng)}
          />

          {/* Venue List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-navy">
              {userLocation ? 'Nearby Venues' : 'Venues'} ({isLoading ? '...' : filteredVenues.length})
            </h2>
            {userLocation && (
              <p className="text-sm text-brand-navy/60">Sorted by distance from your location</p>
            )}
            
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-brand-navy/60">Loading venues...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading venues: {error}</p>
              </div>
            )}

            {/* Venues List */}
            {!isLoading && !error && filteredVenues.map((venue) => (
              <Card 
                key={venue.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer border-trans-pink/20 ${
                  selectedVenue?.id === venue.id ? 'ring-2 ring-trans-blue' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-brand-navy">{venue.name}</CardTitle>
                      <p className={`text-sm ${getBusinessTypeColor(venue.type)} font-medium`}>{venue.type}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {venue.rating > 0 ? (
                        <>
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-brand-navy">{venue.rating}</span>
                          <span className="text-xs text-brand-navy/60">({venue.reviews})</span>
                        </>
                      ) : (
                        <span className="text-xs text-brand-navy/60">No reviews yet</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {venue.description && (
                    <p className="text-sm text-brand-navy/70">{venue.description}</p>
                  )}
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-brand-navy/40 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-brand-navy/70">{venue.address}</p>
                  </div>

                  {venue.website && (
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-brand-navy/40 flex-shrink-0" />
                      <a 
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-trans-blue hover:text-trans-blue/80 underline transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="pt-2 border-t space-y-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleViewDetails(venue)}
                      className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details & Reviews
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShowOnMap(venue)}
                      className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      Show on Map
                    </Button>
                  </div>

                  {venue.distance && (
                    <div className="pt-2">
                      <span className="text-xs text-brand-navy/60">{venue.distance}</span>
                    </div>
                  )}
                  
                  {!venue.distance && (
                    <div className="pt-2">
                      <span className="text-xs text-brand-navy/40">Distance unavailable</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {!isLoading && !error && filteredVenues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-brand-navy/60">
                  {venues.length === 0 
                    ? "No approved venues found. Venues will appear here once they are approved by administrators."
                    : "No venues found matching your search and filters."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <VenueDetailModal
        venue={selectedVenue}
        isOpen={isVenueDetailOpen}
        onClose={() => setIsVenueDetailOpen(false)}
      />

      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        userLocation={userLocation}
      />
    </div>
  );
};

export default Map;
