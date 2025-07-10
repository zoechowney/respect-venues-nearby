
import React, { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import RobustMap from '@/components/RobustMap';

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues = [], 
  onVenueSelect 
}) => {
  console.log('🗺️ InteractiveMap: Using RobustMap directly');
  
  // Always use the robust Leaflet map as it works in all environments
  return <RobustMap venues={venues} onVenueSelect={onVenueSelect} />;
};

export default InteractiveMap;
