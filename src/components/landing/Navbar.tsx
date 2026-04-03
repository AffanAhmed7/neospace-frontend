import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${scrolled ? 'nav-scrolled' : 'nav-initial'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="nav-logo-box">
            <Plane className="text-white" size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">NeoPlane</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 mr-auto ml-12">
            <a href="#features" className="nav-link">Features</a>
            <a href="#showcase" className="nav-link">Product</a>
            <a href="#use-cases" className="nav-link">Solutions</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
            Login
          </Button>
          <Button variant="primary" className="rounded-2xl px-6 shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};
