import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, QrCode, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import UserMenu from '@/components/UserMenu';
import ContactModal from '@/components/ContactModal';
const Index = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const NavigationLinks = () => <>
      <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
      <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
      <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Add a Venue</Link>
      <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
    </>;
  return <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <NavigationLinks />
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <UserMenu />
              </div>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-brand-navy">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-8">
                      <NavigationLinks />
                      <div className="pt-4 border-t">
                        <UserMenu />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-24 w-auto mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-brand-navy mb-6">
              Welcome to
              <span className="text-trans-blue block">Rest with Respect</span>
            </h1>
            <p className="text-xl text-brand-navy/80 mb-8 max-w-3xl mx-auto">Helping transgender and non-binary people feel welcome and accepted.  Find transgender / non-binary inclusive venues near you, or help your business join the movement towards greater inclusivity and mutual respect.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/map">
              <Button size="lg" className="w-full sm:w-auto bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
                <MapPin className="w-5 h-5 mr-2" />
                Find Friendly Venues
              </Button>
            </Link>
            <Link to="/join">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-trans-pink text-trans-pink hover:bg-trans-pink/10">
                <Users className="w-5 h-5 mr-2" />
                Add a Venue
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-trans-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-brand-navy mb-12">
            How Rest with Respect Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-trans-blue/20">
              <CardContent className="pt-6">
                <QrCode className="w-12 h-12 text-trans-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-brand-navy">Scan & Discover</h3>
                <p className="text-brand-navy/70">
                  Look for our signs in friendly venues. Scan the QR code to learn more about the business and find other welcoming spaces nearby.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-trans-pink/20">
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 text-trans-pink mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-brand-navy">Find Safe Spaces</h3>
                <p className="text-brand-navy/70">
                  Use our interactive map to locate transgender-friendly pubs, restaurants, shops, gyms, and other establishments in your area.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow border-trans-blue/20">
              <CardContent className="pt-6">
                <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-12 w-auto mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-brand-navy">Share Experiences</h3>
                <p className="text-brand-navy/70">
                  Help others by sharing your experiences and rating venues based on how welcomed and respected you felt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-trans-blue/10 to-trans-pink/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Mission</h2>
          <p className="text-lg text-brand-navy/80 leading-relaxed">
            We believe everyone deserves to feel safe and respected when using public facilities. 
            Rest with Respect connects transgender individuals with businesses that welcome them with open arms, 
            while helping establishments demonstrate their commitment to inclusivity and mutual respect.
          </p>
        </div>
      </section>

      <footer className="bg-brand-navy text-trans-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
              <span className="text-lg font-semibold">Rest with Respect</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/resources" className="hover:text-trans-blue transition-colors">Resources</Link>
              <Link to="/join" className="hover:text-trans-pink transition-colors">Add a Venue</Link>
              <button onClick={() => setIsContactModalOpen(true)} className="hover:text-trans-blue transition-colors">
                Contact
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-brand-navy/20 text-center text-trans-white/70">
            <p>© 2025 Rest with Respect. Creating inclusive spaces for everyone.</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>;
};
export default Index;