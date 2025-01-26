// src/hooks/useRecipes.ts
import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/src/types';
import apiService from '@/src/services/api';

interface SessionState {
  isValid: boolean;
  lastChecked: number;
}

export const useRecipes = (cuisine?: string) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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

      if (response.status === 404) {
        console.error('Session endpoint not found');
        return false;
      }

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

  const fetchWithRetry = async <T>(
    request: () => Promise<T>,
    retries = 2
  ): Promise<T> => {
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

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      
      const isValid = await checkSession();
      if (!isValid) {
        setError('Session expired - please login again');
        return;
      }

      const data = await apiService.getSuggestedRecipes(cuisine);
      setRecipes(data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Recipe service not available');
      } else {
        setError(err.message || 'Failed to fetch recipes');
      }
    } finally {
      setLoading(false);
    }
  }, [cuisine]);

  useEffect(() => {
    fetchRecipes();
    
    const intervalId = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    refresh: fetchRecipes,
    isSessionValid: sessionState.isValid
  };
};

export default useRecipes;