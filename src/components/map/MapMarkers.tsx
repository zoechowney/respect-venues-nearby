
import { useEffect } from 'react';
import { Venue } from '@/types/venue';
import { getBusinessTypeHexColor } from '@/lib/utils';

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
    console.log('🚀 MapMarkers useEffect triggered');
    console.log('📊 MapMarkers props check:', { 
      hasMap: !!map, 
      hasMapboxgl: !!mapboxgl, 
      venuesCount: venues?.length || 0,
      mapReady: map?.isStyleLoaded?.() || false
    });

    if (!map || !mapboxgl) {
      console.log('❌ MapMarkers: Missing map or mapboxgl');
      return;
    }

    if (!venues || venues.length === 0) {
      console.log('❌ MapMarkers: No venues data available');
      return;
    }

    console.log('🎯 MapMarkers: Starting marker creation process...');
    
    // Clear existing markers first
    const existingMarkers = document.querySelectorAll('.custom-marker');
    console.log('🧹 Clearing existing markers:', existingMarkers.length);
    existingMarkers.forEach(marker => marker.remove());
    
    const createMarkersOnMap = () => {
      console.log('🎨 Creating markers on loaded map...');
      
      venues.forEach((venue, index) => {
        console.log(`📍 Processing venue ${index + 1}/${venues.length}:`, {
          name: venue.name,
          coordinates: venue.coordinates
        });
        
        // Ensure coordinates are valid numbers
        const [lng, lat] = venue.coordinates;
        
        if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
          console.error(`❌ Invalid coordinates for ${venue.name}:`, venue.coordinates);
          return;
        }
        
        console.log(`✅ Valid coordinates for ${venue.name}: [${lng}, ${lat}]`);
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.zIndex = '10'; // Lower z-index to ensure modals appear above
        
        // Color code by venue type
        el.style.backgroundColor = getBusinessTypeHexColor(venue.type);

        console.log(`🎨 Created marker element for ${venue.name}`);

        try {
          // Create Mapbox marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(map);

          console.log(`✅ Marker added to map for ${venue.name}`);

          // Create popup without open/closed status
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            className: 'marker-popup' // Add class for styling
          })
            .setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-sm mb-1">${venue.name}</h3>
                <p class="text-xs text-gray-600 mb-2">${venue.type} • ${venue.address}</p>
                 <div class="flex justify-end">
                   ${venue.rating > 0 ? `<span class="text-xs font-medium">★ ${venue.rating}</span>` : '<span class="text-xs text-gray-500">No reviews</span>'}
                 </div>
              </div>
            `);

          marker.setPopup(popup);

          // Handle click events
          el.addEventListener('click', () => {
            console.log('🖱️ Marker clicked:', venue.name);
            if (onVenueSelect) {
              onVenueSelect(venue);
            }
          });

          console.log(`🎉 Marker ${index + 1} setup complete for ${venue.name}`);
        } catch (markerError) {
          console.error(`❌ Error creating marker for ${venue.name}:`, markerError);
        }
      });

      console.log('🏁 All markers creation process complete');
    };

    // Check if map style is loaded, if not wait for it
    if (map.isStyleLoaded && map.isStyleLoaded()) {
      console.log('🎨 Map style already loaded, creating markers immediately');
      createMarkersOnMap();
    } else {
      console.log('⏳ Map style not loaded yet, waiting for styledata event');
      const onStyleLoad = () => {
        console.log('🎨 Map style loaded via event, creating markers');
        createMarkersOnMap();
        map.off('styledata', onStyleLoad);
      };
      map.on('styledata', onStyleLoad);
    }

    // Add global CSS for popup z-index
    const style = document.createElement('style');
    style.textContent = `
      .mapboxgl-popup {
        z-index: 20 !important;
      }
      .marker-popup .mapboxgl-popup-content {
        z-index: 21 !important;
      }
    `;
    if (!document.querySelector('style[data-marker-styles]')) {
      style.setAttribute('data-marker-styles', 'true');
      document.head.appendChild(style);
    }

  }, [map, mapboxgl, venues, onVenueSelect]);

  return null;
};

export default MapMarkers;
