import { supabase } from '@/integrations/supabase/client';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('geocode-address', {
      body: { address }
    });

    if (error) {
      console.error('Geocoding error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to geocode address:', error);
    return null;
  }
};

export const updateVenueCoordinates = async (venueId: string, latitude: number, longitude: number) => {
  try {
    const { error } = await supabase
      .from('venues')
      .update({ latitude, longitude })
      .eq('id', venueId);

    if (error) {
      console.error('Failed to update venue coordinates:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to update venue coordinates:', error);
    return false;
  }
};