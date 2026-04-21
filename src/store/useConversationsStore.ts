import { create } from 'zustand';
import api from '../lib/api';
import { getSocket } from '../lib/socket';

export interface Participant {
  id: string;
  username: string;
  avatar?: string;
  status?: string;
  role?: string;
}

export interface Conversation {
  id: string;
  name?: string;
  type: 'DIRECT' | 'GROUP' | 'CHANNEL';
  isPrivate: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  participants: { user: Participant; role: string }[];
  messages?: import('./useMessagesStore').Message[];
  isPublic?: boolean;
  isHidden?: boolean;
  status?: 'ACTIVE' | 'PENDING' | 'DECLINED';

  // Frontend-computed
  displayName?: string;
  displayAvatar?: string;
  description?: string;
  category?: string;
  heroImage?: string;
}

export interface ChannelInvite {
  id: string;
  conversationId: string;
  inviterId: string;
  inviteeId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
  conversation: { id: string; name?: string; type: string; heroImage?: string };
  inviter: { id: string; username: string; avatar?: string };
}

export interface JoinRequest {
  id: string;
  userId: string;
  conversationId: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  createdAt: string;
  user: { id: string; username: string; avatar?: string };
}

interface TypingState {
  [conversationId: string]: string[]; // array of userIds typing
}

interface ConversationsState {
  conversations: Conversation[];
  exploreChannels: Conversation[];
  pendingInvites: ChannelInvite[];
  isLoading: boolean;
  error: string | null;
  typingUsers: TypingState;
  activePromptInvite: ChannelInvite | null;
  activeStatusModalChannel: Conversation | null;

  // Actions
  setActivePromptInvite: (invite: ChannelInvite | null) => void;
  setActiveStatusModalChannel: (channel: Conversation | null) => void;
  fetchConversations: () => Promise<void>;
  fetchExploreChannels: (params?: { category?: string; query?: string; sortBy?: string }) => Promise<void>;
  joinChannel: (id: string) => Promise<boolean>;
  createConversation: (data: {
    name?: string;
    type: 'DIRECT' | 'GROUP' | 'CHANNEL';
    participantIds: string[];
    description?: string;
    category?: string;
    isPrivate?: boolean;
    heroImage?: string;
    parentId?: string;
  }) => Promise<Conversation | null>;
  updateConversation: (id: string, data: Partial<Conversation>) => Promise<void>;
  leaveConversation: (id: string) => Promise<void>;
  addParticipant: (conversationId: string, userId: string) => Promise<void>;
  promoteToAdmin: (conversationId: string, userId: string) => Promise<void>;
  removeParticipant: (conversationId: string, userId: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  getConversationById: (id: string) => Conversation | undefined;
  addConversation: (conv: Conversation) => void;
  onNewConversation: (conv: Conversation) => void;
  updateParticipantUser: (userId: string, updates: Partial<Participant>) => void;
  fetchPendingInvites: () => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<boolean>;
  declineInvite: (inviteId: string) => Promise<boolean>;
  onInviteReceived: (invite: ChannelInvite) => void;

  // Join Requests
  fetchPreview: (id: string) => Promise<Conversation | null>;
  fetchJoinRequests: (conversationId: string) => Promise<JoinRequest[]>;
  resolveJoinRequest: (requestId: string, status: 'APPROVED' | 'DECLINED') => Promise<void>;
  resolveRequest: (id: string, action: 'ACCEPT' | 'REJECT') => Promise<void>;
  onJoinRequestReceived: (data: { request: JoinRequest; user: any; conversation: any }) => void;
  onConversationRemoved: (id: string) => void;
  onConversationUpdated: (conv: Conversation) => void;
  onParticipantRemoved: (conversationId: string, userId: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  exploreChannels: [],
  pendingInvites: [],
  isLoading: false,
  error: null,
  typingUsers: {},
  activePromptInvite: null,
  activeStatusModalChannel: null,

  setActivePromptInvite: (invite) => set({ activePromptInvite: invite }),
  setActiveStatusModalChannel: (channel) => set({ activeStatusModalChannel: channel }),

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/conversations');
      set({ conversations: data.data.conversations, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load conversations';
      set({ error: message, isLoading: false });
    }

  },

  fetchExploreChannels: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/conversations/explore', { params });
      set({ exploreChannels: data.data.conversations, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to explore channels';
      set({ error: message, isLoading: false });
    }
  },

  joinChannel: async (id) => {
    try {
      // 1. Optimistic check: are we already invited?
      const existingInvite = get().pendingInvites.find(i => i.conversationId === id);
      if (existingInvite) {
        set({ activePromptInvite: existingInvite });
        return false;
      }

      // 2. Optimistic check: are we already a member?
      const existingConv = get().conversations.find(c => c.id === id);
      if (existingConv) {
        set({ activeStatusModalChannel: existingConv });
        return false;
      }

      const { data } = await api.post(`/conversations/${id}/join`);
      
      if (data.data.status === 'pending') {
        const useSettingsStore = (await import('./useSettingsStore')).useSettingsStore;
        useSettingsStore.getState().addToast('Join request sent to admins.', 'success');
        return false;
      }

      const conv = data.data.conversation;
      set((state) => {
        if (state.conversations.find((c) => c.id === conv.id)) return state;
        return { conversations: [conv, ...state.conversations] };
      });
      
      const socket = getSocket();
      socket.emit('conversation:join', { conversationId: conv.id });
      
      return true;
    } catch (err: any) {
      console.error('[ConversationsStore] joinChannel error:', err);
      const message = err.response?.data?.message || '';
      
      // Handle specific "Already" states from backend
      if (message.includes('already a member')) {
        const ch = get().exploreChannels.find(c => c.id === id);
        if (ch) set({ activeStatusModalChannel: ch });
        return false;
      }

      if (message.includes('already been sent')) {
        const inv = get().pendingInvites.find(i => i.conversationId === id);
        if (inv) set({ activePromptInvite: inv });
        return false;
      }

      const useSettingsStore = (await import('./useSettingsStore')).useSettingsStore;
      useSettingsStore.getState().addToast(message || 'Failed to join channel.', 'error');
      return false;
    }
  },

  createConversation: async ({ name, type, participantIds, description, category, isPrivate, heroImage, parentId }) => {
    try {
      const { data } = await api.post('/conversations', {
        name,
        type,
        participantIds,
        description,
        category,
        isPrivate: isPrivate ?? false,
        heroImage,
        parentId,
      });
      const conv: Conversation = data.data.conversation;
      set((state) => {
        if (state.conversations.find((c) => c.id === conv.id)) return state;
        return { conversations: [conv, ...state.conversations] };
      });

      // Join the new conversation room via socket
      const socket = getSocket();
      socket.emit('conversation:join', { conversationId: conv.id });

      return conv;
    } catch (err: unknown) {
      console.error('[ConversationsStore] createConversation error:', err);
      
      let message = 'Failed to create channel';
      
      const error = err as { message?: string; response?: { data?: { message?: string; errors?: { message: string }[] } } };
      if (error.message === 'Network Error') {
        message = 'Network Error: The file might be too large or the server is unreachable.';
      } else {
        message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || message;
      }
      
      throw new Error(message);
    }

  },

  updateConversation: async (id, data) => {
    try {
      const resp = await api.patch(`/conversations/${id}`, data);
      const updated: Conversation = resp.data.data.conversation;
      set((state) => ({
        conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      }));
    } catch (err: unknown) {
      console.error('[ConversationsStore] updateConversation error:', err);
    }

  },

  leaveConversation: async (id) => {
    // 1. Instantly update local state (Optimistic)
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    }));

