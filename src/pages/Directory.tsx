import React, { useState } from 'react';
import { Search, MapPin, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockVenues = [
  {
    id: 1,
    name: "The Rainbow Pub",
    type: "Pub",
    address: "123 High Street, London",
    phone: "020 7123 4567",
    website: "www.rainbowpub.co.uk",
    rating: 4.8,
    reviews: 47,
    description: "A welcoming traditional pub with a strong commitment to inclusivity and community.",
    features: ["Accessible Toilets", "Staff Trained", "Gender Neutral Facilities", "Family Friendly"],
    hours: "Mon-Sun: 12:00 PM - 11:00 PM"
  },
  {
    id: 2,
    name: "Inclusive Café",
    type: "Restaurant",
    address: "456 Market Square, London",
    phone: "020 7234 5678",
    website: "www.inclusivecafe.com",
    rating: 4.9,
    reviews: 63,
    description: "A cozy café serving fresh, local food with a commitment to making everyone feel at home.",
    features: ["Quiet Spaces", "All-Gender Toilets", "Accessible", "Plant-Based Options"],
    hours: "Mon-Fri: 7:00 AM - 6:00 PM, Sat-Sun: 8:00 AM - 5:00 PM"
  },
  {
    id: 3,
    name: "Unity Fitness",
    type: "Gym",
    address: "789 Park Road, London",
    phone: "020 7345 6789",
    website: "www.unityfitness.co.uk",
    rating: 4.7,
    reviews: 29,
    description: "A modern fitness center with private changing facilities and an all-welcome policy.",
    features: ["Private Changing Rooms", "Personal Training", "All Welcome Policy", "Accessible"],
    hours: "Mon-Fri: 6:00 AM - 10:00 PM, Sat-Sun: 8:00 AM - 8:00 PM"
  }
];

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || venue.type.toLowerCase() === selectedTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

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
              <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Join Movement</Link>
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
          <TabsList className="grid w-full grid-cols-5 max-w-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pub">Pubs</TabsTrigger>
            <TabsTrigger value="restaurant">Cafés</TabsTrigger>
            <TabsTrigger value="shop">Shops</TabsTrigger>
            <TabsTrigger value="gym">Gyms</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Venue Grid */}
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

                <div className="space-y-2">
                  <p className="text-sm font-medium text-brand-navy">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {venue.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-trans-pink/20 text-trans-pink text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {venue.features.length > 3 && (
                      <span className="px-2 py-1 bg-brand-navy/10 text-brand-navy/70 text-xs rounded-full">
                        +{venue.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-brand-navy/60 mb-3">{venue.hours}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline" className="border-trans-pink text-trans-pink hover:bg-trans-pink/10">
                      Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brand-navy/60">No venues found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
