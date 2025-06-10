
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Venue {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  openNow: boolean;
  features: string[];
  coordinates: [number, number]; // [longitude, latitude]
}

// Mock venues with coordinates for London area
const mockVenuesWithCoordinates: Venue[] = [
  {
    id: 1,
    name: "The Rainbow Pub",
    type: "Pub",
    address: "123 High Street, London",
    rating: 4.8,
    openNow: true,
    features: ["Accessible", "Family Friendly", "Staff Trained"],
    coordinates: [-0.1276, 51.5074] // London coordinates
  },
  {
    id: 2,
    name: "Inclusive Café",
    type: "Restaurant", 
    address: "456 Market Square, London",
    rating: 4.9,
    openNow: true,
    features: ["Gender Neutral Facilities", "Quiet Space"],
    coordinates: [-0.1300, 51.5100]
  },
  {
    id: 3,
    name: "Unity Fitness",
    type: "Gym",
    address: "789 Park Road, London", 
    rating: 4.7,
    openNow: false,
    features: ["Private Changing Rooms", "All Welcome Policy"],
    coordinates: [-0.1250, 51.5050]
  }
];

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues = mockVenuesWithCoordinates, 
  onVenueSelect 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically import mapbox-gl to avoid build issues
  useEffect(() => {
    const loadMapbox = async () => {
      try {
        const mapboxModule = await import('mapbox-gl');
        // Import CSS separately and ensure it's loaded
        await import('mapbox-gl/dist/mapbox-gl.css');
        setMapboxgl(mapboxModule.default);
        console.log('Mapbox GL loaded successfully');
      } catch (error) {
        console.error('Failed to load Mapbox GL:', error);
      }
    };
    loadMapbox();
  }, []);

  // Initialize map when showMap becomes true and container is available
  useEffect(() => {
    if (showMap && mapContainer.current && mapboxgl && mapboxToken) {
      console.log('Initializing map with container available');
      
      try {
        mapboxgl.accessToken = mapboxToken;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-0.1276, 51.5074], // London center
          zoom: 12
        });

        console.log('Map created, adding controls and markers...');

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add markers for venues
        venues.forEach((venue) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          
          // Color code by venue type
          if (venue.type === 'Pub') {
            el.style.backgroundColor = '#60a5fa'; // trans-blue
          } else if (venue.type === 'Restaurant') {
            el.style.backgroundColor = '#f472b6'; // trans-pink
          } else {
            el.style.backgroundColor = '#374151'; // brand-navy
          }

          const marker = new mapboxgl.Marker(el)
            .setLngLat(venue.coordinates)
            .addTo(map.current!);

          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-sm mb-1">${venue.name}</h3>
                <p class="text-xs text-gray-600 mb-2">${venue.type} • ${venue.address}</p>
                <div class="flex justify-between items-center">
                  <span class="text-xs ${venue.openNow ? 'text-green-600' : 'text-red-600'}">
                    ${venue.openNow ? 'Open Now' : 'Closed'}
                  </span>
                  <span class="text-xs font-medium">★ ${venue.rating}</span>
                </div>
              </div>
            `);

          marker.setPopup(popup);

          // Handle click events
          el.addEventListener('click', () => {
            if (onVenueSelect) {
              onVenueSelect(venue);
            }
          });
        });

        map.current.on('load', () => {
          console.log('Map fully loaded');
          setIsLoading(false);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
        setShowMap(false);
      }
    }
  }, [showMap, mapboxgl, mapboxToken, venues, onVenueSelect]);

  const handleInitializeMap = () => {
    console.log('Initialize map clicked', { 
      token: !!mapboxToken, 
      mapboxgl: !!mapboxgl 
    });

    if (!mapboxToken || !mapboxgl) {
      console.log('Missing token or mapboxgl');
      return;
    }

    setIsLoading(true);
    setShowMap(true);
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  if (!mapboxgl) {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Loading Map...</h3>
          <p className="text-brand-navy/70 text-sm">Setting up the interactive map components...</p>
        </div>
      </div>
    );
  }

  if (!showMap) {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Interactive Map Setup</h3>
          <p className="text-brand-navy/70 mb-4 text-sm">
            To display the interactive map, please enter your Mapbox public token. 
            You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-trans-blue underline">mapbox.com</a>
          </p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="text-sm"
            />
            <Button 
              onClick={handleInitializeMap}
              disabled={!mapboxToken || isLoading}
              className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
            >
              {isLoading ? 'Initializing...' : 'Initialize Map'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Initializing Map...</h3>
          <p className="text-brand-navy/70 text-sm">Setting up your Mapbox map with venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default InteractiveMap;
