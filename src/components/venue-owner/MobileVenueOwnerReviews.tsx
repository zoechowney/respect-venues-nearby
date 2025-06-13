
import React, { useState } from 'react';
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useVenueOwnerReviews } from '@/hooks/useVenueOwnerReviews';

interface MobileVenueOwnerReviewsProps {
  venueOwnerId: string;
}

const MobileVenueOwnerReviews: React.FC<MobileVenueOwnerReviewsProps> = ({ venueOwnerId }) => {
  const { reviews, isLoading, submitReply } = useVenueOwnerReviews(venueOwnerId);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplies, setSubmittingReplies] = useState<Set<string>>(new Set());

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleReplySubmit = async (reviewId: string) => {
    const replyText = replyTexts[reviewId]?.trim();
    if (!replyText) return;

    setSubmittingReplies(prev => new Set(prev).add(reviewId));
    
    const success = await submitReply(reviewId, replyText);
    if (success) {
      setReplyTexts(prev => ({ ...prev, [reviewId]: '' }));
    }
    
    setSubmittingReplies(prev => {
      const newSet = new Set(prev);
      newSet.delete(reviewId);
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-brand-navy mb-2">No Reviews Yet</h3>
        <p className="text-brand-navy/70 text-sm">
          Customer reviews will appear here once they're approved by our admin team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-4 py-2 bg-trans-blue/10 rounded-lg">
        <p className="text-sm text-brand-navy font-medium">
          {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
        </p>
      </div>

      {reviews.map((review) => {
        const isExpanded = expandedReviews.has(review.id);
        const hasReply = review.review_replies;
        const isSubmitting = submittingReplies.has(review.id);

        return (
          <Card key={review.id} className="border-trans-blue/20">
            <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(review.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-brand-navy/60">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-brand-navy text-sm">
                            {review.profiles?.full_name || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-brand-navy/70">
                            {review.venues.business_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasReply && (
                            <Badge variant="secondary" className="text-xs">
                              Replied
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-brand-navy/60" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-brand-navy/60" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  {review.review_text && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-brand-navy leading-relaxed">
                        {review.review_text}
                      </p>
                    </div>
                  )}

                  {hasReply && (
                    <div className="mb-4 p-3 bg-trans-blue/10 rounded-lg border-l-4 border-trans-blue">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">Your Reply</Badge>
                        <span className="text-xs text-brand-navy/60">
                          {new Date(hasReply.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-brand-navy">
                        {hasReply.reply_text}
                      </p>
                    </div>
                  )}

                  {!hasReply && (
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Write a thoughtful response to this review..."
                        value={replyTexts[review.id] || ''}
                        onChange={(e) => setReplyTexts(prev => ({
                          ...prev,
                          [review.id]: e.target.value
                        }))}
                        className="text-sm resize-none"
                        rows={3}
                      />
                      <Button
                        onClick={() => handleReplySubmit(review.id)}
                        disabled={!replyTexts[review.id]?.trim() || isSubmitting}
                        size="sm"
                        className="w-full bg-trans-blue hover:bg-trans-blue/90 text-brand-navy"
                      >
                        {isSubmitting ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Reply
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default MobileVenueOwnerReviews;
