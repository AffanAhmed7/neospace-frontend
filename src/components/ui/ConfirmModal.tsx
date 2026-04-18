import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from './Button';

export const ConfirmModal: React.FC = () => {
  const { isOpen, title, message, confirmLabel, onConfirm } = useAppStore((state) => state.confirmModal);
  const closeConfirm = useAppStore((state) => state.closeConfirm);

  const handleConfirm = () => {
    onConfirm();
    closeConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeConfirm}
            className="absolute inset-0 bg-black/80"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[380px] bg-[#141517] border border-white/[0.08] rounded-[40px] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.7)] p-10 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-[32px] bg-rose-500/10 flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-inner">
              <AlertCircle size={40} />
            </div>

            <h3 className="text-[22px] font-black text-white tracking-tight mb-3">
              {title}
            </h3>
            <p className="text-[13px] font-bold text-white/40 leading-relaxed mb-10 px-4">
              {message}
            </p>

            <div className="flex flex-col w-full gap-3">
              <Button 
                onClick={handleConfirm}
                className="w-full h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[11px] shadow-glow-sm transition-all active:scale-[0.98]"
              >
                {confirmLabel || 'Confirm Action'}
              </Button>
              <Button 
                variant="ghost"
                onClick={closeConfirm}
                className="w-full h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-white/40 font-black uppercase tracking-widest text-[11px] transition-all hover:text-white"
              >
                Cancel
              </Button>
            </div>

            <button 
              onClick={closeConfirm}
              className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/5 text-white/10 hover:text-white/40 transition-all"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
