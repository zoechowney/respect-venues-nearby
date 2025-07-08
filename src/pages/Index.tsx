import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, QrCode, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '@/components/UserMenu';
import ContactModal from '@/components/ContactModal';
const Index = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isMobile = useIsMobile();
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
              <span className={`font-bold text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {isMobile ? 'Rest w/ Respect' : 'Rest with Respect'}
              </span>
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
                      <div className="flex items-center space-x-3 pb-4 border-b">
                        <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
                        <span className="font-bold text-brand-navy">Menu</span>
                      </div>
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
      <section className={`relative py-${isMobile ? '12' : '20'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-${isMobile ? '6' : '8'}`}>
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className={`${isMobile ? 'h-16' : 'h-24'} w-auto mx-auto mb-${isMobile ? '4' : '6'}`} />
            <h1 className={`font-bold text-brand-navy mb-${isMobile ? '4' : '6'} ${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl'}`}>
              Welcome to
              <span className="text-trans-blue block">Rest with Respect</span>
            </h1>
            <p className={`text-brand-navy/80 mb-${isMobile ? '6' : '8'} max-w-3xl mx-auto ${isMobile ? 'text-lg leading-relaxed' : 'text-xl'}`}>
              Helping transgender and non-binary people feel welcome and accepted.
              <br />
              <br />
              Find transgender / non-binary inclusive venues near you, or help your business join the movement towards greater inclusivity and mutual respect.
            </p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 justify-center`}>
            <Link to="/map" className={isMobile ? 'w-full' : ''}>
              <Button size="lg" className={`${isMobile ? 'w-full h-12' : 'w-full sm:w-auto'} bg-trans-blue hover:bg-trans-blue/90 text-brand-navy`}>
                <MapPin className="w-5 h-5 mr-2" />
                Find Friendly Venues
              </Button>
            </Link>
            <Link to="/join" className={isMobile ? 'w-full' : ''}>
              <Button size="lg" variant="outline" className={`${isMobile ? 'w-full h-12' : 'w-full sm:w-auto'} border-trans-pink text-trans-pink hover:bg-trans-pink/10`}>
                <Users className="w-5 h-5 mr-2" />
                Add a Venue
              </Button>
            </Link>
          </div>
          
          {/* Venue Owner Login Link */}
          <div className={`mt-${isMobile ? '4' : '6'}`}>
            <Link to="/venue-owner/auth" className="text-sm text-brand-navy/70 hover:text-trans-blue transition-colors underline">Already a venue owner? Sign in to manage your listing

          </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-${isMobile ? '16' : '20'} px-4 sm:px-6 lg:px-8 bg-trans-white/50`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`font-bold text-center text-brand-navy mb-${isMobile ? '4' : '6'} ${isMobile ? 'text-2xl' : 'text-3xl'}`}>How Rest with Respect Works</h2>
          
          <div className={`grid ${isMobile ? 'gap-6' : 'md:grid-cols-3 gap-8'}`}>
            <Card className={`text-center ${isMobile ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow border-trans-blue/20`}>
              <CardContent className={isMobile ? 'pt-4' : 'pt-6'}>
                <QrCode className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-trans-blue mx-auto mb-4`} />
                <h3 className={`font-semibold mb-3 text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>Scan & Discover</h3>
                <p className="text-brand-navy/70 text-sm leading-relaxed">
                  Look for our signs in friendly venues. Scan the QR code to learn more about the business and find other welcoming spaces nearby.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`text-center ${isMobile ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow border-trans-pink/20`}>
              <CardContent className={isMobile ? 'pt-4' : 'pt-6'}>
                <MapPin className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-trans-pink mx-auto mb-4`} />
                <h3 className={`font-semibold mb-3 text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>Find Safe Spaces</h3>
                <p className="text-brand-navy/70 text-sm leading-relaxed">
                  Use our interactive map to locate transgender-friendly pubs, restaurants, shops, gyms, and other establishments in your area.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`text-center ${isMobile ? 'p-4' : 'p-6'} hover:shadow-lg transition-shadow border-trans-blue/20`}>
              <CardContent className={isMobile ? 'pt-4' : 'pt-6'}>
                <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className={`${isMobile ? 'h-10' : 'h-12'} w-auto mx-auto mb-4`} />
                <h3 className={`font-semibold mb-3 text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>Share Experiences</h3>
                <p className="text-brand-navy/70 text-sm leading-relaxed">
                  Help others by sharing your experiences and rating venues based on how welcomed and respected you felt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className={`py-${isMobile ? '16' : '20'} px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-trans-blue/10 to-trans-pink/10`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`font-bold text-brand-navy mb-6 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Our Mission</h2>
          <p className={`text-brand-navy/80 leading-relaxed mb-8 ${isMobile ? 'text-base' : 'text-lg'}`}>
            We believe everyone deserves to feel safe and respected when using public facilities. 
            Rest with Respect connects transgender individuals with businesses that welcome them with open arms, 
            while helping establishments demonstrate their commitment to inclusivity and mutual respect.
          </p>
        </div>
      </section>

      <section className={`py-${isMobile ? '16' : '20'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`font-bold text-brand-navy mb-6 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Why This Matters</h2>
          <div className={`text-brand-navy/80 leading-relaxed space-y-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
            <p>
              For many transgender and non-binary people, something as basic as using the toilet can be a source of anxiety, fear, or even danger.
            </p>
            <p>
              Being asked to use a separate "third" space (like a disabled or family toilet) may seem like a compromise. But it's not. It's dehumanising. It sends a message that trans people are a problem to be managed, not equals to be welcomed. It makes people feel inferior, excluded, and publicly "outed" every time they need to use a facility.
            </p>
            <p>
              Rest with Respect exists to change that, by helping businesses visibly show trans and non-binary people that they are safe, seen, and truly welcome.
            </p>
            <p>
              Because everyone deserves to use the loo with dignity.
            </p>
            <p>
              Respect is a two-way process. Trans and non-binary people also pledge to follow a shared <Link to="/code-of-conduct" className="text-trans-blue hover:text-trans-pink transition-colors underline">Code of Conduct</Link>, helping ensure that everyone can use these facilities safely and respectfully.
            </p>
          </div>
        </div>
      </section>

      <footer className={`bg-brand-navy text-trans-white py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto">
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-col md:flex-row justify-between items-center'}`}>
            <div className={`flex items-center space-x-3 ${isMobile ? 'justify-center' : 'mb-4 md:mb-0'}`}>
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
              <span className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Rest with Respect</span>
            </div>
            <div className={`flex ${isMobile ? 'flex-col space-y-3 text-center' : 'space-x-6'}`}>
              <Link to="/resources" className="hover:text-trans-blue transition-colors text-sm">Resources</Link>
              <Link to="/code-of-conduct" className="hover:text-trans-pink transition-colors text-sm">Code of Conduct</Link>
              <Link to="/join" className="hover:text-trans-pink transition-colors text-sm">Add a Venue</Link>
              <Link to="/venue-owner/auth" className="hover:text-trans-blue transition-colors text-sm">Venue Owner Login</Link>
              <button onClick={() => setIsContactModalOpen(true)} className="hover:text-trans-blue transition-colors text-sm">
                Contact
              </button>
            </div>
          </div>
          <div className={`mt-${isMobile ? '6' : '8'} pt-${isMobile ? '6' : '8'} border-t border-brand-navy/20 text-center text-trans-white/70`}>
            <p className="text-sm">© 2025 Rest with Respect. Creating inclusive spaces for everyone.</p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>;
};
export default Index;