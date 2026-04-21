import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SettingsSidebar, type SettingsTab } from '../../components/settings/SettingsSidebar';
import { SettingsSection } from '../../components/settings/SettingsSection';
import { ProfileForm } from '../../components/settings/ProfileForm';
import { FormRow } from '../../components/settings/FormRow';
import { ToggleSwitch } from '../../components/ui/ToggleSwitch';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const { notifications, privacy, updateNotifications, updatePrivacy, addToast } = useSettingsStore();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useAppStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/app');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully!', 'info');
    navigate('/');
  };

  const [passwordData, setPasswordData] = useState({
    current: '',
    next: '',
    confirm: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async () => {
    if (passwordData.next !== passwordData.confirm) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (passwordData.next.length < 8) {
      addToast('Password must be at least 8 characters', 'error');
      return;
    }
    
    setIsUpdatingPassword(true);
    const success = await useSettingsStore.getState().updatePassword(passwordData.current, passwordData.next);
    if (success) {
      addToast('Password updated successfully', 'success');
      setPasswordData({ current: '', next: '', confirm: '' });
    } else {
      addToast('Failed to update password', 'error');
    }
    setIsUpdatingPassword(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <SettingsSection 
            id="profile" 
            title="Profile Settings" 
            description="Manage your public identity and profile information."
          >
            <ProfileForm />
          </SettingsSection>
        );

      case 'appearance':
        return (
          <SettingsSection 
            id="appearance" 
            title="Appearance" 
            description="Customize how NeoPlane looks on your device."
          >
            <FormRow label="Theme" description="Switch between light and dark modes or follow your system settings.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { 
                    id: 'dark', 
                    label: 'Dark Mode', 
                    desc: 'Calm & Focused',
                    bg: 'bg-[#010204]',
                  },
                  { 
                    id: 'offwhite', 
                    label: 'Premium Off-White', 
                    desc: 'Elegant & Crisp',
                    bg: 'bg-[#F5F5F7]',
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as 'dark' | 'offwhite')}
                    className={clsx(
                      "group relative flex flex-col items-start gap-3 p-4 rounded-2xl border transition-all duration-300",
                      theme === t.id 
                        ? "border-primary bg-primary/5 shadow-glow-sm" 
                        : "border-white/[0.05] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                    )}
                  >
                    {/* Mini UI Preview */}
                    <div className={clsx("w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.05] shadow-inner", t.bg)}>
                       <div className="p-2 space-y-1.5">
                          <div className={clsx("h-1 w-1/2 rounded-full opacity-20", t.id === 'light' ? 'bg-black' : 'bg-white')} />
                          <div className={clsx("h-1 w-3/4 rounded-full opacity-10", t.id === 'light' ? 'bg-black' : 'bg-white')} />
                          <div className="flex gap-1.5 pt-1.5">
                             <div className="h-3 w-3 rounded-full bg-primary/40" />
                             <div className="h-3 w-3 rounded-full bg-secondary/40" />
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                       <span className="text-[12px] font-bold text-foreground tracking-tight">{t.label}</span>
                       <span className="text-[10px] font-medium text-foreground/30">{t.desc}</span>
                    </div>
                    {theme === t.id && (
                       <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </FormRow>
          </SettingsSection>
        );

      case 'notifications':
        return (
          <SettingsSection 
            id="notifications" 
            title="Notifications" 
            description="Control when and how you want to be notified."
          >
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.03] rounded-3xl p-6 space-y-6">
                 <FormRow label="Mentions" description="Notify me when someone mentions me in a channel.">
                   <ToggleSwitch 
                     checked={notifications.mentions} 
                     onChange={(checked) => updateNotifications({ mentions: checked })} 
                   />
                 </FormRow>
                 <FormRow label="Direct Messages" description="Notify me when I receive a private message.">
                   <ToggleSwitch 
                     checked={notifications.messages} 
                     onChange={(checked) => updateNotifications({ messages: checked })} 
                   />
                 </FormRow>
                 <FormRow label="Reactions" description="Notify me when someone reacts to my messages.">
                   <ToggleSwitch 
                     checked={notifications.reactions} 
                     onChange={(checked) => updateNotifications({ reactions: checked })} 
                   />
                 </FormRow>
              </div>
            </div>
          </SettingsSection>
        );

      case 'privacy':
        return (
          <SettingsSection 
            id="privacy" 
            title="Privacy & Security" 
            description="Manage your visibility and security preferences."
          >
            <div className="space-y-3">
              <div className="bg-white/[0.02] border border-white/[0.03] rounded-3xl p-6 space-y-6">
                 <FormRow label="Online Status" description="Show when you are active to other users.">
                   <ToggleSwitch 
                     checked={privacy.onlineStatus} 
                     onChange={(checked) => updatePrivacy({ onlineStatus: checked })} 
                   />
                 </FormRow>
                 <FormRow label="Read Receipts" description="Let others know when you have read their messages.">
                   <ToggleSwitch 
                     checked={privacy.readReceipts} 
                     onChange={(checked) => updatePrivacy({ readReceipts: checked })} 
                   />
                 </FormRow>
                 <div className="pt-6 border-t border-white/[0.03]">
                   <Button variant="ghost" className="w-full justify-start h-12 bg-white/[0.04] text-[12px] font-bold tracking-tight rounded-xl group hover:bg-primary/5 transition-all">
                     <ShieldCheck className="w-4 h-4 text-primary text-glow mr-3" />
                     Enhanced Privacy Mode
                     <span className="ml-auto px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.1em]">Beta</span>
                   </Button>
                 </div>
              </div>
            </div>
          </SettingsSection>
        );

      case 'account':
        return (
          <SettingsSection 
            id="account" 
            title="Account Management" 
            description="Manage your account security and data."
          >
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/[0.03] rounded-3xl p-6 space-y-6">
                 <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-4 px-2">Security & Password</h4>
                 
                 <FormRow label="Current Password" description="Verify your identity.">
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.current}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, current: e.target.value})}
                      className="h-10 bg-white/[0.02] border-white/[0.05] focus:border-primary/20 text-[13px]"
                    />
                 </FormRow>

                 <FormRow label="New Password" description="Min. 8 characters.">
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.next}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, next: e.target.value})}
                      className="h-10 bg-white/[0.02] border-white/[0.05] focus:border-primary/20 text-[13px]"
                    />
                 </FormRow>

                 <FormRow label="Confirm Password" description="Must match new password.">
                    <Input 
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.confirm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="h-10 bg-white/[0.02] border-white/[0.05] focus:border-primary/20 text-[13px]"
                    />
                 </FormRow>

                 <div className="pt-4 flex justify-end">
                    <Button 
                      variant="primary" 
                      onClick={handlePasswordUpdate}
                      isLoading={isUpdatingPassword}
                      disabled={!passwordData.current || !passwordData.next || !passwordData.confirm}
                      className="h-10 px-6 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-glow-sm"
                    >
                      Update Password
                    </Button>
                 </div>
              </div>

              <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-3xl p-8 space-y-4">
                <div className="flex flex-col gap-1.5">
                   <h4 className="text-rose-500 text-base font-bold flex items-center gap-2">
                      Danger Zone
                   </h4>
                   <p className="text-[13px] font-medium text-foreground/30 leading-relaxed max-w-md">
                     Once you delete your account, all your data will be permanently removed. This action is irreversible.
                   </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="danger" className="h-10 px-5 rounded-xl font-bold text-xs tracking-tight shadow-lg shadow-rose-500/10 active:scale-95 transition-all">
                    Delete Account
                  </Button>
                  <Button variant="ghost" className="h-10 px-5 rounded-xl border border-white/[0.05] text-foreground/30 hover:text-foreground text-xs">
                    Learn about retention
                  </Button>
                </div>
              </div>
            </div>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden relative">
      {/* Background stays deep and liquid */}
      <div className="absolute inset-0 z-0 bg-bg-deep" />
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex h-full w-full">
        <SettingsSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-y-auto px-4 pt-16 pb-10 md:px-8 lg:px-10 flex justify-center selection:bg-primary/30">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Simple Close Button */}
      <button 
        onClick={() => navigate('/app')}
        className="fixed top-8 right-8 z-50 h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-all duration-300 group flex items-center justify-center shadow-2xl"
        title="Close (ESC)"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};
