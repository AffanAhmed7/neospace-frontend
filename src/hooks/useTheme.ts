import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const useTheme = () => {
  const { theme, setTheme } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Force dark mode on landing and contact pages
    const isForcedDark = location.pathname === '/' || location.pathname === '/contact' || location.pathname === '/docs' || location.pathname === '/integrations' || location.pathname === '/about' || location.pathname === '/privacy' || location.pathname === '/terms';
    
    // Force dark mode on specific paths, otherwise use store theme
    const activeTheme = isForcedDark 
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
