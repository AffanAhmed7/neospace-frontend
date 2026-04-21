import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Hash, Users,
  Globe,
  Filter, CheckCircle2, Loader2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { clsx } from 'clsx';

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Gaming', 'Casual', 'Support', 'Other'];

// No mock data needed anymore

// ─── Main Component ──────────────────────────────────────────────────────────

export const ExploreChannels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'name'>('popularity');
  const [hideJoined, setHideJoined] = useState(false);

  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  
  const { exploreChannels, fetchExploreChannels, joinChannel, isLoading, conversations, pendingInvites } = useConversationsStore();
  const setActivePromptInvite = useConversationsStore((state) => state.setActivePromptInvite);

  useEffect(() => {
    fetchExploreChannels({ 
      category: activeCategory === 'All' ? undefined : activeCategory, 
      query: searchQuery || undefined, 
      sortBy: sortBy === 'popularity' ? 'members' : 'name' 
    });
  }, [activeCategory, searchQuery, sortBy, fetchExploreChannels]);

  const filteredChannels = exploreChannels.map(ch => {
     const isJoined = conversations.some(c => c.id === ch.id);
     const invite = pendingInvites.find(i => i.conversationId === ch.id);
     return { ...ch, isJoined, isInvited: !!invite, invite };
  }).filter(ch => {
     return hideJoined ? !ch.isJoined : true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

      {/* ─── Standardized Header ────────────────────────────────────────────── */}
      <header className="flex h-[64px] items-center justify-between border-b border-white/[0.03] px-6 shrink-0 bg-bg-deep/90 z-50 sticky top-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 pr-4 border-r border-white/[0.05]">
            <Globe size={18} className="text-foreground/30" />
            <h2 className="font-bold text-foreground text-[14px] tracking-tight uppercase">Browse</h2>
          </div>
          
          <nav className="flex items-center gap-1.5 hidden md:flex">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={clsx(
                  "px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest transition-all",
                  activeCategory === cat 
                    ? "bg-white/[0.08] text-foreground" 
                    : "text-foreground/30 hover:text-foreground/60 hover:bg-white/[0.03]"
                )}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 w-full max-w-sm ml-auto relative">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-4 bg-white/[0.02] border border-white/[0.05] rounded-lg text-[13px] font-medium focus:outline-none focus:border-primary/30 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={clsx(
                "h-8 px-2 rounded-lg transition-all",
                showFilter ? "text-primary bg-primary/10" : "text-foreground/40 hover:text-primary hover:bg-white/[0.04]"
              )}
            >
              <Filter size={16} />
            </button>

            <AnimatePresence>
              {showFilter && (
                <>
                  {/* Backdrop for click-outside */}
                  <div 
                    className="fixed inset-0 z-[60]" 
                    onClick={() => setShowFilter(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 bg-[#0A0A0C] border border-white/[0.08] rounded-2xl shadow-2xl z-[70] overflow-hidden backdrop-blur-xl p-2"
                  >
                    <div className="p-3 space-y-4">
                      {/* Sort Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/20 px-2">Sort By</label>
                        <div className="grid grid-cols-1 gap-1">
                          {[
                            { id: 'popularity', label: 'Most Popular' },
                            { id: 'name', label: 'Alphabetical (A-Z)' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => { setSortBy(opt.id as 'popularity' | 'name'); setShowFilter(false); }}
                              className={clsx(
                                "flex items-center justify-between px-3 py-2 rounded-xl text-[12px] font-bold transition-all",
                                sortBy === opt.id ? "bg-primary/10 text-primary" : "text-foreground/40 hover:bg-white/[0.03] hover:text-foreground/60"
                              )}
                            >
                              {opt.label}
                              {sortBy === opt.id && <Hash size={12} className="opacity-50" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-white/[0.03] mx-2" />

                      {/* Toggles */}
                      <div className="space-y-1">
                        <button
                          onClick={() => setHideJoined(!hideJoined)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group"
                        >
                          <span className={clsx(
                            "text-[12px] font-bold transition-colors",
                            hideJoined ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/60"
                          )}>
                            Hide Joined
                          </span>
                          <div className={clsx(
                            "w-8 h-4 rounded-full relative transition-all duration-300",
                            hideJoined ? "bg-primary" : "bg-white/[0.06]"
                          )}>
                            <div className={clsx(
                              "absolute top-1 w-2 h-2 rounded-full bg-white transition-all duration-300",
                              hideJoined ? "left-5" : "left-1"
                            )} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ─── Main Content Area (Dense List) ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto w-full px-6 pt-16 pb-8">
          
          {/* Sub Header for context */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Browse Channels</h3>
              <p className="text-[12px] text-foreground/40 font-medium mt-1">Find and join communities across the workspace.</p>
            </div>
            <button
              onClick={() => setActiveView('create-channel')}
              className="h-9 px-5 rounded-full border border-white/[0.08] text-[11px] font-semibold tracking-widest text-foreground/50 hover:text-foreground hover:border-white/[0.18] hover:bg-white/[0.04] transition-all duration-200"
            >
              Create Channel
            </button>
          </div>

          {/* Tabular List Headers */}
          <div className="grid grid-cols-[1fr_200px_120px] gap-4 px-4 py-2 border-b border-white/[0.05] mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
            <div>Channel</div>
            <div className="text-right">Activity</div>
            <div className="text-right"></div>
          </div>

          {/* List Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            <AnimatePresence mode="popLayout">
              {filteredChannels.map(channel => (
                <motion.div
                  key={channel.id}
                  variants={itemVariants}
                  layout
                  className="group grid grid-cols-[1fr_200px_120px] gap-4 items-center px-4 py-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all cursor-pointer"
                  onClick={() => setActiveConversation(channel.id)}
                >
                  {/* Left: Identity & Description */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-primary/20">
                      <Hash size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[15px] font-bold text-foreground/90 group-hover:text-foreground transition-colors truncate">
                          {channel.name}
                        </h4>
                      </div>
                      <p className="text-[12px] text-foreground/30 font-medium truncate mt-0.5">
                        {channel.description}
                      </p>
                    </div>
                  </div>

                    {/* Middle: Stats */}
                  <div className="flex flex-col items-end justify-center">
                    <div className="flex items-center gap-1.5 text-foreground/60">
                      <span className="text-[12px] font-bold">{((channel as any)?._count?.participants || 0).toLocaleString()}</span>
                      <Users size={12} className="opacity-40" />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex justify-end">
                    {channel.isJoined ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1.5">
                        <CheckCircle2 size={14} /> Joined
                      </div>
                    ) : channel.isInvited ? (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (channel.invite) setActivePromptInvite(channel.invite);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-glow-sm"
                      >
                        Respond
                      </button>
                    ) : (
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          const success = await joinChannel(channel.id);
                          if (success) {
                            setActiveConversation(channel.id);
                          }
                        }}
                        className="px-4 py-1.5 rounded-lg bg-white/[0.05] text-foreground/70 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-foreground transition-all"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            )}

            {!isLoading && filteredChannels.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30 select-none">
                <Search size={48} className="mb-4" strokeWidth={1} />
                <p className="text-[11px] font-black uppercase tracking-widest text-center">No channels found matching '{searchQuery}'</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
