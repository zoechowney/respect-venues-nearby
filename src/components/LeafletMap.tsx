import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Venue } from '@/types/venue';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface LeafletMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ venues = [], onVenueSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    console.log('🗺️ LeafletMap: Initializing Leaflet map');

    // Initialize map
    mapInstance.current = L.map(mapRef.current, {
      center: [51.1858, -0.6149], // Godalming, Surrey
      zoom: 12,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance.current);

    console.log('✅ LeafletMap: Map initialized successfully');

    // Cleanup
    return () => {
      if (mapInstance.current) {
        console.log('🧹 LeafletMap: Cleaning up map');
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Add markers when venues change
  useEffect(() => {
    if (!mapInstance.current || !venues.length) return;

    console.log('🗺️ LeafletMap: Adding markers for', venues.length, 'venues');

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
          transform: translate(-50%, -100%);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });
    };

    // Add markers for each venue
    venues.forEach((venue, index) => {
      // Use the coordinates from the venue data
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
          <p style="margin: 0 0 4px 0; font-size: 0.875rem; color: #64748b;">${venue.type} • ${venue.address}</p>
          <div style="display: flex; align-items: center; gap: 4px; margin-top: 8px;">
            <span style="color: #eab308;">★</span>
            <span style="font-weight: 500; color: #1e293b;">${venue.rating}</span>
          </div>
        </div>
      `);

      // Handle click events
      marker.on('click', () => {
        console.log('🖱️ LeafletMap: Venue marker clicked:', venue.name);
        if (onVenueSelect) {
          onVenueSelect(venue);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all venues if there are any
    if (venues.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstance.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }

    console.log('✅ LeafletMap: Added', markersRef.current.length, 'markers');
  }, [venues, onVenueSelect]);

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default LeafletMap;