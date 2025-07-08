import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '@/components/UserMenu';

interface NavigationProps {
  currentPage?: string;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage }) => {
  const isMobile = useIsMobile();

  const NavigationLinks = () => (
    <>
      <Link 
        to="/map" 
        className={currentPage === 'map' ? 'text-trans-blue font-medium' : 'text-brand-navy hover:text-trans-blue transition-colors'}
      >
        Find Venues
      </Link>
      <Link 
        to="/directory" 
        className={currentPage === 'directory' ? 'text-trans-blue font-medium' : 'text-brand-navy hover:text-trans-blue transition-colors'}
      >
        Directory
      </Link>
      <Link 
        to="/join" 
        className={currentPage === 'join' ? 'text-trans-blue font-medium' : 'text-brand-navy hover:text-trans-blue transition-colors'}
      >
        Add a Venue
      </Link>
      <Link 
        to="/resources" 
        className={currentPage === 'resources' ? 'text-trans-blue font-medium' : 'text-brand-navy hover:text-trans-blue transition-colors'}
      >
        Resources
      </Link>
      <Link 
        to="/sponsors" 
        className={currentPage === 'sponsors' ? 'text-trans-blue font-medium' : 'text-brand-navy hover:text-trans-blue transition-colors'}
      >
        Our Sponsors
      </Link>
    </>
  );

  return (
    <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className={`font-bold text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {isMobile ? 'Rest w/ Respect' : 'Rest with Respect'}
              </span>
            </Link>
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
  );
};

export default Navigation;