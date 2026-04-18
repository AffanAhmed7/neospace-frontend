import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowLeft, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

export const MessageRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  
  const { user } = useAuthStore();
  const { conversations } = useConversationsStore();
  const { friends } = useFriendsStore();


  // Message Requests are DMs from people who are not friends
  const requests = useMemo(() => {
    const friendIds = new Set(friends.map(f => f.id));
    return conversations.filter(c => {
      if (c.type !== 'DIRECT') return false;
      const other = c.participants.find(p => p.user.id !== user?.id);
      return other && !friendIds.has(other.user.id);
    });
  }, [conversations, friends, user]);


  const filteredRequests = requests.filter(req => {
    const other = req.participants.find(p => p.user.id !== user?.id);
    return other?.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleOpenPreview = (id: string) => {
    setActiveConversation(id);
    setActiveView('chat');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      <header className="flex h-[72px] items-center justify-between border-b border-white/[0.03] px-10 shrink-0 bg-bg-deep/90 z-50 sticky top-0 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-8">
          <button onClick={() => setActiveView('home')} className="flex items-center gap-2 pr-6 border-r border-white/[0.05] group">
            <ArrowLeft size={18} className="text-foreground/30 group-hover:text-primary transition-colors" />
            <h2 className="font-black text-foreground text-[14px] tracking-widest uppercase group-hover:text-glow transition-all">Back</h2>
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-[17px] font-black uppercase tracking-tighter text-foreground">Message Requests</span>
              {requests.length > 0 && (
                <span className="ml-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20">
                  {requests.length}
                </span>
              )}
            </div>
            <p className="text-[9px] text-foreground/20 font-black uppercase tracking-[0.2em] mt-1">Pending Connections</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full max-w-sm ml-auto">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" size={14} />
            <input 
              type="text"
              placeholder="Filter requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[13px] font-medium focus:outline-none focus:border-primary/30 transition-all outline-none text-foreground"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full px-6 py-12">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map(req => {
                const other = req.participants.find(p => p.user.id !== user?.id);
                if (!other) return null;
                return (
                  <motion.div
                    key={req.id}
                    variants={itemVariants}
                    layout
                    onClick={() => handleOpenPreview(req.id)}
                    className="group relative flex items-start gap-5 cursor-pointer hover:bg-white/[0.02] p-4 rounded-2xl transition-all"
                  >
                    <div className="relative shrink-0">
                      <Avatar src={other.user.avatar} alt={other.user.username} size="md" className="h-10 w-10 ring-1 ring-white/10" />
                    </div>

                    <div className="flex-grow min-w-0 py-0.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-[14px] font-black text-foreground/80 lowercase tracking-tight group-hover:text-primary transition-colors">
                          {other.user.username}
                        </h4>
                        <span className="text-[10px] font-bold text-foreground/10 uppercase tracking-widest">
                          {req.updatedAt ? formatDistanceToNow(new Date(req.updatedAt), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      <p className="text-[13px] text-foreground/30 font-medium line-clamp-1 pr-10 italic">
                        Click to preview this message request
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center select-none space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-white/[0.02] flex items-center justify-center border border-white/[0.05]">
                  <Shield size={24} strokeWidth={1.5} className="text-foreground/10" />
                </div>
                <div>
                  <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground/40">Inbox Optimized</h4>
                  <p className="text-[11px] text-foreground/20 font-medium mt-1">Clean slate! No pending stranger requests.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
