
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

interface VenueOwner {
  id: string;
  email: string;
  business_name: string;
  contact_name: string;
  is_active: boolean;
}

interface VenueOwnerAuthContextType {
  venueOwner: VenueOwner | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => void;
}

const VenueOwnerAuthContext = createContext<VenueOwnerAuthContextType | undefined>(undefined);

export const useVenueOwnerAuth = () => {
  const context = useContext(VenueOwnerAuthContext);
  if (context === undefined) {
    throw new Error('useVenueOwnerAuth must be used within a VenueOwnerAuthProvider');
  }
  return context;
};

export const VenueOwnerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venueOwner, setVenueOwner] = useState<VenueOwner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedOwner = localStorage.getItem('venue_owner_session');
    if (storedOwner) {
      try {
        const parsed = JSON.parse(storedOwner);
        setVenueOwner(parsed);
      } catch (error) {
        console.error('Failed to parse stored venue owner session:', error);
        localStorage.removeItem('venue_owner_session');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('🔍 Attempting to sign in venue owner with email:', email);
      
      // First get the venue owner info (without password) using secure function
      const { data: ownerInfo, error: ownerError } = await supabase
        .rpc('get_venue_owner_by_email', { input_email: email.toLowerCase() });

      console.log('🏢 Venue owner query result:', { ownerInfo, ownerError });

      if (ownerError || !ownerInfo || ownerInfo.length === 0) {
        console.error('❌ Venue owner not found or query error:', ownerError);
        return { error: 'Invalid email or password' };
      }

      const owner = ownerInfo[0];

      // We need to compare the plain password with the stored hash
      // Since we can't get the hash directly, we'll use a different approach
      // Let's create a secure authentication function that handles password comparison internally
      console.log('🔐 Authenticating with secure function...');
      
      const { data: authenticatedId, error: authError } = await supabase
        .rpc('authenticate_venue_owner_with_password', { 
          input_email: email.toLowerCase(), 
          input_password: password 
        });

      console.log('✅ Authentication result:', { authenticatedId, authError });

      if (authError || !authenticatedId) {
        console.error('❌ Authentication failed');
        return { error: 'Invalid email or password' };
      }

      const ownerData: VenueOwner = {
        id: owner.id,
        email: owner.email,
        business_name: owner.business_name,
        contact_name: owner.contact_name,
        is_active: owner.is_active
      };

      console.log('✅ Sign in successful, setting venue owner data:', ownerData);
      setVenueOwner(ownerData);
      localStorage.setItem('venue_owner_session', JSON.stringify(ownerData));

      return {};
    } catch (error) {
      console.error('💥 Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = () => {
    setVenueOwner(null);
    localStorage.removeItem('venue_owner_session');
  };

  const value = {
    venueOwner,
    loading,
    signIn,
    signOut,
  };

  return (
    <VenueOwnerAuthContext.Provider value={value}>
      {children}
    </VenueOwnerAuthContext.Provider>
  );
};
