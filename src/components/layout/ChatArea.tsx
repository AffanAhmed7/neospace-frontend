import React, { useEffect, useRef, useState } from 'react';
import {
  Hash, PanelRight, File as FileIcon, Copy,
  Reply, Flame, Info, Pin, Check, Trash2, UserMinus, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';
import { MessageInput } from './MessageInput';

// ─── Sample Data & Helpers ──────────────────────────────────────────────────
// Moved to useAppStore.ts for global accessibility

// ─── Emoji Quick Reactions ─────────────────────────────────────────────────────

const quickReactions = ['👍', '❤️', '😂', '🔥', '🤯', '🎉', '👀', '✨', '🫡', '💯', '🚀', '🤔'];

// ─── Main Component ───────────────────────────────────────────────────────────

export const ChatArea: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const activeGroupId = useAppStore((state) => state.activeGroupId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const { user } = useSettingsStore();
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const messages = useAppStore((state) => state.messages);
  const pinnedMessageIds = useAppStore((state) => state.pinnedMessageIds);
  const togglePinMessage = useAppStore((state) => state.togglePinMessage);
  
  const addMessage = useAppStore(state => state.addMessage);
  const acceptedRequestIds = useAppStore(state => state.acceptedRequestIds);
  const friendIds = useAppStore(state => state.friendIds);
  const acceptRequest = useAppStore(state => state.acceptRequest);
  const deleteRequest = useAppStore(state => state.deleteRequest);
  
  const meta = activeConversationId ? conversationMeta[activeConversationId] : null;

  // A conversation is "pending" only if it's a DM with someone who is NOT already a friend
  // and has not been explicitly accepted yet.
  const isAlreadyFriend = activeConversationId ? friendIds.includes(activeConversationId) : false;
  const isPending = activeConversationId && meta?.isDM && !isAlreadyFriend && !acceptedRequestIds.includes(activeConversationId);
  const activeGroup = (meta?.groups && activeGroupId) ? meta.groups.find(g => g.id === activeGroupId) : null;
  const channelMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const currentPinnedIds = activeConversationId ? pinnedMessageIds[activeConversationId] || [] : [];
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Early return if in a conversation but meta is not loaded yet
  // This simplifies nested checks later
  if (activeConversationId && !meta) return null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveConversation(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveConversation]);

  return (
    <div className="flex flex-col h-full bg-transparent relative selection:bg-primary/20">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex h-[72px] items-center justify-between border-b border-white/[0.03] px-10 shrink-0 bg-bg-deep/90 z-50 sticky top-0 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {meta ? (
              <motion.div
                key={activeConversationId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (meta.isDM) {
                    toggleProfilePanel(activeConversationId);
                  } else {
                    setActiveView('info');
                  }
                }}
                className="flex items-center gap-4 cursor-pointer group/header-title"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
                  <div className="flex flex-col text-left">
                    <h2 className="font-black text-foreground text-[19px] tracking-tight leading-none group-hover/header-title:text-glow transition-all duration-300 mb-1.5 uppercase">
                      {!meta.isDM && '# '}{activeGroup?.name || meta.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-foreground/20 leading-none">
                      <span className="group-hover/header-title:text-foreground/40 transition-colors">
                        {meta.isDM ? 'Direct Message' : meta.name}
                      </span>
                      {!meta.isDM && (
                        <>
                          <span className="opacity-20">/</span>
                          <span className="text-primary/40 group-hover/header-title:text-primary/60 transition-colors font-black">{activeGroup?.name || 'Main Hub'}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="h-8 w-8 bg-white/[0.02] rounded-xl flex items-center justify-center ring-1 ring-white/[0.03]">
                  <Hash size={16} className="text-foreground/10" />
                </div>
                <h2 className="font-bold text-foreground/15 text-[14px] tracking-tight">Select a workspace</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-1">
          {meta && meta.online.length > 0 && (
            <div className="flex items-center gap-2.5 mr-1 px-1 transition-all cursor-pointer group">
              <div className="flex -space-x-2.5">
                {meta.online.slice(0, 3).map((onlineUser, i) => (
                  <div 
                    key={i} 
                    className="relative transition-transform duration-300 group-hover:-translate-y-0.5"
                    style={{ zIndex: 10 - i }}
                  >
                    <Avatar
                      src={onlineUser.avatar}
                      alt={onlineUser.name}
                      size="sm"
                      className="h-6 w-6 transition-all !rounded-full cursor-pointer hover:ring-2 hover:ring-primary/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        const id = (onlineUser as any).id || 
                          (onlineUser.name.includes('Alex') ? '1' : 
                          onlineUser.name.includes('Jordan') ? '2' : 
                          onlineUser.name.includes('Sarah') ? '3' : 'me');
                        toggleProfilePanel(id);
                      }}
                    />
                  </div>
                ))}
                {meta.online.length > 3 && (
                  <div 
                    className="relative flex items-center justify-center h-6 w-6 rounded-full bg-white/[0.05] text-[9px] font-black tracking-tighter text-foreground z-[5] transition-transform duration-300 group-hover:-translate-y-0.5"
                  >
                    +{meta.online.length - 3}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start -space-y-0.5">
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                  {meta.online.length}
                </span>
                <span className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.1em]">
                  Online
                </span>
              </div>
            </div>
          )}

          {meta && !meta.isDM && (
            <>
              <Button 
                variant="ghost" 
                className="p-2 h-auto rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" 
                onClick={() => setActiveView('info')}
              >
                <Info size={17} />
              </Button>
              <div className="w-px h-4 bg-white/[0.03] mx-0.5 hidden lg:block" />
              <Button
                variant="ghost"
                className="p-2 h-auto hidden lg:flex rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all"
                onClick={toggleRightPanel}
              >
                <PanelRight size={17} />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* ─── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto relative flex flex-col min-h-0 custom-scrollbar-compact">
        <AnimatePresence mode="wait">
          {!activeConversationId ? (
            <EmptyState key="empty" onSelect={setActiveConversation} />
          ) : (
            <motion.div
              key={activeConversationId + (activeGroupId || '') + (activeGroup?.joined ? 'joined' : 'unjoined')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={clsx(
                activeGroupId && activeGroup && !activeGroup.joined 
                  ? "max-w-none px-0 pt-0 pb-0 flex-1" 
                  : "max-w-none w-full px-8 pt-0 pb-0 flex-1 flex flex-col"
              )}
            >
              {activeGroupId && activeGroup && !activeGroup.joined ? (
                /* Elegant Borderless Group Gateway */
                <div className="w-full flex-1 flex flex-col items-center justify-start pt-4 lg:pt-8 p-6 lg:p-12 animate-in fade-in duration-700 relative bg-transparent select-none">
                  {/* Radiance Removed */}

                  <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                    {/* Refined Iconography Removed as requested */}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.7 }}
                      className="flex flex-col items-center w-full"
                    >
                      {/* Classy Metadata Headers */}
                      <div className="flex items-center gap-6 mb-8">
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-1">Category</span>
                          <span className="text-[11px] font-bold text-primary/60 uppercase tracking-widest">{meta!.category || 'General'}</span>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-1">Established</span>
                          <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">June 2023</span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-black text-foreground tracking-tighter uppercase mb-6 text-center">
                        {activeGroup.name}
                      </h3>
                      
                      <div className="w-full max-w-md text-center mb-10">
                        <p className="text-[14px] lg:text-[15px] text-foreground/30 leading-relaxed font-medium">
                          {activeGroup.description || `This space is currently restricted. Join to synchronize with the message history and collaborate with the existing members of this node.`}
                        </p>
                      </div>

                      {/* Admin Attribution */}
                      <div className="flex items-center gap-3 mb-12 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/40 to-secondary/20 border border-white/10" />
                        <span className="text-[11px] font-bold text-foreground/40">
                          Curated by <span className="text-foreground/70">Alex Rivera</span>
                        </span>
                      </div>

                      {/* Quiet Stats */}
                      <div className="flex items-center gap-10 mb-16">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                          <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">{meta!.memberCount || 12} Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                          <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">{meta!.online.length || 3} Online</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-5 w-full max-w-[280px]">
                        <Button 
                          className="w-full h-12 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] bg-white text-black hover:bg-white/90 transition-all shadow-[0_4px_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => useAppStore.getState().toggleGroupMembership(activeConversationId!, activeGroupId)}
                        >
                          Join Group
                        </Button>
                        <button 
                          onClick={() => useAppStore.getState().setActiveGroup(null)}
                          className="h-12 w-full rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] text-foreground/60 border border-white/5 hover:border-primary/30 hover:bg-white/[0.02] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Reply size={14} className="rotate-180 text-primary/60" />
                          Back to Channel
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Minimalist Accents */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
                </div>
              ) : (
                <>
                  <div className="flex-1" /> {/* Push messages to the bottom */}
                  {/* Channel Start Intro (only in general/root) */}
                  {!activeGroupId && (
                    <div className="flex flex-col items-start text-left mb-6 px-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-white/[0.05] shadow-[0_4px_20px_rgba(99,102,241,0.08)]">
                        <Hash size={24} className="text-primary/60" />
                      </div>
                      <h4 className="text-xl font-black text-foreground tracking-tighter mb-1.5 uppercase tracking-wide">Welcome to #{meta!.name}</h4>
                      <p className="text-[13px] text-foreground/40 font-medium max-w-xl leading-relaxed">
                        {meta!.description || "This is the very beginning of the history for this channel."}
                      </p>
                      <div className="h-px w-full bg-gradient-to-r from-white/[0.05] to-transparent mt-8 mb-4" />
                    </div>
                  )}

                  {/* Message Container */}
                  <div className="space-y-2 relative overflow-visible">
                    {/* Accent Removed */}
                    <AnimatePresence initial={false}>
                      {channelMessages.map((msg, i) => {
                        const messageUser = msg.isOwn ? { ...msg.user, name: user.username, avatar: user.avatar, id: 'me' } : msg.user;
                        return (
                          <MessageBubble 
                            key={msg.id} 
                            {...msg}
                            user={messageUser as any}
                            isPinned={currentPinnedIds.includes(msg.id)}
                            onPin={() => activeConversationId && togglePinMessage(activeConversationId, msg.id)}
                            delay={i * 0.05} 
                          />
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                    {isPending && (
                      <TypingIndicator 
                        name={meta.name} 
                        avatar={meta.online[0]?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${meta.name}`} 
                      />
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Input Area or Pending Request Bar ─────────────────────────────────────────── */}
      {activeConversationId && (!activeGroupId || (activeGroup && activeGroup.joined)) && (
        <div className="relative border-t border-white/[0.05] bg-bg-deep/50 backdrop-blur-xl">
          {isPending ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 p-8 relative overflow-hidden"
            >
              {/* Subtle Radiance */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="flex flex-col items-center gap-2 text-center max-w-md">
                <h4 className="text-[14px] font-black uppercase tracking-widest text-foreground/80">
                  New Message Request
                </h4>
                <p className="text-[12px] font-medium text-foreground/25 leading-relaxed italic">
                  "Would you like to start a conversation? They won't know you've read this until you accept."
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => acceptRequest(activeConversationId)}
                  className="h-11 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-glow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  Accept Request
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    deleteRequest(activeConversationId);
                    setActiveConversation(null);
                  }}
                  className="h-11 px-6 rounded-xl border border-white/5 text-foreground/30 hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/10 font-black uppercase tracking-widest text-[11px] transition-all"
                >
                  Ignore & Delete
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary/20 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700" />
              <MessageInput 
                channelName={meta?.name ?? ''} 
                onSend={(text, attachments) => {
                  if (activeConversationId) {
                    addMessage(activeConversationId, text, attachments);
                  }
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const channels = [
    { id: '1', icon: '💬', name: '#Casuals', desc: 'The pulse of the space' },
    { id: '2', icon: '🌐', name: '#global-chat', desc: 'The wider world' },
    { id: '3', icon: '⚙️', name: '#engineering', desc: 'Code & builds' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-grow flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-md w-full text-center">
        <div className="relative flex items-center justify-center h-32 mb-8">
          {[
            { emoji: '💬', x: -60, y: -10, delay: 0, size: 'text-3xl' },
            { emoji: '🚀', x: 60, y: -20, delay: 0.1, size: 'text-2xl' },
            { emoji: '✨', x: 0, y: -40, delay: 0.2, size: 'text-xl' },
            { emoji: '🎯', x: -40, y: 20, delay: 0.15, size: 'text-lg' },
            { emoji: '⚡', x: 45, y: 15, delay: 0.05, size: 'text-xl' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={clsx('absolute select-none', item.size)}
              style={{ x: item.x, y: item.y }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.9, 1.05, 0.9],
                y: [item.y, item.y - 6, item.y],
              }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
            >
              {item.emoji}
            </motion.div>
          ))}
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 ring-1 ring-white/[0.06] flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.1)] backdrop-blur-sm">
            <Flame size={32} className="text-primary/70" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">Pick up where you left off</h3>
        <p className="text-[14px] text-foreground/30 leading-relaxed font-medium mb-8">Jump into a channel or drop a DM — your team's waiting.</p>

        <div className="flex flex-col gap-2 text-left">
          {channels.map((ch, i) => (
            <motion.button
              key={ch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              onClick={() => onSelect(ch.id)}
              className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-300"
            >
              <span className="text-xl">{ch.icon}</span>
              <div className="flex flex-col text-left">
                <span className="text-[13px] font-bold text-foreground/60 group-hover:text-foreground/90 transition-colors">{ch.name}</span>
                <span className="text-[11px] text-foreground/25 group-hover:text-foreground/40 transition-colors">{ch.desc}</span>
              </div>
              <div className="ml-auto text-foreground/10 group-hover:text-primary/50 transition-colors">
                <Hash size={15} />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Message Bubble ──────────────────────────────────────────────────────────

const MessageBubble: React.FC<{
  id: string;
  user: { id?: string; name: string; avatar: string };
  content: string;
  time: string;
  isOwn?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
  attachments?: { name: string; type: string; url: string }[];
  reactions?: { emoji: string; count: number }[];
  delay?: number;
}> = ({ id, user, content, time, isOwn, isPinned, onPin, attachments = [], reactions = [], delay = 0 }) => {
  const [showActions, setShowActions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showAllReactions, setShowAllReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const setActiveThread = useAppStore((state) => state.setActiveThread);
  const deleteMessage = useAppStore((state) => state.deleteMessage);
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  
  const [localReactions, setLocalReactions] = useState(reactions);

  const threadMeta = activeConversationId ? conversationMeta[activeConversationId]?.threads?.[id] : null;

  const addReaction = (emoji: string) => {
    setLocalReactions((prev) => {
      let next = [...prev];

      // If already has a reaction, remove it first
      if (userReaction) {
        next = next.map(react => 
          react.emoji === userReaction 
            ? { ...react, count: Math.max(0, react.count - 1) } 
            : react
        ).filter(react => react.count > 0);

        // If toggling the same emoji, just return the cleared list
        if (userReaction === emoji) {
          setUserReaction(null);
          return next;
        }
      }

      // Add the new reaction
      const existing = next.find(r => r.emoji === emoji);
      if (existing) {
        next = next.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
      } else {
        next = [...next, { emoji, count: 1 }];
      }
      
      setUserReaction(emoji);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className={clsx('group relative flex gap-3 px-2 pt-1.5 pb-2 rounded-xl border-none transition-all duration-200 hover:z-[110] overflow-visible', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      <Avatar 
        src={user.avatar} 
        size="sm" 
        alt={user.name} 
        className="mt-0.5 shrink-0 h-8 w-8 ring-1 ring-white/[0.04] cursor-pointer hover:ring-primary/50 transition-all" 
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          const id = user.id || 
            (user.name.includes('Alex') ? '1' : 
            user.name.includes('Jordan') ? '2' : 
            user.name.includes('Sarah') ? '3' : 
            user.name.includes('Jane') ? 'me' : null);
          toggleProfilePanel(id);
        }}
      />
      <div 
        className={clsx('relative flex flex-col max-w-[75%] min-w-0', isOwn ? 'items-end' : 'items-start')}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-2 mb-1 px-1">
          <span 
            className="text-[12px] font-black tracking-tight text-foreground/50 cursor-pointer hover:text-foreground transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const id = user.id || 
                (user.name.includes('Alex') ? '1' : 
                user.name.includes('Jordan') ? '2' : 
                user.name.includes('Sarah') ? '3' : 
                user.name.includes('Jane') ? 'me' : null);
              toggleProfilePanel(id);
            }}
          >
            {user.name}
          </span>
          <span className="text-[10px] text-foreground/15 font-black uppercase tracking-widest">{time}</span>
        </div>
        <div className={clsx(
          'relative px-4 py-2.5 rounded-2xl text-[14px] font-bold leading-relaxed shadow-md border transition-all duration-200', 
          isOwn 
            ? 'bg-primary text-white rounded-tr-sm border-primary/20 shadow-[0_2px_20px_rgba(99,102,241,0.2)]' 
            : 'bg-white/[0.04] text-foreground rounded-tl-sm border-transparent'
        )}>
          {content}
          
          {attachments && attachments.length > 0 && (
            <div className="mt-3 grid grid-cols-1 gap-2 max-w-[300px]">
              {attachments.map((file, i) => (
                <div key={i} className="group/file relative rounded-xl overflow-hidden border border-white/10 bg-black/20">
                  {file.type.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                        <FileIcon size={20} className="text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold truncate text-foreground">{file.name}</span>
                        <span className="text-[10px] text-foreground/30 uppercase font-black tracking-widest">{file.type.split('/')[1] || 'File'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {isPinned && (
            <div className={clsx(
              "absolute -top-2 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg z-10",
              isOwn ? "-left-8" : "-right-8"
            )}>
              <Pin size={8} fill="currentColor" />
              Pinned
            </div>
          )}
        </div>
        {localReactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 px-1">
            {localReactions.map((r) => (
              <button 
                key={r.emoji} 
                onClick={() => addReaction(r.emoji)} 
                className={clsx(
                  "flex items-center gap-1 px-2 py-0.5 rounded-full border text-[12px] transition-all",
                  userReaction === r.emoji 
                    ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_8px_rgba(99,102,241,0.2)]" 
                    : "bg-white/[0.04] border-white/[0.05] hover:border-primary/20"
                )}
              >
                <span>{r.emoji}</span>
                <span className={clsx("text-[11px] font-black", userReaction === r.emoji ? "text-primary" : "text-foreground/40")}>{r.count}</span>
              </button>
            ))}
          </div>
        )}
        {threadMeta && (
          <button onClick={() => setActiveThread(id)} className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.04] hover:border-primary/20 hover:bg-primary/5 transition-all">
            <span className="text-[11px] font-black text-primary uppercase tracking-widest">{threadMeta.replies} Replies</span>
          </button>
        )}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: isOwn ? 10 : -10 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.9, x: isOwn ? 10 : -10 }}
              className={clsx(
                'absolute top-full mt-1 flex items-center gap-0.5 p-1 rounded-xl bg-[#0A0A0C] border border-white/[0.1] shadow-2xl z-[100]', 
                isOwn ? 'right-0' : 'left-0'
              )}
            >
              <div className="flex items-center">
                {/* First 5 emojis always visible */}
                {quickReactions.slice(0, 5).map((emoji) => (
                  <button 
                    key={emoji} 
                    onClick={() => addReaction(emoji)} 
                    className={clsx(
                      "p-1.5 rounded-lg text-[13px] transition-all hover:scale-110 active:scale-95",
                      userReaction === emoji ? "bg-primary/20 text-primary" : "hover:bg-white/[0.06]"
                    )}
                  >
                    {emoji}
                  </button>
                ))}

                {/* Expanded emojis */}
                <AnimatePresence>
                  {showAllReactions && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center overflow-hidden"
                    >
                      {quickReactions.slice(5).map((emoji) => (
                        <button 
                          key={emoji} 
                          onClick={() => addReaction(emoji)} 
                          className={clsx(
                            "p-1.5 rounded-lg text-[13px] transition-all hover:scale-110 active:scale-95",
                            userReaction === emoji ? "bg-primary/20 text-primary" : "hover:bg-white/[0.06]"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand / Collapse toggle */}
                <button
                  onClick={() => setShowAllReactions(p => !p)}
                  className="p-1.5 rounded-lg text-[10px] font-black text-foreground/30 hover:text-primary hover:bg-white/[0.06] transition-all tracking-tighter"
                  title={showAllReactions ? 'Show less' : 'More emojis'}
                >
                  {showAllReactions ? '↩' : '+7'}
                </button>
              </div>
              <div className="w-px h-3 bg-white/10 mx-0.5" />
              <button onClick={() => setActiveThread(id)} className="p-1.5 rounded-lg text-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"><Reply size={15} /></button>
              <button onClick={onPin} className={clsx("p-1.5 rounded-lg transition-all", isPinned ? "text-amber-400 bg-amber-400/10" : "text-foreground/30 hover:text-amber-400 hover:bg-amber-400/10")}>
                <Pin size={13} fill={isPinned ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }} 
                className={clsx(
                  "relative p-1.5 rounded-lg transition-all",
                  isCopied ? "text-emerald-400 bg-emerald-400/10" : "text-foreground/30 hover:text-primary hover:bg-white/[0.06]"
                )}
                title="Copy Message"
              >
                <AnimatePresence mode="wait">
                  {isCopied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center gap-1.5 px-0.5"
                    >
                      <Check size={13} strokeWidth={3} />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Copied!</span>
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <Copy size={13} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                  className={clsx(
                    "p-1.5 rounded-lg transition-all",
                    showDeleteMenu ? "text-rose-500 bg-rose-500/10" : "text-foreground/30 hover:text-rose-500 hover:bg-rose-500/10"
                  )}
                  title="Delete Options"
                >
                  <Trash2 size={13} />
                </button>

                <AnimatePresence>
                  {showDeleteMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full right-0 mb-2 w-56 bg-[#0F0F12] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden z-[200]"
                    >
                      <div className="p-2 border-b border-white/[0.03] bg-white/[0.02]">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 px-2">
                          {isOwn ? "Delete Message" : "Confirm Removal"}
                        </span>
                      </div>
                      <div className="p-1.5 flex flex-col gap-1">
                        {!isOwn && (
                          <div className="px-3 py-2 mb-1 bg-rose-500/5 rounded-lg border border-rose-500/10">
                            <p className="text-[10px] text-rose-300 font-bold leading-tight">
                              This will remove the message from your view only. This action cannot be undone.
                            </p>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => {
                            if (activeConversationId) deleteMessage(activeConversationId, id);
                          }}
                          className={clsx(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] font-bold transition-all",
                            isOwn 
                              ? "text-foreground/60 hover:text-foreground hover:bg-white/[0.04]" 
                              : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          )}
                        >
                          <UserMinus size={14} className={isOwn ? "text-foreground/30" : "text-rose-400"} />
                          <span>Delete for me</span>
                        </button>
                        
                        {isOwn && (
                          <button 
                            onClick={() => {
                              if (activeConversationId) deleteMessage(activeConversationId, id);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[12px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
                          >
                            <Users size={14} />
                            <span>Delete for everyone</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC<{ name: string; avatar: string }> = ({ name, avatar }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-2 py-1 mt-1"
    >
      <Avatar src={avatar} alt={name} size="sm" className="h-8 w-8 opacity-60" />
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/[0.04] rounded-2xl rounded-tl-sm border border-white/[0.04]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/30"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="text-[11px] text-foreground/20 font-black uppercase tracking-widest">{name} is typing…</span>
    </motion.div>
  );
};
