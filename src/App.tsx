import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatPage } from './pages/ChatPage';
import { Landing } from './pages/Landing';
import { Settings } from './pages/settings/Settings';
import { useTheme } from './hooks/useTheme';
import { FluidBackground } from './components/layout/FluidBackground';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

const queryClient = new QueryClient();

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isApp = location.pathname.startsWith('/app') || 
                location.pathname.startsWith('/settings');
  
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <div className="min-h-screen relative text-foreground transition-colors duration-300">
      <FluidBackground isStatic={isApp} variant={isSettings ? 'settings' : 'default'} />
      <ToastProvider />
      <div className="relative z-0">
        <Routes>
          <Route path="/" element={<Landing />} />
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
  // Initialize theme hook
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
