import React from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, Users, ArrowLeft, Plus, 
  Shield, Globe, Zap, Clock,
  FileText, Image as ImageIcon, Link as LinkIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

export const ChannelInfo: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleGroupMembership = useAppStore((state) => state.toggleGroupMembership);

  const meta = activeConversationId ? conversationMeta[activeConversationId] : null;

  if (!meta) return null;

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
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg-deep to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--color-primary)_0%,_transparent_50%)] opacity-20" />
        
        {/* Header Controls */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => setActiveView('chat')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-2 text-foreground/40 hover:text-primary border border-white/5 transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">Back to Chat</span>
          </button>
        </div>

        {/* Channel Icon & Basic Info */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-10 left-10 flex items-end gap-6"
        >
          <div className="h-24 w-24 bg-primary/20 rounded-3xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl backdrop-blur-md">
            <Hash size={44} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">{meta.name}</h1>
              <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-foreground/20 uppercase tracking-widest uppercase">
                Public Channel
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-foreground/30">
                <Users size={14} />
                <span className="text-[12px] font-bold">{meta.memberCount} Members</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-1.5 text-emerald-400/60">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[12px] font-bold">{meta.online.length} Online</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Content Grid ────────────────────────────────────────────────────── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-8 p-10 max-w-7xl mx-auto w-full"
      >
        {/* Left Column: Description & Groups */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* About Section */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/20">About this channel</h3>
            <div className="p-8 rounded-3xl glass-1 border border-white/[0.03] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                <FileText size={120} />
              </div>
              <p className="text-lg font-medium text-foreground/70 leading-relaxed selection:bg-primary/30">
                {meta.description || "Every journey begins with a single step. This channel is the heartbeat of our progress, a space for shared vision and collective momentum."}
              </p>
              
              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/[0.03]">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/15">Created By</span>
                  <p className="text-[13px] font-bold text-foreground/60">NeoPlane HQ</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/15">Created On</span>
                  <p className="text-[13px] font-bold text-foreground/60">March 24, 2026</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/15">Privacy</span>
                  <div className="flex items-center gap-1.5">
                    <Globe size={12} className="text-primary/60" />
                    <p className="text-[13px] font-bold text-foreground/60">Open to all</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Active Groups Section */}
          {meta.groups && (
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/20">Active Sub-channels</h3>
                <button className="flex items-center gap-2 group text-primary/60 hover:text-primary transition-colors">
                  <Plus size={14} />
                  <span className="text-[10px] font-black tracking-widest uppercase">Create Group</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meta.groups.map(group => (
                  <div 
                    key={group.id}
                    className="p-5 rounded-2xl glass-2 border border-white/[0.04] hover:border-primary/20 transition-all group/card cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/[0.03] flex items-center justify-center text-foreground/30 group-hover/card:text-primary transition-colors">
                          <Hash size={16} />
                        </div>
                        <h4 className="text-[14px] font-bold text-foreground/70 group-hover/card:text-foreground transition-colors">{group.name}</h4>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupMembership(activeConversationId!, group.id);
                        }}
                        className={clsx(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                          group.joined 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "bg-white/[0.05] text-foreground/20 hover:text-foreground/50"
                        )}
                      >
                        {group.joined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                    <p className="text-[11px] text-foreground/30 leading-relaxed">
                      Detailed discussion and focused collaboration for {group.name.toLowerCase()}.
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column: Sidebar Meta */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Members Highlights */}
          <motion.section variants={itemVariants} className="p-6 rounded-3xl glass-3 border border-white/[0.05] space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/20">Top Contributors</h3>
            <div className="space-y-4">
              {meta.online.slice(0, 5).map((person, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer">
                  <Avatar src={person.avatar} size="sm" className="h-8 w-8 ring-1 ring-white/5 group-hover:ring-primary/40 transition-all" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[13px] font-bold text-foreground/70 truncate group-hover:text-foreground transition-colors">{person.name}</p>
                    <div className="flex items-center gap-1.5">
                      <Zap size={10} className="text-amber-400" />
                      <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/20">Senior Designer</span>
                    </div>
                  </div>
                  <Clock size={12} className="text-foreground/10" />
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-primary hover:border-primary/20 transition-all">
              View All {meta.memberCount} Members
            </button>
          </motion.section>

          {/* Shared Content */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/20">Media Gallery</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer">
                  <div className="h-full w-full bg-primary/5 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center opacity-40">
                    <ImageIcon size={20} className="text-foreground/20" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group">
                <LinkIcon size={14} className="text-foreground/20 group-hover:text-primary transition-colors" />
                <span className="text-[12px] font-bold text-foreground/40 group-hover:text-foreground/70 transition-colors">Shared Links</span>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all group">
                <Shield size={14} className="text-foreground/20 group-hover:text-primary transition-colors" />
                <span className="text-[12px] font-bold text-foreground/40 group-hover:text-foreground/70 transition-colors">Permissions</span>
              </button>
            </div>
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
};
