
import React from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useVenueReviews, VenueReview } from '@/hooks/useVenueReviews';
import { format } from 'date-fns';

interface VenueReviewsProps {
  venueId: string;
}

interface ReviewReply {
  id: string;
  reply_text: string;
  created_at: string;
  venue_owner_id: string;
}

interface VenueReviewWithReply extends VenueReview {
  review_replies?: ReviewReply;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewItem = ({ review }: { review: VenueReviewWithReply }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-trans-blue/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-trans-blue" />
          </div>
          <div>
            <p className="font-medium text-brand-navy text-sm">
              {review.profiles?.full_name || 'Anonymous User'}
            </p>
            <p className="text-xs text-brand-navy/60">
              {format(new Date(review.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.review_text && (
        <p className="text-sm text-brand-navy/80 mt-2 pl-11">
          {review.review_text}
        </p>
      )}
      
      {/* Venue Owner Reply */}
      {review.review_replies && (
        <div className="mt-3 ml-11 bg-trans-blue/10 p-3 rounded-lg border-l-4 border-trans-blue">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-trans-blue" />
            <span className="text-sm font-medium text-trans-blue">Venue Reply</span>
            <span className="text-xs text-brand-navy/60">
              {format(new Date(review.review_replies.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="text-sm text-brand-navy/80">{review.review_replies.reply_text}</p>
        </div>
      )}
    </div>
  );
};

const VenueReviews = ({ venueId }: VenueReviewsProps) => {
  const { reviews, isLoading, error } = useVenueReviews(venueId);

  if (isLoading) {
    return (
      <Card className="border-trans-pink/20">
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-navy/60">Loading reviews...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-trans-pink/20">
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Error loading reviews: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-trans-pink/20">
      <CardHeader>
        <CardTitle className="text-lg text-brand-navy">
          Reviews ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p className="text-brand-navy/60">No reviews yet. Be the first to review this venue!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VenueReviews;
