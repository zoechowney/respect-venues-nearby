import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  center?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
  center = false
}) => {
  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-brand-navy', sizeClasses[size])} />
      {text && (
        <span className="text-brand-navy/70 text-sm">{text}</span>
      )}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton loader for content placeholders
export const SkeletonLoader: React.FC<{ 
  lines?: number; 
  className?: string;
  showAvatar?: boolean;
}> = ({ 
  lines = 3, 
  className,
  showAvatar = false 
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {showAvatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-brand-navy/10 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-brand-navy/10 rounded w-3/4"></div>
            <div className="h-3 bg-brand-navy/10 rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              'h-4 bg-brand-navy/10 rounded',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;