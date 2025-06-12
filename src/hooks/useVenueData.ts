
import { Venue } from '@/types/venue';
import { useApprovedVenues } from './useApprovedVenues';

// Function to geocode an address (simplified for demo - in production you'd use a proper geocoding service)
const geocodeAddress = (address: string): [number, number] => {
  // For demo purposes, we'll use some known UK locations
  // In a real app, you'd integrate with a geocoding service like Mapbox Geocoding API
  
  // Check for some common UK cities/areas
  const lowerAddress = address.toLowerCase();
  
  if (lowerAddress.includes('godalming') || lowerAddress.includes('surrey')) {
    return [-0.6149, 51.1858]; // Godalming, Surrey
  } else if (lowerAddress.includes('guildford')) {
    return [-0.5704, 51.2362]; // Guildford, Surrey
  } else if (lowerAddress.includes('london')) {
    return [-0.1276, 51.5074]; // London center
  } else if (lowerAddress.includes('manchester')) {
    return [-2.2426, 53.4808]; // Manchester
  } else if (lowerAddress.includes('birmingham')) {
    return [-1.8904, 52.4862]; // Birmingham
  } else if (lowerAddress.includes('liverpool')) {
    return [-2.9916, 53.4084]; // Liverpool
  } else if (lowerAddress.includes('leeds')) {
    return [-1.5491, 53.8008]; // Leeds
  } else if (lowerAddress.includes('glasgow')) {
    return [-4.2518, 55.8642]; // Glasgow
  } else if (lowerAddress.includes('edinburgh')) {
    return [-3.1883, 55.9533]; // Edinburgh
  } else if (lowerAddress.includes('bristol')) {
    return [-2.5879, 51.4545]; // Bristol
  } else {
    // Default to Godalming/Guildford area instead of London
    return [
      -0.6149 + (Math.random() - 0.5) * 0.02, // Longitude around Godalming
      51.1858 + (Math.random() - 0.5) * 0.02  // Latitude around Godalming
    ];
  }
};

export const useVenueData = (venues?: Venue[]) => {
  const { venues: approvedVenues } = useApprovedVenues();
  
  if (venues) {
    return venues;
  }

  // Transform approved venues to include coordinates for map display
  const venuesWithCoordinates: Venue[] = approvedVenues.map((venue) => ({
    id: parseInt(venue.id.split('-')[0], 16), // Convert UUID to number for compatibility
    name: venue.name,
    type: venue.type,
    address: venue.address,
    rating: venue.rating,
    openNow: venue.openNow,
    features: venue.features,
    // Use geocoding to get more accurate coordinates
    coordinates: geocodeAddress(venue.address)
  }));

  console.log('🏢 Transformed venues with coordinates:', venuesWithCoordinates);

  return venuesWithCoordinates;
};
