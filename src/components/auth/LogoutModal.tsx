import React from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true} className="max-w-md bg-card border border-border">
      <div className="flex flex-col items-center text-center py-4">
        {/* Warning Icon with Glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full" />
          <div className="relative w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <LogOut size={32} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center text-rose-500">
            <AlertCircle size={14} />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight uppercase">End Session?</h2>
        <p className="text-foreground/40 text-[14px] font-medium leading-relaxed max-w-[280px] mb-8">
          Are you sure you want to log out? You'll need to sign back in to access your workspace and messages.
        </p>

        {/* Actions */}
        <div className="flex flex-col w-full gap-3">
          <Button 
            onClick={onConfirm}
            className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest text-[12px] shadow-[0_8px_20px_rgba(244,63,94,0.2)]"
          >
            Confirm Logout
          </Button>
          <button 
            onClick={onClose}
            className="w-full h-12 rounded-xl text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all font-bold text-[12px] uppercase tracking-widest"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </Modal>
  );
};
