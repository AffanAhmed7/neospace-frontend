import React from 'react';
import { motion } from 'framer-motion';
import {
  Hash, Users,
  ArrowRight, MessageSquare, Star
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const recentChannels = [
  { id: '1', name: 'general', lastMsg: 'Alex: yo the new deploy is 🔥', time: '2m ago', unread: 3 },
  { id: '3', name: 'engineering', lastMsg: 'Jordan: fixed the race condition finally', time: '14m ago', unread: 0 },
  { id: '2', name: 'global-chat', lastMsg: 'Sarah: anyone free for a quick sync?', time: '1h ago', unread: 1 },
];

const activity = [
  {
    id: 'a1',
    userId: '1',
    user: 'Alex Rivera',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    action: 'sent a message in',
    target: '#general',
    preview: 'yo the new deploy is absolutely 🔥 — we went from 4.2s to 800ms',
    time: '2m ago',
    status: 'online' as const,
  },
  {
    id: 'a2',
    userId: '2',
    user: 'Jordan Lee',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    action: 'started a thread in',
    target: '#engineering',
    preview: 'Race condition in the auth middleware — found the root cause',
    time: '14m ago',
    status: 'busy' as const,
  },
  {
    id: 'a3',
    userId: '3',
    user: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    action: 'pinned a message in',
    target: '#global-chat',
    preview: 'Sprint planning is Thursday at 3pm — please block your calendars',
    time: '1h ago',
    status: 'idle' as const,
  },
  {
    id: 'a4',
    userId: '4', // Marcus Wright
    user: 'Marcus Wright',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    action: 'reacted to your message in',
    target: '#general',
    preview: '🎉 +5 others reacted with 🔥',
    time: '2h ago',
    status: 'online' as const,
  },
];

const statusColor = {
  online: 'bg-emerald-400',
  busy: 'bg-rose-400',
  idle: 'bg-amber-400',
  offline: 'bg-white/20',
};

const stats = [
  { label: 'Channels', value: '3', icon: Hash, color: 'text-primary' },
  { label: 'Online Now', value: '6', icon: Users, color: 'text-emerald-400' },
  { label: 'Unread', value: '4', icon: MessageSquare, color: 'text-amber-400' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const HomeDashboard: React.FC = () => {
  const setActiveConversation = useAppStore((s) => s.setActiveConversation);
  const toggleProfilePanel = useAppStore((s) => s.toggleProfilePanel);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto custom-scrollbar">
      {/* ─── Body ───────────────────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 p-6 pt-12 space-y-6 max-w-3xl w-full mx-auto"
      >
        {/* Greeting */}
        <motion.div variants={item} className="pt-2">
          <h1 className="text-3xl font-light text-foreground tracking-tight">
            Good morning, <span className="text-primary font-medium">Jane</span>
          </h1>
          <p className="text-[13px] text-foreground/30 font-medium mt-1">
            Here's what's been happening while you were away.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all"
            >
              <s.icon size={16} className={s.color} />
              <div>
                <div className="text-[15px] font-black text-foreground truncate">{s.value}</div>
                <div className="text-[10px] font-bold text-foreground/25 uppercase tracking-widest">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Jump back in */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Continue Discovery</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentChannels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveConversation(ch.id)}
                className="group flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-primary/20 text-left transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] group-hover:bg-primary/10 transition-colors">
                      <Hash size={13} className="text-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[13px] font-bold text-foreground/60 group-hover:text-foreground transition-colors">
                      {ch.name}
                    </span>
                  </div>
                  {ch.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-black min-w-[16px] text-center shadow-[0_0_8px_rgba(99,102,241,0.4)]">
                      {ch.unread}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-foreground/25 truncate font-medium leading-snug pl-0.5">
                  {ch.lastMsg}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-foreground/15 font-medium">{ch.time}</span>
                  <ArrowRight size={12} className="text-foreground/10 group-hover:text-primary/40 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Latest Activity</span>
          </div>

          <div className="space-y-1">
            {activity.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                onClick={() => toggleProfilePanel(a.userId)}
                className="group flex items-start gap-3 p-3.5 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer"
              >
                <div className="relative shrink-0 mt-0.5" onClick={(e) => { e.stopPropagation(); toggleProfilePanel(a.userId); }}>
                  <Avatar src={a.avatar} alt={a.user} size="sm" className="h-8 w-8 ring-1 ring-white/[0.05]" />
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#0D0D0D] ${statusColor[a.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span 
                      className="text-[12px] font-bold text-foreground/70 group-hover:text-foreground transition-colors" 
                      onClick={(e) => { e.stopPropagation(); toggleProfilePanel(a.userId); }}
                    >
                      {a.user}
                    </span>
                    <span className="text-[11px] text-foreground/25 font-medium">{a.action}</span>
                    <span className="text-[11px] font-bold text-primary/60">{a.target}</span>
                  </div>
                  <p className="text-[11px] text-foreground/30 font-medium mt-0.5 truncate leading-snug group-hover:text-foreground/50 transition-colors">
                    {a.preview}
                  </p>
                </div>
                <span className="text-[10px] text-foreground/15 font-medium shrink-0 mt-0.5">{a.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pinned / Starred */}
        <motion.div variants={item} className="pb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Pinned for You</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10 shrink-0">
              <Star size={18} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-foreground/60">Sprint planning is Thursday at 3pm</p>
              <p className="text-[10px] text-foreground/25 font-medium mt-0.5">Pinned by Sarah Chen · #global-chat · 1h ago</p>
            </div>
            <button
              onClick={() => setActiveConversation('2')}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.07] transition-all"
            >
              Go
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
