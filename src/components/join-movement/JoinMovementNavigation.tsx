
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ContactModal from '@/components/ContactModal';

const JoinMovementNavigation = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const NavigationLinks = () => (
    <>
      <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
      <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
      <Link to="/join" className="text-trans-blue font-medium">Add a Venue</Link>
      <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
    </>
  );

  return (
    <>
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <NavigationLinks />
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
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
};

export default JoinMovementNavigation;
