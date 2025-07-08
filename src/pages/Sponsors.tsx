import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSponsors } from '@/hooks/useSponsors';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SponsorApplicationForm from '@/components/SponsorApplicationForm';
const Sponsors = () => {
  const isMobile = useIsMobile();
  const {
    data: sponsors,
    isLoading,
    error
  } = useSponsors();
  return <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <Navigation currentPage="sponsors" />
      
      {/* Header */}
      <div className={`py-${isMobile ? '8' : '12'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className={`${isMobile ? 'h-8' : 'h-10'} w-auto`} />
            <div>
              <h1 className={`font-bold text-brand-navy ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                Our Sponsors
              </h1>
              <p className="text-brand-navy/70 text-sm mt-1">
                Supporting inclusive spaces for everyone
              </p>
            </div>
          </div>

          <div className="space-y-12">
          
          {/* Current Sponsors Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className={`font-bold text-brand-navy mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                Thank You to Our Sponsors
              </h2>
              <p className="text-brand-navy/80 max-w-3xl mx-auto">We're grateful to the businesses and organisations that support our mission to create inclusive spaces for transgender and non-binary people.</p>
            </div>

            {isLoading ? <div className="text-center py-8">
                <p className="text-brand-navy/70">Loading sponsors...</p>
              </div> : error ? <div className="text-center py-8">
                <p className="text-brand-navy/70">Unable to load sponsors at this time.</p>
              </div> : sponsors && sponsors.length > 0 ? <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'} justify-items-center`}>
                {sponsors.map(sponsor => <Card key={sponsor.id} className="hover:shadow-lg transition-shadow border-trans-blue/20">
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'} text-center`}>
                      {sponsor.logo_url ? <img src={sponsor.logo_url} alt={`${sponsor.company_name} logo`} className="h-16 mx-auto mb-4 object-contain" /> : <div className="h-16 flex items-center justify-center mb-4">
                          <Heart className="w-8 h-8 text-trans-pink" />
                        </div>}
                      <h3 className="font-semibold text-brand-navy mb-2">{sponsor.company_name}</h3>
                      {sponsor.website_url && <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-trans-blue hover:text-trans-pink transition-colors text-sm">
                          Visit Website
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>}
                    </CardContent>
                  </Card>)}
              </div> : <div className="text-center py-12">
                <Heart className="w-16 h-16 text-trans-pink mx-auto mb-4" />
                <h3 className="font-semibold text-brand-navy mb-2">Be Our First Sponsor!</h3>
                <p className="text-brand-navy/70 max-w-md mx-auto">
                  We're looking for businesses and organizations to partner with us 
                  in creating more inclusive spaces.
                </p>
              </div>}
          </section>

          {/* Become a Sponsor Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className={`font-bold text-brand-navy mb-4 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                Partner With Us
              </h2>
              <p className="text-brand-navy/80 max-w-3xl mx-auto">
                Join us in making a difference. Sponsoring Rest with Respect helps us expand our reach 
                and create more inclusive spaces for transgender and non-binary people across the UK.
              </p>
            </div>

            <div className="bg-trans-white/50 rounded-lg p-8 mb-8">
              <h3 className={`font-semibold text-brand-navy mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Why Sponsor Rest with Respect?
              </h3>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
                <div>
                  <h4 className="font-medium text-brand-navy mb-2">Make a Real Impact</h4>
                  <p className="text-brand-navy/70 text-sm">
                    Help create safer, more welcoming spaces for transgender and non-binary people.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-brand-navy mb-2">Brand Visibility</h4>
                  <p className="text-brand-navy/70 text-sm">
                    Showcase your commitment to diversity and inclusion to our growing community.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-brand-navy mb-2">Network Building</h4>
                  <p className="text-brand-navy/70 text-sm">
                    Connect with like-minded businesses and organizations in the inclusivity space.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-brand-navy mb-2">Social Responsibility</h4>
                  <p className="text-brand-navy/70 text-sm">
                    Demonstrate your company's values and commitment to human rights.
                  </p>
                </div>
              </div>
            </div>

            <SponsorApplicationForm />
          </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Sponsors;