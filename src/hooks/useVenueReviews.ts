
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
      const { data, error: fetchError } = await supabase
        .from('venue_reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching reviews:', fetchError);
        setError(fetchError.message);
        return;
      }

      setReviews(data || []);
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
