import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface SessionUser {
  id: string;
  username: string;
}

interface AuthResponse {
  success: boolean;
  user?: SessionUser;
  error?: string;
}

export function useAuth() {
  const context = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const checkSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/check-session', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return false;
        }
        throw new Error('Session check failed');
      }

      const data = await response.json();
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setIsAuthenticated(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkSession();
    
    // Setup session check interval
    const intervalId = setInterval(() => {
      checkSession();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  return {
    ...context,
    isAuthenticated,
    loading,
    login,
    logout,
    checkSession,
  };
}