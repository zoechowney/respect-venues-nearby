import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from '@/types/venue';
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface RobustMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const RobustMap: React.FC<RobustMapProps> = ({ venues = [], onVenueSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentProvider, setCurrentProvider] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('🗺️ RobustMap: Initializing with venues:', venues.length);

  const tileProviders = [
    {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    },
    {
      name: 'CartoDB Positron',
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    },
    {
      name: 'CartoDB Dark Matter',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20
    },
    {
      name: 'Stamen Terrain',
      url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> — Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }
  ];

  const initializeMap = (providerIndex = 0) => {
    if (!mapRef.current || providerIndex >= tileProviders.length) {
      setMapStatus('error');
      setErrorMessage('Unable to load map tiles. Map functionality is limited in this environment.');
      return;
    }

    console.log(`🗺️ RobustMap: Trying provider ${providerIndex + 1}/${tileProviders.length}: ${tileProviders[providerIndex].name}`);
    setCurrentProvider(providerIndex);

    try {
      // Clean up existing map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // Initialize map with comprehensive options
      mapInstance.current = L.map(mapRef.current, {
        center: [51.1858, -0.6149], // Godalming, Surrey
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true,
        worldCopyJump: false,
        maxBounds: [[-90, -180], [90, 180]], // World bounds
        maxZoom: 18,
        minZoom: 2
      });

      const provider = tileProviders[providerIndex];
      
      // Create tile layer with robust error handling
      const tileLayer = L.tileLayer(provider.url, {
        attribution: provider.attribution,
        maxZoom: provider.maxZoom,
        crossOrigin: true,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2Yjc0ODYiPk5vIERhdGE8L3RleHQ+PC9zdmc+'
      });

      let tilesLoaded = 0;
      let tilesErrored = 0;
      let loadCheckTimeout: NodeJS.Timeout;

      tileLayer.on('tileload', () => {
        tilesLoaded++;
        console.log(`🗺️ RobustMap: Tiles loaded: ${tilesLoaded}`);
        
        // If we've loaded some tiles successfully, consider it working
        if (tilesLoaded >= 3) {
          setMapStatus('loaded');
          setErrorMessage('');
          console.log('✅ RobustMap: Map loaded successfully');
        }
      });

      tileLayer.on('tileerror', () => {
        tilesErrored++;
        console.log(`🗺️ RobustMap: Tile errors: ${tilesErrored}`);
        
        // If too many tiles fail, try next provider
        if (tilesErrored >= 5) {
          console.log(`❌ RobustMap: Too many tile errors for ${provider.name}, trying next provider`);
          clearTimeout(loadCheckTimeout);
          setTimeout(() => initializeMap(providerIndex + 1), 500);
        }
      });

      // Set a timeout to check if map is working
      loadCheckTimeout = setTimeout(() => {
        if (tilesLoaded === 0) {
          console.log(`⏰ RobustMap: Timeout for ${provider.name}, trying next provider`);
          initializeMap(providerIndex + 1);
        }
      }, 5000);

      tileLayer.addTo(mapInstance.current);
      
      console.log(`🗺️ RobustMap: Map initialized with ${provider.name}`);

    } catch (error) {
      console.error(`❌ RobustMap: Error initializing map with provider ${providerIndex}:`, error);
      setTimeout(() => initializeMap(providerIndex + 1), 100);
    }
  };

  const retryMap = () => {
    setMapStatus('loading');
    setErrorMessage('');
    initializeMap(0);
  };

  useEffect(() => {
    if (!mapRef.current) return;
    initializeMap();

    return () => {
      if (mapInstance.current) {
        console.log('🧹 RobustMap: Cleaning up map');
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add markers when venues change
  useEffect(() => {
    if (!mapInstance.current || !venues.length || mapStatus !== 'loaded') return;

    console.log('🗺️ RobustMap: Adding markers for', venues.length, 'venues');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Create custom icons for different venue types
    const createCustomIcon = (type: string) => {
      const color = type.toLowerCase() === 'pub' ? '#60a5fa' : 
                   type.toLowerCase() === 'restaurant' ? '#f472b6' : '#374151';
      
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px; 
          height: 24px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
    };

    // Add markers for each venue
    venues.forEach((venue) => {
      const [lng, lat] = venue.coordinates;
      
      if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
        console.warn('Invalid coordinates for venue:', venue.name, venue.coordinates);
        return;
      }

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(venue.type)
      }).addTo(mapInstance.current!);

      // Add popup
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">${venue.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 0.875rem; color: #64748b;">${venue.type}</p>
          <p style="margin: 0 0 8px 0; font-size: 0.75rem; color: #94a3b8;">${venue.address}</p>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #eab308;">★</span>
            <span style="font-weight: 500; color: #1e293b;">${venue.rating}</span>
          </div>
        </div>
      `);

      // Handle click events
      marker.on('click', () => {
        console.log('🖱️ RobustMap: Venue marker clicked:', venue.name);
        if (onVenueSelect) {
          onVenueSelect(venue);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all venues
    if (venues.length > 0) {
      const group = L.featureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      }
    }

    console.log('✅ RobustMap: Added', markersRef.current.length, 'markers');
  }, [venues, onVenueSelect, mapStatus]);

  if (mapStatus === 'error') {
    return (
      <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center max-w-md bg-white/90 rounded-lg p-6 shadow-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Failed</h3>
          <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
          <button
            onClick={retryMap}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full" />
      
      {mapStatus === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-light-blue to-trans-pink/30 flex items-center justify-center">
          <div className="text-center max-w-md bg-white/90 rounded-lg p-6 shadow-lg">
            <div className="animate-spin w-8 h-8 border-4 border-trans-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-brand-navy mb-2">Loading Map</h3>
            <p className="text-brand-navy/70 text-sm">
              Trying provider: {tileProviders[currentProvider]?.name || 'Unknown'}
            </p>
          </div>
        </div>
      )}
      
      {mapStatus === 'loaded' && venues.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-md bg-white/90 rounded-lg p-6 shadow-lg">
            <MapPin className="w-12 h-12 text-brand-navy/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-navy mb-2">No Venues to Display</h3>
            <p className="text-brand-navy/70 text-sm">
              Venues will appear on this map once they match your search criteria.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RobustMap;