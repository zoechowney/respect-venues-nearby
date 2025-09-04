import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from '@/types/venue';
import { MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { getBusinessTypeHexColor } from '@/lib/utils';

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
  center?: { lat: number; lng: number; zoom?: number };
  userLocation?: { latitude: number; longitude: number } | null;
  centerFromUrl?: boolean;
}

const RobustMap: React.FC<RobustMapProps> = ({ venues = [], onVenueSelect, center, userLocation, centerFromUrl = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentProvider, setCurrentProvider] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('🗺️ RobustMap: Initializing with venues:', venues.length);

  // Use only OpenStreetMap as it's most reliable in iframe environments
  const tileProvider = {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  };

  const initializeMap = () => {
    if (!mapRef.current) {
      setMapStatus('error');
      setErrorMessage('Unable to load map tiles. Map functionality is limited in this environment.');
      return;
    }

    console.log(`🗺️ RobustMap: Initializing with ${tileProvider.name}`);

    try {
      // Clean up existing map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // Initialize map with comprehensive options
      mapInstance.current = L.map(mapRef.current, {
        center: center ? [center.lat, center.lng] : [51.1858, -0.6149], // Use provided center or default to Godalming, Surrey
        zoom: center?.zoom || 12,
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

      // Explicitly set the map container's z-index to be lower than modals
      const mapContainer = mapInstance.current.getContainer();
      if (mapContainer) {
        mapContainer.style.zIndex = '1';
        // Also target all Leaflet panes to ensure they stay below modals
        const panes = mapContainer.querySelectorAll('.leaflet-pane');
        panes.forEach(pane => {
          (pane as HTMLElement).style.zIndex = '1';
        });
      }

      // Add global CSS to force Leaflet elements below modals and style tooltips
      if (!document.querySelector('style[data-leaflet-modal-fix]')) {
        const style = document.createElement('style');
        style.setAttribute('data-leaflet-modal-fix', 'true');
        style.textContent = `
          .leaflet-container,
          .leaflet-pane,
          .leaflet-map-pane,
          .leaflet-tile-pane,
          .leaflet-overlay-pane,
          .leaflet-shadow-pane,
          .leaflet-marker-pane,
          .leaflet-tooltip-pane,
          .leaflet-popup-pane,
          .leaflet-control-container {
            z-index: 1 !important;
          }
          .venue-tooltip {
            background-color: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 4px 8px !important;
            font-size: 12px !important;
            font-weight: 500 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          }
          .venue-tooltip:before {
            border-top-color: rgba(0, 0, 0, 0.8) !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      // Create tile layer with basic error handling (no provider switching)
      const tileLayer = L.tileLayer(tileProvider.url, {
        attribution: tileProvider.attribution,
        maxZoom: tileProvider.maxZoom,
        crossOrigin: true,
        errorTileUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2Y4ZmFmYyIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2Yjc0ODYiPk5vIERhdGE8L3RleHQ+PC9zdmc+'
      });

      let tilesLoaded = 0;

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

      // Simple error logging without provider switching
      tileLayer.on('tileerror', (e) => {
        console.log(`🗺️ RobustMap: Tile load error (normal during pan/zoom):`, e);
      });

      tileLayer.addTo(mapInstance.current);
      
      console.log(`🗺️ RobustMap: Map initialized with ${tileProvider.name}`);

    } catch (error) {
      console.error(`❌ RobustMap: Error initializing map:`, error);
      setMapStatus('error');
      setErrorMessage('Failed to initialize map');
    }
  };

  const retryMap = () => {
    setMapStatus('loading');
    setErrorMessage('');
    initializeMap();
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
      const color = getBusinessTypeHexColor(type);
      
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

      // Add hover tooltip with venue name
      marker.bindTooltip(venue.name, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'venue-tooltip'
      });

      // Add popup for click
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">${venue.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 0.875rem; color: #64748b;">${venue.type}</p>
          <p style="margin: 0 0 8px 0; font-size: 0.75rem; color: #94a3b8;">${venue.address}</p>
          <div style="display: flex; align-items: center; gap: 4px;">
            <span style="color: #eab308;">★</span>
            <span style="font-weight: 500; color: #1e293b;">${venue.rating > 0 ? venue.rating : '-'}</span>
          </div>
        </div>
      `);

      // Handle click events for modal
      marker.on('click', () => {
        console.log('🖱️ RobustMap: Venue marker clicked:', venue.name);
        if (onVenueSelect) {
          onVenueSelect(venue);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all venues, unless a specific center is provided
    if (venues.length > 0 && !center) {
      const group = L.featureGroup(markersRef.current);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        mapInstance.current.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      }
    }

    console.log('✅ RobustMap: Added', markersRef.current.length, 'markers');
  }, [venues, onVenueSelect, mapStatus]);

  // Add or update user location marker
  useEffect(() => {
    if (!mapInstance.current || mapStatus !== 'loaded') return;

    // Remove existing user location marker
    if (userLocationMarkerRef.current) {
      mapInstance.current.removeLayer(userLocationMarkerRef.current);
      userLocationMarkerRef.current = null;
    }

    // Add new user location marker if location is available
    if (userLocation) {
      console.log('📍 RobustMap: Adding user location marker');
      
      // Create a distinctive user location icon
      const userLocationIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div style="
          width: 20px; 
          height: 20px; 
          background-color: #3b82f6; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 0 0 2px #3b82f6, 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            width: 6px;
            height: 6px;
            background-color: white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
          "></div>
        </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userLocationMarkerRef.current = L.marker(
        [userLocation.latitude, userLocation.longitude], 
        { icon: userLocationIcon }
      ).addTo(mapInstance.current);

      // Add tooltip for user location
      userLocationMarkerRef.current.bindTooltip('Your Location', {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'venue-tooltip'
      });

      // Add popup for user location
      userLocationMarkerRef.current.bindPopup(`
        <div style="min-width: 150px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">📍 Your Location</h3>
          <p style="margin: 0; font-size: 0.75rem; color: #94a3b8;">
            ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}
          </p>
        </div>
      `);
    }
  }, [userLocation, mapStatus]);

  // Update map center when center prop changes (for "Show on Map" functionality)
  useEffect(() => {
    if (!mapInstance.current || mapStatus !== 'loaded' || !center) return;
    
    console.log('🗺️ RobustMap: Centering map on coordinates:', center);
    mapInstance.current.setView([center.lat, center.lng], center.zoom || 14, {
      animate: true,
      duration: 1.0
    });
  }, [center, mapStatus]);

  // Update map center when user location becomes available
  useEffect(() => {
    if (!mapInstance.current || !userLocation || mapStatus !== 'loaded') {
      console.log('📍 RobustMap: Skipping recenter - missing requirements:', { 
        hasMap: !!mapInstance.current, 
        hasLocation: !!userLocation, 
        status: mapStatus 
      });
      return;
    }
    
    // Only recenter if no URL center was provided (allow recentering when center comes from user location)
    if (!centerFromUrl) {
      console.log('📍 RobustMap: Centering map on user location:', userLocation);
      mapInstance.current.setView([userLocation.latitude, userLocation.longitude], 14, {
        animate: true,
        duration: 1.0
      });
    } else {
      console.log('📍 RobustMap: Skipping recenter - URL center provided:', center);
    }
  }, [userLocation, mapStatus, centerFromUrl]);

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
    <div className="space-y-4">
      <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative z-10">
        <div ref={mapRef} className="w-full h-full z-10" />
        
        {mapStatus === 'loading' && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-light-blue to-trans-pink/30 flex items-center justify-center">
            <div className="text-center max-w-md bg-white/90 rounded-lg p-6 shadow-lg">
              <div className="animate-spin w-8 h-8 border-4 border-trans-blue border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-brand-navy mb-2">Loading Map</h3>
              <p className="text-brand-navy/70 text-sm">
                Loading OpenStreetMap tiles...
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

      {/* Map Legend */}
      {mapStatus === 'loaded' && (venues.length > 0 || userLocation) && (
        <div className="bg-white/90 backdrop-blur-sm border border-trans-blue/20 rounded-lg p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-brand-navy mb-3">Map Legend</h4>
          
          {/* User Location Legend */}
          {userLocation && (
            <div className="mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 relative"
                  style={{ 
                    backgroundColor: '#3b82f6',
                    boxShadow: '0 0 0 1px #3b82f6, 0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  <div 
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <span className="text-xs text-brand-navy font-medium">Your Location</span>
              </div>
            </div>
          )}
          
          {/* Business Types Legend */}
          {venues.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { type: 'pub', label: 'Pubs' },
                { type: 'restaurant', label: 'Restaurants' },
                { type: 'shop', label: 'Shops' },
                { type: 'gym', label: 'Gyms' },
                { type: 'cinema', label: 'Cinemas' },
                { type: 'office', label: 'Offices' }
              ].map(({ type, label }) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: getBusinessTypeHexColor(type) }}
                  />
                  <span className="text-xs text-brand-navy font-medium">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RobustMap;