import React from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { RightPanel } from './RightPanel';
import { CommandPalette } from './CommandPalette';
import { NotificationPanel } from './NotificationPanel';
import { UserProfilePanel } from '../settings/UserProfilePanel';
import { useSettingsStore } from '../../store/useSettingsStore';
import { motion, AnimatePresence } from 'framer-motion';

export const AppShell: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const profilePanelOpen = useAppStore((state) => state.profilePanelOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);
  const { user } = useSettingsStore();

  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg-deep/80 backdrop-blur-md lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Elevated Glass */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 border-r border-white/[0.03] glass-2 shadow-2xl shadow-black/50",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main Content - Broader Overview */}
      <main className="flex flex-col flex-grow min-w-0 bg-transparent relative z-10">
        <div className="flex-grow flex flex-col min-w-0 p-2 md:p-3">
          <div className="flex-grow flex flex-col min-w-0 rounded-xl overflow-hidden glass-1 shadow-inner border border-white/[0.02]">
            <ChatArea />
          </div>
        </div>
      </main>

      {/* Right Panels Container */}
      <div className="relative flex h-full shrink-0 z-20">
        <AnimatePresence mode="popLayout">
          {/* Right Panel */}
          {rightPanelOpen && !profilePanelOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-72 border-l border-white/[0.03] glass-2 shadow-2xl shadow-black/50"
            >
              <RightPanel />
            </motion.aside>
          )}

          {/* Profile Panel */}
          {profilePanelOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-80 border-l border-white/[0.03] glass-3 shadow-2xl shadow-black/50"
            >
              <UserProfilePanel 
                user={{ ...user, email: 'jane@neoplane.io' }} 
                onClose={toggleProfilePanel} 
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Overlays */}
      <CommandPalette />
      <NotificationPanel />
    </div>
  );
};
