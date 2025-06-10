
import { useEffect } from 'react';
import { Venue } from '@/types/venue';

interface MapMarkersProps {
  map: any;
  mapboxgl: any;
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({
  map,
  mapboxgl,
  venues,
  onVenueSelect
}) => {
  useEffect(() => {
    if (!map || !mapboxgl || !venues.length) return;

    console.log('📍 Adding venue markers...');
    
    venues.forEach((venue, index) => {
      console.log(`📍 Adding marker ${index + 1} for ${venue.name}:`, venue.coordinates);
      
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

      try {
        const marker = new mapboxgl.Marker(el)
          .setLngLat(venue.coordinates)
          .addTo(map);

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

        console.log(`✅ Marker ${index + 1} added successfully`);
      } catch (markerError) {
        console.error(`❌ Error adding marker ${index + 1}:`, markerError);
      }
    });

    console.log('🎯 All markers added');
  }, [map, mapboxgl, venues, onVenueSelect]);

  return null; // This component doesn't render anything visual
};

export default MapMarkers;
