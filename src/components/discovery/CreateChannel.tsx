import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hash, Globe, Shield, AlertCircle, ArrowLeft, Link, Copy, Check, Search, Plus, UserPlus, RefreshCw, Upload, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useConversationsStore } from '../../store/useConversationsStore';
import { useFriendsStore } from '../../store/useFriendsStore';
import { Avatar } from '../ui/Avatar';
import { clsx } from 'clsx';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Gaming', 'Casual', 'Support', 'Other'];


const HERO_PRESETS = [
  { id: 'mesh', name: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000' },
  { id: 'city', name: 'Cyber City', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&q=80&w=1000' },
  { id: 'peak', name: 'Minimalist Peak', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000' },
  { id: 'gradient', name: 'Color Gradient', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=1000' },
  { id: 'flow', name: 'Energy Flow', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000' },
];

export const CreateChannel: React.FC = () => {
  const setActiveView = useAppStore((s) => s.setActiveView);
  const createConversation = useConversationsStore((s) => s.createConversation);
  const friends = useFriendsStore((s) => s.friends);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Casual');
  const [heroImage, setHeroImage] = useState(HERO_PRESETS[0].url);
  const [customHeroUrl, setCustomHeroUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large (max 5MB)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomHeroUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const generateLink = () => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedLink(`neoplane.io/join/${hash}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('Name must be at least 3 characters.');
      return;
    }
    
    let finalDescription = description;
    if (generatedLink) {
      finalDescription = `${description ? description + '\n\n' : ''}Join link: ${generatedLink}`;
    }

    setIsUploading(true); // Reusing as a general loading state for simplicity or just for the UI
    createConversation({
      name,
      type: 'CHANNEL',
      participantIds: selectedFriends,
      description: finalDescription,
      category,
      isPrivate,
      heroImage: customHeroUrl || heroImage,
    })
      .then((conv) => {
        if (conv) {
          setActiveView('home');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to create channel');
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev: string[]) => 
      prev.includes(id) ? prev.filter((f: string) => f !== id) : [...prev, id]
    );
  };

  const filteredFriends = friends.filter(f => 
    f.username.toLowerCase().includes(friendSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex items-start justify-center px-4 sm:px-8 md:px-10 pt-8 sm:pt-12 md:pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-7xl"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Page Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-6 shrink-0 z-50">
              {/* Top row on mobile: title left, back button right */}
              <div className="flex items-center justify-between sm:items-start sm:justify-start sm:gap-4">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight uppercase leading-none">Create a channel</h2>
                  <p className="text-[13px] text-foreground/30 font-medium mt-2 max-w-lg leading-relaxed hidden sm:block">
                    Channels are where your team communicates. They're best when organized around a topic — like #design.
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('home')}
                  type="button"
                  className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] text-foreground/20 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all shrink-0 sm:order-first sm:mt-1"
                >
                  <ArrowLeft size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="px-4 sm:px-6 h-10 sm:h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 sm:px-8 h-10 sm:h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-all shadow-glow hover:shadow-glow-lg disabled:opacity-40"
                  disabled={name.trim().length < 3}
                >
                  Create Channel
                </button>
              </div>
            </header>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[12px] font-bold"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Column 1: About */}
              <div className="space-y-8">
                <div className="space-y-4 pt-1">
                  
                  {/* Name Input */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-[10px] bg-primary/40 rounded-full shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Channel Identity</label>
                    </div>
                    <div className="relative group">
                      <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        value={name}
                        autoFocus
                        onChange={(e) => {
                          setError('');
                          setName(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                        }}
                        placeholder="e.g. design-critique"
                        className="w-full h-14 pl-11 pr-4 bg-foreground/5 border border-border focus:border-primary/40 rounded-2xl text-[15px] font-bold text-foreground placeholder:text-foreground/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Hero Image Selection */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.3)] shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Visual Identity</label>
                    </div>
                    
                    {/* Live Preview */}
                    <div className="relative h-32 rounded-3xl overflow-hidden bg-card border border-border group/preview">
                      <img 
                        src={customHeroUrl || heroImage} 
                        alt="Hero Preview" 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/preview:scale-105 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = HERO_PRESETS[0].url;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-6 flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                          <Hash size={16} />
                        </div>
                        <h4 className="text-[14px] font-black uppercase tracking-tighter text-white drop-shadow-lg">
                          {name || 'new-channel'}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {HERO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setHeroImage(preset.url);
                            setCustomHeroUrl('');
                          }}
                          className={clsx(
                            'aspect-video rounded-xl overflow-hidden border-2 transition-all relative group',
                            !customHeroUrl && heroImage === preset.url
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-white/20'
                          )}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className={clsx(
                            "absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity",
                            !customHeroUrl && heroImage === preset.url && "opacity-100"
                          )}>
                            <Check size={16} className="text-white" strokeWidth={3} />
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 relative group">
                      <div className="flex-1 relative">
                        <Plus size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          value={customHeroUrl.startsWith('data:') ? 'Local file uploaded' : customHeroUrl}
                          readOnly={customHeroUrl.startsWith('data:')}
                          onChange={(e) => setCustomHeroUrl(e.target.value)}
                          placeholder="Or paste custom image URL..."
                          className="w-full h-12 pl-11 pr-4 bg-foreground/5 border border-border focus:border-primary/40 rounded-2xl text-[12px] font-bold text-foreground placeholder:text-foreground/10 outline-none transition-all"
                        />
                        {customHeroUrl && (
                          <button 
                            type="button"
                            onClick={() => {
                              setCustomHeroUrl('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/20 hover:text-rose-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="h-12 px-5 rounded-2xl bg-foreground/5 border border-border text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-foreground/10 hover:text-primary transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        {isUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">Categorization</label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={clsx(
                            'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                            category === cat
                              ? 'bg-primary text-white shadow-glow-sm'
                              : 'bg-foreground/5 text-foreground/20 border border-border hover:border-foreground/20 hover:text-foreground/50'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-[10px] bg-foreground/10 rounded-full shrink-0" />
                      <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/30">The Vision <span className="normal-case font-medium opacity-50 tracking-normal ml-1">(Optional)</span></label>
                    </div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What's this channel about?"
                      rows={5}
                      className="w-full p-4 bg-foreground/5 border border-border focus:border-primary/40 rounded-2xl text-[14px] font-medium text-foreground placeholder:text-foreground/10 outline-none resize-none transition-all leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Settings */}
              <div className="space-y-8">
                <div className="space-y-4 pt-1">
                  
                  {/* Privacy */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Privacy</label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPrivate(false)}
                        className={clsx(
                          'flex items-center gap-4 p-5 rounded-3xl border text-left transition-all',
                          !isPrivate
                            ? 'bg-primary/10 border-primary/25 text-foreground ring-1 ring-primary/20'
                            : 'bg-foreground/5 border-border text-foreground/40 hover:bg-foreground/10'
                        )}
                      >
                        <Globe size={22} className={!isPrivate ? 'text-primary' : 'text-foreground/25'} />
                        <div>
                          <div className="text-[13px] font-bold truncate">Public</div>
                          <div className="text-[11px] text-foreground/20 font-medium">Anyone in the workspace can join</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(true)}
                        className={clsx(
                          'flex items-center gap-4 p-5 rounded-3xl border text-left transition-all',
                          isPrivate
                            ? 'bg-rose-500/10 border-rose-500/25 text-foreground ring-1 ring-rose-500/20'
                            : 'bg-white/[0.02] border-white/[0.05] text-foreground/40 hover:bg-white/[0.04]'
                        )}
                      >
                        <Shield size={22} className={isPrivate ? 'text-rose-400' : 'text-foreground/25'} />
                        <div>
                          <div className="text-[13px] font-bold truncate">Private</div>
                          <div className="text-[11px] text-foreground/20 font-medium">Only invited members can join</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Generate Link */}
                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Invite Link</label>
                    <div className="p-6 rounded-3xl bg-foreground/5 border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Shareable URL</span>
                        {generatedLink && (
                          <button 
                            type="button"
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-primary-light transition-all"
                          >
                            {copied ? <Check size={12} /> : <Copy size={12} />}
                            {copied ? 'Copied' : 'Copy'}
                          </button>
                        )}
                      </div>
                      
                      {generatedLink ? (
                        <div className="h-12 bg-black/40 rounded-2xl px-4 flex items-center border border-white/[0.08] relative overflow-hidden group">
                          <code className="text-[12px] font-mono text-primary font-bold">{generatedLink}</code>
                          <button 
                            type="button"
                            onClick={generateLink}
                            className="absolute right-2 p-2 rounded-lg bg-white/[0.1] text-foreground/60 hover:text-foreground hover:bg-white/[0.2] transition-all"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={generateLink}
                          className="w-full h-12 rounded-2xl border border-dashed border-white/[0.1] text-[11px] font-black uppercase tracking-widest text-foreground/30 hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2 group"
                        >
                          <Link size={14} className="group-hover:rotate-45 transition-transform" />
                          Generate Link
                        </button>
                      )}
                      
                      <p className="text-[10px] text-foreground/20 font-medium leading-relaxed">
                        Note: New links will replace any previous invite codes for this channel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Members */}
              <div className="space-y-8">
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-end">
                    <span className="text-[10px] font-black text-primary">{selectedFriends.length} Invited</span>
                  </div>

                  <div className="relative group">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" />
                    <input
                      type="text"
                      value={friendSearch}
                      onChange={(e) => setFriendSearch(e.target.value)}
                      placeholder="Search people to invite..."
                      className="w-full h-12 pl-11 pr-4 bg-foreground/5 border border-border focus:border-primary/40 rounded-2xl text-[13px] font-medium text-foreground placeholder:text-foreground/10 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1 max-h-[440px] overflow-y-auto custom-scrollbar pr-2">
                    {filteredFriends.map(friend => (
                      <button
                        key={friend.id}
                        type="button"
                        onClick={() => toggleFriend(friend.id)}
                        className={clsx(
                          'w-full flex items-center gap-3 p-3 rounded-2xl border transition-all',
                          selectedFriends.includes(friend.id)
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-transparent border-transparent hover:bg-white/[0.03]'
                        )}
                      >
                        <div className="relative shrink-0">
                          <Avatar src={friend.avatar} alt={friend.username} size="md" className="h-10 w-10 border border-white/[0.05]" />
                          <div className={clsx(
                            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0D0D0D]",
                            friend.status === 'ONLINE' ? 'bg-emerald-500' : 
                            friend.status === 'IDLE' ? 'bg-amber-400' :
                            friend.status === 'DND' ? 'bg-rose-500' : 'bg-foreground/20'
                          )} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-[13px] font-bold text-foreground truncate">{friend.username}</div>
                          <div className="text-[10px] text-foreground/20 font-medium">Friend</div>
                        </div>
                        <div className={clsx(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                          selectedFriends.includes(friend.id)
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white/[0.04] border-white/[0.1] text-transparent'
                        )}>
                          <Plus size={12} strokeWidth={4} />
                        </div>
                      </button>
                    ))}
                    {filteredFriends.length === 0 && (
                      <div className="py-10 text-center opacity-20">
                        <UserPlus size={32} className="mx-auto mb-3" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No friends found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
