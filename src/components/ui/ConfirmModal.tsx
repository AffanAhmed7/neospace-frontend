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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[400px] bg-[#1a1b1e] border border-white/[0.08] rounded-[32px] overflow-hidden shadow-2xl p-8 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
              <AlertCircle size={32} />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-foreground/50 font-medium leading-relaxed mb-8">
              {message}
            </p>

            <div className="flex flex-col w-full gap-3">
              <Button 
                onClick={handleConfirm}
                className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                {confirmLabel || 'Confirm'}
              </Button>
              <Button 
                variant="ghost"
                onClick={closeConfirm}
                className="w-full h-12 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-foreground/60 font-bold"
              >
                Cancel
              </Button>
            </div>

            <button 
              onClick={closeConfirm}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-foreground/20 hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
