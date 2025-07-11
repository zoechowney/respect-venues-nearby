
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface VenueReview {
  id: string;
  venue_id: string;
  user_id: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  profiles?: {
    full_name: string | null;
  };
  review_replies?: {
    id: string;
    reply_text: string;
    created_at: string;
    venue_owner_id: string;
  };
}

export const useVenueReviews = (venueId: string) => {
  const [reviews, setReviews] = useState<VenueReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      // First, get the approved reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('venue_reviews')
        .select('*')
        .eq('venue_id', venueId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setError(reviewsError.message);
        return;
      }

      // Get the profiles for users who left reviews
      const userIds = reviewsData
        ?.filter(review => review.user_id)
        .map(review => review.user_id) || [];

      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Get replies for these reviews
      const reviewIds = reviewsData?.map(review => review.id) || [];
      let repliesData: any[] = [];
      if (reviewIds.length > 0) {
        const { data: replies, error: repliesError } = await supabase
          .from('review_replies')
          .select('*')
          .in('review_id', reviewIds);

        if (!repliesError) {
          repliesData = replies || [];
        }
      }

      // Combine reviews with profile data and replies
      const reviewsWithProfiles = reviewsData?.map(review => ({
        ...review,
        profiles: review.user_id 
          ? profilesData.find(profile => profile.id === review.user_id) || { full_name: null }
          : { full_name: null },
        review_replies: repliesData.find(reply => reply.review_id === review.id) || null
      })) || [];

      setReviews(reviewsWithProfiles);
      setError(null);
    } catch (err) {
      console.error('Unexpected error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const submitReview = async (rating: number, reviewText: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error: insertError } = await supabase
        .from('venue_reviews')
        .insert({
          venue_id: venueId,
          user_id: user.id,
          rating,
          review_text: reviewText.trim() || null,
          is_approved: false, // Reviews need admin approval
        });

      if (insertError) {
        console.error('Error submitting review:', insertError);
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Your review is pending approval.",
      });

      // Refresh reviews
      await fetchReviews();
      return true;
    } catch (err) {
      console.error('Unexpected error submitting review:', err);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (venueId) {
      fetchReviews();
    }
  }, [venueId]);

  return {
    reviews,
    isLoading,
    error,
    submitReview,
    refetch: fetchReviews,
  };
};
