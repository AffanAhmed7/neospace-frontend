import { create } from 'zustand';
import api from '../lib/api';

export interface Notification {
  id: string;
  type: string;
  title?: string;
  desc?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (ids: string[]) => Promise<void>;
  clearAll: () => Promise<void>;
  
  // Socket listeners
  addNotification: (notification: Notification) => void;
  setUnreadCount: (count: number) => void;
  markLocallyRead: (ids: string[]) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/notifications', { params: { page: 1, limit: 50 } });
      set({ 
        notifications: data.data.notifications, 
        unreadCount: data.data.unreadCount || 0,
        isLoading: false 
      });
    } catch {
      set({ isLoading: false });
    }
  },


  markAsRead: async (ids) => {
    try {
      await api.post('/notifications/read', { notificationIds: ids });
      get().markLocallyRead(ids);
    } catch (err) {
      console.error('[NotificationsStore] markAsRead error:', err);
    }
  },

  clearAll: async () => {
    try {
      await api.post('/notifications/clear');
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.error('[NotificationsStore] clearAll error:', err);
    }
  },

  addNotification: (notification) => {
    set((s) => ({
      notifications: [notification, ...s.notifications],
      unreadCount: s.unreadCount + 1
    }));
  },

  setUnreadCount: (count) => {
    set({ unreadCount: count });
  },

  markLocallyRead: (ids) => {
    set((s) => ({
      notifications: s.notifications.map((n) => 
        ids.includes(n.id) ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - ids.length)
    }));
  }
}));
