
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
    if (!map || !mapboxgl || !venues.length) {
      console.log('📍 MapMarkers early return:', { 
        hasMap: !!map, 
        hasMapboxgl: !!mapboxgl, 
        venuesCount: venues.length 
      });
      return;
    }

    console.log('📍 Adding venue markers...', { venuesCount: venues.length });
    
    // Clear existing markers first
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    venues.forEach((venue, index) => {
      console.log(`📍 Processing marker ${index + 1} for ${venue.name}:`, {
        coordinates: venue.coordinates,
        type: venue.type,
        name: venue.name
      });
      
      // Ensure coordinates are valid numbers
      const [lng, lat] = venue.coordinates;
      if (typeof lng !== 'number' || typeof lat !== 'number' || isNaN(lng) || isNaN(lat)) {
        console.error(`❌ Invalid coordinates for ${venue.name}:`, venue.coordinates);
        return;
      }
      
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

      console.log(`📍 Created marker element for ${venue.name}`);

      try {
        console.log(`📍 Creating Mapbox marker for ${venue.name} at [${lng}, ${lat}]`);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .addTo(map);

        console.log(`✅ Marker created and added to map for ${venue.name}`);

        // Create popup with clean data
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

        // Handle click events with clean venue data
        el.addEventListener('click', () => {
          console.log('📍 Marker clicked:', venue.name);
          if (onVenueSelect) {
            // Pass clean venue data to avoid serialization issues
            const cleanVenue = {
              id: venue.id,
              name: venue.name,
              type: venue.type,
              address: venue.address,
              rating: venue.rating,
              openNow: venue.openNow,
              features: venue.features,
              coordinates: venue.coordinates
            };
            onVenueSelect(cleanVenue);
          }
        });

        console.log(`✅ Marker ${index + 1} added successfully for ${venue.name}`);
      } catch (markerError) {
        console.error(`❌ Error adding marker ${index + 1} for ${venue.name}:`, markerError);
      }
    });

    console.log('🎯 All markers processing complete');
  }, [map, mapboxgl, venues, onVenueSelect]);

  return null; // This component doesn't render anything visual
};

export default MapMarkers;
