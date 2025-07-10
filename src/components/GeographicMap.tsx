import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Venue } from '@/types/venue';

interface GeographicMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const GeographicMap: React.FC<GeographicMapProps> = ({ venues = [], onVenueSelect }) => {
  console.log('🗺️ GeographicMap rendering with venues:', venues.length);

  const handleVenueClick = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  // Convert lat/lng to map position percentages for Surrey area
  const coordsToPosition = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    
    // Surrey bounds (approximate)
    const bounds = {
      north: 51.35,   // North Surrey
      south: 51.05,   // South Surrey  
      east: -0.3,     // East Surrey
      west: -0.8      // West Surrey
    };
    
    // Convert to percentage position
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
    
    // Clamp to map bounds with some padding
    return {
      left: Math.max(5, Math.min(95, x)),
      top: Math.max(5, Math.min(95, y))
    };
  };

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative bg-gradient-to-br from-brand-light-blue/30 via-trans-white to-trans-pink/20">
      {/* Map Background with geographic elements */}
      <div className="absolute inset-0">
        {/* Background pattern resembling a map */}
        <div className="w-full h-full relative bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
          {/* River Thames (simplified) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="none">
              <path
                d="M50,200 Q150,180 250,190 Q350,195 380,200"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>
          
          {/* Road network (simplified) */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
              {/* A3 (vertical) */}
              <line x1="120" y1="0" x2="120" y2="300" stroke="#6b7280" strokeWidth="3" />
              {/* M25 (horizontal) */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#6b7280" strokeWidth="4" />
              {/* A31 (diagonal) */}
              <line x1="50" y1="150" x2="350" y2="120" stroke="#6b7280" strokeWidth="2" />
            </svg>
          </div>

          {/* Town labels */}
          <div className="absolute top-4 left-4 text-xs font-medium text-brand-navy/60">
            Surrey, UK
          </div>
          <div className="absolute top-16 left-20 text-xs text-brand-navy/50">
            Godalming
          </div>
          <div className="absolute top-12 right-24 text-xs text-brand-navy/50">
            Guildford
          </div>
          <div className="absolute bottom-20 left-16 text-xs text-brand-navy/50">
            Farnham
          </div>
          
          {/* Grid overlay for reference */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-brand-navy/20"></div>
              ))}
            </div>
          </div>
          
          {/* Venue markers positioned geographically */}
          <div className="absolute inset-0">
            {venues.map((venue) => {
              const position = coordsToPosition(venue.coordinates);
              
              return (
                <div
                  key={venue.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  style={{ 
                    left: `${position.left}%`, 
                    top: `${position.top}%` 
                  }}
                  onClick={() => handleVenueClick(venue)}
                >
                  <div className="relative">
                    <MapPin 
                      className={`w-6 h-6 transition-all duration-200 group-hover:scale-125 drop-shadow-lg ${
                        venue.type.toLowerCase() === 'pub' ? 'text-trans-blue' :
                        venue.type.toLowerCase() === 'restaurant' ? 'text-trans-pink' :
                        'text-brand-navy'
                      }`}
                      fill="currentColor"
                    />
                    
                    {/* Venue tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-xl border border-trans-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 min-w-48">
                      <div className="text-sm font-semibold text-brand-navy">{venue.name}</div>
                      <div className="text-xs text-brand-navy/60">{venue.type}</div>
                      <div className="text-xs text-brand-navy/50 mt-1">{venue.address}</div>
                      <div className="text-xs text-brand-navy/60 mt-1">★ {venue.rating}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Map legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 rounded-lg p-3 shadow-lg border border-trans-blue/20">
            <h3 className="text-sm font-semibold text-brand-navy mb-2 flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              Surrey Venues
            </h3>
            <div className="text-xs text-brand-navy/70 space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-trans-blue" fill="currentColor" />
                <span>Pubs/Bars ({venues.filter(v => v.type.toLowerCase() === 'pub').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-trans-pink" fill="currentColor" />
                <span>Restaurants ({venues.filter(v => v.type.toLowerCase() === 'restaurant').length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-brand-navy" fill="currentColor" />
                <span>Other ({venues.filter(v => !['pub', 'restaurant'].includes(v.type.toLowerCase())).length})</span>
              </div>
            </div>
          </div>
          
          {venues.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md bg-white/90 rounded-lg p-6 shadow-lg">
                <MapPin className="w-12 h-12 text-brand-navy/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-brand-navy mb-2">No Venues to Display</h3>
                <p className="text-brand-navy/70 text-sm">
                  Venues will appear on this map once they match your search criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;