    // 2. Auto-unpin if pinned
    const { unpinChannel, pinnedChannelIds } = (await import('./useAppStore')).useAppStore.getState();
    if (pinnedChannelIds.includes(id)) {
      unpinChannel(id);
    }

    // 3. Inform server
    try {
      const { useAuthStore } = await import('./useAuthStore');
      const userId = useAuthStore.getState().user?.id;
      
      if (userId) {
        await api.delete(`/conversations/${id}/participants/${userId}`);
      } else {
        console.warn('[ConversationsStore] leaveConversation: No userId found in AuthStore');
      }
    } catch (err: unknown) {
      console.error('[ConversationsStore] leaveConversation error (server sync failed):', err);
      // We don't revert here because the user explicitly wanted to leave.
    }
  },

  addParticipant: async (conversationId, userId) => {
    try {
      await api.post(`/conversations/${conversationId}/participants`, { userId });
      // We don't update state here; the invite is sent, and we await their acceptance.
      // (The backend now returns { invite }, not an updated conversation)
    } catch (err: unknown) {
      console.error('[ConversationsStore] addParticipant error:', err);
      throw err;
    }
  },

  promoteToAdmin: async (conversationId, userId) => {
    try {
      const { data } = await api.patch(`/conversations/${conversationId}/participants/${userId}/role`, { role: 'ADMIN' });
      const updatedParticipant = data.data.participant;
      set((state) => ({
        conversations: state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            participants: c.participants.map((p) => p.user.id === userId ? updatedParticipant : p)
          };
        }),
      }));
    } catch (err: unknown) {
      console.error('[ConversationsStore] promoteToAdmin error:', err);
      throw err;
    }
  },

  removeParticipant: async (conversationId, userId) => {
    try {
      await api.delete(`/conversations/${conversationId}/participants/${userId}`);
      set((state) => ({
        conversations: state.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            participants: c.participants.filter((p) => p.user.id !== userId),
          };
        }),
      }));
    } catch (err: unknown) {
      console.error('[ConversationsStore] removeParticipant error:', err);
      throw err;
    }
  },

  deleteConversation: async (id) => {
    // 1. Instantly update local state (Optimistic)
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    }));

    // 2. Auto-unpin if pinned
    const useAppStore = (await import('./useAppStore')).useAppStore;
    const { togglePinChannel, pinnedChannelIds } = useAppStore.getState();
    if (pinnedChannelIds.includes(id)) {
      togglePinChannel(id);
    }

    // 3. Inform server
    try {
      await api.delete(`/conversations/${id}`);
    } catch (err: unknown) {
      console.error('[ConversationsStore] deleteConversation error (server sync failed):', err);
      // We don't revert here because the user explicitly wanted to delete.
    }
  },

  setTyping: (conversationId, userId, isTyping) => {
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      const updated = isTyping
        ? Array.from(new Set([...current, userId]))
        : current.filter((id) => id !== userId);
      return { typingUsers: { ...state.typingUsers, [conversationId]: updated } };
    });
  },

  getConversationById: (id) => {
    return get().conversations.find((c) => c.id === id);
  },

  addConversation: (conv) => {
    set((state) => {
      if (state.conversations.find((c) => c.id === conv.id)) return state;
      return { conversations: [conv, ...state.conversations] };
    });
  },

  onNewConversation: (conv) => {
    set((state) => {
      if (state.conversations.find((c) => c.id === conv.id)) return state;
      
      // If it's a DM, we might want to automatically join its socket room
      const socket = getSocket();
      socket.emit('conversation:join', { conversationId: conv.id });

      return { conversations: [conv, ...state.conversations] };
    });
  },

  /**
   * Propagates a user profile update (avatar, username, etc.) across
   * all conversations where that user is a participant.
   * Called after the current user updates their own profile.
   */
  updateParticipantUser: (userId: string, updates: Partial<Participant>) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => ({
        ...conv,
        participants: conv.participants.map((p) =>
          p.user.id === userId
            ? { ...p, user: { ...p.user, ...updates } }
            : p
        ),
      })),
    }));
  },

  // ─── Channel Invite Actions ──────────────────────────────────────────────

  fetchPendingInvites: async () => {
    try {
      const { data } = await api.get('/conversations/invites/pending');
      set({ pendingInvites: data.data.invites });
    } catch (err) {
      console.error('[ConversationsStore] fetchPendingInvites error:', err);
    }
  },

  acceptInvite: async (inviteId) => {
    try {
      await api.post(`/conversations/invites/${inviteId}/accept`);
      // Remove from pending list — the conversation:new socket event will add it to conversations
      set((state) => ({
        pendingInvites: state.pendingInvites.filter((i) => i.id !== inviteId),
      }));
      return true;
    } catch (err) {
      console.error('[ConversationsStore] acceptInvite error:', err);
      return false;
    }
  },

  declineInvite: async (inviteId) => {
    try {
      await api.post(`/conversations/invites/${inviteId}/decline`);
      set((state) => ({
        pendingInvites: state.pendingInvites.filter((i) => i.id !== inviteId),
      }));
      return true;
    } catch (err) {
      console.error('[ConversationsStore] declineInvite error:', err);
      return false;
    }
  },

  onInviteReceived: (invite) => {
    set((state) => ({
      pendingInvites: [invite, ...state.pendingInvites.filter((i) => i.id !== invite.id)],
    }));
  },

  fetchPreview: async (id) => {
    try {
      const { data } = await api.get(`/conversations/${id}/preview`);
      return data.data.conversation;
    } catch (err) {
      console.error('[ConversationsStore] fetchPreview error:', err);
      return null;
    }
  },

  fetchJoinRequests: async (conversationId) => {
    try {
      const { data } = await api.get(`/conversations/${conversationId}/join-requests`);
      return data.data.requests;
    } catch (err) {
      console.error('[ConversationsStore] fetchJoinRequests error:', err);
      return [];
    }
  },

  resolveJoinRequest: async (requestId, status) => {
    try {
      await api.post(`/conversations/join-requests/${requestId}/resolve`, { status });
    } catch (err) {
      console.error('[ConversationsStore] resolveJoinRequest error:', err);
      throw err;
    }
  },

  resolveRequest: async (id, action) => {
    try {
      const { data } = await api.post(`/conversations/${id}/resolve`, { action });
      
      if (action === 'REJECT') {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        }));
      } else {
        const updated = data.data;
        set((state) => ({
          conversations: state.conversations.map((c) => (c.id === id ? { ...c, ...updated } : c)),
        }));
      }
    } catch (err) {
      console.error('[ConversationsStore] resolveRequest error:', err);
      throw err;
    }
  },

  onJoinRequestReceived: async (data) => {
    const { useSettingsStore } = await import('./useSettingsStore');
    useSettingsStore.getState().addToast(
      `New join request for ${data.conversation.name} from ${data.user.username}`,
      'info'
    );
  },

  onConversationRemoved: async (id) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      exploreChannels: state.exploreChannels.filter((c) => c.id !== id),
    }));

    // Cleanup active view and pinning if necessary
    const { useAppStore } = await import('./useAppStore');
    const { activeConversationId, setActiveView, unpinChannel, pinnedChannelIds } = useAppStore.getState();
    
    if (pinnedChannelIds.includes(id)) {
      unpinChannel(id);
    }

    if (activeConversationId === id) {
      setActiveView('home');
    }
  },

  onConversationUpdated: (conv) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === conv.id ? { ...c, ...conv } : c)),
    }));
  },

  onParticipantRemoved: (conversationId, userId) => {
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          participants: c.participants.filter((p) => p.user.id !== userId),
        };
      }),
    }));
  },
}));
