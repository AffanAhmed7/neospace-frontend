import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Hexagon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import { useAppStore } from '../../store/useAppStore';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { authModalOpen, authModalMode, setAuthModal } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`nav-container ${scrolled ? 'nav-scrolled' : 'nav-initial'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group z-10 relative">
            <Hexagon className="text-brand group-hover:text-primary transition-all duration-300" size={24} strokeWidth={1.5} />
            <span className="text-[1.6rem] font-serif italic tracking-[0.05em] text-brand lowercase pr-1 mt-1">neo.</span>
          </Link>

          <div className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 -translate-x-1/2">
              <a href="#features" className="nav-link text-sm font-medium tracking-wide">Features</a>
              <a href="#showcase" className="nav-link text-sm font-medium tracking-wide">Product</a>
              <a href="#use-cases" className="nav-link text-sm font-medium tracking-wide">Solutions</a>
          </div>

          <div className="flex items-center gap-2 z-10 justify-end relative">
            <Button 
              variant="ghost" 
              onClick={() => setAuthModal(true, 'login')}
              className="text-foreground/70 hover:text-foreground font-medium px-4 tracking-wide whitespace-nowrap"
            >
              Login
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setAuthModal(true, 'signup')}
              className="text-foreground/70 hover:text-foreground font-medium px-4 tracking-wide whitespace-nowrap"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModal(false)} 
        initialMode={authModalMode} 
      />
    </>
  );
};
