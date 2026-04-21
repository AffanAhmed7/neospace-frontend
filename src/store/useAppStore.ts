import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../lib/api';

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
  profileUserId: string | null;
  activeThreadId: string | null;
  activeGroupId: string | null;
  activeView: 'home' | 'chat' | 'info' | 'explore' | 'friends' | 'create-channel' | 'create-group' | 'message-requests';
  rightPanelTab: 'members' | 'threads' | 'pinned';
  
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  };

  pinnedChannelIds: string[];
  pinnedGroupIds: string[]; // Format: "channelId:groupId"
  mutedChannelIds: string[];
  mutedGroupIds: string[]; // Format: "channelId:groupId"
  mutedUserIds: string[];

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveConversation: (id: string | null) => void;
  setActiveGroup: (id: string | null) => void;
  setActiveThread: (id: string | null) => void;
  setActiveView: (view: 'home' | 'chat' | 'info' | 'explore' | 'friends' | 'create-channel' | 'create-group' | 'message-requests') => void;
  setRightPanelTab: (tab: 'members' | 'threads' | 'pinned') => void;
  toggleCommandPalette: () => void;
  toggleNotificationPanel: () => void;
  toggleProfilePanel: (userId?: string | null) => void;
  setAuthModal: (open: boolean, mode?: 'login' | 'signup') => void;
  
  openConfirm: (options: { title: string; message: string; confirmLabel?: string; onConfirm: () => void }) => void;
  closeConfirm: () => void;

  togglePinChannel: (id: string) => void;
  unpinChannel: (id: string) => void;
  togglePinGroup: (channelId: string, groupId: string) => void;
  toggleMuteChannel: (id: string) => void;
  toggleMuteGroup: (channelId: string, groupId: string) => void;
  toggleMuteUser: (userId: string) => void;
  setPreferences: (prefs: { pinnedChannels?: string[]; mutedChannels?: string[]; mutedUsers?: string[] }) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      rightPanelOpen: false,
      activeConversationId: null,
      commandPaletteOpen: false,
      notificationPanelOpen: false,
      authModalOpen: false,
      authModalMode: 'login',
      profilePanelOpen: false,
      profileUserId: null,
      activeThreadId: null,
      activeGroupId: null,
      activeView: 'home',
      rightPanelTab: 'members',
      confirmModal: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
      },
      pinnedChannelIds: [],
      pinnedGroupIds: [],
      mutedChannelIds: [],
      mutedGroupIds: [],
      mutedUserIds: [],

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveConversation: (id) => set((state) => {
        if (!id) {
          return {
            activeConversationId: null,
            activeGroupId: null,
            activeView: 'home',
            rightPanelOpen: false,
            profilePanelOpen: false
          };
        }
        return { 
          activeConversationId: id, 
          activeGroupId: null,
          activeView: 'chat',
          // Auto-open right panel for channels, but keep logic in UI components for better control
          rightPanelOpen: state.activeConversationId !== id ? true : state.rightPanelOpen
        };
      }),
      setActiveGroup: (id) => set({ activeGroupId: id }),
      setActiveThread: (id) => set((state) => ({ 
        activeThreadId: id,
        rightPanelOpen: id !== null ? true : state.rightPanelOpen,
        rightPanelTab: id !== null ? 'threads' : state.rightPanelTab
      })),
      setActiveView: (view) => set((state) => ({ 
        activeView: view,
        activeConversationId: view === 'home' ? null : state.activeConversationId,
        profilePanelOpen: (view === 'home' || view === 'create-channel' || view === 'create-group' || view === 'explore') ? false : state.profilePanelOpen,
        rightPanelOpen: (view === 'home' || view === 'create-channel' || view === 'create-group' || view === 'explore') ? false : state.rightPanelOpen
      })),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
      toggleProfilePanel: (userId) => set((state) => {
        if (userId === undefined || (userId && typeof userId === 'object')) {
          return { profilePanelOpen: false };
        }
        if (state.profilePanelOpen && userId === state.profileUserId) {
          return { profilePanelOpen: false };
        }
        return { profilePanelOpen: true, profileUserId: userId };
      }),
      setAuthModal: (open, mode) => set((state) => ({ 
        authModalOpen: open, 
        authModalMode: mode || state.authModalMode 
      })),

      openConfirm: (options) => set({ 
        confirmModal: { ...options, isOpen: true } 
      }),
      closeConfirm: () => set((state) => ({ 
        confirmModal: { ...state.confirmModal, isOpen: false } 
      })),

      togglePinChannel: (id) =>
        set((state) => {
          const pinnedChannelIds = state.pinnedChannelIds.includes(id)
            ? state.pinnedChannelIds.filter((pid) => pid !== id)
            : [...state.pinnedChannelIds, id];
          api.patch('/users/me/preferences', { pinnedChannels: pinnedChannelIds }).catch(console.error);
          return { pinnedChannelIds };
        }),
      unpinChannel: (id) =>
        set((state) => {
          if (!state.pinnedChannelIds.includes(id)) return state;
          const pinnedChannelIds = state.pinnedChannelIds.filter((pid) => pid !== id);
          api.patch('/users/me/preferences', { pinnedChannels: pinnedChannelIds }).catch(console.error);
          return { pinnedChannelIds };
        }),
      togglePinGroup: (channelId, groupId) =>
        set((state) => {
          const key = `${channelId}:${groupId}`;
          const pinnedGroupIds = state.pinnedGroupIds.includes(key)
            ? state.pinnedGroupIds.filter((gid) => gid !== key)
            : [...state.pinnedGroupIds, key];
            // If Groups are channels with parents, consider persisting them uniformly later. For now just local.
          return { pinnedGroupIds };
        }),
      toggleMuteChannel: (id) =>
        set((state) => {
          const mutedChannelIds = state.mutedChannelIds.includes(id)
            ? state.mutedChannelIds.filter((mid) => mid !== id)
            : [...state.mutedChannelIds, id];
            api.patch('/users/me/preferences', { mutedChannels: mutedChannelIds }).catch(console.error);
          return { mutedChannelIds };
        }),
      toggleMuteGroup: (channelId, groupId) =>
        set((state) => {
          const key = `${channelId}:${groupId}`;
          return {
            mutedGroupIds: state.mutedGroupIds.includes(key)
              ? state.mutedGroupIds.filter((mid) => mid !== key)
              : [...state.mutedGroupIds, key]
          };
        }),
      toggleMuteUser: (userId) =>
        set((state) => {
          const mutedUserIds = state.mutedUserIds.includes(userId)
            ? state.mutedUserIds.filter((mid) => mid !== userId)
            : [...state.mutedUserIds, userId];
            api.patch('/users/me/preferences', { mutedUsers: mutedUserIds }).catch(console.error);
          return { mutedUserIds };
        }),
      setPreferences: (prefs) => 
        set((state) => ({
          pinnedChannelIds: prefs.pinnedChannels || state.pinnedChannelIds,
          mutedChannelIds: prefs.mutedChannels || state.mutedChannelIds,
          mutedUserIds: prefs.mutedUsers || state.mutedUserIds,
        }))
    }),
    {
      name: 'neoplane-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
