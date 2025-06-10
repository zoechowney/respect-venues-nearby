
import React, { useState } from 'react';
import { Venue } from '@/types/venue';
import { useMapbox } from '@/hooks/useMapbox';
import { useVenueData } from '@/hooks/useVenueData';
import MapSetup from '@/components/map/MapSetup';
import MapContainer from '@/components/map/MapContainer';

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues, 
  onVenueSelect 
}) => {
  const venueData = useVenueData(venues);
  const { mapboxgl, isLoading: mapboxLoading, error: mapboxError } = useMapbox();
  
  const [mapboxToken, setMapboxToken] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInitializeMap = () => {
    console.log('🎯 Initialize map button clicked', { 
      hasToken: !!mapboxToken, 
      hasMapboxgl: !!mapboxgl,
      tokenFormat: mapboxToken.startsWith('pk.') ? 'valid format' : 'invalid format'
    });

    if (!mapboxToken || !mapboxgl) {
      console.log('❌ Missing token or mapboxgl library');
      setError('Missing Mapbox token or library not loaded');
      return;
    }

    // Validate token format (should start with 'pk.')
    if (!mapboxToken.startsWith('pk.')) {
      console.log('❌ Invalid token format');
      setError('Invalid Mapbox token format. Token should start with "pk."');
      return;
    }

    console.log('✅ All validations passed, proceeding with map initialization');
    setError('');
    setIsLoading(true);
    setShowMap(true);
  };

  const handleReset = () => {
    setShowMap(false);
    setIsLoading(false);
    setError('');
  };

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

  if (!showMap) {
    return (
      <MapSetup
        mapboxToken={mapboxToken}
        setMapboxToken={setMapboxToken}
        onInitialize={handleInitializeMap}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <MapContainer
      mapboxgl={mapboxgl}
      mapboxToken={mapboxToken}
      venues={venueData}
      onVenueSelect={onVenueSelect}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      error={error}
      setError={setError}
      onReset={handleReset}
    />
  );
};

export default InteractiveMap;
