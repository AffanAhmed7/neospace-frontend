import React, { useRef } from 'react';
import { Button } from '../ui/Button';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  Hash, Users, 
  MessageCircle, CheckCircle,
  Monitor, ArrowRight, Lock,
  Heart, Smile
} from 'lucide-react';

import { useAppStore } from '../../store/useAppStore';

const HeroCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  initialRotate?: number;
  initialX?: number;
  initialY?: number;
  hoverX?: number;
}> = ({ children, className, initialRotate = 0, initialX = 0, initialY = 0, hoverX }) => (
  <motion.div
    initial={{ rotate: initialRotate, x: initialX, y: initialY }}
    whileHover={{ 
      scale: 1.08, 
      rotate: 0, 
      x: hoverX !== undefined ? hoverX : initialX,
      y: initialY - 15,
      z: 50,
    }}
    transition={{ type: "spring", stiffness: 80, damping: 25, mass: 1 }}
    style={{ transformStyle: "preserve-3d" }}
    className={`rounded-3xl border border-white/10 shadow-2xl w-full max-w-[380px] aspect-[4/5] p-6 lg:p-8 flex flex-col cursor-pointer transition-shadow hover:shadow-primary/20 will-change-transform ${className}`}
  >
    {children}
  </motion.div>
);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Perspective Tilt on the whole container
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 80, damping: 50, mass: 1 });
  const mouseYSpring = useSpring(y, { stiffness: 80, damping: 50, mass: 1 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const { setAuthModal } = useAppStore();

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
      <div className="max-w-[90rem] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 w-full min-h-[80vh]">
        
        {/* Left: Branding & Title */}
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-full lg:w-[45%] flex flex-col items-start gap-8 text-left z-20 relative pt-10 pb-10 lg:py-0"
        >


          <div className="relative">
            {/* Soft, strictly minimalist ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-white/10 via-slate-400/5 to-transparent blur-[80px] -z-10 pointer-events-none" />
            
            <h1 className="text-[3.5rem] lg:text-[5rem] font-semibold tracking-tighter leading-[1.05]">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-indigo-200 pr-2">
                Your team's
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-500 block mt-1 pb-2">
                new home base.
              </span>
            </h1>
          </div>
          
          <p className="text-slate-400 max-w-xl text-lg lg:text-xl leading-relaxed mt-2">
            NeoPlane is a high-performance communication layer designed for elite teams. 
            Encrypted by default. Layered for absolute clarity. Faster than thought.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Button 
              onClick={() => setAuthModal(true, 'signup')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl px-6 py-2.5 text-sm font-medium flex items-center gap-2 group transition-all backdrop-blur-md shadow-sm"
            >
               Get Started
               <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>

        {/* Right: 3-Card Interactive Stack */}
        <motion.div
           ref={containerRef}
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.3 }}
           style={{ 
             perspective: "2000px",
             rotateX,
             rotateY,
             transformStyle: "preserve-3d",
             willChange: "transform"
           }}
           className="w-full lg:w-[55%] relative flex items-center justify-center py-10 min-h-[500px]"
        >
          {/* Card 1: Workspace Activity (Left, Pushed Back) */ }
          <HeroCard initialRotate={-8} initialX={-140} initialY={40} hoverX={-40} className="absolute left-[5%] lg:left-[10%] shadow-2xl bg-white/[0.02] backdrop-blur-2xl border-white/5 ring-1 ring-white/10">
             <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/5">
                <Users size={14} className="text-white/50" />
                <span className="text-xs font-semibold text-white/90 tracking-wide">Active Teams</span>
             </div>
             
             {/* Rich Workspace Content */}
             <div className="flex flex-col gap-5 flex-grow">
               
               <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="relative">
                       <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow-lg" />
                       <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#0b101e] rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-accent rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse" />
                       </div>
                     </div>
                     <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white">Engineering Core</span>
                        <span className="text-[10px] text-white/40">12 online • Voice active</span>
                     </div>
                  </div>
                  <Monitor size={14} className="text-white/30 group-hover:text-white/80 transition-colors" />
               </div>

               <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="relative">
                       <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="h-10 w-10 rounded-xl object-cover border border-white/10 shadow-lg" />
                       <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#0b101e] rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-white/20 rounded-full" />
                       </div>
                     </div>
                     <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white">Design Strike</span>
                        <span className="text-[10px] text-white/40">3 online • Typing...</span>
                     </div>
                  </div>
                  <MessageCircle size={14} className="text-white/30 group-hover:text-white/80 transition-colors" />
               </div>

               <div className="flex flex-col gap-2 mt-4 text-left">
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest pl-1 lg:pl-2">Pinned Channels</span>
                  {[
                    { icon: Hash, name: "deployments", alert: true },
                    { icon: Lock, name: "exec-lounge", alert: false },
                  ].map((ch, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                      <ch.icon size={14} className="text-white/40" />
                      <span className="text-xs font-medium text-white/70">{ch.name}</span>
                      {ch.alert && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  ))}
               </div>
             </div>
          </HeroCard>

          {/* Card 2: Development & Chat (Center, Brought Forward) */}
          <HeroCard initialRotate={0} initialX={0} initialY={0} hoverX={0} className="relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10 bg-[#070b14]/70 backdrop-blur-2xl ring-1 ring-white/10 scale-[1.05]">
             <div className="pb-3 border-b border-white/5 flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                   <Hash size={14} className="text-white/40" />
                   <span className="text-xs font-semibold text-white/90">trip-planning</span>
                </div>
                <div className="flex -space-x-1.5">
                   {['1535713875002-d1d0cf377fde', '1599566150163-29194dcaad36', '1438761681033-6461ffad8d80'].map((id, i) => (
                     <img key={i} src={`https://images.unsplash.com/photo-${id}?w=100&h=100&fit=crop`} alt="User avatar" className="h-5 w-5 rounded-full border border-black/40 object-cover shadow-sm flex-shrink-0" />
                   ))}
                </div>
             </div>
             
             <div className="space-y-5 flex-grow text-left">
                <div className="flex gap-3">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Sarah" className="w-7 h-7 rounded-md object-cover border border-white/10 mt-1 shadow-sm" />
                   <div className="flex flex-col gap-1.5 w-full pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-white">Sarah</span>
                        <span className="text-[9px] text-white/30">1m</span>
                      </div>
                      <p className="text-[12px] text-slate-300 leading-snug">Just booked the flights to Tokyo! 🗼 We leave on the 14th.</p>
                      <div className="mt-1 flex items-center gap-2">
                         <div className="px-2 py-1 rounded bg-white/5 border border-white/10 flex items-center gap-1.5 text-[10px] text-white/60">
                            <CheckCircle size={10} className="text-green-400" /> Itinerary.pdf
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3 mt-4">
                   <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="Alex" className="w-7 h-7 rounded-md object-cover border border-white/10 mt-1 shadow-sm" />
                   <div className="flex flex-col gap-1.5 w-full pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-white">Alex</span>
                        <span className="text-[9px] text-white/30">Just now</span>
                      </div>
                      <p className="text-[12px] text-slate-300 leading-snug">Amazing! I'll look into reserving the Bullet Train passes for us. 🚄</p>
                   </div>
                </div>
             </div>
             <div className="mt-5 pt-4 border-t border-white/5">
                <div className="h-10 bg-black/30 border border-white/10 rounded-xl px-4 flex items-center justify-between shadow-inner">
                   <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Type a message...</span>
                   <div className="px-2 py-1 flex items-center gap-1 rounded bg-white/5 border border-white/10 text-[9px] text-white/40 font-mono">
                      <span>⌘</span><span>↵</span>
                   </div>
                </div>
             </div>
          </HeroCard>

          {/* Card 3: Picture Sharing (Right, Pushed Back) */}
          <HeroCard initialRotate={9} initialX={140} initialY={50} hoverX={40} className="absolute right-[5%] lg:right-[10%] shadow-xl bg-white/[0.02] backdrop-blur-2xl border-white/5 ring-1 ring-white/10">
             <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                   <Hash size={14} className="text-white/40" />
                   <span className="text-xs font-semibold text-white/90">weekend-crew</span>
                </div>
             </div>
             
             <div className="flex flex-col gap-3 flex-grow text-left">
                <div className="flex items-start gap-2">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Marcus" className="h-6 w-6 rounded-full object-cover border border-white/10 mt-0.5" />
                   <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-white">Marcus</span>
                      <span className="text-[10px] text-white/50">Look who joined the office today! 🐶</span>
                   </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden border border-white/10 mt-1 shadow-lg group cursor-pointer">
                   <img src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&h=300&fit=crop" alt="Golden Retriever" className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute bottom-2 left-2 flex gap-1.5">
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-black/80 transition-colors">
                         <Heart size={10} className="text-red-400 fill-red-400" />
                         <span className="text-[9px] font-bold text-white">12</span>
                      </div>
                      <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-1.5 hover:bg-black/80 transition-colors">
                         <Smile size={10} className="text-yellow-400 fill-yellow-400" />
                         <span className="text-[9px] font-bold text-white">4</span>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 mt-2 py-2 border-t border-white/5 border-dashed">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Sarah" className="w-6 h-6 rounded-full object-cover border border-white/10 mt-0.5" />
                   <div className="flex flex-col gap-0.5 w-full">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-white">Sarah</span>
                        <span className="text-[8px] text-white/30">1m</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">Omg so cute! What's his name? 😍</p>
                   </div>
                </div>
             </div>
          </HeroCard>

        </motion.div>
      </div>
    </section>
  );
};
