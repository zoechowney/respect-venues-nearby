
import React, { useState } from 'react';
import { Search, MapPin, Star, ExternalLink, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactModal from '@/components/ContactModal';
import { useApprovedVenues } from '@/hooks/useApprovedVenues';

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const { venues, isLoading, error } = useApprovedVenues();

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = false;
    if (selectedTab === 'all') {
      matchesTab = true;
    } else if (selectedTab === 'other') {
      // "Other" includes any venue type that doesn't match the standard categories
      const standardTypes = ['pub', 'restaurant', 'shop', 'gym', 'office', 'cinema'];
      matchesTab = !standardTypes.includes(venue.type.toLowerCase());
    } else {
      matchesTab = venue.type.toLowerCase() === selectedTab.toLowerCase();
    }
    
    return matchesSearch && matchesTab;
  });

  const handleShowOnMap = (venue: any) => {
    // Navigate to map page - in the future this could include venue-specific parameters
    navigate('/map');
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
              <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
              <Link to="/directory" className="text-trans-blue font-medium">Directory</Link>
              <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Add a Venue</Link>
              <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-4">Venue Directory</h1>
          <p className="text-brand-navy/70">Browse all transgender-friendly establishments in our network</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-navy/40 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-brand-navy/60">Loading venues...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading venues: {error}</p>
          </div>
        )}

        {/* Venue Grid */}
        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-shadow border-trans-blue/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
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
                  <p className="text-sm text-brand-navy/70">{venue.description}</p>
                  
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

                  <div className="pt-2 border-t">
                    <Button 
                      size="sm" 
                      onClick={() => handleShowOnMap(venue)}
                      className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Show on Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-navy/60">
              {venues.length === 0 
                ? "No approved venues found. Venues will appear here once they are approved by administrators."
                : "No venues found matching your search."
              }
            </p>
          </div>
        )}
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default Directory;
