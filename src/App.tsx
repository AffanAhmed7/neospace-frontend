import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatPage } from './pages/ChatPage';
import { Landing } from './pages/Landing';
import { ContactPage } from './pages/ContactPage';
import { DocsPage } from './pages/DocsPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { Settings } from './pages/settings/Settings';
import { useTheme } from './hooks/useTheme';
import { FluidBackground } from './components/layout/FluidBackground';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { ConfirmModal } from './components/ui/ConfirmModal';

const queryClient = new QueryClient();

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const checkAuth = useAuthStore(state => state.checkAuth);

  // Initialize theme hook
  useTheme();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isApp = location.pathname.startsWith('/app') ||
    location.pathname.startsWith('/settings');

  const isSettings = location.pathname.startsWith('/settings');

  return (
    <div className="min-h-screen relative text-foreground transition-colors duration-300">
      <ScrollToTop />
      <FluidBackground isStatic={isApp} variant={isSettings ? 'settings' : 'default'} />
      <ToastProvider />
      <ConfirmModal />
      <div className="relative z-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/app" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
