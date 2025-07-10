import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
import { Venue } from '@/types/venue';

interface CustomSurreyMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const CustomSurreyMap: React.FC<CustomSurreyMapProps> = ({ venues = [], onVenueSelect }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  console.log('🗺️ CustomSurreyMap rendering with venues:', venues.length);

  // Convert lat/lng to SVG coordinates for Surrey
  const coordsToSVG = (coordinates: [number, number]) => {
    const [lng, lat] = coordinates;
    
    // Surrey bounds (more precise)
    const bounds = {
      north: 51.35,   
      south: 51.05,   
      east: -0.3,     
      west: -0.8      
    };
    
    // Convert to SVG coordinates (800x600 viewBox)
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 800;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 600;
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const zoomIn = () => setZoom(prev => Math.min(3, prev * 1.2));
  const zoomOut = () => setZoom(prev => Math.max(0.5, prev / 1.2));

  const handleVenueClick = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg overflow-hidden relative bg-gradient-to-br from-blue-50 to-green-50">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          className="w-full h-full"
        >
          {/* Map background */}
          <rect width="800" height="600" fill="#f8fafc" />
          
          {/* Green areas (parks/countryside) */}
          <rect x="0" y="0" width="800" height="150" fill="#dcfce7" opacity="0.6" />
          <rect x="0" y="450" width="800" height="150" fill="#dcfce7" opacity="0.6" />
          <circle cx="200" cy="300" r="80" fill="#dcfce7" opacity="0.8" />
          <circle cx="600" cy="200" r="60" fill="#dcfce7" opacity="0.8" />
          
          {/* River Thames and tributaries */}
          <path
            d="M50,350 Q200,340 350,345 Q500,350 650,360 Q750,365 800,370"
            stroke="#3b82f6"
            strokeWidth="8"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M300,345 Q320,320 340,295 Q360,270 380,245"
            stroke="#60a5fa"
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
          
          {/* Major roads */}
          {/* A3 (main north-south route) */}
          <line x1="250" y1="0" x2="250" y2="600" stroke="#6b7280" strokeWidth="6" opacity="0.8" />
          {/* M25 (orbital motorway) */}
          <path
            d="M0,180 Q200,160 400,165 Q600,170 800,180"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
            opacity="0.9"
          />
          {/* A31 */}
          <line x1="100" y1="400" x2="700" y2="350" stroke="#6b7280" strokeWidth="4" opacity="0.7" />
          {/* A24 */}
          <line x1="350" y1="0" x2="350" y2="400" stroke="#6b7280" strokeWidth="4" opacity="0.7" />
          
          {/* Town centers */}
          <circle cx="200" cy="380" r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <circle cx="500" cy="250" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <circle cx="120" cy="450" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          <circle cx="650" cy="200" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
          
          {/* Town labels */}
          <text x="200" y="370" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
            Godalming
          </text>
          <text x="500" y="240" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            Guildford
          </text>
          <text x="120" y="440" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
            Farnham
          </text>
          <text x="650" y="190" textAnchor="middle" className="text-xs font-semibold fill-gray-700">
            Dorking
          </text>
          
          {/* Venue markers */}
          {venues.map((venue) => {
            const pos = coordsToSVG(venue.coordinates);
            const color = venue.type.toLowerCase() === 'pub' ? '#60a5fa' : 
                         venue.type.toLowerCase() === 'restaurant' ? '#f472b6' : '#374151';
            
            return (
              <g key={venue.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="8"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-10 transition-all"
                  onClick={() => handleVenueClick(venue)}
                >
                  <title>{venue.name} - {venue.type}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={zoomIn}
          className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Map info */}
      <div className="absolute top-4 right-4 bg-white/95 rounded-lg p-3 shadow-lg border border-trans-blue/20">
        <h3 className="text-sm font-semibold text-brand-navy mb-2 flex items-center gap-1">
          <Navigation className="w-4 h-4" />
          Surrey Map
        </h3>
        <div className="text-xs text-brand-navy/70 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-trans-blue"></div>
            <span>Pubs/Bars ({venues.filter(v => v.type.toLowerCase() === 'pub').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-trans-pink"></div>
            <span>Restaurants ({venues.filter(v => v.type.toLowerCase() === 'restaurant').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-brand-navy"></div>
            <span>Other ({venues.filter(v => !['pub', 'restaurant'].includes(v.type.toLowerCase())).length})</span>
          </div>
        </div>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
        Zoom: {Math.round(zoom * 100)}%
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
  );
};

export default CustomSurreyMap;