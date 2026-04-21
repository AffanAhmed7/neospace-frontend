import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useSettingsStore, type Toast as ToastType } from '../../store/useSettingsStore';
import { clsx } from 'clsx';

export const ToastProvider: React.FC = () => {
  const toasts = useSettingsStore((state) => state.toasts);
  const removeToast = useSettingsStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 2000; // Match the store's auto-remove timeout

  useEffect(() => {
    const startTime = Date.now();
    const interval = 10;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const variants = {
    success: {
      icon: <Check className="w-3.5 h-3.5 text-sky-400" />,
      border: 'border-sky-500/20',
      bg: 'bg-sky-500/10',
      glow: 'shadow-[0_8px_32px_rgba(14,165,233,0.12)]',
      progress: 'bg-sky-400'
    },
    error: {
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
      border: 'border-rose-500/20',
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_8px_32px_rgba(244,63,94,0.12)]',
      progress: 'bg-rose-400'
    },
    info: {
      icon: <Info className="w-3.5 h-3.5 text-indigo-400" />,
      border: 'border-indigo-500/20',
      bg: 'bg-indigo-500/10',
      glow: 'shadow-[0_8px_32px_rgba(99,102,241,0.12)]',
      progress: 'bg-indigo-400'
    }
  };

  const style = variants[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      className={clsx(
        "pointer-events-auto relative group min-w-[220px] max-w-[320px] overflow-hidden",
        "rounded-xl border backdrop-blur-2xl shadow-2xl transition-all duration-300",
        style.border, style.bg, style.glow
      )}
    >
      <div className="p-2.5 flex items-center gap-3">
        {/* Status Icon with inner glow */}
        <div className={clsx(
          "shrink-0 w-6 h-6 rounded-md flex items-center justify-center border",
          style.border, "bg-white/[0.05] shadow-inner"
        )}>
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase text-white/90 tracking-[0.08em] leading-none mb-1">
            {toast.type === 'success' ? 'Confirmed' : toast.type === 'error' ? 'Security' : 'System'}
          </p>
          <p className="text-[11px] font-medium text-white/50 leading-tight">
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-white/10 hover:text-white/50 transition-all opacity-0 group-hover:opacity-100"
        >
          <X size={12} />
        </button>
      </div>

      {/* Modern Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/[0.05]">
        <motion.div 
          className={clsx("h-full opacity-60", style.progress)}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};
