
import React, { useState, useEffect } from 'react';
import { Venue } from '@/types/venue';
import RobustMap from '@/components/RobustMap';

interface InteractiveMapProps {
  venues?: Venue[];
  onVenueSelect?: (venue: Venue) => void;
  center?: { lat: number; lng: number; zoom?: number };
  userLocation?: { latitude: number; longitude: number } | null;
  centerFromUrl?: boolean; // Flag to indicate if center comes from URL params
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  venues = [], 
  onVenueSelect,
  center,
  userLocation,
  centerFromUrl = false
}) => {
  console.log('🗺️ InteractiveMap: Using RobustMap directly');
  
  // Always use the robust Leaflet map as it works in all environments
  return <RobustMap venues={venues} onVenueSelect={onVenueSelect} center={center} userLocation={userLocation} centerFromUrl={centerFromUrl} />;
};

export default InteractiveMap;
