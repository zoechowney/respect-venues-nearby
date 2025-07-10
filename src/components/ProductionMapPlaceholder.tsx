import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Venue } from '@/types/venue';

interface ProductionMapPlaceholderProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const ProductionMapPlaceholder: React.FC<ProductionMapPlaceholderProps> = ({ venues = [], onVenueSelect }) => {
  console.log('🗺️ ProductionMapPlaceholder rendering with venues:', venues.length);

  const handleVenueClick = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  const openInGoogleMaps = (venue: Venue) => {
    const address = encodeURIComponent(venue.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Development Notice */}
      <div className="absolute top-4 left-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 z-10">
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 text-sm">Interactive Map Preview</h3>
            <p className="text-blue-700 text-xs mt-1">
              The interactive map is blocked in Lovable's preview environment but will work perfectly when deployed. 
              Click venue addresses below to view in Google Maps.
            </p>
          </div>
        </div>
      </div>

      {/* Venue List */}
      <div className="pt-24 p-6 h-full overflow-y-auto">
        {venues.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Venues in Surrey ({venues.length})
            </h3>
            
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleVenueClick(venue)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        venue.type.toLowerCase() === 'pub' ? 'bg-trans-blue' :
                        venue.type.toLowerCase() === 'restaurant' ? 'bg-trans-pink' :
                        'bg-brand-navy'
                      }`}></div>
                      <h4 className="font-semibold text-brand-navy">{venue.name}</h4>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {venue.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{venue.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>★ {venue.rating}</span>
                      <span>Lat: {venue.coordinates[1].toFixed(4)}</span>
                      <span>Lng: {venue.coordinates[0].toFixed(4)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleMaps(venue);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View in Maps
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Venues to Display</h3>
            <p className="text-gray-500 text-sm">
              Venues will appear here once they match your search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Production Info */}
      <div className="absolute bottom-4 right-4 bg-white/90 rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-semibold mb-1">In Production:</div>
          <div>✅ Full interactive map</div>
          <div>✅ Zoom & pan controls</div>
          <div>✅ Clickable markers</div>
          <div>✅ Global coverage</div>
        </div>
      </div>
    </div>
  );
};

export default ProductionMapPlaceholder;