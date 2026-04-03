import React, { useState } from 'react';
import { X, MessageSquare, Pin, Search, ChevronRight, Info } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

type Tab = 'Threads' | 'Participants' | 'Pinned';

export const RightPanel: React.FC = () => {
  const toggleRightPanel = useAppStore((state) => state.toggleRightPanel);
  const [activeTab, setActiveTab] = useState<Tab>('Threads');

  const tabs: Tab[] = ['Threads', 'Participants', 'Pinned'];

  const participants = [
    { id: '1', name: 'Jane Doe', status: 'online', role: 'Admin' },
    { id: '2', name: 'Alex Rivera', status: 'online', role: 'Member' },
    { id: '3', name: 'Jordan Lee', status: 'busy', role: 'Guest' },
    { id: '4', name: 'Taylor Swift', status: 'offline', role: 'Member' },
  ];

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border h-[64px] shrink-0">
        <h2 className="font-bold text-foreground text-lg tracking-tight">Details</h2>
        <Button variant="ghost" className="p-2 h-auto" onClick={toggleRightPanel}>
          <X size={20} className="text-foreground/50" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-grow py-3 text-sm font-semibold transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Scroll Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {activeTab === 'Threads' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center py-12 px-6">
              <div className="h-16 w-16 bg-surface rounded-[32px] flex items-center justify-center mb-4 text-foreground/20">
                <MessageSquare size={32} />
              </div>
              <h4 className="text-base font-bold text-foreground mb-1">No active threads</h4>
              <p className="text-sm text-foreground/40 leading-relaxed">
                Threads started in this channel will show up here for easy tracking.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Participants' && (
          <div className="space-y-4">
             <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                type="text"
                placeholder="Find members..."
                className="w-full bg-surface border-0 rounded-2xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-foreground/30 focus:ring-1 focus:ring-primary/30"
                />
             </div>
            {participants.map((person) => (
              <div key={person.id} className="flex items-center justify-between group cursor-pointer p-2 rounded-2xl hover:bg-surface transition-all">
                <div className="flex items-center gap-3">
                  <Avatar alt={person.name} isOnline={person.status === 'online'} size="sm" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground leading-tight">{person.name}</span>
                    <span className="text-[10px] text-foreground/40 leading-tight uppercase font-bold tracking-wider">{person.role}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-foreground/20 group-hover:text-foreground/50 transition-colors" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Pinned' && (
          <div className="flex flex-col items-center text-center py-12 px-6">
            <div className="h-16 w-16 bg-surface rounded-[32px] flex items-center justify-center mb-4 text-foreground/20">
              <Pin size={32} />
            </div>
            <h4 className="text-base font-bold text-foreground mb-1">No pinned messages</h4>
            <p className="text-sm text-foreground/40 leading-relaxed">
              Keep track of important announcements by pinning them.
            </p>
          </div>
        )}
      </div>

       {/* Footer / Meta Info */}
       <div className="p-4 bg-surface/50 border-t border-border shrink-0">
          <div className="flex items-center gap-3 mb-4">
             <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Info size={20} />
             </div>
             <div>
                <h5 className="text-xs font-bold text-foreground uppercase tracking-wider">Channel Info</h5>
                <p className="text-[10px] text-foreground/40">Created on Jan 14, 2024</p>
             </div>
          </div>
          <p className="text-xs text-foreground/60 leading-relaxed italic">
             "Where all the magic happens. Make sure to keep it clean and professional."
          </p>
       </div>
    </div>
  );
};
