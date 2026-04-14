import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface FluidBackgroundProps {
  isStatic?: boolean;
  variant?: 'default' | 'settings';
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ isStatic = false }) => {
  // Track scroll position for the interactive parallax effect
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress for a more "liquid" feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 40,
    restDelta: 0.001
  });

  // Common blob data
  const blobs = [
    { bg: '#4338CA', duration: 25, delay: 0, w: '60vw', h: '60vh', top: '10%', left: '15%', staticX: '5vw', staticY: '-5vh', scrollFactorX: -300, scrollFactorY: 450 },
    { bg: '#581C87', duration: 30, delay: 2, w: '70vw', h: '70vh', top: '30%', left: '40%', staticX: '10vw', staticY: '5vh', scrollFactorX: 360, scrollFactorY: -300 },
    { bg: '#06B6D4', duration: 20, delay: 5, w: '50vw', h: '50vh', top: '40%', left: '0%', staticX: '-10vw', staticY: '10vh', scrollFactorX: -450, scrollFactorY: 240 },
    { bg: '#1E3A8A', duration: 35, delay: 8, w: '80vw', h: '80vh', top: '-10%', left: '50%', staticX: '15vw', staticY: '-15vh', scrollFactorX: 240, scrollFactorY: -540 },
    { bg: '#38BDF8', duration: 18, delay: 4, w: '40vw', h: '40vh', top: '60%', left: '70%', staticX: '20vw', staticY: '20vh', scrollFactorX: 600, scrollFactorY: 300 },
  ];

  // Call hooks unconditionally to satisfy ESLint
  const lightX = useTransform(smoothProgress, [0, 1], [0, 100]);
  const lightY = useTransform(smoothProgress, [0, 1], [0, -50]);

  // Expand map to avoid hooks inside callbacks
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
        Conditionally render effects based on static mode.
        When isStatic is true (the app area), we skip gradients and blobs.
      */}
      {!isStatic && (
        <>
          {/* 1. Global Directional Light (Top-Left) */}
          <motion.div
            animate={{ opacity: 0.25, scale: 1 }}
            className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[120px]"
            style={{ 
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
              mixBlendMode: 'screen',
              x: lightX,
              y: lightY,
            }}
          />

          {/* 2. Liquid Blobs */}
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
                  opacity: 0.75,
                  translateX: scrollTransforms[i].x,
                  translateY: scrollTransforms[i].y,
                  rotate: scrollTransforms[i].rotate,
                  filter: 'blur(40px)',
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
          
          {/* Global Frosted Glass Finish */}
          <div className="absolute inset-0 bg-[#010204]/80" />
          
          {/* Fine Grain Texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </>
      )}
    </div>
  );
};
