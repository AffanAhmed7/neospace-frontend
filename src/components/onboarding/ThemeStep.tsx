import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';

export const ThemeStep: React.FC = () => {
  const { theme, setTheme, nextStep, prevStep } = useOnboardingStore();
  const setAppTheme = useAppStore((state) => state.setTheme);

  const handleSelectTheme = (value: 'light' | 'dark') => {
    setTheme(value);
    setAppTheme(value === 'light' ? 'offwhite' : 'dark');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex w-full max-w-md flex-col space-y-6"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Pick your theme</h2>
        <p className="text-sm text-foreground/60">
          Choose the visual mood for your workspace.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { id: 'dark' as const, label: 'Dark', preview: 'bg-[#010204]' },
          { id: 'light' as const, label: 'Light', preview: 'bg-[#F5F5F7]' },
        ].map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectTheme(option.id)}
            className={clsx(
              'rounded-2xl border p-4 text-left transition-all',
              theme === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-surface hover:border-primary/40'
            )}
          >
            <div className={clsx('mb-3 h-14 w-full rounded-lg border border-border/30', option.preview)} />
            <p className="text-sm font-bold">{option.label}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button variant="ghost" onClick={prevStep} className="flex-1 opacity-60 hover:opacity-100">
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Continue
        </Button>
      </div>
    </motion.div>
  );
};
