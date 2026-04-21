import React, { useState, useMemo } from 'react';
import { 
  Search, ArrowLeft, Shield
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

export const MessageRequests: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);
  
  const { user } = useAuthStore();
  const { conversations } = useConversationsStore();


  // Message Requests are DMs from people who are not friends, flagged with PENDING status
  const requests = useMemo(() => {
    return conversations.filter(c => c.type === 'DIRECT' && c.status === 'PENDING' && c.creatorId !== user?.id);
  }, [conversations, user?.id]);


  const filteredRequests = requests.filter(req => {
    const other = req.participants.find(p => p.user.id !== user?.id);
    return other?.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const { resolveRequest } = useConversationsStore();
  const { addToast } = useSettingsStore();

  const handleOpenPreview = (id: string) => {
    setActiveConversation(id);
    setActiveView('chat');
  };

  const handleResolve = async (e: React.MouseEvent, id: string, action: 'ACCEPT' | 'REJECT') => {
    e.stopPropagation();
    try {
      await resolveRequest(id, action);
      addToast(action === 'ACCEPT' ? 'Request accepted' : 'Request ignored', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to resolve request', 'error');
    }
  };


  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <header className="flex h-[64px] items-center justify-between border-b border-white/[0.05] px-8 shrink-0 bg-bg-deep/50">
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveView('home')} className="flex items-center gap-2 group">
            <ArrowLeft size={16} className="text-foreground/40 group-hover:text-primary transition-colors" />
            <span className="font-bold text-foreground/60 text-[12px] uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h2 className="text-[14px] font-black uppercase tracking-tight text-foreground">Message Requests</h2>
            {requests.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[10px] font-bold">
                {requests.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-64 ml-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20" size={12} />
            <input 
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-9 pr-3 bg-white/[0.03] border border-white/[0.05] rounded-md text-[12px] focus:outline-none focus:border-primary/30 transition-all outline-none text-foreground"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto w-full px-6 py-8">
          <div className="space-y-1">
            {filteredRequests.map(req => {
              const other = req.participants.find(p => p.user.id !== user?.id);
              if (!other) return null;
              return (
                <div
                  key={req.id}
                  onClick={() => handleOpenPreview(req.id)}
                  className="group flex items-center gap-4 cursor-pointer hover:bg-white/[0.03] p-3 rounded-lg transition-all border border-transparent hover:border-white/[0.02]"
                >
                  <Avatar src={other.user.avatar} alt={other.user.username} size="sm" />

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13px] font-bold text-foreground/80">
                        {other.user.username}
                      </h4>
                      <span className="text-[10px] text-foreground/20 font-medium">
                        {req.updatedAt ? formatDistanceToNow(new Date(req.updatedAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={(e) => handleResolve(e, req.id, 'ACCEPT')}
                      className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest px-3"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={(e) => handleResolve(e, req.id, 'REJECT')}
                      className="p-1.5 rounded-md bg-white/5 text-foreground/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all text-[10px] font-bold uppercase tracking-widest px-3"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredRequests.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center select-none opacity-20">
                <Shield size={32} strokeWidth={1} className="mb-4" />
                <p className="text-[11px] font-bold uppercase tracking-wider">No pending requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
