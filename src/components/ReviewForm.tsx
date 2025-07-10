
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useRateLimit, RATE_LIMITS } from '@/lib/rateLimiter';
import { detectSpam, sanitizeText } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  venueId: string;
  onSubmitReview: (rating: number, reviewText: string) => Promise<boolean>;
}

const ReviewForm = ({ venueId, onSubmitReview }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkLimit } = useRateLimit('review_submission', RATE_LIMITS.REVIEW_SUBMISSION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    // Check rate limiting
    const rateLimitResult = checkLimit();
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime);
      toast({
        title: "Too Many Reviews",
        description: `You've submitted too many reviews recently. Please try again after ${resetTime.toLocaleTimeString()}.`,
        variant: "destructive",
      });
      return;
    }

    // Detect spam in review text
    if (reviewText.trim()) {
      const spamResult = detectSpam(reviewText);
      if (spamResult.isSpam) {
        toast({
          title: "Review Rejected",
          description: "Your review contains inappropriate content. Please revise and try again.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    const sanitizedReviewText = reviewText.trim() ? sanitizeText(reviewText) : '';
    const success = await onSubmitReview(rating, sanitizedReviewText);
    if (success) {
      setRating(0);
      setReviewText('');
    }
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <Card className="border-trans-blue/20">
        <CardHeader>
          <CardTitle className="text-lg text-brand-navy">Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-navy/70 mb-4">
            Sign in to leave a review and help other community members find welcoming spaces.
          </p>
          <Link to="/auth">
            <Button className="bg-trans-blue hover:bg-trans-blue/90 text-brand-navy">
              Sign In to Review
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-trans-blue/20">
      <CardHeader>
        <CardTitle className="text-lg text-brand-navy">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2">
              Your Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-trans-blue rounded"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="block text-sm font-medium text-brand-navy mb-2">
              Your Review (Optional)
            </label>
            <Textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience at this venue..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-trans-pink hover:bg-trans-pink/90 text-brand-navy"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
