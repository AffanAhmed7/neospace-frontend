import React from 'react';
import { User, Palette, Bell, Shield, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

export type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'privacy' | 'account';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onLogout: () => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ 
  activeTab, 
  onTabChange,
  onLogout
}) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'account', label: 'Account', icon: Settings },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-transparent border-r border-white/[0.03] w-64 shrink-0 z-20 sticky top-0">
      <div className="px-6 py-8">
        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/20 mb-1">User Settings</h2>
        <div className="text-xl font-bold text-foreground tracking-tighter text-glow uppercase">NeoPlane</div>
      </div>
      
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300 group",
                isActive 
                  ? "bg-primary text-white shadow-glow-sm" 
                  : "text-foreground/30 hover:bg-white/[0.03] hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className={clsx(
                  "transition-all duration-300",
                  isActive ? "text-white" : "text-foreground/10 group-hover:text-primary group-hover:scale-110"
                )} />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                 <div className="h-1.5 w-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.03]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/[0.05] transition-all duration-300 group"
        >
          <LogOut size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Log out session
        </button>
      </div>
    </div>
  );
};
