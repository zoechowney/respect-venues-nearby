import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-12 px-4',
      className
    )}>
      <div className="rounded-full bg-brand-navy/5 p-6 mb-4">
        <Icon className="w-12 h-12 text-brand-navy/40" />
      </div>
      
      <h3 className="text-lg font-semibold text-brand-navy mb-2">
        {title}
      </h3>
      
      <p className="text-brand-navy/60 mb-6 max-w-sm">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;