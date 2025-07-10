
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Venue } from '@/types/venue';
import MapMarkers from './MapMarkers';

interface MapContainerProps {
  mapboxgl: any;
  mapboxToken: string;
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  onReset: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapboxgl,
  mapboxToken,
  venues,
  onVenueSelect,
  isLoading,
  setIsLoading,
  error,
  setError,
  onReset
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapboxgl || !mapboxToken || !mapContainer.current) return;

    const initializeMap = () => {
      if (!mapContainer.current) {
        console.log('⏳ Container not ready, retrying...');
        requestAnimationFrame(initializeMap);
        return;
      }

      console.log('🚀 All conditions met, starting map initialization...');
      
      try {
        console.log('🔑 Setting Mapbox access token...');
        mapboxgl.accessToken = mapboxToken;
        
        console.log('🗺️ Creating map instance...');
        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-0.6149, 51.1858], // Godalming, Surrey coordinates
          zoom: 12,
          // Disable workers to avoid SecurityError in iframe environments
          workerClass: null,
          transformRequest: (url, resourceType) => {
            // Return the URL as-is, no transformations needed
            return { url };
          }
        });

        map.current = mapInstance;
        console.log('✅ Map instance created successfully');

        // Add comprehensive error handler for map
        mapInstance.on('error', (e: any) => {
          console.error('❌ Mapbox error event:', e);
          console.error('❌ Error details:', e.error);
          setError(`Map error: ${e.error?.message || 'Unknown Mapbox error'}`);
          setIsLoading(false);
        });

        // Add load handler
        mapInstance.on('load', () => {
          console.log('🎉 Map loaded successfully!');
          setIsLoading(false);
          setError('');
          setMapReady(true); // Set map as ready for markers
        });

        console.log('🧭 Adding navigation controls...');
        // Add navigation controls
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

        console.log('🎯 Map initialization complete');

      } catch (error) {
        console.error('❌ Critical error during map initialization:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        setError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    // Start initialization using requestAnimationFrame for better DOM readiness
    requestAnimationFrame(initializeMap);

    // Cleanup
    return () => {
      if (map.current) {
        console.log('🧹 Cleaning up map...');
        map.current.remove();
        setMapReady(false);
      }
    };
  }, [mapboxgl, mapboxToken, setIsLoading, setError]);

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative">
      <div ref={mapContainer} className="w-full h-full" />
      {mapReady && (
        <MapMarkers 
          map={map.current} 
          mapboxgl={mapboxgl} 
          venues={venues} 
          onVenueSelect={onVenueSelect} 
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light-blue to-trans-pink/30 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold text-brand-navy mb-4">Initializing Map...</h3>
            <p className="text-brand-navy/70 text-sm">Setting up your Mapbox map with venues...</p>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
                <Button 
                  onClick={onReset}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                >
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;
