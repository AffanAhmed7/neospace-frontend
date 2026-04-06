import React from 'react';
import { Search, Plus, Hash, User, Settings, Moon, Sun, Hexagon } from 'lucide-react';
import { Input } from '../ui/Input';
import { SidebarItem } from '../ui/SidebarItem';
import { Avatar } from '../ui/Avatar';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';

import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const channels = [
    { id: '1', name: 'general', unread: 0 },
    { id: '2', name: 'announcements', unread: 5 },
    { id: '3', name: 'engineering', unread: 0 },
  ];

  const dms = [
    { id: '4', name: 'Alex Rivera', status: 'online', unread: 2 },
    { id: '5', name: 'Jordan Lee', status: 'busy', unread: 0 },
    { id: '6', name: 'Taylor Swift', status: 'offline', unread: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Header / Branding */}
      <div className="px-4 flex items-center justify-between border-b border-white/[0.03] h-[64px] shrink-0">
        <div className="flex items-center gap-2 group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
          <div className="h-8 w-8 bg-primary shadow-glow-sm rounded-lg flex items-center justify-center text-white transition-all duration-500 group-hover:shadow-glow-lg">
            <Hexagon size={18} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-foreground uppercase group-hover:text-glow transition-all duration-300">neo.</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 text-foreground/40 hover:text-primary transition-all duration-300"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Search Container */}
      <div className="px-3 py-3">
        <div 
          className="group relative cursor-pointer"
          onClick={() => useAppStore.getState().toggleCommandPalette()}
        >
          <div className="absolute inset-0 bg-primary/5 rounded-lg blur-md group-hover:bg-primary/10 transition-colors" />
          <Input
            placeholder="Search everything..."
            icon={<Search size={14} className="text-foreground/40 group-hover:text-primary transition-colors" />}
            readOnly
            className="cursor-pointer bg-white/[0.03] border-white/[0.05] h-9 text-xs group-hover:border-primary/20 transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-grow overflow-y-auto px-2 py-1 space-y-4 custom-scrollbar-compact">
        {/* Channels Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">
            Channels
            <button className="hover:text-primary transition-colors p-1">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <SidebarItem
                key={channel.id}
                label={channel.name}
                icon={<Hash size={18} className={activeConversationId === channel.id ? 'text-white' : 'text-primary/60'} />}
                active={activeConversationId === channel.id}
                count={channel.unread}
                onClick={() => setActiveConversation(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* DMs Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">
            Direct Messages
            <button className="hover:text-primary transition-colors p-1">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-0.5">
            {dms.map((dm) => (
              <SidebarItem
                key={dm.id}
                label={dm.name}
                indicator={dm.status as 'online' | 'offline' | 'busy' | 'away'}
                icon={<User size={18} className={activeConversationId === dm.id ? 'text-white' : 'text-foreground/40'} />}
                active={activeConversationId === dm.id}
                count={dm.unread}
                onClick={() => setActiveConversation(dm.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-white/[0.03] bg-white/[0.01]">
        <div className="flex items-center justify-between">
          <button 
            onClick={toggleProfilePanel}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white/[0.03] group transition-all duration-300 flex-grow mr-2 overflow-hidden"
          >
            <Avatar 
              alt="Jane Doe" 
              isOnline={true} 
              size="sm" 
              className="ring-1 ring-white/[0.05] group-hover:ring-primary/20 transition-all" 
            />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">Jane Doe</span>
              <span className="text-[10px] font-medium text-foreground/30 truncate">jane@neoplane.io</span>
            </div>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 rounded-lg hover:bg-white/[0.05] text-foreground/30 hover:text-primary transition-all duration-300"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
