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
  banner?: string;
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
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Finn',
];

export const BANNER_PRESETS = [
  { id: 'mesh', name: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' },
  { id: 'city', name: 'Cyber City', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=1000' },
  { id: 'peak', name: 'Minimalist Peak', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000' },
  { id: 'gradient', name: 'Color Gradient', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000' },
  { id: 'flow', name: 'Energy Flow', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000' },
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
  updatePassword: (current: string, next: string) => Promise<boolean>;
  logout: () => void;
}

const initialState = {
  user: {
    username: 'Jane Doe',
    bio: 'Product Designer at NeoPlane. Loves minimalist UIs and dark mode.',
    avatar: AVATAR_OPTIONS[0],
    banner: 'bg-primary',
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

      updatePassword: async (current, next) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Password updated:', { current, next });
        return true;
      },

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
