import { create } from 'zustand';
import api from '../lib/api';
import { getSocket } from '../lib/socket';

export interface Reaction {
  emoji: string;
  userId: string;
  username: string;
}

export interface Message {
  id: string;
  content: string | null;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  senderId: string;
  conversationId: string;
  parentId?: string;
  isPinned: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender: { id: string; username: string; avatar?: string };
  reactions: Reaction[];
  _count?: { replies: number };
}

interface MessagesState {
  messages: Record<string, Message[]>; // conversationId → messages
  cursors: Record<string, string | null>; // conversationId → cursor
  isLoading: Record<string, boolean>;
  readReceipts: Record<string, Record<string, string>>; // conversationId → { userId → lastReadMessageId }
  localHiddenIds: Set<string>; // Ids of messages hidden locally by the user

  // Fetch
  fetchMessages: (conversationId: string, cursor?: string) => Promise<void>;

  // Socket-driven actions
  sendMessage: (data: {
    conversationId: string;
    content: string;
    type?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    parentId?: string;
  }) => Promise<void>;
  editMessage: (messageId: string, conversationId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string, conversationId: string) => Promise<void>;
  reactToMessage: (messageId: string, conversationId: string, emoji: string) => Promise<void>;
  pinMessage: (messageId: string, conversationId: string) => Promise<void>;
  hideMessage: (messageId: string) => void;
  markAsRead: (conversationId: string, lastReadMessageId: string) => void;
  joinRoom: (conversationId: string) => void;

  // Socket listeners
  onNewMessage: (message: Message) => void;
  onMessageUpdated: (message: Message) => void;
  onMessageDeleted: (messageId: string, conversationId: string) => void;
  onReactionUpdated: (data: { messageId: string; userId: string; emoji: string; action: 'added' | 'removed'; conversationId: string }) => void;
  onPinnedUpdated: (data: { messageId: string; isPinned: boolean; conversationId: string }) => void;
  onReadReceipt: (data: { conversationId: string; userId: string; lastRead: string }) => void;
}

interface SocketResponse {
  status: 'success' | 'error';
  message?: string;
  data?: unknown;

}


export const useMessagesStore = create<MessagesState>((set) => ({

  messages: {},
  cursors: {},
  isLoading: {},
  readReceipts: {},
  localHiddenIds: new Set(),

  fetchMessages: async (conversationId, cursor) => {
    set((s) => ({ isLoading: { ...s.isLoading, [conversationId]: true } }));
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (cursor) params.cursor = cursor;

      const { data } = await api.get(`/messages/${conversationId}`, { params });
      const fetched: Message[] = data.data.messages.reverse(); // API returns desc, reverse for asc display

      set((s) => {
        const existing = s.messages[conversationId] || [];
        // prepend older messages if cursor pagination
        const combined = cursor ? [...fetched, ...existing] : fetched;
        const lastCursor = fetched.length > 0 ? fetched[0].id : null;
        return {
          messages: { ...s.messages, [conversationId]: combined },
          cursors: { ...s.cursors, [conversationId]: cursor ? lastCursor : null },
          isLoading: { ...s.isLoading, [conversationId]: false },
        };
      });
    } catch {
      set((s) => ({ isLoading: { ...s.isLoading, [conversationId]: false } }));
    }

  },

  sendMessage: async (data) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      socket.emit('message:send', { ...data, type: data.type || 'TEXT' }, (res: SocketResponse) => {
        if (res.status === 'success') resolve();
        else reject(new Error(res.message));
      });
    });
  },

  editMessage: async (messageId, conversationId, content) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      socket.emit('message:edit', { messageId, content, conversationId }, (res: SocketResponse) => {
        if (res.status === 'success') resolve();
        else reject(new Error(res.message));
      });
    });
  },

  deleteMessage: async (messageId, conversationId) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      socket.emit('message:delete', { messageId, conversationId }, (res: SocketResponse) => {
        if (res.status === 'success') resolve();
        else reject(new Error(res.message));
      });
    });
  },

  reactToMessage: async (messageId, conversationId, emoji) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      socket.emit('message:react', { messageId, conversationId, emoji }, (res: SocketResponse) => {
        if (res.status === 'success') resolve();
        else reject(new Error(res.message));
      });
    });
  },

  pinMessage: async (messageId, conversationId) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();
      socket.emit('message:pin', { messageId, conversationId }, (res: SocketResponse) => {
        if (res.status === 'success') resolve();
        else reject(new Error(res.message));
      });
    });
  },

  hideMessage: (messageId) => {
    set((s) => {
      const newHidden = new Set(s.localHiddenIds);
      newHidden.add(messageId);
      return { localHiddenIds: newHidden };
    });
  },

  markAsRead: (conversationId, lastReadMessageId) => {
    const socket = getSocket();
    socket.emit('conversation:read', { conversationId, lastReadMessageId }, () => {});
  },
  
  joinRoom: (conversationId) => {
    const socket = getSocket();
    socket.emit('room:join', { conversationId }, (res: SocketResponse) => {
      if (res.status === 'error') {
        console.error('[Socket] Failed to join conversation room:', res.message);
      }
    });
  },

  // ─── Socket Listeners ──────────────────────────────────────────────────────

  onNewMessage: (message) => {
    set((s) => {
      const existing = s.messages[message.conversationId] || [];
      // Avoid duplicates
      if (existing.find((m) => m.id === message.id)) return s;
      
      // Safety check for reactions
      const safeMessage = {
        ...message,
        reactions: message.reactions || []
      };
      
      return { messages: { ...s.messages, [message.conversationId]: [...existing, safeMessage] } };
    });
  },

  onMessageUpdated: (message) => {
    set((s) => {
      const existing = s.messages[message.conversationId] || [];
      return {
        messages: {
          ...s.messages,
          [message.conversationId]: existing.map((m) => (m.id === message.id ? { ...m, ...message } : m)),
        },
      };
    });
  },

  onMessageDeleted: (messageId, conversationId) => {
    set((s) => {
      const existing = s.messages[conversationId] || [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: existing.map((m) =>
            m.id === messageId ? { ...m, isDeleted: true, content: null } : m
          ),
        },
      };
    });
  },

  onReactionUpdated: ({ messageId, userId, emoji, action, conversationId }) => {
    set((s) => {
      const existing = s.messages[conversationId] || [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: existing.map((m) => {
            if (m.id !== messageId) return m;
            let reactions = [...m.reactions];
            if (action === 'added') {
              reactions = [...reactions, { emoji, userId, username: '' }];
            } else {
              reactions = reactions.filter((r) => !(r.userId === userId && r.emoji === emoji));
            }
            return { ...m, reactions };
          }),
        },
      };
    });
  },

  onPinnedUpdated: ({ messageId, isPinned, conversationId }) => {
    set((s) => {
      const existing = s.messages[conversationId] || [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: existing.map((m) =>
            m.id === messageId ? { ...m, isPinned } : m
          ),
        },
      };
    });
  },

  onReadReceipt: ({ conversationId, userId, lastRead }) => {
    set((s) => ({
      readReceipts: {
        ...s.readReceipts,
        [conversationId]: {
          ...(s.readReceipts[conversationId] || {}),
          [userId]: lastRead
        }
      }
    }));
  },

}));
