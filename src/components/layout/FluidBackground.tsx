import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface FluidBackgroundProps {
  isStatic?: boolean;
  variant?: 'default' | 'settings';
}

export const FluidBackground: React.FC<FluidBackgroundProps> = ({ isStatic = false, variant = 'default' }) => {
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

  type BlobData = typeof blobs[0];

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

  const getStaticPos = (blob: BlobData) => {
    if (variant === 'settings') {
      return {
        x: `calc(${blob.staticX} + 10vw)`,
        y: `calc(${blob.staticY} - 10vh)`,
        scale: 1.1,
        rotate: 15
      };
    }
    return {
      x: blob.staticX,
      y: blob.staticY,
      scale: 1,
      rotate: 0
    };
  };

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#010204] pointer-events-none">
      

      {/* 1. Global Directional Light (Top-Left) */}
      <motion.div
        animate={isStatic ? { opacity: 0.25, scale: 1.05 } : {
          opacity: 0.25,
          scale: 1,
        }}
        transition={isStatic ? { duration: 0.5 } : { duration: 0 }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[120px]"
        style={{ 
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          mixBlendMode: 'screen',
          // Interactive light shift with scroll
          x: !isStatic ? lightX : undefined,
          y: !isStatic ? lightY : undefined,
          willChange: !isStatic ? 'transform' : 'auto',
        }}
      />

      {/* 2. Liquid Blobs */}
      <div className="absolute inset-0">
        {blobs.map((blob, i) => (
          <motion.div
            key={i}
            animate={isStatic ? getStaticPos(blob) : {
              x: blob.staticX,
              y: blob.staticY,
              scale: 1,
            }}
            transition={isStatic ? { duration: 0.8, ease: "easeOut" } : { duration: 0 }}
            className="absolute rounded-full"
            style={{ 
              backgroundColor: blob.bg,
              width: blob.w,
              height: blob.h,
              top: blob.top,
              left: blob.left,
              opacity: isStatic ? 0.6 : 0.75,
              // Add scroll-driven transforms on top of the base animation
              translateX: !isStatic ? scrollTransforms[i].x : undefined,
              translateY: !isStatic ? scrollTransforms[i].y : undefined,
              rotate: !isStatic ? scrollTransforms[i].rotate : undefined,
              // Hardware-accelerated CSS blur instead of expensive SVG gooey filter
              filter: 'blur(40px)',
              // Force composite layers for buttery smooth 60fps scrolling
              willChange: !isStatic ? 'transform' : 'auto',
            }}
          />
        ))}
      </div>

      {/* 3. Global Frosted Glass Finish */}
      <div className="absolute inset-0 backdrop-blur-[25px] bg-[#010204]/45" />
      
      {/* 4. Fine Grain Texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

    </div>
  );
};
