import { useToast } from '@/hooks/use-toast';

export const useToastNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  const showError = (title: string, description?: string, retry?: () => void) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  // Specific success notifications
  const showVenueApplicationSubmitted = () => {
    showSuccess(
      'Application Submitted!',
      'Your venue application has been submitted for review. We\'ll be in touch soon.'
    );
  };

  const showReviewSubmitted = () => {
    showSuccess(
      'Review Submitted!',
      'Thank you for your feedback. Your review will be published after moderation.'
    );
  };

  const showContactFormSubmitted = () => {
    showSuccess(
      'Message Sent!',
      'We\'ve received your message and will get back to you as soon as possible.'
    );
  };

  const showSponsorApplicationSubmitted = () => {
    showSuccess(
      'Sponsorship Application Sent!',
      'Thank you for your interest in sponsoring Rest with Respect. We\'ll review your application and be in touch.'
    );
  };

  // Specific error notifications
  const showNetworkError = (retry?: () => void) => {
    showError(
      'Connection Error',
      'Unable to connect to our servers. Please check your internet connection.',
      retry
    );
  };

  const showValidationError = (field: string) => {
    showError(
      'Validation Error',
      `Please check the ${field} field and try again.`
    );
  };

  const showServerError = (retry?: () => void) => {
    showError(
      'Server Error',
      'Something went wrong on our end. Please try again.',
      retry
    );
  };

  const showLoadingError = (resource: string, retry?: () => void) => {
    showError(
      'Loading Error',
      `Failed to load ${resource}. Please try again.`,
      retry
    );
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showVenueApplicationSubmitted,
    showReviewSubmitted,
    showContactFormSubmitted,
    showSponsorApplicationSubmitted,
    showNetworkError,
    showValidationError,
    showServerError,
    showLoadingError,
  };
};