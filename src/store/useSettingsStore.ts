import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UserProfile {
  username: string;
  bio: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy' | 'away';
}

export const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
];


interface SettingsState {
  user: UserProfile;
  notifications: {
    mentions: boolean;
    messages: boolean;
    reactions: boolean;
  };
  privacy: {
    onlineStatus: boolean;
    readReceipts: boolean;
  };
  toasts: Toast[];

  // Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updateNotifications: (data: Partial<SettingsState['notifications']>) => void;
  updatePrivacy: (data: Partial<SettingsState['privacy']>) => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  logout: () => void;
}

const initialState = {
  user: {
    username: 'Jane Doe',
    bio: 'Product Designer at NeoPlane. Loves minimalist UIs and dark mode.',
    avatar: AVATAR_OPTIONS[0],
    status: 'online' as const,
  },
  notifications: {
    mentions: true,
    messages: true,
    reactions: false,
  },
  privacy: {
    onlineStatus: true,
    readReceipts: true,
  },
  toasts: [],
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      updateProfile: (data) => set((state) => ({
        user: { ...state.user, ...data }
      })),

      updateNotifications: (data) => set((state) => ({
        notifications: { ...state.notifications, ...data }
      })),

      updatePrivacy: (data) => set((state) => ({
        privacy: { ...state.privacy, ...data }
      })),

      addToast: (message, type = 'success') => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
          toasts: [...state.toasts, { id, message, type }]
        }));
        // Auto-remove after 3 seconds
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        }, 3000);
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),

      logout: () => {
        // Handle logout logic (clear storage, redirect, etc.)
        console.log('Logging out...');
      },
    }),
    {
      name: 'neoplane-settings-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
