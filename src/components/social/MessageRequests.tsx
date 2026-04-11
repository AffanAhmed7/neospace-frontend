import React, { useState } from 'react';
import { 
  Search, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';

// ─── Data ────────────────────────────────────────────────────────────────────

interface MessageRequest {
  id: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
  mutualFriends: number;
  isSpam: boolean;
}

const mockRequests: MessageRequest[] = [
  { 
    id: '4', // Marcus Wright
    name: 'Marcus Wright', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    message: "Hey! I saw your work on the NeoPlane design system. Any chance you're open for a quick chat about a collab?",
    time: '2h ago',
    mutualFriends: 3,
    isSpam: false
  },
  { 
    id: '5', // Elena Rossi
    name: 'Elena Rossi', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    message: "Found your profile through the engineering channel. Wanted to ask about the deployment pipeline you mentioned.",
    time: '5h ago',
    mutualFriends: 1,
    isSpam: false
  },
  { 
    id: 'p1', // David Kim (Guest/New)
    name: 'David Kim', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    message: "URGENT: Click here to claim your NeoPlane reward! bit.ly/not-a-scam-trust-me",
    time: '1d ago',
    mutualFriends: 0,
    isSpam: true
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export const MessageRequests: React.FC = () => {
  const [requests] = useState<MessageRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);

  const filteredRequests = requests.filter(req => 
    req.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenPreview = (id: string) => {
    setActiveConversation(id);
  };

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
      <header className="flex h-[72px] items-center justify-between border-b border-white/[0.03] px-10 shrink-0 bg-bg-deep/90 z-50 sticky top-0 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 pr-6 border-r border-white/[0.05] group"
          >
            <ArrowLeft size={18} className="text-foreground/30 group-hover:text-primary transition-colors" />
            <h2 className="font-black text-foreground text-[14px] tracking-widest uppercase group-hover:text-glow transition-all">Back</h2>
          </button>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="text-[17px] font-black uppercase tracking-tighter text-foreground">Message Requests</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20">
                {requests.length}
              </span>
            </div>
            <p className="text-[9px] text-foreground/20 font-black uppercase tracking-[0.2em] mt-1">Pending Invitations</p>
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
              className="w-full h-10 pl-10 pr-4 bg-white/[0.02] border border-white/[0.05] rounded-xl text-[13px] font-medium focus:outline-none focus:border-primary/30 transition-all outline-none"
            />
          </div>
        </div>
      </header>

      {/* ─── Main Content Area ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full px-6 py-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredRequests.map(req => (
                <motion.div
                  key={req.id}
                  variants={itemVariants}
                  layout
                  onClick={() => handleOpenPreview(req.id)}
                  className="group relative flex items-start gap-5 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {/* User Profile - No Rings/Borders */}
                  <div className="relative shrink-0">
                    <Avatar src={req.avatar} alt={req.name} size="md" className="h-10 w-10" />
                  </div>

                  {/* Message Content */}
                  <div className="flex-grow min-w-0 py-0.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-[14px] font-black text-foreground/80 lowercase tracking-tight group-hover:text-primary transition-colors">
                        {req.name}
                      </h4>
                      <span className="text-[10px] font-bold text-foreground/10 uppercase tracking-widest">{req.time}</span>
                    </div>
                    
                    <p className="text-[13px] text-foreground/30 font-medium line-clamp-1 pr-10 italic">
                      {req.message}
                    </p>

                    {/* Security Info - Simplistic text at bottom */}
                    <div className="mt-2 flex items-center gap-3">
                      {req.isSpam && (
                        <span className="text-[10px] text-rose-500/40 font-black uppercase tracking-widest">
                          Potential spam or security risk detected
                        </span>
                      )}
                      {req.mutualFriends > 0 && (
                        <span className="text-[10px] text-foreground/15 font-black uppercase tracking-widest">
                          {req.mutualFriends} mutual friends
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center select-none space-y-4">
                <div className="h-16 w-16 rounded-3xl bg-white/[0.02] flex items-center justify-center border border-white/[0.05]">
                  <Search size={24} strokeWidth={1.5} className="text-foreground/10" />
                </div>
                <div>
                  <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground/40">Inbox Optimized</h4>
                  <p className="text-[11px] text-foreground/20 font-medium mt-1">Clean slate! No pending requests.</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Bottom Security Note - Plain text only */}
          <div className="mt-16 pt-8 border-t border-white/[0.02]">
            <p className="text-[11px] text-foreground/15 font-medium leading-relaxed max-w-2xl">
              Security Notice: Your online status and read receipts are hidden until you accept a request. Use the "Ignore & Delete" option in the DM preview to clear invitations without notifying the sender.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
