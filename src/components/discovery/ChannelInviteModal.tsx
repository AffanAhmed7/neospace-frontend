import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, X, ArrowRight } from 'lucide-react';
import { useConversationsStore } from '../../store/useConversationsStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const ChannelInviteModal: React.FC = () => {
  const activePromptInvite = useConversationsStore((s) => s.activePromptInvite);
  const setActivePromptInvite = useConversationsStore((s) => s.setActivePromptInvite);
  const acceptInvite = useConversationsStore((s) => s.acceptInvite);
  const declineInvite = useConversationsStore((s) => s.declineInvite);

  if (!activePromptInvite) return null;

  const handleAccept = async () => {
    const success = await acceptInvite(activePromptInvite.id);
    if (success) {
      setActivePromptInvite(null);
    }
  };

  const handleDecline = async () => {
    const success = await declineInvite(activePromptInvite.id);
    if (success) {
      setActivePromptInvite(null);
    }
  };

  const handleClose = () => {
    setActivePromptInvite(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-[440px] bg-card border border-border shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] rounded-[32px] overflow-hidden"
        >
          {/* Header Image Header */}
          <div className="relative h-32 w-full overflow-hidden">
            <img 
               src={activePromptInvite.conversation.heroImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'} 
               alt="Channel Hero"
               className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/40 hover:text-white transition-all backdrop-blur-md"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="px-8 pb-10 -mt-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* Inviter Info */}
              <div className="relative mb-6">
                <Avatar 
                  src={activePromptInvite.inviter.avatar} 
                  alt={activePromptInvite.inviter.username} 
                  size="lg" 
                  className="ring-4 ring-card shadow-2xl"
                />
                <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-xl p-1.5 border-4 border-card shadow-glow">
                  <Hash size={14} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">
                   New Invitation
                </h3>
                <p className="text-[13px] text-foreground/40 font-medium">
                  <span className="text-foreground font-bold">{activePromptInvite.inviter.username}</span> wants you to join their channel
                </p>
              </div>

              {/* Channel Card */}
              <div className="w-full bg-foreground/5 border border-border rounded-3xl p-5 mb-8 flex items-center gap-4 group/card hover:bg-foreground/10 transition-all cursor-default">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/card:scale-110 transition-transform">
                  <Hash size={24} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-[15px] font-black text-foreground truncate">
                    #{activePromptInvite.conversation.name}
                  </div>
                  <div className="text-[11px] font-bold text-foreground/20 uppercase tracking-widest mt-0.5">
                    {activePromptInvite.conversation.type}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  onClick={handleDecline}
                  variant="ghost"
                  className="h-13 rounded-2xl border border-border bg-foreground/5 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 text-foreground/40 font-black uppercase tracking-widest text-[11px] transition-all"
                >
                   Ignore
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="h-13 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest text-[11px] shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2"
                >
                   Accept <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
