import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Hash, Users,
  UserPlus, Compass, Plus,
  Bell, History,
  ArrowRight, Zap
} from 'lucide-react';
import { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useNotificationsStore } from '../../store/useNotificationsStore';
import { formatDistanceToNow } from 'date-fns';

export const HomeDashboard: React.FC = () => {
  const setActiveConversation = useAppStore((s) => s.setActiveConversation);
  const { user } = useAuthStore();
  const { fetchConversations, conversations } = useConversationsStore();
  const { fetchFriends, fetchRequests, friends, pendingIncoming } = useFriendsStore();
  const { fetchNotifications, notifications, unreadCount } = useNotificationsStore();
  const setActiveView = useAppStore((s) => s.setActiveView);

  // Initial Data Hydration
  useEffect(() => {
    fetchConversations();
    fetchFriends();
    fetchRequests();
    fetchNotifications();
  }, [fetchConversations, fetchFriends, fetchRequests, fetchNotifications]);

  const stats = useMemo(() => [
    { 
      label: 'Total Channels', 
      value: conversations.filter(c => c.type === 'CHANNEL' || c.type === 'GROUP').length, 
      icon: Hash, 
      color: 'text-primary' 
    },
    { 
      label: 'Friends Online', 
      value: friends.filter(f => f.status !== 'OFFLINE').length, 
      icon: Users, 
      color: 'text-emerald-400' 
    },
    { 
      label: 'Alerts', 
      value: unreadCount, 
      icon: Bell, 
      color: 'text-amber-400' 
    },
  ], [conversations, friends, unreadCount]);

  const recentConversations = useMemo(() => {
    return conversations.filter(c => c.type !== 'DIRECT').slice(0, 3);
  }, [conversations]);

  const activityFeed = useMemo(() => {
    const list: any[] = [];
    
    // Add notifications
    notifications.forEach(n => {
      list.push({
        id: n.id,
        timestamp: new Date(n.createdAt),
        icon: <Bell size={14} className="text-amber-400" />,
        title: n.title || 'Notification',
        description: n.desc || 'New activity in your account',
        type: 'notification'
      });
    });

    // Add recent messages from conversations
    conversations.forEach(c => {
      const lastMsg = c.messages && c.messages[0];
      if (lastMsg) {
        list.push({
          id: `msg-${lastMsg.id}`,
          timestamp: new Date(lastMsg.createdAt),
          icon: <History size={14} className="text-primary" />,
          title: c.name || c.participants?.find(p => p.user.id !== user?.id)?.user.username || 'Group',
          description: lastMsg.content || "Sent an attachment",
          type: 'message'
        });
      }
    });

    return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);
  }, [notifications, conversations, user]);

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
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 p-6 pt-12 space-y-6 max-w-3xl w-full mx-auto"
      >
        {/* Greeting */}
        <motion.div variants={item} className="pt-2">
          <h1 className="text-3xl font-light text-foreground tracking-tight">
            Hello, <span className="text-primary font-medium">{user?.username || 'Pilot'}</span>
          </h1>
          <p className="text-[13px] text-foreground/30 font-medium mt-1">
            Welcome back to your dashboard.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all group"
            >
              <s.icon size={16} className={s.color} />
              <div>
                <p className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{s.value}</p>
                <div className="text-[10px] font-bold text-foreground/25 uppercase tracking-wider">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Conversations */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">Quick Access Channels</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recentConversations.map((ch) => (
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
                    <span className="text-[13px] font-bold text-foreground/60 group-hover:text-foreground transition-colors truncate">
                      {ch.name || ch.participants?.find(p => p.user.id !== user?.id)?.user.username || 'Group'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                   <ArrowRight size={12} className="text-foreground/10 group-hover:text-primary/40 transition-colors" />
                </div>
              </button>
            ))}
            {recentConversations.length === 0 && (
              <div className="col-span-3 py-6 px-4 text-center border border-dashed border-white/5 rounded-2xl">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/20">No active conversations found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">Recent Activity</span>
          </div>

          <div className="space-y-1">
            {activityFeed.map((act, i) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="group flex items-start gap-4 p-3.5 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer"
              >
                <div className="shrink-0 mt-0.5 w-8 h-8 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:border-primary/20 transition-all">
                   {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1.5 min-w-0">
                    <span className="text-[12px] font-bold text-foreground/70 group-hover:text-foreground transition-colors truncate">{act.title}</span>
                    <span className="text-[10px] text-foreground/15 font-medium shrink-0 group-hover:text-foreground/30 transition-colors">
                      {formatDistanceToNow(act.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/30 font-medium mt-0.5 truncate leading-snug group-hover:text-foreground/50 transition-colors italic">
                    {act.description}
                  </p>
                </div>
              </motion.div>
            ))}
            {activityFeed.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center opacity-20 border border-dashed border-white/5 rounded-2xl">
                 <Zap size={24} className="mb-2" />
                 <p className="text-[10px] font-bold uppercase tracking-wider text-center">No recent activity detected.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Access */}
        <motion.div variants={item} className="pb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">Quick Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Conditional: Pending Requests */}
            {pendingIncoming.length > 0 && (
              <button 
                onClick={() => setActiveView('friends')}
                className="col-span-1 sm:col-span-3 p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-5 hover:bg-primary/10 transition-all group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary shrink-0 shadow-glow-sm">
                  <UserPlus size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[14px] font-bold text-foreground uppercase tracking-wider">Friend Requests</p>
                  <p className="text-[11px] text-foreground/40 font-medium mt-0.5">You have {pendingIncoming.length} people waiting to connect with you.</p>
                </div>
                <ArrowRight size={18} className="text-primary/40 group-hover:translate-x-1 transition-all" />
              </button>
            )}

            {/* Quick Actions */}
            <button 
              onClick={() => setActiveView('explore')}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-4 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 shrink-0">
                <Compass size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[12px] font-bold text-foreground/70">Browse Channels</p>
                <p className="text-[10px] text-foreground/20 font-medium truncate">Discover public communities</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveView('friends')}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-4 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 shrink-0">
                <Users size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[12px] font-bold text-foreground/70">Find People</p>
                <p className="text-[10px] text-foreground/20 font-medium truncate">Search for friends and colleagues</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveView('create-channel')}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-4 hover:bg-white/[0.04] transition-all group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                <Plus size={20} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-[12px] font-bold text-foreground/70">Create Channel</p>
                <p className="text-[10px] text-foreground/20 font-medium truncate">Start a new group conversation</p>
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
