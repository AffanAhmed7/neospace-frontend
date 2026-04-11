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
  activeView: 'home' | 'chat' | 'info' | 'explore' | 'friends' | 'create-channel' | 'create-group' | 'message-requests';
  rightPanelTab: 'members' | 'threads' | 'pinned';
  conversationMeta: Record<string, { 
    name: string; 
    description: string; 
    category?: string;
    memberCount: number; 
    online: { name: string; avatar: string }[];
    heroImage?: string;
    groups?: { id: string; name: string; description?: string; joined: boolean; }[];
    isDM?: boolean;
    friends?: any[];
    threads?: Record<string, { replies: number; lastReply: string }>;
  }>;
  pinnedChannelIds: string[];
  pinnedMessageIds: Record<string, string[]>; // channelId -> messageIds
  messages: Record<string, {
    id: string;
    user: { name: string; avatar: string };
    content: string;
    time: string;
    reactions: { emoji: string; count: number }[];
    isOwn: boolean;
    attachments?: { name: string; type: string; url: string }[];
  }[]>; // channelId -> messages
  addMessage: (channelId: string, content: string, fileAttachments?: File[]) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  pinnedGroupIds: string[]; // Format: "channelId:groupId"
  friendIds: string[];
  mutedChannelIds: string[];
  mutedGroupIds: string[]; // Format: "channelId:groupId"
  mutedUserIds: string[];

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
  updateChannelDescription: (id: string, description: string) => void;
  toggleGroupMembership: (channelId: string, groupId: string) => void;
  updateChannelHero: (id: string, heroImage: string) => void;
  createChannel: (name: string, description: string, category: string, isPrivate: boolean, heroImage?: string) => void;
  createGroup: (channelId: string, name: string, description: string, isPrivate: boolean) => void;
  togglePinChannel: (id: string) => void;
  togglePinGroup: (channelId: string, groupId: string) => void;
  togglePinMessage: (channelId: string, messageId: string) => void;
  leaveChannel: (id: string) => void;
  toggleMuteChannel: (id: string) => void;
  toggleMuteGroup: (channelId: string, groupId: string) => void;
  toggleMuteUser: (userId: string) => void;
  acceptedRequestIds: string[];
  acceptRequest: (id: string) => void;
  deleteRequest: (id: string) => void;
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
      pinnedChannelIds: [],
      pinnedGroupIds: [],
      friendIds: ['1', '2', '3'], // Alex, Jordan, Sarah
      mutedChannelIds: [],
      mutedGroupIds: [],
      mutedUserIds: [],
      acceptedRequestIds: [],
      acceptRequest: (id) => set((state) => ({ 
        acceptedRequestIds: [...state.acceptedRequestIds, id],
        friendIds: [...state.friendIds, id]
      })),
      deleteRequest: (id) => set((state) => {
        const newConvMeta = { ...state.conversationMeta };
        delete newConvMeta[id];
        return { conversationMeta: newConvMeta };
      }),
      conversationMeta: {
        'c1': { 
          name: 'Casuals', 
          description: 'The heartbeat of NeoPlane — a space for everything and nothing.', 
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
        'c2': { 
          name: 'global-chat',
          description: 'General discussion for everyone',
          memberCount: 24, 
          online: [
            { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }
          ],
          friends: []
        },
        'c3': { 
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
        '1': {
          name: 'Alex Rivera',
          description: 'Software Engineer @ NeoPlane. Building the visual future.',
          memberCount: 2,
          online: [{ name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' }],
          isDM: true
        },
        '2': {
          name: 'Jordan Lee',
          description: 'Product Designer @ NeoPlane. Obsessed with details.',
          memberCount: 2,
          online: [{ name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' }],
          isDM: true
        },
        '3': { 
          name: 'Sarah Chen', 
          description: 'Frontend Architect. Pushing pixels to perfection.', 
          memberCount: 0, 
          online: [], 
          isDM: true 
        },
        '4': { 
          name: 'Marcus Wright', 
          description: 'Security & Backend. Keeping NeoPlane safe.', 
          memberCount: 0, 
          online: [], 
          isDM: true 
        },
        '5': { 
          name: 'Elena Rossi', 
          description: 'Product Designer. Obsessed with high-fidelity interactions.', 
          memberCount: 0, 
          online: [], 
          isDM: true 
        },
        'p1': { 
          name: 'David Kim', 
          description: 'Unknown User. Potential security risk.', 
          memberCount: 0, 
          online: [], 
          isDM: true 
        },
      },
      pinnedMessageIds: {},
      messages: {
        'c1': [
          {
            id: 'm1',
            user: { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
            content: 'Has anyone seen the latest design specs for the dashboard? They look incredible 🔥',
            time: '10:24 AM',
            reactions: [{ emoji: '🔥', count: 3 }, { emoji: '👀', count: 2 }],
            isOwn: false,
          },
          {
            id: 'm2',
            user: { name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
            content: 'Just uploaded them to the #engineering channel. The new glassmorphism treatment is 🤌',
            time: '10:26 AM',
            reactions: [{ emoji: '🤌', count: 5 }],
            isOwn: false,
          },
          {
            id: 'm3',
            user: { name: 'Jane Doe', avatar: '' }, // Handled by settings store in UI
            content: 'The ambient glow on the sidebar is such a good touch. Sarah crushed it.',
            time: '10:28 AM',
            reactions: [],
            isOwn: true,
          },
        ],
        '1': [
          {
             id: 'dm-a-1',
             user: { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
             content: 'Hey Jane! Have you had a chance to look at those new mockups?',
             time: '10:15 AM',
             reactions: [],
             isOwn: false
          }
        ],
        '2': [
          {
             id: 'dm-j-1',
             user: { name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
             content: 'The glassmorphism on the sidebar looks slick! Good job on the implementation.',
             time: 'Yesterday',
             reactions: [{ emoji: '✨', count: 1 }],
             isOwn: false
          }
        ],
        '4': [
          { id: '1', user: { name: 'Marcus Wright', avatar: '' }, content: "Hey! I saw your work on the NeoPlane design system. Any chance you're open for a quick chat about a collab?", time: '2:00 PM', reactions: [], isOwn: false }
        ],
        '5': [
          { id: '1', user: { name: 'Elena Rossi', avatar: '' }, content: "Found your profile through the engineering channel. Wanted to ask about the deployment pipeline you mentioned.", time: '5:00 PM', reactions: [], isOwn: false }
        ],
        'p1': [
          { id: '1', user: { name: 'David Kim', avatar: '' }, content: "URGENT: Click here to claim your NeoPlane reward! bit.ly/not-a-scam-trust-me", time: 'Yesterday', reactions: [], isOwn: false }
        ]
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
            rightPanelOpen: false,
            profilePanelOpen: false
          };
        }
        const meta = state.conversationMeta[id];
        return { 
          activeConversationId: id, 
          activeGroupId: null,
          activeView: 'chat',
          rightPanelOpen: (meta?.isDM) ? false : (state.activeConversationId !== id ? true : state.rightPanelOpen)
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
        // Close side panels when switching to full-page views or back to home
        profilePanelOpen: (view === 'home' || view === 'create-channel' || view === 'create-group' || view === 'explore') ? false : state.profilePanelOpen,
        rightPanelOpen: (view === 'home' || view === 'create-channel' || view === 'create-group' || view === 'explore') ? false : state.rightPanelOpen
      })),
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      toggleNotificationPanel: () => set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
      toggleProfilePanel: (userId?: string | null | any) => set((state) => {
        // Sanitize input: If userId is an event object (common when passed directly to onClick),
        // or if it's undefined, treat it as a "close" command.
        const isEvent = userId && typeof userId === 'object' && ('nativeEvent' in userId || 'target' in userId);
        
        if (userId === undefined || isEvent) {
          console.log('[toggleProfilePanel] Closing modal (input sanitized)');
          return { profilePanelOpen: false };
        }
        
        console.log('[toggleProfilePanel] Called with userId:', userId);
        
        // Same user clicked while already open = close (toggle off)
        if (state.profilePanelOpen && userId === state.profileUserId) {
          console.log('[toggleProfilePanel] Toggling OFF for same user:', userId);
          return { profilePanelOpen: false };
        }
        
        // Any other case: open the modal with the given user
        console.log('[toggleProfilePanel] Opening for user:', userId);
        return { profilePanelOpen: true, profileUserId: userId };
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
      updateChannelHero: (id, heroImage) => set((state) => ({
        conversationMeta: {
          ...state.conversationMeta,
          [id]: { ...state.conversationMeta[id], heroImage }
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
      createChannel: (name, description, category, _isPrivate, heroImage) =>
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
                heroImage: heroImage || '',
                memberCount: 1, // Only the creator initially
                online: [],
                groups: []
              }
            },
            activeConversationId: newId,
            activeView: 'chat'
          };
        }),
      createGroup: (channelId, name, description, _isPrivate) =>
        set((state) => {
          const meta = state.conversationMeta[channelId];
          if (!meta) return state;
          
          const newGroupId = 'g-' + Math.random().toString(36).substring(2, 9);
          const newGroups = [
            ...(meta.groups || []),
            { 
              id: newGroupId, 
              name, 
              description, 
              joined: true 
            }
          ];

          return {
            conversationMeta: {
              ...state.conversationMeta,
              [channelId]: {
                ...meta,
                groups: newGroups
              }
            },
            activeGroupId: newGroupId,
            activeView: 'chat'
          };
        }),
      togglePinChannel: (id) =>
        set((state) => ({
          pinnedChannelIds: state.pinnedChannelIds.includes(id)
            ? state.pinnedChannelIds.filter((pid) => pid !== id)
            : [...state.pinnedChannelIds, id]
        })),
      togglePinGroup: (channelId, groupId) =>
        set((state) => {
          const key = `${channelId}:${groupId}`;
          return {
            pinnedGroupIds: state.pinnedGroupIds.includes(key)
              ? state.pinnedGroupIds.filter((gid) => gid !== key)
              : [...state.pinnedGroupIds, key]
          };
        }),
      leaveChannel: (id) =>
        set((state) => {
          const newMeta = { ...state.conversationMeta };
          delete newMeta[id];
          return {
            conversationMeta: newMeta,
            activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
            activeView: state.activeConversationId === id ? 'home' : state.activeView,
            pinnedChannelIds: state.pinnedChannelIds.filter(pid => pid !== id),
            pinnedGroupIds: state.pinnedGroupIds.filter(gid => !gid.startsWith(`${id}:`))
          };
        }),
      togglePinMessage: (channelId, messageId) =>
        set((state) => {
          const currentPinned = state.pinnedMessageIds[channelId] || [];
          const isPinned = currentPinned.includes(messageId);
          return {
            pinnedMessageIds: {
              ...state.pinnedMessageIds,
              [channelId]: isPinned
                ? currentPinned.filter(id => id !== messageId)
                : [...currentPinned, messageId]
            }
          };
        }),
      toggleMuteChannel: (id) =>
        set((state) => ({
          mutedChannelIds: state.mutedChannelIds.includes(id)
            ? state.mutedChannelIds.filter((mid) => mid !== id)
            : [...state.mutedChannelIds, id]
        })),
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
        set((state) => ({
          mutedUserIds: state.mutedUserIds.includes(userId)
            ? state.mutedUserIds.filter((mid) => mid !== userId)
            : [...state.mutedUserIds, userId]
        })),
      addMessage: (channelId: string, content: string, fileAttachments?: File[]) =>
        set((state) => {
          const currentMessages = state.messages[channelId] || [];
          const newMessage = {
            id: 'm-' + Math.random().toString(36).substring(2, 9),
            user: { name: 'Jane Doe', avatar: '' }, // Handled by settings in UI
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: [],
            isOwn: true,
            attachments: fileAttachments?.map(file => ({
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file)
            }))
          };

          return {
            messages: {
              ...state.messages,
              [channelId]: [...currentMessages, newMessage]
            }
          };
        }),
      deleteMessage: (channelId: string, messageId: string) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [channelId]: (state.messages[channelId] || []).filter(m => m.id !== messageId)
          }
        })),
    }),
    {
      name: 'neoplane-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
