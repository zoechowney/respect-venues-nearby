
export interface Venue {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  openNow: boolean;
  features: string[];
  coordinates: [number, number]; // [longitude, latitude]
}
