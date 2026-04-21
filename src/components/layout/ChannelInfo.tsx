import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, Users, ArrowLeft, Plus, 
  Globe, Zap,
  FileText, Image as ImageIcon,
  Download, Camera, X
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useMessagesStore } from '../../store/useMessagesStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { Trash2, UserPlus, ShieldAlert, Edit3 } from 'lucide-react';

export const ChannelInfo: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveView = useAppStore((state) => state.setActiveView);
  
  const { user } = useAuthStore();
  const openConfirm = useAppStore((state) => state.openConfirm);
  const { 
    updateConversation, 
    leaveConversation, 
    addParticipant, 
    promoteToAdmin,
    removeParticipant,
    deleteConversation 
  } = useConversationsStore();
  const { messages: allMessages } = useMessagesStore();
  const { friends } = useFriendsStore();

  const conversation = useConversationsStore((state) => 
    activeConversationId ? state.conversations.find(c => c.id === activeConversationId) : null
  );

  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media');
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(conversation?.description || '');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [customHeroUrl, setCustomHeroUrl] = useState('');
  const [searchFriendQuery, setSearchFriendQuery] = useState('');
  const [joinRequests, setJoinRequests] = useState<any[]>([]);


  const { fetchJoinRequests, resolveJoinRequest } = useConversationsStore();

  const HERO_PRESETS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000',
  ];

  const messages = useMemo(() => 
    activeConversationId ? allMessages[activeConversationId] || [] : []
  , [activeConversationId, allMessages]);


  const mediaFiles = useMemo(() => 
    messages.filter(m => m.type === 'IMAGE' && m.fileUrl)
  , [messages]);

  const docFiles = useMemo(() => 
    messages.filter(m => m.type === 'FILE' && m.fileUrl)
  , [messages]);

  const eligibleFriends = useMemo(() => {
    if (!conversation) return [];
    const participantIds = conversation.participants.map(p => p.user.id);
    return friends.filter(f => !participantIds.includes(f.id));
  }, [friends, conversation?.participants]);

  const filteredFriends = useMemo(() => {
    return eligibleFriends.filter(f => f.username.toLowerCase().includes(searchFriendQuery.toLowerCase()));
  }, [eligibleFriends, searchFriendQuery]);

  const isAdmin = useMemo(() => {
    if (!conversation) return false;
    return conversation.participants.find(p => p.user.id === user?.id)?.role === 'ADMIN' || conversation.creatorId === user?.id;
  }, [conversation, user?.id]);

  const loadRequests = async () => {
    if (activeConversationId && isAdmin) {
      const reqs = await fetchJoinRequests(activeConversationId);
      setJoinRequests(reqs);
    }
  };

  React.useEffect(() => {
    if (isAdmin) loadRequests();
  }, [activeConversationId, isAdmin]);

  if (!conversation) return null;

  const handleLeaveChannel = async () => {
    if (activeConversationId) {
      openConfirm({
        title: 'Leave Channel',
        message: `Are you sure you want to leave #${conversation.name}? You will lose access to all messages and media in this channel.`,
        confirmLabel: 'Leave Channel',
        onConfirm: async () => {
          await leaveConversation(activeConversationId);
          setActiveView('home');
        }
      });
    }
  };

  const handleAddMember = async (friendId: string) => {
    if (activeConversationId) {
      try {
        await addParticipant(activeConversationId, friendId);
        setIsAddingMember(false);
        setSearchFriendQuery('');
        // Add toast from settings store if you wanted, or just standard alert/silent success
      } catch (err: any) {
        alert(err?.response?.data?.message || err.message || 'Failed to send invite');
      }
    }
  };

  const handleKickMember = async (memberId: string, username: string) => {
    if (activeConversationId) {
      openConfirm({
        title: 'Remove Member',
        message: `Are you sure you want to remove ${username} from this channel?`,
        confirmLabel: 'Remove Member',
        onConfirm: async () => {
          try {
            await removeParticipant(activeConversationId, memberId);
          } catch {
            alert('Failed to remove member');
          }
        }
      });
    }
  };

  const handlePromoteMember = async (memberId: string, username: string) => {
    if (activeConversationId) {
      openConfirm({
        title: 'Promote to Admin',
        message: `Are you sure you want to promote ${username} to Admin? They will have executive permissions.`,
        confirmLabel: 'Promote to Admin',
        onConfirm: async () => {
          try {
            await promoteToAdmin(activeConversationId, memberId);
          } catch {
            alert('Failed to promote member');
          }
        }
      });
    }
  };

  const handleDeleteChannel = async () => {
    if (activeConversationId) {
      openConfirm({
        title: 'Delete Channel Permanently',
        message: `Are you sure you want to delete #${conversation.name}? This action is irreversible and all data will be lost forever.`,
        confirmLabel: 'Delete Channel',
        onConfirm: async () => {
          await deleteConversation(activeConversationId);
          setActiveView('home');
        }
      });
    }
  };

  const handleUpdateHero = async (url: string) => {
    if (activeConversationId) {
      await updateConversation(activeConversationId, { heroImage: url });
      setIsEditingHero(false);
    }
  };

  const handleUpdateDescription = async () => {
    if (activeConversationId && editedDescription !== conversation?.description) {
      await updateConversation(activeConversationId, { description: editedDescription });
      setIsEditingDescription(false);
    }
  };

  const handleResolveRequest = async (requestId: string, status: 'APPROVED' | 'DECLINED') => {
    try {
      await resolveJoinRequest(requestId, status);
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      alert('Failed to resolve request');
    }
  };

  const toggleVisibility = async (key: 'isPublic' | 'isHidden', value: boolean) => {
    if (activeConversationId) {
      await updateConversation(activeConversationId, { [key]: value });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto custom-scrollbar relative">
      {/* ─── Hero Header ──────────────────────────────────────────────────────── */}
      <div className="relative h-64 shrink-0 overflow-hidden">
        {conversation.heroImage ? (
          <img 
            src={conversation.heroImage} 
            alt="Channel Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg-deep to-secondary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--color-primary)_0%,_transparent_50%)] opacity-20" />
          </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent" />

        <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
          <button 
            onClick={() => setActiveView('chat')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-deep/90 text-foreground/40 hover:text-primary border border-white/5 transition-all group shadow-xl"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Chat</span>
          </button>

          {isAdmin && (
            <button 
              onClick={() => setIsEditingHero(!isEditingHero)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-deep/90 text-foreground/40 hover:text-primary border border-white/5 transition-all group shadow-xl"
            >
              {isEditingHero ? <X size={16} /> : <Camera size={16} />}
              <span className="text-[11px] font-bold uppercase tracking-wider">{isEditingHero ? 'Cancel' : 'Update Hero'}</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {isEditingHero && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-10 bg-bg-deep/90 backdrop-blur-md"
            >
              <div className="w-full max-w-lg space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-white">Choose New Hero</h3>
                  <span className="text-[10px] text-white/40 font-bold">NeoPlane Presets</span>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {HERO_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleUpdateHero(url)}
                      className="aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all relative group"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                      {conversation.heroImage === url && (
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                          <Plus size={20} className="text-white rotate-45" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Custom URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={customHeroUrl}
                      onChange={(e) => setCustomHeroUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 h-12 px-4 bg-white/10 border border-white/10 rounded-xl text-[13px] font-bold text-white outline-none focus:border-primary transition-all"
                    />
                    <button 
                      onClick={() => customHeroUrl && handleUpdateHero(customHeroUrl)}
                      className="px-6 h-12 bg-primary text-white text-[11px] font-bold uppercase tracking-wider rounded-xl hover:bg-primary-light transition-all shadow-glow"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-10 left-10 flex items-center gap-6"
        >
          <div className="h-20 w-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl shrink-0 relative overflow-hidden group/avatar">
            <Hash size={36} strokeWidth={2.5} className="relative z-10" />
            {conversation.heroImage && (
              <img src={conversation.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover/avatar:opacity-40 transition-opacity" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">{conversation.name}</h1>
              <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-foreground/20 uppercase tracking-wider">
                {conversation.type}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5 text-foreground/30">
                <Users size={12} />
                <span className="text-[11px] font-bold">{conversation.participants.length} Members</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-1.5 text-emerald-400/60">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold">{conversation.participants.filter(p => p.user.status !== 'OFFLINE').length} Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-8 px-10 pt-16 pb-10 max-w-7xl mx-auto w-full"
      >
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">About this channel</h3>
            </div>
            <div className="p-8 rounded-3xl bg-bg-deep/90 border border-white/[0.03] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                <FileText size={120} />
              </div>
              
              {isAdmin && !isEditingDescription && (
                <button 
                  onClick={() => {
                    setEditedDescription(conversation.description || '');
                    setIsEditingDescription(true);
                  }}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-foreground/20 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                >
                  <Edit3 size={16} />
                </button>
              )}

              {isEditingDescription ? (
                <div className="space-y-4">
                  <textarea
                    autoFocus
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full bg-white/5 border border-primary/20 rounded-2xl p-4 text-[15px] font-medium text-foreground outline-none resize-none h-32 focus:bg-white/[0.08] transition-all"
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setIsEditingDescription(false)} className="h-9 px-4 rounded-xl text-[12px] font-bold text-foreground/30 hover:text-foreground">Cancel</button>
                    <button onClick={handleUpdateDescription} className="h-9 px-6 rounded-xl text-[12px] font-bold bg-primary text-white uppercase tracking-widest shadow-glow-sm">Save Description</button>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-medium text-foreground/70 leading-relaxed italic">
                  {conversation.description || "Every journey begins with a single step. This channel is for collaboration and growth."}
                </p>
              )}
              
              {isAdmin && (
                <div className="mt-10 pt-8 border-t border-white/[0.03] space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Visibility Controls</h3>
                  </div>
                  <div className="flex gap-8">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility('isPublic', !conversation.isPublic);
                      }}
                      className="flex items-center gap-3 cursor-pointer group/toggle"
                    >
                      <div className={clsx(
                        "w-8 h-4 rounded-full relative transition-all duration-300",
                        conversation.isPublic ? "bg-primary" : "bg-white/10"
                      )}>
                        <div className={clsx(
                          "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300",
                          conversation.isPublic ? "left-4.5" : "left-0.5"
                        )} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-foreground/30 group-hover/toggle:text-foreground/50 transition-colors">Direct Join</span>
                    </div>

                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility('isHidden', !conversation.isHidden);
                      }}
                      className="flex items-center gap-3 cursor-pointer group/toggle"
                    >
                      <div className={clsx(
                        "w-8 h-4 rounded-full relative transition-all duration-300",
                        conversation.isHidden ? "bg-rose-500/60" : "bg-white/10"
                      )}>
                        <div className={clsx(
                          "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300",
                          conversation.isHidden ? "left-4.5" : "left-0.5"
                        )} />
                      </div>
                      <span className="text-[10px] font-black uppercase text-foreground/30 group-hover/toggle:text-foreground/50 transition-colors">Hidden from Browse</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 mt-6 pb-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/15">Created On</span>
                  <p className="text-[13px] font-bold text-foreground/60">{format(new Date(conversation.createdAt), 'MMMM d, yyyy')}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/15">Status</span>
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-primary/60" />
                    <p className="text-[13px] font-bold text-foreground/60">{conversation.isPublic ? 'Public' : 'Approval Required'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {isAdmin && joinRequests.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)] shrink-0" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-500/60">Pending Join Requests ({joinRequests.length})</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {joinRequests.map((req) => (
                  <div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10 group">
                    <Avatar src={req.user.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-foreground/70 truncate">{req.user.username}</p>
                      <p className="text-[9px] font-bold uppercase tracking-tight text-amber-500/40">Requesting Access</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={() => handleResolveRequest(req.id, 'APPROVED')}
                        className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                        title="Approve"
                       >
                         <ShieldAlert size={14} />
                       </button>
                       <button 
                        onClick={() => handleResolveRequest(req.id, 'DECLINED')}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        title="Decline"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Media & Files</h3>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-deep/90 border border-white/5">
                {(['media', 'docs', 'links'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      activeTab === tab 
                        ? "bg-primary text-white shadow-lg" 
                        : "text-foreground/40 hover:text-foreground/60 hover:bg-white/5"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'media' && (
                  <motion.div 
                    key="media"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-4 gap-4"
                  >
                    {mediaFiles.map((m, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer relative">
                        <img src={m.fileUrl!} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <ImageIcon size={24} className="text-white drop-shadow-lg" />
                        </div>
                      </div>
                    ))}
                    {mediaFiles.length === 0 && (
                      <div className="col-span-4 py-12 text-center text-[11px] font-bold uppercase tracking-wider text-foreground/15 border border-dashed border-white/5 rounded-3xl">No visual records found</div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'docs' && (
                  <motion.div 
                    key="docs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {docFiles.map((doc, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[13px] font-bold text-foreground/70 truncate group-hover:text-foreground transition-colors">{doc.fileName}</p>
                          <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/20">{(doc.fileSize || 0) / 1024} KB</span>
                        </div>
                        <a href={doc.fileUrl!} target="_blank" rel="noreferrer">
                          <Download size={16} className="text-foreground/10 group-hover:text-primary transition-colors" />
                        </a>
                      </div>
                    ))}
                    {docFiles.length === 0 && (
                      <div className="py-12 text-center text-[11px] font-bold uppercase tracking-wider text-foreground/15 border border-dashed border-white/5 rounded-3xl">No document logs found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-bg-deep/90 border border-white/[0.05] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Channel Members</h3>
              </div>
              {isAdmin && conversation.type !== 'DIRECT' && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveView('create-group')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-light transition-all shadow-glow-sm"
                    title="Create Group"
                  >
                    <Plus size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Group</span>
                  </button>
                  <button 
                    onClick={() => setIsAddingMember(!isAddingMember)}
                    className="p-1.5 rounded-lg bg-white/5 text-foreground/40 hover:text-primary transition-all border border-white/5"
                    title="Add Member"
                  >
                    <UserPlus size={14} />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence>
              {isAddingMember && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-3"
                >
                  <input 
                    type="text"
                    value={searchFriendQuery}
                    onChange={(e) => setSearchFriendQuery(e.target.value)}
                    placeholder="Search friends to invite..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/5 rounded-xl text-[12px] text-white outline-none focus:border-primary transition-all"
                  />
                  <div className="max-h-40 overflow-y-auto custom-scrollbar-minimal space-y-1">
                    {filteredFriends.map(f => (
                      <button 
                        key={f.id}
                        onClick={() => handleAddMember(f.id)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all text-left group"
                      >
                        <Avatar src={f.avatar} size="xs" />
                        <span className="text-[12px] font-bold text-foreground/60 group-hover:text-foreground">{f.username}</span>
                        <Plus size={12} className="ml-auto text-foreground/20 group-hover:text-primary" />
                      </button>
                    ))}
                    {filteredFriends.length === 0 && (
                      <div className="py-4 text-center text-[10px] font-bold text-foreground/10 uppercase tracking-wider">No friends found to invite</div>
                    )}
                  </div>
                  <div className="h-px w-full bg-white/5" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {conversation.participants.map((p, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <Avatar src={p.user.avatar} size="sm" className="h-8 w-8 ring-1 ring-white/5 group-hover:ring-primary/40 transition-all" />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <p className="text-[13px] font-bold text-foreground/70 truncate group-hover:text-foreground transition-colors">{p.user.username}</p>
                      {p.role === 'ADMIN' && <ShieldAlert size={10} className="text-amber-400 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap size={10} className="text-primary/40" />
                      <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/20">{p.role}</span>
                    </div>
                  </div>
                  {isAdmin && p.user.id !== user?.id && p.user.id !== conversation.creatorId && (
                    <div className="flex items-center gap-1">
                      {p.role !== 'ADMIN' && (
                        <button 
                          onClick={() => handlePromoteMember(p.user.id, p.user.username)}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-amber-500/10 text-amber-500/40 hover:text-amber-500 transition-all"
                          title="Promote to Admin"
                        >
                          <ShieldAlert size={12} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleKickMember(p.user.id, p.user.username)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-500 transition-all"
                        title="Remove Member"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-rose-500/[0.02] border border-rose-500/10 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-500/40">
              <div className="w-1 h-[10px] bg-rose-500/40 rounded-full shrink-0" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em]">Danger Zone</h3>
            </div>
            <p className="text-[11px] font-medium text-foreground/20 leading-tight">
              Leaving {conversation.name} will remove your access to this channel's history and messages.
            </p>
            <button 
              onClick={handleLeaveChannel}
              className="w-full py-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[10px] font-bold uppercase tracking-wider text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              Leave Channel
            </button>
            {isAdmin && (
              <button 
                onClick={handleDeleteChannel}
                className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-glow-sm"
              >
                Delete Channel Permanently
              </button>
            )}
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};
