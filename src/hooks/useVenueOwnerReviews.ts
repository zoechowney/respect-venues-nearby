
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VenueOwnerReview {
  id: string;
  venue_id: string;
  user_id: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  venues: {
    business_name: string;
  };
  profiles?: {
    full_name: string | null;
  };
  review_replies?: {
    id: string;
    reply_text: string;
    created_at: string;
  };
}

export const useVenueOwnerReviews = (venueOwnerId: string) => {
  const [reviews, setReviews] = useState<VenueOwnerReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      // Fetch approved reviews for venues owned by this venue owner
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('venue_reviews')
        .select(`
          *,
          venues!inner (
            business_name,
            venue_owner_id
          )
        `)
        .eq('is_approved', true)
        .eq('venues.venue_owner_id', venueOwnerId)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setError(reviewsError.message);
        return;
      }

      // Get user profiles for reviewers
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

      // Get existing replies for these reviews
      const reviewIds = reviewsData?.map(review => review.id) || [];
      let repliesData: any[] = [];
      if (reviewIds.length > 0) {
        const { data: replies, error: repliesError } = await supabase
          .from('review_replies')
          .select('*')
          .in('review_id', reviewIds)
          .eq('venue_owner_id', venueOwnerId);

        if (!repliesError) {
          repliesData = replies || [];
        }
      }

      // Combine all data
      const reviewsWithData = reviewsData?.map(review => ({
        ...review,
        profiles: review.user_id 
          ? profilesData.find(profile => profile.id === review.user_id) || { full_name: null }
          : { full_name: null },
        review_replies: repliesData.find(reply => reply.review_id === review.id) || null
      })) || [];

      setReviews(reviewsWithData);
      setError(null);
    } catch (err) {
      console.error('Unexpected error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const submitReply = async (reviewId: string, replyText: string) => {
    try {
      // Set the venue owner ID in the session context for RLS
      await supabase.rpc('set_config', {
        setting_name: 'app.current_venue_owner_id',
        setting_value: venueOwnerId
      });

      const { error: insertError } = await supabase
        .from('review_replies')
        .insert({
          review_id: reviewId,
          venue_owner_id: venueOwnerId,
          reply_text: replyText.trim(),
        });

      if (insertError) {
        console.error('Error submitting reply:', insertError);
        toast({
          title: "Error",
          description: "Failed to submit reply. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Reply Submitted",
        description: "Your reply has been posted successfully.",
      });

      // Refresh reviews
      await fetchReviews();
      return true;
    } catch (err) {
      console.error('Unexpected error submitting reply:', err);
      toast({
        title: "Error",
        description: "Failed to submit reply. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (venueOwnerId) {
      fetchReviews();
    }
  }, [venueOwnerId]);

  return {
    reviews,
    isLoading,
    error,
    submitReply,
    refetch: fetchReviews,
  };
};
