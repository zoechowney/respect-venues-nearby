
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
      const { data: owner, error } = await supabase
        .from('venue_owners')
        .select('id, email, password_hash, business_name, contact_name, is_active')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error || !owner) {
        return { error: 'Invalid email or password' };
      }

      const passwordMatch = await bcrypt.compare(password, owner.password_hash);
      if (!passwordMatch) {
        return { error: 'Invalid email or password' };
      }

      const ownerData: VenueOwner = {
        id: owner.id,
        email: owner.email,
        business_name: owner.business_name,
        contact_name: owner.contact_name,
        is_active: owner.is_active
      };

      setVenueOwner(ownerData);
      localStorage.setItem('venue_owner_session', JSON.stringify(ownerData));

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
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
