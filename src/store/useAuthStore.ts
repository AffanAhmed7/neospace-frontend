import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
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

      setAuth: (user, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            set({ user: data.data.user, isAuthenticated: true, isLoading: false });
          } else {
            // Token might be expired or invalid
            get().logout();
          }
        } catch (error) {
          console.error('Failed to check auth:', error);
          get().logout(); // Safe default: logout on network/server error
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
