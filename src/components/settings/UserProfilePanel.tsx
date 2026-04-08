import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Mail, MessageSquare, X, Phone, Video, Calendar, MoreHorizontal, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface UserProfilePanelProps {
  onClose: () => void;
  onStartChat?: () => void;
}

// ─── Mock User Data (For other users) ────────────────────────────────────────

const mockUsersData: Record<string, any> = {
  '1': { id: '1', username: 'Alex Rivera', status: 'online', bio: 'Designing @ NeoPlane. Bringing pixels to life.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', email: 'alex@neoplane.io', joined: 'Jan 12, 2026', role: 'Designer' },
  '2': { id: '2', username: 'Jordan Lee', status: 'offline', bio: 'Backend Engineer. I make things fast.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', email: 'jordan@neoplane.io', joined: 'Feb 05, 2026', role: 'Engineer' },
  '3': { id: '3', username: 'Sarah Chen', status: 'idle', bio: 'Product Manager. Organizing the chaos.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', email: 'sarah@neoplane.io', joined: 'Mar 20, 2026', role: 'PM' },
  '4': { id: '4', username: 'Marcus Wright', status: 'online', bio: 'DevOps & Infrastructure.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', email: 'marcus@neoplane.io', joined: 'Nov 30, 2025', role: 'DevOps' },
  '5': { id: '5', username: 'Elena Rossi', status: 'dnd', bio: 'Head of Marketing.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', email: 'elena@neoplane.io', joined: 'Dec 02, 2025', role: 'Marketing' },
  'p1': { id: 'p1', username: 'David Kim', status: 'offline', bio: 'New here! Nice to meet everyone.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', email: 'david@neoplane.io', joined: 'Apr 08, 2026', role: 'Member' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ 
  onClose, 
  onStartChat 
}) => {
  const { user: currentUser } = useSettingsStore();
  const profileUserId = useAppStore(state => state.profileUserId);
  const navigate = useNavigate();

  const isOwnProfile = !profileUserId || profileUserId === "me";
  
  // Resolve user data
  const user = isOwnProfile 
    ? { ...currentUser, email: 'jane@neoplane.io', joined: 'March 15, 2026', role: 'Admin' } 
    : mockUsersData[profileUserId!] || { 
        username: 'Unknown User', status: 'offline', bio: 'No bio available.', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUserId}`, 
        email: 'unknown@neoplane.io', joined: 'Unknown', role: 'Guest' 
      };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full bg-card border-l border-border w-80 shrink-0 relative overflow-hidden"
    >
      <header className="p-4 flex items-center justify-between border-b border-border z-10 bg-card">
        <h3 className="font-bold text-[14px] tracking-tight uppercase text-foreground/40">
          {isOwnProfile ? "My Profile" : "User Profile"}
        </h3>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-surface text-foreground/40 hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto z-0 custom-scrollbar-compact">
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <Avatar 
              src={user.avatar} 
              alt={user.username} 
              isOnline={user.status === 'online'} 
              size="lg" 
              className="h-24 w-24 rounded-[32px] ring-4 ring-primary/10 transition-transform duration-300" 
            />
            <div className={clsx(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-card",
              user.status === 'online' ? "bg-emerald-500" : 
              user.status === 'idle' ? "bg-amber-400" :
              user.status === 'dnd' ? "bg-rose-500" : "bg-foreground/20"
            )} />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-tighter">{user.username}</h4>
            <div className="flex items-center gap-2 justify-center">
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-white/5 bg-white/[0.02]">
                {user.role}
              </Badge>
              <div className="w-1 h-1 rounded-full bg-foreground/20" />
              <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-tighter">{user.status}</span>
            </div>
          </div>

          <div className="flex gap-2 w-full pt-4">
            {isOwnProfile ? (
              <Button 
                onClick={() => navigate('/settings')} 
                className="flex-1 gap-2 shadow-lg shadow-primary/20 h-11 text-[13px] font-bold bg-white/[0.05] hover:bg-primary/20 text-foreground hover:text-white"
                variant="ghost"
              >
                <Settings size={16} />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={onStartChat} className="flex-1 gap-2 shadow-lg shadow-primary/20 h-11 text-[13px] font-bold">
                  <MessageSquare size={16} />
                  Message
                </Button>
                <Button variant="ghost" className="px-3 h-11 border border-border/40">
                  <MoreHorizontal size={18} />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="px-6 space-y-6 pb-6 border-t border-border/30 pt-6">
          <div className="space-y-2">
            <h5 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">About</h5>
            <p className="text-[13px] text-foreground/70 leading-relaxed font-medium">
              {user.bio}
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/30">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-surface group-hover:bg-primary/10 transition-colors flex items-center justify-center text-foreground/40 group-hover:text-primary">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.15em]">Email</span>
                <span className="text-[13px] font-semibold text-foreground/80 truncate max-w-[170px]">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-surface group-hover:bg-primary/10 transition-colors flex items-center justify-center text-foreground/40 group-hover:text-primary">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-foreground/20 uppercase tracking-[0.15em]">Joined</span>
                <span className="text-[13px] font-semibold text-foreground/80">{user.joined}</span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="ghost" className="h-10 gap-2 border border-border/30 bg-surface/30 text-[11px] font-bold">
                <Phone size={14} className="opacity-40" />
                Call
              </Button>
              <Button variant="ghost" className="h-10 gap-2 border border-border/30 bg-surface/30 text-[11px] font-bold">
                <Video size={14} className="opacity-40" />
                Video
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
