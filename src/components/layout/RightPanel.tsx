import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Pin, Search, Filter, 
  ChevronRight, UserPlus, MoreVertical, Hash,
  ArrowLeft, Send, Paperclip, Smile
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { Edit3 } from 'lucide-react';

// ─── Sample Data ─────────────────────────────────────────────────────────────

const threads = [
  { id: 'm1', title: 'Q3 Roadmap feedback', lastMsg: 'I think we should prioritize the mobile views.', user: 'Alex Rivera', time: '2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'm2', title: 'Design System update', lastMsg: 'Colors updated in Figma.', user: 'Jordan Lee', time: '5h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
];

// Moved to store for dynamic behavior

const threadReplies = [
  { id: 'r1', user: 'Alex Rivera', content: 'We definitely need more focus on the dark mode transitions.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', time: '12:45 PM' },
  { id: 'r2', user: 'Jordan Lee', content: 'Agreed. The current ones feel a bit sharp. Maybe add a subtle blur?', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', time: '12:48 PM' },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export const RightPanel: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const activeTab = useAppStore((state) => state.rightPanelTab);
  const setActiveThread = useAppStore((state) => state.setActiveThread);
  const setRightPanelTab = useAppStore((state) => state.setRightPanelTab);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const updateChannelDescription = useAppStore((state) => state.updateChannelDescription);
  const messages = useAppStore((state) => state.messages);
  const pinnedMessageIds = useAppStore((state) => state.pinnedMessageIds);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const meta = activeConversationId ? conversationMeta[activeConversationId] : null;
  const channelMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const currentPinnedIds = activeConversationId ? pinnedMessageIds[activeConversationId] || [] : [];
  
  const displayPinnedMessages = channelMessages.filter(msg => currentPinnedIds.includes(msg.id));

  const handleEdit = () => {
    if (meta) {
      setEditValue(meta.description);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (activeConversationId) {
      updateChannelDescription(activeConversationId, editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    ...(meta?.isDM ? [] : [{ id: 'members', icon: Users, label: 'Members', count: meta?.memberCount || 0 }]),
    { id: 'threads', icon: MessageSquare, label: 'Threads', count: threads.length },
    { id: 'pinned',  icon: Pin,           label: 'Pinned',  count: displayPinnedMessages.length },
  ] as const;

  // Render Thread Detail View
  if (activeThreadId) {
    return (
      <div className="flex flex-col h-full bg-bg-deep/90 border-l border-border w-full max-w-[320px] shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 px-6 h-[64px] bg-bg-deep/90 border-b border-white/[0.03] shrink-0">
          <button 
            onClick={() => setActiveThread(null)}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 text-foreground/30 hover:text-primary transition-all shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-foreground/15 leading-none mb-1.5">
              <span>{meta?.name || 'Channel'}</span>
              <span className="opacity-40">/</span>
              <span className="text-primary/40 truncate">Thread</span>
            </div>
            <h3 className="text-[15px] font-bold text-foreground tracking-tight leading-none truncate">#{threads.find(t => t.id === activeThreadId)?.title || 'Discussion'}</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-compact p-4 space-y-6">
          {/* Original Message */}
          <div className="relative p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2.5">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Alex Rivera"
                className="h-5 w-5 rounded-full shrink-0 object-cover ring-1 ring-white/[0.06]"
              />
              <span className="text-[11px] font-bold text-primary">Alex Rivera</span>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">
              Should we rethink the sidebar structure? It feels a bit cluttered.
            </p>
          </div>

          <div className="h-px bg-white/[0.03] w-full" />

          {/* Replies */}
          <div className="space-y-4">
            {threadReplies.map((reply) => (
              <div key={reply.id} className="flex gap-3 px-1">
                <img
                  src={reply.avatar}
                  alt={reply.user}
                  className="h-6 w-6 rounded-full shrink-0 object-cover ring-1 ring-white/[0.05] mt-0.5"
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-bold text-foreground/50">{reply.user}</span>
                    <span className="text-[10px] font-medium text-foreground/20">{reply.time}</span>
                  </div>
                  <p className="text-[12px] text-foreground/65 leading-relaxed font-medium">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/[0.03]">
          <div className="flex items-center gap-2 mb-2 px-1">
            <button className="text-foreground/20 hover:text-foreground/40 transition-all">
              <Paperclip size={14} />
            </button>
            <button className="text-foreground/20 hover:text-amber-400 transition-all">
              <Smile size={14} />
            </button>
          </div>
          <div className="relative flex items-center gap-2 group">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Reply in thread..." 
                className="w-full h-10 pl-4 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary/20 focus:bg-white/[0.05] transition-all outline-none text-[12px] font-medium placeholder:text-foreground/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-foreground/20 hover:text-primary transition-all">
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-deep/90 border-l border-border w-full max-w-[320px] shrink-0 overflow-hidden">
      
      {/* Tabs Header */}
      <div className="flex px-3 h-[64px] bg-bg-deep/90 border-b border-white/[0.03] gap-1 shrink-0 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRightPanelTab(tab.id as any)}
              className={clsx(
                "relative flex-1 flex flex-col items-center justify-center h-[48px] rounded-xl transition-all duration-300 gap-1",
                isActive ? "bg-primary/10 text-primary" : "text-foreground/30 hover:bg-white/[0.03] hover:text-foreground/60"
              )}
            >
              <tab.icon size={15} className={clsx("transition-transform duration-300", isActive && "scale-110")} />
              <span className="text-[9px] font-black uppercase tracking-[0.15em]">{tab.label}</span>
              {isActive && (
                <motion.div layoutId="active-tab-dot" className="absolute bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 shrink-0">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary/20 focus:bg-white/[0.05] transition-all outline-none text-[13px] font-medium placeholder:text-foreground/20"
          />
        </div>
      </div>

      {/* Channel Header / Description */}
      {meta && !meta.isDM && (
        <div className="px-4 py-5 border-b border-white/[0.03] space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/50 flex items-center gap-2">
              <Hash size={14} className="text-primary/60" />
              About Channel
            </h3>
            <div className="flex items-center gap-1">
              {!isEditing && (
                <button 
                  onClick={handleEdit}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/20 hover:text-primary transition-all"
                  title="Edit Description"
                >
                  <Edit3 size={14} />
                </button>
              )}
              <button 
                onClick={() => setActiveView('info')}
                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary/40 hover:text-primary transition-all"
                title="Full Dashboard"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative group/desc">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-white/[0.03] border border-primary/20 rounded-xl p-3 text-[13px] font-medium text-foreground outline-none resize-none h-24 focus:bg-white/[0.05] transition-all"
                  placeholder="What's this channel for?"
                />
                <div className="flex gap-2 justify-end">
                  <button 
                    onClick={handleCancel}
                    className="h-8 px-3 rounded-lg text-[11px] font-bold text-foreground/30 hover:text-foreground hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="h-8 px-4 rounded-lg text-[11px] font-bold bg-primary text-white hover:opacity-90 transition-all font-black uppercase tracking-widest"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[13px] text-foreground/50 leading-relaxed font-medium">
                  {meta.description || 'No description set for this channel.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-compact px-2 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'members' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.15em]">Online — {meta?.online?.length || 0}</span>
                <button className="p-1 rounded-lg hover:bg-white/5 text-foreground/20 hover:text-primary transition-all">
                  <UserPlus size={14} />
                </button>
              </div>
              {meta?.online?.map((p, idx) => (
                <button
                  key={idx}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    const id = (p as any).id || 
                      (p.name.includes('Alex') ? '1' : 
                      p.name.includes('Jordan') ? '2' : 
                      p.name.includes('Sarah') ? '3' : 
                      p.name.includes('Jane') ? 'me' : null);
                    toggleProfilePanel(id);
                  }}
                  className="w-full group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-all duration-200 border border-transparent hover:border-white/[0.02]"
                >
                  <div className="relative shrink-0">
                    <Avatar src={p.avatar} alt={p.name} size="sm" className="h-9 w-9 ring-1 ring-white/[0.04]" />
                    <span className={clsx(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-bg-deep bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    )} />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[13px] font-bold text-foreground/70 group-hover:text-foreground transition-colors truncate">{p.name}</span>
                    <span className="text-[10px] font-semibold text-foreground/20 tracking-tight uppercase tracking-[0.05em]">Member</span>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <MoreVertical size={14} className="text-foreground/30" />
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'threads' && (
            <motion.div
              key="threads"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-2 p-2"
            >
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveThread(t.id)}
                  className="group p-3 rounded-2xl bg-white/[0.04] border border-white/[0.03] hover:border-primary/20 transition-all cursor-pointer space-y-2.5"
                >
                  {/* Header: avatar + name + time */}
                  <div className="flex items-center gap-2">
                    <img
                      src={t.avatar}
                      alt={t.user}
                      className="h-5 w-5 rounded-full shrink-0 object-cover ring-1 ring-white/[0.06]"
                    />
                    <span className="text-[11px] font-semibold text-foreground/50">{t.user}</span>
                    <span className="text-[10px] text-foreground/20 font-medium ml-auto shrink-0">{t.time}</span>
                  </div>

                  {/* Thread title */}
                  <h4 className="text-[13px] font-bold text-foreground/80 group-hover:text-primary transition-colors leading-snug">
                    {t.title}
                  </h4>

                  {/* Last message — full text, no clamp */}
                  <p className="text-[11px] text-foreground/35 leading-relaxed font-medium border-l-2 border-white/[0.06] pl-2.5">
                    {t.lastMsg}
                  </p>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-4 py-6 border border-dashed border-white/10 text-foreground/20 hover:text-primary hover:border-primary/30 transition-all gap-2 text-[11px] font-black uppercase tracking-widest">
                <ChevronRight size={14} />
                View all threads
              </Button>
            </motion.div>
          )}

          {activeTab === 'pinned' && (
            <motion.div
              key="pinned"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3 p-2"
            >
              {displayPinnedMessages.length > 0 ? (
                displayPinnedMessages.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] transition-all group cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                      <Pin size={12} className="rotate-45" />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar src={p.user.avatar} alt={p.user.name} size="sm" className="h-8 w-8" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-foreground/70">{p.user.name}</span>
                        <span className="text-[9px] font-medium text-foreground/20">{p.time}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-foreground/50 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-3">
                      "{p.content}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.02] flex items-center justify-center mb-4 ring-1 ring-white/[0.05]">
                    <Pin size={20} className="text-foreground/10" />
                  </div>
                  <h4 className="text-[13px] font-bold text-foreground/40 mb-1">No pinned messages</h4>
                  <p className="text-[11px] text-foreground/20 font-medium">Messages you pin will appear here for everyone to see.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
