import React from 'react';
import { Bell, Hash, User, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export const NotificationPanel: React.FC = () => {
  const notificationPanelOpen = useAppStore((state) => state.notificationPanelOpen);
  const toggleNotificationPanel = useAppStore((state) => state.toggleNotificationPanel);

  if (!notificationPanelOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Alex Rivera mentioned you',
      desc: '"Hey @Jane, can you take a look at this document?"',
      time: '2m ago',
      type: 'mention',
      unread: true,
    },
    {
      id: '2',
      title: 'New message in #engineering',
      desc: 'Jordan Lee: "Merged the latest pull request."',
      time: '15m ago',
      type: 'channel',
      unread: true,
    },
    {
      id: '3',
      title: 'Welcome to the team!',
      desc: 'You were added to #general by Admin.',
      time: '1h ago',
      type: 'system',
      unread: false,
    },
  ];

  return (
    <div className="fixed top-20 right-6 z-50 w-full max-w-sm overflow-hidden bg-card border border-border rounded-22xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl bg-opacity-95">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-surface/30">
        <div className="flex items-center gap-2">
           <Bell size={18} className="text-primary" />
           <h3 className="font-bold text-foreground">Notifications</h3>
        </div>
        <div className="flex items-center gap-1">
           <Button variant="ghost" className="p-1.5 h-auto text-foreground/40 hover:text-foreground">
              <Check size={16} />
           </Button>
           <Button variant="ghost" className="p-1.5 h-auto text-foreground/40 hover:text-foreground" onClick={toggleNotificationPanel}>
              <X size={16} />
           </Button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[480px] overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 border-b border-border hover:bg-surface/50 transition-colors cursor-pointer group flex gap-3 ${
              notif.unread ? 'bg-primary/5' : ''
            }`}
          >
            <div className="shrink-0 relative">
               <Avatar alt={notif.title} size="sm" />
               {notif.type === 'mention' && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border border-card">
                     <User size={10} />
                  </div>
               )}
                {notif.type === 'channel' && (
                  <div className="absolute -bottom-1 -right-1 bg-accent text-white rounded-full p-0.5 border border-card">
                     <Hash size={10} />
                  </div>
               )}
            </div>
            <div className="flex-grow flex flex-col gap-1">
               <div className="flex items-start justify-between">
                  <span className="text-sm font-bold text-foreground leading-tight">{notif.title}</span>
                  <span className="text-[10px] font-medium text-foreground/30 whitespace-nowrap">{notif.time}</span>
               </div>
               <p className="text-xs text-foreground/60 line-clamp-2 leading-relaxed italic">{notif.desc}</p>
            </div>
            <div className="shrink-0">
               {notif.unread && <div className="h-2 w-2 rounded-full bg-primary mt-1" />}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <button className="w-full py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-border uppercase tracking-[0.1em]">
         View all notifications
      </button>
    </div>
  );
};
