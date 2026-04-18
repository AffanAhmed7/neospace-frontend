import React from 'react';
import { Bell, Hash, User, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useNotificationsStore } from '../../store/useNotificationsStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export const NotificationPanel: React.FC = () => {
  const notificationPanelOpen = useAppStore((state) => state.notificationPanelOpen);
  const toggleNotificationPanel = useAppStore((state) => state.toggleNotificationPanel);
  const { notifications, markAsRead, clearAll } = useNotificationsStore();

  if (!notificationPanelOpen) return null;

  return (
    <div className="fixed top-20 right-8 z-[200] w-[380px] overflow-hidden bg-bg-deep/90 border border-white/5 rounded-[32px] shadow-premium animate-in fade-in slide-in-from-top-4 duration-500 backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-bg-deep/50">
        <div className="flex items-center gap-3">
           <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Bell size={18} className="text-glow" />
           </div>
           <h3 className="font-bold text-foreground text-lg tracking-tight">Activity</h3>
        </div>
        <div className="flex items-center gap-1.5">
           <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() => markAsRead(notifications.filter(n => !n.isRead).map(n => n.id))}
            title="Mark all as read"
           >
              <Check size={16} />
           </Button>
           <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/5 transition-all" onClick={toggleNotificationPanel}>
              <X size={16} />
           </Button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar-minimal py-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markAsRead([notif.id])}
            className={clsx(
              "px-6 py-5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer group flex gap-4",
              !notif.isRead && "relative bg-primary/[0.02]"
            )}
          >
            {!notif.isRead && (
               <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full blur-[2px] opacity-60 group-hover:opacity-100 transition-opacity" />
            )}
            
            <div className="shrink-0 relative mt-1">
               <Avatar alt={notif.title} size="sm" className="shadow-md border-none group-hover:scale-110 transition-transform duration-300" />
               <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-lg p-0.5 border-2 border-card shadow-glow">
                  {notif.type === 'MENTION' ? <User size={10} /> : <Hash size={10} />}
               </div>
            </div>
            
            <div className="flex-grow flex flex-col gap-1.5 min-w-0">
               <div className="flex items-start justify-between gap-2">
                  <span className={clsx(
                    "text-[13px] font-bold tracking-tight truncate group-hover:text-primary transition-colors",
                    !notif.isRead ? "text-foreground" : "text-foreground/70"
                  )}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-tighter shrink-0 pt-0.5">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
               </div>
               <p className="text-[12px] font-medium text-foreground/40 line-clamp-2 leading-relaxed italic group-hover:text-foreground/60 transition-colors">
                 {notif.desc}
               </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
           <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
              <Bell size={48} className="mb-4" />
              <p className="text-sm font-bold tracking-tighter uppercase">No new activity</p>
           </div>
        )}
      </div>

      {/* Footer */}
      <button 
        onClick={clearAll}
        className="w-full py-4 text-[11px] font-black text-primary/60 hover:text-primary hover:bg-primary/5 transition-all border-t border-white/5 uppercase tracking-[0.2em] bg-bg-deep/80"
      >
         Archive all notifications
      </button>
    </div>
  );
};
