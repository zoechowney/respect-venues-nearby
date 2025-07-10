
export interface Venue {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  openNow: boolean;
  features: string[];
  coordinates: [number, number]; // [longitude, latitude]
  originalId?: string; // Preserve original UUID for database operations
}
