import React from 'react';
import { MapPin } from 'lucide-react';
import { Venue } from '@/types/venue';

interface SimpleMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ venues = [], onVenueSelect }) => {
  console.log('🗺️ SimpleMap rendering with venues:', venues.length);
  const handleVenueClick = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative bg-gradient-to-br from-brand-light-blue via-trans-white to-trans-pink/30">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-light-blue/50 to-trans-pink/20">
        <div className="w-full h-full relative">
          {/* Grid pattern to simulate a map */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-brand-navy/10"></div>
              ))}
            </div>
          </div>
          
          {/* Venue markers */}
          <div className="absolute inset-0 p-8">
            {venues.map((venue, index) => {
              // Distribute venues across the map area
              const row = Math.floor(index / 4);
              const col = index % 4;
              const top = 20 + (row * 20);
              const left = 20 + (col * 20);
              
              return (
                <div
                  key={venue.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ 
                    top: `${Math.min(top, 80)}%`, 
                    left: `${Math.min(left, 80)}%` 
                  }}
                  onClick={() => handleVenueClick(venue)}
                >
                  <div className="relative">
                    <MapPin 
                      className={`w-8 h-8 transition-all duration-200 group-hover:scale-110 ${
                        venue.type.toLowerCase() === 'pub' ? 'text-trans-blue' :
                        venue.type.toLowerCase() === 'restaurant' ? 'text-trans-pink' :
                        'text-brand-navy'
                      }`}
                      fill="currentColor"
                    />
                    
                    {/* Venue tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-trans-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      <div className="text-sm font-semibold text-brand-navy">{venue.name}</div>
                      <div className="text-xs text-brand-navy/60">{venue.type}</div>
                      <div className="text-xs text-brand-navy/50">{venue.rating > 0 ? venue.rating : '-'}★</div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Map overlay with area labels */}
          <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg border border-trans-blue/20">
            <h3 className="text-sm font-semibold text-brand-navy mb-2">Surrey Area Map</h3>
            <div className="text-xs text-brand-navy/70 space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-trans-blue" fill="currentColor" />
                <span>Pubs/Bars</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-trans-pink" fill="currentColor" />
                <span>Restaurants</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-brand-navy" fill="currentColor" />
                <span>Other</span>
              </div>
            </div>
          </div>
          
          {venues.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
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

export default SimpleMap;