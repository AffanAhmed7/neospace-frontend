import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const CTA: React.FC = () => {
  const { setAuthModal } = useAppStore();

  return (
    <section className="pt-0 pb-20 relative overflow-hidden text-center">
      {/* Subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] bg-indigo-500/5 blur-[80px] -z-10 rounded-full" />

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          {/* Reduced weight to font-semibold and smaller tracking */}
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight uppercase leading-tight text-white/80 text-center"
          >
            What are you
            <br />
            waiting for?
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthModal(true, 'signup')}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold uppercase tracking-tight hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <span className="text-xs">Get started</span>
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform opacity-70"
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
