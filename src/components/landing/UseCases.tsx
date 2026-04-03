import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, Globe, CheckCircle2 } from 'lucide-react';

const useCases = [
  {
    title: 'Teams',
    description: 'Coordinate work clearly. Stop drowning in email and fragmented chats. Unite every project in one place.',
    icon: Users,
    color: 'primary',
    points: ['Project channels', 'Threaded feedback', 'Priority mentions']
  },
  {
    title: 'Developers',
    description: 'Discuss code without clutter. Integration-first approach with code snippets and real-time review support.',
    icon: Code,
    color: 'secondary',
    points: ['Code formatting', 'PR notifications', 'Terminal integration']
  },
  {
    title: 'Communities',
    description: 'Keep conversations structured. Scaling beyond simple chat to organized repositories of community knowledge.',
    icon: Globe,
    color: 'accent',
    points: ['Self-serve onboarding', 'Public archives', 'Robust moderation']
  }
];

export const UseCases: React.FC = () => {
  return (
    <section id="use-cases" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 text-center">
             Built for <span className="text-primary italic">everyone</span> who builds.
          </h2>
          <p className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium">
             NeoPlane scales from two-person startups to global organizations without losing speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {useCases.map((useCase, index) => (
             <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="use-case-card"
             >
                <div className={`use-case-icon text-${useCase.color}`}>
                   <useCase.icon size={32} />
                </div>
                <div className="text-left">
                   <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{useCase.title}</h3>
                   <p className="text-base text-foreground/50 leading-relaxed font-medium">
                      {useCase.description}
                   </p>
                </div>

                <div className="flex flex-col gap-3 mt-auto pt-4 text-left">
                   {useCase.points.map((point) => (
                      <div key={point} className="flex items-center gap-3">
                         <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <CheckCircle2 size={12} />
                         </div>
                         <span className="text-sm font-bold text-foreground/70">{point}</span>
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
