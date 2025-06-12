
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
    console.log('📍 MapMarkers useEffect triggered with:', { 
      hasMap: !!map, 
      hasMapboxgl: !!mapboxgl, 
      venuesCount: venues?.length || 0,
      venues: venues
    });

    if (!map || !mapboxgl || !venues?.length) {
      console.log('📍 MapMarkers early return - missing requirements');
      return;
    }

    console.log('📍 Starting marker creation process...');
    
    // Clear existing markers first
    const existingMarkers = document.querySelectorAll('.custom-marker');
    console.log('📍 Clearing existing markers:', existingMarkers.length);
    existingMarkers.forEach(marker => marker.remove());
    
    venues.forEach((venue, index) => {
      console.log(`📍 Processing venue ${index + 1}:`, venue);
      
      // Ensure coordinates are valid numbers
      const [lng, lat] = venue.coordinates;
      console.log(`📍 Coordinates for ${venue.name}:`, { lng, lat });
      
      if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
        console.error(`❌ Invalid coordinates for ${venue.name}:`, venue.coordinates);
        return;
      }
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.zIndex = '1000';
      el.style.position = 'absolute';
      
      // Color code by venue type
      if (venue.type.toLowerCase() === 'pub') {
        el.style.backgroundColor = '#60a5fa'; // trans-blue
      } else if (venue.type.toLowerCase() === 'restaurant') {
        el.style.backgroundColor = '#f472b6'; // trans-pink
      } else {
        el.style.backgroundColor = '#374151'; // brand-navy
      }

      console.log(`📍 Created marker element for ${venue.name} with background:`, el.style.backgroundColor);

      try {
        console.log(`📍 Creating Mapbox marker for ${venue.name} at [${lng}, ${lat}]`);
        
        // Check if map is ready
        if (!map.isStyleLoaded()) {
          console.log('📍 Map style not loaded yet, waiting...');
          map.on('styledata', () => {
            console.log('📍 Map style loaded, creating marker...');
            createMarker();
          });
          return;
        }
        
        createMarker();
        
        function createMarker() {
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);

          console.log(`✅ Marker created and added to map for ${venue.name}`);

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
            console.log('📍 Marker clicked:', venue.name);
            if (onVenueSelect) {
              onVenueSelect(venue);
            }
          });
        }

        console.log(`✅ Marker ${index + 1} processing complete for ${venue.name}`);
      } catch (markerError) {
        console.error(`❌ Error creating marker ${index + 1} for ${venue.name}:`, markerError);
      }
    });

    console.log('🎯 All markers processing complete');
  }, [map, mapboxgl, venues, onVenueSelect]);

  return null;
};

export default MapMarkers;
