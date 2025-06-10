
import React from 'react';
import { Users } from 'lucide-react';

const JoinMovementHeader = () => {
  return (
    <div className="text-center mb-12">
      <Users className="w-16 h-16 text-trans-blue mx-auto mb-4" />
      <h1 className="text-4xl font-bold text-brand-navy mb-4">Join the Movement</h1>
      <p className="text-xl text-brand-navy/80 max-w-2xl mx-auto">
        Help create more inclusive spaces by joining our network of transgender-friendly establishments. 
        Get your free signage pack and become part of a welcoming community.
      </p>
    </div>
  );
};

export default JoinMovementHeader;
