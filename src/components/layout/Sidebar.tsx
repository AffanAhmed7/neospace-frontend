import React from 'react';
import { Search, Plus, Hash, User, Settings, Moon, Sun } from 'lucide-react';
import { Input } from '../ui/Input';
import { SidebarItem } from '../ui/SidebarItem';
import { Avatar } from '../ui/Avatar';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';

export const Sidebar: React.FC = () => {
  const activeConversationId = useAppStore((state) => state.activeConversationId);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  const { theme, toggleTheme } = useTheme();

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
    <div className="flex flex-col h-full bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border h-[64px]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">NeoPlane</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-2xl hover:bg-surface text-foreground/70 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <Input
          placeholder="Search everything..."
          icon={<Search size={16} />}
          readOnly
          className="cursor-pointer"
          onClick={() => useAppStore.getState().toggleCommandPalette()}
        />
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-grow overflow-y-auto px-2 space-y-4">
        {/* Channels Section */}
        <div>
          <div className="px-3 py-2 flex items-center justify-between text-xs font-semibold text-foreground/40 uppercase tracking-wider">
            Channels
            <button className="hover:text-foreground">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <SidebarItem
                key={channel.id}
                label={channel.name}
                icon={<Hash size={18} />}
                active={activeConversationId === channel.id}
                count={channel.unread}
                onClick={() => setActiveConversation(channel.id)}
              />
            ))}
          </div>
        </div>

        {/* DMs Section */}
        <div>
          <div className="px-3 py-2 flex items-center justify-between text-xs font-semibold text-foreground/40 uppercase tracking-wider">
            Direct Messages
            <button className="hover:text-foreground">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-0.5">
            {dms.map((dm) => (
              <SidebarItem
                key={dm.id}
                label={dm.name}
                indicator={dm.status as 'online' | 'offline' | 'busy' | 'away'}
                icon={<User size={18} />}
                active={activeConversationId === dm.id}
                count={dm.unread}
                onClick={() => setActiveConversation(dm.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar alt="Jane Doe" isOnline={true} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Jane Doe</span>
            <span className="text-xs text-foreground/50">Online</span>
          </div>
        </div>
        <button className="p-2 rounded-2xl hover:bg-surface text-foreground/70 transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};
