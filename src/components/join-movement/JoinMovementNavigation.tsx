
import React from 'react';
import { Link } from 'react-router-dom';

const JoinMovementNavigation = () => {
  return (
    <nav className="bg-trans-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/lovable-uploads/c0cdfb11-dd89-4a4f-8dca-44c6bc759037.png" alt="Rest with Respect Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-brand-navy">Rest with Respect</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link to="/map" className="text-brand-navy hover:text-trans-blue transition-colors">Find Venues</Link>
            <Link to="/directory" className="text-brand-navy hover:text-trans-blue transition-colors">Directory</Link>
            <Link to="/join" className="text-trans-blue font-medium">Join Movement</Link>
            <Link to="/resources" className="text-brand-navy hover:text-trans-blue transition-colors">Resources</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default JoinMovementNavigation;
