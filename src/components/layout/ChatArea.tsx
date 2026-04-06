import React, { useEffect } from 'react';
import { Hash, PanelRight, MessageSquare, Send, Paperclip, Smile, Search, Bell, User, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

export const ChatArea: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const toggleNotificationPanel = useAppStore((state) => state.toggleNotificationPanel);

  // Keyboard shortcut: ESC to clear active conversation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveConversation(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveConversation]);

  return (
    <div className="flex flex-col h-full bg-transparent relative selection:bg-primary/20">
      {/* Header */}
      <header className="flex h-[60px] items-center justify-between border-b border-white/[0.03] px-6 shrink-0 glass-2 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          {activeConversationId ? (
            <>
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary transition-colors">
                <Hash size={18} className="text-glow" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-bold text-foreground text-base tracking-tight leading-none mb-0.5">
                  {activeConversationId === '1' ? 'general' : activeConversationId === '2' ? 'announcements' : 'engineering'}
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent tracking-wide uppercase">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                  <span>14 online</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 bg-white/[0.03] rounded-lg flex items-center justify-center">
                  <MessageSquare size={18} className="text-foreground/10" />
               </div>
               <h2 className="font-bold text-foreground/20 text-base tracking-tight">Select a conversation</h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" className="p-2 h-auto rounded-lg hover:bg-white/5 text-foreground/30 hover:text-primary transition-all" onClick={() => useAppStore.getState().toggleCommandPalette()}>
            <Search size={18} />
          </Button>
          <Button variant="ghost" className="p-2 h-auto rounded-lg hover:bg-white/5 text-foreground/30 hover:text-primary transition-all" onClick={toggleNotificationPanel}>
            <Bell size={18} />
          </Button>
          <div className="w-px h-4 bg-white/[0.03] mx-1.5 hidden lg:block" />
          <Button
            variant="ghost"
            className="p-2 h-auto hidden lg:flex rounded-lg hover:bg-white/5 text-foreground/30 hover:text-primary transition-all"
            onClick={toggleRightPanel}
          >
            <PanelRight size={18} />
          </Button>
        </div>
      </header>

      {/* Main Chat Body / Messages */}
      <div className="flex-grow overflow-y-auto relative flex flex-col p-8">
       {!activeConversationId ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
              <div className="h-24 w-24 bg-white/[0.03] backdrop-blur-3xl rounded-3xl border border-white/[0.05] flex items-center justify-center relative z-10 shadow-glow-sm">
                <Hexagon size={40} strokeWidth={1} className="text-primary text-glow drop-shadow-2xl" />
              </div>
            </motion.div>
            
            <h3 className="text-3xl font-bold text-foreground mb-3 tracking-tighter text-glow uppercase">
              Select a conversation.
            </h3>
            <p className="text-[15px] text-foreground/30 leading-relaxed mb-8 max-w-sm mx-auto font-medium">
              NeoPlane is where your team's greatest ideas come to life. Select a channel to get started.
            </p>
            
            <div className="flex flex-col gap-2 w-full max-w-[240px]">
              {[
                { label: 'Browse Channels', icon: Hash, color: 'text-primary' },
                { label: 'Invite Teammates', icon: User, color: 'text-secondary' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between gap-4 h-11 glass-2 hover:bg-primary/5 border-white/[0.02] hover:border-primary/20 transition-all duration-300 px-4 group"
                  >
                    <span className="text-[13px] font-semibold tracking-tight text-foreground/50 group-hover:text-primary transition-colors">{item.label}</span>
                    <item.icon size={14} className={clsx("opacity-40 group-hover:opacity-100", item.color)} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex-grow flex flex-col justify-end gap-3 pb-6">
               {/* Message List Simulation */}
               <div className="flex flex-col items-center text-center opacity-30 mb-8 border-b border-white/[0.02] pb-8">
                  <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4">
                     <Hash size={32} className="text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground tracking-tight">#general</h4>
                  <p className="text-xs font-medium max-w-xs mt-1">This is the very beginning of the general channel.</p>
                  <div className="mt-4 flex gap-2">
                     <Button variant="ghost" className="h-8 glass text-[10px] uppercase tracking-widest font-bold">Edit Channel</Button>
                  </div>
               </div>

               {/* Sample Messages */}
               <MessageBubble 
                 user={{ name: 'Alex Rivera', avatar: null }} 
                 content="Has anyone seen the latest design specs for the dashboard?" 
                 time="10:24 AM" 
               />
               <MessageBubble 
                 user={{ name: 'Jordan Lee', avatar: null }} 
                 content="I just uploaded them to the #engineering channel. They look amazing! 🚀" 
                 time="10:26 AM" 
                 isOwn
               />
            </div>
          </div>
        )}
      </div>

      {/* Footer / Input Area */}
      {activeConversationId && (
        <div className="px-6 pb-6 pt-2 z-30">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 blur-[40px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <div className="relative glass-2 bg-white/[0.01] border-white/[0.05] focus-within:border-primary/20 rounded-xl p-1.5 transition-all duration-300 shadow-premium group-focus-within:shadow-[0_0_40px_rgba(99,102,241,0.05)]">
                <div className="flex items-end gap-1.5 pr-1.5">
                  <Button variant="ghost" className="p-2.5 h-auto shrink-0 text-foreground/20 hover:text-primary rounded-lg hover:bg-white/5 transition-all">
                    <Paperclip size={16} />
                  </Button>
                  <textarea
                    rows={1}
                    placeholder={`Message #general`}
                    className="flex-grow bg-transparent border-0 focus:ring-0 text-[14px] py-2.5 px-2 resize-none text-foreground placeholder:text-foreground/10 min-h-[40px] max-h-[200px] font-medium leading-relaxed"
                    onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                  <div className="flex items-center gap-1.5 shrink-0 pb-1 pr-0.5">
                    <Button variant="ghost" className="p-2.5 h-auto text-foreground/20 hover:text-yellow-500 rounded-lg hover:bg-white/5 transition-all">
                      <Smile size={16} />
                    </Button>
                    <button className="h-9 w-9 bg-primary shadow-glow-sm rounded-lg flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300">
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3 opacity-20">
               <p className="text-[9px] text-foreground font-bold tracking-wider uppercase">Press Enter to send</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MessageBubble: React.FC<{ user: { name: string; avatar: string | null }; content: string; time: string; isOwn?: boolean }> = ({ user, content, time, isOwn }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex gap-3 group px-4 py-1 hover:bg-white/[0.01] transition-colors rounded-lg", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar size="sm" alt={user.name} className="mt-0.5 shadow-md border-none h-8 w-8" />
      <div className={clsx("flex flex-col max-w-[80%]", isOwn ? "items-end" : "items-start")}>
        <div className="flex items-center gap-2 mb-0.5 px-0.5">
          <span className="text-[12px] font-bold text-foreground/60">{user.name}</span>
          <span className="text-[9px] font-bold text-foreground/10 uppercase tracking-tighter">{time}</span>
        </div>
        <div 
          className={clsx(
            "px-3.5 py-2 rounded-2xl text-[14px] font-medium leading-relaxed shadow-sm transition-all duration-300 border border-white/[0.02]",
            isOwn 
              ? "bg-primary text-white rounded-tr-none shadow-glow-sm" 
              : "glass-2 bg-surface text-foreground rounded-tl-none hover:bg-white/[0.03]"
          )}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
};
