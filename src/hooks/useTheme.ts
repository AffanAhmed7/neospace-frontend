import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Check if we are on the landing page
    const isLanding = location.pathname === '/';
    
    // Force dark mode on landing, otherwise use store theme
    const activeTheme = isLanding 
      ? 'dark' 
      : (theme === 'dark' || theme === 'offwhite') ? theme : 'dark';
    
    root.classList.remove('dark', 'offwhite', 'light');
    root.classList.add(activeTheme);
  }, [theme, location.pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'offwhite' : 'dark';
    setTheme(nextTheme);
  };

  return { theme, setTheme, toggleTheme };
};
