import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Hash, PanelRight,
  Flame, Info, Pin, Trash2, Edit3
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore, type Participant } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import type { Message } from '../../store/useMessagesStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';
import { MessageInput } from './MessageInput';

const quickReactions = ['👍', '❤️', '😂', '🔥', '🤯', '🎉', '👀', '✨', '🫡', '💯', '🚀', '🤔'];

export const ChatArea: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);

  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);

  const { user } = useAuthStore();
  const { getConversationById } = useConversationsStore();
  const { 
    fetchMessages, 
    isLoading,
    cursors,
    markAsRead,
    readReceipts,
    joinRoom
  } = useMessagesStore();
  
  const { pendingIncoming, acceptRequest, declineRequest } = useFriendsStore();

  const conversation = useMemo(() => 
    activeConversationId ? getConversationById(activeConversationId) : null
  , [activeConversationId, getConversationById]);

  // Check if there is a pending request for this conversation
  const incomingRequest = useMemo(() => {
    if (!activeConversationId || conversation?.type !== 'DIRECT') return null;
    const otherParticipant = conversation.participants.find(p => p.user.id !== user?.id);
    if (!otherParticipant) return null;
    return pendingIncoming.find(req => req.senderId === otherParticipant.user.id);
  }, [pendingIncoming, activeConversationId, conversation, user]);

  const { messages: allMessages } = useMessagesStore();
  const messages = activeConversationId ? allMessages[activeConversationId] || [] : [];
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      joinRoom(activeConversationId);
      
      // Mark as read after a short delay
      const timeout = setTimeout(() => {
        const msgs = useMessagesStore.getState().messages[activeConversationId] || [];
        if (msgs.length > 0) {
          markAsRead(activeConversationId, msgs[msgs.length - 1].id);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [activeConversationId, fetchMessages, markAsRead, joinRoom]);


  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages.length]);

  const handleScroll = () => {
    if (!containerRef.current || !activeConversationId) return;
    if (containerRef.current.scrollTop === 0 && !isLoading[activeConversationId] && cursors[activeConversationId]) {
      fetchMessages(activeConversationId, cursors[activeConversationId]!);
    }
  };

  if (!activeConversationId) return <EmptyState onSelect={setActiveConversation} />;
  if (!conversation) return null;

  const onlineParticipants = conversation.participants.filter(p => p.user.status !== 'OFFLINE');

  return (
    <div className="flex flex-col h-full bg-transparent relative selection:bg-primary/20">
      {/* Header */}
      <header className="flex h-[72px] items-center justify-between border-b border-white/[0.03] px-10 shrink-0 bg-bg-deep/90 z-50 sticky top-0 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => conversation.type === 'DIRECT' ? toggleProfilePanel(conversation.participants.find(p => p.user.id !== user?.id)?.user.id) : setActiveView('info')}
            className="flex items-center gap-4 cursor-pointer group/header-title"
          >
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
              <div className="flex flex-col text-left">
                <h2 className="font-black text-foreground text-[19px] tracking-tight leading-none group-hover/header-title:text-glow transition-all duration-300 mb-1.5 uppercase">
                  {conversation.type !== 'DIRECT' && '# '}{conversation.name || conversation.participants.find(p => p.user.id !== user?.id)?.user.username || 'Unknown'}
                </h2>
                <div className="flex items-center gap-1.5 text-[9px] uppercase font-black tracking-[0.2em] text-foreground/20 leading-none">
                  <span className="group-hover/header-title:text-foreground/40 transition-colors">
                    {conversation.type === 'DIRECT' ? 'Direct Message' : 'Public Channel'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onlineParticipants.length > 0 && (
            <div className="flex items-center gap-2.5 mr-1 px-1 transition-all cursor-pointer group">
              <div className="flex -space-x-2.5">
                {onlineParticipants.slice(0, 3).map((p, i) => (
                  <div 
                    key={p.user.id} 
                    className="relative transition-transform duration-300 group-hover:-translate-y-0.5"
                    style={{ zIndex: 10 - i }}
                  >
                    <Avatar
                      src={p.user.avatar}
                      alt={p.user.username}
                      size="sm"
                      className="h-6 w-6 transition-all !rounded-full cursor-pointer hover:ring-2 hover:ring-primary/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleProfilePanel(p.user.id);
                      }}
                    />
                  </div>
                ))}
                {onlineParticipants.length > 3 && (
                  <div className="relative flex items-center justify-center h-6 w-6 rounded-full bg-white/[0.05] text-[9px] font-black tracking-tighter text-foreground z-[5]">
                    +{onlineParticipants.length - 3}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start -space-y-0.5">
                <span className="text-[11px] font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                  {onlineParticipants.length}
                </span>
                <span className="text-[8px] font-black text-foreground/20 uppercase tracking-[0.1em]">Online</span>
              </div>
            </div>
          )}

          {conversation.type !== 'DIRECT' && (
            <>
              <Button variant="ghost" className="p-2 h-auto rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" onClick={() => setActiveView('info')}>
                <Info size={17} />
              </Button>
              <div className="w-px h-4 bg-white/[0.03] mx-0.5 hidden lg:block" />
              <Button variant="ghost" className="p-2 h-auto hidden lg:flex rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" onClick={toggleRightPanel}>
                <PanelRight size={17} />
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-grow overflow-y-auto relative flex flex-col min-h-0 custom-scrollbar-compact"
      >
        <div className="max-w-none w-full px-8 pt-0 pb-0 flex-1 flex flex-col">
          <div className="flex-1" />
          
          {/* Channel Start Intro */}
          <div className="flex flex-col items-start text-left mb-6 px-4 pt-8">
            <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-white/[0.05] shadow-[0_4px_20px_rgba(99,102,241,0.08)]">
              {conversation.type === 'DIRECT' ? (
                <Avatar src={conversation.participants.find(p => p.user.id !== user?.id)?.user.avatar} size="md" />
              ) : (
                <Hash size={24} className="text-primary/60" />
              )}
            </div>
            <h4 className="text-xl font-black text-foreground tracking-tighter mb-1.5 uppercase tracking-wide">
              {conversation.type === 'DIRECT' ? `Beginning of your conversation with ${conversation.participants.find(p => p.user.id !== user?.id)?.user.username || 'this user'}` : `Welcome to #${conversation.name}`}
            </h4>
            <p className="text-[13px] text-foreground/40 font-medium max-w-xl leading-relaxed">
              {conversation.description || "This is the very beginning of the history for this connection."}
            </p>
            <div className="h-px w-full bg-gradient-to-r from-white/[0.05] to-transparent mt-8 mb-4" />
          </div>

          {/* Messages */}
          <div className="space-y-2 relative overflow-visible pb-4">
            <AnimatePresence initial={false}>
              {messages.map((msg: Message, i: number) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg}
                  isOwn={msg.senderId === user?.id}
                  delay={i * 0.02} 
                  readers={conversation.participants
                    .filter(p => p.user.id !== user?.id && readReceipts[activeConversationId]?.[p.user.id] === msg.id)
                    .map(p => p.user)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input or Request Bar */}
      <div className="relative border-t border-white/[0.05] bg-bg-deep/50 backdrop-blur-xl">
        {incomingRequest ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 p-8">
            <div className="flex flex-col items-center gap-2 text-center max-w-md">
              <h4 className="text-[14px] font-black uppercase tracking-widest text-foreground/80">Friend Request Received</h4>
              <p className="text-[12px] font-medium text-foreground/25 leading-relaxed">
                "{conversation.participants.find(p => p.user.id !== user?.id)?.user.username} wants to be your friend. Accept to start chatting."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => acceptRequest(incomingRequest.id)} className="h-11 px-8 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-glow-sm">
                Accept Request
              </Button>
              <Button variant="ghost" onClick={() => declineRequest(incomingRequest.id)} className="h-11 px-6 rounded-xl border border-white/5 text-foreground/30 hover:text-rose-500 font-black uppercase tracking-widest text-[11px]">
                Decline
              </Button>
            </div>
          </motion.div>
        ) : (
          <MessageInput 
            channelName={conversation.name || conversation.participants.find(p => p.user.id !== user?.id)?.user.username || 'this conversation'} 
          />

        )}
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onSelect: (id: string) => void }> = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center mb-8 shadow-glow-sm">
        <Flame size={32} className="text-primary/70" />
      </div>
      <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">PICK UP WHERE YOU LEFT OFF</h3>
      <p className="text-[14px] text-foreground/30 leading-relaxed font-medium">Select a channel or friend from the sidebar to start a conversation.</p>
    </div>
  );
};

