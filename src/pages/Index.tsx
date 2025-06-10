
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Users, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Rest with Respect</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/map" className="text-gray-700 hover:text-blue-600 transition-colors">Find Venues</Link>
              <Link to="/directory" className="text-gray-700 hover:text-blue-600 transition-colors">Directory</Link>
              <Link to="/join" className="text-gray-700 hover:text-blue-600 transition-colors">Join Movement</Link>
              <Link to="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">Resources</Link>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">Menu</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Heart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to
              <span className="text-blue-600 block">Rest with Respect</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Creating safe, inclusive spaces for everyone. Find transgender-friendly venues near you, 
              or help your business join the movement towards greater inclusivity and mutual respect.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/map">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <MapPin className="w-5 h-5 mr-2" />
                Find Friendly Venues
              </Button>
            </Link>
            <Link to="/join">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
                <Users className="w-5 h-5 mr-2" />
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Rest with Respect Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <QrCode className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Scan & Discover</h3>
                <p className="text-gray-600">
                  Look for our signs in friendly venues. Scan the QR code to learn more about the business and find other welcoming spaces nearby.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Find Safe Spaces</h3>
                <p className="text-gray-600">
                  Use our interactive map to locate transgender-friendly pubs, restaurants, shops, gyms, and other establishments in your area.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Share Experiences</h3>
                <p className="text-gray-600">
                  Help others by sharing your experiences and rating venues based on how welcomed and respected you felt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe everyone deserves to feel safe and respected when using public facilities. 
            Rest with Respect connects transgender individuals with businesses that welcome them with open arms, 
            while helping establishments demonstrate their commitment to inclusivity and mutual respect.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="w-6 h-6" />
              <span className="text-lg font-semibold">Rest with Respect</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/resources" className="hover:text-blue-400 transition-colors">Resources</Link>
              <Link to="/join" className="hover:text-blue-400 transition-colors">Join Us</Link>
              <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Rest with Respect. Creating inclusive spaces for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
