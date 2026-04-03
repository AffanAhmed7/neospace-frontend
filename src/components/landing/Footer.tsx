import React from 'react';
import { Plane, Globe, Users, MessageSquare } from 'lucide-react';

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Integrations', 'Pricing', 'Documentation']
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Privacy', 'Terms']
  },
  {
    title: 'Support',
    links: ['Help Center', 'API Status', 'Community', 'Contact']
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container pt-24 pb-12 border-t border-border bg-card/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
           <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <Plane size={22} />
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
                       <a href="#" className="text-sm text-foreground/40 hover:text-primary font-medium transition-colors">
                          {link}
                       </a>
                    </li>
                 ))}
              </ul>
           </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
         <p className="text-xs font-bold text-foreground/20 leading-relaxed uppercase tracking-widest">
            © 2026 NeoPlane. All rights reserved.
         </p>
         <div className="flex items-center gap-8">
            <span className="text-xs font-bold text-foreground/30 hover:text-foreground/50 cursor-pointer transition-colors uppercase tracking-widest">Status: Healthy</span>
            <span className="text-xs font-bold text-foreground/30 hover:text-foreground/50 cursor-pointer transition-colors uppercase tracking-widest">Security</span>
         </div>
      </div>
    </footer>
  );
};
