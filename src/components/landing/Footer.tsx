import React from 'react';
import { Hexagon, Globe, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Product',
    links: ['Integrations', 'Documentation']
  },
  {
    title: 'Company',
    links: ['About', 'Privacy']
  },
  {
    title: 'Support',
    links: ['Contact']
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container pt-32 lg:pt-24 pb-12 border-t border-border bg-card/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
        <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
           <div className="flex items-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center text-primary transition-all duration-300">
                 <Hexagon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">NeoPlane</span>
           </div>
           <p className="text-sm text-foreground/50 leading-relaxed max-w-xs font-medium">
              The communication layer for the modern enterprise. Built for speed, focused on privacy.
           </p>
           <div className="flex items-center gap-4 text-foreground/40">
              <Globe size={20} className="hover:text-primary cursor-pointer transition-colors" />
              <Users size={20} className="hover:text-primary cursor-pointer transition-colors" />
              <MessageSquare size={20} className="hover:text-primary cursor-pointer transition-colors" />
           </div>
        </div>

        {footerLinks.map((section) => (
           <div key={section.title} className="flex flex-col gap-5 text-left">
              <h4 className="text-sm font-bold text-foreground tracking-widest uppercase">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                 {section.links.map((link) => (
                    <li key={link}>
                       <Link 
                          to={
                            link === 'Contact' ? '/contact' 
                            : link === 'Features' ? '/#features' 
                            : link === 'Documentation' ? '/docs' 
                            : link === 'Integrations' ? '/integrations' 
                            : link === 'About' ? '/about'
                            : link === 'Privacy' ? '/privacy'
                            : link === 'Community' ? '/community'
                            : '/#features'
                          } 
                          className="text-sm text-foreground/40 hover:text-primary font-medium transition-colors"
                       >
                          {link}
                       </Link>
                    </li>
                 ))}
              </ul>
           </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-border flex items-center justify-center">
         <p className="text-xs font-bold text-foreground/20 leading-relaxed uppercase tracking-widest text-center">
            © 2026 NeoPlane. All rights reserved.
         </p>
      </div>
    </footer>
  );
};
