import { useEffect, useState } from 'react';
import {
  loginAPI,
  registerAPI,
  logoutAPI,
  fetchCurrentUserAPI,
  setAuthToken,
  setStoredUser,
  getStoredUser,
  clearAuthToken,
} from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Google OAuth callback: extract token from URL and save
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    console.log('[OAuth] Callback params - token:', token ? 'exists' : 'none', 'error:', errorParam);

    if (token) {
      console.log('[OAuth] Saving token to localStorage...');
      setAuthToken(token);
      // Fetch user data with the new token
      const loadGoogleUser = async () => {
        try {
          console.log('[OAuth] Fetching current user profile...');
          const profile = await fetchCurrentUserAPI();
          console.log('[OAuth] User profile loaded:', profile);
          setStoredUser(profile);
          setUser(profile);
          // Clean up URL bar - don't reload to preserve cache and state
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('[OAuth] Login complete, user set and URL cleaned');
        } catch (err) {
          console.error('[OAuth] Failed to load Google user:', err);
          clearAuthToken();
        }
      };
      loadGoogleUser();
    } else if (errorParam) {
      console.error('[OAuth] Error:', errorParam);
      setError(`Lỗi đăng nhập Google: ${errorParam}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Load user from stored session
  useEffect(() => {
    const loadUser = async () => {
      const existing = getStoredUser();
      if (!existing) return;

      setLoading(true);
      try {
        const profile = await fetchCurrentUserAPI();
        setUser(profile);
        setStoredUser(profile);
      } catch (err) {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      loadUser();
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginAPI(email, password);
      setAuthToken(result.token);
      setStoredUser(result.user);
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerAPI(email, password, name);
      setAuthToken(result.token);
      setStoredUser(result.user);
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutAPI();
    } catch (err) {
      console.error('[Logout] Error:', err);
    } finally {
      clearAuthToken();
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
  };
};
