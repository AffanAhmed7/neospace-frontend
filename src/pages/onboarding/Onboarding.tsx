import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { WelcomeStep } from '../../components/onboarding/WelcomeStep';
import { WorkspaceStep } from '../../components/onboarding/WorkspaceStep';
import { InviteStep } from '../../components/onboarding/InviteStep';
import { ThemeStep } from '../../components/onboarding/ThemeStep';
import { CompletionStep } from '../../components/onboarding/CompletionStep';
import { clsx } from 'clsx';

export const Onboarding: React.FC = () => {
  const currentStep = useOnboardingStore((state) => state.currentStep);

  const steps = [
    { title: 'Welcome', component: <WelcomeStep /> },
    { title: 'Workspace', component: <WorkspaceStep /> },
    { title: 'Invite', component: <InviteStep /> },
    { title: 'Theme', component: <ThemeStep /> },
    { title: 'Finish', component: <CompletionStep /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-12 flex justify-between items-center relative gap-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-surface -translate-y-1/2 z-0 rounded-full" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentStep - 1) / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ width: '100%' }}
        />
        
        {steps.map((step, idx) => {
          const isActive = currentStep > idx;
          const isCurrent = currentStep === idx + 1;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isActive ? 'white' : 'var(--color-foreground)',
                }}
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors duration-300",
                  isActive ? "shadow-lg shadow-primary/20" : "opacity-40"
                )}
              >
                {idx + 1}
              </motion.div>
              <span className={clsx(
                "absolute top-10 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap transition-all duration-300",
                isCurrent ? "text-primary opacity-100" : "text-foreground opacity-20"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content Card */}
      <div className="w-full max-w-lg relative">
        <div className="absolute inset-0 bg-primary/20 blur-[100px] pointer-events-none rounded-full" />
        
        <motion.div
          layout
          className="relative bg-background/40 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl p-8 md:p-12 min-h-[440px] flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {steps[currentStep - 1].component}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Info */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-foreground/40 text-sm font-medium"
      >
        NeoPlane &copy; 2026 &middot; Premium Workspace Experience
      </motion.p>
    </div>
  );
};
