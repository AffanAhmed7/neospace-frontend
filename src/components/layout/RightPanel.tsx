import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Pin, Search, 
  Hash, ArrowLeft, Send, Edit3
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';

export const RightPanel: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const activeThreadId = useAppStore((state) => state.activeThreadId);
  const activeTab = useAppStore((state) => state.rightPanelTab);
  const setActiveThread = useAppStore((state) => state.setActiveThread);
  const setRightPanelTab = useAppStore((state) => state.setRightPanelTab);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);

  
  const { user } = useAuthStore();
  const { getConversationById, updateConversation } = useConversationsStore();

  const { messages: allMessages, sendMessage } = useMessagesStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [threadInput, setThreadInput] = useState('');

  const conversation = useMemo(() => 
    activeConversationId ? getConversationById(activeConversationId) : null
  , [activeConversationId, getConversationById]);

  const isAdmin = useMemo(() => {
    if (!conversation || !user) return false;
    return conversation.participants.find(p => p.user.id === user.id)?.role === 'ADMIN' || conversation.creatorId === user.id;
  }, [conversation, user]);

  const messages = useMemo(() => 
    activeConversationId ? allMessages[activeConversationId] || [] : []
  , [activeConversationId, allMessages]);

  
  const pinnedMessages = useMemo(() => messages.filter(m => m.isPinned), [messages]);
  const threads = useMemo(() => {
    // Basic implementation: group messages that have replies
    const msgIdsWithReplies = new Set(messages.map(m => (m as any).parentId).filter(Boolean));
    return messages.filter(m => msgIdsWithReplies.has(m.id));
  }, [messages]);

  const threadReplies = useMemo(() => {
    if (!activeThreadId) return [];
    return messages.filter(m => (m as any).parentId === activeThreadId);
  }, [messages, activeThreadId]);

  const activeThread = useMemo(() => 
    messages.find(m => m.id === activeThreadId)
  , [messages, activeThreadId]);

  const handleEdit = () => {
    if (conversation) {
      setEditValue(conversation.description || '');
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (activeConversationId) {
      await updateConversation(activeConversationId, { description: editValue });
      setIsEditing(false);
    }
  };

  const handleSendReply = async () => {
    if (!threadInput.trim() || !activeConversationId || !activeThreadId) return;
    await sendMessage({
      conversationId: activeConversationId,
      content: threadInput.trim(),
      parentId: activeThreadId
    });
    setThreadInput('');
  };

  const tabs = [
    ...(conversation?.type === 'DIRECT' ? [] : [{ id: 'members', icon: Users, label: 'Members', count: conversation?.participants.length || 0 }]),
    { id: 'threads', icon: MessageSquare, label: 'Threads', count: threads.length },
    { id: 'pinned',  icon: Pin,           label: 'Pinned',  count: pinnedMessages.length },
  ] as const;

  if (activeThreadId && activeThread) {
    return (
      <div className="flex flex-col h-full bg-bg-deep/90 border-l border-border w-full max-w-[320px] shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 px-6 h-[64px] bg-bg-deep/90 border-b border-white/[0.03] shrink-0">
          <button onClick={() => setActiveThread(null)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 text-foreground/30 hover:text-primary transition-all shrink-0">
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-foreground/15 leading-none mb-1.5">
              <span>{conversation?.name || 'Channel'}</span>
              <span className="opacity-40">/</span>
              <span className="text-primary/40 truncate">Thread</span>
            </div>
            <h3 className="text-[15px] font-bold text-foreground tracking-tight leading-none truncate">{activeThread.content?.slice(0, 20)}...</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar-compact p-4 space-y-6">
          <div className="relative p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-2.5">
              <Avatar src={activeThread.sender.avatar} size="sm" />
              <span className="text-[11px] font-bold text-primary">{activeThread.sender.username}</span>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">{activeThread.content}</p>
          </div>

          <div className="h-px bg-white/[0.03] w-full" />

          <div className="space-y-4">
            {threadReplies.map((reply) => (
              <div key={reply.id} className="flex gap-3 px-1">
                <Avatar src={reply.sender.avatar} size="sm" className="mt-0.5" />
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[11px] font-bold text-foreground/50">{reply.sender.username}</span>
                    <span className="text-[10px] font-medium text-foreground/20">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[12px] text-foreground/65 leading-relaxed font-medium">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border-t border-white/[0.03]">
          <div className="relative flex items-center gap-2 group">
            <input 
              type="text" 
              value={threadInput}
              onChange={(e) => setThreadInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Reply in thread..." 
              className="w-full h-10 pl-4 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.05] focus:border-primary/20 focus:bg-white/[0.05] transition-all outline-none text-[12px] font-medium placeholder:text-foreground/20"
            />
            <button onClick={handleSendReply} className="absolute right-2 p-1.5 text-foreground/20 hover:text-primary transition-all">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-bg-deep/90 border-l border-border w-full max-w-[320px] shrink-0 overflow-hidden">
      <div className="flex px-3 h-[64px] bg-bg-deep/90 border-b border-white/[0.03] gap-1 shrink-0 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setRightPanelTab(tab.id as 'members' | 'threads' | 'pinned')}

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

      {conversation && conversation.type !== 'DIRECT' && (
        <div className="px-4 py-5 border-b border-white/[0.03] space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/50 flex items-center gap-2">
              <Hash size={14} className="text-primary/60" />
              About Channel
            </h3>
            {!isEditing && isAdmin && (
              <button 
                onClick={handleEdit}
                className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/20 hover:text-primary transition-all"
                title="Edit Description"
              >
                <Edit3 size={14} />
              </button>
            )}
          </div>

          <div>
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
                  <button onClick={() => setIsEditing(false)} className="h-8 px-3 rounded-lg text-[11px] font-bold text-foreground/30 hover:text-foreground">Cancel</button>
                  <button onClick={handleSave} className="h-8 px-4 rounded-lg text-[11px] font-bold bg-primary text-white font-black uppercase tracking-widest">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-[13px] text-foreground/50 leading-relaxed font-medium">
                {conversation.description || 'No description set for this channel.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar-compact px-2 pb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'members' && (
            <motion.div key="members" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="px-3 py-2 mb-1">
                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.15em]">Participants — {conversation?.participants.length || 0}</span>
              </div>
              {conversation?.participants.map((p) => (
                <button
                  key={p.user.id}
                  onClick={() => toggleProfilePanel(p.user.id)}
                  className="w-full group flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-all duration-200"
                >
                  <div className="relative shrink-0">
                    <Avatar src={p.user.avatar} alt={p.user.username} size="sm" className="h-9 w-9 ring-1 ring-white/[0.04]" />
                    <span className={clsx(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-bg-deep",
                      p.user.status === 'OFFLINE' ? "bg-white/20" : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    )} />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[13px] font-bold text-foreground/70 group-hover:text-foreground transition-colors truncate">{p.user.username}</span>
                    <span className="text-[10px] font-semibold text-foreground/20 uppercase tracking-[0.05em]">{p.role}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {activeTab === 'threads' && (
            <motion.div key="threads" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2 p-2">
              {threads.map((t) => (
                <div key={t.id} onClick={() => setActiveThread(t.id)} className="group p-3 rounded-2xl bg-white/[0.04] border border-white/[0.03] hover:border-primary/20 transition-all cursor-pointer space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Avatar src={t.sender.avatar} size="sm" />
                    <span className="text-[11px] font-semibold text-foreground/50">{t.sender.username}</span>
                  </div>
                  <h4 className="text-[13px] font-bold text-foreground/80 group-hover:text-primary transition-colors leading-snug truncate">{t.content}</h4>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'pinned' && (
            <motion.div key="pinned" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 p-2">
              {pinnedMessages.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20"><Pin size={12} className="rotate-45" /></div>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={p.sender.avatar} alt={p.sender.username} size="sm" className="h-8 w-8" />
                    <span className="text-[11px] font-bold text-foreground/70">{p.sender.username}</span>
                  </div>
                  <p className="text-[12px] text-foreground/50 leading-relaxed font-medium italic border-l-2 border-primary/20 pl-3">"{p.content}"</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
