import React, { useState } from 'react';
import { Search, Filter, Heart, Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InteractiveMap from '@/components/InteractiveMap';
import ContactModal from '@/components/ContactModal';
import { useApprovedVenues } from '@/hooks/useApprovedVenues';

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const { venues, isLoading, error } = useApprovedVenues();

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || venue.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleVenueSelect = (venue: any) => {
    setSelectedVenue(venue);
    console.log('Selected venue:', venue);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/map" className="text-trans-blue font-medium">Find Venues</Link>
              <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
              <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Add a Venue</Link>
              <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-4">Find Friendly Venues</h1>
          <p className="text-brand-navy/70">Discover transgender-friendly establishments near you</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pub">Pubs</SelectItem>
              <SelectItem value="restaurant">Restaurants</SelectItem>
              <SelectItem value="shop">Shops</SelectItem>
              <SelectItem value="gym">Gyms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Map */}
          <InteractiveMap onVenueSelect={handleVenueSelect} />

          {/* Venue List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-navy">
              Nearby Venues ({isLoading ? '...' : filteredVenues.length})
            </h2>
            
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
                      <p className="text-sm text-trans-blue font-medium">{venue.type}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-brand-navy">{venue.rating}</span>
                      <span className="text-xs text-brand-navy/60">({venue.reviews})</span>
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
                </CardContent>
              </Card>
            ))}

            {!isLoading && !error && filteredVenues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-brand-navy/60">
                  {venues.length === 0 
                    ? "No approved venues found. Venues will appear here once they are approved by administrators."
                    : "No venues found matching your search."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default Map;
