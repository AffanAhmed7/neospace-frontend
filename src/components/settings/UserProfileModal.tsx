import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MessageSquare, X, Calendar, MoreHorizontal, UserPlus, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
  onClose: () => void;
  onStartChat?: () => void;
}

// ─── Mock User Data ─────────────────────────────────────────────────────────

const mockUsersData: Record<string, any> = {
  '1': { id: '1', username: 'Alex Rivera', status: 'online', bio: 'Designing @ NeoPlane. Bringing pixels to life.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', email: 'alex@neoplane.io', joined: 'Jan 12, 2026', role: 'Designer', bannerColor: 'bg-indigo-500' },
  '2': { id: '2', username: 'Jordan Lee', status: 'offline', bio: 'Backend Engineer. I make things fast.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', email: 'jordan@neoplane.io', joined: 'Feb 05, 2026', role: 'Engineer', bannerColor: 'bg-rose-500' },
  '3': { id: '3', username: 'Sarah Chen', status: 'idle', bio: 'Product Manager. Organizing the chaos.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', email: 'sarah@neoplane.io', joined: 'Mar 20, 2026', role: 'PM', bannerColor: 'bg-amber-500' },
  '4': { id: '4', username: 'Marcus Wright', status: 'online', bio: 'DevOps wizard. I make sure the lights stay on.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', email: 'marcus@neoplane.io', joined: 'Nov 12, 2025', role: 'DevOps', bannerColor: 'bg-blue-600' },
  '5': { id: '5', username: 'Elena Rossi', status: 'dnd', bio: 'Marketing lead & creative strategist.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', email: 'elena@neoplane.io', joined: 'Dec 05, 2025', role: 'Marketing', bannerColor: 'bg-rose-600' },
  'p1': { id: 'p1', username: 'David Kim', status: 'offline', bio: 'New here! Nice to meet everyone.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', email: 'david@neoplane.io', joined: 'Apr 08, 2026', role: 'Member', bannerColor: 'bg-emerald-500' },
};

// ─── Component ───────────────────────────────────────────────────────────────

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  onClose, 
  onStartChat 
}) => {
  const { user: currentUser } = useSettingsStore();
  const profileUserId = useAppStore(state => state.profileUserId);
  const friendIds = useAppStore(state => state.friendIds);
  const mutedUserIds = useAppStore(state => state.mutedUserIds);
  const toggleMuteUser = useAppStore(state => state.toggleMuteUser);
  const navigate = useNavigate();

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    console.log('[UserProfileModal] Mounted for profileUserId:', profileUserId);
    return () => console.log('[UserProfileModal] Unmounted');
  }, [profileUserId]);

  const isOwnProfile = !profileUserId || profileUserId === "me";
  const isFriend = profileUserId ? friendIds.includes(profileUserId) : false;
  const isMuted = profileUserId ? mutedUserIds.includes(profileUserId) : false;
  
  // Resolve user data
  const user = isOwnProfile 
    ? { ...currentUser, email: 'jane@neoplane.io', joined: 'March 15, 2026', role: 'Admin', bannerColor: 'bg-primary' } 
    : mockUsersData[profileUserId!] || { 
        username: 'Voyager', status: 'offline', bio: 'Just passing through the NeoPlane.', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUserId || 'guest'}`, 
        email: 'ghost@neoplane.io', joined: 'Ancient', role: 'Visitor', bannerColor: 'bg-white/5'
      };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-[500px] bg-[#111214] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/[0.05]"
      >
        {/* Banner */}
        <div className={clsx("h-[100px] w-full relative", user.bannerColor)}>
          <button 
            onClick={() => onClose()}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Profile Info Area */}
        <div className="px-5 pb-5 relative">
          {/* Avatar (Overlapping banner) */}
          <div className="absolute -top-12 left-5">
            <div className="relative group rounded-full bg-[#111214] p-1.5 shadow-xl">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-bg-deep relative">
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              </div>
              <div className={clsx(
                "absolute bottom-2 right-2 w-4 h-4 rounded-full border-4 border-[#111214]",
                user.status === 'online' ? "bg-emerald-500" : 
                user.status === 'idle' ? "bg-amber-400" :
                user.status === 'dnd' ? "bg-rose-500" : "bg-foreground/30"
              )} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-3 pb-2 h-14">
            {isOwnProfile ? (
              <Button 
                onClick={() => { onClose(); navigate('/settings'); }} 
                className="h-8 px-4 text-[12px] font-bold bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-md"
                variant="ghost"
              >
                Edit User Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                {isFriend ? (
                  <Button 
                    onClick={onStartChat} 
                    className="h-8 px-4 text-[12px] font-bold bg-primary hover:bg-primary/90 text-white rounded-md flex items-center gap-2"
                  >
                    <MessageSquare size={14} />
                    Message
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => { /* Add friend logic */ }} 
                      className="h-8 px-4 text-[12px] font-bold bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-md flex items-center gap-2"
                      variant="ghost"
                    >
                      <UserPlus size={14} />
                      Add Friend
                    </Button>
                    <Button 
                      onClick={() => { /* Send request logic */ }} 
                      className="h-8 px-4 text-[12px] font-bold bg-primary hover:bg-primary/90 text-white rounded-md flex items-center gap-2"
                    >
                      <MessageCircle size={14} />
                      Message Request
                    </Button>
                  </>
                )}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="w-8 h-8 p-0 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] rounded-md"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                  >
                    <MoreHorizontal size={14} />
                  </Button>
                  
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-[#111214] border border-white/[0.05] rounded-xl shadow-xl overflow-hidden z-50 text-left py-1"
                      >
                        <button 
                          onClick={() => { toggleMuteUser(profileUserId!); setShowMoreMenu(false); }}
                          className="w-full px-3 py-2 text-[12px] font-bold text-foreground/70 hover:bg-white/[0.04] hover:text-foreground text-left transition-colors"
                        >
                          {isMuted ? 'Unmute' : 'Mute'} @{user.username}
                        </button>
                        {isFriend && (
                          <button className="w-full px-3 py-2 text-[12px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 text-left transition-colors">
                            Remove Friend
                          </button>
                        )}
                        <button className="w-full px-3 py-2 text-[12px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 text-left transition-colors">
                          Block User
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

          </div>

          {/* User Details */}
          <div className="mt-2 bg-[#1B1C21] rounded-xl p-4 border border-white/[0.03]">
            <h4 className="text-[20px] font-bold text-white tracking-tight leading-none mb-1">{user.username}</h4>
            <p className="text-[14px] text-foreground/60 mb-3">{user.email}</p>

            <div className="w-full h-px bg-white/[0.05] my-3" />

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">About Me</h5>
                <p className="text-[14px] text-foreground/80 leading-relaxed font-medium">
                  {user.bio}
                </p>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">NeoPlane Member Since</h5>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-foreground/40" />
                  <p className="text-[13px] text-foreground/80 font-medium">{user.joined}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-[11px] font-black text-foreground/40 uppercase tracking-widest">Roles</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[11px] uppercase tracking-wider font-bold border-white/10 bg-white/[0.03] text-foreground/70">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
