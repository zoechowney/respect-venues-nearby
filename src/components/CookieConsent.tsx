import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid layout shift on initial load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
          <p>
            We use cookies to enhance your experience and analyse site traffic.{' '}
            <Link to="/cookie-policy" className="text-trans-blue hover:underline">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={declineCookies}
            className="text-xs"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={acceptCookies}
            className="bg-trans-blue hover:bg-trans-blue/90 text-white text-xs"
          >
            Accept Cookies
          </Button>
          <button
            onClick={declineCookies}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
