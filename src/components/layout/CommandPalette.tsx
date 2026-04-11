import React, { useEffect, useState } from 'react';
import { Search, Hash, User, Terminal, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

export const CommandPalette: React.FC = () => {
  const commandPaletteOpen = useAppStore((state) => state.commandPaletteOpen);
  const toggleCommandPalette = useAppStore((state) => state.toggleCommandPalette);
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const conversationMeta = useAppStore((state) => state.conversationMeta);
  const [query, setQuery] = useState('');

  const activeChannel = activeConversationId ? conversationMeta[activeConversationId] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette]);

  const defaultResults = [
    { id: 'f1', title: 'Search for Friends', type: 'context', icon: <User size={16} /> },
    { id: 'c1', title: 'Search in Channels', type: 'context', icon: <Hash size={16} /> },
    ...(activeChannel ? [{ 
      id: 'cc1', 
      title: `Search in #${activeChannel.name}`, 
      type: 'context', 
      icon: <Search size={16} /> 
    }] : []),
  ];

  const results = query 
    ? [
        { id: '1', title: 'general', type: 'channel', icon: <Hash size={16} /> },
        { id: '2', title: 'Alex Rivera', type: 'user', icon: <User size={16} /> },
        { id: '4', title: `Search for "${query}"`, type: 'action', icon: <Search size={16} /> },
      ]
    : defaultResults;

  return (
    <Modal
      isOpen={commandPaletteOpen}
      onClose={toggleCommandPalette}
      className="p-0 max-w-2xl overflow-hidden"
    >
      <div className="flex items-center px-4 py-3 border-b border-white/[0.03] bg-transparent backdrop-blur-none">
        <Search size={20} className="text-foreground/20 mr-3 shrink-0" />
        <input
          autoFocus
          placeholder="Where should we look?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-transparent border-0 outline-none text-base text-foreground placeholder:text-foreground/20 h-10 ring-0 focus:ring-0"
        />
        <Badge variant="outline" className="ml-2 text-[9px] uppercase font-bold py-0.5 px-1.5 opacity-30 border-white/10">
          Esc
        </Badge>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2">
        <div className="px-3 py-2 text-[11px] font-bold text-foreground/30 uppercase tracking-[0.1em]">
          Quick Actions
        </div>
        <div className="space-y-1">
          {results.map((result) => (
            <button
              key={result.id}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] transition-all group group-focus:bg-white/[0.04] group-focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white/[0.03] rounded-2xl flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                  {result.icon}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-foreground leading-tight">{result.title}</span>
                  <span className="text-[10px] text-foreground/30 leading-tight uppercase font-bold tracking-tight">{result.type}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-foreground/10 group-hover:text-foreground/40 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-border bg-bg-deep/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] text-foreground/40 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-1.5">
            <span className="bg-foreground/5 rounded px-1.5 py-0.5 border border-border">↑↓</span>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-foreground/5 rounded px-1.5 py-0.5 border border-border">Enter</span>
            <span>Select</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-foreground/20 font-bold uppercase tracking-tight">
           <Terminal size={12} />
           <span>NeoPlane CLI v1.0.4</span>
        </div>
      </div>
    </Modal>
  );
};
