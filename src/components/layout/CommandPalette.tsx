import React, { useEffect, useState, useMemo } from 'react';
import { Search, Hash, Terminal, ChevronRight, X } from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useSearchStore } from '../../store/useSearchStore';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, FileText, User as UserIcon, Globe } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const commandPaletteOpen = useAppStore((state) => state.commandPaletteOpen);
  const toggleCommandPalette = useAppStore((state) => state.toggleCommandPalette);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const setActiveView = useAppStore((state) => state.setActiveView);
  
  

  const { conversations } = useConversationsStore();
  const { startDM } = useFriendsStore();
  const { searchAll, results: searchResults, isLoading, clearResults } = useSearchStore();

  interface CommandResult {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    icon: React.ReactNode;
    action: () => void | Promise<void>;
  }
  
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'messages' | 'files'>('all');

  const handleClose = () => {
    setQuery('');
    setActiveTab('all');
    clearResults();
    toggleCommandPalette();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        searchAll(query);
      } else {
        clearResults();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchAll, clearResults]);

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

  const localResults = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    
    const matchedChannels = conversations
      .filter(c => c.type !== 'DIRECT' && c.name?.toLowerCase().includes(lowerQuery))
      .map(c => ({ 
        id: c.id, 
        title: c.name!, 
        subtitle: c.type,
        type: 'channel', 
        icon: <Hash size={16} />,
        action: () => {
          setActiveConversation(c.id);
          setActiveView('chat');
          toggleCommandPalette();
        }
      }));

    return matchedChannels;
  }, [query, conversations, setActiveConversation, setActiveView, toggleCommandPalette]);

  const allFilteredResults = useMemo(() => {
    const res: CommandResult[] = [];
    
    if (activeTab === 'all' || activeTab === 'users') {
      searchResults.users.forEach(u => res.push({
        id: u.id,
        title: u.username,
        subtitle: u.status,
        type: 'user',
        icon: <Avatar src={u.avatar} size="sm" />,
        action: async () => {
          const convId = await startDM(u.id);
          if (convId) setActiveConversation(convId);
          setActiveView('chat');
          toggleCommandPalette();
        }
      }));
    }

    if (activeTab === 'all' || activeTab === 'messages') {
      searchResults.messages.forEach(m => res.push({
        id: m.id,
        title: m.content || 'File message',
        subtitle: `in ${conversations.find(c => c.id === m.conversationId)?.name || 'Direct Message'} • ${formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}`,
        type: 'message',
        icon: <MessageSquare size={16} />,
        action: () => {
          setActiveConversation(m.conversationId);
          setActiveView('chat');
          toggleCommandPalette();
        }
      }));
    }

    if (activeTab === 'all' || activeTab === 'files') {
      searchResults.files.forEach(f => res.push({
        id: f.id,
        title: f.fileName || 'Shared Document',
        subtitle: `${((f.fileSize || 0) / 1024).toFixed(1)} KB • ${f.type}`,
        type: 'file',
        icon: <FileText size={16} />,
        action: () => {
          if (f.fileUrl) window.open(f.fileUrl, '_blank');
          toggleCommandPalette();
        }
      }));
    }

    // Add local channels if in 'all' tab and matching
    if (activeTab === 'all') {
      res.unshift(...localResults);
    }

    return res;
  }, [activeTab, searchResults, localResults, conversations, startDM, setActiveConversation, setActiveView, toggleCommandPalette]);

  return (
    <Modal
      isOpen={commandPaletteOpen}
      onClose={handleClose}
      className="p-0 max-w-2xl overflow-hidden"
      showCloseButton={false}
    >
      <div className="flex flex-col border-b border-white/[0.03] bg-bg-deep/30">
        <div className="flex items-center px-4 py-3">
          <Search size={20} className="text-foreground/20 mr-3 shrink-0" />
          <input
            autoFocus
            placeholder="Search NeoPlane..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent border-0 outline-none text-base text-foreground placeholder:text-foreground/20 h-10 ring-0 focus:ring-0"
          />
          {isLoading && <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />}
          <button 
            onClick={handleClose}
            className="ml-2 h-8 w-8 rounded-xl flex items-center justify-center text-foreground/20 hover:text-rose-500 hover:bg-rose-500/10 transition-all group/close shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          {[
            { id: 'all', label: 'All', icon: <Globe size={11} /> },
            { id: 'users', label: 'People', icon: <UserIcon size={11} /> },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={11} /> },
            { id: 'files', label: 'Files', icon: <FileText size={11} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'users' | 'messages' | 'files')}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-primary/20 text-primary border border-primary/20" 
                  : "text-foreground/20 hover:text-foreground/40 hover:bg-white/5 border border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-2">
        {query && allFilteredResults.length === 0 ? (
          <div className="py-12 text-center text-foreground/20 font-bold uppercase tracking-widest text-[11px]">No matches found</div>
        ) : !query ? (
          <div className="py-12 text-center text-foreground/20 font-bold uppercase tracking-widest text-[11px]">Type to search channels and friends</div>
        ) : (
          <div className="space-y-1">
            {allFilteredResults.map((result) => (
              <button
                key={`${result.type}-${result.id}`}
                onClick={result.action}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.04] transition-all group group-focus:bg-white/[0.04] group-focus:outline-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 bg-white/[0.03] rounded-2xl flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors shrink-0">
                    {result.icon}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-semibold text-foreground leading-tight truncate w-full text-left">{result.title}</span>
                    <span className="text-[10px] text-foreground/30 leading-tight uppercase font-bold tracking-tight truncate w-full text-left">
                      {result.subtitle || result.type}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-foreground/10 group-hover:text-foreground/40 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
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
