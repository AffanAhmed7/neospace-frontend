import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatPage } from './pages/ChatPage';
import { Landing } from './pages/Landing';
import { useTheme } from './hooks/useTheme';
import { FluidBackground } from './components/layout/FluidBackground';

const queryClient = new QueryClient();

function App() {
  // Initialize theme hook
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen relative text-foreground transition-colors duration-300">
          <FluidBackground />
          <div className="relative z-0">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<ChatPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
