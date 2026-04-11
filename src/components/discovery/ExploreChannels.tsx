import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Hash, Users,
  Globe,
  Filter, CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Gaming', 'Casual', 'Support', 'Other'];

const suggestedChannels = [
  { id: '1', name: 'general', description: 'The town square for all NeoPlane users. Announcements, general discussion, and watercooler chat.', members: 1240, online: 156, category: 'Casual', isJoined: true },
  { id: '2', name: 'global-chat', description: 'Real-time conversation with the entire world network. High volume.', members: 890, online: 42, category: 'All', isJoined: true },
  { id: '3', name: 'engineering', description: 'Deep dives into code, architecture, and deployment pipelines. Core PR discussions happen here.', members: 450, online: 28, category: 'Engineering', isJoined: true },
  { id: '4', name: 'design-system', description: 'Polishing pixels and defining the visual future. Feedback on UI/UX components.', members: 320, online: 15, category: 'Design', isJoined: false },
  { id: '5', name: 'marketing-ops', description: 'Planning the next big launch and reviewing campaign metrics.', members: 180, online: 5, category: 'Marketing', isJoined: false },
  { id: '6', name: 'customer-success', description: 'Helping our users get the most out of NeoPlane. Support workflows.', members: 210, online: 12, category: 'Support', isJoined: false },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export const ExploreChannels: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);

  const filteredChannels = suggestedChannels.filter(ch => {
    const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || ch.category === activeCategory;
    return matchesSearch && matchesCategory;
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

        <div className="flex items-center gap-3 w-full max-w-sm ml-auto">
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
          <button className="h-8 px-2 rounded-lg text-foreground/40 hover:text-primary hover:bg-white/[0.04] transition-all">
            <Filter size={16} />
          </button>
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
                      <span className="text-[12px] font-bold">{channel.members.toLocaleString()}</span>
                      <Users size={12} className="opacity-40" />
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 mt-0.5">
                      <span className="text-[11px] font-bold">{channel.online} online</span>
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex justify-end">
                    {channel.isJoined ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1.5">
                        <CheckCircle2 size={14} /> Joined
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveConversation(channel.id); }}
                        className="px-4 py-1.5 rounded-lg bg-white/[0.05] text-foreground/70 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-foreground transition-all"
                      >
                        View
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredChannels.length === 0 && (
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
