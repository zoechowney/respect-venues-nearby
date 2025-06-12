
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminNavigation from '@/components/admin/AdminNavigation';
import ApplicationsReview from '@/components/admin/ApplicationsReview';
import VenuesManagement from '@/components/admin/VenuesManagement';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');

  // For now, we'll check if user is logged in. In production, you'd check for admin role
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10">
      <AdminNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Admin Dashboard</h1>
          <p className="text-brand-navy/70">Manage venue applications and approved venues</p>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-1 bg-white/50 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'bg-trans-blue text-brand-navy shadow-sm'
                  : 'text-brand-navy/70 hover:text-brand-navy'
              }`}
            >
              Pending Applications
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'venues'
                  ? 'bg-trans-blue text-brand-navy shadow-sm'
                  : 'text-brand-navy/70 hover:text-brand-navy'
              }`}
            >
              Approved Venues
            </button>
          </nav>
        </div>

        {activeTab === 'applications' && <ApplicationsReview />}
        {activeTab === 'venues' && <VenuesManagement />}
      </div>
    </div>
  );
};

export default Admin;
