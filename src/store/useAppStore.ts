import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
  rightPanelOpen: boolean;
  activeConversationId: string | null;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  authModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  profilePanelOpen: boolean;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveConversation: (id: string | null) => void;
  toggleCommandPalette: () => void;
  toggleNotificationPanel: () => void;
  toggleProfilePanel: () => void;
  setAuthModal: (open: boolean, mode?: 'login' | 'signup') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      rightPanelOpen: true,
      activeConversationId: null,
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      authModalOpen: false,
      authModalMode: 'login',
      profilePanelOpen: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
      toggleProfilePanel: () => set((state) => ({ profilePanelOpen: !state.profilePanelOpen })),
      setAuthModal: (open, mode) => set((state) => ({ 
        authModalOpen: open, 
        authModalMode: mode || state.authModalMode 
      })),
    }),
    {
      name: 'neoplane-app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
