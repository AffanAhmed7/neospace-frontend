import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Globe, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { clsx } from 'clsx';

export const CreateGroup: React.FC = () => {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const activeConversationId = useAppStore((s) => s.activeConversationId);
  const { user } = useAuthStore();
  const { createConversation, conversations } = useConversationsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const meta = activeConversationId ? conversations.find(c => c.id === activeConversationId) : null;

  const isAdmin = React.useMemo(() => {
    if (!meta || !user) return false;
    return meta.participants.find(p => p.user.id === user.id)?.role === 'ADMIN' || meta.creatorId === user.id;
  }, [meta, user]);

  if (!activeConversationId || !meta) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-foreground/40 font-bold uppercase tracking-widest text-[11px]">Cannot create group: No active workspace channel.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-bg-deep/90">
        <div className="h-20 w-20 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-8 border border-rose-500/20">
          <Shield size={32} className="text-rose-500/60" />
        </div>
        <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2 uppercase">Access Denied</h3>
        <p className="text-[14px] text-foreground/30 leading-relaxed font-medium max-w-sm mb-8">
          Only administrators can create groups within this channel. Please contact a channel admin to request a new group.
        </p>
        <button 
          onClick={() => setActiveView('info')}
          className="px-8 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-white/[0.03] border border-white/[0.06] text-foreground/40 hover:text-foreground hover:bg-white/[0.08] transition-all"
        >
          Return to Channel Info
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Group name must be at least 2 characters.');
      return;
    }

    createConversation({
      name: name.trim(),
      type: 'GROUP',
      participantIds: [], // Creator is included automatically
      description,
      isPrivate,
      parentId: activeConversationId
    }).then((conv) => {
      if (conv) {
        setActiveView('chat');
      } else {
        setError('Failed to create group');
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center px-10 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Page Header */}
            <header className="flex h-[64px] items-center justify-between border-b border-white/[0.03] px-6 shrink-0 z-50 sticky top-0 backdrop-blur-md">
              <div className="flex items-start gap-5">
                <button
                  onClick={() => setActiveView('info')}
                  type="button"
                  className="mt-1 group flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] text-foreground/20 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase leading-none">Create a group</h2>
                  <p className="text-[12px] text-foreground/30 font-medium mt-2 max-w-lg leading-relaxed">
                    Groups are specialized sub-channels within #{meta.name}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveView('info')}
                  className="px-6 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-40"
                  disabled={name.trim().length < 2}
                >
                  Create Group
                </button>
              </div>
            </header>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[12px] font-bold"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Column 1: About */}
              <div className="space-y-8">
                <div className="space-y-4 pt-1">
                  
                  {/* Name Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Group Identity</label>
                    </div>
                    <div className="relative group">
                      <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={name}
                        autoFocus
                        onChange={(e) => {
                          setError('');
                          setName(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }}
                        placeholder="e.g. backend-api"
                        className="w-full h-14 pl-11 pr-4 bg-white/[0.02] border border-white/[0.06] focus:border-primary/40 rounded-2xl text-[15px] font-bold text-foreground placeholder:text-foreground/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2.5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">The Purpose <span className="normal-case font-medium opacity-50 tracking-normal ml-1">(Optional)</span></label>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What is the focus of this group?"
                      rows={4}
                      className="w-full p-4 bg-white/[0.02] border border-white/[0.06] focus:border-primary/40 rounded-2xl text-[14px] font-medium text-foreground placeholder:text-foreground/10 outline-none resize-none transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Settings */}
              <div className="space-y-8">
                <div className="space-y-4 pt-1">
                  
                  {/* Privacy */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Privacy Control</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPrivate(false)}
                        className={clsx(
                          'flex items-center gap-4 p-5 rounded-3xl border text-left transition-all',
                          !isPrivate
                            ? 'bg-primary/10 border-primary/25 text-foreground ring-1 ring-primary/20'
                            : 'bg-white/[0.02] border-white/[0.05] text-foreground/40 hover:bg-white/[0.04]'
                        )}
                      >
                        <Globe size={22} className={!isPrivate ? 'text-primary' : 'text-foreground/25'} />
                        <div>
                          <div className="text-[13px] font-bold truncate">Open Group</div>
                          <div className="text-[11px] text-foreground/20 font-medium">Anyone in #{meta.name} can view and join</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(true)}
                        className={clsx(
                          'flex items-center gap-4 p-5 rounded-3xl border text-left transition-all',
                          isPrivate
                            ? 'bg-rose-500/10 border-rose-500/25 text-foreground ring-1 ring-rose-500/20'
                            : 'bg-white/[0.02] border-white/[0.05] text-foreground/40 hover:bg-white/[0.04]'
                        )}
                      >
                        <Shield size={22} className={isPrivate ? 'text-rose-400' : 'text-foreground/25'} />
                        <div>
                          <div className="text-[13px] font-bold truncate">Private Group</div>
                          <div className="text-[11px] text-foreground/20 font-medium">Only invited members can view this group</div>
                        </div>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
