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

  // Frontend-computed
  displayName?: string;
  displayAvatar?: string;
  description?: string;
  category?: string;
  heroImage?: string;
}

interface TypingState {
  [conversationId: string]: string[]; // array of userIds typing
}

interface ConversationsState {
  conversations: Conversation[];
  exploreChannels: Conversation[];
  isLoading: boolean;
  error: string | null;
  typingUsers: TypingState;

  // Actions
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
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  exploreChannels: [],
  isLoading: false,
  error: null,
  typingUsers: {},

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
      const { data } = await api.post(`/conversations/${id}/join`);
      const conv = data.data.conversation;
      set((state) => ({ conversations: [conv, ...state.conversations] }));
      
      const socket = getSocket();
      socket.emit('conversation:join', { conversationId: conv.id });
      
      return true;
    } catch (err) {
      console.error('[ConversationsStore] joinChannel error:', err);
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
      set((state) => ({ conversations: [conv, ...state.conversations] }));

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
    try {
      const userId = JSON.parse(localStorage.getItem('neoplane-auth-storage') || '{}')?.state?.user?.id;
      if (userId) {
        await api.delete(`/conversations/${id}/participants/${userId}`);
      }
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
      }));
    } catch (err: unknown) {
      console.error('[ConversationsStore] leaveConversation error:', err);
    }
  },

  addParticipant: async (conversationId, userId) => {
    try {
      const { data } = await api.post(`/conversations/${conversationId}/participants`, { userId });
      const updatedConv = data.data.conversation;
      set((state) => ({
        conversations: state.conversations.map((c) => (c.id === conversationId ? updatedConv : c)),
      }));
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
    try {
      await api.delete(`/conversations/${id}`);
      set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
      }));
    } catch (err: unknown) {
      console.error('[ConversationsStore] deleteConversation error:', err);
      throw err;
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
}));
