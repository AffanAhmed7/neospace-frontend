import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { FeatureSection } from '../components/landing/FeatureSection';
import { Showcase } from '../components/landing/Showcase';
import { UseCases } from '../components/landing/UseCases';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';
import { Zap, Layout, BellRing, MessageSquare, Hash, Search } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />
      
      <main>
        <Hero />

        {/* Feature Sections */}
        <div id="features" className="relative">
          <FeatureSection
            subtitle="Built for Real-Time Work"
            title="Communication at the speed of thought."
            description="Live messaging, instant delivery, and real-time typing indicators make coordination effortless. Stop waiting and start doing."
            icon={Zap}
            imageAlt="Real-time messaging preview"
          >
             <div className="flex flex-col gap-4 w-full max-w-sm text-left">
                <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex items-center gap-3">
                   <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                   <span className="text-sm font-medium text-foreground/70 tracking-tight italic">Team is typing...</span>
                </div>
                <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-none shadow-xl self-start max-w-[80%]">
                   <p className="text-sm font-bold text-primary italic leading-relaxed">
                      "I'm updating the deployment script now. Should be live in 5 mins."
                   </p>
                </div>
                <div className="p-3 bg-surface/50 border border-border rounded-xl self-end text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                   Delivered • 10:45 AM
                </div>
             </div>
          </FeatureSection>

          <FeatureSection
            subtitle="Stay Organized"
            title="Structure your chaos with ease."
            description="Channels, threads, and high-performance search ensure that everything is exactly where it needs to be. Historical context at your fingertips."
            icon={Layout}
            imageAlt="Organization UI preview"
            reverse
          >
             <div className="grid grid-cols-1 gap-4 w-full max-w-sm text-left">
                <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors">
                   <div className="flex items-center gap-3">
                      <Hash size={18} className="text-foreground/40" />
                      <span className="text-sm font-bold text-foreground">engineering-logs</span>
                   </div>
                   <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">12</div>
                </div>
                <div className="p-4 bg-surface border border-border rounded-2xl shadow-xl flex items-center gap-4">
                   <Search size={18} className="text-foreground/40" />
                   <div className="h-5 w-[1px] bg-border" />
                   <span className="text-sm font-medium text-foreground/30 italic">Search archives...</span>
                </div>
                <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex flex-col gap-3">
                   <div className="flex items-center gap-2">
                       <MessageSquare size={14} className="text-primary" />
                       <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Thread Active</span>
                   </div>
                   <p className="text-[12px] font-bold text-foreground leading-snug">
                      "Should we use PostgreSQL or Redis for this specific cache layer?"
                   </p>
                </div>
             </div>
          </FeatureSection>

          <FeatureSection
            subtitle="Work Without Noise"
            title="Focus on what matters most."
            description="Smart notifications and granular mention controls let you tune out the noise and zero in on the work that needs you."
            icon={BellRing}
            imageAlt="Notification focus preview"
          >
             <div className="relative flex flex-col items-center justify-center h-full">
                <div className="p-6 bg-card border border-border rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-5 w-full max-w-[280px] text-left">
                   <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-xs font-bold text-foreground">Activity</span>
                      <BellRing size={16} className="text-primary" />
                   </div>
                   <div className="flex items-center gap-3 group cursor-pointer">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-grow min-w-0">
                         <p className="text-xs font-bold text-foreground">Sarah mentioned you</p>
                         <p className="text-[10px] text-foreground/40 truncate italic">"Check out the thread in #design..."</p>
                      </div>
                   </div>
                   <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-center">Do Not Disturb Active</p>
                   </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 p-4 bg-accent/20 border border-accent/20 rounded-2xl shadow-xl backdrop-blur-md animate-bounce">
                   <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <span className="text-[10px] font-bold text-foreground">Deep Focus Mode</span>
                   </div>
                </div>
             </div>
          </FeatureSection>
        </div>

        <Showcase />
        <UseCases />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};
