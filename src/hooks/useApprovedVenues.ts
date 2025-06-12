
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useApprovedVenues = () => {
  const [venues, setVenues] = useState<ApprovedVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApprovedVenues = async () => {
      try {
        console.log('🏢 Fetching approved venues...');
        const { data, error } = await supabase
          .from('venue_applications')
          .select('*')
          .eq('status', 'approved');

        if (error) {
          console.error('❌ Error fetching venues:', error);
          setError(error.message);
          return;
        }

        console.log('✅ Approved venues fetched:', data);

        // Transform database records to venue format
        const transformedVenues: ApprovedVenue[] = data?.map((application) => ({
          id: application.id,
          name: application.business_name,
          type: application.business_type,
          address: application.address,
          phone: application.phone || undefined,
          website: application.website || undefined,
          description: application.description || `A welcoming ${application.business_type.toLowerCase()} that supports the transgender community.`,
          rating: 4.8, // Default rating for now
          reviews: Math.floor(Math.random() * 50) + 10, // Random review count for now
          features: [
            'Transgender Friendly',
            'Staff Trained',
            'Safe Space',
            application.business_type === 'restaurant' ? 'All-Gender Facilities' : 'Accessible'
          ],
          hours: application.business_type === 'pub' 
            ? 'Mon-Sun: 12:00 PM - 11:00 PM'
            : application.business_type === 'restaurant'
            ? 'Mon-Fri: 7:00 AM - 6:00 PM, Sat-Sun: 8:00 AM - 5:00 PM'
            : 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 5:00 PM',
          openNow: Math.random() > 0.3, // Random open status for now
          distance: `${(Math.random() * 2 + 0.1).toFixed(1)} miles`
        })) || [];

        setVenues(transformedVenues);
      } catch (err) {
        console.error('❌ Error in fetchApprovedVenues:', err);
        setError('Failed to fetch venues');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedVenues();
  }, []);

  return { venues, isLoading, error };
};
