
import React, { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import RobustMap from '@/components/RobustMap';

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
  center?: { lat: number; lng: number; zoom?: number };
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues = [], 
  onVenueSelect,
  center
}) => {
  console.log('🗺️ InteractiveMap: Using RobustMap directly');
  
  // Always use the robust Leaflet map as it works in all environments
  return <RobustMap venues={venues} onVenueSelect={onVenueSelect} center={center} />;
};

export default InteractiveMap;
