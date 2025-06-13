
import React, { useState } from 'react';
import JoinMovementNavigation from '@/components/join-movement/JoinMovementNavigation';
import JoinMovementHeader from '@/components/join-movement/JoinMovementHeader';
import BenefitsCard from '@/components/join-movement/BenefitsCard';
import SignStylesCard from '@/components/join-movement/SignStylesCard';
import VenueRegistrationForm from '@/components/join-movement/VenueRegistrationForm';
import ContactModal from '@/components/ContactModal';
import { Link } from 'react-router-dom';

const JoinMovement = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <JoinMovementNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JoinMovementHeader />

        {/* Venue Owner Login Link */}
        <div className="text-center mb-8">
          <p className="text-brand-navy/70 mb-2">Already registered your venue?</p>
          <Link to="/venue-owner/auth" className="text-trans-blue hover:underline font-medium">
            Sign in to your venue owner account
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits and Sign Styles */}
          <div className="lg:col-span-1 space-y-6">
            <BenefitsCard />
            <SignStylesCard />
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <VenueRegistrationForm />
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
};

export default JoinMovement;
