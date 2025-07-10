import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'network' | 'validation' | 'server' | 'generic';
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  type = 'generic',
  onRetry,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'network':
        return WifiOff;
      case 'server':
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'validation':
        return 'Invalid Input';
      case 'server':
        return 'Server Error';
      default:
        return 'Error';
    }
  };

  const Icon = getIcon();

  return (
    <Alert variant="destructive" className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title || getDefaultTitle()}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="mt-3 w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Hook for network status detection
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Network status indicator component
export const NetworkStatus: React.FC = () => {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 text-center text-sm">
      <WifiOff className="w-4 h-4 inline mr-2" />
      You are currently offline. Some features may not work.
    </div>
  );
};

export default ErrorMessage;