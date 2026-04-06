import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Globe, CheckCircle2 } from 'lucide-react';

const useCases = [
  {
    title: 'Friend Groups',
    description: 'Your group chat, finally grown up. Plan trips, share photos, and actually stay in the loop — no more "wait what did I miss?"',
    icon: Users,
    color: 'primary',
    points: ['Trip planning channels', 'Photo and media sharing', 'Reactions and inside jokes']
  },
  {
    title: 'Work Squads',
    description: 'Get things done without the chaos. Keep projects, updates, and quick pings in one place — not scattered across five different apps.',
    icon: Briefcase,
    color: 'secondary',
    points: ['Dedicated project channels', 'Threaded discussions', 'File and link sharing']
  },
  {
    title: 'Communities',
    description: 'Build something bigger than a group chat. Whether it\'s a fan club or a creative collective, keep everyone in the know.',
    icon: Globe,
    color: 'accent',
    points: ['Public and private channels', 'Pinned announcements', 'Easy member onboarding']
  }
];

export const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 text-center">
            Made for <span className="text-primary italic">everyone</span>, really.
          </h2>
          <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium">
            Whether you're planning a trip with friends or shipping a product with your team — NeoPlane just fits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {useCases.map((useCase, index) => (
             <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="use-case-card"
                style={{ willChange: "transform, opacity" }}
             >
                <div className={`use-case-icon text-${useCase.color}`}>
                   <useCase.icon size={32} />
                </div>
                <div className="text-left">
                   <h3 className="text-2xl font-bold text-foreground mb-3">{useCase.title}</h3>
                   <p className="text-base text-foreground/50 leading-relaxed font-medium">
                      {useCase.description}
                   </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-4 text-left">
                   {useCase.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                         <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                            <CheckCircle2 size={12} />
                         </div>
                         <span className="text-sm font-semibold text-foreground/70">{point}</span>
                      </div>
                   ))}
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
