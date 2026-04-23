import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { 
  Puzzle, ArrowRight, MessageSquare, Hash, Users, 
  Bell, Search, Pin, Shield, Send, Smile, 
  UserPlus, Eye, Lock, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Real-Time Messaging',
    description: 'High-performance delivery backbone with millisecond latency. Every message is prioritized and distributed for instant interaction.',
    icon: MessageSquare,
    span: 'col-span-2 row-span-2',
    color: 'border-blue-500/30 bg-blue-500/10 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]',
  },
  {
    name: 'Logic Channels',
    description: 'Topic isolation for elite teams.',
    icon: Hash,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Branch Threads',
    description: 'Deep context preservation.',
    icon: Send,
    span: 'col-span-1 row-span-1',
    color: 'border-rose-500/20 bg-rose-500/5',
  },
  {
    name: 'Identity Layer',
    description: 'User verification & presence.',
    icon: UserPlus,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Privacy Core',
    description: 'Zero-trust architecture with total encryption.',
    icon: Shield,
    span: 'col-span-1 row-span-1',
    color: 'border-amber-500/30 bg-amber-500/10 shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]',
  },
  {
    name: 'Development API',
    description: 'Build custom automation and workflows with our real-time SDK.',
    icon: Puzzle,
    span: 'col-span-2 row-span-1',
    color: 'border-indigo-500/20 bg-indigo-500/5',
  },
  {
    name: 'Social Directs',
    description: 'Encrypted P2P tunnels.',
    icon: Lock,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Smart Alerts',
    description: 'AI-driven notifications.',
    icon: Bell,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Global Search',
    description: 'Instant indexing across nodes.',
    icon: Search,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Reactions',
    description: 'Tokenized emotional feedback.',
    icon: Smile,
    span: 'col-span-1 row-span-1',
    color: 'border-rose-500/20 bg-rose-500/5',
  },
  {
    name: 'Pulse Discovery',
    description: 'Collective consciousness.',
    icon: Users,
    span: 'col-span-1 row-span-1',
  },
  {
    name: 'Pinned State',
    description: 'Persistence for critical data.',
    icon: Pin,
    span: 'col-span-1 row-span-1',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const IntegrationsPage: React.FC = () => {
  return (
    <div className="landing-wrapper px-2 sm:px-0">
      <Navbar />

      <main className="pt-24 lg:pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Feature <span className="text-primary italic">Architecture</span>
            </h1>
            <p className="text-sm md:text-lg text-foreground/50 max-w-xl leading-relaxed font-medium">
              A high-fidelity communication stack, engineered for teams that value absolute performance and clarity.
            </p>
          </motion.div>
        </section>

        {/* The Universal Mondrian Matrix */}
        <section className="max-w-6xl mx-auto px-2 sm:px-6">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-4 auto-rows-fr gap-2 lg:gap-4 lg:aspect-square"
          >
            {features.map((feat) => (
              <motion.div
                key={feat.name}
                variants={item}
                className={`group p-3 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-white/10 bg-card/10 backdrop-blur-3xl hover:border-white/30 transition-all duration-500 flex flex-col items-center justify-center text-center gap-2 sm:gap-6 cursor-default relative overflow-hidden ${feat.span || ''} ${feat.color || ''}`}
              >
                {/* Visual Accent Layer */}
                <div className="absolute top-0 right-0 w-16 sm:w-32 h-16 sm:h-32 bg-white/5 blur-[20px] sm:blur-[40px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none group-hover:bg-white/10 transition-colors" />

                {/* Icon */}
                <div className="h-8 w-8 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500 shadow-lg shrink-0">
                  <feat.icon className="w-4 h-4 sm:w-6 sm:h-6" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center max-w-[280px]">
                  <h3 className="text-[9px] sm:text-lg lg:text-xl font-bold text-foreground mb-0.5 sm:mb-2 tracking-tight group-hover:text-primary transition-colors leading-tight">{feat.name}</h3>
                  <p className="hidden sm:block text-sm lg:text-[15px] text-foreground/45 leading-relaxed font-medium group-hover:text-foreground/60 transition-colors">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer spacer */}
        <div className="h-12" />
      </main>

      <Footer />
    </div>
  );
};
