import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useVenueOwnerReviews } from '@/hooks/useVenueOwnerReviews';
import { format } from 'date-fns';

interface VenueOwnerReviewsProps {
  venueOwnerId: string;
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

const ReviewItem = ({ 
  review, 
  onSubmitReply 
}: { 
  review: any; 
  onSubmitReply: (reviewId: string, replyText: string) => Promise<boolean>;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    const success = await onSubmitReply(review.id, replyText);
    if (success) {
      setReplyText('');
      setIsReplying(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="border-trans-pink/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-brand-navy">
                  {review.profiles?.full_name || 'Anonymous User'}
                </p>
                <p className="text-sm text-brand-navy/60">
                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-trans-blue">
                {review.venues?.business_name}
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Approved
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {review.review_text && (
          <p className="text-sm text-brand-navy/80">
            {review.review_text}
          </p>
        )}

        {/* Existing Reply */}
        {review.review_replies && (
          <div className="bg-trans-blue/10 p-3 rounded-lg border-l-4 border-trans-blue">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-trans-blue" />
              <span className="text-sm font-medium text-trans-blue">Your Reply</span>
              <span className="text-xs text-brand-navy/60">
                {format(new Date(review.review_replies.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <p className="text-sm text-brand-navy/80">{review.review_replies.reply_text}</p>
          </div>
        )}

        {/* Reply Form */}
        {!review.review_replies && (
          <div className="pt-2 border-t">
            {!isReplying ? (
              <Button
                size="sm"
                onClick={() => setIsReplying(true)}
                className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                Reply to Review
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your reply to this review..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const VenueOwnerReviews = ({ venueOwnerId }: VenueOwnerReviewsProps) => {
  const { reviews, isLoading, error, submitReply } = useVenueOwnerReviews(venueOwnerId);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-navy/60">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading reviews: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-brand-navy mb-2">Customer Reviews</h2>
        <p className="text-brand-navy/70">Manage and respond to reviews for your venues</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-trans-blue/20">
          <CardContent className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-brand-navy/40 mx-auto mb-4" />
            <p className="text-brand-navy/60">No reviews yet for your venues</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onSubmitReply={submitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueOwnerReviews;
