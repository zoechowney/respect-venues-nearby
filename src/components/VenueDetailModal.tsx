
import React from 'react';
import { MapPin, Star, Clock, Phone, Globe, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VenueReviews from './VenueReviews';
import ReviewForm from './ReviewForm';
import { useVenueReviews } from '@/hooks/useVenueReviews';
import { ApprovedVenue } from '@/hooks/useApprovedVenues';

interface VenueDetailModalProps {
  venue: ApprovedVenue | null;
  isOpen: boolean;
  onClose: () => void;
}

const VenueDetailModal = ({ venue, isOpen, onClose }: VenueDetailModalProps) => {
  const { submitReview } = useVenueReviews(venue?.id || '');

  if (!venue) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[100] bg-white shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl text-brand-navy flex items-center justify-between">
            {venue.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Venue Information */}
          <div className="space-y-4">
            <div>
              <p className="text-trans-blue font-medium text-lg">{venue.type}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium text-brand-navy">{venue.rating}</span>
                <span className="text-brand-navy/60">({venue.reviews} reviews)</span>
              </div>
            </div>

            <p className="text-brand-navy/80">{venue.description}</p>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-navy/40 mt-0.5 flex-shrink-0" />
                <p className="text-brand-navy/70">{venue.address}</p>
              </div>

              {venue.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-brand-navy/40 flex-shrink-0" />
                  <p className="text-brand-navy/70">{venue.phone}</p>
                </div>
              )}

              {venue.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-brand-navy/40 flex-shrink-0" />
                  <a 
                    href={venue.website.startsWith('http') ? venue.website : `https://${venue.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-trans-blue hover:text-trans-blue/80 underline"
                  >
                    {venue.website}
                  </a>
                </div>
              )}

              {venue.hours && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-brand-navy/40 mt-0.5 flex-shrink-0" />
                  <p className="text-brand-navy/70">{venue.hours}</p>
                </div>
              )}
            </div>

            {venue.features && venue.features.length > 0 && (
              <div>
                <h4 className="font-medium text-brand-navy mb-2">Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {venue.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-trans-pink rounded-full"></div>
                      <span className="text-sm text-brand-navy/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-4">
            <ReviewForm venueId={venue.id} onSubmitReview={submitReview} />
            <VenueReviews venueId={venue.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VenueDetailModal;
