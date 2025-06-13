
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VenueReview } from './useVenueReviews';

export const useAdminReviews = () => {
  const [pendingReviews, setPendingReviews] = useState<VenueReview[]>([]);
  const [allReviews, setAllReviews] = useState<VenueReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPendingReviews = async () => {
    try {
      setIsLoading(true);
      
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('venue_reviews')
        .select(`
          *,
          venues (
            business_name
          )
        `)
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching pending reviews:', reviewsError);
        setError(reviewsError.message);
        return;
      }

      // Get profiles for the users who left reviews
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

      setPendingReviews(reviewsWithProfiles);
      setError(null);
    } catch (err) {
      console.error('Unexpected error fetching pending reviews:', err);
      setError('Failed to fetch pending reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('venue_reviews')
        .select(`
          *,
          venues (
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching all reviews:', reviewsError);
        return;
      }

      // Get profiles for the users who left reviews
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

      setAllReviews(reviewsWithProfiles);
    } catch (err) {
      console.error('Unexpected error fetching all reviews:', err);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('venue_reviews')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error approving review:', error);
        toast({
          title: "Error",
          description: "Failed to approve review. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Review Approved",
        description: "The review has been approved and is now visible to users.",
      });

      // Refresh data
      await fetchPendingReviews();
      await fetchAllReviews();
      return true;
    } catch (err) {
      console.error('Unexpected error approving review:', err);
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('venue_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Error deleting review:', error);
        toast({
          title: "Error",
          description: "Failed to delete review. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Review Deleted",
        description: "The review has been permanently removed.",
      });

      // Refresh data
      await fetchPendingReviews();
      await fetchAllReviews();
      return true;
    } catch (err) {
      console.error('Unexpected error deleting review:', err);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPendingReviews();
    fetchAllReviews();
  }, []);

  return {
    pendingReviews,
    allReviews,
    isLoading,
    error,
    approveReview,
    deleteReview,
    refetch: fetchPendingReviews,
  };
};
