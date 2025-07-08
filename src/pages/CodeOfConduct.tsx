import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import UserMenu from '@/components/UserMenu';
import ContactModal from '@/components/ContactModal';

const CodeOfConduct = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const NavigationLinks = () => (
    <>
      <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
      <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
      <Link to="/join" className="text-brand-navy hover:text-trans-blue transition-colors">Add a Venue</Link>
      <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      {/* Navigation */}
      <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-10 w-auto" />
              <span className={`font-bold text-brand-navy ${isMobile ? 'text-lg' : 'text-xl'}`}>
                {isMobile ? 'Rest w/ Respect' : 'Rest with Respect'}
              </span>
            </Link>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-brand-navy hover:text-trans-blue transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="h-16 w-auto mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-brand-navy mb-4">Code of Conduct</h1>
          <p className="text-xl text-brand-navy/80 mb-2">Creating safer, respectful spaces — together</p>
          <p className="text-brand-navy/70 max-w-3xl mx-auto">
            Rest with Respect believes that inclusion works best when everyone shares a commitment to kindness, privacy, and mutual respect. Below are our expectations for both venue operators and trans/non-binary people using participating facilities.
          </p>
        </div>

        {/* Content Cards */}
        <div className="space-y-8">
          {/* For Venue Operators */}
          <Card className="border-trans-blue/20 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-2">For Venue Operators:</h2>
              <h3 className="text-lg font-semibold text-trans-blue mb-6">Commitment to Respect & Safety</h3>
              
              <p className="text-brand-navy/80 mb-4">As a participating venue, we agree to:</p>
              
              <ul className="space-y-3 text-brand-navy/80">
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Welcome transgender and non-binary individuals to use the facilities that align with their gender identity
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Ensure that all guests are treated with dignity, privacy, and respect
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Display visible signage to show our commitment to inclusion
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Train our team to respond sensitively and appropriately if concerns are raised
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Make it clear that harassment, abuse, or intimidation of any kind — including toward trans or non-binary people — will not be tolerated
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Take action if another guest behaves inappropriately or makes others feel unsafe
                </li>
                <li className="flex items-start">
                  <span className="text-trans-blue mr-3 mt-1">•</span>
                  Promote an environment where everyone can feel at ease and use our facilities without fear
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* For Trans & Non-Binary Visitors */}
          <Card className="border-trans-pink/20 shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-2">For Trans & Non-Binary Visitors:</h2>
              <h3 className="text-lg font-semibold text-trans-pink mb-6">Commitment to Mutual Respect & Privacy</h3>
              
              <p className="text-brand-navy/80 mb-4">As a visitor using a Rest with Respect venue, I agree to:</p>
              
              <ul className="space-y-3 text-brand-navy/80">
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  Use the facilities that best reflect my gender identity and treat others with mutual respect
                </li>
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  Be mindful of the shared nature of these spaces and the comfort of other users
                </li>
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  Refrain from any inappropriate, intimidating, or disruptive behaviour
                </li>
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  If I have yet to have surgery to create genitalia that is similar in appearance to the biology of the sex of the facility I wish to use, I will use private cubicles or enclosed areas if I need to undress or use facilities where my genitalia may be visible
                </li>
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  Avoid exposing body parts in communal spaces that could cause discomfort to others, especially where facilities are typically designated by gender
                </li>
                <li className="flex items-start">
                  <span className="text-trans-pink mr-3 mt-1">•</span>
                  Understand that inclusion is a shared responsibility, built on courtesy, understanding, and care
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Closing Statement */}
          <Card className="border-brand-navy/20 shadow-lg bg-gradient-to-r from-trans-blue/5 to-trans-pink/5">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">Respect is a two-way promise.</h2>
              <p className="text-brand-navy/80 text-lg">
                This Code of Conduct ensures that everyone — trans, cis, non-binary, staff, and guests — can use shared facilities safely and with dignity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default CodeOfConduct;