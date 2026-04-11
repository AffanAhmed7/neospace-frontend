import React, { useState } from 'react';
import { 
  Plus, Hash, Pin,
  Hexagon, ChevronDown, ChevronRight, 
  Search as SearchIcon, Settings, Telescope, Users, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

const mainChannelIds = ['c2', 'c1', 'c3'];

const dms = [
  { 
    id: '1', 
    name: 'Alex Rivera', 
    status: 'online' as const, 
    unread: 2, 
    lastMsg: 'Seen the new specs?',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' 
  },
  { 
    id: '2', 
    name: 'Jordan Lee', 
    status: 'busy' as const, 
    unread: 0, 
    lastMsg: 'Just pushed the fix!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' 
  },
  { 
    id: '3', 
    name: 'Sarah Chen', 
    status: 'idle' as const, 
    unread: 0, 
    lastMsg: 'Catch you later ✌️',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' 
  },
];

const statusConfig = {
  online: { color: 'bg-emerald-400', ring: 'shadow-[0_0_6px_rgba(52,211,153,0.6)]', label: 'Online' },
  busy: { color: 'bg-rose-400', ring: 'shadow-[0_0_6px_rgba(251,113,133,0.6)]', label: 'Busy' },
  offline: { color: 'bg-white/20', ring: '', label: 'Offline' },
  away: { color: 'bg-amber-400', ring: 'shadow-[0_0_6px_rgba(251,191,36,0.6)]', label: 'Away' },
  idle: { color: 'bg-amber-400', ring: 'shadow-[0_0_6px_rgba(251,191,36,0.6)]', label: 'Idle' },
  dnd: { color: 'bg-rose-500', ring: 'shadow-[0_0_6px_rgba(244,63,94,0.6)]', label: 'Do Not Disturb' },
};

export const Sidebar: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const activeView = useAppStore((state) => state.activeView);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const activeGroupId = useAppStore((state) => state.activeGroupId);
  const setActiveGroup = useAppStore((state) => state.setActiveGroup);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const pinnedChannelIds = useAppStore((state) => state.pinnedChannelIds);
  const togglePinChannel = useAppStore((state) => state.togglePinChannel);

  const { user } = useSettingsStore();
  const navigate = useNavigate();
  const [expandedChannels, setExpandedChannels] = useState<Record<string, boolean>>({
    'c1': true,
    'c3': true
  });

  const toggleChannelGroups = (id: string) => {
    setExpandedChannels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Workspace Header */}
      <div className="px-6 flex items-center justify-between h-[64px] shrink-0 border-b border-white/[0.03]">
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
          <span className="font-bold text-xl tracking-tighter text-foreground uppercase group-hover:text-glow transition-all duration-300">neo.</span>
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
          {/* Friends Button */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setActiveConversation(null);
              setActiveView('friends');
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
            </div>
          </motion.button>

          {/* Explore Channels Button */}
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setActiveConversation(null);
              setActiveView('explore');
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
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Pinned Hub</span>
            </div>
            {pinnedChannelIds.map((id) => {
              const channel = conversationMeta[id];
              if (!channel) return null;
              const isActive = activeConversationId === id;
              return (
                <motion.div key={`pinned-chan-${id}`} className="group/item relative">
                  <motion.button
                    onClick={() => setActiveConversation(id)}
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

            {/* Pinned Groups */}
            {useAppStore.getState().pinnedGroupIds.map((key) => {
              const [cId, gId] = key.split(':');
              const channel = conversationMeta[cId];
              const group = channel?.groups?.find(g => g.id === gId);
              if (!group) return null;
              
              const isGroupActive = activeConversationId === cId && activeGroupId === gId;
              
              return (
                <motion.div key={`pinned-group-${key}`} className="group/item relative">
                  <motion.button
                    onClick={() => {
                      setActiveConversation(cId);
                      setActiveGroup(gId);
                    }}
                    className={clsx(
                      'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] font-medium transition-all duration-200 outline-none',
                      isGroupActive
                        ? 'bg-primary/10 text-primary shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                        : 'text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/70'
                    )}
                  >
                    <div className="flex flex-col items-start flex-grow truncate">
                      <span className="text-[9px] font-black uppercase tracking-widest text-foreground/20 group-hover:text-foreground/40 transition-colors">
                        {channel.name} 
                      </span>
                      <span className={clsx('text-left truncate w-full', isGroupActive && 'font-bold tracking-tight')}>
                        {group.name}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); useAppStore.getState().togglePinGroup(cId, gId); }}
                      className={clsx(
                        "p-1 rounded-md transition-all hover:bg-white/10 shrink-0",
                        isGroupActive ? "text-primary/40 hover:text-primary" : "text-foreground/10 hover:text-foreground/40"
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
          {mainChannelIds.map((id) => {
            const channel = conversationMeta[id];
            if (!channel) return null;
            const isActive = activeConversationId === id;
            const hasGroups = channel.groups && channel.groups.length > 0;
            const isExpanded = expandedChannels[id];
            const isPinned = pinnedChannelIds.includes(id);

            return (
              <div key={id} className="space-y-0.5">
                <motion.button
                  onClick={() => setActiveConversation(id)}
                  className={clsx(
                    'group relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-[14px] font-medium transition-all duration-200 outline-none',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-[0_4px_12px_rgba(99,102,241,0.05)]'
                      : 'text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/70'
                  )}
                >
                  <Hash size={16} className={clsx('shrink-0 transition-colors', isActive ? 'text-primary' : 'text-foreground/15 group-hover:text-foreground/40')} />
                  <span className={clsx('flex-grow text-left truncate', isActive && 'font-bold tracking-tight')}>{channel.name}</span>
                  
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePinChannel(id); }}
                      className={clsx(
                        "p-1 rounded-md transition-all hover:bg-white/10 opacity-0 group-hover:opacity-100",
                        isPinned ? "text-primary opacity-100" : "text-foreground/20"
                      )}
                      title={isPinned ? "Unpin Channel" : "Pin Channel"}
                    >
                      <Pin size={12} className={clsx(isPinned ? "fill-primary/20" : "rotate-45")} />
                    </button>

                    {hasGroups && (
                      <div 
                        onClick={(e) => { e.stopPropagation(); toggleChannelGroups(id); }}
                        className="p-1 rounded-md hover:bg-white/10 text-foreground/20 hover:text-foreground/50 transition-all"
                      >
                        {isExpanded ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
                      </div>
                    )}
                  </div>
                </motion.button>

                {/* Nested Groups & General */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 space-y-0.5 border-l border-white/[0.03] pl-2"
                    >
                      {/* Always show General */}
                      <button
                        onClick={() => setActiveGroup(null)}
                        className={clsx(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] transition-all",
                          isActive && !activeGroupId 
                            ? "bg-white/[0.05] text-primary font-bold shadow-sm" 
                            : "text-foreground/30 hover:bg-white/[0.02] hover:text-foreground/50"
                        )}
                      >
                        <Hash size={12} className="shrink-0 opacity-40" />
                        <span>general</span>
                      </button>

                      {hasGroups && channel.groups?.map((group) => {
                        const isGroupActive = isActive && activeGroupId === group.id;
                        const isGroupPinned = useAppStore.getState().pinnedGroupIds.includes(`${id}:${group.id}`);
                        return (
                          <div key={group.id} className={clsx(
                            "flex items-center group/group-item rounded-lg transition-all",
                            isGroupActive ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"
                          )}>
                            <button
                              onClick={() => {
                                if (!isActive) setActiveConversation(id);
                                setActiveGroup(group.id);
                              }}
                              className={clsx(
                                "flex-grow flex items-center gap-2 px-2 py-1.5 text-[12px] text-left truncate transition-colors",
                                isGroupActive ? "text-primary font-bold shadow-sm" : "text-foreground/30 group-hover/group-item:text-foreground/50"
                              )}
                            >
                              <div className={clsx("w-1 h-1 rounded-full", isGroupActive ? "bg-primary" : "bg-foreground/10")} />
                              <span className="truncate">{group.name}</span>
                            </button>
                            
                            <div className="flex items-center gap-1 pr-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); useAppStore.getState().togglePinGroup(id, group.id); }}
                                className={clsx(
                                  "p-1 rounded-md transition-all hover:bg-white/10",
                                  isGroupPinned ? "text-primary opacity-100" : "text-foreground/10 hover:text-foreground/40 opacity-0 group-hover/group-item:opacity-100"
                                )}
                                title={isGroupPinned ? "Unpin Group" : "Pin Group"}
                              >
                                <Pin size={10} className={clsx(isGroupPinned ? "fill-primary/20" : "rotate-45")} />
                              </button>


                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Direct Messages */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between group/dm-header">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.12em]">Direct Messages</span>
            </div>
            <button className="p-1 rounded-md text-foreground/20 hover:bg-white/10 hover:text-primary opacity-0 group-hover/dm-header:opacity-100 transition-all">
              <Plus size={14} />
            </button>
          </div>
          
          {/* Message Requests Button */}
          <div className="px-2 mb-2">
            <button 
              onClick={() => {
                setActiveConversation(null);
                setActiveView('message-requests');
              }}
              className={clsx(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all group/req",
                activeView === 'message-requests'
                  ? "bg-primary/20 text-primary border border-primary/20"
                  : "text-foreground/20 hover:text-primary hover:bg-primary/5"
              )}
            >
              <div className={clsx(
                "flex items-center justify-center w-5 h-5 rounded-lg transition-colors",
                activeView === 'message-requests' ? "bg-primary/20" : "bg-white/[0.03] group-hover/req:bg-primary/10"
              )}>
                <Mail size={12} className={clsx("transition-colors", activeView === 'message-requests' ? "text-primary" : "group-hover/req:text-primary")} />
              </div>
              <span>Message Requests</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse" />
            </button>
          </div>

          <div className="space-y-0.5">
            {dms.map((dm) => {
              const isActive = activeConversationId === dm.id;
              const status = statusConfig[dm.status];
              return (
                <motion.button
                  key={dm.id}
                  onClick={() => setActiveConversation(dm.id)}
                  className={clsx(
                    'group relative flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-[13px] font-medium transition-all duration-200 outline-none overflow-hidden',
                    isActive
                      ? 'bg-primary/10'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dm-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full shadow-[0_0_6px_rgba(99,102,241,0.5)]"
                    />
                  )}
                  {/* Avatar with inline status */}
                  <div 
                    className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProfilePanel(dm.id);
                    }}
                  >
                    <Avatar src={dm.avatar} alt={dm.name} size="sm" className="h-7 w-7 ring-1 ring-white/[0.06]" />
                    <span className={clsx(
                      'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-bg-deep',
                      status.color, status.ring
                    )} />
                  </div>

                    <div className="flex flex-col text-left overflow-hidden flex-grow min-w-0">
                      <span className={clsx(
                        'text-[12px] font-semibold leading-tight truncate transition-colors',
                        isActive ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground/80'
                      )}>
                        {dm.name}
                      </span>
                      <span className="text-[10px] text-foreground/25 truncate leading-tight font-medium mt-0.5">
                        {dm.lastMsg}
                      </span>
                    </div>

                  {dm.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold min-w-[18px] text-center shadow-[0_0_8px_rgba(99,102,241,0.4)] shrink-0">
                      {dm.unread}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-2 border-t border-white/[0.03]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleProfilePanel(null)}
            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/[0.03] group transition-all duration-300 flex-grow min-w-0 overflow-hidden"
          >
            <div className="relative shrink-0">
              <Avatar
                src={user.avatar}
                alt={user.username}
                isOnline={true}
                size="sm"
                className="ring-1 ring-white/[0.06] group-hover:ring-primary/20 transition-all h-7 w-7"
              />
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[12px] font-bold text-foreground/70 group-hover:text-primary transition-colors truncate">{user.username}</span>
              <span className="text-[10px] font-medium text-foreground/25 truncate">jane@neoplane.io</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 rounded-xl hover:bg-white/[0.05] text-foreground/25 hover:text-primary transition-all duration-300 shrink-0"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
