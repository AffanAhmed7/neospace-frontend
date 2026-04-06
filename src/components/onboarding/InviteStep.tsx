import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { Mail, Plus, X, Users2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const InviteStep: React.FC = () => {
  const { invitedEmails, addEmail, removeEmail, nextStep, prevStep } = useOnboardingStore();
  const [currentEmail, setCurrentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleAddEmail = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentEmail) return;
    
    if (!validateEmail(currentEmail)) {
      setError('Invalid email address');
      return;
    }

    if (invitedEmails.includes(currentEmail)) {
      setError('Email already added');
      return;
    }

    addEmail(currentEmail);
    setCurrentEmail('');
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col space-y-6 w-full max-w-md mx-auto"
    >
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Invite your team</h2>
        <p className="text-foreground/60 text-sm">
          Collaborative work is better with friends.
        </p>
      </div>

      <form onSubmit={handleAddEmail} className="relative group">
        <Input 
          placeholder="email@example.com"
          value={currentEmail}
          onChange={(e) => {
            setCurrentEmail(e.target.value);
            if (error) setError(null);
          }}
          icon={<Mail className="w-4 h-4" />}
          className="pr-12"
          error={error || undefined}
        />
        <button 
          type="submit"
          className="absolute right-2 top-2 p-1 bg-primary text-white rounded-xl hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="min-h-[100px] flex flex-wrap gap-2 p-4 bg-surface/50 border border-dashed border-border rounded-2xl">
        <AnimatePresence>
          {invitedEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full space-y-1 opacity-40">
              <Users2 className="w-6 h-6" />
              <span className="text-[10px] uppercase font-bold">No invites yet</span>
            </div>
          ) : (
            invitedEmails.map((email) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className="pl-3 pr-2 py-1 flex items-center gap-2 border-border/50 text-xs">
                  {email}
                  <button 
                    onClick={() => removeEmail(email)}
                    className="p-0.5 hover:bg-danger/20 hover:text-danger rounded-md transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </motion.div>
            ))
          )}
        </AnimatePresence>
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
          {invitedEmails.length > 0 ? 'Continue' : 'Skip for now'}
        </Button>
      </div>
    </motion.div>
  );
};
