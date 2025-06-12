
import { Venue } from '@/types/venue';
import { useApprovedVenues } from './useApprovedVenues';

export const useVenueData = (venues?: Venue[]) => {
  const { venues: approvedVenues } = useApprovedVenues();
  
  if (venues) {
    return venues;
  }

  // Transform approved venues to include coordinates for map display
  const venuesWithCoordinates: Venue[] = approvedVenues.map((venue, index) => ({
    id: parseInt(venue.id.split('-')[0], 16), // Convert UUID to number for compatibility
    name: venue.name,
    type: venue.type,
    address: venue.address,
    rating: venue.rating,
    openNow: venue.openNow,
    features: venue.features,
    // Generate coordinates around London area for demo purposes
    coordinates: [
      -0.1276 + (Math.random() - 0.5) * 0.1, // Longitude around London
      51.5074 + (Math.random() - 0.5) * 0.1  // Latitude around London
    ] as [number, number]
  }));

  return venuesWithCoordinates;
};
