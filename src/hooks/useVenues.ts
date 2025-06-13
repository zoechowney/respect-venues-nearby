
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Venue {
  id: string;
  business_name: string;
  business_type: string;
  contact_name: string;
  email: string;
  phone?: string;
  address: string;
  website?: string;
  description?: string;
  sign_style?: string;
  rating: number;
  reviews_count: number;
  features: string[];
  hours?: string;
  is_active: boolean;
  published_at: string;
  created_from_application_id?: string;
  venue_owner_id?: string;
  created_at: string;
  updated_at: string;
}

export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        console.log('🏢 Fetching venues from venues table...');
        
        const { data, error: fetchError } = await supabase
          .from('venues')
          .select('*')
          .eq('is_active', true)
          .order('published_at', { ascending: false });

        console.log('🔍 Venues query completed. Data:', data, 'Error:', fetchError);

        if (fetchError) {
          console.error('❌ Supabase query error:', fetchError);
          setError(`Database error: ${fetchError.message}`);
          return;
        }

        console.log('✅ Venues data received:', data?.length || 0, 'records');
        setVenues(data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Unexpected error in fetchVenues:', err);
        setError(`Failed to fetch venues: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const publishVenue = async (applicationId: string) => {
    try {
      // First, get the application data
      const { data: application, error: fetchError } = await supabase
        .from('venue_applications')
        .select('*')
        .eq('id', applicationId)
        .eq('status', 'approved')
        .single();

      if (fetchError || !application) {
        throw new Error('Application not found or not approved');
      }

      // Create the venue record
      const venueData = {
        business_name: application.business_name,
        business_type: application.business_type,
        contact_name: application.contact_name,
        email: application.email,
        phone: application.phone,
        address: application.address,
        website: application.website,
        description: application.description || `A welcoming ${application.business_type.toLowerCase()} that supports the transgender community.`,
        sign_style: application.sign_style,
        created_from_application_id: application.id,
        venue_owner_id: application.venue_owner_id,
        // Set default hours based on business type
        hours: application.business_type === 'pub' 
          ? 'Mon-Sun: 12:00 PM - 11:00 PM'
          : application.business_type === 'restaurant'
          ? 'Mon-Fri: 7:00 AM - 6:00 PM, Sat-Sun: 8:00 AM - 5:00 PM'
          : 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM'
      };

      const { error: insertError } = await supabase
        .from('venues')
        .insert([venueData]);

      if (insertError) {
        throw insertError;
      }

      // Update application status to 'published'
      const { error: updateError } = await supabase
        .from('venue_applications')
        .update({ status: 'published' })
        .eq('id', applicationId);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error) {
      console.error('Error publishing venue:', error);
      return { success: false, error };
    }
  };

  return { venues, isLoading, error, publishVenue };
};
