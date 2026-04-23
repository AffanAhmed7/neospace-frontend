import React, { useState } from 'react';
import { 
  Plus, Hash, Pin,
  Hexagon, 
  Search as SearchIcon, Settings, Telescope, Users, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import type { Conversation } from '../../store/useConversationsStore';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { LogoutModal } from '../auth/LogoutModal';
import { clsx } from 'clsx';

const statusConfig: Record<string, { color: string; ring: string; label: string }> = {
  ONLINE: { color: 'bg-emerald-400', ring: 'shadow-[0_0_6px_rgba(52,211,153,0.6)]', label: 'Online' },
  DND: { color: 'bg-rose-500', ring: 'shadow-[0_0_6px_rgba(244,63,94,0.6)]', label: 'Do Not Disturb' },
  IDLE: { color: 'bg-amber-400', ring: 'shadow-[0_0_6px_rgba(251,191,36,0.6)]', label: 'Idle' },
  OFFLINE: { color: 'bg-white/20', ring: '', label: 'Offline' },
};

export const Sidebar: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const activeView = useAppStore((state) => state.activeView);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const pinnedChannelIds = useAppStore((state) => state.pinnedChannelIds);
  const togglePinChannel = useAppStore((state) => state.togglePinChannel);

  
  const { conversations, pendingInvites, setActivePromptInvite } = useConversationsStore();
  const { messages, readReceipts } = useMessagesStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getDMPreview = (dm: Conversation) => {
    const convMessages = messages[dm.id];
    if (convMessages && convMessages.length > 0) {
      const last = convMessages[convMessages.length - 1];
      if (last.type === 'IMAGE') return 'Sent an image';
      if (last.type === 'FILE') return 'Sent a file';
      return last.content || 'New message';
    }
    return 'Click to chat';
  };

  const getUnreadCount = (dm: Conversation) => {
    const convMessages = messages[dm.id];
    if (!convMessages || convMessages.length === 0) return 0;
    
    if (!user?.id) return 0;
    
    const myLastReadId = readReceipts[dm.id]?.[user.id];
    
    if (!myLastReadId) {
      const last = convMessages[convMessages.length - 1];
      if (last.senderId !== user.id) return 1; 
      return 0;
    }
    
    const readIdx = convMessages.findIndex(m => m.id === myLastReadId);
    if (readIdx !== -1) {
      const unreadIdxs = convMessages.slice(readIdx + 1);
      return unreadIdxs.filter(m => m.senderId !== user.id).length;
    }
    
    return 0;
  };
  // Helper to get DM target user
  const getDMInfo = (conv: Conversation) => {
    const otherParticipant = conv.participants?.find(p => p.user.id !== user?.id);
    return {
      name: otherParticipant?.user.username || 'Unknown User',
      avatar: otherParticipant?.user.avatar,
      status: otherParticipant?.user.status || 'OFFLINE'
    };
  };

  const channels = (conversations || []).filter(c => 
    c.type === 'CHANNEL' && c.status !== 'PENDING' && !pinnedChannelIds.includes(c.id)
  );
  const activeDMs = (conversations || []).filter(c => 
    c.type === 'DIRECT' && (c.status === 'ACTIVE' || (c.status === 'PENDING' && c.creatorId === user?.id)) && !pinnedChannelIds.includes(c.id)
  );
  const messageRequests = (conversations || []).filter(c => 
    c.type === 'DIRECT' && c.status === 'PENDING' && c.creatorId !== user?.id && !pinnedChannelIds.includes(c.id)
  );
  const pendingRequestCount = messageRequests.length;

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Workspace Header */}
      <div className="px-6 flex items-center justify-between h-[64px] shrink-0 border-b border-border">
        <div 
          onClick={() => {
            setActiveConversation(null);
            setActiveView('home');
          }}
          className="flex items-center gap-2.5 group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center text-foreground transition-all duration-300 group-hover:text-primary">
            <Hexagon size={22} strokeWidth={2.5} />
          </div>
          <span 
            className="font-bold text-xl tracking-tighter uppercase group-hover:text-glow transition-all duration-300 brand-text"
            style={{ color: 'var(--brand)' }}
          >
            neo.
          </span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="px-3 mb-6 space-y-4">
        <button 
          onClick={() => useAppStore.getState().toggleCommandPalette()}
          className="flex items-center gap-3 w-full h-10 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-foreground/20 hover:text-primary/60 hover:border-primary/20 hover:bg-primary/5 transition-all group/search shadow-lg relative overflow-hidden"
        >
          <SearchIcon size={14} className="group-hover/search:scale-110 transition-transform duration-300 group-hover/search:text-primary shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest group-hover/search:text-primary/80 transition-colors">Search</span>
          <div className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] group-hover/search:border-primary/20 transition-colors">
            <span className="text-[9px] font-black opacity-40 group-hover/search:opacity-60 transition-opacity">⌘</span>
            <span className="text-[9px] font-black opacity-40 group-hover/search:opacity-60 transition-opacity">K</span>
          </div>
        </button>

        <div className="flex flex-col gap-1">
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setActiveConversation(null);
              setActiveView('friends');
              useAppStore.getState().setSidebarOpen(false);
            }}
            className={clsx(
              "group relative w-full h-11 flex items-center px-4 rounded-xl transition-all duration-300 overflow-hidden",
              activeView === 'friends' 
                ? "bg-white/[0.04] border border-white/[0.08] shadow-inner" 
                : "bg-transparent border border-transparent hover:bg-white/[0.02]"
            )}
          >
            <div className="absolute -right-3 -bottom-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <Users size={64} strokeWidth={1} className="-rotate-12" />
            </div>
            <div className={clsx(
              "relative z-10 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300",
              activeView === 'friends' ? "text-primary" : "text-foreground/40 group-hover:text-primary/60"
            )}>
              <Users size={16} strokeWidth={2} />
            </div>
            <div className="relative z-10 flex items-center translate-y-[0.5px]">
              <span className={clsx("text-[13px] font-semibold tracking-wide transition-colors", activeView === 'friends' ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/80")}>
                Friends
              </span>
              {pendingRequestCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black shadow-glow-sm">
                  {pendingRequestCount}
                </span>
              )}
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setActiveConversation(null);
              setActiveView('explore');
              useAppStore.getState().setSidebarOpen(false);
            }}
            className={clsx(
              "group relative w-full h-11 flex items-center px-4 rounded-xl transition-all duration-300 overflow-hidden",
              activeView === 'explore' 
                ? "bg-white/[0.04] border border-white/[0.08] shadow-inner" 
                : "bg-transparent border border-transparent hover:bg-white/[0.02]"
            )}
          >
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <Telescope size={56} strokeWidth={1} className="-rotate-12" />
            </div>
            <div className={clsx(
              "relative z-10 flex items-center justify-center w-5 h-5 mr-3 transition-colors duration-300",
              activeView === 'explore' ? "text-primary" : "text-foreground/40 group-hover:text-primary/60"
            )}>
              <Telescope size={16} strokeWidth={2} />
            </div>
            <div className="relative z-10 flex items-center translate-y-[0.5px]">
              <span className={clsx("text-[13px] font-semibold tracking-wide transition-colors", activeView === 'explore' ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/80")}>
                Browse Channels
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-grow overflow-y-auto px-2 pb-2 space-y-6 custom-scrollbar-compact">
        {/* Pinned Channels */}
        {pinnedChannelIds.length > 0 && (
          <div className="space-y-0.5 mb-6">
            <div className="px-3 mb-2 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Pinned Channels</span>
            </div>
            {pinnedChannelIds.map((id) => {
              const channel = conversations.find(c => c.id === id);
              if (!channel) return null;
              const isActive = activeConversationId === id;
              return (
                <motion.div key={`pinned-chan-${id}`} className="group/item relative">
                  <motion.button
                    onClick={() => {
                      setActiveConversation(id);
                      useAppStore.getState().setSidebarOpen(false);
                    }}
                    className={clsx(
                      'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] font-medium transition-all duration-200 outline-none',
                      isActive
                        ? 'bg-primary/10 text-primary shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                        : 'text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/70'
                    )}
                  >
                    <Hash size={16} className={clsx('shrink-0 transition-colors', isActive ? 'text-primary' : 'text-foreground/15 group-hover:text-foreground/40')} />
                    <span className={clsx('flex-grow text-left truncate', isActive && 'font-bold tracking-tight')}>{channel.name}</span>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePinChannel(id); }}
                      className={clsx(
                        "p-1 rounded-md transition-all hover:bg-white/10",
                        isActive ? "text-primary/40 hover:text-primary" : "text-foreground/10 hover:text-foreground/40"
                      )}
                    >
                      <Pin size={12} className="rotate-45" />
                    </button>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="space-y-0.5">
          <div className="px-3 mb-2 flex items-center justify-between group/header">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Channels</span>
            </div>
            <button 
              onClick={() => setActiveView('create-channel')}
              className="p-1 rounded-md text-foreground/20 hover:bg-white/10 hover:text-foreground/80 opacity-0 group-hover/header:opacity-100 transition-all focus:opacity-100"
              title="Create Channel"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>
          {channels.map((channel) => {
            const isActive = activeConversationId === channel.id;
            const isPinned = pinnedChannelIds.includes(channel.id);

            return (
              <div key={channel.id} className="space-y-0.5">
                <motion.button
                  onClick={() => {
                    setActiveConversation(channel.id);
                    useAppStore.getState().setSidebarOpen(false);
                  }}
                  className={clsx(
                    'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] font-medium transition-all duration-200 outline-none',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[0_4px_12_rgba(99,102,241,0.05)]'
                      : 'text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/70'
                  )}
                >
                  <Hash size={16} className={clsx('shrink-0 transition-colors', isActive ? 'text-primary' : 'text-foreground/15 group-hover:text-foreground/40')} />
                  <span className={clsx('flex-grow text-left truncate', isActive && 'font-bold tracking-tight')}>{channel.name}</span>
                  
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePinChannel(channel.id); }}
                      className={clsx(
                        "p-1 rounded-md transition-all hover:bg-white/10 opacity-0 group-hover:opacity-100",
                        isPinned ? "text-primary opacity-100" : "text-foreground/20"
                      )}
                      title={isPinned ? "Unpin Channel" : "Pin Channel"}
                    >
                      <Pin size={12} className={clsx(isPinned ? "fill-primary/20" : "rotate-45")} />
                    </button>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Channel Requests */}
        {pendingInvites.length > 0 && (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between group/cr-header">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Channel Requests</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black">{pendingInvites.length}</span>
              </div>
            </div>
            
            <div className="space-y-0.5">
              {pendingInvites.map((invite) => (
                <div
                  key={invite.id}
                  onClick={() => setActivePromptInvite(invite)}
                  className="group relative flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] font-medium transition-all duration-200 outline-none overflow-hidden hover:bg-white/[0.02] cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Hash size={14} />
                    </div>
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-bg-deep flex items-center justify-center animate-pulse">
                      <div className="h-1 w-1 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="flex flex-col text-left overflow-hidden flex-grow min-w-0">
                    <span className="text-[12px] font-bold leading-tight truncate text-foreground/50">
                      #{invite.conversation?.name || 'channel'}
                    </span>
                    <span className="text-[10px] leading-tight truncate text-foreground/20 font-medium mt-0.5">
                      from {invite.inviter?.username || 'someone'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Requests */}
        {messageRequests.length > 0 && (
          <div>
            <div className="px-3 mb-2 flex items-center justify-between group/mr-header">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Message Requests</span>
              </div>
            </div>
            
            <div className="space-y-0.5">
              {messageRequests.map((dm) => {
                const isActive = activeConversationId === dm.id;
                const dmInfo = getDMInfo(dm);
                return (
                  <motion.button
                    key={dm.id}
                    onClick={() => {
                      setActiveConversation(dm.id);
                      useAppStore.getState().setSidebarOpen(false);
                    }}
                    className={clsx(
                      'group relative flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] font-medium transition-all duration-200 outline-none overflow-hidden',
                      isActive
                        ? 'bg-primary/10'
                        : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={dmInfo.avatar} alt={dmInfo.name} size="sm" className="h-7 w-7 opacity-70" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-bg-deep flex items-center justify-center animate-pulse">
                         <div className="h-1 w-1 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="flex flex-col text-left overflow-hidden flex-grow min-w-0">
                      <span className={clsx(
                        'text-[12px] font-bold leading-tight truncate',
                        isActive ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/80'
                      )}>
                        {dmInfo.name}
                      </span>
                      <span className="text-[10px] leading-tight truncate text-primary/60 font-black uppercase tracking-widest mt-0.5">
                        New Request
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Direct Messages */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between group/dm-header">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Direct Messages</span>
            </div>
          </div>
          
          <div className="space-y-0.5">
            {activeDMs.map((dm) => {
              const isActive = activeConversationId === dm.id;
              const dmInfo = getDMInfo(dm);
              const status = statusConfig[dmInfo.status] || statusConfig.OFFLINE;
              const unreadCount = getUnreadCount(dm);
              const previewText = getDMPreview(dm);
              return (
                <motion.button
                  key={dm.id}
                  onClick={() => {
                    setActiveConversation(dm.id);
                    useAppStore.getState().setSidebarOpen(false);
                  }}
                  className={clsx(
                    'group relative flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] font-medium transition-all duration-200 outline-none overflow-hidden',
                    isActive
                      ? 'bg-primary/10'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  {/* Avatar with inline status */}
                  <div 
                    className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      const otherParticipant = dm.participants.find(p => p.user.id !== user?.id);
                      if (otherParticipant) toggleProfilePanel(otherParticipant.user.id);
                    }}
                  >
                    <Avatar src={dmInfo.avatar} alt={dmInfo.name} size="sm" className="h-7 w-7 ring-1 ring-white/[0.06]" />
                    <span className={clsx(
                      'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-bg-deep',
                      status.color, status.ring
                    )} />
                  </div>

                  <div className="flex flex-col text-left overflow-hidden flex-grow min-w-0">
                    <span className={clsx(
                      'text-[12px] font-semibold leading-tight truncate transition-colors',
                      isActive ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground/80',
                      unreadCount > 0 ? '!text-foreground font-bold' : ''
                    )}>
                      {dmInfo.name}
                    </span>
                    <span className={clsx(
                      'text-[10px] leading-tight truncate transition-colors mt-0.5',
                      unreadCount > 0 ? 'text-primary font-bold opacity-100' : 'text-foreground/40 font-medium opacity-60',
                      isActive && unreadCount === 0 ? 'text-primary/70' : ''
                    )}>
                      {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : previewText}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleProfilePanel(user?.id)}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.03] group transition-all duration-300 flex-grow min-w-0 overflow-hidden"
          >
            <div className="relative shrink-0">
              <Avatar
                src={user?.avatar}
                alt={user?.username || 'User'}
                isOnline={true}
                size="sm"
                className="ring-1 ring-white/[0.06] group-hover:ring-primary/20 transition-all h-7 w-7"
              />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[12px] font-bold text-foreground/70 group-hover:text-primary transition-colors truncate">{user?.username}</span>
              <span className="text-[10px] font-medium text-foreground/25 truncate">{user?.email}</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl hover:bg-white/[0.05] text-foreground/25 hover:text-primary transition-all duration-300 shrink-0"
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-2 rounded-xl hover:bg-rose-500/10 text-foreground/25 hover:text-rose-500 transition-all duration-300 shrink-0"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          navigate('/');
        }}
      />
    </div>
  );
};
