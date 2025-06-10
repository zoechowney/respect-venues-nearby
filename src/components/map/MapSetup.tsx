
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MapSetupProps {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  onInitialize: () => void;
  isLoading: boolean;
  error: string;
}

const MapSetup: React.FC<MapSetupProps> = ({
  mapboxToken,
  setMapboxToken,
  onInitialize,
  isLoading,
  error
}) => {
  return (
    <div className="h-96 border-trans-blue/20 border rounded-lg p-6 flex flex-col items-center justify-center bg-gradient-to-br from-brand-light-blue to-trans-pink/30">
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-brand-navy mb-4">Interactive Map Setup</h3>
        <p className="text-brand-navy/70 mb-4 text-sm">
          To display the interactive map, please enter your Mapbox public token. 
          You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-trans-blue underline">mapbox.com</a>
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Enter your Mapbox public token (starts with pk.)..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="text-sm"
          />
          <Button 
            onClick={onInitialize}
            disabled={!mapboxToken || isLoading}
            className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
          >
            {isLoading ? 'Initializing...' : 'Initialize Map'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapSetup;
