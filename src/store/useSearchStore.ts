import { create } from 'zustand';
import api from '../lib/api';
import type { Message } from './useMessagesStore';
import type { User } from './useFriendsStore';

export interface FileResult {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  messageId: string;
  conversationId: string;
  createdAt: string;
}

interface SearchState {
  results: {
    users: User[];
    messages: Message[];
    files: Message[];
  };
  isLoading: boolean;
  error: string | null;

  searchAll: (query: string) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  searchMessages: (query: string) => Promise<void>;
  searchFiles: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  results: {
    users: [],
    messages: [],
    files: [],
  },
  isLoading: false,
  error: null,

  searchAll: async (query: string) => {
    if (!query.trim()) return;
    set({ isLoading: true, error: null });
    try {
      const [usersRes, messagesRes, filesRes] = await Promise.all([
        api.get('/search/users', { params: { query } }),
        api.get('/search/messages', { params: { query } }),
        api.get('/search/files', { params: { query } }),
      ]);

      set({
        results: {
          users: usersRes.data.data.users,
          messages: messagesRes.data.data.messages,
          files: filesRes.data.data.files,
        },
        isLoading: false,
      });
    } catch (err: unknown) {
      set({ error: err instanceof Error ? err.message : 'Search failed', isLoading: false });
    }
  },

  searchUsers: async (query: string) => {
    try {
      const { data } = await api.get('/search/users', { params: { query } });
      set((s) => ({ results: { ...s.results, users: data.data.users } }));
    } catch (err: unknown) {
      console.error('Search Users error:', err);
    }
  },

  searchMessages: async (query: string) => {
    try {
      const { data } = await api.get('/search/messages', { params: { query } });
      set((s) => ({ results: { ...s.results, messages: data.data.messages } }));
    } catch (err: unknown) {
      console.error('Search Messages error:', err);
    }
  },

  searchFiles: async (query: string) => {
    try {
      const { data } = await api.get('/search/files', { params: { query } });
      set((s) => ({ results: { ...s.results, files: data.data.files } }));
    } catch (err: unknown) {
      console.error('Search Files error:', err);
    }
  },

  clearResults: () => {
    set({
      results: {
        users: [],
        messages: [],
        files: [],
      },
      error: null,
    });
  },
}));
