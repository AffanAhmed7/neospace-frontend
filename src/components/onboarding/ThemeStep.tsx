import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useAppStore } from '../../store/useAppStore';
import { Sun, Moon, Check } from 'lucide-react';
import { clsx } from 'clsx';

export const ThemeStep: React.FC = () => {
  const { nextStep, prevStep } = useOnboardingStore();
  const { theme, setTheme } = useAppStore();

  const themes = [
    { 
      id: 'dark', 
      name: 'Dark Mode', 
      icon: Moon, 
      colors: 'bg-[#020617] text-[#F8FAFC]',
      preview: 'bg-[#0F172A]'
    },
    { 
      id: 'light', 
      name: 'Light Mode', 
      icon: Sun, 
      colors: 'bg-white text-[#0F172A]',
      preview: 'bg-[#F1F5F9]'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col space-y-8 w-full max-w-md mx-auto"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Pick your style</h2>
        <p className="text-foreground/60 text-sm">
          Choose the theme that fits your workflow.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((t) => {
          const isActive = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as 'light' | 'dark')}
              className={clsx(
                'group relative flex flex-col items-center space-y-4 p-6 rounded-3xl border-2 transition-all duration-300 active:scale-95',
                isActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-surface hover:border-primary/50'
              )}
            >
              <div className="text-center w-full">
                <p className={clsx(
                  'font-bold mb-3 transition-colors duration-300',
                  isActive ? 'text-primary' : 'text-foreground/60'
                )}>
                  {t.name}
                </p>
                
                {/* Mini UI Preview */}
                <div className={clsx(
                  'w-full aspect-[4/3] rounded-xl p-2 flex flex-col gap-1.5 shadow-inner transition-all duration-300',
                  t.preview,
                  isActive ? 'ring-2 ring-primary/40' : 'opacity-80 group-hover:opacity-100'
                )}>
                  <div className="flex gap-1 items-center mb-1">
                    <div className="w-1 h-1 rounded-full bg-red-400/40" />
                    <div className="w-1 h-1 rounded-full bg-yellow-400/40" />
                    <div className="w-1 h-1 rounded-full bg-green-400/40" />
                  </div>
                  <div className="flex gap-2 h-full overflow-hidden">
                    <div className="w-1/4 h-full rounded-lg bg-foreground/5" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="w-full h-2 rounded-full bg-foreground/10" />
                      <div className="w-2/3 h-2 rounded-full bg-foreground/10" />
                      <div className="mt-auto flex justify-between items-center pb-1">
                        <div className="w-1/3 h-2 rounded-full bg-primary/20" />
                        <div className="w-5 h-5 rounded-full bg-primary shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="flex-1 opacity-60 hover:opacity-100"
        >
          Back
        </Button>
        <Button 
          onClick={nextStep}
          className="flex-1"
        >
          Confirm
        </Button>
      </div>
    </motion.div>
  );
};
