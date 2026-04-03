import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Hash, Send, Search, Shield, Zap, Globe, List, Lock } from 'lucide-react';

const HeroCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  initialRotate?: number;
  initialX?: number;
  initialY?: number;
}> = ({ children, className, initialRotate = 0, initialX = 0, initialY = 0 }) => (
  <motion.div
    initial={{ rotate: initialRotate, x: initialX, y: initialY }}
    whileHover={{ 
      scale: 1.15, 
      rotate: 0, 
      y: initialY - 60,
      zIndex: 100,
      transition: { type: "spring", stiffness: 400, damping: 15 }
    }}
    className={`glass-layer-main w-full max-w-[420px] aspect-[4/5] p-8 flex flex-col cursor-pointer transition-shadow hover:shadow-primary/20 ${className}`}
  >
    {children}
  </motion.div>
);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Perspective Tilt on the whole container
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="hero-section" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-24 relative z-10 text-center">
        
        {/* Top: 3-Card Interactive Workspace */}
        <motion.div
           ref={containerRef}
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           style={{ 
             perspective: "2000px",
             rotateX,
             rotateY,
             transformStyle: "preserve-3d"
           }}
           className="relative w-full max-w-6xl flex items-center justify-center py-24"
        >
          {/* Card 1: Sidebar/Organization (Left) */}
          <HeroCard initialRotate={-6} initialX={-180} initialY={30} className="absolute left-[5%]">
             <div className="flex items-center gap-3 mb-8">
                <List size={20} className="text-primary" />
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">Workspace</span>
             </div>
             <div className="space-y-8 text-left">
                {[
                  { name: "General", active: true },
                  { name: "Dev-Logs", active: false },
                  { name: "Security", active: false },
                  { name: "Analytics", active: false },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 ${!item.active ? 'opacity-30' : ''}`}>
                    <Hash size={16} className={item.active ? 'text-primary' : 'text-white/40'} />
                    <div className={`h-2.5 rounded-full bg-white/20 ${item.active ? 'w-32' : 'w-24'}`} />
                  </div>
                ))}
             </div>
             <div className="mt-auto pt-8 border-t border-white/5 text-left">
                <span className="text-[10px] font-bold text-white/20 uppercase block mb-4">Active Team</span>
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-10 w-10 rounded-2xl border-2 border-slate-900 bg-slate-800" />
                   ))}
                </div>
             </div>
          </HeroCard>

          {/* Card 2: Main Chat (Center - On Top) */}
          <HeroCard initialRotate={0} initialX={0} initialY={0} className="relative z-20 shadow-primary/10">
             <div className="p-2 border-b border-white/5 flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-left">
                   <div className="h-2.5 w-2.5 rounded-full bg-accent animate-pulse" />
                   <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]"># Development</span>
                </div>
                <Search size={16} className="text-white/20" />
             </div>
             <div className="space-y-8 flex-grow text-left">
                {[
                  { user: "Emma", text: "New SDK is live! 🚢" },
                  { user: "Alex", text: "Latency is at 8ms. ⚡" },
                  { user: "You", text: "Perfect. Deploying. 🚀" },
                ].map((msg, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{msg.user}</span>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-[12px] text-slate-300 leading-relaxed">
                       {msg.text}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 pt-6 border-t border-white/5">
                <div className="h-12 bg-black/20 border border-white/5 rounded-2xl px-6 flex items-center justify-between">
                   <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Type...</span>
                   <Send size={16} className="text-primary/60" />
                </div>
             </div>
          </HeroCard>

          {/* Card 3: Security & Encryption (Right) */}
          <HeroCard initialRotate={6} initialX={180} initialY={30} className="absolute right-[5%]">
             <div className="flex items-center gap-3 mb-8">
                <Shield size={20} className="text-accent" />
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">Security</span>
             </div>
             <div className="p-6 bg-accent/5 border border-accent/20 rounded-3xl flex flex-col gap-6 mb-8 text-left">
                <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-accent uppercase tracking-tighter">E2E Protocol Active</span>
                   <Lock size={14} className="text-accent" />
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: ["30%", "90%", "60%", "100%"] }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="h-full bg-accent shadow-[0_0_10px_#22d3ee]" 
                   />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-6 text-left">
                {[
                  { label: "Uptime", value: "99.9%" },
                  { label: "Encryption", value: "AES-256" },
                  { label: "Nodes", value: "148" },
                  { label: "Auth", value: "Biometric" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/[0.08]">
                    <span className="text-[9px] font-bold text-white/30 uppercase block mb-1">{stat.label}</span>
                    <span className="text-sm font-bold text-white leading-none">{stat.value}</span>
                  </div>
                ))}
             </div>
             <div className="mt-auto flex items-center justify-center p-6">
                 <Globe size={48} className="text-white/5 animate-spin-slow" />
             </div>
          </HeroCard>
        </motion.div>

        {/* Bottom: Branding & Title */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="flex flex-col items-center gap-10 max-w-5xl"
        >
          <div className="hero-tag border-white/5 bg-white/[0.02] backdrop-blur-md">
            <Zap size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">Shadow-Protocol v4.0 Active</span>
          </div>

          <h1 className="hero-title text-white">
            Communicate <span className="text-primary italic">Better</span>.<br />
            Focus <span className="text-secondary">Sharper</span>.
          </h1>
          
          <p className="hero-subtitle text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            NeoPlane is a high-performance communication layer designed for elite teams. 
            Encrypted by default. Layered for absolute clarity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-6">
            <Button variant="primary" className="btn-primary-lg px-14 py-4 shadow-3xl shadow-primary/20 text-lg">
               Launch NeoPlane
            </Button>
            <Button variant="ghost" className="btn-ghost-lg border border-white/10 hover:bg-white/[0.03] px-14 py-4 text-lg">
               View Protocol
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
