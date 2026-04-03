import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Plane } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/20 blur-[150px] -z-10 rounded-full" />
      
      <div className="cta-wrapper">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="h-20 w-20 bg-primary rounded-[30px] flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-primary/25">
             <Plane size={40} />
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-center">
             Start your <span className="text-primary italic">workspace</span> today.
          </h2>
          <p className="text-xl text-foreground/50 mb-12 max-w-xl mx-auto font-medium text-center">
             Bring your team together in a place where work feels effortless.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Button variant="primary" className="rounded-2xl h-16 px-10 text-xl font-bold group shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
                Get Started for Free
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </Button>
             <div className="text-sm font-bold text-foreground/40 border-b border-border pb-1 hover:text-foreground/60 transition-colors cursor-pointer">
                Contact Sales
             </div>
          </div>
          <p className="mt-8 text-sm text-foreground/30 font-medium text-center">
             No credit card required • Unlimited users • Self-serve
          </p>
        </motion.div>
      </div>
    </section>
  );
};
