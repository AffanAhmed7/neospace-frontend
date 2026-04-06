import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check as CheckIcon, AlertCircle, Info, X } from 'lucide-react';
import { useSettingsStore, type Toast as ToastType } from '../../store/useSettingsStore';
import { clsx } from 'clsx';

export const ToastProvider: React.FC = () => {
  const toasts = useSettingsStore((state) => state.toasts);
  const removeToast = useSettingsStore((state) => state.removeToast);

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastType; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckIcon className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  };

  const bgStyles = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    error: 'border-rose-500/20 bg-rose-500/5',
    info: 'border-sky-500/20 bg-sky-500/5'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.9 }}
      className={clsx(
        "pointer-events-auto min-w-[320px] max-w-sm rounded-[20px] border p-4 shadow-xl backdrop-blur-xl flex items-center gap-3 transition-colors duration-200",
        bgStyles[toast.type]
      )}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium text-foreground opacity-90">{toast.message}</p>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-foreground/5 rounded-lg text-foreground/40 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