const MessageBubble: React.FC<{ 
  message: Message; 
  isOwn: boolean; 
  delay: number;
  readers?: Participant[];
}> = ({ message, isOwn, delay, readers = [] }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || '');
  
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const { reactToMessage, deleteMessage, pinMessage, editMessage } = useMessagesStore();

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await editMessage(message.id, message.conversationId, editContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(message.content || '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={clsx('group relative flex gap-3 px-2 pt-1.5 pb-2 rounded-xl border-none transition-all duration-200 overflow-visible', isOwn ? 'flex-row-reverse' : 'flex-row')}
    >
      <Avatar 
        src={message.sender.avatar} 
        size="sm" 
        alt={message.sender.username} 
        className="mt-0.5 shrink-0 h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
        onClick={() => toggleProfilePanel(message.sender.id)}
      />
      <div className={clsx('relative flex flex-col max-w-[75%] min-w-0', isOwn ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[12px] font-black tracking-tight text-foreground/50 cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleProfilePanel(message.sender.id)}>
            {message.sender.username}
          </span>
          <span className="text-[10px] text-foreground/15 font-black uppercase tracking-widest">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={clsx(
          'relative px-4 py-2.5 rounded-2xl text-[14px] font-bold leading-relaxed shadow-md border transition-all duration-200', 
          isOwn 
            ? 'bg-primary text-white rounded-tr-sm border-primary/20' 
            : 'bg-white/[0.04] text-foreground rounded-tl-sm border-transparent'
        )}>
          {isEditing ? (
            <textarea
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-0 outline-none text-white resize-none min-h-[1.5em] p-0"
              rows={Math.max(1, editContent.split('\n').length)}
            />
          ) : (
            <>
              {message.isDeleted ? (
                <span className="italic opacity-30">This message has been deleted</span>
              ) : (
                message.content
              )}
              {message.isEdited && !message.isDeleted && (
                <span className="ml-2 text-[9px] opacity-30 uppercase font-black">(edited)</span>
              )}
            </>
          )}
          {message.isPinned && (
             <div className="absolute -top-2 flex items-center gap-1 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md shadow-lg">
                <Pin size={8} fill="currentColor" /> PINNED
             </div>
          )}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-1 px-1">
             <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Esc to cancel</span>
             <span className="text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline" onClick={handleEdit}>Save</span>
          </div>
        )}
        
        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {Array.from(new Set(message.reactions.map(r => r.emoji))).map(emoji => {
               const count = message.reactions.filter(r => r.emoji === emoji).length;
               return (
                 <button 
                   key={emoji}
                   onClick={() => reactToMessage(message.id, message.conversationId, emoji)}
                   className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.05] text-[11px] hover:border-primary/50 transition-all"
                 >
                   <span>{emoji}</span>
                   <span className="text-foreground/40 font-black">{count}</span>
                 </button>
               )
            })}
          </div>
        )}

        {/* Hover Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={clsx('absolute bottom-full mb-2 flex items-center gap-1 p-1 bg-[#0A0A0C] border border-white/[0.1] rounded-xl shadow-2xl z-[100]', isOwn ? 'right-0' : 'left-0')}>
              {quickReactions.slice(0, 4).map(emoji => (
                <button key={emoji} onClick={() => reactToMessage(message.id, message.conversationId, emoji)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">{emoji}</button>
              ))}
              <div className="w-px h-3 bg-white/10 mx-1" />
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setShowActions(false);
                }} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/30 hover:text-primary transition-all"
              >
                <Edit3 size={13} />
              </button>
              <button onClick={() => pinMessage(message.id, message.conversationId)} className={clsx("p-1.5 rounded-lg hover:bg-white/10", message.isPinned ? "text-amber-400" : "text-foreground/30")}>
                <Pin size={13} />
              </button>
              {isOwn && (
                <button onClick={() => deleteMessage(message.id, message.conversationId)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-500 transition-all">
                  <Trash2 size={13} />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Read Receipts */}
      {readers.length > 0 && (
        <div className={clsx('flex -space-x-1.5 mb-1 opacity-60 hover:opacity-100 transition-opacity', isOwn ? 'mr-1' : 'ml-1')}>
          {readers.map((reader) => (
            <Avatar 
              key={reader.id}
              src={reader.avatar}
              size="xs"
              className="h-3.5 w-3.5 ring-1 ring-bg-deep"
              title={`Read by ${reader.username}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
