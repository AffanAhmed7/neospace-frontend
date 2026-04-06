import React, { useState, useRef } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Camera, X } from 'lucide-react';
import { FormRow } from './FormRow';

export const ProfileForm: React.FC = () => {
  const { user, updateProfile, addToast } = useSettingsStore();
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateProfile({ username, bio, avatar });
    addToast('Profile updated successfully!', 'success');
    setIsLoading(false);
  };

  const hasChanges = username !== user.username || bio !== (user.bio || '') || avatar !== user.avatar;

  return (
    <div className="space-y-6">
      <FormRow 
        label="Avatar" 
        description="Square SVG, PNG, or JPG (max. 2MB)"
        align="top"
      >
        <div className="flex items-center gap-6 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="h-20 w-20 rounded-2xl glass-2 border-white/[0.05] overflow-hidden flex items-center justify-center relative z-10 shadow-premium transition-transform duration-500 group-hover:scale-105">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="text-3xl font-bold text-primary/40 text-glow tracking-tighter">{username[0]?.toUpperCase() || 'N'}</div>
              )}
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"
              >
                <Camera className="w-6 h-6 text-white scale-75 group-hover:scale-100 transition-transform" />
              </button>
            </div>
            
            {avatar && (
              <button
                onClick={() => setAvatar(null)}
                className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 text-white rounded-lg shadow-glow-sm hover:scale-110 active:scale-90 transition-all z-20"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="glass-2 text-[10px]" onClick={() => fileInputRef.current?.click()}>Upload</Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </FormRow>

      <div className="glass-2 bg-white/[0.01] border-white/[0.03] rounded-3xl p-6 space-y-6">
        <FormRow label="Display Name" description="Choose a unique name.">
          <Input
            placeholder="e.g. Alex Rivera"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 glass-2 text-[13px] border-white/[0.05] focus:border-primary/20 font-semibold"
          />
        </FormRow>

        <FormRow label="Bio" description="Tell your team about yourself.">
          <textarea
            className="w-full h-24 rounded-2xl glass-2 border-white/[0.05] focus:border-primary/20 bg-white/[0.02] px-4 py-3 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/10 transition-all duration-300 resize-none text-foreground placeholder:text-foreground/10 leading-relaxed"
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
