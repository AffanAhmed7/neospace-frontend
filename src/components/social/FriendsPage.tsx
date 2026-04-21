import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, MessageSquare,
  Search, Globe,
  X, Shield
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFriendsStore, type User } from '../../store/useFriendsStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

const statusColor = {
  ONLINE: 'bg-emerald-500',
  IDLE: 'bg-amber-400',
  DND: 'bg-rose-500',
  OFFLINE: 'bg-foreground/20',
};

const statusLabel = {
  ONLINE: 'Online',
  IDLE: 'Idle',
  DND: 'Do Not Disturb',
  OFFLINE: 'Offline',
};

type Tab = 'Online' | 'All' | 'Pending' | 'Blocked';

export const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Online');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendMode, setAddFriendMode] = useState(false);
  const [addInput, setAddInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const openConfirm = useAppStore((state) => state.openConfirm);
  
  const { 
    friends, 
    pendingIncoming, 
    pendingOutgoing, 
    sendRequest, 
    acceptRequest, 
    declineRequest,
    removeFriend,
    startDM,
    searchUsers
  } = useFriendsStore();

  // Live search for discovery
  React.useEffect(() => {
    if (!addInput.trim() || addInput.length < 1) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchUsers(addInput);
      // Filter out self and existing friends
      const { user: currentUser } = useAuthStore.getState();
      const filtered = results.filter(u => 
        u.id !== currentUser?.id && 
        !friends.some(f => f.id === u.id)
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [addInput, searchUsers, friends]);

  const filteredFriends = useMemo(() => {
    return friends.filter((f) => {
      const matchSearch = f.username.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'Online') return matchSearch && f.status !== 'OFFLINE';
      return matchSearch;
    });
  }, [friends, activeTab, searchQuery]);

  const handleAddFriend = async (overrideName?: string) => {
    const target = overrideName || addInput.trim();
    if (!target) return;
    setIsSending(true);
    const success = await sendRequest(target);
    setIsSending(false);
    if (success) {
      setAddInput('');
      setAddFriendMode(false);
      setSearchResults([]);
    } else {
      alert('Failed to send friend request. User may not exist or request already sent.');
    }
  };

  const handleStartDM = async (userId: string) => {
    const conversationId = await startDM(userId);
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  };

  const tabs: Tab[] = ['Online', 'All', 'Pending', 'Blocked'];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <header className="flex h-[64px] items-center gap-0 border-b border-white/[0.03] px-5 shrink-0 bg-bg-deep/90 z-10 sticky top-0">
        <div className="flex items-center gap-2.5 pr-4 border-r border-white/[0.06]">
          <Users size={17} className="text-foreground/40" />
          <span className="text-[14px] font-bold text-foreground tracking-tight">Friends</span>
        </div>

        <nav className="flex items-center gap-0.5 px-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setAddFriendMode(false); }}
              className={clsx(
                'px-3 py-1 rounded-md text-[12px] font-semibold transition-all relative',
                activeTab === tab && !addFriendMode
                  ? 'bg-white/[0.08] text-foreground'
                  : 'text-foreground/35 hover:text-foreground/65 hover:bg-white/[0.04]'
              )}
            >
              {tab}
              {tab === 'Pending' && pendingIncoming.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white font-black">
                  {pendingIncoming.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setAddFriendMode(true)}
          className={clsx(
            'ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all',
            addFriendMode
              ? 'bg-primary/15 text-primary border border-primary/30'
              : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-white'
          )}
        >
          <UserPlus size={14} />
          Add Friend
        </button>
      </header>

      {/* Add Friend Bar */}
      <AnimatePresence>
        {addFriendMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/[0.03] shrink-0"
          >
            <div className="px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/30 mb-3 text-left">Add by Username</p>
              <div className="flex items-center gap-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Enter a username"
                  value={addInput}
                  onChange={(e) => setAddInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
                  className="w-full h-10 px-4 bg-white/[0.03] border border-white/[0.07] focus:border-primary/40 rounded-xl text-[13px] font-medium text-foreground outline-none transition-all"
                />
                <button
                  disabled={!addInput.trim() || isSending}
                  onClick={() => handleAddFriend()}
                  className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-black disabled:opacity-30 hover:bg-primary/90 transition-all shadow-glow-sm flex items-center gap-2"
                >
                  {isSending ? 'Sending...' : 'Send Request'}
                </button>
                <button onClick={() => { setAddFriendMode(false); setAddInput(''); setSearchResults([]); }} className="text-foreground/30 hover:text-foreground/70 transition-all"><X size={15} /></button>
              </div>

              {/* Live Search Results */}
              <AnimatePresence>
                {(searchResults.length > 0 || isSearching) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 bg-bg-deep/50 border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-[10px] uppercase font-bold tracking-wider text-foreground/20">Searching...</div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {searchResults.map(u => (
                          <div 
                            key={u.id}
                            onClick={() => toggleProfilePanel(u.id)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-white/[0.05] cursor-pointer transition-colors border-b border-white/[0.02] last:border-0"
                          >
                            <Avatar src={u.avatar} size="xs" />
                            <span className="text-[13px] font-bold text-foreground/70">{u.username}</span>
                            <span className="ml-auto text-[9px] font-black tracking-tighter text-foreground/20 uppercase group-hover:text-primary transition-colors">View Profile</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {(activeTab === 'Online' || activeTab === 'All') && (
            <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
              <div className="px-4 pt-10 pb-2">
                <div className="relative group">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/55 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search friends"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 bg-white/[0.07] border border-white/[0.16] rounded-xl text-[13px] font-semibold text-foreground/90 placeholder:text-foreground/45 shadow-[0_8px_24px_rgba(0,0,0,0.22)] focus:outline-none focus:border-primary/45 focus:bg-white/[0.1] transition-all"
                  />
                </div>
              </div>

              <div className="px-6 py-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/15">
                  {activeTab === 'Online' ? 'Online' : 'All Friends'} — {filteredFriends.length}
                </span>
              </div>

              <div className="px-2">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="group flex items-center px-3 py-2.5 mx-1 mb-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-all cursor-pointer border border-white/[0.06] hover:border-white/[0.12] shadow-[0_8px_22px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.30)]"
                    onClick={() => toggleProfilePanel(friend.id)}
                  >
                    <div className="relative mr-3 shrink-0">
                      <Avatar src={friend.avatar} alt={friend.username} size="md" className="h-9 w-9 ring-1 ring-white/[0.05]" />
                      <div className={clsx('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0D0D0D]', statusColor[friend.status])} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-foreground/75 group-hover:text-foreground transition-colors truncate">{friend.username}</span>
                      <span className="text-[11px] text-foreground/30 font-medium truncate">{statusLabel[friend.status]}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 transition-opacity shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartDM(friend.id); }}
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.04] text-foreground/20 hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all"
                        title="Direct Message"
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button 
                         onClick={(e) => { 
                           e.stopPropagation(); 
                           openConfirm({
                             title: 'Remove Friend',
                             message: `Are you sure you want to remove ${friend.username}? You will need to send a new request to connect again.`,
                             confirmLabel: 'Remove Friend',
                             onConfirm: () => removeFriend(friend.id)
                           });
                         }}
                         className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.04] text-foreground/20 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all font-bold"
                         title="Remove Friend"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredFriends.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 opacity-20 select-none">
                    <Globe size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-center">{searchQuery ? 'No results found' : 'No friends found'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Pending' && (
            <div className="p-4 space-y-6">
              {/* Incoming */}
              <div className="text-left">
                <div className="px-2 py-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/15">Incoming — {pendingIncoming.length}</span>
                </div>
                {pendingIncoming.map((req) => (
                  <div key={req.id} className="flex items-center px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-2">
                    <Avatar src={req.sender?.avatar} alt={req.sender?.username} size="sm" className="mr-3" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-foreground/80">{req.sender?.username}</span>
                      <span className="text-[11px] text-foreground/20 font-medium">Request pending</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => acceptRequest(req.id)} className="h-8 px-4 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Accept</button>
                      <button onClick={() => declineRequest(req.id)} className="h-8 px-4 rounded-lg bg-white/5 text-foreground/40 text-[10px] font-bold uppercase tracking-widest hover:text-rose-500">Ignore</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Outgoing */}
              <div className="text-left">
                <div className="px-2 py-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/15">Outgoing — {pendingOutgoing.length}</span>
                </div>
                {pendingOutgoing.map((req) => (
                   <div key={req.id} className="flex items-center px-4 py-3 rounded-xl bg-white/[0.01] border border-white/[0.03] opacity-60 mb-2">
                      <Avatar src={req.receiver?.avatar} alt={req.receiver?.username} size="sm" className="mr-3" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[13px] font-bold text-foreground/80">{req.receiver?.username}</span>
                        <span className="text-[11px] text-foreground/20 font-medium">Sent</span>
                      </div>
                      <button onClick={() => declineRequest(req.id)} className="text-foreground/20 hover:text-rose-500 transition-all"><X size={14} /></button>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Blocked' && (
            <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 opacity-20">
              <Shield size={48} strokeWidth={1} className="mb-4" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-center">No blocked users</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
