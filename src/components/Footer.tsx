import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import ContactModal from '@/components/ContactModal';

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <footer className={`bg-brand-navy text-trans-white py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto">
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-col md:flex-row justify-between items-center'}`}>
            <Link to="/" className={`flex items-center space-x-3 ${isMobile ? 'justify-center' : 'mb-4 md:mb-0'} hover:opacity-80 transition-opacity`}>
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-8 w-auto" />
              <span className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>Rest with Respect</span>
            </Link>
            <div className={`flex ${isMobile ? 'flex-col space-y-3 text-center' : 'space-x-6'}`}>
              <Link to="/code-of-conduct" className="hover:text-trans-pink transition-colors text-sm">Code of Conduct</Link>
              <Link to="/privacy-policy" className="hover:text-trans-blue transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-trans-blue transition-colors text-sm">Terms of Service</Link>
              <Link to="/data-rights" className="hover:text-trans-pink transition-colors text-sm">Your Data Rights</Link>
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
    </>
  );
};

export default Footer;