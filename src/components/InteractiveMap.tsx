
import React, { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import { useMapbox } from '@/hooks/useMapbox';
import MapContainer from '@/components/map/MapContainer';
import SimpleMap from '@/components/SimpleMap';

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues = [], 
  onVenueSelect 
}) => {
  const { mapboxgl, isLoading: mapboxLoading, error: mapboxError } = useMapbox();
  
  // Hardcoded Mapbox token
  const mapboxToken = 'pk.eyJ1IjoiemNob3duZXkiLCJhIjoiY21icXBrMGI5MDFtNjJxczcyeGdvb3J6MCJ9.nHu78L8iJ8HebbfUzQuhkw';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [useSimpleMap, setUseSimpleMap] = useState(false);

  // If Mapbox fails to load or encounters SecurityError, fall back to simple map
  useEffect(() => {
    if (mapboxError) {
      console.log('🗺️ Mapbox failed, using simple map fallback');
      setUseSimpleMap(true);
    }
  }, [mapboxError]);

  // Handle map initialization errors by falling back to simple map
  useEffect(() => {
    if (error && error.includes('SecurityError')) {
      console.log('🗺️ SecurityError detected, switching to simple map');
      setUseSimpleMap(true);
    }
  }, [error]);

  if (mapboxLoading) {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Loading Map...</h3>
          <p className="text-brand-navy/70 text-sm">Setting up the interactive map components...</p>
        </div>
      </div>
    );
  }

  // Use simple map if Mapbox failed or we detected SecurityError
  if (useSimpleMap || mapboxError) {
    return <SimpleMap venues={venues} onVenueSelect={onVenueSelect} />;
  }

  return (
    <MapContainer
      mapboxgl={mapboxgl}
      mapboxToken={mapboxToken}
      venues={venues}
      onVenueSelect={onVenueSelect}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      error={error}
      setError={setError}
      onReset={() => setUseSimpleMap(true)} // Switch to simple map on reset
    />
  );
};

export default InteractiveMap;
