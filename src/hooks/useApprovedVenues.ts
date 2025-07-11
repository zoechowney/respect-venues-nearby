
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, getCurrentLocation, Coordinates } from '@/lib/geolocation';

export interface ApprovedVenue {
  id: string;
  name: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  description?: string;
  rating: number;
  reviews: number;
  features: string[];
  hours: string;
  openNow: boolean;
  distance?: string;
  latitude?: number;
  longitude?: number;
}

export const useApprovedVenues = () => {
  const [venues, setVenues] = useState<ApprovedVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  // Get user location once when hook initializes
  useEffect(() => {
    getCurrentLocation()
      .then(setUserLocation)
      .catch(() => {
        // Silently fail - we'll show distances as N/A if no location
        console.log('User location not available for distance calculations');
      });
  }, []);

  useEffect(() => {
    const fetchApprovedVenues = async () => {
      try {
        console.log('🏢 Starting venue fetch from venues table...');
        
        const { data, error: fetchError } = await supabase
          .from('venues')
          .select('*, latitude, longitude')
          .eq('is_active', true)
          .order('published_at', { ascending: false });

        console.log('🔍 Query completed. Data:', data, 'Error:', fetchError);

        if (fetchError) {
          console.error('❌ Supabase query error:', fetchError);
          setError(`Database error: ${fetchError.message}`);
          return;
        }

        if (!data) {
          console.log('⚠️ No data returned from query');
          setVenues([]);
          setError(null);
          return;
        }

        console.log('✅ Raw venue data received:', data.length, 'records');

        // Transform venues data to match the expected interface
        const transformedVenues: ApprovedVenue[] = data.map((venue) => ({
          id: venue.id,
          name: venue.business_name,
          type: venue.business_type,
          address: venue.address,
          phone: venue.phone || undefined,
          website: venue.website || undefined,
          description: venue.description || `A welcoming ${venue.business_type.toLowerCase()} that supports the transgender community.`,
          rating: venue.rating || 0,
          reviews: venue.reviews_count || 0,
          features: venue.features || [
            'Transgender Friendly',
            'Staff Trained',
            'Safe Space',
            venue.business_type === 'restaurant' ? 'All-Gender Facilities' : 'Accessible'
          ],
          hours: venue.hours || (venue.business_type === 'pub' 
            ? 'Mon-Sun: 12:00 PM - 11:00 PM'
            : venue.business_type === 'restaurant'
            ? 'Mon-Fri: 7:00 AM - 6:00 PM, Sat-Sun: 8:00 AM - 5:00 PM'
            : 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM'),
          openNow: Math.random() > 0.3,
          distance: userLocation && venue.latitude && venue.longitude 
            ? `${(calculateDistance(userLocation, { latitude: venue.latitude, longitude: venue.longitude }) * 0.621371).toFixed(1)} miles`
            : null, // No distance if no user location or venue coordinates
          latitude: venue.latitude,
          longitude: venue.longitude
        }));

        console.log('✅ Transformed venues ready:', transformedVenues.length);
        setVenues(transformedVenues);
        setError(null);
      } catch (err) {
        console.error('❌ Unexpected error in fetchApprovedVenues:', err);
        setError(`Failed to fetch venues: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        console.log('🏁 Setting loading to false');
        setIsLoading(false);
      }
    };

    fetchApprovedVenues();
  }, [userLocation]); // Re-fetch when user location changes

  return { venues, isLoading, error };
};
