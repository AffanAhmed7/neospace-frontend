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

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveConversation: (id: string | null) => void;
  toggleCommandPalette: () => void;
  toggleNotificationPanel: () => void;
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

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
    }),
    {
      name: 'neoplane-app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
