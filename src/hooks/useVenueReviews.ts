
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
  profiles?: {
    full_name: string | null;
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
      
      // First, get the reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('venue_reviews')
        .select('*')
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setError(reviewsError.message);
        return;
      }

      // Then, get the profiles for users who left reviews
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

      // Combine reviews with profile data
      const reviewsWithProfiles = reviewsData?.map(review => ({
        ...review,
        profiles: review.user_id 
          ? profilesData.find(profile => profile.id === review.user_id) || { full_name: null }
          : { full_name: null }
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
        description: "Thank you for your feedback!",
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
