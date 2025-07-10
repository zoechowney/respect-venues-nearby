import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
};

/**
 * Sanitize plain text content
 */
export const sanitizeText = (text: string): string => {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Validate and sanitize URL
 */
export const sanitizeUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    // Remove any potential XSS in URL
    return parsed.toString().replace(/javascript:/gi, '');
  } catch {
    return null;
  }
};

/**
 * Generate Content Security Policy for production
 */
export const generateCSP = (isDevelopment: boolean = false): string => {
  const basePolicy = [
    "default-src 'self'",
    `script-src 'self' ${isDevelopment ? "'unsafe-eval' " : ""}https://api.mapbox.com https://*.supabase.co https://api.tinify.com`,
    "style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co https://api.mapbox.com https://tinypng.com https://api.tinify.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.mapbox.com https://api.tinify.com wss://*.supabase.co",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  return basePolicy.join('; ');
};

/**
 * Generate all security headers for production
 */
export const generateSecurityHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': generateCSP(false),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=(self)',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
    ].join(', '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
};

/**
 * Validate file upload security
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Only JPEG, PNG, WebP, and GIF images are permitted' };
  }

  // Check file extension matches MIME type
  const extension = file.name.toLowerCase().split('.').pop();
  const typeExtensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/gif': ['gif'],
  };

  const allowedExtensions = typeExtensionMap[file.type] || [];
  if (!extension || !allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension does not match file type' };
  }

  return { valid: true };
};

/**
 * Hash sensitive data for logging (one-way)
 */
export const hashForLogging = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { 
  score: number; 
  feedback: string[]; 
  isStrong: boolean 
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (password.length >= 12) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  // Common password check
  const commonPasswords = ['password', '123456', 'password123', 'admin', 'letmein'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    score -= 2;
    feedback.push('Avoid common passwords');
  }

  // Repetitive character check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push('Avoid repeating characters');
  }

  const isStrong = score >= 5;
  return { score: Math.max(0, score), feedback, isStrong };
};

/**
 * Detect potential spam content
 */
export const detectSpam = (content: string): { isSpam: boolean; confidence: number; reasons: string[] } => {
  const reasons: string[] = [];
  let spamScore = 0;

  // Check for excessive links
  const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
  if (linkCount > 2) {
    spamScore += 3;
    reasons.push('Too many links');
  }

  // Check for excessive uppercase
  const uppercaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (uppercaseRatio > 0.3 && content.length > 20) {
    spamScore += 2;
    reasons.push('Excessive uppercase text');
  }

  // Check for spam keywords
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'free money', 'click here', 'buy now'];
  const foundSpamWords = spamKeywords.filter(keyword => 
    content.toLowerCase().includes(keyword)
  );
  if (foundSpamWords.length > 0) {
    spamScore += foundSpamWords.length * 2;
    reasons.push(`Contains spam keywords: ${foundSpamWords.join(', ')}`);
  }

  // Check for excessive repetition
  const words = content.toLowerCase().split(/\s+/);
  const wordCounts = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxRepetition = Math.max(...Object.values(wordCounts));
  if (maxRepetition > 5) {
    spamScore += 2;
    reasons.push('Excessive word repetition');
  }

  const confidence = Math.min(spamScore / 10, 1);
  const isSpam = confidence > 0.6;

  return { isSpam, confidence, reasons };
};

/**
 * Generate secure session token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Mask sensitive data for display
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) {
    return '*'.repeat(data.length);
  }
  const masked = '*'.repeat(data.length - visibleChars);
  return masked + data.slice(-visibleChars);
};