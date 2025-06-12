
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';

const AdminNavigation = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-trans-blue/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Shield className="w-8 h-8 text-trans-blue" />
            <span className="text-xl font-bold text-brand-navy">Admin Panel</span>
          </div>
          
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 text-brand-navy hover:text-trans-blue transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
