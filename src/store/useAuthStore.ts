import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useAppStore } from './useAppStore';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status?: string;
  bio?: string;
  banner?: string;
  pinnedChannels?: string[];
  mutedChannels?: string[];
  mutedUsers?: string[];
  customStatus?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, token: string, refreshToken?: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('accessToken'),
      isAuthenticated: false, // Always start as false, wait for checkAuth
      isLoading: true,

      setAuth: (user, token, refreshToken) => {
        localStorage.setItem('accessToken', token);
        // Always persist refreshToken if provided
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        if (user && user.pinnedChannels !== undefined) {
          useAppStore.getState().setPreferences({
            pinnedChannels: user.pinnedChannels,
            mutedChannels: user.mutedChannels || [],
            mutedUsers: user.mutedUsers || []
          });
        }
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!token && !refreshToken) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        // Helper to fetch user data with a given token
        const fetchMe = async (t: string) => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${t}` }
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        };

        try {
          // Try with current access token first
          const currentToken = token || '';
          let data: any = null;

          try {
            data = await fetchMe(currentToken);
          } catch (err: any) {
            // If it's a 401 and we have a refresh token, try to silently refresh
            if (err.message.includes('401') && refreshToken) {
              console.log('[Auth] Access token expired, attempting silent refresh...');
              const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
              const { default: axios } = await import('axios');
              const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
              const newToken = refreshRes.data.data.accessToken;
              localStorage.setItem('accessToken', newToken);
              data = await fetchMe(newToken);
            } else {
              throw err;
            }
          }

          const userData = data.data.user;
          if (userData && userData.pinnedChannels !== undefined) {
            useAppStore.getState().setPreferences({
              pinnedChannels: userData.pinnedChannels,
              mutedChannels: userData.mutedChannels,
              mutedUsers: userData.mutedUsers
            });
          }
          set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          // Only force logout if it's truly an auth error (not a network blip or rate limit)
          const isRateLimitError = error.message && error.message.includes('429');
          const isServerError = error.message && error.message.includes('50');
          const isNetworkError = !error.message || error.message === 'Failed to fetch';
          
          if (isNetworkError || isRateLimitError || isServerError) {
            // Keep the user logged in on network/server errors — just mark loading as done
            console.warn('[Auth] Transient error during checkAuth, keeping session alive.', error.message);
            set({ isLoading: false });
          } else {
            console.error('[Auth] Session check failed:', error.message);
            get().logout();
          }
        }
      }
    }),
    {
      name: 'neoplane-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist basic info, checkAuth will hydrate the rest
      partialize: (state) => ({ token: state.token }),
    }
  )
);
