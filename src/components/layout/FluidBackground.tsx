import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

interface FluidBackgroundProps {
  isStatic?: boolean;
  variant?: 'default' | 'settings';
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ isStatic = false }) => {
  const theme = useAppStore((state) => state.theme);
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  const isForcedDark = location.pathname === '/' || location.pathname === '/contact' || location.pathname === '/docs' || location.pathname === '/integrations' || location.pathname === '/about' || location.pathname === '/privacy' || location.pathname === '/terms';
  const effectiveTheme = isForcedDark ? 'dark' : theme;
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
    restDelta: 0.001
  });

  const blobs = [
    { bg: '#4338CA', duration: 25, delay: 0, w: '60vw', h: '60vh', top: '10%', left: '15%', staticX: '5vw', staticY: '-5vh', scrollFactorX: -300, scrollFactorY: 450 },
    { bg: '#581C87', duration: 30, delay: 2, w: '70vw', h: '70vh', top: '30%', left: '40%', staticX: '10vw', staticY: '5vh', scrollFactorX: 360, scrollFactorY: -300 },
    { bg: '#06B6D4', duration: 20, delay: 5, w: '50vw', h: '50vh', top: '40%', left: '0%', staticX: '-10vw', staticY: '10vh', scrollFactorX: -450, scrollFactorY: 240 },
    { bg: '#1E3A8A', duration: 35, delay: 8, w: '80vw', h: '80vh', top: '-10%', left: '50%', staticX: '15vw', staticY: '-15vh', scrollFactorX: 240, scrollFactorY: -540 },
    { bg: '#38BDF8', duration: 18, delay: 4, w: '40vw', h: '40vh', top: '60%', left: '70%', staticX: '20vw', staticY: '20vh', scrollFactorX: 600, scrollFactorY: 300 },
  ];

  const lightX = useTransform(smoothProgress, [0, 1], [0, 100]);
  const lightY = useTransform(smoothProgress, [0, 1], [0, -50]);

  const scrollTransforms = [
    { x: useTransform(smoothProgress, [0, 1], [0, blobs[0].scrollFactorX]), y: useTransform(smoothProgress, [0, 1], [0, blobs[0].scrollFactorY]), rotate: useTransform(smoothProgress, [0, 1], [0, 45]) },
    { x: useTransform(smoothProgress, [0, 1], [0, blobs[1].scrollFactorX]), y: useTransform(smoothProgress, [0, 1], [0, blobs[1].scrollFactorY]), rotate: useTransform(smoothProgress, [0, 1], [0, 45]) },
    { x: useTransform(smoothProgress, [0, 1], [0, blobs[2].scrollFactorX]), y: useTransform(smoothProgress, [0, 1], [0, blobs[2].scrollFactorY]), rotate: useTransform(smoothProgress, [0, 1], [0, 45]) },
    { x: useTransform(smoothProgress, [0, 1], [0, blobs[3].scrollFactorX]), y: useTransform(smoothProgress, [0, 1], [0, blobs[3].scrollFactorY]), rotate: useTransform(smoothProgress, [0, 1], [0, 45]) },
    { x: useTransform(smoothProgress, [0, 1], [0, blobs[4].scrollFactorX]), y: useTransform(smoothProgress, [0, 1], [0, blobs[4].scrollFactorY]), rotate: useTransform(smoothProgress, [0, 1], [0, 45]) },
  ];

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background pointer-events-none">
      {/* 
        PREMIUM BLUE FADE (Off-White Only) 
        Now completely static. No fade-in, no movement.
      */}
      {effectiveTheme === 'offwhite' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary Blue/Indigo Fade - High Contrast Blend */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(210deg, rgba(79, 70, 229, 0.4) 0%, transparent 60%, rgba(14, 165, 233, 0.35) 100%)',
              mixBlendMode: 'multiply',
              opacity: 0.6
            }}
          />
          
          {/* Static Floating Blue Shades - Vivid Radial Gradients */}
          <div 
            className="absolute top-[-40%] right-[-30%] w-[130vw] h-[130vh] rounded-full blur-[100px]"
            style={{
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.45) 0%, transparent 70%)',
              mixBlendMode: 'soft-light'
            }}
          />

          <div 
            className="absolute bottom-[-40%] left-[-30%] w-[120vw] h-[120vh] rounded-full blur-[100px]"
            style={{
              background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
              mixBlendMode: 'soft-light'
            }}
          />
        </div>
      )}

      {!isStatic && (
        <>
          {/* 1. Global Directional Light */}
          <motion.div
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[120px]"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              x: lightX,
              y: lightY,
              opacity: effectiveTheme === 'dark' ? 0.25 : 0,
            }}
          />

          {/* 2. Liquid Blobs (Hidden in Off-White) */}
          <div className="absolute inset-0">
            {blobs.map((blob, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{ 
                  backgroundColor: blob.bg,
                  width: blob.w,
                  height: blob.h,
                  top: blob.top,
                  left: blob.left,
                  opacity: effectiveTheme === 'dark' ? 0.75 : 0,
                  translateX: scrollTransforms[i].x,
                  translateY: scrollTransforms[i].y,
                  rotate: scrollTransforms[i].rotate,
                  filter: 'blur(40px)',
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
          
          {/* 3. Global Frosted Glass Finish */}
          <div 
            className="absolute inset-0 transition-colors duration-1000" 
            style={{ 
              backgroundColor: effectiveTheme === 'offwhite' 
                ? 'rgba(216, 219, 224, 0.7)' 
                : 'rgba(1, 2, 4, 0.8)' 
            }} 
          />
        </>
      )}

      {/* Fine Grain Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
