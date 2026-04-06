import React from 'react';
import { motion } from 'framer-motion';

interface FeatureSectionProps {
  id?: string;
  title: string;
  description: string;
  imageAlt: string;
  reverse?: boolean;
  children?: React.ReactNode;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  id,
  title,
  description,
  imageAlt,
  reverse = false,
  children
}) => {
  return (
    <section id={id} className="feature-section">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Text Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: "easeOut" }}
           className={`flex flex-col gap-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
           style={{ willChange: "transform, opacity" }}
        >
          <h2 className="feature-title">
            {title}
          </h2>
          <p className="feature-desc">
            {description}
          </p>
        </motion.div>

        {/* Visual Content (Children) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.98, y: 20 }}
           whileInView={{ opacity: 1, scale: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
           className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
           style={{ willChange: "transform, opacity" }}
           aria-label={imageAlt}
        >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="feature-visual-wrapper"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 -z-10" />
                {children}
            </motion.div>

            {/* Decorative background blur */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -top-10 ${reverse ? '-right-10' : '-left-10'} w-72 h-72 bg-primary/10 rounded-full blur-[80px] -z-10`}
            />
        </motion.div>
      </div>
    </section>
  );
};
