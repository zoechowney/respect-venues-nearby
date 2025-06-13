
import React, { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import { useMapbox } from '@/hooks/useMapbox';
import MapContainer from '@/components/map/MapContainer';

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

  if (mapboxError) {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Map Error</h3>
          <p className="text-red-800 text-sm">{mapboxError}</p>
        </div>
      </div>
    );
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
      onReset={() => {}} // No longer needed since token is hardcoded
    />
  );
};

export default InteractiveMap;
