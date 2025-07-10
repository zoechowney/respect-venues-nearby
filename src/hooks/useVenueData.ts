
import { Venue } from '@/types/venue';
import { useApprovedVenues } from './useApprovedVenues';

// Default coordinates for venues without stored coordinates (Godalming, Surrey)
const DEFAULT_COORDINATES: [number, number] = [-0.6149, 51.1858];

export const useVenueData = (venues?: Venue[]) => {
  const { venues: approvedVenues } = useApprovedVenues();
  
  if (venues) {
    return venues;
  }

  // Transform approved venues to include coordinates for map display
  const venuesWithCoordinates: Venue[] = approvedVenues.map((venue) => {
    console.log(`🗺️ Processing venue: ${venue.name}`);
    console.log(`📍 Raw coordinates from DB: lat=${venue.latitude}, lng=${venue.longitude}`);
    
    const coordinates: [number, number] = (venue.latitude && venue.longitude) 
      ? [venue.longitude, venue.latitude] 
      : DEFAULT_COORDINATES;
    
    console.log(`📌 Final coordinates: [${coordinates[0]}, ${coordinates[1]}]`);
    
    return {
      id: parseInt(venue.id.split('-')[0], 16), // Convert UUID to number for compatibility
      name: venue.name,
      type: venue.type,
      address: venue.address,
      rating: venue.rating,
      openNow: venue.openNow,
      features: venue.features,
      coordinates
    };
  });

  console.log('🏢 Transformed venues with coordinates:', venuesWithCoordinates);

  return venuesWithCoordinates;
};
