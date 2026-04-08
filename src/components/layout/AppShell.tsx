import React from 'react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store/useAppStore';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { ChannelInfo } from './ChannelInfo';
import { ExploreChannels } from '../discovery/ExploreChannels';
import { CreateChannel } from '../discovery/CreateChannel';
import { FriendsPage } from '../social/FriendsPage';
import { RightPanel } from './RightPanel';
import { CommandPalette } from './CommandPalette';
import { NotificationPanel } from './NotificationPanel';
import { UserProfilePanel } from '../settings/UserProfilePanel';
import { HomeDashboard } from './HomeDashboard';
import { motion, AnimatePresence } from 'framer-motion';

export const AppShell: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const rightPanelOpen = useAppStore((state) => state.rightPanelOpen);
  const profilePanelOpen = useAppStore((state) => state.profilePanelOpen);
  const activeView = useAppStore((state) => state.activeView);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  const toggleProfilePanel = useAppStore((state) => state.toggleProfilePanel);

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
      <main className="flex flex-col flex-grow min-w-0 bg-transparent relative z-10 overflow-hidden">
        <div className="flex-grow flex flex-col min-w-0 p-2 md:p-3 overflow-hidden">
          <div className="flex-grow flex flex-col min-w-0 rounded-xl overflow-hidden glass-1 shadow-inner border border-white/[0.02]">
            <AnimatePresence mode="wait">
              {activeView === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <HomeDashboard />
                </motion.div>
              )}
              {activeView === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ChatArea />
                </motion.div>
              )}
              {activeView === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ChannelInfo />
                </motion.div>
              )}
              {activeView === 'explore' && (
                <motion.div
                  key="explore"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ExploreChannels />
                </motion.div>
              )}
              {activeView === 'friends' && (
                <motion.div
                  key="friends"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <FriendsPage />
                </motion.div>
              )}
              {activeView === 'create-channel' && (
                <motion.div
                  key="create-channel"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <CreateChannel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Right Panels Container */}
      <div className={clsx("relative flex h-full shrink-0 z-20 transition-all duration-500", (activeView === 'info' || activeView === 'explore' || activeView === 'friends' || activeView === 'create-channel') ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100")}>
        <AnimatePresence mode="popLayout">
          {/* Right Panel */}
          {rightPanelOpen && !profilePanelOpen && activeView === 'chat' && (
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
