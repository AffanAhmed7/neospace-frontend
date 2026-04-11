import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, Users, ArrowLeft, Plus, 
  Globe, Zap, Clock,
  FileText, Image as ImageIcon, Link as LinkIcon,
  ChevronRight, Download, ExternalLink, Camera, X, Bell, BellOff
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

export const ChannelInfo: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const toggleGroupMembership = useAppStore((state) => state.toggleGroupMembership);
  const leaveChannel = useAppStore((state) => state.leaveChannel);
  const updateChannelHero = useAppStore((state) => state.updateChannelHero);
  
  const mutedChannelIds = useAppStore((state) => state.mutedChannelIds);
  const toggleMuteChannel = useAppStore((state) => state.toggleMuteChannel);
  const mutedGroupIds = useAppStore((state) => state.mutedGroupIds);
  const toggleMuteGroup = useAppStore((state) => state.toggleMuteGroup);

  const [activeTab, setActiveTab] = useState<'media' | 'docs' | 'links'>('media');
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [customHeroUrl, setCustomHeroUrl] = useState('');

  const HERO_PRESETS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000',
  ];

  const meta = activeConversationId ? conversationMeta[activeConversationId] : null;

  if (!meta) return null;

  const isChannelMuted = mutedChannelIds.includes(activeConversationId!);

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
        {/* Hero Background */}
        {meta.heroImage ? (
          <img 
            src={meta.heroImage} 
            alt="Channel Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-bg-deep to-secondary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--color-primary)_0%,_transparent_50%)] opacity-20" />
          </>
        )}
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-bg-deep/40 to-transparent" />

        {/* Header Controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-4">
          <button 
            onClick={() => setActiveView('chat')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-deep/90 text-foreground/40 hover:text-primary border border-white/5 transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">Back to Chat</span>
          </button>

          <button 
            onClick={() => setIsEditingHero(!isEditingHero)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-deep/90 text-foreground/40 hover:text-primary border border-white/5 transition-all group"
          >
            {isEditingHero ? <X size={16} /> : <Camera size={16} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{isEditingHero ? 'Cancel' : 'Update Hero'}</span>
          </button>

          <button 
            onClick={() => toggleMuteChannel(activeConversationId!)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-deep/90 border border-white/5 transition-all group",
              isChannelMuted ? "text-rose-400 hover:text-rose-500" : "text-foreground/40 hover:text-foreground"
            )}
          >
            {isChannelMuted ? <BellOff size={16} /> : <Bell size={16} />}
            <span className="text-[11px] font-black uppercase tracking-widest">{isChannelMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>

        {/* Hero Edit Panel */}
        <AnimatePresence>
          {isEditingHero && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 z-10 flex items-center justify-center p-10 bg-bg-deep/90"
            >
              <div className="w-full max-w-lg space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Choose New Hero</h3>
                  <span className="text-[10px] text-white/40 font-bold">NeoPlane Presets</span>
                </div>
                
                <div className="grid grid-cols-5 gap-3">
                  {HERO_PRESETS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        updateChannelHero(activeConversationId!, url);
                        setIsEditingHero(false);
                      }}
                      className="aspect-video rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all relative group"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                      {meta.heroImage === url && (
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                          <Plus size={20} className="text-white rotate-45" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Custom URL</span>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={customHeroUrl}
                      onChange={(e) => setCustomHeroUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 h-12 px-4 bg-white/10 border border-white/10 rounded-xl text-[13px] font-bold text-white outline-none focus:border-primary transition-all"
                    />
                    <button 
                      onClick={() => {
                        if (customHeroUrl) {
                          updateChannelHero(activeConversationId!, customHeroUrl);
                          setIsEditingHero(false);
                          setCustomHeroUrl('');
                        }
                      }}
                      className="px-6 h-12 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-light transition-all shadow-glow"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Channel Icon & Basic Info (Shifted Up & Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-10 left-10 flex items-center gap-6"
        >
          <div className="h-20 w-20 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-2xl shrink-0 relative overflow-hidden group/avatar">
            <Hash size={36} strokeWidth={2.5} className="relative z-10" />
            {meta.heroImage && (
              <img src={meta.heroImage} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm group-hover/avatar:opacity-40 transition-opacity" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">{meta.name}</h1>
              <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-foreground/20 uppercase tracking-widest">
                Public Channel
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2.5">
              <div className="flex items-center gap-1.5 text-foreground/30">
                <Users size={12} />
                <span className="text-[11px] font-bold">{meta.memberCount} Members</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-white/10" />
              <div className="flex items-center gap-1.5 text-emerald-400/60">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold">{meta.online.length} Online</span>
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
        className="grid grid-cols-12 gap-8 px-10 pt-16 pb-10 max-w-7xl mx-auto w-full"
      >
        {/* Left Column: Description & Groups */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* About Section */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">About this channel</h3>
            </div>
            <div className="p-8 rounded-3xl bg-bg-deep/90 border border-white/[0.03] relative overflow-hidden group">
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
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Active Sub-channels</h3>
                </div>
                <button 
                  onClick={() => setActiveView('create-group')}
                  className="flex items-center gap-2 group text-primary/60 hover:text-primary transition-colors"
                >
                  <Plus size={14} />
                  <span className="text-[10px] font-black tracking-widest uppercase">Create Group</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meta.groups.map(group => {
                  const groupKey = `${activeConversationId}:${group.id}`;
                  const isMuted = mutedGroupIds.includes(groupKey);
                  return (
                  <div 
                    key={group.id}
                    className="p-5 rounded-2xl bg-bg-deep/90 border border-white/[0.04] hover:border-primary/20 transition-all group/card cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-white/[0.03] flex items-center justify-center text-foreground/30 group-hover/card:text-primary transition-colors">
                          <Hash size={16} />
                        </div>
                        <h4 className="text-[14px] font-bold text-foreground/70 group-hover/card:text-foreground transition-colors">{group.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {!group.joined ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleGroupMembership(activeConversationId!, group.id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                          >
                            Join
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 text-[9px] font-black uppercase tracking-tighter">
                              Joined
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMuteGroup(activeConversationId!, group.id);
                              }}
                              className={clsx(
                                "px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all",
                                isMuted 
                                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20" 
                                  : "bg-white/5 text-foreground/40 border-white/10 hover:text-foreground/80 hover:bg-white/10"
                              )}
                              title={isMuted ? "Unmute Group" : "Mute Group"}
                            >
                              {isMuted ? <BellOff size={12} /> : <Bell size={12} />}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Are you sure you want to leave ${group.name}?`)) {
                                  toggleGroupMembership(activeConversationId!, group.id);
                                }
                              }}
                              className="px-2 py-1.5 rounded-lg bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Leave
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-foreground/30 leading-relaxed">
                      Detailed discussion and focused collaboration for {group.name.toLowerCase()}.
                    </p>
                  </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Shared Assets</h3>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-deep/90 border border-white/5">
                {(['media', 'docs', 'links'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden group cursor-pointer relative">
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <ImageIcon size={24} className="text-white drop-shadow-lg" />
                        </div>
                        <div className="h-full w-full bg-primary/5 flex items-center justify-center opacity-40 group-hover:scale-110 transition-transform duration-700">
                          <ImageIcon size={24} className="text-foreground/20" />
                        </div>
                      </div>
                    ))}
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
                    {[
                      { name: 'Architecture_Phase1.pdf', size: '2.4 MB', type: 'PDF' },
                      { name: 'User_Personas_v2.docx', size: '1.2 MB', type: 'DOCX' },
                      { name: 'System_Requirements.xlsx', size: '840 KB', type: 'XLSX' },
                      { name: 'Brand_Guidelines.pdf', size: '12.1 MB', type: 'PDF' }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[13px] font-bold text-foreground/70 truncate group-hover:text-foreground transition-colors">{doc.name}</p>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-foreground/20">{doc.size} • {doc.type}</span>
                        </div>
                        <Download size={16} className="text-foreground/10 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'links' && (
                  <motion.div 
                    key="links"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {[
                      { title: 'NeoPlane Design Case Study', url: 'neoplane.io/case-study', site: 'NeoPlane' },
                      { title: 'Modern UI/UX Trends 2026', url: 'designers.hub/trends', site: 'DesignerHub' },
                      { title: 'Advanced Framer Motion Tips', url: 'motion.dev/docs/advanced', site: 'Framer Motion' }
                    ].map((link, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group cursor-pointer">
                        <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                          <LinkIcon size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[13px] font-bold text-foreground/70 truncate group-hover:text-foreground transition-colors">{link.title}</p>
                          <span className="text-[10px] text-foreground/20 font-medium">{link.url}</span>
                        </div>
                        <ExternalLink size={16} className="text-foreground/10 group-hover:text-secondary transition-colors" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-primary hover:border-primary/20 transition-all group">
              <span>View Full Archive</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.section>
        </div>

        {/* Right Column: Sidebar Meta */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-bg-deep/90 border border-white/[0.05] space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Top Contributors</h3>
            </div>
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

          <motion.section variants={itemVariants} className="p-6 rounded-3xl bg-rose-500/[0.02] border border-rose-500/10 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-500/40">
              <div className="w-1 h-[10px] bg-rose-500/40 rounded-full shrink-0" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.12em]">Danger Zone</h3>
            </div>
            <p className="text-[11px] font-medium text-foreground/20 leading-tight">
              Leaving # {meta.name} will remove you from all sub-channels. You can rejoin via explorer.
            </p>
            <button 
              onClick={() => {
                if (confirm(`Are you sure you want to leave #${meta.name}?`)) {
                  leaveChannel(activeConversationId!);
                }
              }}
              className="w-full py-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-[10px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 transition-all font-black"
            >
              Leave Channel
            </button>
          </motion.section>

        </div>
      </motion.div>
    </div>
  );
};
