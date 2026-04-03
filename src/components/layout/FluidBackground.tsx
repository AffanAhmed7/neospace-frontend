import React from 'react';
import { motion } from 'framer-motion';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#02040f] pointer-events-none">
      
      {/* 1. Global Directional Light (Top-Left) */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full blur-[120px]"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.5) 0%, transparent 70%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 2. PURE CSS Liquid Blobs - Massive Distances, No SVG Dependency */}
      <div className="absolute inset-0">
        {[
          // Vibrant Indigo
          { bg: 'radial-gradient(circle, rgba(67, 56, 202, 0.8) 0%, transparent 60%)', duration: 15, delay: 0, w: '80vw', h: '80vh', top: '10%', left: '10%' },
          // Deep Purple
          { bg: 'radial-gradient(circle, rgba(46, 16, 101, 0.9) 0%, transparent 60%)', duration: 18, delay: 2, w: '70vw', h: '70vh', top: '40%', left: '50%' },
          // Bright Cyan (for intense contrast)
          { bg: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 60%)', duration: 12, delay: 5, w: '90vw', h: '90vh', top: '50%', left: '-10%' },
          // Royal Blue
          { bg: 'radial-gradient(circle, rgba(30, 58, 138, 0.8) 0%, transparent 60%)', duration: 20, delay: 8, w: '60vw', h: '60vh', top: '-10%', left: '60%' },
        ].map((blob, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['0vw', '25vw', '-25vw', '0vw'],
              y: ['0vh', '-25vh', '25vh', '0vh'],
              scale: [1, 1.5, 0.8, 1],
            }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full mix-blend-screen blur-[80px]"
            style={{ 
              background: blob.bg,
              width: blob.w,
              height: blob.h,
              top: blob.top,
              left: blob.left,
            }}
          />
        ))}
      </div>

      {/* 3. Global Frosted Glass Finish */}
      <div className="absolute inset-0 backdrop-blur-[20px] bg-[#02040f]/20" />
      
      {/* 4. Fine Grain Texture */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

    </div>
  );
};
