import React from 'react';
import { MapPin, Star, Clock, Phone, Globe, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// This would typically get venue data from URL params or API
const mockVenue = {
  id: 1,
  name: "The Rainbow Pub",
  type: "Pub",
  address: "123 High Street, London, SW1A 1AA",
  phone: "020 7123 4567",
  website: "www.rainbowpub.co.uk",
  rating: 4.8,
  reviews: 47,
  description: "A welcoming traditional pub with a strong commitment to inclusivity and community. We're proud to be part of the Rest with Respect network, ensuring all our guests feel safe and welcome.",
  features: ["Accessible Toilets", "Staff Trained", "Gender Neutral Facilities", "Family Friendly", "Wheelchair Accessible"],
  hours: {
    "Monday": "12:00 PM - 11:00 PM",
    "Tuesday": "12:00 PM - 11:00 PM", 
    "Wednesday": "12:00 PM - 11:00 PM",
    "Thursday": "12:00 PM - 11:00 PM",
    "Friday": "12:00 PM - 12:00 AM",
    "Saturday": "11:00 AM - 12:00 AM",
    "Sunday": "11:00 AM - 10:30 PM"
  },
  openNow: true
};

const QRLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Header */}
      <div className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold text-brand-navy">Rest with Respect</span>
            </div>
            <div className="text-sm text-brand-navy/70">
              Trans Friendly Venue
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-trans-blue to-trans-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-brand-navy mb-2">{mockVenue.name}</h1>
          <p className="text-trans-blue font-medium text-lg">{mockVenue.type}</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-medium text-brand-navy">{mockVenue.rating}</span>
            <span className="text-brand-navy/60">({mockVenue.reviews} reviews)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-trans-blue/10 to-trans-pink/10 border-trans-blue/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-brand-navy">
                  <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-5 w-auto" />
                  <span>Welcome to a Trans-Friendly Space</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-navy/80">
                  {mockVenue.name} is proud to be part of the Rest with Respect network. 
                  We welcome all customers and are committed to providing a safe, inclusive environment 
                  where everyone can feel comfortable using our facilities.
                </p>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="border-trans-pink/20">
              <CardHeader>
                <CardTitle className="text-brand-navy">About This Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-brand-navy/70 mb-4">{mockVenue.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-brand-navy">Inclusive Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mockVenue.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-trans-pink rounded-full"></div>
                        <span className="text-sm text-brand-navy/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download App CTA */}
            <Card className="bg-gradient-to-r from-trans-blue to-trans-pink text-brand-navy border-0">
              <CardContent className="text-center py-6">
                <Download className="w-12 h-12 mx-auto mb-3 text-trans-white" />
                <h3 className="text-xl font-bold mb-2 text-trans-white">Find More Friendly Venues</h3>
                <p className="text-trans-white/90 mb-4">
                  Discover more transgender-friendly businesses near you with Rest with Respect
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="secondary" size="lg" className="bg-trans-white hover:bg-trans-white/90 text-brand-navy">
                    <Download className="w-5 h-5 mr-2" />
                    Download App
                  </Button>
                  <Link to="/map">
                    <Button variant="outline" size="lg" className="w-full border-trans-white text-trans-white hover:bg-trans-white hover:text-brand-navy">
                      <MapPin className="w-5 h-5 mr-2" />
                      Browse Website
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card className="border-trans-blue/20">
              <CardHeader>
                <CardTitle className="text-lg text-brand-navy">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-navy/40 mt-0.5" />
                  <p className="text-sm text-brand-navy/70">{mockVenue.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brand-navy/40" />
                  <p className="text-sm text-brand-navy/70">{mockVenue.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-brand-navy/40" />
                  <a href={`https://${mockVenue.website}`} className="text-sm text-trans-blue hover:underline">
                    {mockVenue.website}
                  </a>
                </div>
                
                <div className="pt-3 border-t">
                  <Button className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card className="border-trans-pink/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2 text-brand-navy">
                  <Clock className="w-5 h-5" />
                  <span>Opening Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(mockVenue.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-brand-navy/70">{day}</span>
                      <span className={day === 'Today' ? 'font-medium text-trans-blue' : 'text-brand-navy/70'}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    mockVenue.openNow 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mockVenue.openNow ? 'Open Now' : 'Closed'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* About Rest with Respect */}
            <Card className="border-trans-blue/20">
              <CardHeader>
                <CardTitle className="text-lg text-brand-navy">About Rest with Respect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-brand-navy/70 mb-3">
                  Creating safe, inclusive spaces for transgender individuals across the UK.
                </p>
                <Link to="/">
                  <Button variant="outline" size="sm" className="w-full border-trans-blue text-trans-blue hover:bg-trans-blue/10">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLanding;
