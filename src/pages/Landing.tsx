import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { FeatureSection } from '../components/landing/FeatureSection';
import { Showcase } from '../components/landing/Showcase';
import { UseCases } from '../components/landing/UseCases';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';
import { MessageSquare, Hash, Search, BellRing } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="landing-wrapper">
      <Navbar />

      <main>
        <Hero />

        {/* Feature Sections */}
        <div id="features" className="relative">

          {/* Feature 1 — Real-time messaging */}
          <FeatureSection
            title="Your conversations, actually keeping up."
            description="Every message lands the second you hit send. See who's typing, react, reply instantly — whether you're coordinating a trip or just catching up."
            imageAlt="Real-time messaging preview"
          >
            <div className="flex flex-col gap-4 w-full max-w-sm text-left">
              <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-medium text-foreground/70 tracking-tight italic">Mia and 2 others are typing...</span>
              </div>
              <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-none shadow-xl self-start max-w-[85%]">
                <p className="text-sm font-bold text-primary leading-relaxed">
                  "The Bali trip is confirmed! I just booked the villa for all of us."
                </p>
              </div>
              <div className="flex gap-2 self-start pl-1">
                <div className="px-3 py-1.5 bg-surface/80 border border-border rounded-full text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer hover:border-primary/30 transition-all">
                  <span>🔥</span>
                  <span className="text-foreground/60">6</span>
                </div>
                <div className="px-3 py-1.5 bg-surface/80 border border-border rounded-full text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer hover:border-primary/30 transition-all">
                  <span>😂</span>
                  <span className="text-foreground/60">3</span>
                </div>
                <div className="px-3 py-1.5 bg-primary/15 border border-primary/30 rounded-full text-[12px] font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                  <span>❤️</span>
                  <span>5</span>
                  <span className="text-[10px] ml-0.5 opacity-60">You</span>
                </div>
              </div>
              <div className="p-3 bg-surface/50 border border-border rounded-xl self-end text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                Delivered · 2:12 PM
              </div>
            </div>
          </FeatureSection>

          {/* Feature 2 — Channels & Search */}
          <FeatureSection
            title="Stop losing stuff in the scroll."
            description="Make a channel for the trip, one for work, one just for fun. Keep the deep convos in threads. And when you forget where something was — just search it."
            imageAlt="Organization UI preview"
            reverse
          >
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm text-left">
              <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex flex-col gap-3">
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Your Channels</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between py-1.5 px-2 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-primary" />
                      <span className="text-sm font-semibold text-foreground">trip-to-bali</span>
                    </div>
                    <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-bold">4</div>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 opacity-40">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-foreground/40" />
                      <span className="text-sm font-medium text-foreground">work-space</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1.5 px-2 opacity-40">
                    <div className="flex items-center gap-2">
                      <Hash size={14} className="text-foreground/40" />
                      <span className="text-sm font-medium text-foreground">random</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3.5 bg-surface border border-border rounded-2xl shadow-xl flex items-center gap-3">
                <Search size={16} className="text-foreground/40 shrink-0" />
                <div className="h-5 w-[1px] bg-border" />
                <span className="text-sm font-medium text-foreground/30 italic">Search "Bali flights link"...</span>
              </div>
              <div className="p-4 bg-background border border-border rounded-2xl shadow-xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Thread · 6 replies</span>
                </div>
                <p className="text-[12px] font-semibold text-foreground leading-snug">
                  "Ubud or Seminyak for the first night? Cast your vote"
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-primary/40 border-2 border-background" />
                    <div className="h-6 w-6 rounded-full bg-accent/40 border-2 border-background" />
                    <div className="h-6 w-6 rounded-full bg-secondary/40 border-2 border-background" />
                  </div>
                  <span className="text-[10px] text-foreground/40 font-medium">Mia, Jake +4 replied</span>
                </div>
              </div>
            </div>
          </FeatureSection>

          {/* Feature 3 — Notifications & Focus */}
          <FeatureSection
            title="Notifications that don't drive you crazy."
            description="Mute a group without leaving it. Snooze the noise. Flip on Focus Mode when you need to get something done — NeoPlane won't bother you unless you tell it to."
            imageAlt="Notification focus preview"
          >
            <div className="relative flex flex-col items-center justify-center h-full">
              <div className="p-6 bg-card border border-border rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-4 w-full max-w-[280px] text-left overflow-hidden">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-foreground">Notifications</span>
                  <BellRing size={16} className="text-primary" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-foreground">Mia mentioned you</p>
                    <p className="text-[10px] text-foreground/50 italic mt-0.5">"@you should pick the restaurant!"</p>
                    <p className="text-[10px] text-foreground/25 mt-1">Just now · #trip-to-bali</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 opacity-35">
                  <div className="h-2 w-2 rounded-full bg-border mt-1.5 shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-semibold text-foreground">Jake replied in thread</p>
                    <p className="text-[10px] text-foreground/40 italic mt-0.5">"I vote Ubud, final answer"</p>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Focus Mode · Until 3 PM</p>
                  </div>
                  <p className="text-[10px] font-medium text-primary/60 italic leading-tight pl-3.5 border-l border-primary/20">
                    Only @mentions get through
                  </p>
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
