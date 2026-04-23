import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Hash, PanelRight,
  Flame, Info, Pin, Trash2, Edit3, Download, FileText, Reply, MessageSquare,
  Users, Globe, Loader2, UserPlus, AlertTriangle, XCircle
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore, type Participant } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import type { Message } from '../../store/useMessagesStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
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
  const setActiveThread = useAppStore((state) => state.setActiveThread);
  const setRightPanelTab = useAppStore((state) => state.setRightPanelTab);

  const { user } = useAuthStore();
  const { 
    fetchMessages, 
    isLoading,
    cursors,
    markAsRead,
    readReceipts,
    joinRoom
  } = useMessagesStore();
  
  const { 
    friends, 
    pendingIncoming, 
    pendingOutgoing,
    sendRequest, 
    acceptRequest, 
    declineRequest,
    cancelRequest 
  } = useFriendsStore();

  const conversation = useConversationsStore(state => 
    activeConversationId ? state.conversations.find(c => c.id === activeConversationId) : null
  );


  // Recipient check for DMs
  const recipient = useMemo(() => {
    if (conversation?.type !== 'DIRECT') return null;
    return conversation.participants?.find(p => p.user?.id !== user?.id)?.user;
  }, [conversation, user?.id]);

  const isFriend = useMemo(() => {
    if (!recipient) return false;
    return friends.some(f => f.id === recipient.id);
  }, [recipient, friends]);

  const isPendingRequest = useMemo(() => {
    if (!recipient) return false;
    return pendingOutgoing.some(r => r.receiverId === recipient.id) || 
           pendingIncoming.some(r => r.senderId === recipient.id);
  }, [recipient, pendingOutgoing, pendingIncoming]);

  // Check if there is a pending message request for this conversation
  const incomingRequest = useMemo(() => {
    if (!activeConversationId || !conversation || conversation.type !== 'DIRECT') return null;
    const otherParticipant = conversation.participants?.find(p => p.user?.id !== user?.id);
    if (!otherParticipant) return null;
    return pendingIncoming.find(req => req.senderId === otherParticipant.user?.id);
  }, [pendingIncoming, activeConversationId, conversation, user]);

  const allMessages = useMessagesStore(state => state.messages);
  const localHiddenIds = useMessagesStore(state => state.localHiddenIds);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const { fetchPreview, joinChannel } = useConversationsStore();

  const messages = useMemo(() => {
    const msgs = activeConversationId ? allMessages[activeConversationId] || [] : [];
    return msgs.filter(m => !localHiddenIds.has(m.id));
  }, [activeConversationId, allMessages, localHiddenIds]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const outgoingRequest = useMemo(() => {
    if (!recipient) return null;
    return pendingOutgoing.find(r => r.receiverId === recipient.id);
  }, [recipient, pendingOutgoing]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      const conv = useConversationsStore.getState().conversations.find(c => c.id === activeConversationId);
      if (conv) {
        setPreview(null);
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
      } else {
        // Not a member, fetch preview
        fetchPreview(activeConversationId).then(setPreview);
      }
    }
  }, [activeConversationId, fetchMessages, markAsRead, joinRoom, fetchPreview]);


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
  
  if (preview) return (
    <ChannelPreview 
      channel={preview} 
      onJoin={async () => {
        const success = await joinChannel(preview.id);
        if (success) setPreview(null);
      }} 
    />
  );

  if (!conversation) return null;

  const onlineParticipants = conversation.participants?.filter(p => p.user?.status !== 'OFFLINE') || [];

  return (
    <div className="flex flex-col h-full bg-transparent relative selection:bg-primary/20">
      {/* Header */}
      <header className="flex h-[64px] items-center justify-between border-b border-white/[0.03] px-4 md:px-10 shrink-0 bg-bg-deep/90 z-50 sticky top-0 shadow-[0_8px_24px_rgba(0,0,0,0.22)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => conversation.type === 'DIRECT' ? (recipient && toggleProfilePanel(recipient.id)) : setActiveView('info')}
            className="flex items-center gap-4 cursor-pointer group/header-title active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              {conversation.type === 'DIRECT' ? (
                <Avatar 
                  src={recipient?.avatar} 
                  size="sm" 
                  className="h-10 w-10 shadow-lg group-hover/header-title:scale-105 transition-all duration-300"
                />
              ) : (
                <div className="w-1 h-4 bg-primary rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
              )}
              <div className="flex flex-col text-left pl-3 border-l border-white/10 shadow-[-8px_0_16px_-12px_rgba(99,102,241,0.55)]">
                <h2 className="font-semibold text-foreground/90 text-[15px] md:text-[18px] tracking-tight leading-none group-hover/header-title:text-foreground transition-all duration-300 mb-1.5 uppercase text-left truncate max-w-[140px] sm:max-w-none">
                  {conversation.type !== 'DIRECT' && '# '}{conversation.name || conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'Unknown'}
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
          {conversation.type !== 'DIRECT' && onlineParticipants.length > 0 && (
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
                      className="h-6 w-6 transition-all !rounded-full cursor-pointer hover:scale-110"
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

          {conversation.type === 'DIRECT' && (
            <div className="flex items-center gap-1 mr-2">
              {!isFriend && recipient && (
                <>
                  {outgoingRequest ? (
                    <Button 
                      variant="ghost" 
                      className="px-3 py-1.5 h-auto rounded-xl bg-white/5 text-foreground/40 hover:bg-rose-500/10 hover:text-rose-500 transition-all flex items-center gap-2 group/cancel-btn border border-white/[0.05]"
                      onClick={() => cancelRequest(outgoingRequest.id)}
                    >
                      <XCircle size={14} className="group-hover/cancel-btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Cancel Request</span>
                    </Button>
                  ) : !isPendingRequest ? (
                    <Button 
                      variant="ghost" 
                      className="px-3 py-1.5 h-auto rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-2 group/add-btn shadow-glow-sm"
                      onClick={() => sendRequest(recipient.username)}
                    >
                      <UserPlus size={14} className="group-hover/add-btn:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Add Friend</span>
                    </Button>
                  ) : null}
                </>
              )}
              
              <Button 
                variant="ghost" 
                className="p-2 h-auto rounded-xl hover:bg-rose-500/5 text-foreground/25 hover:text-rose-500 transition-all group/del-btn" 
                onClick={() => setShowDeleteModal(true)}
                title="Delete Conversation"
              >
                <Trash2 size={17} className="group-hover/del-btn:scale-110 transition-transform" />
              </Button>
            </div>
          )}

          {conversation.type !== 'DIRECT' && (
            <>
              <Button variant="ghost" className="p-2 h-auto rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" onClick={() => setActiveView('info')}>
                <Info size={17} />
              </Button>
              <div className="w-px h-4 bg-white/[0.03] mx-0.5" />
              <Button variant="ghost" className="p-2 h-auto flex rounded-xl hover:bg-white/5 text-foreground/25 hover:text-primary transition-all" onClick={toggleRightPanel}>
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
        <div className="max-w-none w-full px-3 md:px-8 pt-0 pb-0 flex-1 flex flex-col">
          <div className="flex-1" />
          
          {/* Channel Start Intro */}
          <div className="flex flex-col items-start text-left mb-6 px-4 pt-8">
            <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-white/[0.05] shadow-[0_4px_20px_rgba(99,102,241,0.08)]">
              {conversation.type === 'DIRECT' ? (
                <Avatar src={conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.avatar} size="md" />
              ) : (
                <Hash size={24} className="text-primary/60" />
              )}
            </div>
            <h4 className="text-[20px] font-medium text-foreground/75 tracking-tight mb-2 normal-case">
              {conversation.type === 'DIRECT' ? (conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'Private Chat') : `#${conversation.name}`}
            </h4>
            <p className="text-[13px] text-foreground/30 font-medium max-w-xl leading-relaxed">
              {conversation.description || (conversation.type === 'DIRECT' ? `This is the beginning of your message history.` : `This is the start of the #${conversation.name} channel.`)}
            </p>
            <div className="h-px w-full bg-white/10 shadow-[0_1px_10px_rgba(0,0,0,0.35)] mt-3 mb-3" />
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
                  onImageClick={(url, name) => setSelectedImage({ url, name })}
                  readers={conversation.participants
                    ?.filter(p => p.user?.id !== user?.id && readReceipts[activeConversationId]?.[p.user.id] === msg.id)
                    .map(p => p.user)}
                  setActiveThread={setActiveThread}
                  setRightPanelTab={setRightPanelTab}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Input or Request Bar */}
      <div className="relative border-t border-white/[0.05] bg-bg-deep/50 backdrop-blur-xl">
        {conversation.status === 'PENDING' ? (
          user?.id === conversation.creatorId ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-3 px-6 py-2 bg-white/[0.02] border-b border-white/[0.05]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                  Waiting for {conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'them'} to accept your message request
                </span>
                <span className="ml-auto text-[9px] font-black text-foreground/10 uppercase tracking-widest">Pending</span>
              </div>
              <MessageInput 
                channelName={conversation.name || conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'this conversation'} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 bg-black/20 border-t border-white/[0.05]">
              <div className="text-center">
                <h4 className="text-[14px] font-black text-foreground uppercase tracking-tight">
                  Message Request from {conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'Someone'}
                </h4>
                <p className="text-[12px] font-medium text-foreground/30 mt-1">
                  Accept to start chatting. They'll see your status and when you've read messages.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => useConversationsStore.getState().resolveRequest(conversation.id, 'ACCEPT')} 
                  className="h-9 px-6 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-[10px]"
                >
                  Accept
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => useConversationsStore.getState().resolveRequest(conversation.id, 'REJECT')} 
                  className="h-9 px-6 rounded-lg bg-white/[0.05] text-foreground/40 hover:text-rose-500 font-bold uppercase tracking-widest text-[10px]"
                >
                  Ignore
                </Button>
              </div>
            </div>
          )
        ) : incomingRequest ? (
          <div className="flex flex-col items-center gap-4 p-6 bg-black/10">
            <div className="text-center">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground/60">Friend Request Received</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => acceptRequest(incomingRequest.id)} className="h-9 px-6 rounded-lg bg-primary text-white font-bold uppercase tracking-widest text-[10px]">
                Accept
              </Button>
              <Button variant="ghost" onClick={() => declineRequest(incomingRequest.id)} className="h-9 px-6 rounded-lg bg-white/[0.05] text-foreground/30 hover:text-rose-500 font-bold uppercase tracking-widest text-[10px]">
                Decline
              </Button>
            </div>
          </div>
        ) : (
          <MessageInput 
            channelName={conversation.name || conversation.participants?.find(p => p.user?.id !== user?.id)?.user?.username || 'this conversation'} 
          />
        )}
      </div>

      {/* Delete Conversation Confirmation Modal */}
      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        className="max-w-[420px] bg-card border border-border"
      >
        <div className="flex flex-col items-center text-center p-2">
          <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 ring-1 ring-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
            <AlertTriangle className="text-rose-500 h-8 w-8" />
          </div>
          
          <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-2">Clear History?</h3>
          <p className="text-[13px] font-medium text-foreground/30 leading-relaxed mb-8">
            This will permanently remove all messages for you. This action cannot be reversed.
          </p>
          
          <div className="flex flex-col w-full gap-2">
            <Button 
              className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-glow-sm transition-all active:scale-95"
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await useConversationsStore.getState().deleteConversation(conversation.id);
                  setShowDeleteModal(false);
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm Clear'}
            </Button>
            <Button 
              variant="ghost" 
              className="w-full h-12 text-foreground/40 hover:text-foreground font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-white/5 transition-all"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Lightbox */}
      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)}
        className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none overflow-visible"
        showCloseButton={true}
      >
        {selectedImage && (
          <div className="relative flex flex-col items-center gap-4">
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage.url} 
              alt={selectedImage.name}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain ring-1 ring-white/10"
            />
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
               <span className="text-white font-black uppercase tracking-widest text-[11px]">{selectedImage.name}</span>
               <div className="w-px h-3 bg-white/20" />
               <a 
                 href={selectedImage.url} 
                 download={selectedImage.name}
                 className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 text-[11px] font-black uppercase tracking-widest"
               >
                 <Download size={14} /> Download
               </a>
            </div>
          </div>
        )}
      </Modal>
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
  onImageClick?: (url: string, name: string) => void;
  readers?: Participant[];
  setActiveThread: (id: string | null) => void;
  setRightPanelTab: (tab: 'members' | 'threads' | 'pinned') => void;
}> = ({ message, isOwn, delay, onImageClick, readers = [], setActiveThread, setRightPanelTab }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const { reactToMessage, deleteMessage, pinMessage, editMessage, hideMessage, setReplyTo } = useMessagesStore();

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

        {/* Reply Thread Header */}
        {message.parentId && (
          <div className="flex items-center gap-2 mb-1.5 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] max-w-full">
            <Reply size={10} className="text-primary/40 shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-black text-primary/60 uppercase truncate shrink-0">
                Replied to
              </span>
              <span className="text-[10px] font-bold text-foreground/40 truncate italic">
                {useMessagesStore.getState().messages[message.conversationId]?.find(m => m.id === message.parentId)?.content || 'Original message'}
              </span>
            </div>
          </div>
        )}

        <div className={clsx(
          'relative text-[14px] font-bold leading-relaxed shadow-md border transition-all duration-200', 
          message.type === 'IMAGE' && !message.content 
            ? 'p-0 bg-transparent border-transparent shadow-none'
            : clsx(
                'px-4 py-2.5 rounded-2xl border',
                isOwn 
                  ? 'bg-primary text-white rounded-tr-sm border-primary/20' 
                  : 'bg-white/[0.04] text-foreground rounded-tl-sm border-transparent'
              )
        )}>
          {message.isDeleted ? (
            <span className="italic opacity-30">This message has been deleted</span>
          ) : (
            <div className="flex flex-col gap-2">
              {message.type === 'IMAGE' && message.fileUrl && (
                <div className="relative group/img overflow-hidden rounded-2xl max-w-sm">
                  <img 
                    src={message.fileUrl} 
                    alt={message.fileName || 'Image'} 
                    className={clsx(
                      "max-h-[400px] w-auto object-contain cursor-zoom-in transition-all duration-500 group-hover:scale-[1.02] active:scale-[0.98]",
                      !message.content && "shadow-2xl"
                    )}
                    onClick={() => onImageClick?.(message.fileUrl!, message.fileName || 'image.png')}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-between">
                    <span className="text-[10px] text-white/80 font-bold truncate max-w-[70%] uppercase tracking-widest">{message.fileName}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement('a');
                        a.href = message.fileUrl!;
                        a.download = message.fileName || 'image.png';
                        a.click();
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all pointer-events-auto"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                </div>
              )}

              {message.type === 'FILE' && message.fileUrl && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/10 border border-white/5 group/file min-w-[200px] max-w-xs">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/5 text-primary group-hover/file:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-foreground/90 truncate uppercase tracking-tight">{message.fileName}</span>
                    <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">
                      {message.fileSize ? `${(message.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                    </span>
                  </div>
                  <a 
                    href={message.fileUrl} 
                    download={message.fileName}
                    className="ml-auto p-2 rounded-lg hover:bg-white/10 text-foreground/20 hover:text-primary transition-all"
                  >
                    <Download size={16} />
                  </a>
                </div>
              )}

              {message.content && (
                <div className={clsx(
                  isEditing ? 'w-full' : '',
                  'whitespace-pre-wrap'
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
                      {message.content}
                      {message.isEdited && (
                        <span className="ml-2 text-[9px] opacity-30 uppercase font-black">(edited)</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {message.isPinned && (
             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 pinMessage(message.id, message.conversationId);
               }}
               className="absolute -top-2 flex items-center gap-1 bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md shadow-lg hover:bg-amber-600 transition-colors z-10"
               title="Unpin message"
             >
                <Pin size={8} fill="currentColor" /> PINNED
             </button>
          )}
        </div>

        {/* Reply Count / Thread Link */}
        {!message.parentId && message._count && message._count.replies > 0 && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveThread(message.id);
              // Fallback to ensure tab is set if setActiveThread didn't propagate it correctly
              setRightPanelTab('threads');
            }}
            className={clsx(
              "mt-2 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 group/thread relative z-20",
              isOwn ? "flex-row-reverse self-end mr-1" : "flex-row self-start ml-1"
            )}
          >
            <div className="flex -space-x-2">
              {(() => {
                const repliers = useMessagesStore.getState().messages[message.conversationId]
                  ?.filter(m => m.parentId === message.id)
                  .map(m => m.sender)
                  .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                  .slice(0, 3) || [];
                
                return repliers.length > 0 ? (
                  repliers.map((sender, i) => (
                    <Avatar 
                      key={sender.id}
                      src={sender.avatar} 
                      size="xs" 
                      className="h-4 w-4 ring-2 ring-bg-deep shrink-0" 
                      style={{ zIndex: 10 - i }}
                    />
                  ))
                ) : (
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-bg-deep">
                    <MessageSquare size={8} className="text-primary" />
                  </div>
                );
              })()}
            </div>
            <span className="text-[10px] font-black text-primary/70 uppercase tracking-[0.1em] group-hover/thread:text-primary transition-colors">
              {message._count.replies} {message._count.replies === 1 ? 'reply' : 'replies'}
            </span>
            <div className="w-px h-2.5 bg-white/10" />
            <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest group-hover/thread:text-primary/60">View Thread</span>
          </button>
        )}
        
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={clsx('absolute bottom-full mb-2 flex items-center gap-1 p-1 bg-card border border-border rounded-xl shadow-2xl z-[100]', isOwn ? 'right-0' : 'left-0')}>
              {quickReactions.slice(0, 4).map(emoji => (
                <button key={emoji} onClick={() => reactToMessage(message.id, message.conversationId, emoji)} className="p-1.5 rounded-lg hover:bg-white/10 transition-all">{emoji}</button>
              ))}
              <div className="w-px h-3 bg-white/10 mx-1" />
              <button 
                onClick={() => setReplyTo(message)} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/30 hover:text-primary transition-all"
                title="Reply"
              >
                <Reply size={13} />
              </button>
              {isOwn && (
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }} 
                  className="p-1.5 rounded-lg hover:bg-white/10 text-foreground/30 hover:text-primary transition-all"
                >
                  <Edit3 size={13} />
                </button>
              )}
              <button onClick={() => pinMessage(message.id, message.conversationId)} className={clsx("p-1.5 rounded-lg hover:bg-white/10", message.isPinned ? "text-amber-400" : "text-foreground/30")}>
                <Pin size={13} />
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)} 
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  isOwn ? "hover:bg-rose-500/20 text-rose-500" : "hover:bg-white/10 text-foreground/30 hover:text-rose-500"
                )}
                title="Delete message"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="bg-card border border-border max-w-[340px] p-6 rounded-3xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-rose-500 mb-3">
            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h3 className="text-[17px] font-black tracking-tight text-white m-0 uppercase">Delete Message</h3>
          </div>
          
          <p className="text-[13px] text-foreground/60 mb-6 leading-relaxed font-medium">
            {isOwn 
              ? "Do you want to permanently delete this message for everyone, or just hide it for yourself?"
              : "Are you sure you want to hide this message? It will be removed from your view but remain visible to others."}
          </p>

          <div className="flex flex-col gap-2">
            {isOwn && (
              <Button 
                onClick={() => {
                  deleteMessage(message.id, message.conversationId);
                  setShowDeleteModal(false);
                }}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 rounded-xl text-[13px]"
              >
                Delete for everyone
              </Button>
            )}
            
            <Button 
              variant="ghost"
              onClick={() => {
                hideMessage(message.id);
                setShowDeleteModal(false);
              }}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-bold h-11 border border-white/5 rounded-xl text-[13px]"
            >
              Delete just for me
            </Button>

            <Button 
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              className="w-full hover:bg-white/5 text-foreground/50 h-10 mt-1 rounded-xl text-[12px] font-bold uppercase tracking-wider"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

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

const ChannelPreview: React.FC<{ 
  channel: any; 
  onJoin: () => Promise<void>;
}> = ({ channel, onJoin }) => {
  const [isJoining, setIsJoining] = useState(false);

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-bg-deep/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      <div className="relative z-10 flex flex-col items-center max-w-lg">
        <div className="h-24 w-24 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-3xl flex items-center justify-center mb-8 shadow-glow-sm ring-1 ring-white/10 overflow-hidden">
          {channel.heroImage ? (
            <img src={channel.heroImage} className="w-full h-full object-cover" alt="hero" />
          ) : (
            <Hash size={40} className="text-primary/60" />
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Hash size={20} className="text-primary/40" />
          <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">{channel.name}</h3>
        </div>
        
        <div className="flex items-center gap-3 mb-6 px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-full">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-foreground/30" />
            <span className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">
              {channel._count?.participants || 0} Members
            </span>
          </div>
          <div className="w-px h-2.5 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Globe size={12} className="text-primary/40" />
            <span className="text-[11px] font-black text-primary/60 uppercase tracking-widest">
              {channel.isPublic ? 'Public' : 'Approval Required'}
            </span>
          </div>
        </div>

        <p className="text-[15px] text-foreground/40 leading-relaxed font-bold mb-10 italic">
          "{channel.description || 'Welcome to this community. Discover, discuss, and build together.'}"
        </p>

        <Button 
          onClick={async () => {
            setIsJoining(true);
            try { await onJoin(); } finally { setIsJoining(false); }
          }}
          disabled={isJoining}
          className="h-14 px-12 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[13px] shadow-glow hover:scale-105 transition-all"
        >
          {isJoining ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            channel.isPublic ? 'Join Channel' : 'Request to Join'
          )}
        </Button>

        <p className="mt-6 text-[10px] font-black text-foreground/15 uppercase tracking-[0.15em] max-w-[280px]">
          By joining, you agree to follow the community guidelines and channel rules.
        </p>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-primary/2 tracking-widest flex items-center justify-center overflow-hidden rotate-12 select-none pointer-events-none">
        <Hash size={500} className="opacity-[0.03] text-primary" />
      </div>
    </div>
  );
};
