import React from 'react';
import { useContentPage } from '@/hooks/useContentManagement';

interface DynamicContentProps {
  slug: string;
  fallback?: React.ReactNode;
  className?: string;
  renderAsHtml?: boolean;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  slug, 
  fallback = null, 
  className = '',
  renderAsHtml = false 
}) => {
  const { data: content, isLoading, error } = useContentPage(slug);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 h-8 rounded ${className}`} />
    );
  }

  if (error || !content) {
    return <>{fallback}</>;
  }

  if (renderAsHtml) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    );
  }

  return (
    <div className={className}>
      {content.content}
    </div>
  );
};

export default DynamicContent;