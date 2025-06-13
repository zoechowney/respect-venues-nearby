
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import AdminNavigation from '@/components/admin/AdminNavigation';
import ApplicationsReview from '@/components/admin/ApplicationsReview';
import VenuesManagement from '@/components/admin/VenuesManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [activeTab, setActiveTab] = useState('applications');

  // Show loading state while auth and role are being determined
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10 flex items-center justify-center">
        <div className="text-brand-navy">Loading...</div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <h1 className="text-2xl font-bold text-brand-navy mb-4">Access Denied</h1>
          <p className="text-brand-navy/70 mb-6">
            You don't have permission to access the admin dashboard. Please contact an administrator if you believe this is an error.
          </p>
          <a 
            href="/" 
            className="inline-block bg-trans-blue hover:bg-trans-blue/90 text-brand-navy px-4 py-2 rounded-md transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/10">
      <AdminNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-navy mb-2">Admin Dashboard</h1>
          <p className="text-brand-navy/70">Manage venue applications, approved venues, and reviews</p>
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
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-trans-blue text-brand-navy shadow-sm'
                  : 'text-brand-navy/70 hover:text-brand-navy'
              }`}
            >
              Review Management
            </button>
          </nav>
        </div>

        {activeTab === 'applications' && <ApplicationsReview />}
        {activeTab === 'venues' && <VenuesManagement />}
        {activeTab === 'reviews' && <ReviewsManagement />}
      </div>
    </div>
  );
};

export default Admin;
