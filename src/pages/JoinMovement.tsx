
import React from 'react';
import JoinMovementNavigation from '@/components/join-movement/JoinMovementNavigation';
import JoinMovementHeader from '@/components/join-movement/JoinMovementHeader';
import BenefitsCard from '@/components/join-movement/BenefitsCard';
import SignStylesCard from '@/components/join-movement/SignStylesCard';
import VenueRegistrationForm from '@/components/join-movement/VenueRegistrationForm';

const JoinMovement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/20">
      <JoinMovementNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JoinMovementHeader />

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
    </div>
  );
};

export default JoinMovement;
