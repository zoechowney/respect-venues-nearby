import { supabase } from '@/integrations/supabase/client';

export interface OptimizationResult {
  url: string;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
  compressionRatio?: string;
  savings?: string;
  message?: string;
}

export const optimizeAndUploadImage = async (
  file: File,
  bucketName: string = 'sponsor-logos',
  fileName?: string
): Promise<OptimizationResult> => {
  try {
    // Generate filename if not provided
    const finalFileName = fileName || `${Date.now()}-${file.name}`;
    
    // Create FormData for the edge function
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucketName);
    formData.append('fileName', finalFileName);

    // Call the optimize-image edge function
    const { data, error } = await supabase.functions.invoke('optimize-image', {
      body: formData,
    });

    if (error) {
      throw new Error(error.message || 'Image optimization failed');
    }

    return data as OptimizationResult;
  } catch (error) {
    console.error('Image optimization error:', error);
    throw error;
  }
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Unsupported file type. Only JPEG, PNG, and WebP images are allowed.' 
    };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'File too large. Maximum size is 10MB.' 
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};