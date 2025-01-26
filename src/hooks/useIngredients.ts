// src/hooks/useIngredients.ts
import { useState, useEffect, useCallback } from 'react';
import { Ingredient } from '@/src/types';
import apiService from '@/src/services/api';

interface SessionState {
  isValid: boolean;
  lastChecked: number;
}

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<SessionState>({
    isValid: false,
    lastChecked: 0
  });

  const checkSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-session', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const isValid = response.ok;
      setSessionState({
        isValid,
        lastChecked: Date.now()
      });
      return isValid;
    } catch (error) {
      console.error('Session check failed:', error);
      return false;
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Session refresh failed:', error);
      return false;
    }
  };

  const fetchWithRetry = async (request: () => Promise<any>, retries = 2): Promise<any> => {
    try {
      return await request();
    } catch (err: any) {
      if (err?.response?.status === 401 && retries > 0) {
        const refreshed = await refreshSession();
        if (refreshed) {
          return fetchWithRetry(request, retries - 1);
        }
      }
      throw err;
    }
  };

  const fetchIngredients = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check session if it hasn't been checked in the last minute
      if (Date.now() - sessionState.lastChecked > 60000) {
        const isValid = await checkSession();
        if (!isValid) {
          const refreshed = await refreshSession();
          if (!refreshed) {
            throw new Error('Session expired');
          }
        }
      }

      const data = await fetchWithRetry(() => apiService.getIngredients());
      setIngredients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [sessionState.lastChecked]);

  useEffect(() => {
    fetchIngredients();

    // Set up periodic session checks
    const intervalId = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [fetchIngredients]);

  const refresh = () => {
    fetchIngredients();
  };

  return {
    ingredients,
    loading,
    error,
    refresh,
    isSessionValid: sessionState.isValid
  };
};

export default useIngredients;