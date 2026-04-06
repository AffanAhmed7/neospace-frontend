import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Mail, MessageSquare, X, Phone, Video, Calendar, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface UserProfilePanelProps {
  user: {
    username: string;
    bio: string;
    avatar: string | null;
    status: 'online' | 'offline' | 'busy' | 'away';
    email: string;
    role?: string;
  };
  onClose: () => void;
  onStartChat?: () => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ 
  user, 
  onClose, 
  onStartChat 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-card border-l border-border w-80 shrink-0"
    >
      <header className="p-4 flex items-center justify-between border-b border-border">
        <h3 className="font-bold">Profile</h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-surface text-foreground/40 hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar 
              src={user.avatar || undefined} 
              alt={user.username} 
              isOnline={user.status === 'online'} 
              size="lg" 
              className="h-24 w-24 rounded-[32px] ring-4 ring-primary/10" 
            />
            <div className={clsx(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card",
              user.status === 'online' ? "bg-emerald-500" : "bg-foreground/20"
            )} />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-tight">{user.username}</h4>
            <div className="flex items-center gap-2 justify-center">
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold">
                {user.role || 'Member'}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-foreground/20" />
              <span className="text-xs text-foreground/40">{user.status}</span>
            </div>
          </div>

          <div className="flex gap-2 w-full pt-4">
            <Button onClick={onStartChat} className="flex-1 gap-2 shadow-lg shadow-primary/20">
              <MessageSquare size={16} />
              Message
            </Button>
            <Button variant="ghost" className="px-3">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </div>

        <div className="px-6 space-y-6 pb-6">
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-foreground/40 uppercase tracking-widest">About</h5>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {user.bio}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-foreground/40">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-foreground/40">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Joined</span>
                <span className="text-sm font-medium">March 15, 2026</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button variant="ghost" className="h-10 gap-2 border border-border/50 bg-surface/30">
              <Phone size={14} />
              Call
            </Button>
            <Button variant="ghost" className="h-10 gap-2 border border-border/50 bg-surface/30">
              <Video size={14} />
              Video
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
