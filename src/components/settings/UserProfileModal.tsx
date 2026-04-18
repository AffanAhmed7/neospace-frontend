import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MessageSquare, X, Calendar, MoreHorizontal, UserPlus, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

interface UserProfileModalProps {
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  banner?: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DND';
  bio?: string;
  createdAt?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  onClose
}) => {
  const navigate = useNavigate();
  const profileUserId = useAppStore(state => state.profileUserId);
  const { user: currentUser } = useAuthStore();
  const { friends, sendRequest, removeFriend, startDM } = useFriendsStore();
  const openConfirm = useAppStore((state) => state.openConfirm);
  
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isOwnProfile = !profileUserId || profileUserId === currentUser?.id;
  const friendEntry = friends.find(f => f.id === profileUserId);
  const isFriend = !!friendEntry;

  useEffect(() => {
    const fetchProfile = async () => {
      if (isOwnProfile && currentUser) {
        setProfileUser({
          ...currentUser,
          status: 'ONLINE',
          avatar: currentUser.avatar || ''
        } as User);
        return;
      }
      if (!profileUserId) return;
      
      setIsLoading(true);
      try {
        const { data } = await api.get(`/users/${profileUserId}`);
        setProfileUser(data.data.user);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [profileUserId, isOwnProfile, currentUser]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleStartChat = async () => {
    if (!profileUserId) return;
    const conversationId = await startDM(profileUserId);
    if (conversationId) {
      useAppStore.getState().setActiveConversation(conversationId);
      useAppStore.getState().setActiveView('chat');
      onClose();
    }
  };

  const handleAddFriend = async () => {
    if (!profileUser?.username) return;
    await sendRequest(profileUser.username);
    // Request sent, maybe show a toast
  };

  if (!profileUser && isLoading) {
    return (
       <div className="fixed inset-0 z-[200] flex items-center justify-center">
         <div className="text-white font-black uppercase tracking-widest text-[10px] animate-pulse">Loading Profile...</div>
       </div>
    );
  }

  if (!profileUser) return null;

  const bannerStyle = profileUser.banner || 'bg-primary';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => onClose()}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-[500px] bg-[#111214] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/[0.05]"
      >
        <div className={clsx(
          "h-[120px] w-full relative", 
          bannerStyle.startsWith('bg-') ? bannerStyle : ''
        )}>
          {(!bannerStyle.startsWith('bg-')) && (
            <img src={bannerStyle} alt="Banner" className="h-full w-full object-cover" />
          )}
          <button 
            onClick={() => onClose()}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors z-20"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 pb-5 relative">
          <div className="absolute -top-12 left-5">
            <div className="relative group rounded-full bg-[#111214] p-1.5 shadow-xl">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-bg-deep relative">
                <img src={profileUser.avatar} alt={profileUser.username} className="w-full h-full object-cover" />
              </div>
              <div className={clsx(
                "absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-[#111214]",
                profileUser.status === 'ONLINE' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                profileUser.status === 'IDLE' ? "bg-amber-400" :
                profileUser.status === 'DND' ? "bg-rose-500" : "bg-white/20"
              )} />
            </div>
          </div>

          <div className="flex justify-end pt-3 pb-2 h-14">
            {isOwnProfile ? (
              <Button 
                onClick={() => { onClose(); navigate('/settings'); }} 
                className="h-8 px-4 text-[11px] font-black uppercase tracking-widest bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-lg"
                variant="ghost"
              >
                Settings
              </Button>
            ) : (
              <div className="flex gap-2">
                {isFriend ? (
                  <Button 
                    onClick={handleStartChat} 
                    className="h-9 px-4 text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center gap-2 shadow-glow-sm"
                  >
                    <MessageSquare size={14} />
                    Message
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleAddFriend} 
                      className="h-9 px-4 text-[11px] font-black uppercase tracking-widest bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-xl flex items-center gap-2"
                      variant="ghost"
                    >
                      <UserPlus size={14} />
                      Add Friend
                    </Button>
                    <Button 
                      onClick={handleStartChat} 
                      className="h-9 px-4 text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center gap-2"
                    >
                      <MessageCircle size={14} />
                      Message
                    </Button>
                  </>
                )}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    className="w-9 h-9 p-0 flex items-center justify-center bg-white/[0.05] hover:bg-white/[0.1] rounded-xl"
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
                        className="absolute right-0 top-full mt-2 w-48 bg-[#1B1C21] border border-white/[0.05] rounded-2xl shadow-2xl overflow-hidden z-50 text-left py-1"
                      >
                        {isFriend && (
                          <button 
                            onClick={() => { 
                              openConfirm({
                                title: 'Remove Friend',
                                message: `Are you sure you want to remove ${profileUser.username}?`,
                                confirmLabel: 'Remove Friend',
                                onConfirm: () => removeFriend(profileUser.id)
                              });
                              setShowMoreMenu(false); 
                            }}
                            className="w-full px-4 py-3 text-[12px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 text-left transition-colors"
                          >
                            Remove Friend
                          </button>
                        )}
                        <button className="w-full px-4 py-3 text-[12px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 text-left transition-colors">
                          Block User
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 bg-[#1B1C21] rounded-2xl p-5 border border-white/[0.03]">
            <div className="flex items-center justify-between mb-1">
               <h4 className="text-[22px] font-black text-white tracking-tight leading-none">{profileUser.username}</h4>
            </div>
            <p className="text-[14px] text-foreground/40 font-medium mb-4">{profileUser.email || 'Email Protected'}</p>

            <div className="w-full h-px bg-white/[0.03] my-4" />

            <div className="space-y-6">
              <div className="space-y-2">
                <h5 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">About</h5>
                <p className="text-[14px] text-foreground/75 leading-relaxed font-medium italic">
                  "{profileUser.bio || 'This user is traveling in silence.'}"
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Member Since</h5>
                <div className="flex items-center gap-2 text-foreground/50">
                  <Calendar size={14} />
                  <p className="text-[13px] font-bold">{new Date(profileUser.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em]">Badges</h5>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-black border-white/5 bg-white/[0.02] text-foreground/40 py-1 px-3">
                    {profileUser.id === currentUser?.id ? 'Admin' : 'Member'}
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
