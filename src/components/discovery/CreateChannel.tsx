import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Globe, Shield, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { clsx } from 'clsx';

export const CreateChannel: React.FC = () => {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const createChannel = useAppStore((s) => s.createChannel);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    createChannel(name, description, 'General', isPrivate);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header */}
      <header className="flex h-[64px] items-center gap-3 border-b border-white/[0.03] px-5 shrink-0 glass-2 sticky top-0 z-10">
        <button
          onClick={() => setActiveView('home')}
          className="p-1.5 rounded-lg text-foreground/30 hover:text-foreground/70 hover:bg-white/[0.05] transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-[13px] font-bold text-foreground/60 tracking-tight">Create Channel</span>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center px-6 py-12">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md space-y-5"
        >
          {/* Title */}
          <div className="mb-6">
            <h2 className="text-xl font-black text-foreground tracking-tight">Create a channel</h2>
            <p className="text-[12px] text-foreground/30 font-medium mt-1">
              Channels are where conversations happen. Keep them focused.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[12px] font-bold"
            >
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Channel Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
              Channel Name
            </label>
            <div className="relative group">
              <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => {
                  setError('');
                  setName(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                placeholder="e.g. design-crit"
                className="w-full h-11 pl-10 pr-4 bg-white/[0.03] border border-white/[0.07] focus:border-primary/30 rounded-xl text-[14px] font-bold text-foreground placeholder:text-foreground/15 placeholder:font-normal outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
              Description
              <span className="normal-case font-medium tracking-normal text-foreground/20">Optional</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              rows={3}
              className="w-full p-3.5 bg-white/[0.03] border border-white/[0.07] focus:border-primary/30 rounded-xl text-[13px] font-medium text-foreground placeholder:text-foreground/15 outline-none resize-none transition-all"
            />
          </div>

          {/* Privacy */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">
              Privacy
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={clsx(
                  'flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all',
                  !isPrivate
                    ? 'bg-primary/10 border-primary/25 text-foreground'
                    : 'bg-white/[0.02] border-white/[0.05] text-foreground/40 hover:bg-white/[0.04]'
                )}
              >
                <Globe size={16} className={!isPrivate ? 'text-primary' : 'text-foreground/25'} />
                <div>
                  <div className="text-[12px] font-bold">Public</div>
                  <div className="text-[10px] text-foreground/30 font-medium">Anyone can join</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={clsx(
                  'flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all',
                  isPrivate
                    ? 'bg-rose-500/10 border-rose-500/25 text-foreground'
                    : 'bg-white/[0.02] border-white/[0.05] text-foreground/40 hover:bg-white/[0.04]'
                )}
              >
                <Shield size={16} className={isPrivate ? 'text-rose-400' : 'text-foreground/25'} />
                <div>
                  <div className="text-[12px] font-bold">Private</div>
                  <div className="text-[10px] text-foreground/30 font-medium">Invite only</div>
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveView('home')}
              className="flex-1 h-11 rounded-xl text-[12px] font-bold text-foreground/40 hover:text-foreground/70 hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.06]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl text-[12px] font-black bg-primary text-white hover:bg-primary/90 transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] disabled:opacity-40"
              disabled={name.trim().length < 3}
            >
              Create Channel
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};
