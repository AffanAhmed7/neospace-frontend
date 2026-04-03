import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { RightPanel } from './RightPanel';
import { CommandPalette } from './CommandPalette';
import { NotificationPanel } from './NotificationPanel';

export const AppShell: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-outfit">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar - Fixed width on Desktop, Drawer on Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content Area (Chat + Header) */}
      <main className="flex flex-col flex-grow min-w-0 bg-background relative">
        <ChatArea />
      </main>

      {/* Right Panel - Collapsible */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-border transition-transform duration-300 lg:relative lg:translate-x-0 ${
          rightPanelOpen ? 'translate-x-0' : 'translate-x-[101%]'
        } ${rightPanelOpen ? 'lg:flex' : 'lg:hidden'}`}
      >
        <RightPanel />
      </aside>

      {/* Overlays */}
      <CommandPalette />
      <NotificationPanel />
    </div>
  );
};
