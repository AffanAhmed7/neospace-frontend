import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Rocket } from 'lucide-react';

export const WelcomeStep: React.FC = () => {
  const nextStep = useOnboardingStore((state) => state.nextStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center space-y-6"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4">
        <Rocket className="w-10 h-10 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to NeoPlane</h1>
        <p className="text-foreground/60 max-w-[280px] mx-auto">
          Let's set up your workspace in a few simple steps.
        </p>
      </div>

      <Button 
        onClick={nextStep}
        className="w-full max-w-[200px] h-12 text-lg"
      >
        Continue
      </Button>
    </motion.div>
  );
};
