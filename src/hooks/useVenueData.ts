
import { Venue } from '@/types/venue';

// Mock venues with coordinates for London area
const mockVenuesWithCoordinates: Venue[] = [
  {
    id: 1,
    name: "The Rainbow Pub",
    type: "Pub",
    address: "123 High Street, London",
    rating: 4.8,
    openNow: true,
    features: ["Accessible", "Family Friendly", "Staff Trained"],
    coordinates: [-0.1276, 51.5074] // London coordinates
  },
  {
    id: 2,
    name: "Inclusive Café",
    type: "Restaurant", 
    address: "456 Market Square, London",
    rating: 4.9,
    openNow: true,
    features: ["Gender Neutral Facilities", "Quiet Space"],
    coordinates: [-0.1300, 51.5100]
  },
  {
    id: 3,
    name: "Unity Fitness",
    type: "Gym",
    address: "789 Park Road, London", 
    rating: 4.7,
    openNow: false,
    features: ["Private Changing Rooms", "All Welcome Policy"],
    coordinates: [-0.1250, 51.5050]
  }
];

export const useVenueData = (venues?: Venue[]) => {
  return venues || mockVenuesWithCoordinates;
};
