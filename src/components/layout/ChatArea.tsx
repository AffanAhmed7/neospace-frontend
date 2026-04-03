import React from 'react';
import { Hash, PanelRight, MessageSquare, Send, Paperclip, Smile, Search, Bell, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export const ChatArea: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const toggleNotificationPanel = useAppStore((state) => state.toggleNotificationPanel);

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <header className="flex h-[64px] items-center justify-between border-b border-border px-6 shrink-0 bg-background/50 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-3">
          {activeConversationId && (
            <>
              <div className="h-8 w-8 bg-surface rounded-2xl flex items-center justify-center text-foreground/50">
                <Hash size={18} />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg tracking-tight">
                  {activeConversationId === '1' ? 'general' : activeConversationId === '2' ? 'announcements' : 'engineering'}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span>14 online</span>
                </div>
              </div>
            </>
          )}
          {!activeConversationId && (
            <h2 className="font-bold text-foreground text-lg tracking-tight">Select a Chat</h2>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="p-2 h-auto" onClick={() => useAppStore.getState().toggleCommandPalette()}>
            <Search size={20} className="text-foreground/70" />
          </Button>
          <Button variant="ghost" className="p-2 h-auto" onClick={toggleNotificationPanel}>
            <Bell size={20} className="text-foreground/70" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 h-auto hidden lg:flex"
            onClick={toggleRightPanel}
          >
            <PanelRight size={20} className="text-foreground/70" />
          </Button>
          <Button variant="ghost" className="p-2 h-auto lg:hidden" onClick={() => useAppStore.getState().toggleSidebar()}>
             <Settings size={20} className="text-foreground/70" />
          </Button>
        </div>
      </header>

      {/* Main Chat Body / Messages */}
      <div className="flex-grow overflow-y-auto relative flex flex-col items-center justify-center p-8">
        {!activeConversationId ? (
          <div className="flex flex-col items-center text-center max-w-sm">
            <div className="h-20 w-20 bg-surface rounded-[40px] flex items-center justify-center mb-6 animate-bounce">
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Welcome to NeoPlane</h3>
            <p className="text-base text-foreground/50 leading-relaxed">
              Select a channel or direct message from the sidebar to start collaborating with your team.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex-grow" />
            {/* Placeholder for message list */}
            <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-8">
               <div className="flex flex-col items-center text-center mb-12">
                  <Avatar size="lg" className="mb-4" />
                  <h4 className="text-xl font-bold text-foreground">Beginning of #general</h4>
                  <p className="text-sm text-foreground/50">This is the very start of the general channel.</p>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Input Area */}
      {activeConversationId && (
        <div className="p-6 pt-2 bg-gradient-to-t from-background via-background to-transparent sticky bottom-0">
          <div className="max-w-5xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative bg-card border border-border focus-within:border-primary/50 rounded-2xl p-2 transition-all duration-200 shadow-xl overflow-hidden backdrop-blur-xl bg-opacity-80">
                <div className="flex items-end gap-2 pr-2">
                  <Button variant="ghost" className="p-3 h-auto shrink-0 text-foreground/40 hover:text-primary rounded-2xl">
                    <Paperclip size={20} />
                  </Button>
                  <textarea
                    rows={1}
                    placeholder={`Message #general`}
                    className="flex-grow bg-transparent border-0 focus:ring-0 text-sm py-3 px-2 resize-none text-foreground placeholder:text-foreground/30 min-h-[44px] max-h-[200px]"
                    onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                  <div className="flex items-center gap-1 shrink-0 pb-1">
                    <Button variant="ghost" className="p-3 h-auto text-foreground/40 hover:text-yellow-500 rounded-2xl">
                      <Smile size={20} />
                    </Button>
                    <Button variant="primary" className="p-3 h-auto rounded-2xl">
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-2">
               <p className="text-[10px] text-foreground/30 font-medium">Use **bold**, _italic_, or `code` for formatting</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
