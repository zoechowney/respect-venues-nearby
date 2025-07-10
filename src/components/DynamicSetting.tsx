import React from 'react';
import { useSiteSetting } from '@/hooks/useContentManagement';

interface DynamicSettingProps {
  settingKey: string;
  fallback?: string;
  className?: string;
}

const DynamicSetting: React.FC<DynamicSettingProps> = ({ 
  settingKey, 
  fallback = '', 
  className = '' 
}) => {
  const { data: setting, isLoading } = useSiteSetting(settingKey);

  if (isLoading) {
    return (
      <span className={`animate-pulse bg-gray-200 h-4 w-20 inline-block rounded ${className}`} />
    );
  }

  return (
    <span className={className}>
      {setting?.value || fallback}
    </span>
  );
};

export default DynamicSetting;