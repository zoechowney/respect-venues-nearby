import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { geocodeAddress, updateVenueCoordinates } from '@/lib/geocoding';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Loader2 } from 'lucide-react';

const GeocodeVenues: React.FC = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();

  const geocodeAllVenues = async () => {
    setIsGeocoding(true);
    setProgress({ current: 0, total: 0 });

    try {
      // Get venues without coordinates
      const { data: venues, error } = await supabase
        .from('venues')
        .select('id, business_name, address, latitude, longitude')
        .eq('is_active', true)
        .or('latitude.is.null,longitude.is.null');

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch venues",
          variant: "destructive",
        });
        return;
      }

      if (!venues || venues.length === 0) {
        toast({
          title: "No venues to geocode",
          description: "All active venues already have coordinates",
        });
        return;
      }

      setProgress({ current: 0, total: venues.length });

      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < venues.length; i++) {
        const venue = venues[i];
        setProgress({ current: i + 1, total: venues.length });

        console.log(`Geocoding ${venue.business_name} at ${venue.address}`);

        const result = await geocodeAddress(venue.address);
        
        if (result) {
          const success = await updateVenueCoordinates(
            venue.id, 
            result.latitude, 
            result.longitude
          );
          
          if (success) {
            successCount++;
            console.log(`✅ Geocoded ${venue.business_name}`);
          } else {
            failureCount++;
            console.log(`❌ Failed to update coordinates for ${venue.business_name}`);
          }
        } else {
          failureCount++;
          console.log(`❌ Failed to geocode ${venue.business_name}`);
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Geocoding complete",
        description: `Successfully geocoded ${successCount} venues. ${failureCount} failed.`,
      });

    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Error",
        description: "Failed to geocode venues",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Geocode Venues</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This will add precise latitude/longitude coordinates to venues that don't have them yet.
        </p>
      </div>

      {isGeocoding && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">
              Geocoding venues... ({progress.current}/{progress.total})
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Button
        onClick={geocodeAllVenues}
        disabled={isGeocoding}
        className="flex items-center gap-2"
      >
        <MapPin className="w-4 h-4" />
        {isGeocoding ? 'Geocoding...' : 'Geocode All Venues'}
      </Button>
    </div>
  );
};

export default GeocodeVenues;