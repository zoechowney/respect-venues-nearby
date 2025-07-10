import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  onError?: (error: Error, attempt: number) => void;
}

export const useRetry = (options: UseRetryOptions = {}) => {
  const { maxAttempts = 3, delay = 1000, onError } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setIsRetrying(true);
    setAttempt(0);

    let lastError: Error | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        setAttempt(i + 1);
        const result = await operation();
        setIsRetrying(false);
        setAttempt(0);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        onError?.(lastError, i + 1);

        if (i < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }

    setIsRetrying(false);
    setAttempt(0);
    throw lastError;
  }, [maxAttempts, delay, onError]);

  return {
    retry,
    isRetrying,
    attempt,
  };
};