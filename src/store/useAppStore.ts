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
  profileUserId: string | null;
  activeThreadId: string | null;
  activeGroupId: string | null;
  activeView: 'home' | 'chat' | 'info' | 'explore' | 'friends' | 'create-channel';
  rightPanelTab: 'members' | 'threads' | 'pinned';
  conversationMeta: Record<string, { 
    name: string; 
    description: string; 
    category?: string;
    memberCount: number; 
    online: { name: string; avatar: string }[];
    groups?: { id: string; name: string; description?: string; joined: boolean; }[];
    threads?: Record<string, { replies: number; lastReply: string }>;
  }>;

  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setActiveConversation: (id: string | null) => void;
  setActiveGroup: (id: string | null) => void;
  setActiveThread: (id: string | null) => void;
  setActiveView: (view: 'home' | 'chat' | 'info' | 'explore' | 'friends' | 'create-channel') => void;
  setRightPanelTab: (tab: 'members' | 'threads' | 'pinned') => void;
  toggleCommandPalette: () => void;
  toggleNotificationPanel: () => void;
  toggleProfilePanel: (userId?: string | null) => void;
  setAuthModal: (open: boolean, mode?: 'login' | 'signup') => void;
  updateChannelDescription: (id: string, description: string) => void;
  toggleGroupMembership: (channelId: string, groupId: string) => void;
  createChannel: (name: string, description: string, category: string, isPrivate: boolean) => void;
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
      profileUserId: null,
      activeThreadId: null,
      activeGroupId: null,
      activeView: 'home',
      rightPanelTab: 'members',
      conversationMeta: {
        '1': { 
          name: 'general', 
          description: 'Team-wide updates and good vibes', 
          memberCount: 24, 
          online: [
            { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            { name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
            { name: 'Taylor Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' }
          ],
          friends: [],
          groups: [
            { id: 'g1', name: 'Standard Chat', description: 'The main discussion hub for the team.', joined: true },
            { id: 'g2', name: 'Off-topic', description: 'Everything else—memes, music, and random thoughts.', joined: false }
          ],
          threads: {
            'm1': { replies: 12, lastReply: '2m ago' },
            'm2': { replies: 5, lastReply: '1h ago' }
          }
        },
        '2': { 
          name: 'global-chat',
          description: 'General discussion for everyone',
          memberCount: 24, 
          online: [
            { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
          ],
          friends: []
        },
        '3': { 
          name: 'engineering', 
          description: 'Where bugs go to die', 
          memberCount: 8, 
          online: [
            { name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
            { name: 'Taylor Swift', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' }
          ],
          friends: [],
          groups: [
            { id: 'g3', name: 'Frontend', description: 'Building the visual future of NeoPlane.', joined: true },
            { id: 'g4', name: 'Backend', description: 'Wiring up the logic and scaling the infrastructure.', joined: false },
            { id: 'g5', name: 'Infrastructure', description: 'Cloud, DevOps, and deployment pipelines.', joined: false }
          ]
        },
      },

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
      setActiveConversation: (id) => set((state) => {
        if (!id) {
          return {
            activeConversationId: null,
            activeGroupId: null,
            activeView: 'home',
            rightPanelOpen: false
          };
        }
        return { 
          activeConversationId: id, 
          activeGroupId: null,
          activeView: 'chat',
          rightPanelOpen: state.activeConversationId !== id ? true : state.rightPanelOpen
        };
      }),
      setActiveGroup: (id) => set({ activeGroupId: id }),
      setActiveThread: (id) => set((state) => ({ 
        activeThreadId: id,
        rightPanelOpen: id !== null ? true : state.rightPanelOpen,
        rightPanelTab: id !== null ? 'threads' : state.rightPanelTab
      })),
      setActiveView: (view) => set({ activeView: view }),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
      toggleProfilePanel: (userId?: string | null) => set((state) => {
        // If opening, set userId (or null for current user). If closing, keep the current userId until it animates out.
        if (!state.profilePanelOpen) {
          return { profilePanelOpen: true, rightPanelOpen: false, profileUserId: userId ?? null };
        } else {
          // If already open, but clicking a different user, just update the user.
          if (userId !== undefined && userId !== state.profileUserId) {
             return { profileUserId: userId ?? null };
          }
          // Otherwise toggle off
          return { profilePanelOpen: false };
        }
      }),
      setAuthModal: (open, mode) => set((state) => ({ 
        authModalOpen: open, 
        authModalMode: mode || state.authModalMode 
      })),
      updateChannelDescription: (id, description) => set((state) => ({
        conversationMeta: {
          ...state.conversationMeta,
          [id]: { ...state.conversationMeta[id], description }
        }
      })),
      toggleGroupMembership: (channelId, groupId) =>
        set((state) => {
          const meta = state.conversationMeta[channelId];
          if (!meta || !meta.groups) return state;

          const groupIndex = meta.groups.findIndex(g => g.id === groupId);
          if (groupIndex === -1) return state;

          const updatedGroups = [...meta.groups];
          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            joined: !updatedGroups[groupIndex].joined
          };

          return {
            conversationMeta: {
              ...state.conversationMeta,
              [channelId]: {
                ...meta,
                groups: updatedGroups
              }
            }
          };
        }),
      createChannel: (name, description, category, _isPrivate) =>
        set((state) => {
          const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          if (state.conversationMeta[newId]) return state; // Don't duplicate
          
          return {
            conversationMeta: {
              ...state.conversationMeta,
              [newId]: {
                name,
                description,
                category,
                memberCount: 1, // Only the creator initially
                online: [],
                groups: []
              }
            },
            activeConversationId: newId,
            activeView: 'chat'
          };
        }),
    }),
    {
      name: 'neoplane-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
