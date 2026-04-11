import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, MessageSquare,
  MoreVertical, Search, Globe,
  Clock, Check, X, Mail, Shield
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

type FriendStatus = 'online' | 'offline' | 'idle' | 'dnd';

const friendsData = [
  { id: '1', name: 'Alex Rivera', status: 'online' as FriendStatus, activity: 'Designing @ NeoPlane', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', name: 'Jordan Lee', status: 'offline' as FriendStatus, activity: 'Last seen 2h ago', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: '3', name: 'Sarah Chen', status: 'idle' as FriendStatus, activity: 'Thinking about code...', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { id: '4', name: 'Marcus Wright', status: 'online' as FriendStatus, activity: 'In a meeting', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { id: '5', name: 'Elena Rossi', status: 'dnd' as FriendStatus, activity: 'Deep work mode', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
];

const pendingRequests = [
  { id: 'p1', name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
];

const statusColor = {
  online: 'bg-emerald-500',
  idle: 'bg-amber-400',
  dnd: 'bg-rose-500',
  offline: 'bg-foreground/20',
};

const statusLabel = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};

type Tab = 'Online' | 'All' | 'Pending' | 'Blocked';

export const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Online');
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendMode, setAddFriendMode] = useState(false);
  const [addInput, setAddInput] = useState('');
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);

  const filtered = friendsData.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'Online') return matchSearch && f.status === 'online';
    return matchSearch;
  });

  const tabs: Tab[] = ['Online', 'All', 'Pending', 'Blocked'];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="flex h-[64px] items-center gap-0 border-b border-white/[0.03] px-5 shrink-0 bg-bg-deep/90 z-10 sticky top-0">
        {/* Icon + Label */}
        <div className="flex items-center gap-2.5 pr-4 border-r border-white/[0.06]">
          <Users size={17} className="text-foreground/40" />
          <span className="text-[14px] font-bold text-foreground tracking-tight">Friends</span>
        </div>

        {/* Tabs */}
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
              {tab === 'Pending' && pendingRequests.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white font-black">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Add Friend Button */}
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

      {/* ─── Add Friend Bar ─────────────────────────────────────────── */}
      <AnimatePresence>
        {addFriendMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-white/[0.03] shrink-0"
          >
            <div className="px-6 py-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-3">
                Add by Username
              </p>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 group">
                  <input
                    autoFocus
                    type="text"
                    placeholder="Enter a username, e.g. cosmic#1234"
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value)}
                    className="w-full h-10 px-4 bg-white/[0.03] border border-white/[0.07] focus:border-primary/40 rounded-xl text-[13px] font-medium text-foreground placeholder:text-foreground/20 outline-none transition-all"
                  />
                </div>
                <button
                  disabled={!addInput.trim()}
                  className="h-10 px-5 rounded-xl bg-primary text-white text-[12px] font-black disabled:opacity-30 hover:bg-primary/90 transition-all shadow-glow-sm"
                >
                  Send Request
                </button>
                <button
                  onClick={() => { setAddFriendMode(false); setAddInput(''); }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.05] transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Body ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {/* ── Online / All ── */}
          {(activeTab === 'Online' || activeTab === 'All') && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              {/* Search */}
              <div className="px-4 pt-10 pb-2">
                <div className="relative group">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-10 pr-4 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[13px] font-medium focus:outline-none focus:border-primary/20 transition-all"
                  />
                </div>
              </div>

              {/* Section label */}
              <div className="px-6 py-3">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/15">
                  {activeTab === 'Online' ? 'Online' : 'All Friends'} — {filtered.length}
                </span>
              </div>

              {/* List */}
              <div>
                {filtered.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group flex items-center px-3 py-2 mx-2 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/[0.02]"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleProfilePanel(friend.id);
                    }}
                  >
                    {/* Avatar */}
                    <div className="relative mr-3 shrink-0">
                      <Avatar src={friend.avatar} alt={friend.name} size="md" className="h-9 w-9 ring-1 ring-white/[0.05]" />
                      <div className={clsx('absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0D0D0D]', statusColor[friend.status])} />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-foreground/75 group-hover:text-foreground transition-colors truncate">
                        {friend.name}
                      </span>
                      <span className="text-[11px] text-foreground/30 font-medium group-hover:text-foreground/50 transition-colors truncate">
                        {statusLabel[friend.status]}{friend.activity ? ` · ${friend.activity}` : ''}
                      </span>
                    </div>

                    {/* Actions (reveal on hover) */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white/[0.04] text-foreground/40 hover:text-primary hover:bg-primary/10 transition-all">
                        <MessageSquare size={15} />
                      </button>
                      <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white/[0.04] text-foreground/40 hover:text-foreground/80 transition-all">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-24 opacity-20 select-none">
                    <Globe size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-center">
                      {searchQuery ? 'No results found' : 'Wormhole is empty'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Pending ── */}
          {activeTab === 'Pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4"
            >
              <div className="px-2 py-3">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/15">
                  Incoming — {pendingRequests.length}
                </span>
              </div>

              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="group flex items-center px-3 py-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.02] transition-all"
                >
                  <div 
                    className="relative mr-3 shrink-0 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); toggleProfilePanel(req.id); }}
                  >
                    <Avatar src={req.avatar} alt={req.name} size="md" className="h-9 w-9 ring-1 ring-white/[0.05]" />
                  </div>
                  <div 
                    className="flex flex-col flex-1 min-w-0 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); toggleProfilePanel(req.id); }}
                  >
                    <span className="text-[13px] font-bold text-foreground/75 group-hover:text-foreground transition-colors">{req.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={10} className="text-foreground/20" />
                      <span className="text-[10px] text-foreground/25 font-medium">Incoming friend request · 3h ago</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                      <Check size={15} />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/15">
                  Outgoing — 0
                </span>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-20">
                <Mail size={32} strokeWidth={1} className="mb-3" />
                <p className="text-[11px] font-black uppercase tracking-widest">No outgoing requests</p>
              </div>
            </motion.div>
          )}

          {/* ── Blocked ── */}
          {activeTab === 'Blocked' && (
            <motion.div
              key="blocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center justify-center py-24 opacity-20"
            >
              <Shield size={48} strokeWidth={1} className="mb-4" />
              <p className="text-[11px] font-black uppercase tracking-widest">No blocked users</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
