import React, { useEffect, useRef, useState } from 'react';
import {
  Hash, PanelRight, Send, Paperclip, Smile, Bell, AtSign,
  MoreHorizontal, Reply, Edit3, Flame, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

// ─── Sample Data ──────────────────────────────────────────────────────────────

const sampleMessages = [
  {
    id: 'm1',
    user: { name: 'Alex Rivera', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    content: 'Has anyone seen the latest design specs for the dashboard? They look incredible 🔥',
    time: '10:24 AM',
    reactions: [{ emoji: '🔥', count: 3 }, { emoji: '👀', count: 2 }],
    isOwn: false,
  },
  {
    id: 'm2',
    user: { name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
    content: 'Just uploaded them to the #engineering channel. The new glassmorphism treatment is 🤌',
    time: '10:26 AM',
    reactions: [{ emoji: '🤌', count: 5 }],
    isOwn: false,
  },
  {
    id: 'm3',
    user: { name: 'Jane Doe', avatar: '' }, // Handled by store
    content: 'The ambient glow on the sidebar is such a good touch. Sarah crushed it.',
    time: '10:28 AM',
    reactions: [],
    isOwn: true,
  },
];

// ─── Emoji Quick Reactions ─────────────────────────────────────────────────────

const quickReactions = ['👍', '❤️', '😂', '🔥', '🤯', '🎉'];

// ─── Main Component ───────────────────────────────────────────────────────────

export const ChatArea: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const activeGroupId = useAppStore((state) => state.activeGroupId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const toggleNotificationPanel = useAppStore((state) => state.toggleNotificationPanel);
  const { user } = useSettingsStore();
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const meta = activeConversationId ? conversationMeta[activeConversationId] : null;
  const activeGroup = (meta?.groups && activeGroupId) ? meta.groups.find(g => g.id === activeGroupId) : null;
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      <header className="flex h-[64px] items-center justify-between border-b border-white/[0.03] px-6 shrink-0 glass-2 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {meta ? (
              <motion.div
                key={activeConversationId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveView('info')}
                className="flex items-center gap-3.5 cursor-pointer group/header-title"
              >
                <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary ring-1 ring-primary/10 group-hover/header-title:bg-primary group-hover/header-title:text-white transition-all duration-300 shadow-lg shadow-primary/5">
                  <Hash size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-foreground/15 leading-none mb-1.5">
                    <span>{meta.name}</span>
                    <span className="opacity-40">/</span>
                    <span className="text-primary/40 group-hover/header-title:text-primary/60 transition-colors">{activeGroup?.name || 'general'}</span>
                  </div>
                  <h2 className="font-bold text-foreground text-[16px] tracking-tight leading-none group-hover/header-title:text-glow transition-all duration-300">
                    #{activeGroup?.name || 'general'}
                  </h2>
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
                <h2 className="font-bold text-foreground/15 text-[14px] tracking-tight">No channel selected</h2>
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
                      className="h-6 w-6 transition-all !rounded-full"
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

          <Button variant="ghost" className="p-2 h-auto rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" onClick={toggleNotificationPanel}>
            <Bell size={17} />
          </Button>
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
        </div>
      </header>

      {/* ─── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-grow overflow-y-auto relative flex flex-col custom-scrollbar-compact">
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
              className="flex-grow flex flex-col max-w-4xl mx-auto w-full px-4 py-6"
            >
              {activeGroupId && activeGroup && !activeGroup.joined ? (
                /* Join Group Overlay */
                <div className="flex-grow flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
                  <div className="max-w-md w-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-10 backdrop-blur-3xl shadow-2xl shadow-black/50 text-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10">
                      <div className="mx-auto h-16 w-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative">
                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                        <Hash size={28} className="text-foreground/80 relative z-10" />
                      </div>
                      
                      <h3 className="text-2xl font-black text-foreground tracking-tighter mb-3 uppercase">Join {activeGroup.name}</h3>
                      <p className="text-[13px] text-foreground/50 leading-relaxed font-medium mb-10">
                        {activeGroup.description || `This group is currently locked. Join to view history, participate in voice nodes, and collaborate with members.`}
                      </p>
                      
                      <div className="flex flex-col gap-3">
                        <Button 
                          className="w-full h-12 rounded-xl font-bold uppercase tracking-widest bg-white text-black hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                          onClick={() => useAppStore.getState().toggleGroupMembership(activeConversationId!, activeGroupId)}
                        >
                          Join Group
                        </Button>
                        <button 
                          onClick={() => useAppStore.getState().setActiveGroup(null)}
                          className="h-12 w-full rounded-xl font-bold text-[11px] uppercase tracking-widest text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.02] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Channel Start Intro (only in general/root) */}
                  {!activeGroupId && (
                    <div className="flex flex-col items-start text-left mb-6 px-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-white/[0.05] shadow-[0_4px_20px_rgba(99,102,241,0.08)]">
                        <Hash size={24} className="text-primary/60" />
                      </div>
                      <h4 className="text-xl font-black text-foreground tracking-tighter mb-1.5 uppercase tracking-wide">Welcome to #{meta?.name}</h4>
                      <p className="text-[13px] text-foreground/40 font-medium max-w-xl leading-relaxed">
                        {meta?.description || "This is the very beginning of the history for this channel."}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <button 
                          onClick={() => { if (!rightPanelOpen) toggleRightPanel(); }}
                          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                        >
                          <Edit3 size={11} />
                          Edit Description
                        </button>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-white/[0.05] to-transparent mt-8 mb-4" />
                    </div>
                  )}

                  {/* Message Container */}
                  <div className="flex-1 space-y-2 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-[0.02] pointer-events-none" />
                    <AnimatePresence initial={false}>
                      {sampleMessages.map((msg, i) => (
                        <MessageBubble 
                          key={msg.id} 
                          {...msg}
                          user={msg.isOwn ? { ...msg.user, name: user.username, avatar: user.avatar } : msg.user}
                          delay={i * 0.05} 
                        />
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                    <TypingIndicator />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Input Area ─────────────────────────────────────────────────── */}
      {activeConversationId && (
        <div className="z-30 relative bg-transparent transition-all duration-300">
          <div className="max-w-5xl mx-auto px-6 py-4 pb-8">
            <MessageInput channelName={meta?.name ?? ''} />
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const channels = [
    { id: '1', icon: '💬', name: '#general', desc: 'Team-wide chat' },
    { id: '2', icon: '🌐', name: '#global-chat', desc: 'The heartbeat of NeoPlane' },
    { id: '3', icon: '⚙️', name: '#engineering', desc: 'Tech & builds' },
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
              className="group flex items-center gap-3.5 p-3.5 rounded-xl glass-2 border border-white/[0.03] hover:border-primary/20 hover:bg-primary/[0.03] transition-all duration-300"
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

// ─── Message Input ────────────────────────────────────────────────────────────

const MessageInput: React.FC<{ channelName: string }> = ({ channelName }) => {
  const [text, setText] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };
  return (
    <div className="relative group/input">
      <div className="relative glass-1 bg-white/[0.01] border border-white/[0.05] focus-within:border-primary/20 rounded-xl transition-all duration-300 group-focus-within/input:bg-white/[0.03] overflow-hidden">
        <div className="flex items-center gap-1 px-3 pt-2.5 pb-1 border-b border-white/[0.03]">
          {['Bold', 'Italic', 'Strike'].map((label) => (
            <button key={label} className="px-2 py-0.5 rounded-md text-[11px] font-mono text-foreground/20 hover:text-foreground/50 hover:bg-white/[0.04] transition-all">
              {label[0]}
            </button>
          ))}
          <div className="h-3 w-px bg-white/[0.05] mx-1" />
          <button className="p-1.5 rounded-md text-foreground/20 hover:text-foreground/50 hover:bg-white/[0.04] transition-all">
            <AtSign size={13} />
          </button>
        </div>
        <div className="flex items-end gap-2 px-2 py-1.5">
          <button className="p-2 shrink-0 text-foreground/20 hover:text-primary rounded-xl hover:bg-white/5 transition-all"><Paperclip size={16} /></button>
          <textarea
            ref={ref} rows={1} value={text} onChange={(e) => setText(e.target.value)} onInput={handleInput}
            placeholder={`Message #${channelName}`}
            className="flex-grow bg-transparent border-0 focus:ring-0 text-[14px] py-2 px-1 resize-none text-foreground placeholder:text-foreground/15 min-h-[36px] max-h-[180px] font-bold leading-relaxed outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0 pb-1">
            <button className="p-2 text-foreground/20 hover:text-amber-400 rounded-xl hover:bg-white/5 transition-all"><Smile size={16} /></button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={clsx('h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300', text.trim() ? 'bg-primary shadow-[0_0_15px_rgba(99,102,241,0.35)] text-white hover:scale-105' : 'bg-white/[0.04] text-foreground/15 cursor-not-allowed')}
            >
              <Send size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Message Bubble ──────────────────────────────────────────────────────────

const MessageBubble: React.FC<{
  id: string;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  isOwn?: boolean;
  reactions?: { emoji: string; count: number }[];
  delay?: number;
}> = ({ id, user, content, time, isOwn, reactions = [], delay = 0 }) => {
  const [showActions, setShowActions] = useState(false);
  const [localReactions, setLocalReactions] = useState(reactions);
  const setActiveThread = useAppStore((state) => state.setActiveThread);
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const threadMeta = activeConversationId ? conversationMeta[activeConversationId]?.threads?.[id] : null;

  const addReaction = (emoji: string) => {
    setLocalReactions((prev) => {
      const existing = prev.find((r) => r.emoji === emoji);
      if (existing) return prev.map((r) => r.emoji === emoji ? { ...r, count: r.count + 1 } : r);
      return [...prev, { emoji, count: 1 }];
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className={clsx('group relative flex gap-3 px-2 py-1.5 rounded-xl hover:bg-white/[0.02] transition-all', isOwn ? 'flex-row-reverse' : 'flex-row')}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar src={user.avatar} size="sm" alt={user.name} className="mt-0.5 shrink-0 h-8 w-8 ring-1 ring-white/[0.04]" />
      <div className={clsx('flex flex-col max-w-[75%] min-w-0', isOwn ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[12px] font-black tracking-tight text-foreground/50">{user.name}</span>
          <span className="text-[10px] text-foreground/15 font-black uppercase tracking-widest">{time}</span>
        </div>
        <div className={clsx('relative px-4 py-2.5 rounded-2xl text-[14px] font-bold leading-relaxed shadow-md border transition-all duration-200', isOwn ? 'bg-primary text-white rounded-tr-sm border-primary/20 shadow-[0_2px_20px_rgba(99,102,241,0.2)]' : 'glass-2 text-foreground rounded-tl-sm border-white/[0.04] hover:border-white/[0.1]')}>
          {content}
        </div>
        {localReactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 px-1">
            {localReactions.map((r) => (
              <button key={r.emoji} onClick={() => addReaction(r.emoji)} className="flex items-center gap-1 px-2 py-0.5 rounded-full glass-2 border border-white/[0.05] hover:border-primary/20 text-[12px] transition-all">
                <span>{r.emoji}</span>
                <span className="text-[11px] text-foreground/40 font-black">{r.count}</span>
              </button>
            ))}
          </div>
        )}
        {threadMeta && (
          <button onClick={() => setActiveThread(id)} className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-xl glass-2 border border-white/[0.04] hover:border-primary/20 hover:bg-primary/5 transition-all">
            <span className="text-[11px] font-black text-primary uppercase tracking-widest">{threadMeta.replies} Replies</span>
          </button>
        )}
      </div>
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -4 }}
            className={clsx('absolute -top-9 flex items-center gap-0.5 p-1 rounded-xl glass-3 border border-white/[0.08] shadow-2xl z-[100]', isOwn ? 'right-0' : 'left-10')}
          >
            {quickReactions.slice(0, 4).map((emoji) => (
              <button key={emoji} onClick={() => addReaction(emoji)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[13px] transition-all hover:scale-110 active:scale-95">{emoji}</button>
            ))}
            <div className="w-px h-3 bg-white/10 mx-0.5" />
            <button onClick={() => setActiveThread(id)} className="p-1.5 rounded-lg text-foreground/30 hover:text-primary hover:bg-primary/10 transition-all"><Reply size={15} /></button>
            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-foreground/30 hover:text-foreground/60 transition-all"><Edit3 size={13} /></button>
            <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-foreground/30 hover:text-foreground/60 transition-all"><MoreHorizontal size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-2 mt-2">
      <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex Rivera" size="sm" className="h-8 w-8 opacity-60" />
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 glass-2 rounded-2xl rounded-tl-sm border border-white/[0.04]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i} className="h-1.5 w-1.5 rounded-full bg-foreground/30"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <span className="text-[11px] text-foreground/20 font-black uppercase tracking-widest">Alex is typing…</span>
    </div>
  );
};
