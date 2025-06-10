
import { useState, useEffect } from 'react';

export const useMapbox = () => {
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadMapbox = async () => {
      try {
        console.log('🗺️ Starting Mapbox GL import...');
        const mapboxModule = await import('mapbox-gl');
        // Import CSS separately and ensure it's loaded
        await import('mapbox-gl/dist/mapbox-gl.css');
        setMapboxgl(mapboxModule.default);
        console.log('✅ Mapbox GL loaded successfully');
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Failed to load Mapbox GL:', error);
        setError('Failed to load Mapbox GL library');
        setIsLoading(false);
      }
    };
    loadMapbox();
  }, []);

  return { mapboxgl, isLoading, error };
};
