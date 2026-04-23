import React from 'react';
import { Menu, Hexagon } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const MobileHeader: React.FC = () => {
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const setActiveView = useAppStore((state) => state.setActiveView);
  const setActiveConversation = useAppStore((state) => state.setActiveConversation);

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 bg-bg-deep/80 backdrop-blur-xl border-b border-border shadow-md">
      <div 
        onClick={() => {
          setActiveConversation(null);
          setActiveView('home');
        }}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Hexagon size={20} className="text-primary fill-primary/10" />
        <span 
          className="font-bold text-lg tracking-tighter uppercase brand-text"
          style={{ color: 'var(--brand)' }}
        >
          neo.
        </span>
      </div>

      <button
        onClick={toggleSidebar}
        className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.05] text-foreground/60 hover:text-primary transition-all"
      >
        <Menu size={20} />
      </button>
    </header>
  );
};
