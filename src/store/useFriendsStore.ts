import { create } from 'zustand';
import api from '../lib/api';
import { useConversationsStore } from './useConversationsStore';

export interface User {
  id: string;
  username: string;
  avatar?: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND';
  lastSeen?: string;
  activity?: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  sender?: User;
  receiver?: User;
  createdAt: string;
}

interface FriendsState {
  friends: User[];
  pendingIncoming: FriendRequest[];
  pendingOutgoing: FriendRequest[];
  isLoading: boolean;

  // Actions
  fetchFriends: () => Promise<void>;
  fetchRequests: () => Promise<void>;
  sendRequest: (username: string) => Promise<boolean>;
  acceptRequest: (requestId: string) => Promise<void>;
  declineRequest: (requestId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  updateFriendStatus: (userId: string, status: User['status']) => void;
  startDM: (userId: string) => Promise<string | null>;
  searchUsers: (query: string) => Promise<User[]>;

  // Socket-driven actions
  onIncomingRequest: (request: FriendRequest) => void;
  onRequestAccepted: (data: { request: FriendRequest; newFriend: User }) => void;
  onRequestUpdated: (request: FriendRequest) => void;
  onRequestRemoved: (requestId: string) => void;
  onFriendRemoved: (userId: string) => void;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  pendingIncoming: [],
  pendingOutgoing: [],
  isLoading: false,

  fetchFriends: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/friends');
      set({ friends: data.data.friends, isLoading: false });
    } catch {
      set({ isLoading: false });
    }

  },

  fetchRequests: async () => {
    try {
      const { data } = await api.get('/friends/requests');
      set({ 
        pendingIncoming: data.data.incoming, 
        pendingOutgoing: data.data.outgoing 
      });
    } catch (err) {
      console.error('[FriendsStore] fetchRequests error:', err);
    }
  },

  sendRequest: async (username) => {
    try {
      await api.post('/friends/request', { username });
      get().fetchRequests();
      return true;
    } catch {
      return false;
    }

  },

  acceptRequest: async (requestId) => {
    try {
      await api.post(`/friends/request/${requestId}/accept`);
      get().fetchRequests();
      get().fetchFriends();
    } catch (err) {
      console.error('[FriendsStore] acceptRequest error:', err);
    }
  },

  declineRequest: async (requestId) => {
    try {
      await api.delete(`/friends/request/${requestId}`);
      get().fetchRequests();
    } catch (err) {
      console.error('[FriendsStore] declineRequest error:', err);
    }
  },

  removeFriend: async (userId) => {
    try {
      await api.delete(`/friends/${userId}`);
      set((s) => ({
        friends: s.friends.filter((f) => f.id !== userId)
      }));
    } catch (err) {
      console.error('[FriendsStore] removeFriend error:', err);
    }
  },

  updateFriendStatus: (userId, status) => {
    set((s) => ({
      friends: s.friends.map((f) => f.id === userId ? { ...f, status } : f)
    }));
  },

  startDM: async (userId) => {
    try {
      // Look for existing DM
      const conversations = useConversationsStore.getState().conversations;
      const existing = conversations.find(c => 
        c.type === 'DIRECT' && c.participants.some(p => p.user.id === userId)
      );

      if (existing) return existing.id;

      // Create new DM
      const newConv = await useConversationsStore.getState().createConversation({
        type: 'DIRECT',
        participantIds: [userId],
        isPrivate: true
      });

      return newConv ? newConv.id : null;
    } catch {
      return null;
    }

  },
  searchUsers: async (query) => {
    try {
      const { data } = await api.get(`/search/users?query=${query}`);
      return data.data.users;
    } catch (err) {
      console.error('[FriendsStore] searchUsers error:', err);
      return [];
    }
  },

  onIncomingRequest: (request) => {
    set((s) => ({
      pendingIncoming: [request, ...s.pendingIncoming.filter(r => r.id !== request.id)]
    }));
  },

  onRequestAccepted: ({ request, newFriend }) => {
    set((s) => ({
      friends: [newFriend, ...s.friends.filter(f => f.id !== newFriend.id)],
      pendingIncoming: s.pendingIncoming.filter(r => r.id !== request.id),
      pendingOutgoing: s.pendingOutgoing.filter(r => r.id !== request.id),
    }));
  },

  onRequestUpdated: (request) => {
    set((s) => ({
      pendingIncoming: s.pendingIncoming.map(r => r.id === request.id ? request : r),
      pendingOutgoing: s.pendingOutgoing.map(r => r.id === request.id ? request : r),
    }));
  },

  onRequestRemoved: (requestId) => {
    set((s) => ({
      pendingIncoming: s.pendingIncoming.filter(r => r.id !== requestId),
      pendingOutgoing: s.pendingOutgoing.filter(r => r.id !== requestId),
    }));
  },

  onFriendRemoved: (userId) => {
    set((s) => ({
      friends: s.friends.filter(f => f.id !== userId)
    }));
  }
}));
