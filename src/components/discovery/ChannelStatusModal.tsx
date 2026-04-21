import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';

export const ChannelStatusModal: React.FC = () => {
  const activeStatusModalChannel = useConversationsStore((s) => s.activeStatusModalChannel);
  const setActiveStatusModalChannel = useConversationsStore((s) => s.setActiveStatusModalChannel);
  const setActiveConversation = useAppStore((s) => s.setActiveConversation);

  if (!activeStatusModalChannel) return null;

  const handleGoToChannel = () => {
    setActiveConversation(activeStatusModalChannel.id);
    setActiveStatusModalChannel(null);
  };

  const handleClose = () => {
    setActiveStatusModalChannel(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 30 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 30 }}
           transition={{ type: "spring", damping: 25, stiffness: 350 }}
           className="relative w-full max-w-[420px] bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Hero background image */}
          <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden">
            <img 
              src={activeStatusModalChannel.heroImage || '/presets/default-hero.jpg'} 
              className="w-full h-full object-cover opacity-30 grayscale-[50%]"
              alt="Channel Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>

          <div className="relative pt-12 pb-8 px-8">
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-all transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Status Icon */}
              <div className="relative mb-6">
                <div className="h-20 w-20 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-glow-sm">
                  <ShieldCheck size={40} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-xl p-1.5 border-4 border-card shadow-glow">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-foreground tracking-tight uppercase">
                    Already a Member
                </h3>
                <p className="text-[13px] text-foreground/40 font-medium max-w-[280px] leading-relaxed">
                   You're already part of <span className="text-foreground font-bold">#{activeStatusModalChannel.name}</span>. Jump back into the conversation!
                </p>
              </div>

              <div className="w-full space-y-3">
                <Button 
                  onClick={handleGoToChannel}
                  className="w-full h-14 rounded-2xl bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-widest text-[11px] shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2"
                >
                   Jump to Channel <ArrowRight size={14} className="ml-1" />
                </Button>
                
                <button
                  onClick={handleClose}
                  className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
