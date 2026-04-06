import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { CheckCircle2, Sparkles, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const PARTICLES = Array.from({ length: 12 }).map(() => ({
  x: (Math.random() - 0.5) * 200,
  y: (Math.random() - 0.5) * 200,
  rotate: Math.random() * 360,
  delay: Math.random() * 2,
}));

export const CompletionStep: React.FC = () => {
  const navigate = useNavigate();
  const reset = useOnboardingStore((state) => state.reset);

  const handleFinish = () => {
    reset();
    navigate('/app');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center text-center space-y-8"
    >
      <div className="relative">
        {/* Confetti Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0.5],
              x: PARTICLES[i].x,
              y: PARTICLES[i].y,
              rotate: PARTICLES[i].rotate
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: PARTICLES[i].delay,
              ease: "easeOut"
            }}
            className={clsx(
              "absolute w-2 h-2 rounded-full",
              ["bg-primary", "bg-secondary", "bg-accent", "bg-yellow-400"][i % 4]
            )}
            style={{ top: '50%', left: '50%' }}
          />
        ))}

        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary/20 relative z-10"
        >
          <PartyPopper className="w-12 h-12" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="absolute -top-4 -right-4"
        >
          <Sparkles className="w-8 h-8 text-secondary" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute -bottom-2 -left-6"
        >
          <Sparkles className="w-6 h-6 text-accent" />
        </motion.div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">You're all set! 🎉</h2>
        <p className="text-foreground/60 max-w-[320px] mx-auto text-lg">
          Your workspace has been created and your team is ready to fly.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Workspace initialized</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Theme preferences applied</span>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Onboarding complete</span>
        </div>
      </div>

      <Button 
        onClick={handleFinish}
        className="w-full max-w-[240px] h-14 text-xl font-bold shadow-2xl shadow-primary/30 group"
      >
        Go to App
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="ml-2"
        >
          →
        </motion.span>
      </Button>
    </motion.div>
  );
};
