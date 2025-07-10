interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

class RateLimiter {
  private storage: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if action is rate limited
   * @param identifier - Unique identifier (IP, user ID, etc.)
   * @param action - Action being performed
   * @param windowMs - Time window in milliseconds
   * @param maxAttempts - Maximum attempts allowed in window
   * @returns { allowed: boolean, remaining: number, resetTime: number }
   */
  checkLimit(
    identifier: string,
    action: string,
    windowMs: number = 15 * 60 * 1000, // 15 minutes
    maxAttempts: number = 5
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry) {
      // First attempt
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetTime: now + windowMs
      };
    }

    // Check if window has expired
    if (now - entry.firstAttempt > windowMs) {
      // Reset window
      this.storage.set(key, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetTime: now + windowMs
      };
    }

    // Update attempt count
    entry.count++;
    entry.lastAttempt = now;
    this.storage.set(key, entry);

    const allowed = entry.count <= maxAttempts;
    const remaining = Math.max(0, maxAttempts - entry.count);
    const resetTime = entry.firstAttempt + windowMs;

    return { allowed, remaining, resetTime };
  }

  /**
   * Get current status without incrementing counter
   */
  getStatus(
    identifier: string,
    action: string,
    windowMs: number = 15 * 60 * 1000,
    maxAttempts: number = 5
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${identifier}:${action}`;
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now - entry.firstAttempt > windowMs) {
      return {
        allowed: true,
        remaining: maxAttempts,
        resetTime: now + windowMs
      };
    }

    const allowed = entry.count < maxAttempts;
    const remaining = Math.max(0, maxAttempts - entry.count);
    const resetTime = entry.firstAttempt + windowMs;

    return { allowed, remaining, resetTime };
  }

  /**
   * Clear rate limit for a specific identifier and action
   */
  clearLimit(identifier: string, action: string): void {
    const key = `${identifier}:${action}`;
    this.storage.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.storage.entries()) {
      // If last attempt was more than 1 hour ago, remove entry
      if (now - entry.lastAttempt > 60 * 60 * 1000) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.storage.delete(key));
  }

  /**
   * Get current storage size (for debugging)
   */
  getStorageSize(): number {
    return this.storage.size;
  }

  /**
   * Clear all rate limit data
   */
  clearAll(): void {
    this.storage.clear();
  }

  /**
   * Destroy rate limiter and cleanup
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clearAll();
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limits for different actions
export const RATE_LIMITS = {
  VENUE_APPLICATION: { windowMs: 60 * 60 * 1000, maxAttempts: 2 }, // 2 per hour
  REVIEW_SUBMISSION: { windowMs: 15 * 60 * 1000, maxAttempts: 3 }, // 3 per 15 minutes
  CONTACT_FORM: { windowMs: 15 * 60 * 1000, maxAttempts: 3 }, // 3 per 15 minutes
  SPONSOR_APPLICATION: { windowMs: 24 * 60 * 60 * 1000, maxAttempts: 1 }, // 1 per day
  AUTH_LOGIN: { windowMs: 15 * 60 * 1000, maxAttempts: 5 }, // 5 per 15 minutes
  PASSWORD_RESET: { windowMs: 60 * 60 * 1000, maxAttempts: 3 }, // 3 per hour
} as const;

// Helper function to get user identifier
export const getUserIdentifier = (): string => {
  // In production, you might want to use IP + User Agent hash
  // For now, we'll use a combination of localStorage and sessionStorage
  
  let identifier = localStorage.getItem('rwr_identifier');
  if (!identifier) {
    identifier = crypto.randomUUID();
    localStorage.setItem('rwr_identifier', identifier);
  }
  
  return identifier;
};

// React hook for rate limiting
export const useRateLimit = (action: string, options?: { windowMs?: number; maxAttempts?: number }) => {
  const identifier = getUserIdentifier();
  
  const checkLimit = () => {
    const windowMs = options?.windowMs || RATE_LIMITS.VENUE_APPLICATION.windowMs;
    const maxAttempts = options?.maxAttempts || RATE_LIMITS.VENUE_APPLICATION.maxAttempts;
    
    return rateLimiter.checkLimit(identifier, action, windowMs, maxAttempts);
  };

  const getStatus = () => {
    const windowMs = options?.windowMs || RATE_LIMITS.VENUE_APPLICATION.windowMs;
    const maxAttempts = options?.maxAttempts || RATE_LIMITS.VENUE_APPLICATION.maxAttempts;
    
    return rateLimiter.getStatus(identifier, action, windowMs, maxAttempts);
  };

  const clearLimit = () => {
    rateLimiter.clearLimit(identifier, action);
  };

  return { checkLimit, getStatus, clearLimit };
};