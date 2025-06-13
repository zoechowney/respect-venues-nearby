
import React, { useState } from 'react';
import { Check, Trash2, Star, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAdminReviews } from '@/hooks/useAdminReviews';
import { format } from 'date-fns';

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
  onApprove, 
  onDelete, 
  showActions = true 
}: { 
  review: any; 
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}) => {
  return (
    <Card className="border-trans-pink/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
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
            
            <div className="flex items-center justify-between">
              <p className="font-medium text-brand-navy">
                {review.venues?.business_name || 'Unknown Venue'}
              </p>
              <div className="flex items-center space-x-2">
                <StarRating rating={review.rating} />
                {!review.is_approved && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
                {review.is_approved && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Approved
                  </Badge>
                )}
              </div>
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
        
        {showActions && (
          <div className="flex space-x-2 pt-2 border-t">
            {!review.is_approved && onApprove && (
              <Button
                size="sm"
                onClick={() => onApprove(review.id)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(review.id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ReviewsManagement = () => {
  const { 
    pendingReviews, 
    allReviews, 
    isLoading, 
    error, 
    approveReview, 
    deleteReview 
  } = useAdminReviews();

  const handleApprove = async (reviewId: string) => {
    await approveReview(reviewId);
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      await deleteReview(reviewId);
    }
  };

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
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Review Management</h2>
        <p className="text-brand-navy/70">Manage and moderate venue reviews</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Pending ({pendingReviews.length})</span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>All Reviews ({allReviews.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card className="border-trans-blue/20">
              <CardContent className="text-center py-8">
                <Clock className="w-12 h-12 text-brand-navy/40 mx-auto mb-4" />
                <p className="text-brand-navy/60">No pending reviews to approve</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {allReviews.length === 0 ? (
            <Card className="border-trans-blue/20">
              <CardContent className="text-center py-8">
                <Star className="w-12 h-12 text-brand-navy/40 mx-auto mb-4" />
                <p className="text-brand-navy/60">No reviews found</p>
              </CardContent>
            </Card>
          ) : (
            allReviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onDelete={handleDelete}
                showActions={true}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsManagement;
