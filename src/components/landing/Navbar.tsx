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
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">
          
          {/* Row 1 for Mobile: Logo (Left) and Auth (Right) */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <Link to="/" className="flex items-center gap-2 group z-10 relative shrink-0">
              <Hexagon className="text-brand group-hover:text-primary transition-all duration-300" size={20} md:size={24} strokeWidth={1.5} />
              <span className="text-[1.2rem] md:text-[1.6rem] font-serif italic tracking-[0.05em] text-brand lowercase pr-1 mt-1">neo.</span>
            </Link>

            <div className="flex md:hidden items-center gap-2 z-10 relative">
              <Button 
                variant="ghost" 
                onClick={() => setAuthModal(true, 'login')}
                className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 tracking-wide whitespace-nowrap text-[10px] sm:text-xs"
              >
                Login
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setAuthModal(true, 'signup')}
                className="text-foreground/70 hover:text-foreground font-medium px-3 py-1 tracking-wide whitespace-nowrap text-[10px] sm:text-xs border border-border/10 rounded-lg"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Row 2 for Mobile: Nav Links (Centered) */}
          <div className="flex items-center justify-center gap-6 sm:gap-8 md:gap-10 md:absolute md:left-1/2 md:-translate-x-1/2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <Link to="/#features" className="nav-link text-[10px] sm:text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">Features</Link>
              <Link to="/#product" className="nav-link text-[10px] sm:text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">Product</Link>
              <Link to="/#solutions" className="nav-link text-[10px] sm:text-xs md:text-sm font-medium tracking-wide whitespace-nowrap">Solutions</Link>
          </div>

          {/* Desktop Only Auth Buttons (Right) */}
          <div className="hidden md:flex items-center gap-2 z-10 relative">
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
              className="text-foreground/70 hover:text-foreground font-medium px-4 tracking-wide whitespace-nowrap border border-border/10"
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
