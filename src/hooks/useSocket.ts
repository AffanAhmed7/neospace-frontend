import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '../lib/socket';
import { useAuthStore } from '../store/useAuthStore';
import { useMessagesStore } from '../store/useMessagesStore';
import { useNotificationsStore } from '../store/useNotificationsStore';
import { useFriendsStore } from '../store/useFriendsStore';
import { useConversationsStore } from '../store/useConversationsStore';
import { useSettingsStore } from '../store/useSettingsStore';

import type { Message } from '../store/useMessagesStore';
import type { Notification } from '../store/useNotificationsStore';
import type { FriendRequest } from '../store/useFriendsStore';
import type { Conversation } from '../store/useConversationsStore';


/**
 * Initializes and tears down the Socket.io connection.
 * Binds all real-time event listeners based on the auth state.
 * Mount this once in AppShell.
 */
export const useSocket = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();
    const { addToast } = useSettingsStore.getState();

    // ─── Connection Events ──────────────────────────────────────────────────
    socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      // We don't necessarily want a toast on initial connect to avoid spam,
      // but if it was disconnected, we might. Socket.io 'reconnect' is better for that.
    });

    socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
      if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
        addToast('Connection lost. Attempting to reconnect...', 'error');
      }
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection Error:', error);
      // Only show error if we're not already in a disconnected state with a toast
    });

    socket.on('reconnect', (attempt) => {
      console.log('[Socket] Reconnected after', attempt, 'attempts');
      addToast('Connection restored. You are back online.', 'success');
    });

    // ─── Chat Events ──────────────────────────────────────────────────────────
    socket.on('message:new', (message: Message) => {
      useMessagesStore.getState().onNewMessage(message);
    });

    socket.on('message:updated', (message: Message) => {
      useMessagesStore.getState().onMessageUpdated(message);
    });

    socket.on('message:deleted', ({ messageId, conversationId }: { messageId: string, conversationId: string }) => {
      useMessagesStore.getState().onMessageDeleted(messageId, conversationId);
    });

    socket.on('message:reaction_updated', (data: { messageId: string, userId: string, emoji: string, action: 'added' | 'removed', conversationId: string }) => {
      useMessagesStore.getState().onReactionUpdated(data);
    });


    socket.on('message:pinned_updated', (data: { messageId: string, isPinned: boolean, conversationId: string }) => {
      useMessagesStore.getState().onPinnedUpdated(data);
    });

    socket.on('conversation:read', (data: { conversationId: string, userId: string, lastRead: string }) => {
      useMessagesStore.getState().onReadReceipt(data);
    });

    // ─── Typing Events ────────────────────────────────────────────────────────
    socket.on('typing:start', ({ userId, conversationId }: { userId: string, conversationId: string }) => {
      useConversationsStore.getState().setTyping(conversationId, userId, true);
    });

    socket.on('typing:stop', ({ userId, conversationId }: { userId: string, conversationId: string }) => {
      useConversationsStore.getState().setTyping(conversationId, userId, false);
    });

    socket.on('user:status_changed', ({ userId, status }: { userId: string, status: string }) => {
      useFriendsStore.getState().updateFriendStatus(userId, status as 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND');
    });

    // ─── Social Events ────────────────────────────────────────────────────────
    socket.on('friend_request:received', (request: FriendRequest) => {
      useFriendsStore.getState().onIncomingRequest(request);
    });

    socket.on('friend_request:accepted', (data: { request: FriendRequest; newFriend: unknown }) => {
      useFriendsStore.getState().onRequestAccepted(data as { request: FriendRequest; newFriend: any }); 
    });

    socket.on('friend_request:updated', (request: FriendRequest) => {
      useFriendsStore.getState().onRequestUpdated(request);
    });

    socket.on('friend_request:removed', ({ requestId }: { requestId: string }) => {
      useFriendsStore.getState().onRequestRemoved(requestId);
    });

    socket.on('friend:removed', ({ userId }: { userId: string }) => {
      useFriendsStore.getState().onFriendRemoved(userId);
    });

    // ─── Conversation Discovery ───────────────────────────────────────────────
    socket.on('conversation:new', (conversation: Conversation) => {
      useConversationsStore.getState().onNewConversation(conversation);
    });

    // ─── Notification Events ──────────────────────────────────────────────────
    socket.on('notification:new', (notification: Notification) => {
      useNotificationsStore.getState().addNotification(notification);
    });

    socket.on('notification:count_updated', ({ unreadCount }: { unreadCount: number }) => {
      useNotificationsStore.getState().setUnreadCount(unreadCount);
    });

    socket.on('notification:read', ({ notificationIds }: { notificationIds: string[] }) => {
      useNotificationsStore.getState().markLocallyRead(notificationIds);
    });


    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      socket.off('message:new');
      socket.off('message:updated');
      socket.off('message:deleted');
      socket.off('message:reaction_updated');
      socket.off('message:pinned_updated');
      socket.off('conversation:read');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('user:status_changed');
      socket.off('friend_request:received');
      socket.off('friend_request:accepted');
      socket.off('friend_request:updated');
      socket.off('friend_request:removed');
      socket.off('friend:removed');
      socket.off('conversation:new');
      socket.off('notification:new');
      socket.off('notification:count_updated');
      socket.off('notification:read');
    };
  }, [isAuthenticated]);
};
