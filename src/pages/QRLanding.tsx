
import React from 'react';
import { MapPin, Star, Clock, Phone, Globe, Download, Heart } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Rest with Respect</span>
            </div>
            <div className="text-sm text-gray-600">
              Trans Friendly Venue
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Venue Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockVenue.name}</h1>
          <p className="text-blue-600 font-medium text-lg">{mockVenue.type}</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-medium">{mockVenue.rating}</span>
            <span className="text-gray-500">({mockVenue.reviews} reviews)</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-800">
                  <Heart className="w-5 h-5" />
                  <span>Welcome to a Trans-Friendly Space</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  {mockVenue.name} is proud to be part of the Rest with Respect network. 
                  We welcome all customers and are committed to providing a safe, inclusive environment 
                  where everyone can feel comfortable using our facilities.
                </p>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About This Venue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{mockVenue.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Inclusive Features:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {mockVenue.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download App CTA */}
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="text-center py-6">
                <Download className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Find More Friendly Venues</h3>
                <p className="text-purple-100 mb-4">
                  Download the Rest with Respect app to discover transgender-friendly businesses near you
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="secondary" size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download App
                  </Button>
                  <Link to="/map">
                    <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-purple-600">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-600">{mockVenue.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{mockVenue.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <a href={`https://${mockVenue.website}`} className="text-sm text-blue-600 hover:underline">
                    {mockVenue.website}
                  </a>
                </div>
                
                <div className="pt-3 border-t">
                  <Button className="w-full" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Opening Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(mockVenue.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-600">{day}</span>
                      <span className={day === 'Today' ? 'font-medium text-green-600' : 'text-gray-600'}>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Rest with Respect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Creating safe, inclusive spaces for transgender individuals across the UK.
                </p>
                <Link to="/">
                  <Button variant="outline" size="sm" className="w-full">
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
