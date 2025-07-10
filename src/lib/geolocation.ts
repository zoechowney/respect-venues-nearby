// Geolocation and distance utilities

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  name: string;
  coordinates: Coordinates;
  address: string;
  postcode?: string;
  city?: string;
  region?: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get user's current location
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied by user'));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable'));
            break;
          case error.TIMEOUT:
            reject(new Error('Location request timed out'));
            break;
          default:
            reject(new Error('An unknown error occurred while retrieving location'));
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

/**
 * Geocode address using Mapbox API
 */
export const geocodeAddress = async (address: string, mapboxToken: string): Promise<LocationResult[]> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?country=GB&access_token=${mapboxToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }
    
    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      name: feature.place_name,
      coordinates: {
        longitude: feature.center[0],
        latitude: feature.center[1],
      },
      address: feature.place_name,
      postcode: feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text,
      city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
      region: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (
  coordinates: Coordinates, 
  mapboxToken: string
): Promise<LocationResult | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.longitude},${coordinates.latitude}.json?country=GB&access_token=${mapboxToken}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to reverse geocode coordinates');
    }
    
    const data = await response.json();
    
    if (data.features.length === 0) {
      return null;
    }
    
    const feature = data.features[0];
    return {
      name: feature.place_name,
      coordinates,
      address: feature.place_name,
      postcode: feature.context?.find((c: any) => c.id.startsWith('postcode'))?.text,
      city: feature.context?.find((c: any) => c.id.startsWith('place'))?.text,
      region: feature.context?.find((c: any) => c.id.startsWith('region'))?.text,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Get coordinates from UK postcode
 */
export const getPostcodeCoordinates = async (postcode: string): Promise<Coordinates | null> => {
  try {
    // UK postcode regex
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode.replace(/\s/g, ''))) {
      throw new Error('Invalid UK postcode format');
    }

    // Use free UK postcode API as fallback
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.result) {
      return {
        latitude: data.result.latitude,
        longitude: data.result.longitude,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Postcode lookup error:', error);
    return null;
  }
};

/**
 * Filter venues by distance from location
 */
export const filterVenuesByDistance = (
  venues: any[],
  location: Coordinates,
  maxDistance: number
): Array<any & { distance: number }> => {
  return venues
    .map(venue => {
      // For now, we'll need to add coordinates to venues or geocode their addresses
      // This is a placeholder - you'll need to add lat/lng to your venue data
      const venueCoords = venue.coordinates || { latitude: 51.5074, longitude: -0.1278 }; // London fallback
      const distance = calculateDistance(location, venueCoords);
      
      return {
        ...venue,
        distance,
      };
    })
    .filter(venue => venue.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Get popular UK cities with coordinates
 */
export const getPopularCities = (): LocationResult[] => {
  return [
    {
      name: 'London',
      coordinates: { latitude: 51.5074, longitude: -0.1278 },
      address: 'London, England, United Kingdom',
      city: 'London',
      region: 'England'
    },
    {
      name: 'Manchester',
      coordinates: { latitude: 53.4808, longitude: -2.2426 },
      address: 'Manchester, England, United Kingdom',
      city: 'Manchester',
      region: 'England'
    },
    {
      name: 'Birmingham',
      coordinates: { latitude: 52.4862, longitude: -1.8904 },
      address: 'Birmingham, England, United Kingdom',
      city: 'Birmingham',
      region: 'England'
    },
    {
      name: 'Leeds',
      coordinates: { latitude: 53.8008, longitude: -1.5491 },
      address: 'Leeds, England, United Kingdom',
      city: 'Leeds',
      region: 'England'
    },
    {
      name: 'Glasgow',
      coordinates: { latitude: 55.8642, longitude: -4.2518 },
      address: 'Glasgow, Scotland, United Kingdom',
      city: 'Glasgow',
      region: 'Scotland'
    },
    {
      name: 'Edinburgh',
      coordinates: { latitude: 55.9533, longitude: -3.1883 },
      address: 'Edinburgh, Scotland, United Kingdom',
      city: 'Edinburgh',
      region: 'Scotland'
    },
    {
      name: 'Cardiff',
      coordinates: { latitude: 51.4816, longitude: -3.1791 },
      address: 'Cardiff, Wales, United Kingdom',
      city: 'Cardiff',
      region: 'Wales'
    },
    {
      name: 'Belfast',
      coordinates: { latitude: 54.5973, longitude: -5.9301 },
      address: 'Belfast, Northern Ireland, United Kingdom',
      city: 'Belfast',
      region: 'Northern Ireland'
    }
  ];
};