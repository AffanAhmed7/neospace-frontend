import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1200);
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-[380px] p-0 overflow-hidden bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)]"
    >
      <motion.div 
        layout
        className="relative px-7 py-8 overflow-hidden"
      >
        {/* Subtle background glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/20 blur-[80px] pointer-events-none -z-10 rounded-full" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 10 : -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center text-center gap-1.5 mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h2>
              <p className="text-slate-400 text-[13px] max-w-[260px] leading-snug">
                {mode === 'login' 
                  ? 'Sign in to access your platform' 
                  : 'Get started with the home for elite teams'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <Input
                label="Email"
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10.5 bg-white/[0.02] border-white/10 focus:border-primary/40 focus:ring-primary/10 rounded-xl placeholder:text-slate-600 text-[13px]"
                icon={<Mail size={15} className="text-slate-500" />}
              />
              
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  {mode === 'login' && (
                    <button type="button" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors">
                      Forgot?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder={mode === 'login' ? '••••••••' : 'Password (min. 8 characters)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10.5 bg-white/[0.02] border-white/10 focus:border-primary/40 focus:ring-primary/10 rounded-xl placeholder:text-slate-600 text-[13px]"
                  icon={<Lock size={15} className="text-slate-500" />}
                />
              </div>

              <Button 
                type="submit" 
                isLoading={isLoading}
                className="h-11 w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/10 transition-all mt-3 group px-6 text-[13px]"
              >
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? 'Log In' : 'Sign Up'}
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform opacity-70" />
                </span>
              </Button>
            </form>
          </motion.div>
        </AnimatePresence>

        <motion.div 
          initial={false}
          className="flex flex-col gap-4 mt-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">or securely with</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <Button 
            variant="ghost" 
            className="w-full bg-white/[0.02] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 h-10.5 rounded-xl flex items-center justify-center gap-3 transition-all scale-100 hover:scale-[1.01] active:scale-[0.99] group shadow-sm"
          >
            <GoogleIcon />
            <span className="text-[13px] font-semibold text-white/90">Continue with Google</span>
          </Button>
        </motion.div>

        <motion.div 
          className="mt-6 pt-5 border-t border-white/5 text-center"
        >
          <p className="text-[12px] text-slate-400">
            {mode === 'login' ? "New here?" : "Already a member?"}{' '}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-bold hover:text-white transition-all ml-1"
            >
              {mode === 'login' ? 'Create an account' : 'Log in instead'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </Modal>
  );
};
