import React from 'react';
import { motion } from 'framer-motion';

export const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#010204] pointer-events-none">
      
      {/* SVG filter for gooey effect */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -20" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* 1. Global Directional Light (Top-Left) */}
      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[100px]"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* 2. Liquid Blobs with Goo Filter */}
      <div className="absolute inset-0" style={{ filter: 'url(#goo)' }}>
        {[
          // Primary Indigo Blob
          { bg: '#4338CA', duration: 25, delay: 0, w: '60vw', h: '60vh', top: '10%', left: '15%' },
          // Deep Purple Blob
          { bg: '#581C87', duration: 30, delay: 2, w: '70vw', h: '70vh', top: '30%', left: '40%' },
          // Bright Cyan Blob (for intense contrast)
          { bg: '#06B6D4', duration: 20, delay: 5, w: '50vw', h: '50vh', top: '40%', left: '0%' },
          // Royal Blue Blob
          { bg: '#1E3A8A', duration: 35, delay: 8, w: '80vw', h: '80vh', top: '-10%', left: '50%' },
          // Extra accent glow
          { bg: '#38BDF8', duration: 18, delay: 4, w: '40vw', h: '40vh', top: '60%', left: '70%' },
        ].map((blob, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['0vw', '25vw', '-25vw', '0vw'],
              y: ['0vh', '-25vh', '25vh', '0vh'],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: blob.duration,
              delay: blob.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full"
            style={{ 
              backgroundColor: blob.bg,
              width: blob.w,
              height: blob.h,
              top: blob.top,
              left: blob.left,
              opacity: 0.75
            }}
          />
        ))}
      </div>

      {/* 3. Global Frosted Glass Finish to create glassmorphism */}
      <div className="absolute inset-0 backdrop-blur-[20px] bg-[#010204]/40" />
      
      {/* 4. Fine Grain Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

    </div>
  );
};
