import React, { useState, useRef } from 'react';
import { useSettingsStore, BANNER_PRESETS, AVATAR_OPTIONS } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Camera, X } from 'lucide-react';
import { FormRow } from './FormRow';
import { clsx } from 'clsx';

export const ProfileForm: React.FC = () => {
  const { user, updateProfile, addToast } = useSettingsStore();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState(user.banner || 'bg-primary');
  const [isLoading, setIsLoading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBanner(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateProfile({ username, bio, avatar, banner });
    addToast('Profile updated successfully!', 'success');
    setIsLoading(false);
  };

  const hasChanges = username !== user.username || bio !== (user.bio || '') || avatar !== user.avatar || banner !== user.banner;

  return (
    <div className="space-y-6">
      <FormRow 
        label="Avatar" 
        description="Your public primary image."
        align="top"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="h-20 w-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] overflow-hidden flex items-center justify-center relative z-10 shadow-premium transition-transform duration-500 group-hover:scale-105">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-3xl font-bold text-primary/40 text-glow tracking-tighter">{username[0]?.toUpperCase() || 'N'}</div>
                )}
                
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
                >
                  <Camera className="w-6 h-6 text-white scale-75 group-hover:scale-100 transition-transform" />
                </button>
              </div>
              
              {avatar && (
                <button
                  onClick={() => setAvatar('')}
                  className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-lg shadow-glow-sm hover:scale-110 active:scale-90 transition-all z-20"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
               <Button variant="ghost" size="sm" className="bg-white/[0.04] border border-white/[0.06] text-[10px]" onClick={() => avatarInputRef.current?.click()}>Upload Avatar</Button>
            </div>
            
            <input
              ref={avatarInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20 px-1">Signature Avatars</h5>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar-compact max-w-[400px]">
              {AVATAR_OPTIONS.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setAvatar(url)}
                  className={clsx(
                    "relative shrink-0 h-12 w-12 rounded-xl transition-all duration-300 overflow-hidden group/preset",
                    avatar === url 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-[#09090b] scale-105" 
                      : "ring-1 ring-white/[0.05] hover:ring-white/20 hover:scale-110 active:scale-95"
                  )}
                >
                  <img src={url} alt={`Preset ${i}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/preset:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </FormRow>

      <FormRow 
        label="Profile Banner" 
        description="Displayed at the top of your profile modal."
        align="top"
      >
        <div className="space-y-4">
          <div className="relative group">
            <div className={clsx(
              "h-24 w-full rounded-2xl overflow-hidden border border-white/[0.05] relative transition-all duration-500 group-hover:border-primary/20",
              banner.startsWith('bg-') ? banner : ''
            )}>
              {(!banner.startsWith('bg-')) && (
                <img src={banner} alt="Banner" className="h-full w-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/40 transition-all duration-300"
              >
                <Camera className="w-6 h-6 text-white" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Change Banner</span>
              </button>
            </div>

            {banner !== 'bg-primary' && (
              <button
                onClick={() => setBanner('bg-primary')}
                className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-lg shadow-glow-sm hover:scale-110 active:scale-90 transition-all z-20"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Presets Gallery */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-black text-foreground/20 uppercase tracking-widest pl-1">Theme Presets</h5>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {BANNER_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setBanner(preset.url)}
                  className={clsx(
                    "h-12 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 active:scale-95",
                    banner === preset.url ? "border-primary shadow-glow-sm scale-105" : "border-white/[0.05] hover:border-white/20"
                  )}
                >
                  <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or paste banner URL..."
              value={banner.startsWith('data:') ? 'Local file uploaded' : (banner.startsWith('bg-') ? '' : banner)}
              readOnly={banner.startsWith('data:')}
              onChange={(e) => setBanner(e.target.value)}
              className="flex-1 h-9 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 text-[11px] font-medium text-foreground/60 focus:outline-none focus:border-primary/20 transition-all"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-white/[0.04] border border-white/[0.06] text-[10px] shrink-0" 
              onClick={() => bannerInputRef.current?.click()}
            >
              Upload Hero
            </Button>
          </div>
          
          <input
            ref={bannerInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleBannerChange}
          />
        </div>
      </FormRow>

      <div className="bg-white/[0.02] border border-white/[0.03] rounded-3xl p-6 space-y-6">
        <FormRow label="Display Name" description="Choose a unique name.">
          <Input
            placeholder="e.g. Alex Rivera"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 bg-white/[0.02] text-[13px] border-white/[0.05] focus:border-primary/20 font-semibold"
          />
        </FormRow>

        <FormRow label="Bio" description="Tell your team about yourself.">
          <textarea
            className="w-full h-24 rounded-2xl bg-white/[0.02] border border-white/[0.05] focus:border-primary/20 px-4 py-3 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/10 transition-all duration-300 resize-none text-foreground placeholder:text-foreground/10 leading-relaxed"
            placeholder="Type something..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </FormRow>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          variant="primary"
          size="md"
          className="shadow-glow-sm uppercase text-[11px] tracking-widest font-black"
          onClick={handleSave} 
          isLoading={isLoading}
          disabled={!hasChanges}
        >
          Save Identity
        </Button>
      </div>
    </div>
  );
};
