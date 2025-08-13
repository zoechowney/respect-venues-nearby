
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
  distance?: string | null;
  distanceInMiles?: number | null; // For sorting purposes
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
        console.log('🏢 Starting venue fetch using secure function...');
        
        const { data, error: fetchError } = await supabase
          .rpc('get_public_venues');

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

        // Calculate distance for each venue and transform data
        const transformedVenues: ApprovedVenue[] = data.map((venue) => {
          const distanceInKm = userLocation && venue.latitude && venue.longitude 
            ? calculateDistance(userLocation, { latitude: venue.latitude, longitude: venue.longitude })
            : null;
          const distanceInMiles = distanceInKm ? distanceInKm * 0.621371 : null;

          return {
            id: venue.id,
            name: venue.business_name,
            type: venue.business_type,
            address: venue.address,
            phone: undefined, // Phone is not available in public data for security
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
            distance: distanceInMiles ? `${distanceInMiles.toFixed(1)} miles` : null,
            distanceInMiles,
            latitude: venue.latitude,
            longitude: venue.longitude
          };
        });

        // Sort venues by distance if user location is available, otherwise by publication date
        const sortedVenues = userLocation 
          ? transformedVenues.sort((a, b) => {
              // Venues with distance come first, sorted by distance
              if (a.distanceInMiles !== null && b.distanceInMiles !== null) {
                return a.distanceInMiles - b.distanceInMiles;
              }
              // Venues without distance go to the end
              if (a.distanceInMiles === null && b.distanceInMiles !== null) return 1;
              if (a.distanceInMiles !== null && b.distanceInMiles === null) return -1;
              // If both have no distance, sort by publication date (already sorted from DB)
              return 0;
            })
          : transformedVenues; // Keep original publication date order if no location

        console.log('✅ Transformed venues ready:', sortedVenues.length);
        setVenues(sortedVenues);
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
